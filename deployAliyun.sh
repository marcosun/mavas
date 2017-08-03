#! /bin/bash

echo $fg[cyan] "deploy aliyun now begins"

cd ~/app/mavasDemo

#clean mavas folder on access gateway
rm -rf mavas_source

#fetch code
echo $fg[cyan] "fetch source code"
git clone git@10.96.6.9:zeta/mavas.git mavas_source

#copy to access gateway
scp -r mavas_source marco@121.196.210.95:~/app/mavasDemo

#login to access gateway
ssh marco@121.196.210.95 << EOF
  cd ~/app/mavasDemo

  #copy to aliyun server
  scp -r mavas_source marco@10.0.101.185:~/app/mavasDemo

  #clean mavas folder on access gateway
  rm -rf mavas_source

  #login to aliyun server
  ssh -t -t marco@10.0.101.185 '
  cd ~/app/mavasDemo

  #delete copy
  rm -rf mavas_copy

  #create copy
  echo $fg[cyan] "backup previous source code"
  mv mavas mavas_copy

  #update code
  echo $fg[cyan] "update source code"
  mv mavas_source mavas

  #copy dependencies
  cp -r mavas_copy/node_modules mavas/node_modules

  cd mavas

  #frontend build
  echo $fg[cyan] "frontend build process begins"
  chmod 755 frontend_aliyun.sh
  sudo docker run -v /home/marco/app/mavasDemo/mavas:/app/ node:8 /app/frontend_aliyun.sh
  echo $fg[cyan] "frontend build process completes"

  cd ..

  ##server
  #delete copy
  rm -rf server_copy

  #create copy
  echo $fg[cyan] "backup previous release"
  cp -r server server_copy

  #delete dist in server
  echo $fg[cyan] "clean static files"
  cd server/public
  ls | grep -v index.html | xargs rm

  #copy dist to server
  echo $fg[cyan] "feed with frontend project"
  cp ../../mavas/public/* ./

  cd ../

  #server build
  echo $fg[cyan] "server build process begins"
  cp ../mavas/server_build.sh ./
  chmod 755 server_build.sh
  sudo docker run -v /home/marco/app/mavasDemo/server:/app/ node:8 /app/server_build.sh
  echo $fg[cyan] "server build process completes"

  #build docker image
  echo $fg[cyan] "docker image build process begins"
  cp ../mavas/Dockerfile ./
  cp ../mavas/docker-compose.yml ./
  sudo docker build -t mavasdemo:latest .
  echo $fg[cyan] "docker image build process completes"

  #server up
  echo $fg[cyan] "stop previous server"
  sudo docker rm -f mavasDemo
  echo $fg[cyan] "start server"
  sudo docker run -d -p 18110:80 --name mavasDemo mavasdemo:latest

  #clean docker
  echo $fg[cyan] "docker clean"
  sudo docker rm $(sudo docker ps -aq)
  sudo docker rmi $(sudo docker images -f "dangling=true" -q)

  #docker swarm
  #sudo docker swarm init
  #sudo docker stack deploy -c docker-compose.yml mavasDemo
  '

  echo $fg[cyan] "deploy aliyun completes"
EOF