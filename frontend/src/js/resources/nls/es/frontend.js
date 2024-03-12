define({
  "wrc-header": {
    "text": {
      "appName": "Consola remota de WebLogic"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "Conmutar visibilidad del árbol de navegación"
        }
      },
      "theme": {
        "tooltip": "Switch theme"
      },
      "whatsNew": {
        "tooltip": "What's New!"
      },
      "howDoI": {
        "tooltip": "Open \"How Do I ...?\" Tasks"
      },
      "tips": {
        "tooltip": "Toggle User Tips visibility"
      },
      "help": {
        "tooltip": "Abrir documentación interna de la consola remota de WebLogic"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "Abrir centro de mensajes"
      },
      "theme": {
        "light": {
          "value": "Light"
        },
        "dark": {
          "value": "Dark"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright (c) 2020, 2024, Oracle y/o sus filiales.<br/> Oracle (r), Java, MySQL y NetSuite son marcas comerciales registradas de Oracle y/o sus filiales. Todos los demás nombres pueden ser marcas comerciales de sus respectivos propietarios.<br/>",
      "builtWith": "Creado con Oracle JET"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "No seguro"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "Conexión de servidor de administración no segura"
      }
    }
  },
  "wrc-app-profile": {
    "icons": {
      "profile": {
        "popup": {
          "launcher": {
            "tooltip": "Show Profiles List"
          }
        },
        "dialog": {
          "launcher": {
            "tooltip": "Gestionar Perfiles"
          },
          "editor": {
            "tooltip": "Profile Editor",
            "toolbar": {
              "save": {
                "tooltip": "Save Profile"
              },
              "activate": {
                "tooltip": "Active Profile"
              },
              "add": {
                "tooltip": "Agregar Perfil"
              },
              "remove": {
                "tooltip": "Suprimir Perfil"
              }
            }
          }
        },
        "image": {
          "tooltip": "Profile",
          "capture": {
            "tooltip": "Add or change image"
          }
        }
      }
    },
    "tabstrip": {
      "tabs": {
        "general": {
          "value": "General"
        },
        "settings": {
          "value": "Configuración"
        },
        "preferences": {
          "value": "Preferencias"
        },
        "properties": {
          "value": "Propiedades"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "Cambiar imagen"
      },
      "clearImage": {
        "value": "Clear Image"
      },
      "profile": {
        "default": {
          "value": "Perfil por Defecto"
        },
        "toggler": {
          "editor": {
            "show": {
              "value": "Show Profile Editor"
            },
            "hide": {
              "value": "Hide Profile Editor"
            }
          }
        }
      }
    },
    "popup": {
      "profile": {
        "manager": {
          "open": {
            "value": "Open Profile Manager"
          },
          "signout": {
            "value": "Cerrar sesión"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "Identificador de Perfil"
          },
          "organization": {
            "value": "Organization"
          },
          "name": {
            "value": "Nombre"
          },
          "email": {
            "value": "Email"
          },
          "role": {
            "default": {
              "value": "Use as Default Profile"
            }
          },
          "settings": {
            "useCredentialStorage": {
              "value": "¿Desea almacenar las credenciales cifradas para los proyectos?"
            },
            "disableHNV": {
              "value": "¿Desactivar la verificación del nombre de host?"
            },
            "proxyAddress": {
              "value": "Dirección de Proxy"
            },
            "trustStoreType": {
              "value": "Tipo de Almacenamiento de Confianza"
            },
            "trustStorePath": {
              "value": "Ruta de Acceso del Almacén de Confianza"
            },
            "trustStoreKey": {
              "value": "Clave de almacén de confianza"
            },
            "connectionTimeout": {
              "value": "Timeout de conexión con el servidor de administración"
            },
            "readTimeout": {
              "value": "Timeout de lectura del servidor de administración"
            }
          },
          "preferences": {
            "theme": {
              "value": "Theme"
            },
            "startupTaskChooserType": {
              "value": "Startup Task Chooser Type"
            },
            "useMenusAsRootNodes": {
              "value": "Use Tree Menus as the root level of Tree Navigators?"
            },
            "onQuit": {
              "value": "Allow unsaved changes to prevent exiting application?"
            },
            "onDelete": {
              "value": "Confirm all deletions?"
            },
            "onActionNotAllowed": {
              "value": "Use \"Action Not Allowed\" popup to prevent data loss?"
            },
            "onUnsavedChangesDetected": {
              "value": "Use \"Unsaved Changes Detected\" popup to prevent data loss?"
            },
            "onChangesNotDownloaded": {
              "value": "Use \"Changes Not Download\" popup to prevent data loss?"
            }
          },
          "properties": {
            "javaSystemProperties": {
              "value": "Java System Properties"
            }
          }
        },
        "legalValues": {
          "themeOptions": {
            "light": {
              "value": "Light"
            },
            "dark": {
              "value": "Dark"
            }
          },
          "taskChooserTypeOptions": {
            "useDialog": {
              "value": "Use Dialog"
            },
            "useCards": {
              "value": "Use Cards"
            }
          },
          "trustStoreTypeOptions": {
            "jks": {
              "value": "JKS"
            },
            "pkcs12": {
              "value": "PKCS12"
            },
            "windowsRoot": {
              "value": "Windows ROOT"
            },
            "keyChainStore": {
              "value": "Key Chain Store"
            }
          }
        },
        "messages": {
          "save": {
            "succeeded": {
              "summary": "Profile \"{0}\" was saved successfully!"
            }
          }
        }
      }
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
        "tooltip": "Desactivar"
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
        "proxyOverride": {
          "value": "Anulación de Proxy"
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
        "project": {
          "name": {
            "label": "Nombre de proyecto:"
          }
        },
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
          "proxyOverride": {
            "label": "Anulación de Proxy:"
          },
          "version": {
            "label": "Versión de dominio:"
          },
          "username": {
            "label": "Nombre de usuario:"
          },
          "sso": {
            "label": "SSO:"
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
          "insecure": {
            "label": "No seguro:"
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
      },
      "project-busy": {
        "value": "Guarde o abandone los cambios no guardados antes de realizar cambios en cualquier parte del proyecto"
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
      },
      "project-busy": {
        "value": "Proyecto ocupado"
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
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
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
        "fileNotSet": {
          "value": "No definido"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usar plantilla ligera"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "Continuar con la conexión no segura"
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
        "tooltip": "Árbol de datos de seguridad"
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
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "Tira de navegación"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "Árbol de Navegación"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Inicio",
      "configuration": "Editar Árbol",
      "view": "Configurar árbol de vista",
      "monitoring": "Supervisar árbol",
      "security": "Árbol de datos de seguridad",
      "modeling": "Modelo WDT",
      "composite": "Modelo de compuesto WDT",
      "properties": "Lista de propiedades"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Inicio"
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
          "label": "Providers"
        },
        "tips": {
          "label": "User Tips"
        },
        "dashboards": {
          "label": "Paneles de control"
        }
      }
    },
    "popups": {
      "tips": {
        "title": "Filter Tips",
        "checkboxes": {
          "hideall": "Hide All Tips",
          "productivity": "Show Productivity Tips",
          "personalization": "Show Personalization Tips",
          "whereis": "Show Where Is... Tips",
          "accessibility": "Show Accessibility Tips",
          "connectivity": "Show Connectivity Tips",
          "security": "Show Security Tips",
          "other": "Show Other Tips"
        }
      }
    },
    "tips": {
      "labels": {
        "hideall": {
          "value": "Ocultar Todo"
        },
        "productivity": {
          "value": "Productivity"
        },
        "personalization": {
          "value": "Personalization"
        },
        "whereis": {
          "value": "Where Is ..."
        },
        "accessibility": {
          "value": "Accessibility"
        },
        "connectivity": {
          "value": "Connectivity"
        },
        "security": {
          "value": "Seguridad"
        },
        "other": {
          "value": "Other"
        }
      },
      "cards": {
        "tip0": {
          "title": "Think \"Search\" Before You Click!",
          "descriptionHTML": "<p>Finding what you want in one of the provider's Trees, can involve a lot of clicking and scrolling. The <b><i>Search</i></b> field (located at the top of the app), lets you avoid having to do that!</p><p>Even better, clicking on an item in the generated search results, auto-expands the provider Tree to show you where the item is.</p>"
        },
        "tip1": {
          "title": "\"Dashboards\" Are a User's Best Friend",
          "descriptionHTML": "<p>A <b><i>Dashboard</i></b> lets you define the criteria used to select MBean instances. They function kind of like a View in the database world, allowing you to see all the MBean instances with runtime values that currently meet the criteria.</p><p>Look for the <img src=\"js/jet-composites/wrc-frontend/1.0.0/images/dashboards-tabstrip-icon_24x24.png\" alt=\"New Dashboard Icon\" style=\"height: 24px; width: 24px; vertical-align: middle;\"/> button whenever you''re on a page of the \"Monitoring Tree\", then click it to define a new dashboard. Previously created ones, can be found under the root-level \"Dashboards\" node in the Monitoring Tree.</p>"
        },
        "tip2": {
          "title": "Choosing and Arranging Table Columns Using \"Customize Table\"",
          "descriptionHTML": "<p>The \"Customize this table\" link is now the <i>Customize Table</i> button.</p>"
        },
        "tip3": {
          "title": "Using the Keyboard With Tables and Actions",
          "descriptionHTML": "<p></p>"
        },
        "tip4": {
          "title": "Where is the \"Customize this table\" Link?",
          "descriptionHTML": "<p>The \"Customize this table\" link is now the <i>Customize Table</i> button.</p>"
        },
        "tip5": {
          "title": "Where is the \"Change Center\" Portlet?",
          "descriptionHTML": "<p>The \"Change Center\" porlet has been replaced with the <i>Shopping Cart Drawer</i>, which has launcher icon in the iconbar when the \"Configuration Tree\" is selected.</p>"
        },
        "tip6": {
          "title": "Where is the \"How Do I\" Portlet?",
          "descriptionHTML": "<p></p>"
        },
        "tip7": {
          "title": "Other Tip #1",
          "descriptionHTML": "<p>A terse description for \"Other Tip #1\". A newline character is not an HTML element, so you don''t want to use them in this description.</p>"
        },
        "tip8": {
          "title": "Trouble Creating an Admin Server Provider?",
          "descriptionHTML": "<p>The <a href='#' tabindex='0' on-click data-url='@@docsURL@@reference/troubleshoot/'>Reference -> Troubleshooting</a> section in the WebLogic Remote Console documentation, covers how to resolve connectivity issues caused by environment and network settings.</p><p>If trying those don't lead to a resolution, please post a message to the <b>@weblogic-remote-console</b> slack channel. Screenshots often provide context that aids in issue diagnosis, so include them in the post when possible.</p>"
        },
        "tip9": {
          "title": "Connectivity Tip #2",
          "descriptionHTML": "<p>A terse description for \"Connectivity Tip #2\". A newline character is not an HTML element, so you don''t want to use them in this description.</p>"
        },
        "tip10": {
          "title": "Security Tip #1",
          "descriptionHTML": "<p>A terse description for \"Security Tip #1\". A newline character is not an HTML element, so you don''t want to use them in this description.</p>"
        },
        "tip11": {
          "title": "Think \"Shortcut Keys\" Before You Press Tab!",
          "descriptionHTML": "<p>\"Shortcut\" (or accelerator) keys allow you to move the focus directly to an area, instead of sighing while repeatedly pressing the <b>Tab</b> and <b>Shift+Tab</b> keys!</p><p>Here's 5 to try out:</p><p><ul><li><code><b>Ctrl+Alt+P</b></code>&nbsp;&nbsp;&nbsp;Opens the <i>Providers Drawer</i>.</li><li><code><b>Ctrl+Alt+N</b></code>&nbsp;&nbsp;&nbsp;Moves the focus to the <i>Provider Tree</i>.</li><li><code><b>Ctrl+Alt+T</b></code>&nbsp;&nbsp;&nbsp;Moves the focus to a table, more precisely the first column header.</li><li><code><b>Ctrl+Alt+|</b></code>&nbsp;&nbsp;&nbsp;Moves the focus to the gripper of the Tree width-resizer. Afterwards, use the <code><b>RightArrow</b></code> and <code><b>LeftArrow</b></code> keys to increase or decrease the width of the Tree.</li><li><code><b>Ctrl+Alt+;</b></code>&nbsp;&nbsp;&nbsp;Moves the focus to a breadcrumb that is a <i>cross-link</i> (if present), or the first clickable breadcrumb label.</li></ul><p>Check out the documentation to see a complete list of the shortcut keys!</p>"
        }
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Historial"
      },
      "separator": {
        "tooltip": "Separador"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Borrar entradas del historial",
          "label": "Borrar entradas del historial"
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
          "label": "Árboles"
        },
        "startup-tasks": {
          "label": "Startup Tasks"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Editar Árbol",
        "description": "<p>Mantener la configuración del dominio de WebLogic con el que está trabajando actualmente.</p>"
      },
      "view": {
        "label": "Configurar árbol de vista",
        "description": "<p>Examinar la configuración de solo lectura del dominio de WebLogic con el que está trabajando actualmente.</p>"
      },
      "monitoring": {
        "label": "Supervisar árbol",
        "description": "<p>Ver la información del MBean de tiempo de ejecución para los recursos seleccionados del dominio de WebLogic con el que está trabajando actualmente.</p>"
      },
      "security": {
        "label": "Árbol de datos de seguridad",
        "description": "<p>Gestionar información relacionada con la seguridad (por ejemplo, usuarios, grupos, roles, políticas, credenciales, etc.) en el dominio de WebLogic en el que está trabajando actualmente.</p>"
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
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "Agregar proveedor de conexión de servidor de administración",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "Agregar proveedor de archivo de modelo WDT",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "Agregar proveedor de archivo de modelo de compuesto WDT",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "Agregar proveedor de lista de propiedades",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "Crear proveedor para el nuevo archivo de modelo WDT",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "Crear proveedor para nueva lista de propiedades",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "Importar Proyecto",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
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
    "prompts": {
      "download": {
        "value": "Ubicaciones de archivos log descargados:"
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
        "value": "Recargue la tabla para ver los valores {0} actuales"
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
      },
      "dashboard": {
        "label": "Nuevo Panel de Control"
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
        "shoppingcart": "Cambios agregados al carro",
        "generic": "Cambios guardados",
        "notSaved": "No se ha guardado nada porque no se ha detectado ningún cambio."
      },
      "action": {
        "notAllowed": {
          "summary": "Acción no permitida",
          "detail": "No se puede realizar la acción solicitada durante una operación de creación. Haga clic en el botón Cancelar para cancelar la operación de creación."
        }
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
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>Temas relacionados:</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "Atributos"
      },
      "actions": {
        "label": "Acciones"
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
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "Agregar condición"
        },
        "combine": {
          "label": "Combinar"
        },
        "uncombine": {
          "label": "Anular combinación"
        },
        "moveup": {
          "label": "Mover hacia arriba"
        },
        "movedown": {
          "label": "Mover hacia abajo"
        },
        "remove": {
          "label": "Eliminar"
        },
        "negate": {
          "label": "Negar"
        },
        "reset": {
          "label": "Restablecer"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "Agregar nueva primera condición..."
          },
          "above": {
            "label": "Agregar condición por encima de la fila seleccionada..."
          },
          "below": {
            "label": "Agregar condición por debajo de la fila seleccionada..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "Agregar condición por encima de la marcada..."
          },
          "below": {
            "label": "Agregar condición por debajo de la marcada..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "Uno o varios campos necesarios no contienen datos."
      },
      "argumentValueHasWrongFormat": {
        "summary": "El campo ''{0}'' contiene datos con formato incorrecto."
      },
      "conditionHasNoArgValues": {
        "summary": "La condición seleccionada no tiene ningún valor de argumento para editar."
      },
      "conditionAlreadyExists": {
        "summary": "Esta política de seguridad ya tiene una condición creada con el predicado seleccionado o con un predicado con los mismos valores de argumento."
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>Para especificar la ubicación de la nueva condición, ponga una marca junto a la condición relativa y haga clic en el botón <b>+Agregar condición</b>.</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "Rango: De -31 a 31"
      },
      "dateTime": {
        "value": "Formato: y-MM-dd HH:mm:ss [HH:mm:ss] (por ejemplo: 2006-04-25 00:00:00)"
      },
      "time": {
        "value": "Formato: HH:mm:ss (por ejemplo: 14:22:47)"
      },
      "gmtOffset": {
        "value": "Formato: GMT+|-h:mm (por ejemplo: GMT-5:00)"
      },
      "weekDay": {
        "value": "Por ejemplo: lunes, martes, miércoles..."
      },
      "or": {
        "value": "o"
      },
      "not": {
        "value": "no"
      },
      "combination": {
        "value": "Combinación"
      },
      "nodata": {
        "Policy": {
          "value": "Utilice el botón <b>+ Agregar condición</b> para agregar una condición de política."
        },
        "DefaultPolicy": {
          "value": "No se ha definido ninguna condición de política de seguridad."
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "Combinación",
            "operator": "Operador",
            "expression": "Expresión de condición"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "OR",
            "and": "AND"
          }
        }
      }
    },
    "wizard": {
      "title": "Gestión de Políticas",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "Seleccionar Predicado",
            "instructions": "Seleccione el predicado de la nueva condición de la lista desplegable"
          },
          "body": {
            "labels": {
              "predicateList": "Lista de Predicados"
            },
            "help": {
              "predicateList": "La lista de predicados es una lista de predicados disponibles que se pueden utilizar para formar una condición de política de seguridad."
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "Predicado de Grupo",
            "instructions": "Empiece a escribir en el campo <i></i> para agregar valores de argumento o buscar valores existentes. Pulse Intro para agregar el valor introducido a la lista. Para editar el valor de argumento existente, haga clic en él y modifíquelo utilizando el campo de entrada emergente."
          },
          "body": {
            "labels": {
              "conditionPhrase": "Expresión de condición",
              "negate": "Negar condición"
            },
            "help": {
              "negate": "Convierte la condición para que tenga el significado opuesto (por ejemplo, \"igual a\" se convierte en \"distinto de\", \"en\" se convierte en \"no en\")."
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "Acción"
      },
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
      "restart": {
        "label": "Reiniciar"
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
      },
      "next": {
        "label": "Siguiente"
      },
      "previous": {
        "label": "Anterior"
      },
      "finish": {
        "label": "Finalizar"
      },
      "done": {
        "label": "Listo"
      },
      "close": {
        "label": "Cerrar"
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
      "filter": {
        "value": "Filtro"
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
      },
      "delete": {
        "value": "Suprimir"
      },
      "remove": {
        "value": "Eliminar"
      },
      "noData": {
        "value": "Sin datos"
      },
      "preloader": {
        "value": "Precargador"
      },
      "checkAll": {
        "value": "Marcar todo"
      },
      "checkNone": {
        "value": "Desactivar Todo"
      },
      "checkSome": {
        "value": "Borrar marcados"
      },
      "close": {
        "value": "Cerrar"
      },
      "recentPages": {
        "value": "Conmutar visibilidad del historial"
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
    },
    "title": {
      "incorrectFileContent": {
        "value": "Contenido incorrecto detectado"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}'' contiene JSON, pero no es una representación de JSON de {1}."
      },
      "dataCopiedToClipboard": {
        "summary": "Los datos se han copiado en el portapapeles."
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "No se han copiado los datos en el portapapeles porque la celda seleccionada está vacía."
      },
      "emptyRowData": {
        "detail": "No se han copiado los datos en el portapapeles porque la fila seleccionada está vacía."
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "Copiar celda en el portapapeles"
        },
        "row": {
          "label": "Copiar Fila en Portapapeles"
        },
        "tableAsText": {
          "label": "Copy Table to Clipboard (Text)"
        },
        "tableAsJSON": {
          "label": "Copy Table to Clipboard (JSON)"
        },
        "tableAsYAML": {
          "label": "Copy Table to Clipboard (YAML)"
        }
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
      "default": "Anular definición de valor",
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
      "multiSelectUnset": "Seleccionar valor de la lista de elementos disponibles"
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
          "value": "¿Seguro que desea {0} sin guardar los cambios?"
        },
        "saveBeforeExiting": {
          "value": "¿Desea guardar los cambios antes de salir?"
        },
        "needDownloading": {
          "value": "Sus cambios de ''{0}'' no se han descargado en el archivo.<br/><br/>¿Desea descargarlos antes de continuar?"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "La nueva instancia ''{0}'' no se ha agregado al modelo WDT.<br/><br/>¿Desea agregarla antes de continuar?"
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
          "detail": "La llamada de backend de la consola ha generado una respuesta ''{0}'' al intentar realizar la acción ''{1}''"
        },
        "actionNotPerformed": {
          "detail": "No se ha podido realizar la acción ''{0}'' en uno o varios de los elementos marcados"
        },
        "actionSucceeded": {
          "summary": "La acción ''{0}'' se ha realizado correctamente."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "No se puede determinar la causa exacta. Compruebe la consola de JavaScript para obtener indicaciones."
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "Confirmación de acción",
        "prompt": "La acción ''{0}'' no se puede deshacer.<br/><br/>¿Desea continuar?"
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
        "detail": "No se ha podido procesar el archivo o la solicitud enviados"
      },
      "invalidCredentials": {
        "detail": "Las credenciales del dominio de WebLogic no son válidas"
      },
      "invalidUrl": {
        "detail": "No se puede acceder a la URL del dominio de WebLogic"
      },
      "notInRole": {
        "detail": "Intento con fallos: el usuario no es administrador, desplegador, operador o supervisor"
      },
      "notSupported": {
        "detail": "El dominio de WebLogic no está soportado"
      },
      "unexpectedStatus": {
        "detail": "Resultado inesperado (estado: {0})"
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
      },
      "pathNotFound": {
        "summary": "No se ha encontrado la ruta",
        "details": "''{0}'' no es un archivo o directorio accesible en el sistema de archivos local."
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "Borrar Mensaje"
        },
        "suppress": {
          "info": {
            "label": "Suprimir mensajes informativos"
          },
          "warning": {
            "label": "Suprimir advertencias"
          }
        }
      }
    }
  },
  "wrc-alerts": {
    "menus": {
      "alerts": {
        "error": {
          "value": "You have {0} high-priority error {1}"
        },
        "warning": {
          "value": "You have {0} high-priority warning {1}"
        },
        "info": {
          "value": "You have {0} high-priority information {1}"
        },
        "view": {
          "value": "Ver Alertas"
        }
      }
    },
    "labels": {
      "alerts": {
        "singular": {
          "value": "alert"
        },
        "plural": {
          "value": "alerts"
        }
      }
    }
  }
});