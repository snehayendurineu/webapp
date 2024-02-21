#!/bin/bash
sudo yum update -y
sudo yum upgrade -y

# Install Node.js
sudo dnf module enable nodejs:20
sudo dnf module install -y nodejs:20


echo "Unzip webapp"
ls
cd /home/packer || exit 1
sudo yum install -y unzip
sudo unzip webapp.zip
cd webapp || exit 1

echo "installing npm"
node --version
sudo npm install
