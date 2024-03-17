#!/bin/bash

sudo cp /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml
sudo cp /tmp/config.yaml /home/packer/tmpc.yaml
sudo systemctl restart google-cloud-ops-agent
