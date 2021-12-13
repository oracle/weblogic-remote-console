define({
  "root": {
    "wrc-header": {
      "text": {
        "appName": "WebLogic Remote Console"
      },
      "icons": {
        "connectivity": {
          "online": {"tooltip": "Online"},
          "offline": {"tooltip": "Offline"},
          "detached": {"tooltip": "Detached"}
        }
      }
    },
    "wrc-footer": {
      "text": {
        "copyrightLegal": "Copyright © 2020, 2021, Oracle and/or its affiliates.<br/>Oracle is a registered trademark of Oracle Corporation and/or its affiliates. Other names may be trademarks of their respective owners.<br/>",
        "builtWith": "Built with Oracle JET"
      }
    },
    "wrc-data-providers": {
      "icons": {
        "info": {"tooltip": "Get Info"},
        "edit": {"tooltip": "Manage"},
        "delete": {"tooltip": "Remove"}
      },
      "labels": {
        "connections": {
          "header": {"value": "Unnamed Project"},
          "name": {"value": "Connection Provider Name"},
          "url": {"value": "URL"},
          "username": {"value": "Username"},
          "password": {"value": "Password"}
        },
        "models": {
          "name": {"value": "WDT Model Provider Name"},
          "file": {"value": "WDT Model Filename"}
        },
        "project": {
          "name": {"value": "Project Name"},
          "file": {"value": "Project Filename"}
        },
        "provider": {
          "adminserver": {"value": "Admin Server Connection"},
          "model": {"value": "WDT Model"}
        }
      },
      "popups": {
        "info": {
          "provider": {
            "id": {"label": "Provider Id:"}
          },
          "domain": {
            "name": {"label": "Domain Name:"},
            "url": {"label": "Domain URL:"},
            "version": {"label": "Domain Version:"},
            "username": {"label": "Username:"},
            "roles": {"label": "Roles:"},
            "connectTimeout": {"label": "Connect Timeout:"},
            "readTimeout": {"label": "Read Timeout:"},
            "anyAttempt": {"label": "Any Connections Attempted:"},
            "lastAttempt": {"label": "Last Attempt Successful:"}
          },
          "model": {
            "file": {"label": "File:"}
          }
        }
      },
      "menus": {
        "connections": {
          "add": {"value": "Add Admin Server Connection Provider"},
          "add1": {"value": "Create Provider for Admin Server Connection"}
        },
        "models": {
          "add": {"value": "Add WDT Model File Provider"},
          "add1": {"value": "Create Provider for Existing WDT Model File"},
          "new": {"value": "Create Provider for New WDT Model File"}
        },
        "providers": {
          "sort": {"value": "Sort by Provider Type"}
        },
        "context": {
          "info": {
            "connection": {
              "domain": {
                "url": {"label": "Domain URL:"},
                "version": {"label": "Domain Version:"},
                "username": {"label": "Username:"}
              }
            },
            "model": {
              "file": {"label": "File:"}
            }
          }
        },
        "project": {
          "export": {"value": "Export Providers as Project..."},
          "import": {"value": "Import Project"}
        }
      },
      "instructions": {
        "connections": {
          "add": {"value": "Enter new name and connectivity settings for connection provider."},
          "edit": {"value": "Modify connectivity settings for connection provider."}
        },
        "models": {
          "add": {"value": "Enter settings for existing model file provider. Click upload icon to browse for model file."},
          "new": {"value": "Enter provider name and filename for new WDT model file, then click icon to pick directory to save file in."},
          "edit": {"value": "Modify settings for model file provider. Click icon to browse for model file."}
        },
        "project": {
          "export": {"value": "Enter settings for project."},
          "import": {"value": "Click download icon to browse for project."}
        },
        "task": {
          "startup": {"value": "Which startup task are you interested in performing?"}
        }
      },
      "titles": {
        "add": {
          "connections": {"value": "Create Provider for Admin Server Connection"},
          "models": {"value": "Create Provider for Existing WDT Model File"}
        },
        "new": {
          "models": {"value": "Create Provider for New WDT Model File"}
        },
        "edit": {
          "connections": {"value": "Edit Admin Server Connection Provider"},
          "models": {"value": "Edit WDT Model File Provider"}
        },
        "export": {
          "project": {"value": "Export Providers to Project"}
        },
        "import": {
          "project": {"value": "Import Project"}
        },
        "startup": {
          "task": {"value": "Startup Task"}
        }
      },
      "messages": {
        "export": {
          "failed": {
            "summary": "Export Unsuccessful",
            "detail": "Unable to export providers as '{0}' project."
          }
        },
        "import": {
          "failed": {
            "summary": "Import Unsuccessful",
            "detail": "Unable to import '{0}' project file."
          }
        },
        "stage": {
          "failed": {
            "summary": "Create Unsuccessful",
            "detail": "Unable to create '{0}' provider item."
          }
        },
        "use": {
          "failed": {
            "summary": "Connection Unsuccessful",
            "detail": "Unable to use '{0}' provider item."
          }
        },
        "response": {
          "nameAlreadyExist": {
            "detail": "Provider named '{0}' is already in this project"
          }
        }
      },
      "prompts": {
        "info": {
          "fileNotSet": {"value": "Not set"}
        }
      },
      "checkboxes": {
        "useSparseTemplate": {"label": "Use Sparse Template"}
      }
    },
    "wrc-navstrip": {
      "icons": {
        "configuration": {"tooltip": "Edit Tree"},
        "view": {"tooltip": "Configuration View Tree"},
        "monitoring": {"tooltip": "Monitoring Tree"},
        "modeling": {"tooltip": "WDT Model"}
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
          "home": {"label": "Home"},
          "preferences": {"label": "Preferences"},
          "search": {"label": "Search"}
        }
      }
    },
    "wrc-ancillary-content": {
      "tabstrip": {
        "tabs": {
          "shoppingcart": {"label": "Shopping Cart"},
          "ataglance": {"label": "At-A-Glance"},
          "projectmanagement": {"label": "Provider Management"}
        }
      },
      "icons": {
        "kiosk": {"tooltip": "Kiosk"}
      }
    },
    "wrc-perspective": {
      "icons": {"history": {"tooltip": "History"}},
      "menus": {"history": {"clear": {"value": "Clear History"}}},
      "messages": {"dataNotAvailable": {"summary": "Data Not Available"}}
    },
    "wrc-monitoring": {
      "icons": {"history": {"tooltip": "History"}},
      "menus": {"history": {"clear": {"value": "Clear History"}}},
      "messages": {"dataNotAvailable": {"summary": "Data Not Available"}}
    },
    "wrc-domain-connection": {
      "labels": {"runningAt": {"value": "running at {0}"}},
      "messages": {
        "lostConnection": {
          "summary": "Lost Connection",
          "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
        },
        "cannotConnect": {
          "summary": "Connection Attempt Failed",
          "detail": "Unable to connect to the WebLogic Domain {0}, please check that WebLogic is running."
        }
      }
    },
    "wrc-home": {"tabstrip": {"tabs": {"gallery": {"label": "Gallery"}}}},
    "wrc-gallery": {
      "cards": {
        "configuration": {
          "label": "Edit Tree",
          "description": "<p>Maintain configuration of WebLogic domain you are currently working with.</p>"
        },
        "view": {
          "label": "Configuration View Tree",
          "description": "<p>Examine read-only configuration of WebLogic domain you are currently working with.</p>"
        },
        "monitoring": {
          "label": "Monitoring Tree",
          "description": "<p>View runtime MBean information for select resources in WebLogic domain you are currently working with.</p>"
        },
        "modeling": {
          "label": "WDT Model Tree",
          "description": "<p>Maintain model files associated with the WebLogic Deploy Tooling tool.</p>"
        }
      }
    },
    "wrc-shoppingcart": {
      "icons": {"discard": {"tooltip": "Discard Changes"}, "commit": {"tooltip": "Commit Changes"}},
      "sections": {
        "changeManager": {"label": "Change Manager"},
        "additions": {"label": "Additions"},
        "modifications": {"label": "Modifications"},
        "removals": {"label": "Removals"},
        "restart": {"label": "Restart"}
      }
    },
    "wrc-table-toolbar": {
      "buttons": {"new": {"label": "New"}, "clone": {"label": "Clone"}, "delete": {"label": "Delete"}},
      "icons": {
        "landing": {"tooltip": "Landing Page"},
        "history": {"tooltip": "Toggle visibility of history"},
        "instructions": {"tooltip": "Toggle visibility of instructions"},
        "help": {"tooltip": "Toggle visibility of Help page"},
        "sync": {"tooltip": "Reload", "tooltipOn": "Stop Auto-Reload"},
        "syncInterval": {"tooltip": "Set Auto-Reload Interval"},
        "shoppingcart": {"tooltip": "Click to view actions for cart"}
      },
      "menu": {
        "shoppingcart": {
          "view": {"label": "View Changes"},
          "discard": {"label": "Discard Changes"},
          "commit": {"label": "Commit Changes"}
        }
      },
      "instructions": {"selectItems": {"value": "Select items you want to perform '{0}' operation on."}},
      "messages": {
        "action": {
          "cannotPerform": {
            "summary": "Message",
            "detail": "Cannot perform '{0}' action while auto-reload is running! Please click the '{1}' icon to stop it, first."
          }
        }
      },
      "labels": {
        "start": {"value": "Start"},
        "resume": {"value": "Resume"},
        "suspend": {"value": "Suspend"},
        "shutdown": {"value": "Shutdown"},
        "restartSSL": {"value": "Restart SSL"},
        "stop": {"value": "Stop"}
      }
    },
    "wrc-table": {
      "checkboxes": {"showHiddenColumns": {"label": "Show Hidden Columns"}},
      "actionsDialog": {"buttons": {"cancel": {"label": "Cancel"}}}
    },
    "wrc-form-toolbar": {
      "buttons": {
        "save": {"label": "Save"},
        "new": {"label": "Create"},
        "delete": {"label": "Remove"},
        "back": {"label": "Back"},
        "next": {"label": "Next"},
        "finish": {"label": "Create"}
      },
      "icons": {
        "save": {"tooltip": "Save"},
        "create": {"tooltip": "Create"},
        "landing": {"tooltip": "Landing Page"},
        "history": {"tooltip": "Toggle visibility of history"},
        "instructions": {"tooltip": "Toggle visibility of instructions"},
        "help": {"tooltip": "Toggle visibility of Help page"},
        "sync": {"tooltip": "Reload", "tooltipOn": "Stop Auto-Reload"},
        "syncInterval": {"tooltip": "Set Auto-Reload Interval"},
        "shoppingcart": {"tooltip": "Click to view actions for cart"}
      },
      "menu": {
        "shoppingcart": {
          "view": {"label": "View Changes"},
          "discard": {"label": "Discard Changes"},
          "commit": {"label": "Commit Changes"}
        }
      }
    },
    "wrc-form": {
      "checkboxes": {"showAdvancedFields": {"label": "Show Advanced Fields"}},
      "introduction": {"toggleHelp": {"text": "Click the {0} icon to toggle between summary and detailed help."}},
      "messages": {"save": "Changes added to cart"},
      "icons": {
        "restart": {"tooltip": "Server or App Restart Required"},
        "wdtIcon": {"tooltip": "WDT Settings"}
      }
    },
    "wrc-help-form": {
      "tables": {
        "help": {
          "label": "Help Table",
          "columns": {
            "header": {"name": "Name", "description": "Description"}
          }
        }
      }
    },
    "wrc-create-form": {
      "pageState": {
        "error": {
          "summary": "Incomplete Required Fields",
          "detail": "{0} field is required, but no value has been provided."
        }
      }
    },
    "wrc-navtree": {
      "icons": {
        "docked": { "tooltip": "Dock in Navigation Area"},
        "floating": { "tooltip": "Detach from Navigation Area"},
        "restore": { "tooltip": "Restore"},
        "minimized": { "tooltip": "Minimize"},
        "closed": { "tooltip": "Close"}
      }
    },
    "wrc-wdt-form": {
      "messages": {
        "changesSaved": {"summary": "Changes were successfully saved to '{0}' file!"},
        "changesNotSaved": {"summary": "Unable to save changes to '{0}' file!"},
        "changesDownloaded": {"summary": "Changes were successfully downloaded to '{0}' file!"},
        "changesNotDownloaded": {"summary": "Unable to download changes to '{0}' file!"}
      },
      "wdtOptionsDialog" : {
        "title": "Edit: {0}",
        "instructions": "Enter token to add to the list of selectable items.",
        "default": "Restore to default",
        "enterValue": "Enter value",
        "selectValue": "Select value",
        "selectSwitch": "Toggle Value",
        "enterUnresolvedReference": "Enter value",
        "enterModelToken": "Enter model token"
      }
    },
    "wrc-common": {
      "buttons": {
        "ok": {"label": "OK"},
        "cancel": {"label": "Cancel"},
        "yes": {"label": "Yes"},
        "no": {"label": "No"},
        "choose": {"label": "Choose"},
        "connect": {"label": "Connect"},
        "add": {"label": "Add/Send"},
        "edit": {"label": "Edit/Send"},
        "import": {"label": "Import"},
        "export": {"label": "Export"},
        "write": {"label": "Download File"},
        "savenow": {"label": "Save Now"}
      },
      "tooltips": {
        "collapse": {"value": "Collapse"},
        "expand": {"value": "Expand"},
        "choose": {"value": "Choose File"},
        "clear": {"value": "Clear Chosen File"},
        "more": {"value": "More Actions"},
        "download": {"value": "Browse"},
        "reset": {"value": "Reset"},
        "submit": {"value": "Submit Changes"},
        "write": {"value": "Download File"},
        "pick": {"value": "Pick Directory"}
      }
    },
    "wrc-unsaved-changes": {
      "titles": {
        "unsavedChanges": {"value": "Unsaved Changes Detected"},
        "changesNeedDownloading": {"value": "Changes Not Downloaded"}
      },
      "prompts": {
        "unsavedChanges": {
          "willBeLost": {"value": "All unsaved changes will be lost. Continue?"},
          "areYouSure": {"value": "Are you sure you want to exit without saving changes?"},
          "needDownloading": {"value": "Your changes have not been download to the WDT model file, yet.<br/><br/>Download them before continuing?"}
        }
      }
    },
    "wrc-sync-interval": {
      "dialogSync": {
        "title": "Set Auto-Reload Interval",
        "instructions": "How many seconds do you want for the auto-reloading interval?",
        "fields": {"interval": {"label": "Auto-Reload Interval:"}}
      }
    },
    "wrc-pdj-actions": {
      "messages": {
        "action": {
          "unableToPerform": {
            "summary": "Message",
            "detail": "Console backend call generated a '{0}' response when attempting to perform specified action on '{1}'."
          }
        }
      },
      "labels": {"cannotDetermineExactCause": {"value": "Cannot determine exact cause. Check JavaScript Console for hints."}}
    },
    "wrc-pdj-fields": {"cfe-multi-select": {"labels": {"available": "Available", "chosen": "Chosen"}}},
    "wrc-pdj-options-sources": {
      "menus": {
        "more": {
          "optionsSources": {
            "view": {"label": "View {0}..."},
            "create": {"label": "Create New {0}..."},
            "edit": {"label": "Edit {0}..."}
          }
        }
      }
    },
    "wrc-pdj-unset": {
      "menu": {"label": "Restore to default"},
      "placeholder": {"value": "default"}
    },
    "wrc-pdj-crosslinks": {
      "messages": {
        "noNotFoundMessage": {
          "summary": "Message",
          "detail": "RDJ did not contain a 'notFoundMessage' field for the '{0}' item."
        }
      }
    },
    "wrc-ataglance": {
      "labels": {
        "running": {"value": "RUNNING"},
        "shutdown": {"value": "SHUTDOWN"},
        "serverStates": {"value": "Server States"},
        "systemStatus": {"value": "System Status"},
        "healthState": {
          "failed": {"value": "Failed"},
          "critical": {"value": "Critical"},
          "overloaded": {"value": "Overloaded"},
          "warning": {"value": "Warning"},
          "ok": {"value": "OK"}
        }
      },
      "descriptions": {"healthState": {"value": "Health of Running Servers as of"}},
      "headers": {"serverStates": {"name": {"value": "Name"}, "state": {"value": "State"}}}
    },
    "wrc-data-operations": {
      "messages": {
        "backendNotReachable": {"detail": "Backend not currently reachable."},
        "connectionMessage": {"summary": "Connection Message"},
        "connectFailed": {"detail": "Attempt Failed: "},
        "badRequest": {"detail": "Unable to process the submitted file or request"},
        "invalidCredentials": {"detail": "WebLogic Domain credentials are not valid "},
        "invalidUrl": {"detail": "WebLogic Domain URL is not reachable "},
        "notInRole": {"detail": "Attempt Failed: The user is not an Admin, Deployer, Operator or Monitor"},
        "notSupported": {"detail": "WebLogic Domain is not supported "},
        "unexpectedStatus": {"detail": "Unexpected result (status: {0}) "},
        "cbeRestApi": {
          "requestUnsuccessful": {
            "summary": "Request Unsuccessful",
            "detail": "A non-successful response was returned from a console backend call."
          }
        }
      }
    },
    "wrc-message-displaying": {
      "messages": {
        "seeJavascriptConsole": {"detail": "See remote console terminal or Javascript console for specific reason(s)."},
        "responseMessages": {"summary": "Response Messages"}
      }
    },
    "wrc-change-manager": {
      "messages": {
        "cannotGetLockState": {"summary": "Unable to access change manager!"},
        "changesCommitted": {"summary": "Changes were successfully committed!"},
        "changesNotCommitted": {"summary": "Unable to commit changes!"},
        "changesDiscarded": {"summary": "Changes were successfully discarded!"},
        "changesNotDiscarded": {"summary": "Unable to discard changes!"}
      }
    },
    "wrc-view-model-utils": {"labels": {"unexpectedErrorResponse": {"value": "Unexpected Error Response"}}}
  },
  "ar-XB": false,
  "de": true,
  "en-XA": false,
  "en-XC": false,
  "es": true,
  "fr": true,
  "it": true,
  "ja": false,
  "ko": false,
  "pt-BR": false,
  "zh-CN": false,
  "zh-TW": false
});