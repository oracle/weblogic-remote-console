define({
  "root": {
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
            "tooltip": "Detached"
          },
          "unattached": {
            "tooltip": "Unattached"
          }
        }
      }
    },
    "wrc-footer": {
      "text": {
        "copyrightLegal": "Copyright © 2020, 2022, Oracle and/or its affiliates.<br/>Oracle is a registered trademark of Oracle Corporation and/or its affiliates. Other names may be trademarks of their respective owners.<br/>",
        "builtWith": "Built with Oracle JET"
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
        "deactivate": {
          "tooltip": "Deactivate"
        },
        "delete": {
          "tooltip": "Remove"
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
            "value": "Username"
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
          },
          "props": {
            "value": "WDT Variables"
          }
        },
        "composite": {
          "name": {
            "value": "WDT Composite Model Provider Name"
          },
          "providers": {
            "value": "WDT Models"
          }
        },
        "proplist": {
          "name": {
            "value": "Property List Provider Name"
          },
          "file": {
            "value": "Property List Filename"
          }
        },
        "project": {
          "name": {
            "value": "Project Name"
          },
          "file": {
            "value": "Project Filename"
          }
        },
        "provider": {
          "adminserver": {
            "value": "Admin Server Connection"
          },
          "model": {
            "value": "Add WDT Model"
          }
        },
        "dropdown": {
          "none": {
            "value": "None"
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
              "label": "Domain URL:"
            },
            "version": {
              "label": "Domain Version:"
            },
            "username": {
              "label": "Username:"
            },
            "roles": {
              "label": "Roles:"
            },
            "connectTimeout": {
              "label": "Connect Timeout:"
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
            },
            "props": {
              "label": "Variables:"
            }
          },
          "composite": {
            "models": {
              "label": "Models:"
            }
          },
          "proplist": {
            "file": {
              "label": "Filename:"
            }
          }
        }
      },
      "menus": {
        "connections": {
          "add": {
            "value": "Add Admin Server Connection Provider"
          }
        },
        "models": {
          "add": {
            "value": "Add WDT Model File Provider"
          },
          "new": {
            "value": "Create Provider for New WDT Model File"
          }
        },
        "composite": {
          "add": {
            "value": "Add WDT Composite Model File Provider"
          }
        },
        "proplist": {
          "add": {
            "value": "Add Property List Provider"
          },
          "new": {
            "value": "Create Provider for New Property List"
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
                  "label": "Domain URL:"
                },
                "version": {
                  "label": "Domain Version:"
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
        "composite": {
          "add": {
            "value": "Enter new name and select an ordered list of models for the composite model provider."
          },
          "edit": {
            "value": "Modify settings for the composite model provider. Use an ordered list of models."
          }
        },
        "proplist": {
          "add": {
            "value": "Enter settings for existing property list provider. Click upload icon to browse for a properties file."
          },
          "new": {
            "value": "Enter provider name and filename for a new property list, then click icon to pick directory to save file in."
          },
          "edit": {
            "value": "Modify settings for the property list provider. Click icon to browse for a properties file."
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
          },
          "composite": {
            "value": "Create Provider for New WDT Composite Model"
          },
          "proplist": {
            "value": "Create Provider for Existing Property List"
          }
        },
        "new": {
          "models": {
            "value": "Create Provider for New WDT Model File"
          },
          "proplist": {
            "value": "Create Provider for New Property List"
          }
        },
        "edit": {
          "connections": {
            "value": "Edit Admin Server Connection Provider"
          },
          "models": {
            "value": "Edit WDT Model File Provider"
          },
          "composite": {
            "value": "Edit WDT Composite Model Provider"
          },
          "proplist": {
            "value": "Edit Property List Provider"
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
            "detail": "Unable to export providers as '{0}' project."
          }
        },
        "import": {
          "failed": {
            "summary": "Save Unsuccessful",
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
        "upload": {
          "failed": {
            "detail": "Unable to load the WDT model file: {0}"
          },
          "props": {
            "failed": {
              "detail": "Unable to load the WDT variables: {0}"
            }
          }
        },
        "response": {
          "nameAlreadyExist": {
            "detail": "Provider named '{0}' is already in this project!"
          },
          "modelsNotFound": {
            "detail": "Unable to find the configured WDT models '{0}'"
          },
          "propListNotFound": {
            "detail": "Unable to find the WDT variables '{0}'"
          },
          "selectModels": {
            "detail": "In order to select the WDT Composite, first select all of the WDT Models used by the WDT Composite."
          }
        },
        "correctiveAction": {
          "filePathNotFound": {
            "detail": "<p>Edit path in filename field, then click the OK button. Alternatively, click the upload icon and choose another file.</p>"
          },
          "fixModelFile": {
            "detail": "<p>Fix issue(s) cited below then click the OK button. Alternatively, choose a different file.</p>"
          },
          "yamlException": {
            "detail": "{0} at line {1}, column {2}"
          },
          "wktModelContent": {
            "summary": "Model Content Problems",
            "detail": "Use model editor on <i>Code View</i> tab to resolve problems."
          }
        }
      },
      "prompts": {
        "info": {
          "fileNotSet": "Not set"
        }
      },
      "checkboxes": {
        "useSparseTemplate": {
          "label": "Use Sparse Template"
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
        "security": {
          "tooltip": "Security Data Tree"
        },
        "modeling": {
          "tooltip": "WDT Model"
        },
        "composite": {
          "tooltip": "WDT Composite Model"
        },
        "properties": {
          "tooltip": "Property List Editor"
        }
      }
    },
    "wrc-content-area-header": {
      "title": {
        "home": "Home",
        "configuration": "Edit Tree",
        "view": "Configuration View Tree",
        "monitoring": "Monitoring Tree",
        "security": "Security Data Tree",
        "modeling": "WDT Model",
        "composite": "WDT Composite Model",
        "properties": "Property List"
      },
      "toolbar": {
        "buttons": {
          "home": {
            "label": "Home"
          },
          "preferences": {
            "label": "Preferences"
          }
        }
      }
    },
    "wrc-ancillary-content": {
      "tabstrip": {
        "tabs": {
          "shoppingcart": {
            "label": "Shopping Cart"
          },
          "ataglance": {
            "label": "At-A-Glance"
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
          "tooltip": "History"
        }
      },
      "menus": {
        "history": {
          "clear": {
            "value": "Clear History"
          }
        }
      }
    },
    "wrc-monitoring": {
      "icons": {
        "history": {
          "tooltip": "History"
        }
      },
      "menus": {
        "history": {
          "clear": {
            "value": "Clear History"
          }
        }
      }
    },
    "wrc-domain-connection": {
      "labels": {
        "runningAt": {
          "value": "running at {0}"
        }
      },
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
    "wrc-home": {
      "tabstrip": {
        "tabs": {
          "gallery": {
            "label": "Gallery"
          }
        }
      }
    },
    "wrc-gallery": {
      "cards": {
        "configuration": {
          "label": "Edit Tree",
          "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
        },
        "view": {
          "label": "Configuration View Tree",
          "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
        },
        "monitoring": {
          "label": "Monitoring Tree",
          "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
        },
        "security": {
          "label": "Security Data Tree",
          "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
        },
        "modeling": {
          "label": "WDT Model Tree",
          "description": "<p>Maintain model files associated with the WebLogic Deploy Tooling tool.</p>"
        },
        "composite": {
          "label": "WDT Composite Model Tree",
          "description": "<p>View a combined set of WebLogic Deploy Tooling model files that you are currently working with.</p>"
        },
        "properties": {
          "label": "Property List Editor",
          "description": "<p>View or modify a set of properties from a property list file.</p>"
        }
      }
    },
    "wrc-shoppingcart": {
      "icons": {
        "discard": {
          "tooltip": "Discard Changes"
        },
        "commit": {
          "tooltip": "Commit Changes"
        }
      },
      "sections": {
        "changeManager": {
          "label": "Change Manager"
        },
        "additions": {
          "label": "Additions"
        },
        "modifications": {
          "label": "Modifications"
        },
        "removals": {
          "label": "Removals"
        },
        "restart": {
          "label": "Restart"
        }
      }
    },
    "wrc-table-toolbar": {
      "buttons": {
        "new": {
          "label": "New"
        },
        "clone": {
          "label": "Clone"
        },
        "delete": {
          "label": "Delete"
        },
        "customize": {
          "label": "Customize Table"
        }
      },
      "icons": {
        "landing": {
          "tooltip": "Landing Page"
        },
        "history": {
          "tooltip": "Toggle visibility of history"
        },
        "instructions": {
          "tooltip": "Toggle visibility of instructions"
        },
        "help": {
          "tooltip": "Toggle visibility of Help page"
        },
        "sync": {
          "tooltip": "Reload",
          "tooltipOn": "Stop Auto-Reload"
        },
        "syncInterval": {
          "tooltip": "Set Auto-Reload Interval"
        },
        "shoppingcart": {
          "tooltip": "Click to view actions for cart"
        }
      },
      "menu": {
        "shoppingcart": {
          "view": {
            "label": "View Changes"
          },
          "discard": {
            "label": "Discard Changes"
          },
          "commit": {
            "label": "Commit Changes"
          }
        }
      },
      "instructions": {
        "selectItems": {
          "value": "Select items you want to perform '{0}' operation on."
        }
      },
      "messages": {
        "action": {
          "cannotPerform": {
            "summary": "Message",
            "detail": "Cannot perform '{0}' action while auto-reload is running! Please click the '{1}' icon to stop it, first."
          }
        }
      },
      "labels": {
        "start": {
          "value": "Start"
        },
        "resume": {
          "value": "Resume"
        },
        "suspend": {
          "value": "Suspend"
        },
        "shutdown": {
          "value": "Shutdown"
        },
        "restartSSL": {
          "value": "Restart SSL"
        },
        "stop": {
          "value": "Stop"
        }
      }
    },
    "wrc-table": {
      "checkboxes": {
        "showHiddenColumns": {
          "label": "Show Hidden Columns"
        }
      },
      "labels": {
        "totalRows": {
          "value": "Total Rows: {0}"
        },
        "reloadHidden": {
          "value": "Reload the table to view the current {0} values"
        }
      }
    },
    "wrc-table-customizer": {
      "labels": {
        "available": {
          "value": "Available Columns"
        },
        "selected": {
          "value": "Selected Columns"
        }
      },
      "messages": {
        "action": {
          "needAtLeastOneColumn": {
            "title": "Insufficient Columns",
            "detail": "At least one selected column is required."
          }
        }
      }
    },
    "wrc-form-toolbar": {
      "buttons": {
        "save": {
          "label": "Save"
        },
        "new": {
          "label": "Create"
        },
        "delete": {
          "label": "Remove"
        },
        "back": {
          "label": "Back"
        },
        "next": {
          "label": "Next"
        },
        "finish": {
          "label": "Create"
        },
        "customize": {
          "label": "Customize Table"
        }
      },
      "icons": {
        "save": {
          "tooltip": "Save"
        },
        "create": {
          "tooltip": "Create"
        },
        "landing": {
          "tooltip": "Landing Page"
        },
        "history": {
          "tooltip": "Toggle visibility of history"
        },
        "instructions": {
          "tooltip": "Toggle visibility of instructions"
        },
        "help": {
          "tooltip": "Toggle visibility of Help page"
        },
        "sync": {
          "tooltip": "Reload",
          "tooltipOn": "Stop Auto-Reload"
        },
        "syncInterval": {
          "tooltip": "Set Auto-Reload Interval"
        },
        "shoppingcart": {
          "tooltip": "Click to view actions for cart"
        }
      },
      "menu": {
        "shoppingcart": {
          "view": {
            "label": "View Changes"
          },
          "discard": {
            "label": "Discard Changes"
          },
          "commit": {
            "label": "Commit Changes"
          }
        }
      }
    },
    "wrc-form": {
      "checkboxes": {
        "showAdvancedFields": {
          "label": "Show Advanced Fields"
        }
      },
      "introduction": {
        "toggleHelp": {
          "text": "Click the {0} icon to toggle between summary and detailed help."
        }
      },
      "messages": {
        "savedTo": {
          "shoppingcart": "Changes were added to cart!",
          "customView": "Changes were saved!"
        },
        "action": {
          "notAllowed": {
            "summary": "Action Not Allowed",
            "detail": "Cannot perform requested action during a create operation. Click Cancel button to cancel create operation."
          }
        }
      },
      "icons": {
        "restart": {
          "tooltip": "Server or App Restart Required"
        },
        "wdtIcon": {
          "tooltip": "WDT Settings"
        }
      }
    },
    "wrc-help-form": {
      "tables": {
        "help": {
          "label": "Help Table",
          "columns": {
            "header": {
              "name": "Name",
              "description": "Description"
            }
          }
        }
      }
    },
    "wrc-create-form": {
      "pageState": {
        "error": {
          "summary": "Incomplete Required Fields",
          "detail": "{0} field is required, but no (or an invalid) value has been provided."
        }
      }
    },
    "wrc-common": {
      "buttons": {
        "apply": {
          "label": "Apply"
        },
        "reset": {
          "label": "Reset"
        },
        "ok": {
          "label": "OK"
        },
        "cancel": {
          "label": "Cancel"
        },
        "yes": {
          "label": "Yes"
        },
        "no": {
          "label": "No"
        },
        "choose": {
          "label": "Choose"
        },
        "connect": {
          "label": "Connect"
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
          "label": "Download File"
        },
        "savenow": {
          "label": "Save Now"
        }
      },
      "tooltips": {
        "collapse": {
          "value": "Collapse"
        },
        "expand": {
          "value": "Expand"
        },
        "choose": {
          "value": "Choose File"
        },
        "clear": {
          "value": "Clear Chosen File"
        },
        "more": {
          "value": "More Actions"
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
          "value": "Download File"
        },
        "pick": {
          "value": "Pick Directory"
        },
        "reload": {
          "value": "Reload File"
        }
      },
      "menu": {
        "chooseFile": {
          "value": "Choose File..."
        },
        "chooseDir": {
          "value": "Choose Directory..."
        }
      },
      "labels": {
        "info": {
          "value": "Information"
        },
        "warn": {
          "value": "Warning"
        },
        "error": {
          "value": "Error"
        }
      },
      "placeholders": {
        "search": {
          "value": "Search"
        }
      },
      "title": {
        "incorrectFileContent": {
          "value": "Incorrect File Content"
        }
      },
      "messages": {
        "incorrectFileContent": {
          "detail": "'{0}' contains JSON, but it is not a JSON representation of a {1}!"
        }
      }
    },
    "wrc-wdt-form": {
      "messages": {
        "changesSaved": {
          "summary": "Changes were successfully saved to '{0}' file!"
        },
        "changesNotSaved": {
          "summary": "Unable to save changes to '{0}' file!"
        },
        "changesDownloaded": {
          "summary": "Changes were successfully downloaded to '{0}' file!"
        },
        "changesNotDownloaded": {
          "summary": "Unable to download changes to '{0}' file!"
        },
        "verifyPathEntered": {
          "detail": ". Setting the {0} field to false will accept the entered value, without validating it's existence as a local file or directory."
        }
      },
      "wdtOptionsDialog": {
        "title": "Edit: {0}",
        "default": "Default. (Unset)",
        "instructions": "Enter token to add to the list of selectable items.",
        "enterValue": "Enter Value",
        "selectValue": "Select Value",
        "selectSwitch": "Toggle Value",
        "enterUnresolvedReference": "Enter Unresolved Reference",
        "enterModelToken": "Enter Model Token",
        "selectPropsVariable": "Select Model Token Variable",
        "createPropsVariable": "Create Model Token Variable",
        "propName": "Variable Name (Required)",
        "propValue": "Variable Value",
        "enterVariable": "Enter Variable",
        "variableName": "Variable Name (Required)",
        "variableValue": "Variable Value",
        "multiSelectUnset": "\"Default. (Select from Available Items List)\""
      }
    },
    "wrc-unsaved-changes": {
      "titles": {
        "unsavedChanges": {
          "value": "Unsaved Changes Detected"
        },
        "changesNeedDownloading": {
          "value": "Changes Not Downloaded"
        }
      },
      "prompts": {
        "unsavedChanges": {
          "willBeLost": {
            "value": "All unsaved changes will be lost. Continue?"
          },
          "areYouSure": {
            "value": "Are you sure you want to {0} without saving your changes?"
          },
          "saveBeforeExiting": {
            "value": "Do you want to save changes before exiting?"
          },
          "needDownloading": {
            "value": "Your changes to '{0}' have not been download to the file.<br/><br/>Download them before continuing?"
          }
        },
        "uncommitedCreate": {
          "abandonForm": {
            "value": "Your new '{0}' instance has not been added to the WDT model.<br/><br/>Add it before continuing?"
          }
        }
      }
    },
    "wrc-sync-interval": {
      "dialogSync": {
        "title": "Set Auto-Reload Interval",
        "instructions": "How many seconds do you want for the auto-reloading interval?",
        "fields": {
          "interval": {
            "label": "Auto-Reload Interval:"
          }
        }
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
      "labels": {
        "cannotDetermineExactCause": {
          "value": "Cannot determine exact cause. Check JavaScript Console for hints."
        }
      }
    },
    "wrc-pdj-fields": {
      "cfe-multi-select": {
        "labels": {
          "available": "Available",
          "chosen": "Chosen"
        }
      },
      "cfe-properties-editor": {
        "labels": {
          "name": "Property Name",
          "value": "Property Value"
        }
      },
      "cfe-property-list-editor": {
        "labels": {
          "nameHeader": "Properties Name",
          "valueHeader": "Properties Value",
          "addButtonTooltip": "Add",
          "deleteButtonTooltip": "Delete"
        }
      }
    },
    "wrc-pdj-options-sources": {
      "menus": {
        "more": {
          "optionsSources": {
            "view": {
              "label": "View {0}..."
            },
            "create": {
              "label": "Create New {0}..."
            },
            "edit": {
              "label": "Edit {0}..."
            }
          }
        }
      }
    },
    "wrc-pdj-unset": {
      "menu": {
        "label": "Restore to default"
      },
      "placeholder": {
        "value": "default"
      }
    },
    "wrc-pdj-crosslinks": {
      "messages": {
        "noNotFoundMessage": {
          "detail": "'{0}' is not available."
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
          "value": "Server States"
        },
        "systemStatus": {
          "value": "System Status"
        },
        "healthState": {
          "failed": {
            "value": "Failed"
          },
          "critical": {
            "value": "Critical"
          },
          "overloaded": {
            "value": "Overloaded"
          },
          "warning": {
            "value": "Warning"
          },
          "ok": {
            "value": "OK"
          }
        }
      },
      "descriptions": {
        "healthState": {
          "value": "Health of Running Servers as of"
        }
      },
      "headers": {
        "serverStates": {
          "name": {
            "value": "Name"
          },
          "state": {
            "value": "State"
          }
        }
      }
    },
    "wrc-data-operations": {
      "messages": {
        "backendNotReachable": {
          "detail": "Backend not currently reachable."
        },
        "connectionMessage": {
          "summary": "Connection Message"
        },
        "connectFailed": {
          "detail": "Attempt Failed: "
        },
        "badRequest": {
          "detail": "Unable to process the submitted file or request "
        },
        "invalidCredentials": {
          "detail": "WebLogic Domain credentials are not valid "
        },
        "invalidUrl": {
          "detail": "WebLogic Domain URL is not reachable "
        },
        "notInRole": {
          "detail": "Attempt Failed: The user is not an Admin, Deployer, Operator or Monitor"
        },
        "notSupported": {
          "detail": "WebLogic Domain is not supported "
        },
        "unexpectedStatus": {
          "detail": "Unexpected result (status: {0}) "
        },
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
        "seeJavascriptConsole": {
          "detail": "See remote console terminal or Javascript console for specific reason(s)."
        },
        "responseMessages": {
          "summary": "Response Messages"
        }
      }
    },
    "wrc-change-manager": {
      "messages": {
        "cannotGetLockState": {
          "summary": "Unable to access change manager!"
        },
        "changesCommitted": {
          "summary": "Changes were successfully committed!"
        },
        "changesNotCommitted": {
          "summary": "Unable to commit changes!"
        },
        "changesDiscarded": {
          "summary": "Changes were successfully discarded!"
        },
        "changesNotDiscarded": {
          "summary": "Unable to discard changes!"
        }
      }
    },
    "wrc-view-model-utils": {
      "labels": {
        "unexpectedErrorResponse": {
          "value": "Unexpected Error Response"
        }
      },
      "messages": {
        "connectionRefused": {
          "summary": "Connection Issue",
          "details": "Having trouble sending and receiving data from provider! Please ensure it is accessible and try again."
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
            "value": "Copyright (c) 2021, 2022, Oracle and/or its affiliates."
          }
        }
      },
      "menus": {
        "app": {
          "about": {
            "value": "About {0}"
          },
          "services": {
            "value": "Services"
          },
          "hide": {
            "value": "Hide {0}"
          },
          "quit": {
            "value": "Quit {0}"
          }
        },
        "file": {
          "newProject": {
            "value": "New Project"
          },
          "switchToProject": {
            "value": "Switch to Project"
          },
          "deleteProject": {
            "value": "Delete Project"
          },
          "nameProject": {
            "value": "Name Project..."
          },
          "renameProject": {
            "value": "Rename \"{0}\"..."
          }
        },
        "help": {
          "checkForUpdates": {
            "value": "Check for \"{0}\" Updates..."
          },
          "visit": {
            "value": "Visit {0} Github Project"
          }
        }
      },
      "prompt": {
        "file": {
          "newProject": {
            "title": {
              "value": "New Project"
            },
            "label": {
              "value": "Name"
            }
          },
          "nameProject": {
            "title": {
              "value": "Name Project"
            },
            "label": {
              "value": "Name"
            }
          },
          "renameProject": {
            "title": {
              "value": "Rename \"{0}\""
            },
            "label": {
              "value": "New name"
            }
          }
        }
      },
      "dialog": {
        "help": {
          "checkForUpdates": {
            "alreadyOnCurrent": {
              "title": {
                "value": "You Are Up To Date"
              },
              "message": {
                "value": "Current version is {0}"
              }
            },
            "newVersionAvailable": {
              "title": {
                "value": "Newer Version Available!"
              },
              "message": {
                "value": "Go to https://github.com/oracle/weblogic-remote-console/releases to get version {0}"
              }
            },
            "connectionIssue": {
              "title": {
                "value": "Connection Issue"
              },
              "message": {
                "value": "Could not reach update site"
              }
            }
          }
        }
      }
    }
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