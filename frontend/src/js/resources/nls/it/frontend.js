define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "Attiva/disattiva la visibilità della struttura di navigazione"
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
        "tooltip": "Apre la documentazione interna di WebLogic Remote Console"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "Apre Message Center"
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
      "copyrightLegal": "Copyright © 2020-2024, Oracle e/o relative consociate. <br/>Oracle®, Java e MySQL e NetSuite sono marchi registrati di Oracle e/o delle relative consociate. Altri nomi possono essere marchi dei rispettivi proprietari.<br/>",
      "builtWith": "Creato con Oracle JET"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "Non sicura"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "Connessione al server di amministrazione non sicura"
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
            "tooltip": "Gestisci profili"
          },
          "editor": {
            "tooltip": "Profile Editor",
            "toolbar": {
              "save": {
                "tooltip": "Salva profilo"
              },
              "activate": {
                "tooltip": "Active Profile"
              },
              "add": {
                "tooltip": "Aggiungi profilo"
              },
              "remove": {
                "tooltip": "Delete Profile"
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
          "value": "Generale"
        },
        "settings": {
          "value": "Impostazioni"
        },
        "preferences": {
          "value": "Preferenze"
        },
        "properties": {
          "value": "Proprietà"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "Modifica immagine"
      },
      "clearImage": {
        "value": "Clear Image"
      },
      "profile": {
        "default": {
          "value": "Profilo predefinito"
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
            "value": "Sign out"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "Profile ID"
          },
          "organization": {
            "value": "Organization"
          },
          "name": {
            "value": "Nome"
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
              "value": "Memorizzare le credenziali cifrate per i progetti?"
            },
            "disableHNV": {
              "value": "Disabilitare la verifica del nome host?"
            },
            "proxyAddress": {
              "value": "Indirizzo proxy"
            },
            "trustStoreType": {
              "value": "Tipo truststore"
            },
            "trustStorePath": {
              "value": "Percorso truststore"
            },
            "trustStoreKey": {
              "value": "Chiave truststore"
            },
            "connectionTimeout": {
              "value": "Timeout di connessione del server di amministrazione"
            },
            "readTimeout": {
              "value": "Timeout di lettura del server di amministrazione"
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
        "tooltip": "Recupera informazioni"
      },
      "edit": {
        "tooltip": "Gestisci"
      },
      "deactivate": {
        "tooltip": "Disattiva"
      },
      "delete": {
        "tooltip": "Rimuovi"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Progetto senza nome"
        },
        "name": {
          "value": "Nome provider di connessione"
        },
        "url": {
          "value": "URL"
        },
        "proxyOverride": {
          "value": "Sostituzione proxy"
        },
        "username": {
          "value": "Nome utente"
        },
        "password": {
          "value": "Password"
        }
      },
      "models": {
        "name": {
          "value": "Nome provider modello WDT"
        },
        "file": {
          "value": "Nome file modello WDT"
        },
        "props": {
          "value": "Variabili WDT"
        }
      },
      "composite": {
        "name": {
          "value": "Nome provider modello composto WDT"
        },
        "providers": {
          "value": "Modelli WDT"
        }
      },
      "proplist": {
        "name": {
          "value": "Nome provider lista proprietà"
        },
        "file": {
          "value": "Nome file lista proprietà"
        }
      },
      "project": {
        "name": {
          "value": "Nome progetto"
        },
        "file": {
          "value": "Nome file progetto"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Connessione al server di amministrazione"
        },
        "model": {
          "value": "Aggiungi modello WDT"
        }
      },
      "dropdown": {
        "none": {
          "value": "Nessuna"
        }
      }
    },
    "popups": {
      "info": {
        "project": {
          "name": {
            "label": "Nome progetto:"
          }
        },
        "provider": {
          "id": {
            "label": "ID provider:"
          }
        },
        "domain": {
          "name": {
            "label": "Nome dominio:"
          },
          "url": {
            "label": "URL dominio:"
          },
          "proxyOverride": {
            "label": "Sostituzione proxy:"
          },
          "version": {
            "label": "Versione dominio:"
          },
          "username": {
            "label": "Nome utente:"
          },
          "sso": {
            "label": "SSO:"
          },
          "roles": {
            "label": "Ruoli:"
          },
          "connectTimeout": {
            "label": "Timeout di connessione:"
          },
          "readTimeout": {
            "label": "Timeout di lettura:"
          },
          "insecure": {
            "label": "Non sicuro:"
          },
          "anyAttempt": {
            "label": "Tutti i tentativi di connessione:"
          },
          "lastAttempt": {
            "label": "Ultimo tentativo riuscito:"
          }
        },
        "model": {
          "file": {
            "label": "File:"
          },
          "props": {
            "label": "Variabili:"
          }
        },
        "composite": {
          "models": {
            "label": "Modelli:"
          }
        },
        "proplist": {
          "file": {
            "label": "Nome file:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Aggiungi provider di connessione al server di amministrazione"
        }
      },
      "models": {
        "add": {
          "value": "Aggiungi provider di file modello WDT"
        },
        "new": {
          "value": "Crea provider per nuovo file modello WDT"
        }
      },
      "composite": {
        "add": {
          "value": "Aggiungi provider di file modello composto WDT"
        }
      },
      "proplist": {
        "add": {
          "value": "Aggiungi provider di lista proprietà"
        },
        "new": {
          "value": "Crea provider per nuova lista proprietà"
        }
      },
      "providers": {
        "sort": {
          "value": "Ordina per tipo di provider"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "URL dominio:"
              },
              "version": {
                "label": "Versione dominio:"
              },
              "username": {
                "label": "Nome utente:"
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
          "value": "Esporta provider come progetto..."
        },
        "import": {
          "value": "Importa progetto"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Immettere il nuovo nome e le impostazioni di connettività per il provider di connessione."
        },
        "edit": {
          "value": "Modificare le impostazioni di connettività per il provider di connessione."
        }
      },
      "models": {
        "add": {
          "value": "Immettere le impostazioni per il provider di file modello esistente. Fare clic sull'icona di caricamento per cercare il file modello."
        },
        "new": {
          "value": "Immettere il nome del provider e il nome file per il nuovo file modello WDT, quindi fare clic sull'icona per selezionare la directory in cui salvare il file."
        },
        "edit": {
          "value": "Modificare le impostazioni per il provider di file modello. Fare clic sull'icona per cercare il file modello."
        }
      },
      "composite": {
        "add": {
          "value": "Immettere il nuovo nome e selezionare una lista ordinata di modelli per il provider di modello composito."
        },
        "edit": {
          "value": "Modificare le impostazioni per il provider di modello composito. Utilizzare una lista ordinata di modelli."
        }
      },
      "proplist": {
        "add": {
          "value": "Immettere le impostazioni per il provider di lista proprietà esistente. Fare clic sull'icona di caricamento per cercare un file di proprietà."
        },
        "new": {
          "value": "Immettere il nome del provider e il nome file per una nuova lista di proprietà, quindi fare clic sull'icona per selezionare la directory in cui salvare il file."
        },
        "edit": {
          "value": "Modificare le impostazioni per il provider di lista proprietà. Fare clic sull'icona per cercare un file di proprietà."
        }
      },
      "project": {
        "export": {
          "value": "Immettere le impostazioni per il nuovo progetto."
        },
        "import": {
          "value": "Fare clic sull'icona di download per cercare il progetto."
        }
      },
      "task": {
        "startup": {
          "value": "Quale task di avvio si desidera eseguire?"
        }
      },
      "project-busy": {
        "value": "Salvare o annullare le modifiche non salvate prima di apportare modifiche a qualsiasi parte del progetto"
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Crea provider per la connessione al server di amministrazione"
        },
        "models": {
          "value": "Crea provider per file modello WDT esistente"
        },
        "composite": {
          "value": "Crea provider per nuovo modello composto WDT"
        },
        "proplist": {
          "value": "Crea provider per lista proprietà esistente"
        }
      },
      "new": {
        "models": {
          "value": "Crea provider per nuovo file modello WDT"
        },
        "proplist": {
          "value": "Crea provider per nuova lista proprietà"
        }
      },
      "edit": {
        "connections": {
          "value": "Modifica provider di connessione al server di amministrazione"
        },
        "models": {
          "value": "Modifica provider di file modello WDT"
        },
        "composite": {
          "value": "Modifica provider di modello composto WDT"
        },
        "proplist": {
          "value": "Modifica provider di lista proprietà"
        }
      },
      "export": {
        "project": {
          "value": "Esporta provider come progetto"
        }
      },
      "import": {
        "project": {
          "value": "Importa progetto"
        }
      },
      "startup": {
        "task": {
          "value": "Task di avvio"
        }
      },
      "project-busy": {
        "value": "Progetto occupato"
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Esportazione non riuscita",
          "detail": "Impossibile esportare i provider come progetto ''{0}''."
        }
      },
      "import": {
        "failed": {
          "summary": "Salvataggio non riuscito",
          "detail": "Impossibile importare il file di progetto ''{0}''."
        }
      },
      "stage": {
        "failed": {
          "summary": "Creazione non riuscita",
          "detail": "Impossibile creare l''elemento provider ''{0}''."
        }
      },
      "use": {
        "failed": {
          "summary": "Connessione non riuscita",
          "detail": "Impossibile usare l''elemento provider ''{0}''."
        }
      },
      "upload": {
        "failed": {
          "detail": "Impossibile caricare il file modello WDT: {0}"
        },
        "props": {
          "failed": {
            "detail": "Impossibile caricare le variabili WDT: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "Il provider denominato ''{0}'' è già in questo progetto."
        },
        "modelsNotFound": {
          "detail": "Impossibile trovare i modelli WDT configurati ''{0}''"
        },
        "propListNotFound": {
          "detail": "Impossibile trovare le variabili WDT: {0}"
        },
        "selectModels": {
          "detail": "Per selezionare il modello composto WDT, selezionare prima tutti i modelli WDT utilizzati dal modello composto WDT."
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>Modificare il percorso nel campo nomefile e fare clic sul pulsante OK. In alternativa, fare clic sull'icona di caricamento e scegliere un altro file.</p>"
        },
        "fixModelFile": {
          "detail": "<p>Risolvere i problemi indicati di seguito e fare clic su OK. In alternativa, scegliere un altro file.</p>"
        },
        "yamlException": {
          "detail": "{0} nella riga {1}, colonna {2}"
        },
        "wktModelContent": {
          "summary": "Problemi relativi al contenuto del modello",
          "detail": "Utilizzare l'editor di modelli nella scheda <i>Vista codice</i> per risolvere i problemi."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": {
          "value": "Non impostato"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usa modello di sparsità"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "Crea connessione non sicura"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Modifica struttura"
      },
      "view": {
        "tooltip": "Struttura vista configurazione"
      },
      "monitoring": {
        "tooltip": "Struttura di monitoraggio"
      },
      "security": {
        "tooltip": "Struttura dati di sicurezza"
      },
      "modeling": {
        "tooltip": "Modello WDT"
      },
      "composite": {
        "tooltip": "Modello composto WDT"
      },
      "properties": {
        "tooltip": "Editor di liste proprietà"
      }
    }
  },
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "Barra di navigazione"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "Struttura di navigazione"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Home",
      "configuration": "Modifica struttura",
      "view": "Struttura vista configurazione",
      "monitoring": "Struttura di monitoraggio",
      "security": "Struttura dati di sicurezza",
      "modeling": "Modello WDT",
      "composite": "Modello composto WDT",
      "properties": "Lista proprietà"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Home"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "Carrello"
        },
        "ataglance": {
          "label": "Panoramica"
        },
        "projectmanagement": {
          "label": "Providers"
        },
        "tips": {
          "label": "User Tips"
        },
        "dashboards": {
          "label": "Dashboard"
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
          "value": "Nascondi tutto"
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
          "value": "Sicurezza"
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
        "tooltip": "Cronologia"
      },
      "separator": {
        "tooltip": "Separatore"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Cancella voci cronologia",
          "label": "Cancella voci cronologia"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "in esecuzione alle ore {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Connessione interrotta",
        "detail": "La connessione al backend della console remota è stata persa. Assicurarsi che sia in esecuzione oppure riavviarlo e riprovare il collegamento."
      },
      "cannotConnect": {
        "summary": "Tentativo di connessione non riuscito",
        "detail": "Impossibile connettersi al dominio WebLogic {0}, verificare che WebLogic sia in esecuzione."
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Strutture"
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
        "label": "Modifica struttura",
        "description": "<p>Consente di gestire la configurazione del dominio WebLogic attualmente in uso.</p>"
      },
      "view": {
        "label": "Struttura vista configurazione",
        "description": "<p>Consente di esaminare la configurazione di sola lettura del dominio WebLogic attualmente in uso.</p>"
      },
      "monitoring": {
        "label": "Struttura di monitoraggio",
        "description": "<p>Consente di visualizzare le informazioni MBean di runtime relative a risorse specifiche nel dominio WebLogic attualmente in uso.</p>"
      },
      "security": {
        "label": "Struttura dati di sicurezza",
        "description": "<p>Consente di gestire le informazioni relative alla sicurezza (ad esempio, utenti, gruppi, ruoli, criteri, credenziali e così via) nel dominio WebLogic attualmente in uso.</p>"
      },
      "modeling": {
        "label": "Struttura modello WDT",
        "description": "<p>Gestisce i file modello associati allo strumento WebLogic Deploy Tooling.</p>"
      },
      "composite": {
        "label": "Struttura modello composto WDT",
        "description": "<p>Visualizza un set combinato di file modello WebLogic Deploy Tooling attualmente in uso.</p>"
      },
      "properties": {
        "label": "Editor di liste proprietà",
        "description": "<p>Consente di visualizzare o modificare un set di proprietà da un file di lista delle proprietà.</p>"
      }
    }
  },
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "Aggiungi provider di connessione al server di amministrazione",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "Aggiungi provider di file modello WDT",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "Aggiungi provider di file modello composto WDT",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "Aggiungi provider di lista proprietà",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "Crea provider per nuovo file modello WDT",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "Crea provider per nuova lista proprietà",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "Importa progetto",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "Annulla modifiche"
      },
      "commit": {
        "tooltip": "Commit delle modifiche"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Change Manager"
      },
      "additions": {
        "label": "Aggiunte"
      },
      "modifications": {
        "label": "Modifiche"
      },
      "removals": {
        "label": "Rimozioni"
      },
      "restart": {
        "label": "Riavvia"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "Nuovo"
      },
      "clone": {
        "label": "Duplica"
      },
      "delete": {
        "label": "Elimina"
      },
      "customize": {
        "label": "Personalizza tabella"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Pagina di arrivo"
      },
      "history": {
        "tooltip": "Attiva/disattiva visibilità della cronologia"
      },
      "instructions": {
        "tooltip": "Attiva/disattiva visibilità delle istruzioni"
      },
      "help": {
        "tooltip": "Attiva/disattiva visibilità della pagina della Guida"
      },
      "sync": {
        "tooltip": "Ricarica",
        "tooltipOn": "Interrompi ricaricamento automatico"
      },
      "syncInterval": {
        "tooltip": "Imposta intervallo di ricaricamento automatico"
      },
      "shoppingcart": {
        "tooltip": "Fare clic per visualizzare le azioni per il carrello"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Visualizza modifiche"
        },
        "discard": {
          "label": "Annulla modifiche"
        },
        "commit": {
          "label": "Commit delle modifiche"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Selezionare gli elementi su cui si desidera eseguire l''operazione ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Messaggio",
          "detail": "Impossibile eseguire l''azione ''{0}'' mentre è in esecuzione il ricaricamento automatico. Prima fare clic sull''icona ''{1}'' per interromperla."
        }
      }
    },
    "prompts": {
      "download": {
        "value": "Posizioni file di log scaricati:"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Mostra colonne nascoste"
      }
    },
    "labels": {
      "totalRows": {
        "value": "Totale righe: {0}"
      },
      "reloadHidden": {
        "value": "Ricaricare la tabella per visualizzare i {0} valori correnti"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "Colonne disponibili"
      },
      "selected": {
        "value": "Colonne selezionate"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "Colonne insufficienti",
          "detail": "Almeno una colonna selezionata è obbligatoria."
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "Salva"
      },
      "new": {
        "label": "Crea"
      },
      "delete": {
        "label": "Rimuovi"
      },
      "back": {
        "label": "Indietro"
      },
      "next": {
        "label": "Avanti"
      },
      "finish": {
        "label": "Crea"
      },
      "customize": {
        "label": "Personalizza tabella"
      },
      "dashboard": {
        "label": "Nuovo dashboard"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Salva"
      },
      "create": {
        "tooltip": "Crea"
      },
      "landing": {
        "tooltip": "Pagina di arrivo"
      },
      "history": {
        "tooltip": "Attiva/disattiva visibilità della cronologia"
      },
      "instructions": {
        "tooltip": "Attiva/disattiva visibilità delle istruzioni"
      },
      "help": {
        "tooltip": "Attiva/disattiva visibilità della pagina della Guida"
      },
      "sync": {
        "tooltip": "Ricarica",
        "tooltipOn": "Interrompi ricaricamento automatico"
      },
      "syncInterval": {
        "tooltip": "Imposta intervallo di ricaricamento automatico"
      },
      "shoppingcart": {
        "tooltip": "Fare clic per visualizzare le azioni per il carrello"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Visualizza modifiche"
        },
        "discard": {
          "label": "Annulla modifiche"
        },
        "commit": {
          "label": "Commit delle modifiche"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Mostra campi avanzati"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Fare clic sull''icona {0} per passare dal riepilogo alla Guida dettagliata e viceversa."
      }
    },
    "messages": {
      "savedTo": {
        "shoppingcart": "Le modifiche sono state aggiunte al carrello.",
        "generic": "Le modifiche sono state salvate.",
        "notSaved": "Nessun dato salvato perché non sono state rilevate modifiche."
      },
      "action": {
        "notAllowed": {
          "summary": "Azione non consentita",
          "detail": "Impossibile eseguire l'azione richiesta durante un'operazione di creazione. Fare clic sul pulsante Annulla per annullare l'operazione di creazione."
        }
      }
    },
    "icons": {
      "restart": {
        "tooltip": "Riavvio del server o dell'applicazione obbligatorio"
      },
      "wdtIcon": {
        "tooltip": "Impostazioni WDT"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "Tabella della Guida",
        "columns": {
          "header": {
            "name": "Nome",
            "description": "Descrizione"
          }
        }
      }
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>Argomenti correlati:</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "Attributi"
      },
      "actions": {
        "label": "Azioni"
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campi obbligatori incompleti",
        "detail": "Il campo {0} è obbligatorio, ma non è stato fornito alcun valore o ne è stato fornito uno non valido."
      }
    }
  },
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "Aggiungi condizione"
        },
        "combine": {
          "label": "Combina"
        },
        "uncombine": {
          "label": "Annulla combinazione"
        },
        "moveup": {
          "label": "Sposta in alto"
        },
        "movedown": {
          "label": "Sposta in basso"
        },
        "remove": {
          "label": "Rimuovi"
        },
        "negate": {
          "label": "Nega"
        },
        "reset": {
          "label": "Reimposta"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "Aggiungi nuova prima condizione..."
          },
          "above": {
            "label": "Aggiungi condizione sopra la riga su cui è stato fatto clic..."
          },
          "below": {
            "label": "Aggiungi condizione sotto la riga su cui è stato fatto clic..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "Aggiungi sopra la condizione selezionata..."
          },
          "below": {
            "label": "Aggiungi sotto la condizione selezionata..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "Uno o più campi obbligatori non contengono dati."
      },
      "argumentValueHasWrongFormat": {
        "summary": "Il campo ''{0}'' contiene dati formattati in modo non corretto."
      },
      "conditionHasNoArgValues": {
        "summary": "La condizione selezionata non contiene valori di argomento da modificare."
      },
      "conditionAlreadyExists": {
        "summary": "Questo criterio di sicurezza ha già una condizione creata utilizzando il predicato selezionato o uno con valori di argomento corrispondenti."
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>Per specificare la posizione della nuova condizione, inserire un segno di spunta accanto alla condizione relativa, quindi fare clic sul pulsante <b>+Aggiungi condizione</b>.</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "Intervallo: da -31 a 31"
      },
      "dateTime": {
        "value": "Formato: y-MM-dd HH:mm:ss [HH:mm:ss] (ad esempio 2006-04-25 00:00:00)"
      },
      "time": {
        "value": "Formato: HH:mm:ss (ad esempio 14:22:47)"
      },
      "gmtOffset": {
        "value": "Formato: GMT+|-h:mm (ad esempio GMT-5:00)"
      },
      "weekDay": {
        "value": "Ad esempio domenica, lunedì, martedì, ..."
      },
      "or": {
        "value": "OR"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "Combinazione"
      },
      "nodata": {
        "Policy": {
          "value": "Usare il pulsante <b>+ Aggiungi condizione</b> per aggiungere una condizione di criterio."
        },
        "DefaultPolicy": {
          "value": "Nessuna condizione di criterio di sicurezza predefinita definita."
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "Combinazione",
            "operator": "Operatore",
            "expression": "Frase condizione"
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
      "title": "Gestione criteri",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "Scegli predicato",
            "instructions": "Scegliere il predicato per la nuova condizione dall'elenco a discesa."
          },
          "body": {
            "labels": {
              "predicateList": "Lista di predicati"
            },
            "help": {
              "predicateList": "La lista di predicati contiene tutti i predicati disponibili che possono essere utilizzati per creare una condizione di criterio di sicurezza."
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "Predicato di gruppo",
            "instructions": "Iniziare digitando nel campo <i></i> per aggiungere i valori degli argomenti o per cercare i valori esistenti. Premere Invio per aggiungere il valore digitato alla lista. Per modificare un valore di argomento esistente, fare clic sul valore e modificarlo usando il campo di input della finestra popup."
          },
          "body": {
            "labels": {
              "conditionPhrase": "Frase condizione",
              "negate": "Nega condizione"
            },
            "help": {
              "negate": "Converte la condizione in modo da ottenere il significato contrario (ad esempio, \"uguale\" diventa \"diverso\", \"è in\" diventa \"non è in\")."
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "Azione"
      },
      "apply": {
        "label": "Applica"
      },
      "reset": {
        "label": "Reimposta"
      },
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Annulla"
      },
      "restart": {
        "label": "Riavvia"
      },
      "yes": {
        "label": "Sì"
      },
      "no": {
        "label": "No"
      },
      "choose": {
        "label": "Scegli"
      },
      "connect": {
        "label": "Connetti"
      },
      "add": {
        "label": "Aggiungi/Invia"
      },
      "edit": {
        "label": "Modifica/Invia"
      },
      "import": {
        "label": "Importa"
      },
      "export": {
        "label": "Esporta"
      },
      "write": {
        "label": "Download del file"
      },
      "savenow": {
        "label": "Salva adesso"
      },
      "next": {
        "label": "Avanti"
      },
      "previous": {
        "label": "Precedente"
      },
      "finish": {
        "label": "Fine"
      },
      "done": {
        "label": "Eseguito"
      },
      "close": {
        "label": "Chiudi"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "Comprimi"
      },
      "expand": {
        "value": "Espandi"
      },
      "choose": {
        "value": "Scegli file"
      },
      "clear": {
        "value": "Cancella file scelto"
      },
      "more": {
        "value": "Altre azioni"
      },
      "download": {
        "value": "Sfoglia"
      },
      "reset": {
        "value": "Reimposta"
      },
      "filter": {
        "value": "Filtro"
      },
      "submit": {
        "value": "Sottometti modifiche"
      },
      "write": {
        "value": "Download del file"
      },
      "pick": {
        "value": "Scegli directory"
      },
      "reload": {
        "value": "Ricarica file"
      },
      "delete": {
        "value": "Elimina"
      },
      "remove": {
        "value": "Rimuovi"
      },
      "noData": {
        "value": "Nessun dato"
      },
      "preloader": {
        "value": "Preloader"
      },
      "checkAll": {
        "value": "Seleziona tutto"
      },
      "checkNone": {
        "value": "Deseleziona tutto"
      },
      "checkSome": {
        "value": "Cancella selezioni"
      },
      "close": {
        "value": "Chiudi"
      },
      "recentPages": {
        "value": "Attiva/disattiva visibilità della cronologia"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "Scegli file..."
      },
      "chooseDir": {
        "value": "Scegli directory..."
      }
    },
    "labels": {
      "info": {
        "value": "Informazioni"
      },
      "warn": {
        "value": "Avvertenza"
      },
      "error": {
        "value": "Errore"
      }
    },
    "placeholders": {
      "search": {
        "value": "Cerca"
      }
    },
    "title": {
      "incorrectFileContent": {
        "value": "Rilevato contenuto errato"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}'' contiene un file JSON, ma non è una rappresentazione del file JSON di un {1}."
      },
      "dataCopiedToClipboard": {
        "summary": "I dati sono stati copiati negli appunti."
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "I dati non sono stati copiati negli appunti perché la cella selezionata è vuota."
      },
      "emptyRowData": {
        "detail": "I dati non sono stati copiati negli appunti perché la riga selezionata è vuota."
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "Copia cella negli appunti"
        },
        "row": {
          "label": "Copia una riga negli Appunti"
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
        "summary": "Salvataggio delle modifiche al file ''{0}'' riuscito."
      },
      "changesNotSaved": {
        "summary": "Impossibile salvare le modifiche al file ''{0}''."
      },
      "changesDownloaded": {
        "summary": "Download delle modifiche nel file ''{0}'' riuscito."
      },
      "changesNotDownloaded": {
        "summary": "Impossibile scaricare le modifiche nel file ''{0}''."
      },
      "verifyPathEntered": {
        "detail": ". L''impostazione del campo {0} su false accetterà il valore immesso senza convalidarne l''esistenza come file o directory locale."
      }
    },
    "wdtOptionsDialog": {
      "title": "Modifica: {0}",
      "default": "Annulla impostazione valore",
      "instructions": "Immettere il token da aggiungere alla lista di elementi selezionabili.",
      "enterValue": "Immettere un valore",
      "selectValue": "Selezionare un valore",
      "selectSwitch": "Attiva/Disattiva valore",
      "enterUnresolvedReference": "Immettere il riferimento non risolto",
      "enterModelToken": "Immettere il token modello",
      "selectPropsVariable": "Seleziona variabile token modello",
      "createPropsVariable": "Crea variabile token modello",
      "propName": "Nome variabile (obbligatorio)",
      "propValue": "Valore variabile",
      "enterVariable": "Immettere la variabile",
      "variableName": "Nome variabile (obbligatorio)",
      "variableValue": "Valore variabile",
      "multiSelectUnset": "Seleziona valore dalla lista di elementi disponibili"
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "Rilevate modifiche non salvate"
      },
      "changesNeedDownloading": {
        "value": "Modifiche non scaricate"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Tutte le modifiche non salvate andranno perdute. Continuare?"
        },
        "areYouSure": {
          "value": "Si è certi di voler {0} senza salvare le modifiche?"
        },
        "saveBeforeExiting": {
          "value": "Si desidera salvare le modifiche prima di uscire?"
        },
        "needDownloading": {
          "value": "Le modifiche apportate a ''{0}'' non sono state scaricate nel file.<br/><br/>Scaricarle prima di continuare?"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "La nuova istanza ''{0}'' non è stata aggiunta al modello WDT.<br/><br/>Aggiungerla prima di continuare?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Imposta intervallo di ricaricamento automatico",
      "instructions": "Indicare i secondi per l'intervallo di ricaricamento automatico.",
      "fields": {
        "interval": {
          "label": "Intervallo ricaricamento automatico:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Messaggio",
          "detail": "La chiamata backend della console ha generato una risposta ''{0}'' durante il tentativo di eseguire l''azione ''{1}''."
        },
        "actionNotPerformed": {
          "detail": "Impossibile eseguire l''azione ''{0}'' su uno o più elementi selezionati"
        },
        "actionSucceeded": {
          "summary": "L''esecuzione dell''azione ''{0}'' è riuscita."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Impossibile determinare la causa esatta. Controllare la presenza di suggerimenti nella console JavaScript."
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "Conferma azione",
        "prompt": "L''azione ''{0}'' non può essere annullata.<br/><br/>Continuare?"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponibili",
        "chosen": "Scelti"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "Nome proprietà",
        "value": "Valore proprietà"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "Nome proprietà",
        "valueHeader": "Valore proprietà",
        "addButtonTooltip": "Aggiungi",
        "deleteButtonTooltip": "Elimina"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "Visualizza {0}..."
          },
          "create": {
            "label": "Crea nuovo/a {0}..."
          },
          "edit": {
            "label": "Modifica {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "Ripristina impostazioni predefinite"
    },
    "placeholder": {
      "value": "predefinito"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}'' non è disponibile."
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
        "value": "Stati server"
      },
      "systemStatus": {
        "value": "Stato sistema"
      },
      "healthState": {
        "failed": {
          "value": "Non riuscito"
        },
        "critical": {
          "value": "Critico"
        },
        "overloaded": {
          "value": "Sovraccaricato"
        },
        "warning": {
          "value": "Avvertenza"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Integrità dei server in esecuzione a partire da"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "Nome"
        },
        "state": {
          "value": "Stato"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "Backend non al momento raggiungibile."
      },
      "connectionMessage": {
        "summary": "Messaggio di connessione"
      },
      "connectFailed": {
        "detail": "Tentativo non riuscito:"
      },
      "badRequest": {
        "detail": "Impossibile elaborare la richiesta o il file sottomesso"
      },
      "invalidCredentials": {
        "detail": "Le credenziali del dominio WebLogic non sono valide"
      },
      "invalidUrl": {
        "detail": "URL dominio WebLogic non raggiungibile"
      },
      "notInRole": {
        "detail": "Tentativo non riuscito: l'utente non dispone del ruolo Admin, Deployer, Operator o Monitor"
      },
      "notSupported": {
        "detail": "Dominio WebLogic non supportato"
      },
      "unexpectedStatus": {
        "detail": "Risultato imprevisto (stato: {0})"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Richiesta non riuscita",
          "detail": "Una risposta non riuscita è stata restituita da una chiamata backend della console."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Consultare il terminale della console remota o la console Javascript per conoscere i motivi specifici."
      },
      "responseMessages": {
        "summary": "Messaggi di risposta"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "Impossibile accedere a Change Manager."
      },
      "changesCommitted": {
        "summary": "Commit delle modifiche riuscito."
      },
      "changesNotCommitted": {
        "summary": "Impossibile eseguire il commit delle modifiche."
      },
      "changesDiscarded": {
        "summary": "Annullamento delle modifiche riuscito."
      },
      "changesNotDiscarded": {
        "summary": "Impossibile ignorare le modifiche."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Risposta di errore imprevista"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "Problema di connessione",
        "details": "In caso di problemi di invio e ricezione dei dati dal fornitore, assicurarsi che sia accessibile e riprovare."
      },
      "pathNotFound": {
        "summary": "Percorso non trovato",
        "details": "''{0}'' non è un file o una directory accessibile nel file system locale."
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "Cancella messaggio"
        },
        "suppress": {
          "info": {
            "label": "Elimina messaggi informativi"
          },
          "warning": {
            "label": "Elimina messaggi di avvertenza"
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
          "value": "Visualizza alert"
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