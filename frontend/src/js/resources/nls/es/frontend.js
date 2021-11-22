define({
  "wrc-header": {
    "text": {
      "appName": "Consola remota de WebLogic"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "En l\\u00EDnea"
        },
        "offline": {
          "tooltip": "Fuera de l\\u00EDnea"
        },
        "detached": {
          "tooltip": "Desasociado"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00C2\\u00A9 2020, 2021, Oracle y/o sus filiales.<br/>Oracle es una marca comercial registrada de Oracle Corporation y/o sus filiales. Todos los dem\\u00E1s nombres pueden ser marcas comerciales de sus respectivos propietarios.<br/>",
      "builtWith": "Creado con Oracle JET"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Obtener Informaci\\u00F3n"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "Eliminar"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Unnamed Project"
        },
        "name": {
          "value": "Connection Provider Name"
        },
        "url": {
          "value": "URL"
        },
        "username": {
          "value": "Nombre de usuario"
        },
        "password": {
          "value": "Contrase\\u00F1a"
        }
      },
      "models": {
        "name": {
          "value": "WDT Model Provider Name"
        },
        "file": {
          "value": "WDT Model Filename"
        }
      },
      "project": {
        "name": {
          "value": "Project Name"
        },
        "file": {
          "value": "Project Filename"
        },
        "isDefault": {
          "value": "Make Default"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Admin Server Connection"
        },
        "model": {
          "value": "Add WDT Model"
        }
      }
    },
    "popups": {
      "info": {
        "provider": {
          "id": {
            "label": "Identificador de Proveedor:"
          }
        },
        "domain": {
          "name": {
            "label": "Nombre de Dominio:"
          },
          "url": {
            "label": "URL de dominio:"
          },
          "version": {
            "label": "Versi\\u00F3n de dominio:"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "Timeout de Conexi\\u00F3n:"
          },
          "readTimeout": {
            "label": "Timeout de Lectura:"
          },
          "anyAttempt": {
            "label": "Any Connections Attempted:"
          },
          "lastAttempt": {
            "label": "Last Attempt Successful:"
          }
        },
        "model": {
          "file": {
            "label": "File:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Create Provider for Admin Server Connection..."
        }
      },
      "models": {
        "add": {
          "value": "Create Provider for Existing WDT Model File..."
        },
        "new": {
          "value": "Create Provider for New WDT Model File..."
        }
      },
      "providers": {
        "sort": {
          "value": "Sort by Provider Type"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "URL de dominio:"
              },
              "version": {
                "label": "Versi\\u00F3n de dominio:"
              },
              "username": {
                "label": "Username:"
              }
            }
          },
          "model": {
            "file": {
              "label": "File:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "Export Providers as Project..."
        },
        "import": {
          "value": "Importar Proyecto"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Enter new name and connectivity settings for connection provider."
        },
        "edit": {
          "value": "Modify connectivity settings for connection provider."
        }
      },
      "models": {
        "add": {
          "value": "Enter settings for existing model file provider. Click upload icon to browse for model file."
        },
        "new": {
          "value": "Enter provider name and filename for new WDT model file, then click icon to pick directory to save file in."
        },
        "edit": {
          "value": "Modify settings for model file provider. Click icon to browse for model file."
        }
      },
      "project": {
        "export": {
          "value": "Enter settings for new project."
        },
        "import": {
          "value": "Click download icon to browse for project."
        }
      },
      "task": {
        "startup": {
          "value": "Which startup task are you interested in performing?"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Create Provider for Admin Server Connection"
        },
        "models": {
          "value": "Create Provider for Existing WDT Model File"
        }
      },
      "new": {
        "models": {
          "value": "Create Provider for New WDT Model File"
        }
      },
      "edit": {
        "connections": {
          "value": "Edit Admin Server Connection Provider"
        },
        "models": {
          "value": "Edit WDT Model File Provider"
        }
      },
      "export": {
        "project": {
          "value": "Export Providers as Project"
        }
      },
      "import": {
        "project": {
          "value": "Importar Proyecto"
        }
      },
      "startup": {
        "task": {
          "value": "Startup Task"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Export Unsuccessful",
          "detail": "Unable to export providers as ''{0}'' project."
        }
      },
      "import": {
        "failed": {
          "summary": "Save Unsuccessful",
          "detail": "Unable to import ''{0}'' project file."
        }
      },
      "stage": {
        "failed": {
          "summary": "Create Unsuccessful",
          "detail": "Unable to create ''{0}'' provider item."
        }
      },
      "use": {
        "failed": {
          "summary": "Connection Unsuccessful",
          "detail": "Unable to use ''{0}'' provider item."
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "Provider named ''{0}'' is already in this project!"
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "No definido"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Editar \\u00C1rbol"
      },
      "view": {
        "tooltip": "Configuration View Tree"
      },
      "monitoring": {
        "tooltip": "Monitoring Tree"
      },
      "modeling": {
        "tooltip": "WDT Model"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Inicio",
      "configuration": "Editar \\u00C1rbol",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Inicio"
        },
        "preferences": {
          "label": "Preferencias"
        },
        "search": {
          "label": "Buscar"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "Carro de compra"
        },
        "ataglance": {
          "label": "Visi\\u00F3n r\\u00E1pida"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "Quiosco"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Historial"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Borrar historial"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Datos no disponibles"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Historial"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Borrar historial"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Datos no disponibles"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "ejecut\\u00E1ndose a las {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Conexi\\u00F3n perdida",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "Fallo al intentar la conexi\\u00F3n",
        "detail": "No se puede conectar al dominio de WebLogic {0}, compruebe que WebLogic se est\\u00E1 ejecutando."
      }
    },
    "dialog1": {
      "title": "Conectar al dominio de WebLogic",
      "instructions": "Introduzca las credenciales del usuario administrador y la URL para el dominio de WebLogic:",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "Conectar"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Galer\\u00EDa"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Editar \\u00C1rbol",
        "description": "<p>Mantener la configuraci\\u00F3n del dominio de WebLogic con el que est\\u00E1 trabajando actualmente.</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>Examinar la configuraci\\u00F3n de solo lectura del dominio de WebLogic con el que est\\u00E1 trabajando actualmente.</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>Ver la informaci\\u00F3n del MBean de tiempo de ejecuci\\u00F3n para los recursos seleccionados del dominio de WebLogic con el que est\\u00E1 trabajando actualmente.</p>"
      },
      "modeling": {
        "label": "WDT Model Tree",
        "description": "<p>Maintain model files associated with the WebLogic Deploy Tooling tool.</p>"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "Desechar cambios"
      },
      "commit": {
        "tooltip": "Confirmar Cambios"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Gestor de cambios"
      },
      "additions": {
        "label": "Adiciones"
      },
      "modifications": {
        "label": "Modificaciones"
      },
      "removals": {
        "label": "Eliminaciones"
      },
      "restart": {
        "label": "Reiniciar"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "Nuevo"
      },
      "clone": {
        "label": "Clonar"
      },
      "delete": {
        "label": "Suprimir"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "P\\u00E1gina de llegada"
      },
      "history": {
        "tooltip": "Conmutar visibilidad del historial"
      },
      "instructions": {
        "tooltip": "Conmutar visibilidad de las instrucciones"
      },
      "help": {
        "tooltip": "Conmutar visibilidad de la p\\u00E1gina de ayuda"
      },
      "sync": {
        "tooltip": "Recargar",
        "tooltipOn": "Parar recarga autom\\u00E1tica"
      },
      "syncInterval": {
        "tooltip": "Definir intervalo de recarga autom\\u00E1tica"
      },
      "shoppingcart": {
        "tooltip": "Haga clic para ver acciones para el carro"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Ver Cambios"
        },
        "discard": {
          "label": "Desechar cambios"
        },
        "commit": {
          "label": "Confirmar Cambios"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Seleccione los elementos en los que desea realizar la operaci\\u00F3n ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Mensaje",
          "detail": "No se puede realizar la acci\\u00F3n ''{0}'' mientras se est\\u00E1 ejecutando la recarga autom\\u00E1tica. Primero, haga clic en el icono ''{1}'' para pararla."
        }
      }
    },
    "labels": {
      "start": {
        "value": "Iniciar"
      },
      "resume": {
        "value": "Reanudar"
      },
      "suspend": {
        "value": "Suspender"
      },
      "shutdown": {
        "value": "Cerrar"
      },
      "restartSSL": {
        "value": "Reiniciar SSL"
      },
      "stop": {
        "value": "Parar"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Mostrar columnas ocultas"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "Cancelar"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "Guardar"
      },
      "new": {
        "label": "Crear"
      },
      "delete": {
        "label": "Eliminar"
      },
      "back": {
        "label": "Atr\\u00E1s"
      },
      "next": {
        "label": "Siguiente"
      },
      "finish": {
        "label": "Crear"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Guardar"
      },
      "create": {
        "tooltip": "Crear"
      },
      "landing": {
        "tooltip": "P\\u00E1gina de llegada"
      },
      "history": {
        "tooltip": "Conmutar visibilidad del historial"
      },
      "instructions": {
        "tooltip": "Conmutar visibilidad de las instrucciones"
      },
      "help": {
        "tooltip": "Conmutar visibilidad de la p\\u00E1gina de ayuda"
      },
      "sync": {
        "tooltip": "Recargar",
        "tooltipOn": "Parar recarga autom\\u00E1tica"
      },
      "syncInterval": {
        "tooltip": "Definir intervalo de recarga autom\\u00E1tica"
      },
      "shoppingcart": {
        "tooltip": "Haga clic para ver acciones para el carro"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Ver Cambios"
        },
        "discard": {
          "label": "Desechar cambios"
        },
        "commit": {
          "label": "Confirmar Cambios"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Mostar Campos Avanzados"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Haga clic en el icono {0} para conmutar entre la ayuda resumida y la ayuda detallada."
      }
    },
    "messages": {
      "save": "Cambios agregados al carro"
    },
    "icons": {
      "restart": {
        "tooltip": "Es necesario reiniciar el servidor o la aplicaci\\u00F3n"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "Tabla de ayuda",
        "columns": {
          "header": {
            "name": "Nombre",
            "description": "Descripci\\u00F3n"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campos necesarios incompletos",
        "detail": "El campo {0} es necesario, pero no se ha proporcionado ning\\u00FAn valor."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Cancelar"
      },
      "yes": {
        "label": "S\\u00ED"
      },
      "no": {
        "label": "No"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "Conectar"
      },
      "add": {
        "label": "Add/Send"
      },
      "edit": {
        "label": "Edit/Send"
      },
      "import": {
        "label": "Import"
      },
      "export": {
        "label": "Export"
      },
      "write": {
        "label": "Actualizar Archivo"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "Reducir"
      },
      "expand": {
        "value": "Ampliar"
      },
      "choose": {
        "value": "Seleccionar Archivo"
      },
      "clear": {
        "value": "Borrar archivo seleccionado"
      },
      "more": {
        "value": "M\\u00E1s acciones"
      },
      "download": {
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "Enviar Cambios"
      },
      "write": {
        "value": "Actualizar Archivo"
      },
      "pick": {
        "value": "Pick Directory"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSubmitted": {
        "summary": "Changes were successfully submitted!"
      },
      "changesNotSubmitted": {
        "summary": "Unable to submit changes!"
      },
      "changesWritten": {
        "summary": "Changes were successfully written to ''{0}'' file!"
      },
      "changesNotWritten": {
        "summary": "Unable to write changes to ''{0}'' file!"
      }
    },
    "wdtOptionsDialog": {
      "title": "Edit: {0}",
      "default": "Default. (Unset)",
      "instructions": "Enter token to add to the list of selectable items.",
      "enterValue": "Introducir Valor",
      "selectValue": "Select Value",
      "selectSwitch": "Conmutar Valor",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "Se han detectado cambios sin guardar"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Todos los cambios sin guardar se perder\\u00E1n. \\u00BFDesea continuar?"
        },
        "areYouSure": {
          "value": "\\u00BFSeguro que desea salir sin guardar los cambios?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Definir intervalo de recarga autom\\u00E1tica",
      "instructions": "\\u00BFCu\\u00E1ntos segundos desea definir para el intervalo de recarga autom\\u00E1tica?",
      "fields": {
        "interval": {
          "label": "Intervalo de recarga autom\\u00E1tica:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Mensaje",
          "detail": "La llamada de backend de la consola ha generado una respuesta ''{0}'' al intentar realizar la acci\\u00F3n especificada en ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "No se puede determinar la causa exacta. Compruebe la consola de JavaScript para obtener indicaciones."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponibles",
        "chosen": "Seleccionados"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "Ver {0}..."
          },
          "create": {
            "label": "Crear Nuevo {0}..."
          },
          "edit": {
            "label": "Editar {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "Restaurar Valor por Defecto"
    },
    "placeholder": {
      "value": "por defecto"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "Mensaje",
        "detail": "RDJ no contiene un campo ''notFoundMessage'' para el elemento ''{0}''."
      }
    }
  },
  "wrc-ataglance": {
    "labels": {
      "running": {
        "value": "RUNNING"
      },
      "shutdown": {
        "value": "SHUTDOWN"
      },
      "serverStates": {
        "value": "Estados del Servidor"
      },
      "systemStatus": {
        "value": "Estado del Sistema"
      },
      "healthState": {
        "failed": {
          "value": "Con fallos"
        },
        "critical": {
          "value": "Cr\\u00EDtico"
        },
        "overloaded": {
          "value": "Sobrecargado"
        },
        "warning": {
          "value": "Advertencia"
        },
        "ok": {
          "value": "Correcto"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Estado de Servidores en Ejecuci\\u00F3n a"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "Nombre"
        },
        "state": {
          "value": "Estado"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "No se puede acceder al backend actualmente."
      },
      "connectionMessage": {
        "summary": "Mensaje de conexi\\u00F3n"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "Las credenciales del dominio de WebLogic no son v\\u00E1lidas "
      },
      "invalidUrl": {
        "detail": "No se puede acceder a la URL del dominio de WebLogic "
      },
      "notSupported": {
        "detail": "El dominio de WebLogic no est\\u00E1 soportado "
      },
      "unexpectedStatus": {
        "detail": "Resultado inesperado (estado: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Solicitud incorrecta",
          "detail": "Se ha devuelto una respuesta de error de una llamada de backend de consola."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Consulte el terminal de la consola remota o la consola de Javascript para obtener informaci\\u00F3n sobre los motivos espec\\u00EDficos."
      },
      "responseMessages": {
        "summary": "Mensajes de respuesta"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "No se puede acceder al gestor de cambios."
      },
      "changesCommitted": {
        "summary": "Los cambios se han confirmado correctamente."
      },
      "changesNotCommitted": {
        "summary": "No se pueden confirmar los cambios."
      },
      "changesDiscarded": {
        "summary": "Los cambios se han desechado correctamente."
      },
      "changesNotDiscarded": {
        "summary": "No se pueden desechar los cambios."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Respuesta de error inesperado"
      }
    }
  }
});