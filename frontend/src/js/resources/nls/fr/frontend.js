define({
  "wrc-header": {
    "text": {
      "appName": "Console distante WebLogic"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "En ligne"
        },
        "offline": {
          "tooltip": "Hors ligne"
        },
        "detached": {
          "tooltip": "D\\u00E9tach\\u00E9"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00A9 2020, 2021, Oracle et/ou ses affili\\u00E9s.<br/>Oracle est une marque d\\u00E9pos\\u00E9e d'Oracle Corporation et/ou ses affili\\u00E9s. Tout autre nom mentionn\\u00E9 peut correspondre \\u00E0 des marques appartenant \\u00E0 d'autres propri\\u00E9taires qu'Oracle.<br/>",
      "builtWith": "Con\\u00E7u avec Oracle JET"
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
        "tooltip": "Enlever"
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
          "value": "Nom utilisateur"
        },
        "password": {
          "value": "Mot de passe"
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
            "label": "Provider Id:"
          }
        },
        "domain": {
          "name": {
            "label": "Domain Name:"
          },
          "url": {
            "label": "URL de domaine :"
          },
          "version": {
            "label": "Version de domaine :"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "D\\u00E9lai d'expiration de la connexion:"
          },
          "readTimeout": {
            "label": "Expiration de la lecture :"
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
                "label": "URL de domaine :"
              },
              "version": {
                "label": "Version de domaine :"
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
          "value": "Importer un projet"
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
          "value": "Importer un projet"
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
        "fileNotSet": "Non d\\u00E9fini"
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
      "home": "Accueil",
      "configuration": "Edit Tree",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Accueil"
        },
        "preferences": {
          "label": "Pr\\u00E9f\\u00E9rences"
        },
        "search": {
          "label": "Rechercher"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "Panier"
        },
        "ataglance": {
          "label": "Vue d'ensemble"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "Kiosque"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Historique"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Effacer l'historique"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Donn\\u00E9es non disponibles"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Historique"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Effacer l'historique"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Donn\\u00E9es non disponibles"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "ex\\u00E9cution \\u00E0 {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Connexion perdue",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "Echec de la tentative de connexion",
        "detail": "Impossible de se connecter au domaine WebLogic {0}, v\\u00E9rifiez que WebLogic est en cours d''ex\\u00E9cution."
      }
    },
    "dialog1": {
      "title": "Connexion au domaine WebLogic",
      "instructions": "Saisissez l'URL et les informations d'identification d'administrateur du domaine WebLogic :",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "Connexion"
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
        "description": "<p>G\\u00E9rez la configuration du domaine WebLogic avec lequel vous travaillez.</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>Examinez la configuration en lecture seule du domaine WebLogic avec lequel vous travaillez.</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>Visualisez les informations du MBean d'ex\\u00E9cution pour les ressources s\\u00E9lectionn\\u00E9es dans le domaine WebLogic avec lequel vous travaillez.</p>"
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
        "tooltip": "Annuler les modifications"
      },
      "commit": {
        "tooltip": "Valider (commit) les modifications"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Gestionnaire de modifications"
      },
      "additions": {
        "label": "Ajouts"
      },
      "modifications": {
        "label": "Modifications"
      },
      "removals": {
        "label": "Suppressions"
      },
      "restart": {
        "label": "Red\\u00E9marrage"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "Nouveau"
      },
      "clone": {
        "label": "Cloner"
      },
      "delete": {
        "label": "Supprimer"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Page de destination"
      },
      "history": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 de l'historique"
      },
      "instructions": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 des instructions"
      },
      "help": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 de la page d'aide"
      },
      "sync": {
        "tooltip": "Recharger",
        "tooltipOn": "Arr\\u00EAter le rechargement automatique"
      },
      "syncInterval": {
        "tooltip": "D\\u00E9finir l'intervalle de rechargement automatique"
      },
      "shoppingcart": {
        "tooltip": "Cliquer ici afin de visualiser les actions pour le panier"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Visualiser les modifications"
        },
        "discard": {
          "label": "Annuler les modifications"
        },
        "commit": {
          "label": "Valider (commit) les modifications"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "S\\u00E9lectionnez les \\u00E9l\\u00E9ments sur lesquels effectuer l''op\\u00E9ration ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Message",
          "detail": "Impossible d''effectuer l''action ''{0}'' lorsque le rechargement automatique est en cours. Cliquez d''abord sur l''ic\\u00F4ne ''{1}'' pour l''arr\\u00EAter."
        }
      }
    },
    "labels": {
      "start": {
        "value": "D\\u00E9marrer"
      },
      "resume": {
        "value": "Reprendre"
      },
      "suspend": {
        "value": "Suspendre"
      },
      "shutdown": {
        "value": "Mettre hors service"
      },
      "restartSSL": {
        "value": "Red\\u00E9marrer SSL"
      },
      "stop": {
        "value": "Arr\\u00EAter"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Afficher les colonnes masqu\\u00E9es"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "Annuler"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "Enregistrer"
      },
      "new": {
        "label": "Cr\\u00E9er"
      },
      "delete": {
        "label": "Enlever"
      },
      "back": {
        "label": "Retour"
      },
      "next": {
        "label": "Suivant"
      },
      "finish": {
        "label": "Cr\\u00E9er"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Enregistrer"
      },
      "create": {
        "tooltip": "Cr\\u00E9er"
      },
      "landing": {
        "tooltip": "Page de destination"
      },
      "history": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 de l'historique"
      },
      "instructions": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 des instructions"
      },
      "help": {
        "tooltip": "Activer/D\\u00E9sactiver la visibilit\\u00E9 de la page d'aide"
      },
      "sync": {
        "tooltip": "Recharger",
        "tooltipOn": "Arr\\u00EAter le rechargement automatique"
      },
      "syncInterval": {
        "tooltip": "D\\u00E9finir l'intervalle de rechargement automatique"
      },
      "shoppingcart": {
        "tooltip": "Cliquer ici afin de visualiser les actions pour le panier"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Visualiser les modifications"
        },
        "discard": {
          "label": "Annuler les modifications"
        },
        "commit": {
          "label": "Valider (commit) les modifications"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Afficher les champs avanc\\u00E9s"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Cliquez sur l''ic\\u00F4ne {0} pour basculer entre l''aide r\\u00E9capitulative et l''aide d\\u00E9taill\\u00E9e."
      }
    },
    "messages": {
      "save": "Modifications ajout\\u00E9es au panier"
    },
    "icons": {
      "restart": {
        "tooltip": "Red\\u00E9marrage du serveur ou de l'application requis"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "Table d'aide",
        "columns": {
          "header": {
            "name": "Nom",
            "description": "Description"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Champs requis incomplets",
        "detail": "Le champ {0} est requis mais aucune valeur n''a \\u00E9t\\u00E9 fournie."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Annuler"
      },
      "yes": {
        "label": "Oui"
      },
      "no": {
        "label": "Non"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "Connexion"
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
        "label": "Mettre \\u00E0 jour le fichier"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "R\\u00E9duire"
      },
      "expand": {
        "value": "D\\u00E9velopper"
      },
      "choose": {
        "value": "S\\u00E9lectionner un fichier"
      },
      "clear": {
        "value": "Effacer le fichier s\\u00E9lectionn\\u00E9"
      },
      "more": {
        "value": "Actions suppl\\u00E9mentaires"
      },
      "download": {
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "Soumettre les modifications"
      },
      "write": {
        "value": "Mettre \\u00E0 jour le fichier"
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
      "selectValue": "S\\u00E9lectionner une valeur",
      "selectSwitch": "Activer/d\\u00E9sactiver la valeur",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "Modifications non enregistr\\u00E9es d\\u00E9tect\\u00E9es"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Toutes les modifications non enregistr\\u00E9es seront perdues. Continuer ?"
        },
        "areYouSure": {
          "value": "Voulez-vous quitter cette page sans enregistrer les modifications ?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "D\\u00E9finir l'intervalle de rechargement automatique",
      "instructions": "Combien de secondes voulez-vous d\\u00E9finir pour l'intervalle de rechargement automatique ?",
      "fields": {
        "interval": {
          "label": "Intervalle de rechargement automatique :"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Message",
          "detail": "L''appel de back-end de console a g\\u00E9n\\u00E9r\\u00E9 une r\\u00E9ponse ''{0}'' lors de la tentative d''ex\\u00E9cution de l''action indiqu\\u00E9e sur ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Impossible de d\\u00E9terminer la cause exacte. Consultez la console JavaScript pour obtenir des conseils."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponible",
        "chosen": "Choisi"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "Afficher : {0}..."
          },
          "create": {
            "label": "Cr\\u00E9er : {0}..."
          },
          "edit": {
            "label": "Modifier : {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "R\\u00E9tablir la valeur par d\\u00E9faut"
    },
    "placeholder": {
      "value": "valeur par d\\u00E9faut"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "Message",
        "detail": "Le fichier RDJ ne contient pas de champ ''notFoundMessage'' pour l''\\u00E9l\\u00E9ment ''{0}''."
      }
    }
  },
  "wrc-ataglance": {
    "labels": {
      "running": {
        "value": "En cours d'ex\\u00E9cution"
      },
      "shutdown": {
        "value": "Arr\\u00EAt"
      },
      "serverStates": {
        "value": "Etats de serveur"
      },
      "systemStatus": {
        "value": "Statut du syst\\u00E8me"
      },
      "healthState": {
        "failed": {
          "value": "Echec"
        },
        "critical": {
          "value": "Critique"
        },
        "overloaded": {
          "value": "Surcharg\\u00E9"
        },
        "warning": {
          "value": "Avertissement"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Etat g\\u00E9n\\u00E9ral des serveurs en cours d'ex\\u00E9cution en date du"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "Nom"
        },
        "state": {
          "value": "Etat"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "Back-end actuellement inaccessible."
      },
      "connectionMessage": {
        "summary": "Message de connexion"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "Les informations d'identification du domaine WebLogic ne sont pas valides "
      },
      "invalidUrl": {
        "detail": "L'URL du domaine WebLogic n'est pas accessible "
      },
      "notSupported": {
        "detail": "Le domaine WebLogic n'est pas pris en charge "
      },
      "unexpectedStatus": {
        "detail": "R\\u00E9sultat inattendu (statut : {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Echec de la demande",
          "detail": "Un appel de back-end de console a renvoy\\u00E9 une r\\u00E9ponse d'\\u00E9chec."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Reportez-vous au terminal de la console distante ou \\u00E0 la console JavaScript pour conna\\u00EEtre les motifs sp\\u00E9cifiques."
      },
      "responseMessages": {
        "summary": "Messages de r\\u00E9ponse"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "Impossible d'acc\\u00E9der au gestionnaire de modifications."
      },
      "changesCommitted": {
        "summary": "Les modifications ont \\u00E9t\\u00E9 valid\\u00E9es (commit)."
      },
      "changesNotCommitted": {
        "summary": "Impossible de valider (commit) les modifications."
      },
      "changesDiscarded": {
        "summary": "Les modifications ont \\u00E9t\\u00E9 annul\\u00E9es."
      },
      "changesNotDiscarded": {
        "summary": "Impossible d'annuler les modifications."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "R\\u00E9ponse d'erreur inattendue"
      }
    }
  }
});