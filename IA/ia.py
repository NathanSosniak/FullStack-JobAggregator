from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pickle
import math
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement des modeles et données
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model = joblib.load(os.path.join(BASE_DIR, "model_ia.joblib"))
    vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.joblib"))

    with open(os.path.join(BASE_DIR, "postes_data.pkl"), "rb") as f:
        df = pickle.load(f)

    print(f"Modèles chargés - {len(df)} postes disponibles")

except Exception as e:
    print(f"Erreur au chargement des modèles : {e}")
    raise


def safe_float(val):
    try:
        f = float(val)
        return None if math.isnan(f) else f

    except (TypeError, ValueError):
        return None


@app.get("/health")
def health():
    return {"status": "ok", "postes": len(df)}


@app.post("/recommend")
async def recommend(request: Request):
    body = await request.json()
    texte = body.get("texte", "").strip()

    if not texte:
        raise HTTPException(status_code=400, detail="Le champ 'texte' est requis.")

    try:
        X = vectorizer.transform([texte])
        distances, indices = model.kneighbors(X, n_neighbors=5)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur du modèle : {str(e)}")

    results = []

    for idx in indices[0]:
        row = df.iloc[idx]
        results.append(
            {
                "id_poste": int(row["id_poste"]),
                "titre": str(row["titre"]),
                "skills_clean": str(row.get("skills_clean", "")),
                "salaire_min": safe_float(row.get("salaire_min")),
                "salaire_max": safe_float(row.get("salaire_max")),
            }
        )

    return results
