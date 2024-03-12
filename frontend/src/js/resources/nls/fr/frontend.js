define({
  "wrc-header": {
    "text": {
      "appName": "Console distante WebLogic"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "Activer/Désactiver la visibilité de l'arborescence de navigation"
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
        "tooltip": "Ouvrir la documentation interne WebLogic Remote Console"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "Ouvrir le centre de messages"
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
      "copyrightLegal": "Copyright (c) 2020, 2024, Oracle et/ou ses affiliés.<br/>Oracle (r), Java, MySQL et NetSuite sont des marques déposées d'Oracle Corporation et/ou de ses affiliés. Tout autre nom mentionné peut être une marque appartenant à un autre propriétaire qu'Oracle.<br/>",
      "builtWith": "Conçu avec Oracle JET"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "Non sécurisé"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "Connexion au serveur d'administration non sécurisée"
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
            "tooltip": "Gérer les profils"
          },
          "editor": {
            "tooltip": "Profile Editor",
            "toolbar": {
              "save": {
                "tooltip": "Enregistrer le profil"
              },
              "activate": {
                "tooltip": "Active Profile"
              },
              "add": {
                "tooltip": "Ajouter un profil"
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
          "value": "Généralités"
        },
        "settings": {
          "value": "Paramètres"
        },
        "preferences": {
          "value": "Préférences"
        },
        "properties": {
          "value": "Propriétés"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "Modifier l'image"
      },
      "clearImage": {
        "value": "Clear Image"
      },
      "profile": {
        "default": {
          "value": "Profil par défaut"
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
            "value": "Déconnexion"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "ID de profil"
          },
          "organization": {
            "value": "Organization"
          },
          "name": {
            "value": "Nom"
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
              "value": "Stocker les informations d'identification cryptées pour vos projets ?"
            },
            "disableHNV": {
              "value": "Désactiver la vérification du nom d'hôte ?"
            },
            "proxyAddress": {
              "value": "Adresse du proxy"
            },
            "trustStoreType": {
              "value": "Type de truststore"
            },
            "trustStorePath": {
              "value": "Chemin de truststore"
            },
            "trustStoreKey": {
              "value": "Clé de truststore"
            },
            "connectionTimeout": {
              "value": "Délai d'expiration de la connexion au serveur d'administration"
            },
            "readTimeout": {
              "value": "Délai d'expiration de lecture du serveur d'administration"
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
        "tooltip": "Obtenir des informations"
      },
      "edit": {
        "tooltip": "Gérer"
      },
      "deactivate": {
        "tooltip": "Désactiver"
      },
      "delete": {
        "tooltip": "Enlever"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Projet sans nom"
        },
        "name": {
          "value": "Nom du fournisseur de connexion"
        },
        "url": {
          "value": "URL"
        },
        "proxyOverride": {
          "value": "Proxy de remplacement"
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
          "value": "Nom du fournisseur de modèle WDT"
        },
        "file": {
          "value": "Nom de fichier du modèle WDT"
        },
        "props": {
          "value": "Variables WDT"
        }
      },
      "composite": {
        "name": {
          "value": "Nom du fournisseur de modèle de composite WDT"
        },
        "providers": {
          "value": "Modèles WDT"
        }
      },
      "proplist": {
        "name": {
          "value": "Nom du fournisseur de liste des propriétés"
        },
        "file": {
          "value": "Nom de fichier de la liste des propriétés"
        }
      },
      "project": {
        "name": {
          "value": "Nom du projet"
        },
        "file": {
          "value": "Nom de fichier du projet"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Connexion au serveur d'administration"
        },
        "model": {
          "value": "Ajouter un modèle WDT"
        }
      },
      "dropdown": {
        "none": {
          "value": "Aucun"
        }
      }
    },
    "popups": {
      "info": {
        "project": {
          "name": {
            "label": "Nom du projet:"
          }
        },
        "provider": {
          "id": {
            "label": "ID du fournisseur :"
          }
        },
        "domain": {
          "name": {
            "label": "Nom du domaine :"
          },
          "url": {
            "label": "URL de domaine :"
          },
          "proxyOverride": {
            "label": "Proxy de remplacement:"
          },
          "version": {
            "label": "Version de domaine :"
          },
          "username": {
            "label": "Nom utilisateur :"
          },
          "sso": {
            "label": "SSO :"
          },
          "roles": {
            "label": "Rôles :"
          },
          "connectTimeout": {
            "label": "Délai d'expiration de la connexion:"
          },
          "readTimeout": {
            "label": "Expiration de la lecture :"
          },
          "insecure": {
            "label": "Non sécurisé :"
          },
          "anyAttempt": {
            "label": "Toutes les tentatives de connexion :"
          },
          "lastAttempt": {
            "label": "Dernière tentative réussie :"
          }
        },
        "model": {
          "file": {
            "label": "Fichier :"
          },
          "props": {
            "label": "Variables :"
          }
        },
        "composite": {
          "models": {
            "label": "Modèles :"
          }
        },
        "proplist": {
          "file": {
            "label": "Nom de fichier :"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Ajouter un fournisseur de connexion au serveur d'administration"
        }
      },
      "models": {
        "add": {
          "value": "Ajouter un fournisseur de fichier de modèle WDT"
        },
        "new": {
          "value": "Créer un fournisseur pour le nouveau fichier de modèle WDT"
        }
      },
      "composite": {
        "add": {
          "value": "Ajouter un fournisseur de fichier de modèle de composite WDT"
        }
      },
      "proplist": {
        "add": {
          "value": "Ajouter un fournisseur de liste des propriétés"
        },
        "new": {
          "value": "Créer un fournisseur pour la nouvelle liste des propriétés"
        }
      },
      "providers": {
        "sort": {
          "value": "Trier par type de fournisseur"
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
                "label": "Nom utilisateur :"
              }
            }
          },
          "model": {
            "file": {
              "label": "Fichier :"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "Exporter les fournisseurs en tant que projet..."
        },
        "import": {
          "value": "Importer un projet"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Indiquez un nouveau nom et des paramètres de connectivité pour le fournisseur de connexion."
        },
        "edit": {
          "value": "Modifiez les paramètres de connectivité du fournisseur de connexion."
        }
      },
      "models": {
        "add": {
          "value": "Indiquez des paramètres pour le fournisseur de fichier de modèle existant. Cliquez sur l'icône de téléchargement vers le serveur pour rechercher le fichier de modèle."
        },
        "new": {
          "value": "Saisissez le nom du fournisseur ainsi que le nom du nouveau fichier de modèle WDT, puis cliquez sur l'icône pour sélectionner le répertoire dans lequel enregistrer le fichier."
        },
        "edit": {
          "value": "Modifiez les paramètres du fournisseur de fichier de modèle. Cliquez sur l'icône pour rechercher le fichier de modèle."
        }
      },
      "composite": {
        "add": {
          "value": "Indiquez un nouveau nom et sélectionnez une liste triée de modèles pour le fournisseur de modèle de composite."
        },
        "edit": {
          "value": "Modifiez les paramètres du fournisseur de modèle de composite. Utilisez une liste triée de modèles."
        }
      },
      "proplist": {
        "add": {
          "value": "Indiquez des paramètres pour le fournisseur de liste des propriétés existant. Cliquez sur l'icône de téléchargement vers le serveur pour rechercher le fichier de propriétés."
        },
        "new": {
          "value": "Saisissez le nom du fournisseur ainsi que le nom de fichier de la nouvelle liste des propriétés, puis cliquez sur l'icône pour sélectionner le répertoire dans lequel enregistrer le fichier."
        },
        "edit": {
          "value": "Modifez les paramètres pour le fournisseur de liste des propriétés. Cliquez sur l'icône pour rechercher le fichier de propriétés."
        }
      },
      "project": {
        "export": {
          "value": "Indiquez les paramètres du nouveau projet."
        },
        "import": {
          "value": "Cliquez sur l'icône de téléchargement en local pour rechercher le projet."
        }
      },
      "task": {
        "startup": {
          "value": "Quelle tâche de démarrage souhaitez-vous effectuer ?"
        }
      },
      "project-busy": {
        "value": "Enregistrez ou abandonnez les modifications non enregistrées avant d'en apporter d'autres à n'importe quelle partie du projet"
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Créer un fournisseur pour la connexion au serveur d'administration"
        },
        "models": {
          "value": "Créer un fournisseur pour le fichier de modèle WDT existant"
        },
        "composite": {
          "value": "Créer un fournisseur pour le nouveau modèle de composite WDT"
        },
        "proplist": {
          "value": "Créer un fournisseur pour la liste des propriétés existante"
        }
      },
      "new": {
        "models": {
          "value": "Créer un fournisseur pour le nouveau fichier de modèle WDT"
        },
        "proplist": {
          "value": "Créer un fournisseur pour la nouvelle liste des propriétés"
        }
      },
      "edit": {
        "connections": {
          "value": "Modifier le fournisseur de la connexion au serveur d'administration"
        },
        "models": {
          "value": "Modifier le fournisseur de fichier de modèle WDT"
        },
        "composite": {
          "value": "Modifier le fournisseur de modèle de composite WDT"
        },
        "proplist": {
          "value": "Modifier le fournisseur de liste des propriétés"
        }
      },
      "export": {
        "project": {
          "value": "Exporter les fournisseurs en tant que projet"
        }
      },
      "import": {
        "project": {
          "value": "Importer un projet"
        }
      },
      "startup": {
        "task": {
          "value": "Tâche de démarrage"
        }
      },
      "project-busy": {
        "value": "Projet occupé"
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Echec de l'export",
          "detail": "Impossible d''exporter les fournisseurs en tant que projet ''{0}''."
        }
      },
      "import": {
        "failed": {
          "summary": "Echec de l'enregistrement",
          "detail": "Impossible d''importer le fichier de projet ''{0}''."
        }
      },
      "stage": {
        "failed": {
          "summary": "Echec de la création",
          "detail": "Impossible de créer l''élément de fournisseur ''{0}''."
        }
      },
      "use": {
        "failed": {
          "summary": "Echec de la connexion",
          "detail": "Impossible d''utiliser l''élément de fournisseur ''{0}''."
        }
      },
      "upload": {
        "failed": {
          "detail": "Impossible de charger le fichier de modèle WDT : {0}"
        },
        "props": {
          "failed": {
            "detail": "Impossible de charger les variables WDT : {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "Un fournisseur nommé ''{0}'' existe déjà dans ce projet."
        },
        "modelsNotFound": {
          "detail": "Impossible de trouver les modèles WDT configurés ''{0}''"
        },
        "propListNotFound": {
          "detail": "Impossible de trouver les variables WDT ''{0}''"
        },
        "selectModels": {
          "detail": "Pour sélectionner le composite WDT, sélectionnez d'abord tous les modèles WDT utilisés par le composite WDT."
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>Modifiez le chemin dans le champ de nom de fichier, puis cliquez sur le bouton OK. Sinon, cliquez sur l'icône de téléchargement et choisissez un autre fichier.</p>"
        },
        "fixModelFile": {
          "detail": "<p>Corrigez les problèmes cités ci-dessous, puis cliquez sur le bouton OK. Sinon, choisissez un autre fichier.</p>"
        },
        "yamlException": {
          "detail": "{0} à la ligne {1}, colonne {2}"
        },
        "wktModelContent": {
          "summary": "Problèmes de contenu de modèle",
          "detail": "Utilisez l'éditeur de modèle de l'onglet <i>Vue du code</i> pour résoudre les problèmes."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": {
          "value": "Non défini"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Utiliser un modèle dispersé"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "Etablir une connexion non sécurisée"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Modifier l'arborescence"
      },
      "view": {
        "tooltip": "Arborescence de la vue de configuration"
      },
      "monitoring": {
        "tooltip": "Arborescence de la surveillance"
      },
      "security": {
        "tooltip": "Arborescence des données de sécurité"
      },
      "modeling": {
        "tooltip": "Modèle WDT"
      },
      "composite": {
        "tooltip": "Modèle de composite WDT"
      },
      "properties": {
        "tooltip": "Editeur de liste des propriétés"
      }
    }
  },
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "Bandeau de navigation"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "Arborescence de navigation"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Accueil",
      "configuration": "Modifier l'arborescence",
      "view": "Arborescence de la vue de configuration",
      "monitoring": "Arborescence de la surveillance",
      "security": "Arborescence des données de sécurité",
      "modeling": "Modèle WDT",
      "composite": "Modèle de composite WDT",
      "properties": "Liste des propriétés"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Accueil"
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
          "label": "Providers"
        },
        "tips": {
          "label": "User Tips"
        },
        "dashboards": {
          "label": "Tableaux de bord"
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
          "value": "Hide All"
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
          "value": "Sécurité"
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
        "tooltip": "Historique"
      },
      "separator": {
        "tooltip": "Séparateur"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Effacer les entrées de l'historique",
          "label": "Effacer les entrées de l'historique"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "exécution à {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Connexion perdue",
        "detail": "La connexion au back-end de la console distante a été perdue. Assurez-vous qu'il est en cours d'exécution, ou redémarrez-le et réessayez le lien."
      },
      "cannotConnect": {
        "summary": "Echec de la tentative de connexion",
        "detail": "Impossible de se connecter au domaine WebLogic {0}, vérifiez que WebLogic est en cours d''exécution."
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Arborescences"
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
        "label": "Modifier l'arborescence",
        "description": "<p>Gérez la configuration du domaine WebLogic que vous utilisez.</p>"
      },
      "view": {
        "label": "Arborescence de la vue de configuration",
        "description": "<p>Examinez la configuration en lecture seule du domaine WebLogic que vous utilisez.</p>"
      },
      "monitoring": {
        "label": "Arborescence de la surveillance",
        "description": "<p>Visualisez les informations du MBean d'exécution pour les ressources sélectionnées dans le domaine WebLogic que vous utilisez.</p>"
      },
      "security": {
        "label": "Arborescence des données de sécurité",
        "description": "<p>Gérez les informations relatives à la sécurité (par exemple, utilisateurs, groupes, rôles, stratégies, informations d'identification, etc.) dans le domaine WebLogic que vous utilisez actuellement.</p>"
      },
      "modeling": {
        "label": "Arborescence du modèle WDT",
        "description": "<p>Gérez les fichiers de modèle associés à l'outil WebLogic Deploy Tooling.</p>"
      },
      "composite": {
        "label": "Arborescence du modèle de composite WDT",
        "description": "<p>Visualisez un ensemble combinés des fichiers de modèle WebLogic Deploy Tooling que vous utilisez actuellement.</p>"
      },
      "properties": {
        "label": "Editeur de liste des propriétés",
        "description": "<p>Visualisez ou modifiez un ensemble de propriétés provenant d'un fichier de liste des propriétés.</p>"
      }
    }
  },
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "Ajouter un fournisseur de connexion au serveur d'administration",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "Ajouter un fournisseur de fichier de modèle WDT",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "Ajouter un fournisseur de fichier de modèle de composite WDT",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "Ajouter un fournisseur de liste des propriétés",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "Créer un fournisseur pour le nouveau fichier de modèle WDT",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "Créer un fournisseur pour la nouvelle liste des propriétés",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "Importer un projet",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "Annuler les modifications"
      },
      "commit": {
        "tooltip": "Valider les modifications"
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
        "label": "Redémarrage"
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
      },
      "customize": {
        "label": "Personnaliser la table"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Page de destination"
      },
      "history": {
        "tooltip": "Activer/Désactiver la visibilité de l'historique"
      },
      "instructions": {
        "tooltip": "Activer/Désactiver la visibilité des instructions"
      },
      "help": {
        "tooltip": "Activer/Désactiver la visibilité de la page d'aide"
      },
      "sync": {
        "tooltip": "Recharger",
        "tooltipOn": "Arrêter le rechargement automatique"
      },
      "syncInterval": {
        "tooltip": "Définir l'intervalle de rechargement automatique"
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
          "label": "Valider les modifications"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Sélectionnez les éléments sur lesquels effectuer l''opération ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Message",
          "detail": "Impossible d''effectuer l''action ''{0}'' lorsque le rechargement automatique est en cours. Cliquez d''abord sur l''icône ''{1}'' pour l''arrêter."
        }
      }
    },
    "prompts": {
      "download": {
        "value": "Emplacements de fichier journal téléchargé :"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Afficher les colonnes masquées"
      }
    },
    "labels": {
      "totalRows": {
        "value": "Nombre total de lignes : {0}"
      },
      "reloadHidden": {
        "value": "Recharger la table pour voir les valeurs {0} en cours"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "Colonnes disponibles"
      },
      "selected": {
        "value": "Colonnes sélectionnées"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "Colonnes insuffisantes",
          "detail": "Vous devez sélectionner au moins une colonne."
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
        "label": "Créer"
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
        "label": "Créer"
      },
      "customize": {
        "label": "Personnaliser la table"
      },
      "dashboard": {
        "label": "Nouveau tableau de bord"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Enregistrer"
      },
      "create": {
        "tooltip": "Créer"
      },
      "landing": {
        "tooltip": "Page de destination"
      },
      "history": {
        "tooltip": "Activer/Désactiver la visibilité de l'historique"
      },
      "instructions": {
        "tooltip": "Activer/Désactiver la visibilité des instructions"
      },
      "help": {
        "tooltip": "Activer/Désactiver la visibilité de la page d'aide"
      },
      "sync": {
        "tooltip": "Recharger",
        "tooltipOn": "Arrêter le rechargement automatique"
      },
      "syncInterval": {
        "tooltip": "Définir l'intervalle de rechargement automatique"
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
          "label": "Valider les modifications"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Afficher les champs avancés"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Cliquez sur l''icône {0} pour basculer entre l''aide récapitulative et l''aide détaillée."
      }
    },
    "messages": {
      "savedTo": {
        "shoppingcart": "Les modifications ont été ajoutées au panier.",
        "generic": "Les modifications ont été enregistrées.",
        "notSaved": "Aucune modification enregistrée car aucune n'a été détectée."
      },
      "action": {
        "notAllowed": {
          "summary": "Action non autorisée",
          "detail": "Impossible d'effectuer l'action demandée pendant une opération de création. Cliquez sur le bouton Annuler pour annuler l'opération de création."
        }
      }
    },
    "icons": {
      "restart": {
        "tooltip": "Redémarrage du serveur ou de l'application requis"
      },
      "wdtIcon": {
        "tooltip": "Paramètres de WDT"
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
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>Rubriques connexes :</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "Attributs"
      },
      "actions": {
        "label": "Actions"
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Champs requis incomplets",
        "detail": "Le champ {0} est requis mais aucune valeur n''a été fournie (ou une valeur non valide est fournie)."
      }
    }
  },
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "Ajouter une condition"
        },
        "combine": {
          "label": "Combiner"
        },
        "uncombine": {
          "label": "Annuler la combinaison"
        },
        "moveup": {
          "label": "Déplacer vers le haut"
        },
        "movedown": {
          "label": "Déplacer vers le bas"
        },
        "remove": {
          "label": "Enlever"
        },
        "negate": {
          "label": "Inverser"
        },
        "reset": {
          "label": "Réinitialiser"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "Ajouter une nouvelle première condition..."
          },
          "above": {
            "label": "Ajouter une condition au-dessus de la ligne sélectionnée..."
          },
          "below": {
            "label": "Ajouter une condition en dessous de la ligne sélectionnée..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "Ajouter au-dessus de la condition sélectionnée..."
          },
          "below": {
            "label": "Ajouter en dessous de la condition sélectionnée..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "Certains champs requis ne contiennent aucune donnée."
      },
      "argumentValueHasWrongFormat": {
        "summary": "Le champ ''{0}'' contient des données au format incorrect."
      },
      "conditionHasNoArgValues": {
        "summary": "La condition sélectionnée ne comporte aucune valeur d'argument à modifier."
      },
      "conditionAlreadyExists": {
        "summary": "Cette stratégie de sécurité comporte déjà une condition créée à l'aide du prédicat sélectionné ou une condition avec des valeurs d'argument correspondantes."
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>Pour indiquer l'emplacement de la nouvelle condition, placez une coche en regard de la condition relative, puis cliquez sur le bouton <b>+ Ajouter une condition</b>.</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "Plage : -31 à 31"
      },
      "dateTime": {
        "value": "Format : y-MM-dd HH:mm:ss [HH:mm:ss] (par exemple, 2006-04-25 00:00:00)"
      },
      "time": {
        "value": "Format : HH:mm:ss (par exemple, 14:22:47)"
      },
      "gmtOffset": {
        "value": "Format : GMT+|-h:mm (par exemple, GMT-5:00)"
      },
      "weekDay": {
        "value": "par exemple, dimanche, lundi, mardi..."
      },
      "or": {
        "value": "ou"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "Combinaison"
      },
      "nodata": {
        "Policy": {
          "value": "Utilisez le bouton <b>+ Ajouter une condition</b> pour ajouter une condition de stratégie."
        },
        "DefaultPolicy": {
          "value": "Aucune condition de stratégie de sécurité par défaut n'est définie."
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "Combinaison",
            "operator": "Opérateur",
            "expression": "Phrase de condition"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "Ou",
            "and": "Et"
          }
        }
      }
    },
    "wizard": {
      "title": "Gestion des stratégies",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "Choisir un prédicat",
            "instructions": "Choisissez le prédicat pour la nouvelle condition dans la liste déroulante."
          },
          "body": {
            "labels": {
              "predicateList": "Liste de prédicats"
            },
            "help": {
              "predicateList": "La liste de prédicats est une liste de prédicats disponibles permettant d'élaborer une condition de stratégie de sécurité."
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "Prédicat de groupe",
            "instructions": "Commencez à saisir du texte dans le champ <i></i> pour ajouter des valeurs d'argument ou pour rechercher des valeurs d'argument existantes. Appuyez sur Entrée pour ajouter la valeur saisie à la liste. Pour modifier une valeur d'argument existante, cliquez dessus et modifiez-la à l'aide du champ d'entrée de la fenêtre instantanée."
          },
          "body": {
            "labels": {
              "conditionPhrase": "Phrase de condition",
              "negate": "Inverser la condition"
            },
            "help": {
              "negate": "Convertit la condition pour lui attribuer le sens opposé. Par exemple, \"est égal à\" devient \"n'est pas égal à\", \"dans\" devient \"pas dans\"."
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "Action"
      },
      "apply": {
        "label": "Appliquer"
      },
      "reset": {
        "label": "Réinitialiser"
      },
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Annuler"
      },
      "restart": {
        "label": "Redémarrage"
      },
      "yes": {
        "label": "Oui"
      },
      "no": {
        "label": "Non"
      },
      "choose": {
        "label": "Choisir"
      },
      "connect": {
        "label": "Connexion"
      },
      "add": {
        "label": "Ajouter/Envoyer"
      },
      "edit": {
        "label": "Modifier/Envoyer"
      },
      "import": {
        "label": "Importer"
      },
      "export": {
        "label": "Exporter"
      },
      "write": {
        "label": "Télécharger le fichier en local"
      },
      "savenow": {
        "label": "Enregistrer maintenant"
      },
      "next": {
        "label": "Suivant"
      },
      "previous": {
        "label": "Précédent"
      },
      "finish": {
        "label": "Terminer"
      },
      "done": {
        "label": "Terminé"
      },
      "close": {
        "label": "Fermer"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "Réduire"
      },
      "expand": {
        "value": "Développer"
      },
      "choose": {
        "value": "Sélectionner un fichier"
      },
      "clear": {
        "value": "Effacer le fichier sélectionné"
      },
      "more": {
        "value": "Actions supplémentaires"
      },
      "download": {
        "value": "Parcourir"
      },
      "reset": {
        "value": "Réinitialiser"
      },
      "filter": {
        "value": "Filtre"
      },
      "submit": {
        "value": "Soumettre les modifications"
      },
      "write": {
        "value": "Télécharger le fichier en local"
      },
      "pick": {
        "value": "Sélectionner un répertoire"
      },
      "reload": {
        "value": "Recharger le fichier"
      },
      "delete": {
        "value": "Supprimer"
      },
      "remove": {
        "value": "Enlever"
      },
      "noData": {
        "value": "Aucune donnée"
      },
      "preloader": {
        "value": "Préchargeur"
      },
      "checkAll": {
        "value": "Sélectionner tout"
      },
      "checkNone": {
        "value": "Désélectionner tout"
      },
      "checkSome": {
        "value": "Effacer les sélections"
      },
      "close": {
        "value": "Fermer"
      },
      "recentPages": {
        "value": "Activer/Désactiver la visibilité de l'historique"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "Sélectionner un fichier..."
      },
      "chooseDir": {
        "value": "Choisir un répertoire..."
      }
    },
    "labels": {
      "info": {
        "value": "Informations"
      },
      "warn": {
        "value": "Avertissement"
      },
      "error": {
        "value": "Erreur"
      }
    },
    "placeholders": {
      "search": {
        "value": "Rechercher"
      }
    },
    "title": {
      "incorrectFileContent": {
        "value": "Contenu incorrect détecté"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}'' contient des données JSON mais n''est pas une représentation JSON de {1}."
      },
      "dataCopiedToClipboard": {
        "summary": "Les données ont été copiées dans le presse-papiers."
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "Aucune donnée n'a été copiée dans le presse-papiers car la cellule sélectionnée était vide."
      },
      "emptyRowData": {
        "detail": "Aucune donnée n'a été copiée dans le presse-papiers car la ligne sélectionnée était vide."
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "Copier la cellule dans le presse-papiers"
        },
        "row": {
          "label": "Copier la ligne dans le presse-papiers"
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
        "summary": "Les modifications ont été enregistrées dans le fichier ''{0}''."
      },
      "changesNotSaved": {
        "summary": "Impossible d''enregistrer les modifications dans le fichier ''{0}''."
      },
      "changesDownloaded": {
        "summary": "Les modifications ont été téléchargées vers le fichier ''{0}''."
      },
      "changesNotDownloaded": {
        "summary": "Impossible de télécharger les modifications vers le fichier ''{0}''."
      },
      "verifyPathEntered": {
        "detail": ". La définition du champ {0} sur False entraîne l''acceptation de la valeur saisie, sans valider son existence en tant que répertoire ou fichier local."
      }
    },
    "wdtOptionsDialog": {
      "title": "Modifier : {0}",
      "default": "Annuler la définition de la valeur",
      "instructions": "Indiquez un jeton à ajouter à la liste des éléments sélectionnables.",
      "enterValue": "Saisir une valeur",
      "selectValue": "Sélectionner une valeur",
      "selectSwitch": "Activer/désactiver la valeur",
      "enterUnresolvedReference": "Saisir une référence non résolue",
      "enterModelToken": "Saisir un jeton de modèle",
      "selectPropsVariable": "Sélectionner une variable de jeton de modèle",
      "createPropsVariable": "Créer une variable de jeton de modèle",
      "propName": "Nom de la variable (requis)",
      "propValue": "Valeur de la variable",
      "enterVariable": "Entrer une variable",
      "variableName": "Nom de la variable (requis)",
      "variableValue": "Valeur de la variable",
      "multiSelectUnset": "Sélectionner la valeur dans la liste des éléments disponibles"
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "Modifications non enregistrées détectées"
      },
      "changesNeedDownloading": {
        "value": "Modifications non téléchargées"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Toutes les modifications non enregistrées seront perdues. Continuer ?"
        },
        "areYouSure": {
          "value": "Voulez-vous {0} sans enregistrer les modifications ?"
        },
        "saveBeforeExiting": {
          "value": "Voulez-vous enregistrer les modifications avant de quitter le système ?"
        },
        "needDownloading": {
          "value": "Les modifications apportées à ''{0}'' n''ont pas été téléchargées vers le fichier.<br/><br/>Voulez-vous les télécharger avant de continuer ?"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "La nouvelle instance ''{0}'' n''a pas été ajoutée au modèle WDT.<br/><br/>Voulez-vous l''ajouter avant de continuer ?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Définir l'intervalle de rechargement automatique",
      "instructions": "Combien de secondes voulez-vous définir pour l'intervalle de rechargement automatique ?",
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
          "detail": "L''appel de back-end de console a généré une réponse ''{0}'' lors de la tentative d''exécution de l''action ''{1}''"
        },
        "actionNotPerformed": {
          "detail": "Impossible d''effectuer l''action ''{0}'' sur au moins un des éléments sélectionnés"
        },
        "actionSucceeded": {
          "summary": "L''action ''{0}'' a été effectuée."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Impossible de déterminer la cause exacte. Consultez la console JavaScript pour obtenir des conseils."
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "Confirmation de l'action",
        "prompt": "L''action ''{0}'' ne peut pas être annulée.<br/><br/>Continuer ?"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponible",
        "chosen": "Choisi"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "Nom de propriété",
        "value": "Valeur de propriété"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "Nom des propriétés",
        "valueHeader": "Valeur des propriétés",
        "addButtonTooltip": "Ajouter",
        "deleteButtonTooltip": "Supprimer"
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
            "label": "Créer : {0}..."
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
      "label": "Rétablir la valeur par défaut"
    },
    "placeholder": {
      "value": "valeur par défaut"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}'' n''est pas disponible."
      }
    }
  },
  "wrc-ataglance": {
    "labels": {
      "running": {
        "value": "En cours d'exécution"
      },
      "shutdown": {
        "value": "Arrêt"
      },
      "serverStates": {
        "value": "Etats de serveur"
      },
      "systemStatus": {
        "value": "Statut du système"
      },
      "healthState": {
        "failed": {
          "value": "Echec"
        },
        "critical": {
          "value": "Critique"
        },
        "overloaded": {
          "value": "Surchargé"
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
        "value": "Etat général des serveurs en cours d'exécution en date du"
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
        "detail": "Echec de la tentative : "
      },
      "badRequest": {
        "detail": "Impossible de traiter la demande ou le fichier soumis"
      },
      "invalidCredentials": {
        "detail": "Les informations d'identification du domaine WebLogic ne sont pas valides"
      },
      "invalidUrl": {
        "detail": "L'URL du domaine WebLogic n'est pas accessible"
      },
      "notInRole": {
        "detail": "Echec de la tentative : l'utilisateur n'est pas un administrateur, un responsable de déploiement, un opérateur ou un moniteur"
      },
      "notSupported": {
        "detail": "Le domaine WebLogic n'est pas pris en charge"
      },
      "unexpectedStatus": {
        "detail": "Résultat inattendu (statut : {0})"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Echec de la demande",
          "detail": "Un appel de back-end de console a renvoyé une réponse d'échec."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Reportez-vous au terminal de la console distante ou à la console JavaScript pour connaître les motifs spécifiques."
      },
      "responseMessages": {
        "summary": "Messages de réponse"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "Impossible d'accéder au gestionnaire de modifications."
      },
      "changesCommitted": {
        "summary": "Les modifications ont été validées."
      },
      "changesNotCommitted": {
        "summary": "Impossible de valider les modifications."
      },
      "changesDiscarded": {
        "summary": "Les modifications ont été annulées."
      },
      "changesNotDiscarded": {
        "summary": "Impossible d'annuler les modifications."
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Réponse d'erreur inattendue"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "Problème de connexion",
        "details": "Problème d'envoi et de réception des données du fournisseur. Assurez-vous que ce dernier est accessible et réessayez."
      },
      "pathNotFound": {
        "summary": "Chemin introuvable",
        "details": "''{0}'' n''est pas un fichier ni un répertoire accessible sur le système de fichiers local."
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "Effacer le message"
        },
        "suppress": {
          "info": {
            "label": "Supprimer les messages d'information"
          },
          "warning": {
            "label": "Supprimer les messages d'avertissement"
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
          "value": "Afficher les alertes"
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