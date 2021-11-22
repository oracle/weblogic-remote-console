define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic\\u30EA\\u30E2\\u30FC\\u30C8\\u30FB\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "\\u30AA\\u30F3\\u30E9\\u30A4\\u30F3"
        },
        "offline": {
          "tooltip": "\\u30AA\\u30D5\\u30E9\\u30A4\\u30F3"
        },
        "detached": {
          "tooltip": "\\u30C7\\u30BF\\u30C3\\u30C1\\u6E08"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00C2\\u00A9 2020, 2021, Oracle and/or its affiliates.<br/>Oracle\\u306F\\u30AA\\u30E9\\u30AF\\u30EB\\u304A\\u3088\\u3073\\u305D\\u306E\\u95A2\\u9023\\u4F1A\\u793E\\u306E\\u767B\\u9332\\u5546\\u6A19\\u3067\\u3059\\u3002\\u305D\\u306E\\u4ED6\\u306E\\u793E\\u540D\\u3001\\u5546\\u54C1\\u540D\\u7B49\\u306F\\u5404\\u793E\\u306E\\u5546\\u6A19\\u307E\\u305F\\u306F\\u767B\\u9332\\u5546\\u6A19\\u3067\\u3042\\u308B\\u5834\\u5408\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002<br/>",
      "builtWith": "Oracle JET\\u3067\\u69CB\\u7BC9"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "\\u60C5\\u5831"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "\\u524A\\u9664"
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
          "value": "\\u30E6\\u30FC\\u30B6\\u30FC\\u540D"
        },
        "password": {
          "value": "\\u30D1\\u30B9\\u30EF\\u30FC\\u30C9"
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
          "value": "\\u30D7\\u30ED\\u30B8\\u30A7\\u30AF\\u30C8\\u540D"
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
            "label": "\\u30D7\\u30ED\\u30D0\\u30A4\\u30C0ID:"
          }
        },
        "domain": {
          "name": {
            "label": "\\u30C9\\u30E1\\u30A4\\u30F3\\u540D:"
          },
          "url": {
            "label": "\\u30C9\\u30E1\\u30A4\\u30F3URL:"
          },
          "version": {
            "label": "\\u30C9\\u30E1\\u30A4\\u30F3\\u30FB\\u30D0\\u30FC\\u30B8\\u30E7\\u30F3:"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "\\u63A5\\u7D9A\\u30BF\\u30A4\\u30E0\\u30A2\\u30A6\\u30C8:"
          },
          "readTimeout": {
            "label": "\\u8AAD\\u53D6\\u308A\\u30BF\\u30A4\\u30E0\\u30A2\\u30A6\\u30C8:"
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
                "label": "\\u30C9\\u30E1\\u30A4\\u30F3URL:"
              },
              "version": {
                "label": "\\u30C9\\u30E1\\u30A4\\u30F3\\u30FB\\u30D0\\u30FC\\u30B8\\u30E7\\u30F3:"
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
          "value": "\\u30D7\\u30ED\\u30B8\\u30A7\\u30AF\\u30C8\\u306E\\u30A4\\u30F3\\u30DD\\u30FC\\u30C8"
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
          "value": "\\u30D7\\u30ED\\u30B8\\u30A7\\u30AF\\u30C8\\u306E\\u30A4\\u30F3\\u30DD\\u30FC\\u30C8"
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
        "fileNotSet": "\\u672A\\u8A2D\\u5B9A"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "\\u30C4\\u30EA\\u30FC\\u306E\\u7DE8\\u96C6"
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
      "home": "\\u30DB\\u30FC\\u30E0",
      "configuration": "\\u30C4\\u30EA\\u30FC\\u306E\\u7DE8\\u96C6",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "\\u30DB\\u30FC\\u30E0"
        },
        "preferences": {
          "label": "\\u30D7\\u30EA\\u30D5\\u30A1\\u30EC\\u30F3\\u30B9"
        },
        "search": {
          "label": "\\u691C\\u7D22"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "\\u30B7\\u30E7\\u30C3\\u30D4\\u30F3\\u30B0\\u30FB\\u30AB\\u30FC\\u30C8"
        },
        "ataglance": {
          "label": "\\u5373\\u6642"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "\\u30AD\\u30AA\\u30B9\\u30AF"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "\\u5C65\\u6B74"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "\\u5C65\\u6B74\\u306E\\u30AF\\u30EA\\u30A2"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "\\u30C7\\u30FC\\u30BF\\u3092\\u4F7F\\u7528\\u3067\\u304D\\u307E\\u305B\\u3093"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "\\u5C65\\u6B74"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "\\u5C65\\u6B74\\u306E\\u30AF\\u30EA\\u30A2"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "\\u30C7\\u30FC\\u30BF\\u3092\\u4F7F\\u7528\\u3067\\u304D\\u307E\\u305B\\u3093"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "{0}\\u6642\\u306B\\u5B9F\\u884C"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "\\u63A5\\u7D9A\\u304C\\u5931\\u308F\\u308C\\u307E\\u3057\\u305F",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "\\u63A5\\u7D9A\\u306E\\u8A66\\u884C\\u306B\\u5931\\u6557\\u3057\\u307E\\u3057\\u305F",
        "detail": "WebLogic\\u30C9\\u30E1\\u30A4\\u30F3{0}\\u306B\\u63A5\\u7D9A\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002WebLogic\\u304C\\u7A3C\\u50CD\\u3057\\u3066\\u3044\\u308B\\u3053\\u3068\\u3092\\u78BA\\u8A8D\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002"
      }
    },
    "dialog1": {
      "title": "WebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u3078\\u306E\\u63A5\\u7D9A",
      "instructions": "WebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306E\\u7BA1\\u7406\\u30E6\\u30FC\\u30B6\\u30FC\\u306E\\u8CC7\\u683C\\u8A3C\\u660E\\u3068URL\\u3092\\u5165\\u529B\\u3057\\u307E\\u3059:",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "\\u63A5\\u7D9A"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "\\u30AE\\u30E3\\u30E9\\u30EA"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "\\u30C4\\u30EA\\u30FC\\u306E\\u7DE8\\u96C6",
        "description": "<p>\\u73FE\\u5728\\u4F5C\\u696D\\u4E2D\\u306EWebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306E\\u69CB\\u6210\\u3092\\u7DAD\\u6301\\u3057\\u307E\\u3059\\u3002</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>\\u73FE\\u5728\\u4F5C\\u696D\\u4E2D\\u306EWebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306E\\u8AAD\\u53D6\\u308A\\u5C02\\u7528\\u69CB\\u6210\\u3092\\u8ABF\\u3079\\u307E\\u3059\\u3002</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>\\u73FE\\u5728\\u4F5C\\u696D\\u4E2D\\u306EWebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306E\\u9078\\u629E\\u3055\\u308C\\u305F\\u30EA\\u30BD\\u30FC\\u30B9\\u306E\\u30E9\\u30F3\\u30BF\\u30A4\\u30E0MBean\\u60C5\\u5831\\u3092\\u53D6\\u5F97\\u3057\\u307E\\u3059\\u3002</p>"
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
        "tooltip": "\\u5909\\u66F4\\u306E\\u7834\\u68C4"
      },
      "commit": {
        "tooltip": "\\u5909\\u66F4\\u306E\\u30B3\\u30DF\\u30C3\\u30C8"
      }
    },
    "sections": {
      "changeManager": {
        "label": "\\u5909\\u66F4\\u30DE\\u30CD\\u30FC\\u30B8\\u30E3"
      },
      "additions": {
        "label": "\\u8FFD\\u52A0"
      },
      "modifications": {
        "label": "\\u5909\\u66F4"
      },
      "removals": {
        "label": "\\u524A\\u9664"
      },
      "restart": {
        "label": "\\u518D\\u8D77\\u52D5"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "\\u65B0\\u898F"
      },
      "clone": {
        "label": "\\u30AF\\u30ED\\u30FC\\u30F3"
      },
      "delete": {
        "label": "\\u524A\\u9664"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "\\u30E9\\u30F3\\u30C7\\u30A3\\u30F3\\u30B0\\u30FB\\u30DA\\u30FC\\u30B8"
      },
      "history": {
        "tooltip": "\\u5C65\\u6B74\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "instructions": {
        "tooltip": "\\u30A4\\u30F3\\u30B9\\u30C8\\u30E9\\u30AF\\u30B7\\u30E7\\u30F3\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "help": {
        "tooltip": "\\u30D8\\u30EB\\u30D7\\u30FB\\u30DA\\u30FC\\u30B8\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "sync": {
        "tooltip": "\\u518D\\u30ED\\u30FC\\u30C9",
        "tooltipOn": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u505C\\u6B62"
      },
      "syncInterval": {
        "tooltip": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u9593\\u9694\\u306E\\u8A2D\\u5B9A"
      },
      "shoppingcart": {
        "tooltip": "\\u30AF\\u30EA\\u30C3\\u30AF\\u3057\\u3066\\u30AB\\u30FC\\u30C8\\u306B\\u5BFE\\u3059\\u308B\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u8868\\u793A"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u5909\\u66F4\\u306E\\u8868\\u793A"
        },
        "discard": {
          "label": "\\u5909\\u66F4\\u306E\\u7834\\u68C4"
        },
        "commit": {
          "label": "\\u5909\\u66F4\\u306E\\u30B3\\u30DF\\u30C3\\u30C8"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "''{0}''\\u64CD\\u4F5C\\u3092\\u5B9F\\u884C\\u3059\\u308B\\u30A2\\u30A4\\u30C6\\u30E0\\u3092\\u9078\\u629E\\u3057\\u307E\\u3059\\u3002"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8",
          "detail": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u5B9F\\u884C\\u4E2D\\u306F''{0}''\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u5B9F\\u884C\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002\\u307E\\u305A\\u3001''{1}''\\u30A2\\u30A4\\u30B3\\u30F3\\u3092\\u30AF\\u30EA\\u30C3\\u30AF\\u3057\\u3066\\u505C\\u6B62\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002"
        }
      }
    },
    "labels": {
      "start": {
        "value": "\\u8D77\\u52D5"
      },
      "resume": {
        "value": "\\u518D\\u958B"
      },
      "suspend": {
        "value": "\\u4E00\\u6642\\u505C\\u6B62"
      },
      "shutdown": {
        "value": "\\u30B7\\u30E3\\u30C3\\u30C8\\u30C0\\u30A6\\u30F3"
      },
      "restartSSL": {
        "value": "SSL\\u306E\\u518D\\u8D77\\u52D5"
      },
      "stop": {
        "value": "\\u505C\\u6B62"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "\\u975E\\u8868\\u793A\\u306E\\u5217\\u3092\\u8868\\u793A"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "\\u53D6\\u6D88"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "\\u4FDD\\u5B58"
      },
      "new": {
        "label": "\\u4F5C\\u6210"
      },
      "delete": {
        "label": "\\u524A\\u9664"
      },
      "back": {
        "label": "\\u623B\\u308B"
      },
      "next": {
        "label": "\\u6B21"
      },
      "finish": {
        "label": "\\u4F5C\\u6210"
      }
    },
    "icons": {
      "save": {
        "tooltip": "\\u4FDD\\u5B58"
      },
      "create": {
        "tooltip": "\\u4F5C\\u6210"
      },
      "landing": {
        "tooltip": "\\u30E9\\u30F3\\u30C7\\u30A3\\u30F3\\u30B0\\u30FB\\u30DA\\u30FC\\u30B8"
      },
      "history": {
        "tooltip": "\\u5C65\\u6B74\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "instructions": {
        "tooltip": "\\u30A4\\u30F3\\u30B9\\u30C8\\u30E9\\u30AF\\u30B7\\u30E7\\u30F3\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "help": {
        "tooltip": "\\u30D8\\u30EB\\u30D7\\u30FB\\u30DA\\u30FC\\u30B8\\u306E\\u8868\\u793A\\u306E\\u5207\\u66FF\\u3048"
      },
      "sync": {
        "tooltip": "\\u518D\\u30ED\\u30FC\\u30C9",
        "tooltipOn": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u505C\\u6B62"
      },
      "syncInterval": {
        "tooltip": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u9593\\u9694\\u306E\\u8A2D\\u5B9A"
      },
      "shoppingcart": {
        "tooltip": "\\u30AF\\u30EA\\u30C3\\u30AF\\u3057\\u3066\\u30AB\\u30FC\\u30C8\\u306B\\u5BFE\\u3059\\u308B\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u8868\\u793A"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u5909\\u66F4\\u306E\\u8868\\u793A"
        },
        "discard": {
          "label": "\\u5909\\u66F4\\u306E\\u7834\\u68C4"
        },
        "commit": {
          "label": "\\u5909\\u66F4\\u306E\\u30B3\\u30DF\\u30C3\\u30C8"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "\\u62E1\\u5F35\\u30D5\\u30A3\\u30FC\\u30EB\\u30C9\\u306E\\u8868\\u793A"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "{0}\\u30A2\\u30A4\\u30B3\\u30F3\\u3092\\u30AF\\u30EA\\u30C3\\u30AF\\u3059\\u308B\\u3068\\u3001\\u30B5\\u30DE\\u30EA\\u30FC\\u30FB\\u30D8\\u30EB\\u30D7\\u3068\\u8A73\\u7D30\\u30D8\\u30EB\\u30D7\\u306E\\u9593\\u3067\\u5207\\u308A\\u66FF\\u3048\\u308B\\u3053\\u3068\\u304C\\u3067\\u304D\\u307E\\u3059\\u3002"
      }
    },
    "messages": {
      "save": "\\u30AB\\u30FC\\u30C8\\u306B\\u5909\\u66F4\\u304C\\u8FFD\\u52A0\\u3055\\u308C\\u307E\\u3057\\u305F"
    },
    "icons": {
      "restart": {
        "tooltip": "\\u30B5\\u30FC\\u30D0\\u30FC\\u307E\\u305F\\u306F\\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\\u306E\\u518D\\u8D77\\u52D5\\u304C\\u5FC5\\u8981\\u3067\\u3059"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "\\u30D8\\u30EB\\u30D7\\u8868",
        "columns": {
          "header": {
            "name": "\\u540D\\u524D",
            "description": "\\u8AAC\\u660E"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "\\u5FC5\\u9808\\u30D5\\u30A3\\u30FC\\u30EB\\u30C9\\u304C\\u4E0D\\u5B8C\\u5168\\u3067\\u3059",
        "detail": "{0}\\u30D5\\u30A3\\u30FC\\u30EB\\u30C9\\u306F\\u5FC5\\u9808\\u3067\\u3059\\u304C\\u3001\\u5024\\u304C\\u6307\\u5B9A\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002"
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "\\u53D6\\u6D88"
      },
      "yes": {
        "label": "\\u306F\\u3044"
      },
      "no": {
        "label": "\\u3044\\u3044\\u3048"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "\\u63A5\\u7D9A"
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
        "label": "\\u30D5\\u30A1\\u30A4\\u30EB\\u306E\\u66F4\\u65B0"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "\\u7E2E\\u5C0F"
      },
      "expand": {
        "value": "\\u5C55\\u958B"
      },
      "choose": {
        "value": "\\u30D5\\u30A1\\u30A4\\u30EB\\u306E\\u9078\\u629E"
      },
      "clear": {
        "value": "\\u9078\\u629E\\u3057\\u305F\\u30D5\\u30A1\\u30A4\\u30EB\\u306E\\u30AF\\u30EA\\u30A2"
      },
      "more": {
        "value": "\\u305D\\u306E\\u4ED6\\u306E\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3"
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
        "value": "\\u30D5\\u30A1\\u30A4\\u30EB\\u306E\\u66F4\\u65B0"
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
      "selectValue": "\\u5024\\u306E\\u9078\\u629E",
      "selectSwitch": "\\u5024\\u306E\\u5207\\u66FF\\u3048",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "\\u4FDD\\u5B58\\u3055\\u308C\\u3066\\u3044\\u306A\\u3044\\u5909\\u66F4\\u304C\\u691C\\u51FA\\u3055\\u308C\\u307E\\u3057\\u305F"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "\\u672A\\u4FDD\\u5B58\\u306E\\u5909\\u66F4\\u5185\\u5BB9\\u306F\\u3059\\u3079\\u3066\\u5931\\u308F\\u308C\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B\\u3002"
        },
        "areYouSure": {
          "value": "\\u5909\\u66F4\\u3092\\u4FDD\\u5B58\\u305B\\u305A\\u306B\\u7D42\\u4E86\\u3057\\u3066\\u3082\\u3088\\u308D\\u3057\\u3044\\u3067\\u3059\\u304B\\u3002"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u9593\\u9694\\u306E\\u8A2D\\u5B9A",
      "instructions": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u9593\\u9694\\u306F\\u4F55\\u79D2\\u306B\\u3057\\u307E\\u3059\\u304B\\u3002",
      "fields": {
        "interval": {
          "label": "\\u81EA\\u52D5\\u518D\\u30ED\\u30FC\\u30C9\\u306E\\u9593\\u9694:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8",
          "detail": "''{1}''\\u3067\\u6307\\u5B9A\\u3055\\u308C\\u305F\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u5B9F\\u884C\\u3057\\u3088\\u3046\\u3068\\u3057\\u305F\\u3068\\u304D\\u306B\\u3001\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB\\u30FB\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u547C\\u51FA\\u3057\\u304C''{0}''\\u30EC\\u30B9\\u30DD\\u30F3\\u30B9\\u3092\\u751F\\u6210\\u3057\\u307E\\u3057\\u305F\\u3002"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "\\u6B63\\u78BA\\u306A\\u539F\\u56E0\\u3092\\u7279\\u5B9A\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002JavaScript\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB\\u3067\\u30D2\\u30F3\\u30C8\\u3092\\u78BA\\u8A8D\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "\\u4F7F\\u7528\\u53EF\\u80FD",
        "chosen": "\\u9078\\u629E\\u6E08"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "{0}\\u306E\\u8868\\u793A..."
          },
          "create": {
            "label": "{0}\\u306E\\u65B0\\u898F\\u4F5C\\u6210..."
          },
          "edit": {
            "label": "{0}\\u306E\\u7DE8\\u96C6..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "\\u30C7\\u30D5\\u30A9\\u30EB\\u30C8\\u306B\\u623B\\u3059"
    },
    "placeholder": {
      "value": "\\u30C7\\u30D5\\u30A9\\u30EB\\u30C8"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8",
        "detail": "RDJ\\u306B\\u306F\\u3001''{0}''\\u30A2\\u30A4\\u30C6\\u30E0\\u306E''notFoundMessage''\\u30D5\\u30A3\\u30FC\\u30EB\\u30C9\\u304C\\u542B\\u307E\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002"
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
        "value": "\\u30B5\\u30FC\\u30D0\\u30FC\\u306E\\u72B6\\u614B"
      },
      "systemStatus": {
        "value": "\\u30B7\\u30B9\\u30C6\\u30E0\\u30FB\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9"
      },
      "healthState": {
        "failed": {
          "value": "\\u5931\\u6557"
        },
        "critical": {
          "value": "\\u30AF\\u30EA\\u30C6\\u30A3\\u30AB\\u30EB"
        },
        "overloaded": {
          "value": "\\u904E\\u8CA0\\u8377"
        },
        "warning": {
          "value": "\\u8B66\\u544A"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "\\u5B9F\\u884C\\u4E2D\\u306E\\u30B5\\u30FC\\u30D0\\u30FC\\u306E\\u73FE\\u6642\\u70B9\\u306E\\u30D8\\u30EB\\u30B9"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "\\u540D\\u524D"
        },
        "state": {
          "value": "\\u72B6\\u614B"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "\\u73FE\\u5728\\u3001\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u306B\\u30A2\\u30AF\\u30BB\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002"
      },
      "connectionMessage": {
        "summary": "\\u63A5\\u7D9A\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "Weblogic\\u30C9\\u30E1\\u30A4\\u30F3\\u8CC7\\u683C\\u8A3C\\u660E\\u304C\\u6709\\u52B9\\u3067\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093"
      },
      "invalidUrl": {
        "detail": "WebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306EURL\\u306B\\u30A2\\u30AF\\u30BB\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093"
      },
      "notSupported": {
        "detail": "WebLogic\\u30C9\\u30E1\\u30A4\\u30F3\\u306F\\u30B5\\u30DD\\u30FC\\u30C8\\u3055\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093"
      },
      "unexpectedStatus": {
        "detail": "\\u4E88\\u671F\\u3057\\u306A\\u3044\\u7D50\\u679C(\\u30B9\\u30C6\\u30FC\\u30BF\\u30B9: {0})"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "\\u30EA\\u30AF\\u30A8\\u30B9\\u30C8\\u5931\\u6557",
          "detail": "\\u5931\\u6557\\u3092\\u793A\\u3059\\u30EC\\u30B9\\u30DD\\u30F3\\u30B9\\u304C\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB\\u30FB\\u30D0\\u30C3\\u30AF\\u30A8\\u30F3\\u30C9\\u547C\\u51FA\\u3057\\u304B\\u3089\\u8FD4\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "\\u7279\\u5B9A\\u306E\\u7406\\u7531\\u306B\\u3064\\u3044\\u3066\\u306F\\u3001\\u30EA\\u30E2\\u30FC\\u30C8\\u30FB\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB\\u7AEF\\u672B\\u307E\\u305F\\u306FJavascript\\u30B3\\u30F3\\u30BD\\u30FC\\u30EB\\u3092\\u53C2\\u7167\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002"
      },
      "responseMessages": {
        "summary": "\\u30EC\\u30B9\\u30DD\\u30F3\\u30B9\\u30FB\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "\\u5909\\u66F4\\u30DE\\u30CD\\u30FC\\u30B8\\u30E3\\u306B\\u30A2\\u30AF\\u30BB\\u30B9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002"
      },
      "changesCommitted": {
        "summary": "\\u5909\\u66F4\\u306F\\u6B63\\u5E38\\u306B\\u30B3\\u30DF\\u30C3\\u30C8\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002"
      },
      "changesNotCommitted": {
        "summary": "\\u5909\\u66F4\\u3092\\u30B3\\u30DF\\u30C3\\u30C8\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002"
      },
      "changesDiscarded": {
        "summary": "\\u5909\\u66F4\\u306F\\u6B63\\u5E38\\u306B\\u7834\\u68C4\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002"
      },
      "changesNotDiscarded": {
        "summary": "\\u5909\\u66F4\\u3092\\u7834\\u68C4\\u3067\\u304D\\u307E\\u305B\\u3093\\u3002"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "\\u4E88\\u671F\\u3057\\u306A\\u3044\\u30A8\\u30E9\\u30FC\\u30FB\\u30EC\\u30B9\\u30DD\\u30F3\\u30B9"
      }
    }
  }
});