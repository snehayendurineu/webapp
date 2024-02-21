#!/bin/bash
sudo yum update -y
sudo yum upgrade -y

# Install Node.js
sudo dnf module enable nodejs:20
sudo dnf module install -y nodejs:20


echo "Unzip webApp"
ls
cd /home/packer || exit 1
sudo yum install -y unzip
sudo unzip webApp.zip
cd webApp || exit 1

echo "installing npm"
node --version
sudo npm install
