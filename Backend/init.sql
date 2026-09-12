CREATE TABLE entreprise (
    id_entreprise INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type_contrat TEXT[],
    nom_compagnie TEXT UNIQUE,
    seo_alias TEXT,
    logo TEXT,
    type_entreprise TEXT,
    secteur_entreprise TEXT[],
    ville TEXT,
    nb_offre INT,
    nb_visit INT,
    nb_postulation INT,
    nb_click INT,
    score DOUBLE PRECISION,
    rank INT
);




CREATE TABLE poste (
    id_poste INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_entreprise INT REFERENCES entreprise(id_entreprise) ON DELETE CASCADE,
    type_contrat TEXT,
    date_creation TIMESTAMP WITH TIME ZONE,
    description TEXT,
    langues TEXT,
    remote_policy INT,
    frequency_remote TEXT,
    annee_experience INT,
    salaire_currency TEXT,
    salaire_min INT,
    salaire_max INT,
    recurrence TEXT,
    date_publication TIMESTAMP WITH TIME ZONE,
    categorie TEXT,
    display_name_en TEXT,
    display_name_fr TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    skills JSONB,
    titre TEXT,
    ranking INT,
    nb_postulations INT,
    nb_clicks INT,
    candidature_ats INT,
    ctr INT,
    total_applications INT,
    nb_remote_applications INT,
    date_update TIMESTAMP WITHOUT TIME ZONE,
    total_visits INT
);


CREATE TABLE utilisateur(
    id_utilisateur INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    pays TEXT,
    localisation TEXT,
    latitude_secteur DOUBLE PRECISION,
    longitude_secteur DOUBLE PRECISION,
    role TEXT,
    email TEXT,
    telephone TEXT,
    mdp TEXT,
    age INT
);

CREATE TABLE profil_utilisateur(
    id_profil INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    banniere TEXT,
    photo_profil TEXT,
    biographie TEXT,
    plateforme JSONB,
    profession_actuelle VARCHAR(100),
    experiences_annees INTEGER,
    document JSONB DEFAULT '[]'::jsonb,
    langues TEXT[],
    nb_vues_profil INTEGER DEFAULT 0,
    candidatures_envoyees INTEGER DEFAULT 0,
    candidatures_consultees INTEGER DEFAULT 0,
    candidatures_positives INTEGER DEFAULT 0,
    candidatures_refusees INTEGER DEFAULT 0
);

CREATE TABLE experience_utilisateur(
    id_experience INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    id_entreprise INT REFERENCES entreprise(id_entreprise) ON DELETE SET NULL,
    nom_entreprise TEXT,
    titre TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE,
    description TEXT,
    compétences TEXT[]
);

CREATE TABLE formation_utilisateur(
    id_formation INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    id_entreprise INT REFERENCES entreprise(id_entreprise) ON DELETE SET NULL,
    nom_établissement TEXT,
    titre TEXT,
    date_debut DATE NOT NULL,
    date_fin DATE,
    description TEXT,
    compétences TEXT[],
    diplome TEXT[]
);


CREATE TABLE candidature (
    id_candidature INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_utilisateur INT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    id_poste INT REFERENCES poste(id_poste) ON DELETE SET NULL,
    date_candidature TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    statut TEXT DEFAULT 'en_attente',
    fichier_path TEXT,
    hash_sha256 TEXT,
    message TEXT,
    consigne TEXT,
    date_rendue TIMESTAMP WITH TIME ZONE,
    fichier_attendues TEXT[],    id_entreprise INT REFERENCES entreprise(id_entreprise) ON DELETE CASCADE,
    attendues TEXT,
    fichier_candidats TEXT[] 
);


CREATE EXTENSION IF NOT EXISTS postgis;

ALTER DATABASE techyourjob SET timezone TO 'Europe/Paris';
ALTER TABLE candidature ADD CONSTRAINT candidature_user_poste_unique UNIQUE (id_utilisateur, id_poste);