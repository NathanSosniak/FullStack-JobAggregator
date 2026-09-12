import subprocess
import os
from Add_API_DB import Entreprise_Into_DB, Poste_Into_DB


ADD_ENTREPRISE_DIR = os.path.join(os.path.dirname(__file__), "..", "Add_entreprise")

try:
    print("Insertion des entreprises en cours")
    Entreprise_Into_DB()
    print("Entreprises terminé")
except Exception as e:
    print("Erreur Entreprise_Into_DB :", e)

try:
    print("Insertion des postes en cours")
    Poste_Into_DB()
    print("Postes terminé")
except Exception as e:
    print("Erreur Poste_Into_DB :", e)


try:
    subprocess.run(["python", "add_logo.py"], check=True, cwd=ADD_ENTREPRISE_DIR)
    subprocess.run(["python", "add_stats.py"], check=True, cwd=ADD_ENTREPRISE_DIR)
    subprocess.run(["python", "add_ranking.py"], check=True, cwd=ADD_ENTREPRISE_DIR)
except Exception as e:
    print("Erreur Insertion Stats & logo :", e)
