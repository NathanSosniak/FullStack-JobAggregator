# Comment fonctionne le système de ranking ?

## 1. La récupération des données

Pour chaque entreprise on récupère 4 données avec 4 significations différentes :

- nombre d'offres -> volume/présence
- nombre de visites au total sur l'ensemble des offres -> visibilité
- nombre de clicks au total sur l'ensemble des offres -> intérêt
- nombre de postulations au total sur l'ensemble des offres -> conversion réelle

## 2. Le calcul du score

$$
score =
0.1 * offres_{normalisé} +
0.2 * ln(1 + visites)_{normalisé} +
0.3 * ln(1 + clicks)_{normalisé} +
0.4 * ln(1 + postulations)_{normalisé}
$$

### Pourquoi utiliser le logarithme népérien ?

Utiliser la fonction ln permet de compresser les valeurs avant de les normaliser. Ceci permet de réuire l'impact des données très élevées par rapport aux autres.

### Pourquoi des coefficients différents ?

On utilise des coefficients différents pour accorder plus ou moins d'importance à une donnée dans le résultat.

En l'occurrence dans notre cas on peut classer les données selon cet ordre d'importance :

1. nombre de postulations
2. nombre de clicks
3. nombre de visites
4. nombre d'offres

### Pourquoi normaliser les valeurs ?

$$
x_{norm} = (x - x_{min}) / (x_{max} - x_{min})
$$

De cette façon chaque métrique devient un nombre entre 0 et 1 ce qui permet d'empêcher une donnée de faire exploser le résultat.

Par exemple, si on avait une entreprise avec 1 000 000 de visites et 100 postulations alors le nombre de visites "écraserait" le nombre de postulations.

La normalisation permet de mettre les données à la même échelle pour pouvoir les comparer.

### Comment interpréter le résultat ?

Le résultat final est compris entre 0 et 1:

- Proche de 0, l'entreprise a peu de succès et est peu populaire.
- Proche de 1, l'entreprise a beaucoup de succès et est très populaire.
