#! /bin/bash

cd /app/

#check and fetch new dependencies
npm install

#build
npm run build

#change owner of modified files
#find user id from host machine
chown -R 1002:1002 /app