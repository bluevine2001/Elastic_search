Etape 1: tirer l'image elastic search grâce à la commande suivante :

```
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.7.1
```

Etape 2 : Créer un réseau elastic search :

```
docker network create elastic
```

Etape 3: lancer l'instance docker elastic search :

```
docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.7.1
```

Etape 4 : Récupérer le mots de passe pour l'utilisateur elastic et l'enrollement token

Etape 5 : Copier le certificat http_ca.crt dans l'instance docker

```
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
```

Etape 6 : Essayer de se connecter à elastic search en faisant un appel authentifier

```
curl --cacert http_ca.crt -u elastic https://localhost:9200
```

Etape 7 : Installer kibana dans docker

```
docker pull docker.elastic.co/kibana/kibana:8.7.1
```

Etape 8 : Lancer Kibana dans docker

```
docker run --name kib-01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.7.1
```

Etape 9 : Copier le lien dans le terminal et l'ouvrir dans le navigateur

Etape 10 : Se connecter avec les login elastic search
