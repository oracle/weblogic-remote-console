define({
  "root": {
    "wrc-header": {
      "text": {
        "appName": "WebLogic Remote Console"
      },
      "region": {
        "ariaLabel": {
          "value": "Application Header"
        }
      },
      "buttons": {
        "logout": {
          "label": "Logout"
        }
      },
      "icons": {
        "navtree": {
          "toggler": {
            "tooltip": "Toggle Navigation Tree visibility"
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
          "tooltip": "Open WebLogic Remote Console Internal Documentation"
        },
        "profile": {
          "tooltip": "Profile"
        }
      },
      "menus": {
        "messageCenter": {
          "value": "Open Message Center"
        },
        "theme": {
          "light": {
            "value": "Light"
          },
          "dark": {
            "value": "Dark"
          }
        }
      },
      "tooltips": {
        "appName": {
          "value": "Click to reset WebLogic Remote Console"
        }
      }
    },
    "wrc-footer": {
      "text": {
        "copyrightLegal": "Copyright (c) 2020, 2025, Oracle and/or its affiliates.<br/>Oracle (r), Java, MySQL, and NetSuite are registered trademarks of Oracle and/or its affiliates. Other names may be trademarks of their respective owners.<br/>",
        "builtWith": "Built with Oracle JET"
      }
    },
    "wrc-connectivity": {
      "labels": {
        "insecure": {
          "value": "Not secure"
        }
      },
      "icons": {
        "insecure": {
          "tooltip": "Admin Server Connection Not Secure"
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
              "tooltip": "Manage Profiles"
            },
            "editor": {
              "tooltip": "Profile Editor",
              "toolbar": {
                "save": {
                  "tooltip": "Save Profile"
                },
                "activate": {
                  "tooltip": "Active Profile"
                },
                "add": {
                  "tooltip": "Add Profile"
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
            "value": "General"
          },
          "settings": {
            "value": "Settings"
          },
          "preferences": {
            "value": "Preferences"
          },
          "properties": {
            "value": "Properties"
          }
        }
      },
      "dialog": {
        "changeImage": {
          "value": "Change Image"
        },
        "clearImage": {
          "value": "Clear Image"
        },
        "profile": {
          "default": {
            "value": "Default Profile"
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
              "value": "Name"
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
                "value": "Store encrypted credentials for your projects?"
              },
              "disableHNV": {
                "value": "Disable host name verification?"
              },
              "proxyAddress": {
                "value": "Proxy Address"
              },
              "trustStoreType": {
                "value": "Trust Store Type"
              },
              "trustStorePath": {
                "value": "Trust Store Path"
              },
              "trustStoreKey": {
                "value": "Trust Store Key"
              },
              "connectionTimeout": {
                "value": "Administration Server Connection Timeout"
              },
              "readTimeout": {
                "value": "Administration Server Read Timeout"
              }
            },
            "preferences": {
              "theme": {
                "value": "Theme"
              },
              "startupTaskChooserType": {
                "value": "Startup Task Chooser Type"
              },
              "useTreeMenusAsRootNodes": {
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
        "hoverMenu": {
          "ariaLabel": {
            "value": "Provider Actions "
          }
        },
        "info": {
          "tooltip": "Get info on this provider"
        },
        "edit": {
          "tooltip": "Manage settings for this provider"
        },
        "deactivate": {
          "tooltip": "Deactivate this provider"
        },
        "delete": {
          "tooltip": "Remove this provider"
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
          "proxyOverride": {
            "value": "Proxy Override"
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
          "project": {
            "name": {
              "label": "Project Name:"
            }
          },
          "provider": {
            "id": {
              "label": "Provider Id:"
            }
          },
          "domain": {
            "consoleExtensionVersion": {
              "label": "Console Extension Version:"
            },
            "name": {
              "label": "Domain Name:"
            },
            "url": {
              "label": "Domain URL:"
            },
            "proxyOverride": {
              "label": "Proxy Override:"
            },
            "version": {
              "label": "Domain Version:"
            },
            "username": {
              "label": "Username:"
            },
            "sso": {
              "label": "Web Authentication:"
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
            "insecure": {
              "label": "Insecure:"
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
          },
          "deactivate": {
            "value": "Deactivate connection provider and cease domain status polling."
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
        },
        "project-busy": {
          "value": "Please save or abandon unsaved changes before making changes to any part of the project"
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
        },
        "project-busy": {
          "value": "Project Busy"
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
        "sso": {
          "secureContextRequired": {
            "detail": "The URL must specify the HTTPS protocol or use localhost"
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
          "fileNotSet": {
            "value": "Not set"
          }
        }
      },
      "checkboxes": {
        "useSparseTemplate": {
          "label": "Use Sparse Template"
        },
        "usesso": {
          "label": "Use Web Authentication"
        },
        "insecure": {
          "label": "Make Insecure Connection"
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
    "wrc-navigation": {
      "ariaLabel": {
        "navstrip": {
          "value": "Provider Trees Menu"
        },
        "navtree": {
          "value": "Provider Tree Navigator"
        },
        "panelResizer": {
          "value": "Provider Tree Navigator Resizer. Use left and right arrow keys to resize navigator"
        }
      }
    },
    "wrc-content-area-header": {
      "ariaLabel": {
        "button": {
          "home": {
            "value": "Home. Return to the page containing cards for the provider's trees"
          }
        },
        "region": {
          "title": {
            "value": "Content Area Header"
          }
        },
        "popup": {
          "provider": {
            "value": "Provider Actions"
          }
        }
      },
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
          }
        }
      },
      "icons": {
        "shoppingcart": {
          "tooltip": "Click to view shopping cart actions"
        }
      },
      "menu": {
        "shoppingcart": {
          "view": {
            "label": "View Changes..."
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
            "label": "Providers"
          },
          "tips": {
            "label": "User Tips"
          },
          "dashboards": {
            "label": "Dashboards"
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
            "value": "Security"
          },
          "other": {
            "value": "Other"
          }
        },
        "cards": {
          "tip0": {
            "title": "Search across all MBeans in your domain!",
            "descriptionHTML": "<p>Enter a search term in the search field at the top of the console to comb through the current perspective for matches. You can also revisit previous queries in the <b>Recent Searches</b> node.</p>"
          },
          "tip1": {
            "title": "Quickly filter and find data that's important to you!",
            "descriptionHTML": "<p>Dashboards let you define custom criteria, match it against your domain, and generate comprehensive and precise reports based on your domain.</p><p>To get started, open any node in the <b>Monitoring Tree</b>, and click <b>New Dashboard</b>. Or open the <b>Dashboards</b> top-level node to see the built-in dashboards.</p>"
          },
          "tip2": {
            "title": "Refine table contents",
            "descriptionHTML": "<p>Simplify tables by hiding irrelevant columns so you can focus on the data that matters to you.</p><p>Above any table, click <b>Customize Table</b> and select or deselect columns as desired.</p>"
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
            "title": "Review pending changes",
            "descriptionHTML": "<p>Open the Shopping Cart to see a list of the changes that are saved to the domain but not yet committed.</p><p>If you can't see <b>View Changes</b> in the Shopping Cart, try <a href='#' tabindex='0' on-click data-url='@@docsURL@@/set-console/#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591'>installing the WebLogic Remote Console extension</a>."
          },
          "tip6": {
            "title": "Need help?",
            "descriptionHTML": "<ul><li>Hover over the <b>?</b> beside a field for tooltips.</li><li>Click the page-level <b>?</b> for detailed help on every visible attribute.</li><li>On the <b>Help</b> menu, click <b>Visit WebLogic Remote Console GitHub Project</b>.</li><li>Join our Slack channel: <a href='#' tabindex='0' on-click data-url='https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ'>#remote-console</a>.</li><li>Visit our documentation at <a href='#' tabindex='0' on-click data-url='@@docsURL@@/'></a>.</li></ul>"
          },
          "tip7": {
            "title": "Other Tip #1",
            "descriptionHTML": "<p>A terse description for \"Other Tip #1\". A newline character is not an HTML element, so you don't want to use them in this description.</p>"
          },
          "tip8": {
            "title": "Trouble connecting to a server?",
            "descriptionHTML": "<p>Under <b>Monitoring Tree</b> > <b>Environment</b> > <b>Servers</b>, select the unresponsive server and open its <b>Troubleshooting</b> tab to try and diagnose the issue.</p><p>If you can't connect to the domain at all, refer to <a href='#' tabindex='0' on-click data-url='@@docsURL@@/troubleshoot-weblogic-remote-console/#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE'>Cannot connect to the Administration Server</a> in the WebLogic Remote Console documentation for troubleshooting help.</p>"
          },
          "tip9": {
            "title": "Connectivity Tip #2",
            "descriptionHTML": "<p>A terse description for \"Connectivity Tip #2\". A newline character is not an HTML element, so you don't want to use them in this description.</p>"
          },
          "tip10": {
            "title": "Security Tip #1",
            "descriptionHTML": "<p>A terse description for \"Security Tip #1\". A newline character is not an HTML element, so you don't want to use them in this description.</p>"
          },
          "tip11": {
            "title": "Accelerate your workflow!",
            "descriptionHTML": "<p>Use keyboard shortcuts to jump directly to specific UI components.</p><p>Top 5:</p><li><code><b>Alt+P</b></code> - Opens the <b>Providers</b> drawer.</li><li><code><b>Alt+C</b></code> - Moves the focus to the <b>Shopping Cart</b>.</li><li><code><b>Alt+T</b></code> - Moves the focus to the first column header in a table.</li><li><code><b>Alt+|</b></code> - Moves the focus to the Navigation Tree width-resizer. Use arrow keys to change the width of the tree.</li><li><code><b>Alt+;</b></code> - Moves the focus to the first clickable breadcrumb label.</li></ul><p>For a full list of keyboard shortcuts, refer to the documentation.</p>"
          }
        }
      }
    },
    "wrc-perspective": {
      "ariaLabel": {
        "region": {
          "breadcrumbs": {
            "value": "Breadcrumbs"
          }
        }
      },
      "icons": {
        "history": {
          "tooltip": "History"
        },
        "separator": {
          "tooltip": "Separator"
        }
      },
      "menus": {
        "history": {
          "clear": {
            "value": "Clear History Entries",
            "label": "Clear History Entries"
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
          "detail": "Connection lost. Please refresh."
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
            "label": "Trees"
          },
          "startup-tasks": {
            "label": "Startup Tasks"
          }
        }
      }
    },
    "wrc-landing": {
      "ariaLabel": {
        "cards": {
          "panel": {
            "value": "Landing Page"
          }
        },
        "cardLinks": {
          "panel": {
            "value": "Landing Page Links"
          }
        },
        "screenreader": {
          "value1": "You're on the {0} item. Press Enter to select.",
          "value2": "You're on the {0} item. Pressing Enter will expand or collapse it. After expanding, use the down arrow to access related links.",
          "value3": "{0}. Press Tab/Shift+Tab to move between related links and Escape to return to last visited top level item."
        }
      }
    },
    "wrc-gallery": {
      "ariaLabel": {
        "cards": {
          "panel": {
            "value": "Provider Trees"
          }
        }
      },
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
    "wrc-startup-tasks": {
      "ariaLabel": {
        "cards": {
          "panel": {
            "value": "Startup Tasks"
          }
        }
      },
      "cards": {
        "addAdminServer": {
          "label": "Add Admin Server Connection Provider",
          "description": "This task creates a project resource that allows you to connect to an Admin Server"
        },
        "addWdtModel": {
          "label": "Add WDT Model File Provider",
          "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
        },
        "addWdtComposite": {
          "label": "Add WDT Composite Model File Provider",
          "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
        },
        "addPropertyList": {
          "label": "Add Property List Provider",
          "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
        },
        "createWdtModel": {
          "label": "Create Provider for New WDT Model File",
          "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
        },
        "createPropertyList": {
          "label": "Create Provider for New Property List",
          "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
        },
        "importProject": {
          "label": "Import Project",
          "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
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
      "prompts": {
        "download": {
          "value": "Downloaded log file locations:"
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
        },
        "noData": {
          "value": "No data found."
        }
      }
    },
    "wrc-table-customizer": {
      "ariaLabel": {
        "availableColumns": {
          "title": {
            "value": "Available Columns"
          },
          "list": {
            "value": "Available Columns List"
          },
          "listItem": {
            "value": "Available Columns List Item"
          }
        },
        "selectedColumns": {
          "title": {
            "value": "Selected Columns"
          },
          "list": {
            "value": "Selected Columns List"
          },
          "listItem": {
            "value": "Selected Columns List Item"
          }
        },
        "button": {
          "addToRight": {
            "value": "Move checked items in Available Columns list to Selected Columns list"
          },
          "addAllRight": {
            "value": "Move all items in Available Columns list to Selected Columns list"
          },
          "removeRight": {
            "value": "Move checked items in Selected Columns list to Available Columns list"
          },
          "removeAll": {
            "value": "Move all items in Selected Columns list to Available Columns list"
          },
          "reset": {
            "value": "Restore columns in Selected Columns list to those present when table customizer was toggled open."
          },
          "apply": {
            "value": "Apply column customizatios to table"
          },
          "cancel": {
            "value": "Cancel all column customizations"
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
        },
        "dashboard": {
          "label": "New Dashboard"
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
          "generic": "Changes were saved!",
          "notSaved": "Nothing saved because no changes were detected."
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
      },
      "labels": {
        "relatedTopics": {
          "value": "<b>Related Topics:</b>"
        }
      },
      "tabs": {
        "attributes": {
          "label": "Attributes"
        },
        "actions": {
          "label": "Actions"
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
    "wrc-policy-management": {
      "menus": {
        "action": {
          "addCondition": {
            "label": "Add Condition"
          },
          "combine": {
            "label": "Combine"
          },
          "uncombine": {
            "label": "Uncombine"
          },
          "moveup": {
            "label": "Move Up"
          },
          "movedown": {
            "label": "Move Down"
          },
          "remove": {
            "label": "Remove"
          },
          "negate": {
            "label": "Negate"
          },
          "reset": {
            "label": "Reset"
          }
        }
      },
      "contextMenus": {
        "action": {
          "addCondition": {
            "at": {
              "label": "Add New First Condition..."
            },
            "above": {
              "label": "Add Condition Above Row Clicked..."
            },
            "below": {
              "label": "Add Condition Below Row Clicked..."
            }
          }
        }
      },
      "buttonMenus": {
        "action": {
          "addCondition": {
            "above": {
              "label": "Add Above Checked Condition..."
            },
            "below": {
              "label": "Add Below Checked Condition..."
            }
          }
        }
      },
      "messages": {
        "requiredFieldsMissing": {
          "detail": "One or more of the required fields contain no data!"
        },
        "argumentValueHasWrongFormat": {
          "summary": "The '{0}' field contains incorrectly formatted data!"
        },
        "conditionHasNoArgValues": {
          "summary": "The selected condition has no argument values to edit!"
        },
        "conditionAlreadyExists": {
          "summary": "This security policy already has a condition built using the selected predicate, or one with matching argument values!"
        }
      },
      "instructions": {
        "policyEditor": {
          "value": "<p>To specify the location of the new condition, put a check next to the relative condition then click the <b>+Add Condition</b> button.</p>"
        }
      }
    },
    "wrc-policy-editor": {
      "labels": {
        "monthDay": {
          "value": "Range: -31 to 31"
        },
        "dateTime": {
          "value": "Format: yyyy-MM-dd [HH:mm:ss [AM|PM]] (e.g. 2022-02-14 09:00:00 AM)"
        },
        "time": {
          "value": "Format: HH:mm:ss (e.g. 14:22:47)"
        },
        "gmtOffset": {
          "value": "Format: GMT+|-h:mm (e.g. GMT-5:00)"
        },
        "weekDay": {
          "value": "e.g. Sunday, Monday, Tuesday, ..."
        },
        "or": {
          "value": "or"
        },
        "not": {
          "value": "NOT"
        },
        "combination": {
          "value": "Combination"
        },
        "nodata": {
          "Policy": {
            "value": "Use <b>+ Add Condition</b> button to add a policy condition."
          },
          "DefaultPolicy": {
            "value": "No default security policy conditions defined."
          }
        }
      },
      "tables": {
        "policyConditions": {
          "columns": {
            "header": {
              "combination": "Combination",
              "operator": "Operator",
              "expression": "Condition Phrase"
            }
          },
          "dropdowns": {
            "operator": {
              "or": "Or",
              "and": "And"
            }
          }
        }
      },
      "wizard": {
        "title": "Policy Management",
        "pages": {
          "choosePredicate": {
            "header": {
              "title": "Choose a Predicate",
              "instructions": "Choose the predicate for your new condition from the dropdown list."
            },
            "body": {
              "labels": {
                "predicateList": "Predicate List"
              },
              "help": {
                "predicateList": "The predicate list is a list of available predicates which can be used to make up a security policy condition."
              }
            }
          },
          "manageArgumentValues": {
            "header": {
              "title": "Group Predicate",
              "instructions": "Begin typing into the <i></i> field to add argument values or search for existing ones. Press Enter to add typed-in value to the list. To edit existing argument value, click it and modify using the popup input field."
            },
            "body": {
              "labels": {
                "conditionPhrase": "Condition Phrase",
                "negate": "Negate Condition"
              },
              "help": {
                "negate": "Converts condition to have the opposite meaning (e.g. \"equals\" becomes \"not equals\", \"in\" becomes \"not in\")."
              }
            }
          }
        }
      }
    },
    "wrc-recently-visited": {
      "labels": {
        "tree": {
          "value": "Tree"
        },
        "page": {
          "value": "Page"
        },
        "tab": {
          "value": "Tab"
        },
        "ariaLabel": {
          "value": "Pages History"
        }
      },
      "messages": {
        "pageNoLongerExists": {
          "summary": "Page No Longer Exists",
          "detail1": "You have been redirected to the {0} page because ",
          "detail2": "{0} was deleted by another user, or no longer exists. "
        }
      }
    },
    "wrc-pages-bookmark": {
      "labels": {
        "ariaLabel": {
          "value": "Page Bookmarks"
        }
      },
      "menus": {
        "bookmark": {
          "add": {
            "label": "Add Bookmark for Current Page"
          },
          "show": {
            "label": "Show Page Bookmarks..."
          }
        }
      },
      "messages": {
        "pageAlreadyBookmarked": {
          "summary": "There is already a bookmark for this page! "
        },
        "pagesBookmarkAdded": {
          "summary": "Current page was successfully bookmarked! "
        }
      }
    },
    "wrc-common": {
      "ariaLabel": {
        "icons": {
          "landing": {
            "value": "Return to provider tree's Landing Page."
          },
          "reset": {
            "value": "Refresh page values"
          }
        }
      },
      "buttons": {
        "action": {
          "label": "Action"
        },
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
        "restart": {
          "label": "Restart"
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
        },
        "next": {
          "label": "Next"
        },
        "previous": {
          "label": "Previous"
        },
        "finish": {
          "label": "Finish"
        },
        "done": {
          "label": "Done"
        },
        "close": {
          "label": "Close"
        },
        "clear": {
          "label": "Clear"
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
        "filter": {
          "value": "Filter"
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
        },
        "delete": {
          "value": "Delete"
        },
        "remove": {
          "value": "Remove"
        },
        "noData": {
          "value": "No Data"
        },
        "preloader": {
          "value": "Preloader"
        },
        "checkAll": {
          "value": "Check All"
        },
        "checkNone": {
          "value": "Uncheck All"
        },
        "checkSome": {
          "value": "Clear Checked"
        },
        "close": {
          "value": "Close"
        },
        "recentPages": {
          "value": "Toggle visibility of history"
        },
        "pagesHistory": {
          "back": {
            "value": "Previous Page"
          },
          "next": {
            "value": "Next Page"
          },
          "launch": {
            "value": "Show Pages History"
          },
          "star": {
            "value": "Page Bookmarks"
          }
        },
        "pageInfo": {
          "value": "Click to pin and unpin"
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
        },
        "alerts": {
          "value": "Alerts"
        },
        "pagesHistory": {
          "value": "Here are the pages visited since selecting the current provider. Click on any column in row to navigate to associated page."
        },
        "pagesBookmark": {
          "value": "Here are the pages bookmarked for the {0} provider type. Click on any column in row to navigate to associated page."
        }
      },
      "placeholders": {
        "search": {
          "value": "Search"
        }
      },
      "title": {
        "incorrectFileContent": {
          "value": "Incorrect Content Detected"
        }
      },
      "messages": {
        "incorrectFileContent": {
          "detail": "'{0}' contains JSON, but it is not a JSON representation of a {1}!"
        },
        "dataCopiedToClipboard": {
          "detail": "Data was copied to clipboard!"
        },
        "tableCopiedToClipboard": {
          "summary": "Table was successfully copied to the clipboard!"
        },
        "emptyCellData": {
          "detail": "Data not copied to clipboard because selected cell was empty!"
        },
        "emptyRowData": {
          "detail": "Data not copied to clipboard because selected row was empty!"
        },
        "browserPermissionDenied": {
          "summary": "Browser Permission Denied",
          "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
        }
      },
      "contextMenus": {
        "copyData": {
          "cell": {
            "label": "Copy Cell to Clipboard"
          },
          "row": {
            "label": "Copy Row to Clipboard"
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
    "wrc-navtree-toolbar": {
      "menu": {
        "collapseAll": {
          "value": "Collapse All"
        },
        "useTreeMenusAsRootNodes": {
          "value": "Use Tree Menus as Root Nodes"
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
        "default": "Unset Value",
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
        "multiSelectUnset": "Select Value from Available Items List"
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
            "detail": "Console backend call generated a '{0}' response when attempting to perform '{1}' action"
          },
          "actionNotPerformed": {
            "detail": "Unable to perform '{0}' action on one or more of the checked items"
          },
          "actionNotPerformedNoRow": {
            "detail": "Unable to perform '{0}' action"
          },
          "actionSucceeded": {
            "summary": "The '{0}' action was successfully performed!"
          }
        }
      },
      "labels": {
        "cannotDetermineExactCause": {
          "value": "Cannot determine exact cause. Check JavaScript Console for hints."
        }
      }
    },
    "wrc-actions-strip": {
      "dialogs": {
        "cannotBeUndone": {
          "title": "Action Confirmation",
          "prompt": "The '{0}' action cannot be undone!<br/><br/>Continue?"
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
          "detail": "Unable to process the submitted file or request"
        },
        "invalidCredentials": {
          "detail": "WebLogic Domain credentials are not valid"
        },
        "invalidUrl": {
          "detail": "WebLogic Domain URL is not reachable"
        },
        "notInRole": {
          "detail": "Attempt Failed: The user is not an Admin, Deployer, Operator or Monitor"
        },
        "notSupported": {
          "detail": "WebLogic Domain is not supported"
        },
        "unexpectedStatus": {
          "detail": "Unexpected result (status: {0})"
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
    "wrc-confirm-dialogs": {
      "adminServerShutdown": {
        "title": {
          "value": "Confirmation"
        },
        "prompt": {
          "value": "Shutting down the <b>{0}</b> will reset the current provider. Continue?"
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
          "details": "Having trouble sending and receiving data from provider! Please ensure it is accessible, before continuing."
        },
        "pathNotFound": {
          "summary": "Path Not Found",
          "details": "'{0}' is not a file or directory accessible on the local filesystem."
        }
      }
    },
    "wrc-message-line": {
      "ariaLabel": {
        "region": {
          "value": "Message Line"
        }
      },
      "menus": {
        "more": {
          "clear": {
            "label": "Clear Message"
          },
          "suppress": {
            "info": {
              "label": "Suppress Info Messages"
            },
            "warning": {
              "label": "Suppress Warning Messages"
            }
          }
        }
      },
      "messages": {
        "adminServerShutdown": {
          "details": " Unable to connect to the WebLogic domain's administration server."
        },
        "shutdownSequenceError": {
          "details": "Shut down the managed servers then shut down the administration server."
        }
      }
    },
    "wrc-alerts": {
      "menus": {
        "alerts": {
          "error": {
            "value": "You have {0} high-priority error alert(s)"
          },
          "warning": {
            "value": "You have {0} high-priority warning alert(s)"
          },
          "info": {
            "value": "You have {0} high-priority information alert(s)"
          },
          "view": {
            "value": "View Alerts"
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
  "ja": true,
  "ko": true,
  "pt-BR": true,
  "zh-CN": true,
  "zh-TW": true
});