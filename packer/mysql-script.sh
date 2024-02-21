#!/bin/bash

sudo yum install -y mysql-server

sudo systemctl status mysqld

sudo systemctl start mysqld

sudo systemctl enable mysqld

sudo mysql -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Lakki0811';"

sudo mysql --user="root" --password="Lakki0811" -e "CREATE DATABASE IF NOT EXISTS cloudDB;"
