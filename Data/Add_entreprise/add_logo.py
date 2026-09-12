import psycopg
import os
import unicodedata
import string
import re
import requests
from dotenv import load_dotenv

load_dotenv()


# j'enlève les accents
def remove_accents(text):
    return "".join(
        (
            char
            for char in unicodedata.normalize("NFD", text)
            if unicodedata.category(char) != "Mn"
        )
    )


# j'enlève tout ce qu'il y a après une virgule
def remove_comma(text):
    return text.split(",")[0]


# j'enlève les paranthèses et ce qu'il y a dedans
def remove_comments(text):
    return re.sub(r"\(.*?\)", "", text)


# j'enlève la ponctuation finale s'il y en a une
def remove_lastPunct(text):
    if text[-1] in string.punctuation:
        return text[:-1]
    else:
        return text


# j'enlève la ponctuation (sauf tiret et point)
def remove_punct(text):
    punct = [
        "!",
        '"',
        "#",
        "$",
        "%",
        "&",
        "'",
        "(",
        ")",
        "*",
        "+",
        ",",
        "/",
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",
        "[",
        "\\",
        "]",
        "^",
        "_",
        "`",
        "{",
        "|",
        "}",
        "~",
    ]

    return "".join((char for char in text if char not in punct))


connection = psycopg.connect(
    host="localhost",
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("PORT_DB"),
)

cursor = connection.cursor()

sql_request = """
    SELECT 
        id_entreprise,
        nom_compagnie
    FROM entreprise
    WHERE logo IS NULL
"""

cursor.execute(sql_request)

response = cursor.fetchall()
sorted_response = sorted(response, key=lambda x: x[0])

for id, entreprise in sorted_response:
    # je clean le nom de l'entreprise avant de le mettre dans l'url
    entreprise = str(entreprise)
    entreprise = remove_accents(entreprise)
    entreprise = remove_comma(entreprise)
    entreprise = remove_comments(entreprise)
    entreprise = remove_lastPunct(entreprise.strip())
    entreprise = remove_punct(entreprise)
    entreprise = entreprise.replace(" ", "").lower().strip()

    logo_value = ""
    priority_extensions = [".com", ".io", ".co", ".ai", ".fr", ".net", ".org"]

    for ext in priority_extensions:
        domaine = entreprise + ext
        token = os.getenv("LOGODEV_KEY")

        url = f"https://img.logo.dev/{domaine}?token={token}&format=png&fallback=404"

        response = requests.get(url)

        if response.status_code == 200:
            print(id, "logo trouvé via logo.dev")
            logo_value = domaine
            break

    if logo_value == "":
        url = f"https://ui-avatars.com/api/?name={entreprise}&background=random"

        response = requests.get(url)

        if response.status_code == 200:
            print(id, "logo générique trouvé")
            logo_value = url
        else:
            print(id, "aucun logo trouvé")

    sql_update = """
        UPDATE
            entreprise
        SET logo = %s
        WHERE id_entreprise = %s
    """

    cursor.execute(sql_update, (logo_value, id))

connection.commit()
print("données insérées")

cursor.close()
connection.close()
