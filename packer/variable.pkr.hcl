# variable "aws_region" {
#   type        = string
#   description = "The AWS region where the AMI will be created"
#   default     = "us-east-1" # Change as needed
# }

# variable "aws_profile" {
#   type    = string
#   default = "dev"

# }

# variable "source_ami" {
#   type        = string
#   description = "The Ubuntu 24.04 LTS AMI ID"
#   default     = "ami-04b4f1a9cf54c11d0" #Ubuntu 24.04 AMI ID
# }

# variable "instance_type" {
#   type        = string
#   description = "Instance type for the temporary EC2 instance used by Packer"
#   default     = "t2.micro" # Change if a larger instance is needed
# }

# variable "ssh_username" {
#   type        = string
#   description = "The SSH username for the Ubuntu AMI"
#   default     = "ubuntu"
# }

# variable "default_vpc_id" {
#   type        = string
#   description = "The ID of the AWS Default VPC"
#   default     = "vpc-027789667bf1e1508" #  default VPC ID of us-east-1a
# }

# variable "default_subnet_id" {
#   type        = string
#   description = "The ID of the subnet in the default VPC"
#   default     = "subnet-0a762cd9eab679fca" #  default Subnet ID of us-east-1a
# }


# variable "app_path" {
#   description = "Path where the application will be deployed"
#   default     = "/home/csye6225/WEBAPP-CSYE6225"
# }

# variable "service_name" {
#   description = "Name of the systemd service"
#   default     = "my_webapp_service"
# }

# # GCP Variables
# variable "gcp_project_id" {
#   type        = string
#   description = "The ID of the gcp project"
#   default     = "csye6225-dev-451702" #  default VPC ID of us-east-1a
# }
# variable "gcp_zone" {
#   default = "us-east1-b"
# }


# variable "app_port" {
#   default     = "8080"
#   description = "Port for the application"
# }

# variable "db_host" {
#   default     = "localhost"
#   description = "Database host"
# }

# variable "db_port" {
#   default     = "3306"
#   description = "Database port"
# }

# variable "db_name" {
#   default     = "health_check_db14"
#   description = "Database name"
# }

# variable "db_user" {
#   default     = "root"
#   description = "Database user"
# }

# variable "db_password" {
#   default     = "root"
#   description = "Database password"
# }