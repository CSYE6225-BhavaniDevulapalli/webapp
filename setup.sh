#!/bin/bash

set -e # Exit script if any command fails

echo "Starting Automated Web App Deployment on Ubuntu 24.04 LTS..."

echo "Loading environment variables from .env..."

if [ -f .env ]; then
    set -o allexport
    source .env
    set +o allexport
else
    echo "⚠️  .env file not found! Exiting..."
    exit 1
fi

# Update and Upgrade Packages
echo "Updating system packages..."
sudo apt update -y && sudo apt upgrade -y
echo "Updates done."

# Install MySQL Server
echo "Installing MySQL Server..."
sudo apt install -y mysql-server

sudo systemctl enable mysql
sudo systemctl start mysql


sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASS}';"



#Create MySQL Database and User
echo "for database"
sudo mysql -u root -e "
    CREATE DATABASE IF NOT EXISTS ${DB_NAME};
    CREATE USER IF NOT EXISTS '${DB_USER}'@'${DB_HOST}' IDENTIFIED BY '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'${DB_HOST}';
    FLUSH PRIVILEGES;
"

# Install npm (only once)
echo "Installing npm..."
sudo apt install -y npm

# Create Linux User and Group for the Web App
GROUP_NAME="csye6225group"
USER_NAME="csye6225user"

echo "Creating Linux User and Group..."
sudo groupadd -f $GROUP_NAME
sudo useradd -m -g $GROUP_NAME $USER_NAME || echo "User already exists"

# Create Web App Directory and Logs Directory
WEBAPP_DIR="/opt/csye6225"
LOG_DIR="/var/log/webapp"

echo "Creating Directories..."
sudo mkdir -p $WEBAPP_DIR
sudo mkdir -p $LOG_DIR
sudo chown -R $USER_NAME:$GROUP_NAME $LOG_DIR
sudo chmod -R 755 $LOG_DIR

# Move and Unzip Application
echo "Unzipping Web Application..."
sudo cp /tmp/webapp.zip $WEBAPP_DIR/
cd $WEBAPP_DIR
sudo apt install -y unzip
sudo unzip -o webapp.zip

# Set Permissions
echo "Setting File Permissions..."
sudo chown -R $USER_NAME:$GROUP_NAME $WEBAPP_DIR
sudo chmod -R 755 $WEBAPP_DIR

# Install Dependencies
echo "Installing Web App Dependencies..."
cd $WEBAPP_DIR


cd webapp

npm install express nodemon mysql sequelize dotenv



# Start the Web App in the Background
echo "Starting Web Application..."

npm test
npm start

echo "Web App Deployment Complete!"
