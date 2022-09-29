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
        },
        "unattached": {
          "tooltip": "Non collegata"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright © 2020-2022, Oracle e/o relative consociate.<br/>Oracle è un marchio registrato di Oracle Corporation e/o delle relative consociate. Altri nomi possono essere marchi dei rispettivi proprietari.<br/>",
      "builtWith": "Creato con Oracle JET"
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
        "tooltip": "Deactivate"
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
            "label": "Nome utente:"
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
        "fileNotSet": "Non impostato"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usa modello di sparsità"
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
        "tooltip": "Security Data Tree"
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
  "wrc-content-area-header": {
    "title": {
      "home": "Home",
      "configuration": "Modifica struttura",
      "view": "Struttura vista configurazione",
      "monitoring": "Struttura di monitoraggio",
      "security": "Security Data Tree",
      "modeling": "Modello WDT",
      "composite": "Modello composto WDT",
      "properties": "Lista proprietà"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Home"
        },
        "preferences": {
          "label": "Preferenze"
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
          "label": "Gestione provider"
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
          "label": "Galleria"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Modifica struttura",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "Struttura vista configurazione",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "Struttura di monitoraggio",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
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
    "labels": {
      "totalRows": {
        "value": "Totale righe: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
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
        "shoppingcart": "Changes were added to cart!",
        "customView": "Changes were saved!"
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
  "wrc-common": {
    "buttons": {
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
      "default": "Impostazione predefinita. (Non impostato)",
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
      "multiSelectUnset": "\"Impostazione predefinita. (Effettuare una selezione dalla lista di elementi disponibili)\""
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
          "value": "Si è certi di voler uscire senza salvare le modifiche?"
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
          "value": "La nuova istanza di ''{0}'' non è stata ancora aggiunta al modello WDT.<br/><br/>Aggiungerla prima di continuare?"
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
        "detail": "Impossibile elaborare la richiesta o il file sottomesso "
      },
      "invalidCredentials": {
        "detail": "Le credenziali del dominio WebLogic non sono valide "
      },
      "invalidUrl": {
        "detail": "URL dominio WebLogic non raggiungibile"
      },
      "notInRole": {
        "detail": "Tentativo non riuscito: l'utente non dispone del ruolo Admin, Deployer, Operator o Monitor"
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
      }
    }
  }
});