#!/bin/bash

sudo groupadd -f csye6225
sudo useradd -r -s /usr/sbin/nologin -g csye6225 csye6225 || exit 1 
sudo chmod -R 755 /home/packer
sudo chown -R csye6225:csye6225 /home/packer || exit 1 

