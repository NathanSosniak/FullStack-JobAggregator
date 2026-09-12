import psycopg
import os
import json
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

sql_request = """
    SELECT 
        id_entreprise,
        nom_compagnie
    FROM entreprise
"""

cursor.execute(sql_request)

response = cursor.fetchall()
sorted_response = sorted(response, key=lambda x: x[0])

data = {}

for id, entreprise in sorted_response:
    data[id] = entreprise

with open("./Backend/Cache/JSON/entreprises.json", "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

cursor.close()
connection.close()
