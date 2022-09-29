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
          "tooltip": "Détaché"
        },
        "unattached": {
          "tooltip": "Détaché"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright © 2020, 2022, Oracle et/ou ses affiliés.<br/>Oracle est une marque déposée d'Oracle Corporation et/ou ses affiliés. Tout autre nom mentionné peut correspondre à des marques appartenant à d'autres propriétaires qu'Oracle.<br/>",
      "builtWith": "Conçu avec Oracle JET"
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
        "tooltip": "Deactivate"
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
          "version": {
            "label": "Version de domaine :"
          },
          "username": {
            "label": "Nom utilisateur :"
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
        "fileNotSet": "Non défini"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Utiliser un modèle dispersé"
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
        "tooltip": "Security Data Tree"
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
  "wrc-content-area-header": {
    "title": {
      "home": "Accueil",
      "configuration": "Modifier l'arborescence",
      "view": "Arborescence de la vue de configuration",
      "monitoring": "Arborescence de la surveillance",
      "security": "Security Data Tree",
      "modeling": "Modèle WDT",
      "composite": "Modèle de composite WDT",
      "properties": "Liste des propriétés"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Accueil"
        },
        "preferences": {
          "label": "Préférences"
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
          "label": "Gestion des fournisseurs"
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
          "label": "Galerie"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Modifier l'arborescence",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "Arborescence de la vue de configuration",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "Arborescence de la surveillance",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
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
    "labels": {
      "start": {
        "value": "Démarrer"
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
        "value": "Redémarrer SSL"
      },
      "stop": {
        "value": "Arrêter"
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
        "value": "Reload the table to view the current {0} values"
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
        "shoppingcart": "Changes were added to cart!",
        "customView": "Changes were saved!"
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
  "wrc-common": {
    "buttons": {
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
      "default": "Valeur par défaut. (Non définie)",
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
      "multiSelectUnset": "\"Valeur par défaut. (Sélection à partir de la liste des éléments disponibles)\""
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
          "value": "Voulez-vous quitter cette page sans enregistrer les modifications ?"
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
          "value": "La nouvelle instance ''{0}'' n''a pas encore été ajoutée au modèle WDT.<br/><br/>Voulez-vous l''ajouter avant de continuer ?"
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
          "detail": "L''appel de back-end de console a généré une réponse ''{0}'' lors de la tentative d''exécution de l''action indiquée sur ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Impossible de déterminer la cause exacte. Consultez la console JavaScript pour obtenir des conseils."
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
        "detail": "Impossible de traiter la demande ou le fichier soumis "
      },
      "invalidCredentials": {
        "detail": "Les informations d'identification du domaine WebLogic ne sont pas valides "
      },
      "invalidUrl": {
        "detail": "L'URL du domaine WebLogic n'est pas accessible "
      },
      "notInRole": {
        "detail": "Echec de la tentative : l'utilisateur n'est pas un administrateur, un responsable de déploiement, un opérateur ou un moniteur"
      },
      "notSupported": {
        "detail": "Le domaine WebLogic n'est pas pris en charge "
      },
      "unexpectedStatus": {
        "detail": "Résultat inattendu (statut : {0}) "
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
      }
    }
  }
});