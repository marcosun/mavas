#! /bin/bash

cd ~/app/mavasDemo

##src
#delete copy
rm -rf mavas_copy

#create copy
mv mavas mavas_copy

#fetch code
git clone git@10.96.6.9:zeta/mavas.git

#copy dependencies
cp -r mavas_copy/node_modules mavas/node_modules

cd mavas

#frontend build
chmod 755 frontend_build.sh
sudo docker run -v /home/marco/app/mavasDemo/mavas:/app/ node:8 /app/frontend_build.sh

cd ..

##server
#delete copy
rm -rf server_copy

#create copy
cp -r server server_copy

#delete dist in server
cd server/public
ls | grep -v index.html | xargs rm

#copy dist to server
cp ../../mavas/public/* ./

cd ../

#server build
cp ../mavas/server_build.sh ./
chmod 755 server_build.sh
sudo docker run -v /home/marco/app/mavasDemo/server:/app/ node:8 /app/server_build.sh

#build docker image
cp ../mavas/Dockerfile ./
cp ../mavas/docker-compose.yml ./
sudo docker build -t mavasdemo:latest .

#server up
sudo docker stop mavasDemo
sudo docker rm mavasDemo
sudo docker run -d -p 18110:80 --name mavasDemo mavasdemo:latest

#docker swarm
#sudo docker swarm init
#sudo docker stack deploy -c docker-compose.yml mavasDemo