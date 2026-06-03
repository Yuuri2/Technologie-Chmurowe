terraform {
    required_providers {
    azurerm = {
            source  = "hashicorp/azurerm"
            version = "~> 4.75"
        }
    }

    required_version = ">= 0.12"
}

provider "azurerm" {
  features {}
}

variable "postgres_admin_login" {
  type = string
}

variable "postgres_admin_password" {
  type      = string
  sensitive = true
}

variable "webapp_name" {
  type = string
}



resource "azurerm_resource_group" "rg" {
  name     = "TerraTC"
  location = "PolandCentral"
}

resource "azurerm_service_plan" "web" {
  name                = "terratc-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_postgresql_flexible_server" "baza" {
  name                          = "postrgresbaza"
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  version                       = "13"
  public_network_access_enabled = true
  administrator_login           = var.postgres_admin_login
  administrator_password        = var.postgres_admin_password
  storage_mb                    = 32768
  sku_name                      = "B_Standard_B1ms"
}

resource "azurerm_linux_web_app" "app" {
  name                = var.webapp_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.web.id

  https_only = false

  app_settings = {
    WEBSITE_RUN_FROM_PACKAGE       = "1"
  }

  site_config {
    always_on = true
    app_command_line = "node build/index.js"
    application_stack {
      node_version = "24-lts"
    }
  }
}

output "postgres_fqdn" {
  value = azurerm_postgresql_flexible_server.baza.fqdn
}

output "webapp_name" {
  value = azurerm_linux_web_app.app.name
}

output "webapp_default_hostname" {
  value = azurerm_linux_web_app.app.default_hostname
}
