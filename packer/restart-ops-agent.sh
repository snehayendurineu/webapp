#!/bin/bash


sudo mv /tmp/config.yml etc/google-cloud-ops-agent/config.yml

sudo vi etc/google-cloud-ops-agent/config.yml
sudo systemctl restart google-cloud-ops-agent
