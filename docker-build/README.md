# Dockerhub

- https://docs.docker.com/get-started/04_sharing_app/
- `docker image ls | head` 找出合適的名稱，例如「docker-app-archive-7-zip_app」
- 建立對應的repo https://hub.docker.com/
- https://hub.docker.com/repository/docker/pudding/docker-app/general
- pudding/docker-app
- `docker tag docker-app-archive-list-app pudding/docker-app:ubuntu-20.04-nodejs-12.14.1-20230810-0130`
- `docker push pudding/docker-app:ubuntu-20.04-nodejs-12.14.1-20230810-0130`
- 修改Dockerfile `FROM pudding/docker-app:ubuntu-20.04-nodejs-12.14.1-20230810-0130`