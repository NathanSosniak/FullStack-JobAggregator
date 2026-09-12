import requests
import json
import time


def Get_Size():
    # e API endpoint
    url = "https://epi-api.welovedevs.com/v1?page=0&size=1"

    headers = {
        "accept": "application/json",
        "X-API-Key": "c70a9152-f3cf-492b-9cb5-a49f266d41ba",
    }

    # requete
    response = requests.get(url, headers=headers)

    # reponse value
    data = response.json()
    data = json.dumps(data)

    # on load le json
    resp = json.loads(data)
    return resp["totalCount"]


def Get_All_Data():
    nombre = Get_Size()
    page = nombre // 100
    time.sleep(1)

    all_data = []
    # API endpoint
    for i in range(page + 1):
        url = f"https://epi-api.welovedevs.com/v1?page={i}&size=100"

        headers = {
            "accept": "application/json",
            "X-API-Key": "c70a9152-f3cf-492b-9cb5-a49f266d41ba",
        }

        # requete
        response = requests.get(url, headers=headers)

        # reponse value
        data = response.json()

        if "values" in data:
            all_data.extend(data["values"])
        else:
            print("Format inattendu :", data)

        time.sleep(1)

    with open("./Data.json", "w") as json_file:
        json.dump(all_data, json_file, indent=4, ensure_ascii=False)


def Single_Dta():
    all_data = []
    url = "https://epi-api.welovedevs.com/v1?page=1&size=1"
    headers = {
        "accept": "application/json",
        "X-API-Key": "c70a9152-f3cf-492b-9cb5-a49f266d41ba",
    }

    response = requests.get(url, headers=headers)

    # reponse value
    data = response.json()

    if "values" in data:
        all_data.extend(data["values"])
    else:
        print("Format inattendu :", data)

    time.sleep(1)

    with open("./DataTest.json", "w") as json_file:
        json.dump(all_data, json_file, indent=4, ensure_ascii=False)


Single_Dta()
