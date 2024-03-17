#!/bin/bash
sudo mkdir -p etc/google-cloud-ops-agent
sudo mv /tmp/config.yaml etc/google-cloud-ops-agent/config.yaml

sudo systemctl restart google-cloud-ops-agent
