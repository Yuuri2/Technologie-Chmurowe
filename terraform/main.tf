terraform {
    required_providers {
    azurerm = {
            source  = "hashicorp/azurerm"
            version = "~> 3.0.2"
        }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
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



resource "azurerm_resource_group" "rg" {
  name     = "TerraTC"
  location = "PolandCentral"
}

resource "random_string" "webapp_suffix" {
  length  = 6
  upper   = false
  special = false
  numeric = true
}

resource "azurerm_service_plan" "web" {
  name                = "terratc-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_postgresql_flexible_server" "baza" {
  name                          = "postrgres_baza"
  resource_group_name           = azurerm_resource_group.rg.name
  location                      = azurerm_resource_group.rg.location
  version                       = "18"
  public_network_access_enabled = true
  administrator_login           = var.postgres_admin_login
  administrator_password        = var.postgres_admin_password
  storage_mb                    = 32768
  sku_name                      = "B_Standard_B1ms"
}

resource "azurerm_linux_web_app" "app" {
  name                = "terratc-web-${random_string.webapp_suffix.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.web.id

  https_only = true

  app_settings = {
    SCM_DO_BUILD_DURING_DEPLOYMENT = "true"
    WEBSITE_RUN_FROM_PACKAGE       = "1"
  }

  site_config {
    always_on = true

    application_stack {
      node_version = "22-lts"
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
