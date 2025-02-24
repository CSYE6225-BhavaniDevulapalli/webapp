#!/bin/bash
 
# Update and upgrade system packages
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y unzip curl
 
 
# Install Node.js & npm
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs || { echo "Error: Node.js installation failed"; exit 1; }
npm -v || { echo "Error: npm installation failed"; exit 1; }
 
 
 
# Create Application User
echo "Creating application user..."
sudo groupadd csye6225 || true
sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225 || true
 
# Ensure Application Directory Exists
echo "Ensuring application directory exists..."
sudo mkdir -p /opt/csye6225/webapp
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp
sudo chmod -R 755 /opt/csye6225
 
  
sudo apt-get install -y unzip
 

 
# Copy & Extract Web Application
echo "Copying & extracting the web application..."
if [ -f /tmp/webapp.zip ]; then
    echo ">>>>>>> 1"
   
    sudo unzip /tmp/webapp.zip -d /opt/csye6225/webapp
else
    echo "Error: Web application ZIP file is missing! Exiting..."
    exit 1
fi
 
 
# Set Permissions for Extracted Application
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp
sudo chmod -R 755 /opt/csye6225/webapp

cd /opt/csye6225/webapp || exit  # Exit if directory doesn't exist
sudo -u csye6225 npm install

# Install MySQL database server
sudo apt-get update
sudo apt-get install -y mysql-server
 
# Start MySQL service and verify its status
sudo systemctl start mysql
sudo systemctl status mysql
 
 
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"
sudo mysql -e "FLUSH PRIVILEGES; EXIT;"
sudo mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS \health_check_db14\;"
 
 
sudo systemctl restart mysql
 
sudo cp /tmp/.env /opt/csye6225/webapp
 
 
 
# Verify package.json Exists Before Running npm install
# if [ ! -f /opt/csye6225/webapp/package.json ]; then
#     echo "Error: package.json not found! Exiting..."
#     exit 1
# fi
 
 
# # Copy & Enable Systemd Service
echo "Setting up systemd service..."
if [ -f /tmp/my_webapp_service.service ]; then
    sudo cp /tmp/my_webapp_service.service /etc/systemd/system/my_webapp_service.service
    sudo chown root:root /etc/systemd/system/my_webapp_service.service
    sudo chmod 644 /etc/systemd/system/my_webapp_service.service
else
    echo "Error: Systemd service file is missing! Exiting..."
    exit 1
fi
 
# Restart, enable, and check the status of the webapp service
sudo systemctl restart my_webapp_service.service
sudo systemctl enable my_webapp_service.service
sudo systemctl status my_webapp_service.service
 
 
 
echo "Setup complete!"
 
 
 
 
 
 
 
 
 
 
 
 
 
# #!/bin/bash
 
# # Update and upgrade system packages
# sudo apt-get update -y && sudo apt-get upgrade -y
# sudo apt-get install -y unzip curl
 
 
# # Install Node.js & npm
# echo "Installing Node.js..."
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt install -y nodejs || { echo "Error: Node.js installation failed"; exit 1; }
# npm -v || { echo "Error: npm installation failed"; exit 1; }
 
 
 
# # Create Application User
# echo "Creating application user..."
# sudo groupadd csye6225 || true
# sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225 || true
 
# # Ensure Application Directory Exists
# echo "Ensuring application directory exists..."
# sudo mkdir -p /opt/csye6225
# sudo chown -R csye6225:csye6225 /opt/csye6225
# sudo chmod -R 755 /opt/csye6225
 
  
# sudo apt-get install -y unzip
 
# # echo "Unzipping Web Application..."
# # sudo cp /tmp/webapp.zip $WEBAPP_DIR/
# # cd $WEBAPP_DIR
# # sudo apt install -y unzip
# # sudo unzip -o webapp.zip
 
# # Copy & Extract Web Application
# echo "Copying & extracting the web application..."
# if [ -f /tmp/webapp.zip ]; then
#     echo ">>>>>>> 1"
#     sudo cp /tmp/webapp.zip /opt/csye6225
#     cd /opt/csye6225
#     echo ">>>>>>> 2"
#     # sudo unzip -o webapp.zip -d /opt/csye6225/ || { echo "Error: Failed to extract web application"; exit 1; }
#     echo ">>>>>>> 3"
#     sudo unzip -o webapp.zip
# else
#     echo "Error: Web application ZIP file is missing! Exiting..."
#     exit 1
# fi
 
 
# # Set Permissions for Extracted Application
# sudo chown -R csye6225:csye6225 /opt/csye6225/webapp
# sudo chmod -R 755 /opt/csye6225/webapp
 
# # Update System Packages
# # sudo apt-get update -y  && sudo apt upgrade -y
# # sudo apt-get install -y unzip curl mysql-server
 
# # Install MySQL database server
# sudo apt-get update
# sudo apt-get install -y mysql-server
 
# # Start MySQL service and verify its status
# sudo systemctl start mysql
# sudo systemctl status mysql
 
 
# sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"
# sudo mysql -e "FLUSH PRIVILEGES; EXIT;"
# sudo mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS \health_check_db14\;"
 
 
# sudo systemctl restart mysql
 
# sudo cp /tmp/.env /opt/csye6225/webapp
 
 
 
# # Verify package.json Exists Before Running npm install
# # if [ ! -f /opt/csye6225/webapp/package.json ]; then
# #     echo "Error: package.json not found! Exiting..."
# #     exit 1
# # fi
 
 
# # # Copy & Enable Systemd Service
# echo "Setting up systemd service..."
# if [ -f /tmp/my_webapp_service.service ]; then
#     sudo cp /tmp/my_webapp_service.service /etc/systemd/system/my_webapp_service.service
#     sudo chown root:root /etc/systemd/system/my_webapp_service.service
#     sudo chmod 644 /etc/systemd/system/my_webapp_service.service
# else
#     echo "Error: Systemd service file is missing! Exiting..."
#     exit 1
# fi
 
# # Restart, enable, and check the status of the webapp service
# sudo systemctl restart my_webapp_service.service
# sudo systemctl enable my_webapp_service.service
# sudo systemctl status my_webapp_service.service
 
 
 
# echo "Setup complete!"
 
 
 