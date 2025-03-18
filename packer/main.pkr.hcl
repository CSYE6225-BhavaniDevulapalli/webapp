variable "aws_region" {
  type        = string
  description = "The AWS region where the AMI will be created"
  default     = "us-east-1" # Change as needed
}

variable "aws_profile" {
  type    = string
  default = "dev"

}

variable "source_ami" {
  type        = string
  description = "The Ubuntu 24.04 LTS AMI ID"
  default     = "ami-04b4f1a9cf54c11d0" #Ubuntu 24.04 AMI ID
}

variable "instance_type" {
  type        = string
  description = "Instance type for the temporary EC2 instance used by Packer"
  default     = "t2.micro" # Change if a larger instance is needed
}

variable "ssh_username" {
  type        = string
  description = "The SSH username for the Ubuntu AMI"
  default     = "ubuntu"
}

variable "default_vpc_id" {
  type        = string
  description = "The ID of the AWS Default VPC"
  default     = "vpc-027789667bf1e1508" #  default VPC ID of us-east-1a
}

variable "default_subnet_id" {
  type        = string
  description = "The ID of the subnet in the default VPC"
  default     = "subnet-0a762cd9eab679fca" #  default Subnet ID of us-east-1a
}


variable "app_path" {
  description = "Path where the application will be deployed"
  default     = "/home/csye6225/WEBAPP-CSYE6225"
}

variable "service_name" {
  description = "Name of the systemd service"
  default     = "my_webapp_service"
}

# GCP Variables
variable "gcp_project_id" {
  type        = string
  description = "The ID of the gcp project"
  default     = "csye6225-dev-451702" #  default VPC ID of us-east-1a
}
variable "gcp_zone" {
  default = "us-east1-b"
}


variable "app_port" {
  default     = "8080"
  description = "Port for the application"
}

variable "db_host" {
  default     = "localhost"
  description = "Database host"
}

variable "db_port" {
  default     = "3306"
  description = "Database port"
}

variable "db_name" {
  default     = "health_check_db14"
  description = "Database name"
}

variable "db_user" {
  default     = "root"
  description = "Database user"
}

variable "db_password" {
  default     = "root"
  description = "Database password"
}


variable "source_image_family" {
  description = "The source image family for the machine image"
  default     = "ubuntu-2204-lts"
}


variable "network" {
  description = "The network where the VM will be created"
  default     = "default"
}


variable "block_device_name" {
  type        = string
  description = "Device name for the root volume"
  default     = "/dev/sda1"
}

variable "block_device_size" {
  type        = number
  description = "Size of the root volume in GB"
  default     = 25
}

variable "block_device_type" {
  type        = string
  description = "Volume type for the root volume"
  default     = "gp2"
}

variable "delete_on_termination" {
  type        = bool
  description = "Whether the volume should be deleted on instance termination"
  default     = true
}

variable "disk_size" {
  description = "Disk size in GB"
  default     = 25
}
variable "machine_type" {
  description = "The username for SSH access"
  default     = "e2-medium"
}



# ==========================
#  Required Packer Plugins
# ==========================
packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0, <2.0.0"
    }
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.0.0, <2.0.0"
    }
  }
}

# ==========================
#  Define GCP Image Source
# ==========================
source "googlecompute" "gcp_image" {
  project_id          = var.gcp_project_id
  source_image_family = var.source_image_family
  image_name          = "csye6225-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  zone                = var.gcp_zone
  disk_size           = var.disk_size

  machine_type = var.machine_type
  network      = var.network
  ssh_username = var.ssh_username
}



# ==========================
#  Define AWS AMI Source
# ==========================
source "amazon-ebs" "ubuntu" {
  region        = var.aws_region
  profile       = var.aws_profile
  source_ami    = var.source_ami
  instance_type = var.instance_type
  ssh_username  = var.ssh_username
  ami_name      = "csye6225_${formatdate("YYYY_MM_DD_HH_mm_ss", timestamp())}"

  #  Using the Default VPC for Packer Build
  vpc_id    = var.default_vpc_id
  subnet_id = var.default_subnet_id
  #  Make sure the AMI is PRIVATE
  ami_groups = []

  # Storage Configuration: 25GB General Purpose SSD
  launch_block_device_mappings {
    device_name           = var.block_device_name
    volume_size           = var.block_device_size
    volume_type           = var.block_device_type
    delete_on_termination = var.delete_on_termination
  }
}

# ==========================
# Build Configuration
# ==========================
build {
  sources = ["source.googlecompute.gcp_image", "source.amazon-ebs.ubuntu"]
  # sources = ["source.amazon-ebs.ubuntu"]

  #"source.amazon-ebs.ubuntu",


  provisioner "file" {
    source      = "../webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  # provisioner "file" {
  #   source      = "./.env"
  #   destination = "/tmp/.env"
  # }

  # provisioner "shell" {
  #   inline = [
  #     "cat <<EOF > /tmp/.env",
  #     "PORT=${var.app_port}",
  #     "NODE_ENV=development",
  #     "DB_HOST=${var.db_host}",
  #     "DB_PORT=${var.db_port}",
  #     "DB_NAME=${var.db_name}",
  #     "DB_USER=${var.db_user}",
  #     "DB_PASSWORD=${var.db_password}",
  #     "EOF"
  #   ]
  # }


  provisioner "file" {
    source      = "../my_webapp_service.service"
    destination = "/tmp/my_webapp_service.service"
  }




  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    script = "app.sh"
  }
  post-processor "manifest" {
    output = "image_manifest.json"
  }

}
