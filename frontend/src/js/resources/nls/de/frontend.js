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
        },
        "unattached": {
          "tooltip": "Nicht angehängt"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright © 2020, 2022, Oracle und/oder verbundene Unternehmen.<br/>Oracle ist eine eingetragene Marke der Oracle Corporation und/oder ihrer verbundenen Unternehmen. Andere Namen und Bezeichnungen können Marken ihrer jeweiligen Inhaber sein.<br/>",
      "builtWith": "Mit Oracle JET erstellt"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Info abrufen"
      },
      "edit": {
        "tooltip": "Verwalten"
      },
      "deactivate": {
        "tooltip": "Deactivate"
      },
      "delete": {
        "tooltip": "Entfernen"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Projekt ohne Namen"
        },
        "name": {
          "value": "Verbindungsprovidername"
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
          "value": "WDT-Modellprovidername"
        },
        "file": {
          "value": "WDT-Modelldateiname"
        },
        "props": {
          "value": "WDT-Variablen"
        }
      },
      "composite": {
        "name": {
          "value": "WDT-Compositemodell-Providername"
        },
        "providers": {
          "value": "WDT-Modelle"
        }
      },
      "proplist": {
        "name": {
          "value": "Providername von Eigenschaftsliste"
        },
        "file": {
          "value": "Dateiname von Eigenschaftsliste"
        }
      },
      "project": {
        "name": {
          "value": "Projektname"
        },
        "file": {
          "value": "Projektdateiname"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Admin-Serververbindung"
        },
        "model": {
          "value": "WDT-Modell hinzufügen"
        }
      },
      "dropdown": {
        "none": {
          "value": "Kein Wert"
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
            "label": "Benutzername:"
          },
          "roles": {
            "label": "Rollen:"
          },
          "connectTimeout": {
            "label": "Verbindungstimeout:"
          },
          "readTimeout": {
            "label": "Lesetimeout:"
          },
          "anyAttempt": {
            "label": "Alle Verbindungsversuche:"
          },
          "lastAttempt": {
            "label": "Letzter erfolgreicher Versuch:"
          }
        },
        "model": {
          "file": {
            "label": "Datei:"
          },
          "props": {
            "label": "Variablen:"
          }
        },
        "composite": {
          "models": {
            "label": "Modelle:"
          }
        },
        "proplist": {
          "file": {
            "label": "Dateiname:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Admin-Serververbindungsprovider hinzufügen"
        }
      },
      "models": {
        "add": {
          "value": "WDT-Modelldateiprovider hinzufügen"
        },
        "new": {
          "value": "Provider für neue WDT-Modelldatei erstellen"
        }
      },
      "composite": {
        "add": {
          "value": "WDT-Compositemodell-Dateiprovider hinzufügen"
        }
      },
      "proplist": {
        "add": {
          "value": "Eigenschaftslistenprovider hinzufügen"
        },
        "new": {
          "value": "Provider für neue Eigenschaftsliste erstellen"
        }
      },
      "providers": {
        "sort": {
          "value": "Nach Providertyp sortieren"
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
                "label": "Benutzername:"
              }
            }
          },
          "model": {
            "file": {
              "label": "Datei:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "Provider als Projekt exportieren..."
        },
        "import": {
          "value": "Projekt importieren"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Geben Sie einen neuen Namen und Konnektivitätseinstellungen für den Verbindungsprovider ein."
        },
        "edit": {
          "value": "Ändern Sie Konnektivitätseinstellungen für den Verbindungsprovider."
        }
      },
      "models": {
        "add": {
          "value": "Geben Sie Einstellungen für den vorhandenen Modelldateiprovider ein. Klicken Sie auf das Uploadsymbol, um nach der Modelldatei zu suchen."
        },
        "new": {
          "value": "Geben Sie den Providernamen und Dateinamen für die neue WDT-Modelldatei ein. Klicken Sie dann auf das Symbol, um das Verzeichnis zum Speichern der Datei auszuwählen."
        },
        "edit": {
          "value": "Ändern Sie die Einstellungen für den Modelldateiprovider. Klicken Sie auf das Symbol, um nach der Modelldatei zu suchen."
        }
      },
      "composite": {
        "add": {
          "value": "Geben Sie einen neuen Namen ein, und wählen Sie eine angeordnete Modellliste für den Compositemodellprovider aus."
        },
        "edit": {
          "value": "Ändern Sie die Einstellungen für den Compositemodellprovider. Verwenden Sie eine angeordnete Modellliste."
        }
      },
      "proplist": {
        "add": {
          "value": "Geben Sie Einstellungen für den vorhandenen Eigenschaftslistenprovider ein. Klicken Sie auf das Uploadsymbol, um nach einer Eigenschaftendatei zu suchen."
        },
        "new": {
          "value": "Geben Sie den Providernamen und Dateinamen für eine neue Eigenschaftsliste ein. Klicken Sie dann auf das Symbol, um das Verzeichnis zum Speichern der Datei auszuwählen."
        },
        "edit": {
          "value": "Ändern Sie Einstellungen für den Eigenschaftslistenprovider. Klicken Sie auf das Symbol, um nach einer Eigenschaftendatei zu suchen."
        }
      },
      "project": {
        "export": {
          "value": "Geben Sie Einstellungen für das neue Projekt ein."
        },
        "import": {
          "value": "Klicken Sie auf das Downloadsymbol, um nach dem Projekt zu suchen."
        }
      },
      "task": {
        "startup": {
          "value": "Welche Startaufgabe möchten Sie ausführen?"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Provider für Admin-Serververbindung erstellen"
        },
        "models": {
          "value": "Provider für vorhandene WDT-Modelldatei erstellen"
        },
        "composite": {
          "value": "Provider für neues WDT-Compositemodell erstellen"
        },
        "proplist": {
          "value": "Provider für vorhandene Eigenschaftsliste erstellen"
        }
      },
      "new": {
        "models": {
          "value": "Provider für neue WDT-Modelldatei erstellen"
        },
        "proplist": {
          "value": "Provider für neue Eigenschaftsliste erstellen"
        }
      },
      "edit": {
        "connections": {
          "value": "Admin-Serververbindungsprovider bearbeiten"
        },
        "models": {
          "value": "WDT-Modelldateiprovider bearbeiten"
        },
        "composite": {
          "value": "WDT-Compositemodellprovider bearbeiten"
        },
        "proplist": {
          "value": "Eigenschaftslistenprovider bearbeiten"
        }
      },
      "export": {
        "project": {
          "value": "Provider als Projekt exportieren"
        }
      },
      "import": {
        "project": {
          "value": "Projekt importieren"
        }
      },
      "startup": {
        "task": {
          "value": "Startaufgabe"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Exportieren nicht erfolgreich",
          "detail": "Provider können nicht als Projekt \"{0}\" exportiert werden."
        }
      },
      "import": {
        "failed": {
          "summary": "Speichern nicht erfolgreich",
          "detail": "Projektdatei \"{0}\" kann nicht importiert werden."
        }
      },
      "stage": {
        "failed": {
          "summary": "Erstellen nicht erfolgreich",
          "detail": "Providerelement \"{0}\" kann nicht erstellt werden."
        }
      },
      "use": {
        "failed": {
          "summary": "Verbindung nicht erfolgreich",
          "detail": "Providerelement \"{0}\" kann nicht verwendet werden."
        }
      },
      "upload": {
        "failed": {
          "detail": "Die WDT-Modelldatei kann nicht geladen werden: {0}"
        },
        "props": {
          "failed": {
            "detail": "Die WDT-Variablen können nicht geladen werden: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "Es ist bereits ein Provider namens \"{0}\" in diesem Projekt vorhanden."
        },
        "modelsNotFound": {
          "detail": "Die konfigurierten WDT-Modelle \"{0}\" können nicht gefunden werden"
        },
        "propListNotFound": {
          "detail": "Die WDT-Variablen \"{0}\" können nicht gefunden werden"
        },
        "selectModels": {
          "detail": "Um das WDT-Composite auszuwählen, wählen Sie zunächst alle vom WDT-Composite verwendeten WDT-Modelle aus."
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>Bearbeiten Sie den Pfad im Feld \"Dateiname\", und klicken Sie auf die Schaltfläche \"OK\". Alternativ dazu können Sie auf das Uploadsymbol klicken und eine andere Datei auswählen.</p>"
        },
        "fixModelFile": {
          "detail": "<p>Beheben Sie die unten genannten Probleme, und klicken Sie auf die Schaltfläche \"OK\". Alternativ dazu können Sie eine andere Datei auswählen.</p>"
        },
        "yamlException": {
          "detail": "{0} in Zeile {1}, Spalte {2}"
        },
        "wktModelContent": {
          "summary": "Probleme mit Modellinhalt",
          "detail": "Beheben Sie Probleme mit dem Modelleditor auf der Registerkarte <i>Codeansicht</i>."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "Nicht festgelegt"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Sparse-Vorlage verwenden"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Baum bearbeiten"
      },
      "view": {
        "tooltip": "Konfigurationsbaumansicht"
      },
      "monitoring": {
        "tooltip": "Überwachungsbaum"
      },
      "security": {
        "tooltip": "Security Data Tree"
      },
      "modeling": {
        "tooltip": "WDT-Modell"
      },
      "composite": {
        "tooltip": "WDT-Compositemodell"
      },
      "properties": {
        "tooltip": "Eigenschaftslisteneditor"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Home",
      "configuration": "Baum bearbeiten",
      "view": "Konfigurationsbaumansicht",
      "monitoring": "Überwachungsbaum",
      "security": "Security Data Tree",
      "modeling": "WDT-Modell",
      "composite": "WDT-Compositemodell",
      "properties": "Eigenschaftsliste"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Home"
        },
        "preferences": {
          "label": "Voreinstellungen"
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
          "label": "Überblick"
        },
        "projectmanagement": {
          "label": "Providerverwaltung"
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
          "value": "Historie löschen"
        }
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
          "value": "Historie löschen"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "Wird ausgeführt bei {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Verbindung unterbrochen",
        "detail": "Die Verbindung zum Remotekonsolen-Backend wurde unterbrochen. Stellen Sie sicher, dass das Backend ausgeführt wird, bzw. starten Sie es neu, und wiederholen Sie die Verbindung."
      },
      "cannotConnect": {
        "summary": "Verbindungsversuch nicht erfolgreich",
        "detail": "Verbindung zur WebLogic-Domain {0} kann nicht hergestellt werden. Prüfen Sie, ob WebLogic ausgeführt wird."
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
        "label": "Baum bearbeiten",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "Konfigurationsbaumansicht",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "Überwachungsbaum",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "WDT-Modellbaum",
        "description": "<p>Verwalten Sie Modelldateien für WebLogic Deploy Tooling.</p>"
      },
      "composite": {
        "label": "WDT-Compositemodellbaum",
        "description": "<p>Zeigen Sie ein kombiniertes Set aus WebLogic Deploy Tooling-Modelldateien an, mit denen Sie derzeit arbeiten.</p>"
      },
      "properties": {
        "label": "Eigenschaftslisteneditor",
        "description": "<p>Hier können Sie ein Set aus Eigenschaften aus einer Eigenschaftslistendatei anzeigen oder ändern.</p>"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "Änderungen verwerfen"
      },
      "commit": {
        "tooltip": "Änderungen festschreiben"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Change Manager"
      },
      "additions": {
        "label": "Hinzugefügte Elemente"
      },
      "modifications": {
        "label": "Geänderte Elemente"
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
        "label": "Löschen"
      },
      "customize": {
        "label": "Tabelle anpassen"
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
        "tooltip": "Intervall für automatisches Neuladen festlegen"
      },
      "shoppingcart": {
        "tooltip": "Hier klicken, um Aktionen für den Warenkorb anzuzeigen"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Änderungen anzeigen"
        },
        "discard": {
          "label": "Änderungen verwerfen"
        },
        "commit": {
          "label": "Änderungen festschreiben"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Wählen Sie Elemente aus, mit denen Sie den Vorgang \"{0}\" ausführen möchten."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Meldung",
          "detail": "Aktion \"{0}\" kann nicht ausgeführt werden, während Daten automatisch neu geladen werden. Klicken Sie zunächst auf das Symbol \"{1}\", um das automatische Neuladen zu stoppen."
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
    "labels": {
      "totalRows": {
        "value": "Gesamte Zeilen: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "Verfügbare Spalten"
      },
      "selected": {
        "value": "Ausgewählte Spalten"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "Nicht genügend Spalten",
          "detail": "Es ist mindestens eine ausgewählte Spalte erforderlich."
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
        "label": "Zurück"
      },
      "next": {
        "label": "Weiter"
      },
      "finish": {
        "label": "Erstellen"
      },
      "customize": {
        "label": "Tabelle anpassen"
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
        "tooltip": "Intervall für automatisches Neuladen festlegen"
      },
      "shoppingcart": {
        "tooltip": "Hier klicken, um Aktionen für den Warenkorb anzuzeigen"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Änderungen anzeigen"
        },
        "discard": {
          "label": "Änderungen verwerfen"
        },
        "commit": {
          "label": "Änderungen festschreiben"
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
        "text": "Klicken Sie auf das {0}-Symbol, um zwischen der Übersichtshilfe und der detaillierten Hilfe umzuschalten."
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
        "tooltip": "Neustart von Server oder App erforderlich"
      },
      "wdtIcon": {
        "tooltip": "WDT-Einstellungen"
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
        "summary": "Nicht ausgefüllte Pflichtfelder",
        "detail": "{0} ist ein Pflichtfeld, aber es wurde kein Wert (oder ein ungültiger Wert) angegeben."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "apply": {
        "label": "Anwenden"
      },
      "reset": {
        "label": "Zurücksetzen"
      },
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
        "label": "Auswählen"
      },
      "connect": {
        "label": "Verbinden"
      },
      "add": {
        "label": "Hinzufügen/Senden"
      },
      "edit": {
        "label": "Bearbeiten/Senden"
      },
      "import": {
        "label": "Importieren"
      },
      "export": {
        "label": "Exportieren"
      },
      "write": {
        "label": "Datei herunterladen"
      },
      "savenow": {
        "label": "Jetzt speichern"
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
        "value": "Datei auswählen"
      },
      "clear": {
        "value": "Ausgewählte Datei löschen"
      },
      "more": {
        "value": "Weitere Aktionen"
      },
      "download": {
        "value": "Durchsuchen"
      },
      "reset": {
        "value": "Zurücksetzen"
      },
      "submit": {
        "value": "Änderungen weiterleiten"
      },
      "write": {
        "value": "Datei herunterladen"
      },
      "pick": {
        "value": "Verzeichnis auswählen"
      },
      "reload": {
        "value": "Datei erneut laden"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "Datei auswählen..."
      },
      "chooseDir": {
        "value": "Verzeichnis wählen..."
      }
    },
    "labels": {
      "info": {
        "value": "Informationen"
      },
      "warn": {
        "value": "Warnung"
      },
      "error": {
        "value": "Fehler"
      }
    },
    "placeholders": {
      "search": {
        "value": "Suchen"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "Änderungen wurden erfolgreich in der Datei \"{0}\" gespeichert."
      },
      "changesNotSaved": {
        "summary": "Änderungen konnten nicht in Datei \"{0}\" gespeichert werden."
      },
      "changesDownloaded": {
        "summary": "Änderungen wurden erfolgreich in Datei \"{0}\" heruntergeladen."
      },
      "changesNotDownloaded": {
        "summary": "Änderungen konnten nicht in Datei \"{0}\" heruntergeladen werden."
      },
      "verifyPathEntered": {
        "detail": ". Wenn Sie das Feld {0} auf \"false\" setzen, wird der eingegebene Wert akzeptiert, ohne zu prüfen, ob er als lokale Datei oder Verzeichnis vorhanden ist."
      }
    },
    "wdtOptionsDialog": {
      "title": "Bearbeiten: {0}",
      "default": "Standard. (Nicht festgelegt)",
      "instructions": "Geben Sie das Token ein, das der Liste der auswählbaren Elemente hinzugefügt werden soll.",
      "enterValue": "Wert eingeben",
      "selectValue": "Wert auswählen",
      "selectSwitch": "Wert umschalten",
      "enterUnresolvedReference": "Nicht aufgelöste Referenz eingeben",
      "enterModelToken": "Modelltoken eingeben",
      "selectPropsVariable": "Modelltokenvariable auswählen",
      "createPropsVariable": "Modelltokenvariable erstellen",
      "propName": "Variablenname (erforderlich)",
      "propValue": "Variablenwert",
      "enterVariable": "Variable eingeben",
      "variableName": "Variablenname (erforderlich)",
      "variableValue": "Variablenwert",
      "multiSelectUnset": "\"Standard. (Aus Liste \"Verfügbare Elemente\" auswählen)\""
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "Nicht gespeicherte Änderungen gefunden"
      },
      "changesNeedDownloading": {
        "value": "Änderungen nicht heruntergeladen"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Alle nicht gespeicherten Änderungen gehen verloren. Fortfahren?"
        },
        "areYouSure": {
          "value": "Möchten Sie diesen Vorgang wirklich ohne Speichern der Änderungen beenden?"
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
          "value": "Ihre neue \"{0}\"-Instanz wurde dem WDT-Modell noch nicht hinzugefügt.<br/><br/>Soll sie vor dem Fortfahren hinzugefügt werden?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Intervall für automatisches Neuladen festlegen",
      "instructions": "Wie viele Sekunden möchten Sie für das Intervall zum automatischen Neuladen festlegen?",
      "fields": {
        "interval": {
          "label": "Intervall für automatisches Neuladen:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Meldung",
          "detail": "Konsolen-Backend-Aufruf hat die Antwort \"{0}\" beim Versuch generiert, die angegebene Aktion auf \"{1}\" auszuführen."
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
        "available": "Verfügbar",
        "chosen": "Ausgewählt"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "Eigenschaftsname",
        "value": "Eigenschaftswert"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "Eigenschaftsname",
        "valueHeader": "Eigenschaftswert",
        "addButtonTooltip": "Hinzufügen",
        "deleteButtonTooltip": "Löschen"
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
        "detail": "\"{0}\" ist nicht verfügbar."
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
          "value": "Überlastet"
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
        "detail": "Versuch nicht erfolgreich: "
      },
      "badRequest": {
        "detail": "Die weitergeleitete Datei oder Anforderung konnte nicht verarbeitet werden "
      },
      "invalidCredentials": {
        "detail": "Zugangsdaten für WebLogic-Domain sind nicht gültig "
      },
      "invalidUrl": {
        "detail": "URL der WebLogic-Domain ist nicht erreichbar "
      },
      "notInRole": {
        "detail": "Versuch nicht erfolgreich: Der Benutzer ist kein Admin, Deployer, Operator oder Monitor"
      },
      "notSupported": {
        "detail": "WebLogic-Domain wird nicht unterstützt "
      },
      "unexpectedStatus": {
        "detail": "Unerwartetes Ergebnis (Status: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Anforderung nicht erfolgreich",
          "detail": "Eine Fehlerantwort wurde von einem Konsolen-Backend-Aufruf zurückgegeben."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Spezifische Gründe finden Sie im Remotekonsolenterminal oder in der JavaScript-Konsole."
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
        "summary": "Änderungen wurden erfolgreich festgeschrieben."
      },
      "changesNotCommitted": {
        "summary": "Änderungen konnten nicht festgeschrieben werden."
      },
      "changesDiscarded": {
        "summary": "Änderungen wurden erfolgreich verworfen."
      },
      "changesNotDiscarded": {
        "summary": "Änderungen konnten nicht verworfen werden."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Unerwartete Fehlerantwort"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "Verbindungsproblem",
        "details": "Beim Senden und Empfangen von Daten vom Provider treten Probleme auf. Stellen Sie sicher, dass der Provider zugänglich ist, und wiederholen Sie den Vorgang."
      }
    }
  },
  "wrc-electron": {
      "labels": {
        "app": {
          "appName": {
            "value": "WebLogic Remote Console"
          },
          "copyright": {
            "value": "Copyright © 2020, 2022, Oracle und/oder verbundene Unternehmen."
          }
        }
      },
      "menus": {
        "app": {
          "about": {
            "value": "Um {0}"
          },
          "services": {
            "value": "Dienstleistungen"
          },
          "hide": {
            "value": "Ausblenden {0}"
          },
          "quit": {
            "value": "Aufhören {0}"
          }
        },
        "file": {
          "newProject": {
            "value": "Neues Projekt"
          },
          "switchToProject": {
            "value": "Wechseln Sie zu Projekt"
          },
          "deleteProject": {
            "value": "Projekt löschen"
          },
          "nameProject": {
            "value": "Projekt benennen..."
          },
          "renameProject": {
            "value": "Umbenennen \"{0}\"..."
          }
        },
        "help": {
          "checkForUpdates": {
            "value": "Prüfen Auf \"{0}\" Aktualisierung..."
          },
          "visit": {
            "value": "Besuch {0} Github-Projekt"
          }
        }
      },
      "prompt": {
        "file": {
          "newProject": {
            "title": {
              "value": "Neues Projekt"
            },
            "label": {
              "value": "Name"
            }
          },
          "nameProject": {
            "title": {
              "value": "Projekt benennen"
            },
            "label": {
              "value": "Name"
            }
          },
          "renameProject": {
            "title": {
              "value": "Umbenennen \"{0}\"..."
            },
            "label": {
              "value": "Neuer Name"
            }
          }
        }
      },
      "dialog": {
        "help": {
          "checkForUpdates": {
            "alreadyOnCurrent": {
              "title": {
                "value": "Sie sind auf dem Laufenden"
              },
              "message": {
                "value": "Aktuelle Version ist {0}"
              }
            },
            "newVersionAvailable": {
              "title": {
                "value": "Neuere Version verfügbar!"
              },
              "message": {
                "value": "Gehe zu https://github.com/oracle/weblogic-remote-console/releases Version zu bekommen {0}"
              }
            },
            "connectionIssue": {
              "title": {
                "value": "Verbindungsprobleme"
              },
              "message": {
                "value": "Update-Site konnte nicht erreicht werden"
              }
            }
          }
        }
      }
    }
});