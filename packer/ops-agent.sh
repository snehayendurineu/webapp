#!/bin/bash

sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo mkdir -p /var/log/webapp/
sudo touch /var/log/webapp/app.log
sudo chown -R csye6225:csye6225 /var/log/webapp/
sudo chmod -R 755 /var/log/webapp/
