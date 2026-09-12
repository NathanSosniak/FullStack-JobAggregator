import psycopg
import os
from dotenv import load_dotenv

load_dotenv()

connection = psycopg.connect(
    host="localhost",
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("PORT_DB"),
)

cursor = connection.cursor()

# j'ajoute le nombre d'offres de chaque entreprise
sql_nb_offre = """
    UPDATE entreprise
    SET nb_offre = stats.nb
    FROM (
        SELECT id_entreprise, COUNT(*) AS nb
        FROM poste
        GROUP BY poste.id_entreprise
    ) stats
    WHERE entreprise.id_entreprise = stats.id_entreprise;
"""

cursor.execute(sql_nb_offre)

# j'ajoute le nombre de visites de chaque entreprise
sql_nb_visit = """
    UPDATE entreprise
    SET nb_visit = stats.nb
    FROM (
        SELECT id_entreprise, SUM(total_visits) AS nb
        FROM poste
        GROUP BY poste.id_entreprise
    ) stats
    WHERE entreprise.id_entreprise = stats.id_entreprise;
"""

cursor.execute(sql_nb_visit)

# j'ajoute le nombre de postulations de chaque entreprise
sql_nb_postulation = """
    UPDATE entreprise
    SET nb_postulation = stats.nb
    FROM (
        SELECT id_entreprise, SUM(nb_postulations) AS nb
        FROM poste
        GROUP BY poste.id_entreprise
    ) stats
    WHERE entreprise.id_entreprise = stats.id_entreprise;
"""

cursor.execute(sql_nb_postulation)

# j'ajoute le nombre de clicks de chaque entreprise
sql_nb_click = """
    UPDATE entreprise
    SET nb_click = stats.nb
    FROM (
        SELECT id_entreprise, SUM(nb_clicks) AS nb
        FROM poste
        GROUP BY poste.id_entreprise
    ) stats
    WHERE entreprise.id_entreprise = stats.id_entreprise;
"""

cursor.execute(sql_nb_click)

connection.commit()
print("données insérées")

cursor.close()
connection.close()
