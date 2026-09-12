from jsonpath_ng import parse
import json
import psycopg
from dotenv import load_dotenv
import os
import datetime


def Insert_Data_entreprise(value):
    """
    Fonction qui a pour but d'inserer les donnees des entreprise dans la db entreprise.

    La fonction prend en parametre `value`, value est issu de la fonction Entreprise_Into_DB.

    La fonction ne renvoie rien sauf si erreur, elle ajoute simplement dans la db.
    """
    load_dotenv()
    sql = """INSERT INTO entreprise (type_contrat, nom_compagnie, seo_alias, type_entreprise, secteur_entreprise, ville) VALUES (%s, %s, %s, %s, %s, %s)"""
    data = (
        value.get("contractTypes"),
        value.get("companyName"),
        value.get("seo_alias"),
        value.get("companyTypeExplicit"),
        value.get("sectors"),
        value.get("formattedPlaces"),
    )

    try:
        conn = psycopg.connect(
            host="localhost",
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
        )

        with conn:
            with conn.cursor() as cur:
                cur.execute(sql, data)
                print("1 row inserted successfully.")
    except Exception as e:
        print(f"Error: {e}")


def Entreprise_Into_DB():
    """
    Fonction qui a pour but d'aller chercher dans le json issu de l'api les parametre interessant en vue de les remplir dans la base de donnees

    Ne prend pas de parametre

    Ne renvoie rien mais insert directement dans la db entreprise les informations sans doublon
    """

    # Récupère le dossier où se trouve le script Add_API_DB.py
    base_path = os.path.dirname(os.path.abspath(__file__))
    # Construit le chemin complet vers Data.json
    json_path = os.path.join(base_path, "PreProcces.json")

    nameVU = []
    Parametre_garder_entreprise = [
        "companyId",
        "contractTypes",
        "seoAlias",
        "companyName",
        "companyTypeExplicit",
        "sectors",
        "_geoloc",
        "formattedPlaces",
    ]
    with open(json_path, "r") as json_file:
        donnee = json.load(json_file)
        for entreprise in donnee:
            infos_entreprise = {}
            for parametre in Parametre_garder_entreprise:
                expr = parse(f"$..{parametre}")
                matches = expr.find(entreprise)
                if matches:
                    infos_entreprise[parametre] = matches[0].value
                else:
                    infos_entreprise[parametre] = None

            if infos_entreprise.get("companyName") not in nameVU:
                Insert_Data_entreprise(infos_entreprise)
                nameVU.append(infos_entreprise.get("companyName"))


# Entreprise_Into_DB()


def get_entreprise_id(company_name):
    """
    Fonction intermediaire qui permet de recuperer l'id d'une entreprise avec son nom, cela permet de s'en servir pour la cle etrangere dans la table poste

    Prend en parametre campany_name qui est le nom d'une company

    Return l'id de l'entreprise en fonction du nom
    """
    load_dotenv()
    try:
        conn = psycopg.connect(
            host="localhost",
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
        )
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id_entreprise FROM entreprise WHERE nom_compagnie = %s",
                    (company_name,),
                )
                row = cur.fetchone()
                return row[0] if row else None
    except Exception as e:
        print("Error get_entreprise_id:", e)
        return None


def Insert_Data_poste(value):
    """
    Fonction qui permet d'inserer les postes dans la table Poste

    Prend en parametre value, un json trie contenant toute les inforamtions des postes

    Ne return rien mais va ajouter dans la base de donnees les poste un a un
    """
    load_dotenv()
    sql = """
    INSERT INTO poste (
        id_entreprise, type_contrat, date_creation, description, langues,
        remote_policy, frequency_remote, annee_experience, salaire_currency,
        salaire_min, salaire_max, recurrence, date_publication, categorie,
        display_name_en, display_name_fr, latitude, longitude, skills,
        titre, ranking, nb_postulations, nb_clicks, candidature_ats,
        ctr, total_applications, nb_remote_applications, total_visits
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    geoloc = value.get("_geoloc", [])
    lat = geoloc[0].get("lat") if geoloc else None
    lng = geoloc[0].get("lng") if geoloc else None
    Id_entreprise = get_entreprise_id(value.get("companyName"))

    CreateAt = value.get("createdAt")
    PublishDate = value.get("publishDate")
    created_at_dt = (
        datetime.datetime.fromtimestamp(CreateAt / 1000000.0) if CreateAt else None
    )
    publish_date_dt = (
        datetime.datetime.fromtimestamp(PublishDate / 1000000.0)
        if PublishDate
        else None
    )

    contract_types = value.get("contractTypes")
    contrat = contract_types[0] if contract_types else None

    data = (
        Id_entreprise,
        contrat,
        created_at_dt,
        value.get("descriptionPreview"),
        value.get("locale"),
        value.get("daysPerWeek"),
        value.get("frequency"),
        value.get("requiredExperience"),
        value.get("currency"),
        value.get("min"),
        value.get("max"),
        value.get("recurrence"),
        publish_date_dt,
        value.get("algoliaKeyword"),
        value.get("displayName"),
        value.get("displayName"),
        lat,
        lng,
        json.dumps(value.get("skillsList")),
        value.get("title"),
        value.get("ranking"),
        value.get("applications"),
        value.get("applyBtnClicks"),
        value.get("atsApplications"),
        value.get("ctr"),
        value.get("totalApplications"),
        value.get("remoteApplications"),
        value.get("visitsCount"),
    )

    try:
        conn = psycopg.connect(
            host="localhost",
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            port=os.getenv("DB_PORT"),
        )

        with conn:
            with conn.cursor() as cur:
                cur.execute(sql, data)
    except Exception as e:
        print(f"Error sur job {value.get('title')} : {e}")
        return


def Poste_Into_DB():
    """
    Fonction qui permet de recuperer uniquement les elements utile pour la requete sql

    Ne prend pas de parametre

    Ne return rien mais appelle la fonction Insert_Data_poste avec les infos selectionner
    """

    # Récupère le dossier où se trouve le script Add_API_DB.py
    base_path = os.path.dirname(os.path.abspath(__file__))
    # Construit le chemin complet vers Data.json
    json_path = os.path.join(base_path, "PreProcces.json")

    Parametre_garder_poste = [
        "id",
        "companyName",
        "contractTypes",
        "contracts",
        "createdAt",
        "descriptionPreview",
        "_geoloc",
        "locale",
        "daysPerWeek",
        "locale",
        "frequency",
        "requiredExperience",
        "currency",
        "max",
        "min",
        "recurrence",
        "publishDate",
        "algoliaKeyword",
        "displayName",
        "displayName",
        "skillsList",
        "title",
        "ranking",
        "applications",
        "applyBtnClicks",
        "atsApplications",
        "ctr",
        "totalApplications",
        "remoteApplications",
        "visitsCount",
    ]
    with open(json_path, "r") as json_file:
        donnee = json.load(json_file)
        for job in donnee:
            infos_entreprise = {}

            for parametre in Parametre_garder_poste:
                expr = parse(f"$..{parametre}")
                matches = expr.find(job)

                if matches:
                    infos_entreprise[parametre] = matches[0].value
                else:
                    infos_entreprise[parametre] = None

            Insert_Data_poste(infos_entreprise)


# Poste_Into_DB()
