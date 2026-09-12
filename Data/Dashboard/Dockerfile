# image
FROM python:3.12.3-slim

#dossier de travail
WORKDIR /usr/local/app

# installation de cron
RUN apt-get update && apt-get install -y cron

# installation des dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# notebooks
COPY candidatures_profession.ipynb .
COPY Entreprise_Candidature.ipynb .

# setup de cron
COPY crontab /etc/cron.d/notebooks-cron
RUN chmod 0644 /etc/cron.d/notebooks-cron
RUN crontab /etc/cron.d/notebooks-cron

#création du fichier pour les logs
RUN touch /var/log/cron.log

# commandes de démarrage
CMD ["sh", "-c", "printenv > /etc/environment && cron && tail -f /var/log/cron.log"]