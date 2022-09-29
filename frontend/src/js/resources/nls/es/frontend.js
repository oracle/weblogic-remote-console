define({
  "wrc-header": {
    "text": {
      "appName": "Consola remota de WebLogic"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "En línea"
        },
        "offline": {
          "tooltip": "Fuera de línea"
        },
        "detached": {
          "tooltip": "Desasociado"
        },
        "unattached": {
          "tooltip": "No conectado"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright Â© 2020, 2022, Oracle y/o sus filiales.<br/>Oracle es una marca comercial registrada de Oracle Corporation y/o sus filiales. Todos los demás nombres pueden ser marcas comerciales de sus respectivos propietarios.<br/>",
      "builtWith": "Creado con Oracle JET"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Obtener Información"
      },
      "edit": {
        "tooltip": "Gestionar"
      },
      "deactivate": {
        "tooltip": "Deactivate"
      },
      "delete": {
        "tooltip": "Eliminar"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Proyecto sin nombre"
        },
        "name": {
          "value": "Nombre de proveedor de conexión"
        },
        "url": {
          "value": "URL"
        },
        "username": {
          "value": "Nombre de usuario"
        },
        "password": {
          "value": "Contraseña"
        }
      },
      "models": {
        "name": {
          "value": "Nombre de proveedor de modelo WDT"
        },
        "file": {
          "value": "Nombre de archivo de modelo WDT"
        },
        "props": {
          "value": "Variables de WDT"
        }
      },
      "composite": {
        "name": {
          "value": "Nombre de proveedor de modelo de compuesto WDT"
        },
        "providers": {
          "value": "Modelos WDT"
        }
      },
      "proplist": {
        "name": {
          "value": "Nombre de proveedor de lista de propiedades"
        },
        "file": {
          "value": "Nombre de archivo de lista de propiedades"
        }
      },
      "project": {
        "name": {
          "value": "Nombre de proyecto"
        },
        "file": {
          "value": "Nombre de archivo de proyecto"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Conexión de servidor de administración"
        },
        "model": {
          "value": "Agregar modelo WDT"
        }
      },
      "dropdown": {
        "none": {
          "value": "Ninguno"
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
            "label": "Versión de dominio:"
          },
          "username": {
            "label": "Nombre de usuario:"
          },
          "roles": {
            "label": "Roles:"
          },
          "connectTimeout": {
            "label": "Timeout de Conexión:"
          },
          "readTimeout": {
            "label": "Timeout de Lectura:"
          },
          "anyAttempt": {
            "label": "Intentos de conexión:"
          },
          "lastAttempt": {
            "label": "Último intento correcto:"
          }
        },
        "model": {
          "file": {
            "label": "Archivo:"
          },
          "props": {
            "label": "Variables:"
          }
        },
        "composite": {
          "models": {
            "label": "Modelos:"
          }
        },
        "proplist": {
          "file": {
            "label": "Nombre de archivo:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Agregar proveedor de conexión de servidor de administración"
        }
      },
      "models": {
        "add": {
          "value": "Agregar proveedor de archivo de modelo WDT"
        },
        "new": {
          "value": "Crear proveedor para el nuevo archivo de modelo WDT"
        }
      },
      "composite": {
        "add": {
          "value": "Agregar proveedor de archivo de modelo de compuesto WDT"
        }
      },
      "proplist": {
        "add": {
          "value": "Agregar proveedor de lista de propiedades"
        },
        "new": {
          "value": "Crear proveedor para nueva lista de propiedades"
        }
      },
      "providers": {
        "sort": {
          "value": "Ordenar por tipo de proveedor"
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
                "label": "Versión de dominio:"
              },
              "username": {
                "label": "Nombre de usuario:"
              }
            }
          },
          "model": {
            "file": {
              "label": "Archivo:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "Exportar proveedores como proyecto..."
        },
        "import": {
          "value": "Importar Proyecto"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Introduzca un nuevo nombre y la configuración de conectividad para el proveedor de conexión."
        },
        "edit": {
          "value": "Modifique la configuración de conectividad para el proveedor de conexión."
        }
      },
      "models": {
        "add": {
          "value": "Introduzca la configuración para el proveedor de archivo de modelo existente. Haga clic en el icono de carga para examinar el archivo de modelo."
        },
        "new": {
          "value": "Introduzca el nombre del proveedor y el nombre de archivo para el nuevo archivo de modelo WDT. A continuación, haga clic en el icono para elegir en qué directorio guardar el archivo."
        },
        "edit": {
          "value": "Modifique la configuración para el proveedor de archivo de modelo. Haga clic en el icono para examinar el archivo de modelo."
        }
      },
      "composite": {
        "add": {
          "value": "Introduzca un nuevo nombre y seleccione una lista de modelos ordenada para el proveedor de modelo de compuesto."
        },
        "edit": {
          "value": "Modifique la configuración para el proveedor de modelo de compuesto. Utilice una lista de modelos ordenada."
        }
      },
      "proplist": {
        "add": {
          "value": "Introduzca la configuración para el proveedor de lista de propiedades existente. Haga clic en el icono de carga para examinar un archivo de propiedades."
        },
        "new": {
          "value": "Introduzca el nombre del proveedor y el nombre de archivo para una nueva lista de propiedades. A continuación, haga clic en el icono para elegir en qué directorio guardar el archivo."
        },
        "edit": {
          "value": "Modifique la configuración para el proveedor de listas de propiedades. Haga clic en el icono para examinar un archivo de propiedades."
        }
      },
      "project": {
        "export": {
          "value": "Introduzca la configuración para un nuevo proyecto."
        },
        "import": {
          "value": "Haga clic en el icono de descarga para examinar un proyecto."
        }
      },
      "task": {
        "startup": {
          "value": "¿Qué tarea de inicio desea realizar?"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Crear proveedor para la conexión de servidor de administración"
        },
        "models": {
          "value": "Crear proveedor para el archivo de modelo WDT existente"
        },
        "composite": {
          "value": "Crear proveedor para nuevo modelo de compuesto WDT"
        },
        "proplist": {
          "value": "Crear proveedor para la lista de propiedades existente"
        }
      },
      "new": {
        "models": {
          "value": "Crear proveedor para el nuevo archivo de modelo WDT"
        },
        "proplist": {
          "value": "Crear proveedor para nueva lista de propiedades"
        }
      },
      "edit": {
        "connections": {
          "value": "Editar proveedor de conexión de servidor de administración"
        },
        "models": {
          "value": "Editar proveedor de archivo de modelo WDT"
        },
        "composite": {
          "value": "Editar proveedor de archivo de modelo de compuesto WDT"
        },
        "proplist": {
          "value": "Editar proveedor de lista de propiedades"
        }
      },
      "export": {
        "project": {
          "value": "Exportar proveedores como proyecto"
        }
      },
      "import": {
        "project": {
          "value": "Importar Proyecto"
        }
      },
      "startup": {
        "task": {
          "value": "Tarea de inicio"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Exportación incorrecta",
          "detail": "No se han podido exportar los proveedores como proyecto ''{0}''."
        }
      },
      "import": {
        "failed": {
          "summary": "No se ha guardado correctamente",
          "detail": "No se ha podido importar el archivo de proyecto ''{0}''"
        }
      },
      "stage": {
        "failed": {
          "summary": "No se ha creado correctamente",
          "detail": "No se ha podido crear el elemento de proveedor ''{0}''."
        }
      },
      "use": {
        "failed": {
          "summary": "Conexión incorrecta",
          "detail": "No se ha podido utilizar el elemento de proveedor ''{0}''."
        }
      },
      "upload": {
        "failed": {
          "detail": "No se puede cargar el archivo de modelo WDT: {0}"
        },
        "props": {
          "failed": {
            "detail": "No se pueden cargar las variables de WDT: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "El proveedor con nombre ''{0}'' ya está en este proyecto."
        },
        "modelsNotFound": {
          "detail": "No se han encontrado los modelos WDT configurados ''{0}''"
        },
        "propListNotFound": {
          "detail": "No se encuentran las variables de ''{0}''"
        },
        "selectModels": {
          "detail": "Para seleccionar el compuesto WDT, seleccione primero todos los modelos WDT que utiliza el compuesto WDT."
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>Edite la ruta en el campo de nombre de archivo y haga clic en el botón Aceptar. Como alternativa, haga clic en el icono de carga y seleccione otro archivo.</p>"
        },
        "fixModelFile": {
          "detail": "<p>Corrija los problemas mencionados a continuación y haga clic en el botón Aceptar. Como alternativa, seleccione otro archivo.</p>"
        },
        "yamlException": {
          "detail": "{0} en la línea {1}, columna {2}"
        },
        "wktModelContent": {
          "summary": "Problemas de contenido de modelos",
          "detail": "Utilice el editor de modelos en el separador <i>Vista de código</i> para solucionar problemas."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "No definido"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usar plantilla ligera"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Editar Árbol"
      },
      "view": {
        "tooltip": "Configurar árbol de vista"
      },
      "monitoring": {
        "tooltip": "Supervisar árbol"
      },
      "security": {
        "tooltip": "Security Data Tree"
      },
      "modeling": {
        "tooltip": "Modelo WDT"
      },
      "composite": {
        "tooltip": "Modelo de compuesto WDT"
      },
      "properties": {
        "tooltip": "Editor de lista de propiedad"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Inicio",
      "configuration": "Editar Árbol",
      "view": "Configurar árbol de vista",
      "monitoring": "Supervisar árbol",
      "security": "Security Data Tree",
      "modeling": "Modelo WDT",
      "composite": "Modelo de compuesto WDT",
      "properties": "Lista de propiedades"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Inicio"
        },
        "preferences": {
          "label": "Preferencias"
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
          "label": "Visión rápida"
        },
        "projectmanagement": {
          "label": "Gestión de proveedores"
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
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "ejecutándose a las {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Conexión perdida",
        "detail": "Se ha perdido la conexión al backend de la consola remota. Compruebe que funciona o reinícielo y vuelva a probar el enlace."
      },
      "cannotConnect": {
        "summary": "Fallo al intentar la conexión",
        "detail": "No se puede conectar al dominio de WebLogic {0}, compruebe que WebLogic se está ejecutando."
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Galería"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Editar Árbol",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "Configurar árbol de vista",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "Supervisar árbol",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "Árbol de modelo WDT",
        "description": "<p>Mantener archivos de modelo asociados a la herramienta WebLogic Deploy Tooling.</p>"
      },
      "composite": {
        "label": "Árbol de modelo de compuesto WDT",
        "description": "<p>Ver un juego combinado de los archivos de modelo WebLogic Deploy Tooling con los que está trabajando actualmente.</p>"
      },
      "properties": {
        "label": "Editor de lista de propiedad",
        "description": "<p>Ver o modificar un conjunto de propiedades de un archivo de lista de propiedad.</p>"
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
      },
      "customize": {
        "label": "Personalizar Tabla"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Página de llegada"
      },
      "history": {
        "tooltip": "Conmutar visibilidad del historial"
      },
      "instructions": {
        "tooltip": "Conmutar visibilidad de las instrucciones"
      },
      "help": {
        "tooltip": "Conmutar visibilidad de la página de ayuda"
      },
      "sync": {
        "tooltip": "Recargar",
        "tooltipOn": "Parar recarga automática"
      },
      "syncInterval": {
        "tooltip": "Definir intervalo de recarga automática"
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
        "value": "Seleccione los elementos en los que desea realizar la operación ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Mensaje",
          "detail": "No se puede realizar la acción ''{0}'' mientras se está ejecutando la recarga automática. Primero, haga clic en el icono ''{1}'' para pararla."
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
    "labels": {
      "totalRows": {
        "value": "Total de Filas: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "Columnas disponibles"
      },
      "selected": {
        "value": "Columnas seleccionadas"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "Columnas insuficientes",
          "detail": "Se necesita al menos una columna seleccionada."
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
        "label": "Atrás"
      },
      "next": {
        "label": "Siguiente"
      },
      "finish": {
        "label": "Crear"
      },
      "customize": {
        "label": "Personalizar Tabla"
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
        "tooltip": "Página de llegada"
      },
      "history": {
        "tooltip": "Conmutar visibilidad del historial"
      },
      "instructions": {
        "tooltip": "Conmutar visibilidad de las instrucciones"
      },
      "help": {
        "tooltip": "Conmutar visibilidad de la página de ayuda"
      },
      "sync": {
        "tooltip": "Recargar",
        "tooltipOn": "Parar recarga automática"
      },
      "syncInterval": {
        "tooltip": "Definir intervalo de recarga automática"
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
      "savedTo": {
        "shoppingcart": "Changes were added to cart!",
        "customView": "Changes were saved!"
      }
    },
    "icons": {
      "restart": {
        "tooltip": "Es necesario reiniciar el servidor o la aplicación"
      },
      "wdtIcon": {
        "tooltip": "Configuración de WDT"
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
            "description": "Descripción"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campos necesarios incompletos",
        "detail": "El campo {0} es necesario, pero no se ha proporcionado ningún valor o se ha proporcionado un valor no válido."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "apply": {
        "label": "Aplicar"
      },
      "reset": {
        "label": "Restablecer"
      },
      "ok": {
        "label": "Aceptar"
      },
      "cancel": {
        "label": "Cancelar"
      },
      "yes": {
        "label": "Sí"
      },
      "no": {
        "label": "No"
      },
      "choose": {
        "label": "Seleccionar"
      },
      "connect": {
        "label": "Conectar"
      },
      "add": {
        "label": "Agregar/enviar"
      },
      "edit": {
        "label": "Editar/enviar"
      },
      "import": {
        "label": "Importar"
      },
      "export": {
        "label": "Exportar"
      },
      "write": {
        "label": "Descargar archivo"
      },
      "savenow": {
        "label": "Guardar Ahora"
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
        "value": "Más acciones"
      },
      "download": {
        "value": "Examinar"
      },
      "reset": {
        "value": "Restablecer"
      },
      "submit": {
        "value": "Enviar Cambios"
      },
      "write": {
        "value": "Descargar archivo"
      },
      "pick": {
        "value": "Seleccionar directorio"
      },
      "reload": {
        "value": "Volver a cargar archivo"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "Seleccionar Archivo..."
      },
      "chooseDir": {
        "value": "Seleccionar Directorio..."
      }
    },
    "labels": {
      "info": {
        "value": "Información"
      },
      "warn": {
        "value": "Advertencia"
      },
      "error": {
        "value": "Error"
      }
    },
    "placeholders": {
      "search": {
        "value": "Buscar"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "Los cambios se han guardado correctamente en el archivo ''{0}''."
      },
      "changesNotSaved": {
        "summary": "No se han podido guardar los cambios en el archivo ''{0}''."
      },
      "changesDownloaded": {
        "summary": "Los cambios se han descargado correctamente en el archivo ''{0}''."
      },
      "changesNotDownloaded": {
        "summary": "No se han podido descargar los cambios en el archivo ''{0}''."
      },
      "verifyPathEntered": {
        "detail": ". Si establece el campo {0} en falso se aceptará el valor competo, sin validar su existencia como un directorio o archivo local."
      }
    },
    "wdtOptionsDialog": {
      "title": "Editar: {0}",
      "default": "Por defecto. (Anular definición)",
      "instructions": "Introducir token para agregar a lista de elementos seleccionables.",
      "enterValue": "Introducir Valor",
      "selectValue": "Seleccionar valor",
      "selectSwitch": "Conmutar Valor",
      "enterUnresolvedReference": "Introducir referencia sin resolver",
      "enterModelToken": "Introducir token de modelo",
      "selectPropsVariable": "Seleccionar variable de token de modelo",
      "createPropsVariable": "Crear variable de token de modelo",
      "propName": "Nombre de variable (necesario)",
      "propValue": "Valor de Variable",
      "enterVariable": "Introducir variable",
      "variableName": "Nombre de variable (necesario)",
      "variableValue": "Valor de Variable",
      "multiSelectUnset": "\"Predeterminado. (Seleccionar de la lista de elementos disponibles)\""
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "Se han detectado cambios sin guardar"
      },
      "changesNeedDownloading": {
        "value": "Los cambios no se han descargado"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Todos los cambios sin guardar se perderán. ¿Desea continuar?"
        },
        "areYouSure": {
          "value": "¿Seguro que desea salir sin guardar los cambios?"
        },
        "saveBeforeExiting": {
          "value": "Do you want to save changes before exiting?"
        },
        "needDownloading": {
          "value": "Your changes have not been download to the file, yet.<br/><br/>Download them before continuing?"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "La nueva instancia ''{0}'' no se ha agregado aún al modelo WDT.<br/><br/>¿Desea agregarla antes de continuar?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Definir intervalo de recarga automática",
      "instructions": "¿Cuántos segundos desea definir para el intervalo de recarga automática?",
      "fields": {
        "interval": {
          "label": "Intervalo de recarga automática:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Mensaje",
          "detail": "La llamada de backend de la consola ha generado una respuesta ''{0}'' al intentar realizar la acción especificada en ''{1}''."
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
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "Nombre de propiedad",
        "value": "Valor de propiedad"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "Nombre de Propiedades",
        "valueHeader": "Valor de Propiedades",
        "addButtonTooltip": "Agregar",
        "deleteButtonTooltip": "Suprimir"
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
        "detail": "''{0}'' no está disponible."
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
          "value": "Crítico"
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
        "value": "Estado de Servidores en Ejecución a"
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
        "summary": "Mensaje de conexión"
      },
      "connectFailed": {
        "detail": "Intento con fallos: "
      },
      "badRequest": {
        "detail": "No se ha podido procesar el archivo o la solicitud enviados "
      },
      "invalidCredentials": {
        "detail": "Las credenciales del dominio de WebLogic no son válidas "
      },
      "invalidUrl": {
        "detail": "No se puede acceder a la URL del dominio de WebLogic "
      },
      "notInRole": {
        "detail": "Intento con fallos: el usuario no es administrador, desplegador, operador o supervisor"
      },
      "notSupported": {
        "detail": "El dominio de WebLogic no está soportado "
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
        "detail": "Consulte el terminal de la consola remota o la consola de Javascript para obtener información sobre los motivos específicos."
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
    },
    "messages": {
      "connectionRefused": {
        "summary": "Incidencia de conexión",
        "details": "Hay un problema al enviar y recibir datos del proveedor. Asegúrese de que son accesibles y vuelva a intentarlo."
      }
    }
  }
});