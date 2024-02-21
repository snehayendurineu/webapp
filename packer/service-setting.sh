#!/bin/bash

sudo mv /tmp/webapp.service /etc/systemd/system/

cd /etc/systemd/system || exit 1
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service