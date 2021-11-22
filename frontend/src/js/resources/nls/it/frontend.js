define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "In linea"
        },
        "offline": {
          "tooltip": "Non in linea"
        },
        "detached": {
          "tooltip": "Scollegata"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00A9 2020-2021, Oracle e/o relative consociate.<br/>Oracle \\u00E8 un marchio registrato di Oracle Corporation e/o delle relative consociate. Altri nomi possono essere marchi dei rispettivi proprietari.<br/>",
      "builtWith": "Creato con Oracle JET"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Recupera informazioni"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "Rimuovi"
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
          "value": "Nome utente"
        },
        "password": {
          "value": "Password"
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
          "version": {
            "label": "Versione dominio:"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "Timeout di connessione:"
          },
          "readTimeout": {
            "label": "Timeout di lettura:"
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
                "label": "URL dominio:"
              },
              "version": {
                "label": "Versione dominio:"
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
          "value": "Importa progetto"
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
          "value": "Importa progetto"
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
        "fileNotSet": "Not set"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Modifica struttura"
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
      "home": "Home",
      "configuration": "Modifica struttura",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Home"
        },
        "preferences": {
          "label": "Preferenze"
        },
        "search": {
          "label": "Cerca"
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
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "Chiosco"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Cronologia"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Cancella cronologia"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Dati non disponibili"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Cronologia"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Cancella cronologia"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Dati non disponibili"
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
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "Tentativo di connessione non riuscito",
        "detail": "Impossibile connettersi al dominio WebLogic {0}, verificare che WebLogic sia in esecuzione."
      }
    },
    "dialog1": {
      "title": "Connessione al dominio WebLogic",
      "instructions": "Immettere le credenziali dell'utente amministratore e l'URL per il dominio WebLogic:",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "Connetti"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Galleria"
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
        "label": "Configuration View Tree",
        "description": "<p>Consente di esaminare la configurazione di sola lettura del dominio WebLogic attualmente in uso.</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>Consente di visualizzare le informazioni MBean di runtime relative a risorse specifiche nel dominio WebLogic attualmente in uso.</p>"
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
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Pagina di arrivo"
      },
      "history": {
        "tooltip": "Attiva/disattiva visibilit\\u00E0 della cronologia"
      },
      "instructions": {
        "tooltip": "Attiva/disattiva visibilit\\u00E0 delle istruzioni"
      },
      "help": {
        "tooltip": "Attiva/disattiva visibilit\\u00E0 della pagina della Guida"
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
          "detail": "Impossibile eseguire l''azione ''{0}'' mentre \\u00E8 in esecuzione il ricaricamento automatico. Prima fare clic sull''icona ''{1}'' per interromperla."
        }
      }
    },
    "labels": {
      "start": {
        "value": "Avvia"
      },
      "resume": {
        "value": "Riprendi"
      },
      "suspend": {
        "value": "Sospendi"
      },
      "shutdown": {
        "value": "Arresta"
      },
      "restartSSL": {
        "value": "Riavvia SSL"
      },
      "stop": {
        "value": "Interrompi"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Mostra colonne nascoste"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "Annulla"
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
        "tooltip": "Attiva/disattiva visibilit\\u00E0 della cronologia"
      },
      "instructions": {
        "tooltip": "Attiva/disattiva visibilit\\u00E0 delle istruzioni"
      },
      "help": {
        "tooltip": "Attiva/disattiva visibilit\\u00E0 della pagina della Guida"
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
      "save": "Modifiche aggiunte al carrello"
    },
    "icons": {
      "restart": {
        "tooltip": "Riavvio del server o dell'applicazione obbligatorio"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
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
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campi obbligatori incompleti",
        "detail": "Il campo {0} \\u00E8 obbligatorio, ma non \\u00E8 stato fornito alcun valore."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Annulla"
      },
      "yes": {
        "label": "S\\u00EC"
      },
      "no": {
        "label": "No"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "Connetti"
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
        "label": "Aggiorna file"
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
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "Sottometti modifiche"
      },
      "write": {
        "value": "Aggiorna file"
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
      "enterValue": "Enter Value",
      "selectValue": "Select Value",
      "selectSwitch": "Attiva/Disattiva valore",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "Rilevate modifiche non salvate"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Tutte le modifiche non salvate andranno perdute. Continuare?"
        },
        "areYouSure": {
          "value": "Si \\u00E8 certi di voler uscire senza salvare le modifiche?"
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
          "detail": "La chiamata backend della console ha generato una risposta ''{0}'' durante il tentativo di eseguire l''azione specificata su ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Impossibile determinare la causa esatta. Controllare la presenza di suggerimenti nella console JavaScript."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponibili",
        "chosen": "Scelti"
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
        "summary": "Messaggio",
        "detail": "RDJ non contiene un campo ''notFoundMessage'' per l''elemento ''{0}''."
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
        "value": "Integrit\\u00E0 dei server in esecuzione a partire da"
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
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "Le credenziali del dominio WebLogic non sono valide "
      },
      "invalidUrl": {
        "detail": "URL dominio WebLogic non raggiungibile"
      },
      "notSupported": {
        "detail": "Dominio WebLogic non supportato "
      },
      "unexpectedStatus": {
        "detail": "Risultato imprevisto (stato: {0})"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Richiesta non riuscita",
          "detail": "Una risposta non riuscita \\u00E8 stata restituita da una chiamata backend della console."
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
    }
  }
});