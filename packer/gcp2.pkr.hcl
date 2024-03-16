packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.1.4"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

variable "gcp_project_id" {
  type    = string
  default = "cloud6225-dev"
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "zone" {
  type    = string
  default = "us-east1-b"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}

variable "image_name" {
  type    = string
  default = "custom-cosimage"
}

source "googlecompute" "custom-image" {
  project_id           = var.gcp_project_id
  source_image_family  = var.source_image_family
  zone                 = var.zone
  ssh_username         = var.ssh_username
  image_name           = var.image_name
  wait_to_add_ssh_keys = "20s"
}


build {
  name    = "custom-image-builder"
  sources = ["source.googlecompute.custom-image"]

  provisioner "file" {
    source      = "../webApp.zip"
    destination = "/home/packer/webApp.zip"
  }

  provisioner "shell" {
    script = "setup-script.sh"
  }

  /*
  provisioner "shell" {
    script = "mysql-script.sh"
  }*/

  provisioner "shell" {
    script = "add-local-user.sh"
  }

  provisioner "file" {
    source      = "webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    script = "service-setting.sh"
  }

  provisioner "shell" {
    script = "ops-agent.sh"
  }

  provisioner "file" {
    source      = "ops-agent-config.yml"
    destination = "/tmp/config.yml"
  }

  provisioner "shell" {
    script = "restart-ops-agent.sh"
  }

}

