#!/bin/bash

sudo mkdir -p etc/google-cloud-ops-agent
sudo mv /tmp/config.yml etc/google-cloud-ops-agent/config.yml

sudo systemctl restart google-cloud-ops-agent
