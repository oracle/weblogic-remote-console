define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "Online"
        },
        "offline": {
          "tooltip": "Offline"
        },
        "detached": {
          "tooltip": "Getrennt"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00C2\\u00A9 2020, 2021, Oracle und/oder verbundene Unternehmen.<br/>Oracle ist eine eingetragene Marke der Oracle Corporation und/oder ihrer verbundenen Unternehmen. Andere Namen und Bezeichnungen k\\u00F6nnen Marken ihrer jeweiligen Inhaber sein.<br/>",
      "builtWith": "Mit Oracle JET erstellt"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Get Info"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "Entfernen"
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
          "value": "Benutzername"
        },
        "password": {
          "value": "Kennwort"
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
          "value": "Projektname"
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
            "label": "Provider-ID:"
          }
        },
        "domain": {
          "name": {
            "label": "Domainname:"
          },
          "url": {
            "label": "Domain-URL:"
          },
          "version": {
            "label": "Domainversion:"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "Verbindungstimeout:"
          },
          "readTimeout": {
            "label": "Read Timeout:"
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
                "label": "Domain-URL:"
              },
              "version": {
                "label": "Domainversion:"
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
          "value": "Import Project"
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
          "value": "Import Project"
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
        "fileNotSet": "Nicht festgelegt"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Edit Tree"
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
      "configuration": "Edit Tree",
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
          "label": "Voreinstellungen"
        },
        "search": {
          "label": "Suchen"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "Warenkorb"
        },
        "ataglance": {
          "label": "\\u00DCberblick"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "Kiosk"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Historie"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Historie l\\u00F6schen"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Daten nicht verf\\u00FCgbar"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Historie"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Historie l\\u00F6schen"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Daten nicht verf\\u00FCgbar"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "Wird ausgef\\u00FChrt bei {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Verbindung unterbrochen",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "Verbindungsversuch nicht erfolgreich",
        "detail": "Verbindung zur WebLogic-Domain {0} kann nicht hergestellt werden. Pr\\u00FCfen Sie, ob WebLogic ausgef\\u00FChrt wird."
      }
    },
    "dialog1": {
      "title": "Mit WebLogic-Domain verbinden",
      "instructions": "Geben Sie Admin-Benutzerzugangsdaten und die URL f\\u00FCr die WebLogic-Domain ein:",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "Verbinden"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Galerie"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Edit Tree",
        "description": "<p>Behalten Sie die Konfiguration der WebLogic-Domain bei, mit der Sie gerade arbeiten.</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>Pr\\u00FCfen Sie die schreibgesch\\u00FCtzte Konfiguration der WebLogic-Domain, mit der Sie gerade arbeiten.</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>Zeigen Sie Laufzeit-MBean-Informationen f\\u00FCr ausgew\\u00E4hlte Ressourcen in der WebLogic-Domain an, mit der Sie gerade arbeiten.</p>"
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
        "tooltip": "\\u00C4nderungen verwerfen"
      },
      "commit": {
        "tooltip": "\\u00C4nderungen festschreiben"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Change Manager"
      },
      "additions": {
        "label": "Hinzugef\\u00FCgte Elemente"
      },
      "modifications": {
        "label": "Ge\\u00E4nderte Elemente"
      },
      "removals": {
        "label": "Entfernte Elemente"
      },
      "restart": {
        "label": "Neu starten"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "Neu"
      },
      "clone": {
        "label": "Klonen"
      },
      "delete": {
        "label": "L\\u00F6schen"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Landingpage"
      },
      "history": {
        "tooltip": "Sichtbarkeit der Historie umschalten"
      },
      "instructions": {
        "tooltip": "Sichtbarkeit von Anweisungen umschalten"
      },
      "help": {
        "tooltip": "Sichtbarkeit der Hilfeseite umschalten"
      },
      "sync": {
        "tooltip": "Neu laden",
        "tooltipOn": "Automatisches Neuladen stoppen"
      },
      "syncInterval": {
        "tooltip": "Intervall f\\u00FCr automatisches Neuladen festlegen"
      },
      "shoppingcart": {
        "tooltip": "Hier klicken, um Aktionen f\\u00FCr den Warenkorb anzuzeigen"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u00C4nderungen anzeigen"
        },
        "discard": {
          "label": "\\u00C4nderungen verwerfen"
        },
        "commit": {
          "label": "\\u00C4nderungen festschreiben"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "W\\u00E4hlen Sie Elemente aus, mit denen Sie den Vorgang \"{0}\" ausf\\u00FChren m\\u00F6chten."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Meldung",
          "detail": "Aktion \"{0}\" kann nicht ausgef\\u00FChrt werden, w\\u00E4hrend Daten automatisch neu geladen werden. Klicken Sie zun\\u00E4chst auf das Symbol \"{1}\", um das automatische Neuladen zu stoppen."
        }
      }
    },
    "labels": {
      "start": {
        "value": "Starten"
      },
      "resume": {
        "value": "Fortsetzen"
      },
      "suspend": {
        "value": "Unterbrechen"
      },
      "shutdown": {
        "value": "Herunterfahren"
      },
      "restartSSL": {
        "value": "SSL neu starten"
      },
      "stop": {
        "value": "Stoppen"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Ausgeblendete Spalten anzeigen"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "Abbrechen"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "Speichern"
      },
      "new": {
        "label": "Erstellen"
      },
      "delete": {
        "label": "Entfernen"
      },
      "back": {
        "label": "Zur\\u00FCck"
      },
      "next": {
        "label": "Weiter"
      },
      "finish": {
        "label": "Erstellen"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Speichern"
      },
      "create": {
        "tooltip": "Erstellen"
      },
      "landing": {
        "tooltip": "Landingpage"
      },
      "history": {
        "tooltip": "Sichtbarkeit der Historie umschalten"
      },
      "instructions": {
        "tooltip": "Sichtbarkeit von Anweisungen umschalten"
      },
      "help": {
        "tooltip": "Sichtbarkeit der Hilfeseite umschalten"
      },
      "sync": {
        "tooltip": "Neu laden",
        "tooltipOn": "Automatisches Neuladen stoppen"
      },
      "syncInterval": {
        "tooltip": "Intervall f\\u00FCr automatisches Neuladen festlegen"
      },
      "shoppingcart": {
        "tooltip": "Hier klicken, um Aktionen f\\u00FCr den Warenkorb anzuzeigen"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u00C4nderungen anzeigen"
        },
        "discard": {
          "label": "\\u00C4nderungen verwerfen"
        },
        "commit": {
          "label": "\\u00C4nderungen festschreiben"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Erweiterte Felder anzeigen"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Klicken Sie auf das {0}-Symbol, um zwischen der \\u00DCbersichtshilfe und der detaillierten Hilfe umzuschalten."
      }
    },
    "messages": {
      "save": "\\u00C4nderungen zu Warenkorb hinzugef\\u00FCgt"
    },
    "icons": {
      "restart": {
        "tooltip": "Neustart von Server oder App erforderlich"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "Hilfetabelle",
        "columns": {
          "header": {
            "name": "Name",
            "description": "Beschreibung"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Nicht ausgef\\u00FCllte Pflichtfelder",
        "detail": "{0} ist ein Pflichtfeld, aber es wurde kein Wert angegeben."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Abbrechen"
      },
      "yes": {
        "label": "Ja"
      },
      "no": {
        "label": "Nein"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "Verbinden"
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
        "label": "Datei aktualisieren"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "Ausblenden"
      },
      "expand": {
        "value": "Einblenden"
      },
      "choose": {
        "value": "Datei ausw\\u00E4hlen"
      },
      "clear": {
        "value": "Ausgew\\u00E4hlte Datei l\\u00F6schen"
      },
      "more": {
        "value": "Weitere Aktionen"
      },
      "download": {
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "Submit Changes"
      },
      "write": {
        "value": "Datei aktualisieren"
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
      "enterValue": "Wert eingeben",
      "selectValue": "Select Value",
      "selectSwitch": "Wert umschalten",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "Nicht gespeicherte \\u00C4nderungen gefunden"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Alle nicht gespeicherten \\u00C4nderungen gehen verloren. Fortfahren?"
        },
        "areYouSure": {
          "value": "M\\u00F6chten Sie diesen Vorgang wirklich ohne Speichern der \\u00C4nderungen beenden?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Intervall f\\u00FCr automatisches Neuladen festlegen",
      "instructions": "Wie viele Sekunden m\\u00F6chten Sie f\\u00FCr das Intervall zum automatischen Neuladen festlegen?",
      "fields": {
        "interval": {
          "label": "Intervall f\\u00FCr automatisches Neuladen:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Meldung",
          "detail": "Konsolen-Backend-Aufruf hat die Antwort \"{0}\" beim Versuch generiert, die angegebene Aktion auf \"{1}\" auszuf\\u00FChren."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Die genaue Ursache kann nicht bestimmt werden. Hinweise finden Sie in der JavaScript-Konsole."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Verf\\u00FCgbar",
        "chosen": "Ausgew\\u00E4hlt"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "{0} anzeigen..."
          },
          "create": {
            "label": "{0} neu erstellen..."
          },
          "edit": {
            "label": "{0} bearbeiten..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "Standardwert wiederherstellen"
    },
    "placeholder": {
      "value": "Standard"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "Meldung",
        "detail": "RDJ enthielt nicht das Feld \"notFoundMessage\" f\\u00FCr das Element \"{0}\"."
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
        "value": "Serverstatus"
      },
      "systemStatus": {
        "value": "Systemstatus"
      },
      "healthState": {
        "failed": {
          "value": "Nicht erfolgreich"
        },
        "critical": {
          "value": "Kritisch"
        },
        "overloaded": {
          "value": "\\u00DCberlastet"
        },
        "warning": {
          "value": "Warnung"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Zustand der gestarteten Server ab"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "Name"
        },
        "state": {
          "value": "Status"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "Backend ist derzeit nicht erreichbar."
      },
      "connectionMessage": {
        "summary": "Verbindungsmeldung"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "Zugangsdaten f\\u00FCr WebLogic-Domain sind nicht g\\u00FCltig "
      },
      "invalidUrl": {
        "detail": "URL der WebLogic-Domain ist nicht erreichbar "
      },
      "notSupported": {
        "detail": "WebLogic-Domain wird nicht unterst\\u00FCtzt "
      },
      "unexpectedStatus": {
        "detail": "Unerwartetes Ergebnis (Status: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Anforderung nicht erfolgreich",
          "detail": "Eine Fehlerantwort wurde von einem Konsolen-Backend-Aufruf zur\\u00FCckgegeben."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Spezifische Gr\\u00FCnde finden Sie im Remotekonsolenterminal oder in der JavaScript-Konsole."
      },
      "responseMessages": {
        "summary": "Antwortmeldungen"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "Auf Change Manager kann nicht zugegriffen werden."
      },
      "changesCommitted": {
        "summary": "\\u00C4nderungen wurden erfolgreich festgeschrieben."
      },
      "changesNotCommitted": {
        "summary": "\\u00C4nderungen konnten nicht festgeschrieben werden."
      },
      "changesDiscarded": {
        "summary": "\\u00C4nderungen wurden erfolgreich verworfen."
      },
      "changesNotDiscarded": {
        "summary": "\\u00C4nderungen konnten nicht verworfen werden."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Unerwartete Fehlerantwort"
      }
    }
  }
});