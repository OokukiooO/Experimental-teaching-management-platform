docker compose build

docker login -u aiweb-1719301166230 -p c622ee4c3418678046908cea0f7c08b8f3c0c2e4 easypus-docker.pkg.coding.net

docker tag easyai-web easypus-docker.pkg.coding.net/aiweb/aiweb/web:lastest

docker push easypus-docker.pkg.coding.net/aiweb/aiweb/web:lastest

docker pull easypus-docker.pkg.coding.net/aiweb/aiweb/web:lastest
