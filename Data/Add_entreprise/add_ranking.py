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

# j'ajoute le score
sql_score = """
    UPDATE entreprise
    SET score = stats.score
    FROM (
        SELECT
            id_entreprise,
            (
                0.1 * (
                    (LN(1 + nb_offre) - MIN(LN(1 + nb_offre)) OVER())
                    /
                    NULLIF(MAX(LN(1 + nb_offre)) OVER() - MIN(LN(1 + nb_offre)) OVER(), 0)
                )
                +
                0.2 * (
                    (LN(1 + nb_visit) - MIN(LN(1 + nb_visit)) OVER())
                    /
                    NULLIF(MAX(LN(1 + nb_visit)) OVER() - MIN(LN(1 + nb_visit)) OVER(), 0)
                )
                +
                0.3 * (
                    (LN(1 + nb_click) - MIN(LN(1 + nb_click)) OVER())
                    /
                    NULLIF(MAX(LN(1 + nb_click)) OVER() - MIN(LN(1 + nb_click)) OVER(), 0)
                )
                +
                0.4 * (
                    (LN(1 + nb_postulation) - MIN(LN(1 + nb_postulation)) OVER())
                    /
                    NULLIF(MAX(LN(1 + nb_postulation)) OVER() - MIN(LN(1 + nb_postulation)) OVER(), 0)
                )
            ) AS score
        FROM entreprise
    ) stats
    WHERE entreprise.id_entreprise = stats.id_entreprise;
"""

cursor.execute(sql_score)

# j'ajoute le rank
sql_rank = """
    UPDATE entreprise
    SET rank = NULL
    WHERE score IS NULL;
    
    UPDATE entreprise
    SET rank = ranked.rank
    FROM (
        SELECT
            id_entreprise,
            RANK() OVER (ORDER BY score DESC) AS rank
        FROM entreprise
        WHERE score IS NOT NULL
    ) ranked
    WHERE entreprise.id_entreprise = ranked.id_entreprise;
"""

cursor.execute(sql_rank)

connection.commit()
print("données insérées")

cursor.close()
connection.close()
