define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic \\u8FDC\\u7A0B\\u63A7\\u5236\\u53F0"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "\\u8054\\u673A"
        },
        "offline": {
          "tooltip": "\\u8131\\u673A"
        },
        "detached": {
          "tooltip": "\\u5DF2\\u5206\\u79BB"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "\\u7248\\u6743\\u6240\\u6709 \\u00A9 2020\\uFF0C2021\\uFF0COracle \\u548C/\\u6216\\u5176\\u5173\\u8054\\u516C\\u53F8\\u3002<br/>Oracle \\u662F Oracle Corporation \\u548C/\\u6216\\u5176\\u5173\\u8054\\u516C\\u53F8\\u7684\\u6CE8\\u518C\\u5546\\u6807\\u3002\\u5176\\u4ED6\\u540D\\u79F0\\u53EF\\u80FD\\u662F\\u5404\\u81EA\\u6240\\u6709\\u8005\\u7684\\u5546\\u6807\\u3002<br/>",
      "builtWith": "\\u4F7F\\u7528 Oracle JET \\u6784\\u5EFA"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "\\u83B7\\u53D6\\u4FE1\\u606F"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "\\u5220\\u9664"
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
          "value": "\\u7528\\u6237\\u540D"
        },
        "password": {
          "value": "\\u5BC6\\u7801"
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
            "label": "\\u57DF\\u540D:"
          },
          "url": {
            "label": "\\u57DF URL\\uFF1A"
          },
          "version": {
            "label": "\\u57DF\\u7248\\u672C\\uFF1A"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "\\u8FDE\\u63A5\\u8D85\\u65F6\\uFF1A"
          },
          "readTimeout": {
            "label": "\\u8BFB\\u53D6\\u8D85\\u65F6:"
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
                "label": "\\u57DF URL\\uFF1A"
              },
              "version": {
                "label": "\\u57DF\\u7248\\u672C\\uFF1A"
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
          "value": "\\u5BFC\\u5165\\u9879\\u76EE"
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
          "value": "\\u5BFC\\u5165\\u9879\\u76EE"
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
        "fileNotSet": "\\u672A\\u8BBE\\u7F6E"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "\\u7F16\\u8F91\\u6811"
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
      "home": "\\u4E3B\\u9875",
      "configuration": "\\u7F16\\u8F91\\u6811",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "\\u4E3B\\u9875"
        },
        "preferences": {
          "label": "\\u9996\\u9009\\u9879"
        },
        "search": {
          "label": "\\u641C\\u7D22"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "\\u8D2D\\u7269\\u8F66"
        },
        "ataglance": {
          "label": "\\u6982\\u89C8"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "\\u4FE1\\u606F\\u7EC8\\u7AEF"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "\\u5386\\u53F2\\u8BB0\\u5F55"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "\\u6E05\\u9664\\u5386\\u53F2\\u8BB0\\u5F55"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "\\u6570\\u636E\\u4E0D\\u53EF\\u7528"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "\\u5386\\u53F2\\u8BB0\\u5F55"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "\\u6E05\\u9664\\u5386\\u53F2\\u8BB0\\u5F55"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "\\u6570\\u636E\\u4E0D\\u53EF\\u7528"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "\\u5728 {0} \\u8FD0\\u884C"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "\\u8FDE\\u63A5\\u4E22\\u5931",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "\\u5C1D\\u8BD5\\u8FDE\\u63A5\\u5931\\u8D25",
        "detail": "\\u65E0\\u6CD5\\u8FDE\\u63A5\\u5230 WebLogic \\u57DF {0}\\uFF0C\\u8BF7\\u68C0\\u67E5 WebLogic \\u662F\\u5426\\u5728\\u8FD0\\u884C\\u3002"
      }
    },
    "dialog1": {
      "title": "\\u8FDE\\u63A5\\u5230 WebLogic \\u57DF",
      "instructions": "\\u8F93\\u5165 WebLogic \\u57DF\\u7684\\u7BA1\\u7406\\u5458\\u7528\\u6237\\u8EAB\\u4EFD\\u8BC1\\u660E\\u548C URL\\uFF1A",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "\\u8FDE\\u63A5"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "\\u5E93"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "\\u7F16\\u8F91\\u6811",
        "description": "<p>\\u7EF4\\u62A4\\u60A8\\u5F53\\u524D\\u4F7F\\u7528\\u7684 WebLogic \\u57DF\\u7684\\u914D\\u7F6E\\u3002</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>\\u68C0\\u67E5\\u60A8\\u5F53\\u524D\\u4F7F\\u7528\\u7684 WebLogic \\u57DF\\u7684\\u53EA\\u8BFB\\u914D\\u7F6E\\u3002</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>\\u67E5\\u770B\\u60A8\\u5F53\\u524D\\u4F7F\\u7528\\u7684 WebLogic \\u57DF\\u4E2D\\u9009\\u5B9A\\u8D44\\u6E90\\u7684\\u8FD0\\u884C\\u65F6 MBean \\u4FE1\\u606F\\u3002</p>"
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
        "tooltip": "\\u653E\\u5F03\\u66F4\\u6539"
      },
      "commit": {
        "tooltip": "\\u63D0\\u4EA4\\u66F4\\u6539"
      }
    },
    "sections": {
      "changeManager": {
        "label": "\\u66F4\\u6539\\u7BA1\\u7406\\u5668"
      },
      "additions": {
        "label": "\\u6DFB\\u52A0"
      },
      "modifications": {
        "label": "\\u4FEE\\u6539"
      },
      "removals": {
        "label": "\\u5220\\u9664"
      },
      "restart": {
        "label": "\\u91CD\\u65B0\\u542F\\u52A8"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "\\u65B0\\u5EFA"
      },
      "clone": {
        "label": "\\u514B\\u9686"
      },
      "delete": {
        "label": "\\u5220\\u9664"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "\\u767B\\u5F55\\u9875"
      },
      "history": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u5386\\u53F2\\u8BB0\\u5F55"
      },
      "instructions": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u8BF4\\u660E"
      },
      "help": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u5E2E\\u52A9\\u9875"
      },
      "sync": {
        "tooltip": "\\u91CD\\u65B0\\u52A0\\u8F7D",
        "tooltipOn": "\\u505C\\u6B62\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D"
      },
      "syncInterval": {
        "tooltip": "\\u8BBE\\u7F6E\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u95F4\\u9694"
      },
      "shoppingcart": {
        "tooltip": "\\u5355\\u51FB\\u4EE5\\u67E5\\u770B\\u8D2D\\u7269\\u8F66\\u7684\\u64CD\\u4F5C"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u67E5\\u770B\\u66F4\\u6539"
        },
        "discard": {
          "label": "\\u653E\\u5F03\\u66F4\\u6539"
        },
        "commit": {
          "label": "\\u63D0\\u4EA4\\u66F4\\u6539"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "\\u9009\\u62E9\\u8981\\u6267\\u884C ''{0}'' \\u64CD\\u4F5C\\u7684\\u9879\\u76EE\\u3002"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "\\u6D88\\u606F",
          "detail": "\\u65E0\\u6CD5\\u5728\\u8FD0\\u884C\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u65F6\\u6267\\u884C ''{0}'' \\u64CD\\u4F5C\\uFF01\\u8BF7\\u9996\\u5148\\u5355\\u51FB ''{1}'' \\u56FE\\u6807\\u505C\\u6B62\\u91CD\\u65B0\\u52A0\\u8F7D\\u3002"
        }
      }
    },
    "labels": {
      "start": {
        "value": "\\u542F\\u52A8"
      },
      "resume": {
        "value": "\\u6062\\u590D"
      },
      "suspend": {
        "value": "\\u6302\\u8D77"
      },
      "shutdown": {
        "value": "\\u5173\\u95ED"
      },
      "restartSSL": {
        "value": "\\u91CD\\u65B0\\u542F\\u52A8 SSL"
      },
      "stop": {
        "value": "\\u505C\\u6B62"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "\\u663E\\u793A\\u9690\\u85CF\\u7684\\u5217"
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
        "label": "\\u521B\\u5EFA"
      },
      "delete": {
        "label": "\\u5220\\u9664"
      },
      "back": {
        "label": "\\u4E0A\\u4E00\\u6B65"
      },
      "next": {
        "label": "\\u4E0B\\u4E00\\u6B65"
      },
      "finish": {
        "label": "\\u521B\\u5EFA"
      }
    },
    "icons": {
      "save": {
        "tooltip": "\\u4FDD\\u5B58"
      },
      "create": {
        "tooltip": "\\u521B\\u5EFA"
      },
      "landing": {
        "tooltip": "\\u767B\\u5F55\\u9875"
      },
      "history": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u5386\\u53F2\\u8BB0\\u5F55"
      },
      "instructions": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u8BF4\\u660E"
      },
      "help": {
        "tooltip": "\\u663E\\u793A/\\u9690\\u85CF\\u5E2E\\u52A9\\u9875"
      },
      "sync": {
        "tooltip": "\\u91CD\\u65B0\\u52A0\\u8F7D",
        "tooltipOn": "\\u505C\\u6B62\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D"
      },
      "syncInterval": {
        "tooltip": "\\u8BBE\\u7F6E\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u95F4\\u9694"
      },
      "shoppingcart": {
        "tooltip": "\\u5355\\u51FB\\u4EE5\\u67E5\\u770B\\u8D2D\\u7269\\u8F66\\u7684\\u64CD\\u4F5C"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "\\u67E5\\u770B\\u66F4\\u6539"
        },
        "discard": {
          "label": "\\u653E\\u5F03\\u66F4\\u6539"
        },
        "commit": {
          "label": "\\u63D0\\u4EA4\\u66F4\\u6539"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "\\u663E\\u793A\\u9AD8\\u7EA7\\u5B57\\u6BB5"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "\\u5355\\u51FB {0} \\u56FE\\u6807\\u4EE5\\u5728\\u6982\\u8981\\u548C\\u8BE6\\u7EC6\\u5E2E\\u52A9\\u4FE1\\u606F\\u4E4B\\u95F4\\u5207\\u6362\\u3002"
      }
    },
    "messages": {
      "save": "\\u6DFB\\u52A0\\u5230\\u8D2D\\u7269\\u8F66\\u7684\\u66F4\\u6539"
    },
    "icons": {
      "restart": {
        "tooltip": "\\u9700\\u8981\\u91CD\\u65B0\\u542F\\u52A8\\u670D\\u52A1\\u5668\\u6216\\u5E94\\u7528\\u7A0B\\u5E8F"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "\\u5E2E\\u52A9\\u8868",
        "columns": {
          "header": {
            "name": "\\u540D\\u79F0",
            "description": "\\u8BF4\\u660E"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "\\u5FC5\\u586B\\u5B57\\u6BB5\\u4E0D\\u5B8C\\u6574",
        "detail": "{0} \\u5B57\\u6BB5\\u662F\\u5FC5\\u586B\\u5B57\\u6BB5\\uFF0C\\u4F46\\u662F\\u5C1A\\u672A\\u63D0\\u4F9B\\u4EFB\\u4F55\\u503C\\u3002"
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
        "label": "\\u662F"
      },
      "no": {
        "label": "\\u5426"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "\\u8FDE\\u63A5"
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
        "label": "\\u66F4\\u65B0\\u6587\\u4EF6"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "\\u6298\\u53E0"
      },
      "expand": {
        "value": "\\u5C55\\u5F00"
      },
      "choose": {
        "value": "\\u9009\\u62E9\\u6587\\u4EF6"
      },
      "clear": {
        "value": "\\u6E05\\u9664\\u6240\\u9009\\u6587\\u4EF6"
      },
      "more": {
        "value": "\\u66F4\\u591A\\u64CD\\u4F5C"
      },
      "download": {
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "\\u63D0\\u4EA4\\u66F4\\u6539"
      },
      "write": {
        "value": "\\u66F4\\u65B0\\u6587\\u4EF6"
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
      "enterValue": "\\u8F93\\u5165\\u503C",
      "selectValue": "Select Value",
      "selectSwitch": "\\u5207\\u6362\\u503C",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "\\u68C0\\u6D4B\\u5230\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "\\u6240\\u6709\\u672A\\u4FDD\\u5B58\\u7684\\u66F4\\u6539\\u90FD\\u5C06\\u4E22\\u5931\\u3002\\u662F\\u5426\\u7EE7\\u7EED\\uFF1F"
        },
        "areYouSure": {
          "value": "\\u662F\\u5426\\u786E\\u5B9E\\u8981\\u9000\\u51FA\\u800C\\u4E0D\\u4FDD\\u5B58\\u66F4\\u6539\\uFF1F"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "\\u8BBE\\u7F6E\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u95F4\\u9694",
      "instructions": "\\u60A8\\u5E0C\\u671B\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u95F4\\u9694\\u662F\\u591A\\u5C11\\u79D2\\uFF1F",
      "fields": {
        "interval": {
          "label": "\\u81EA\\u52A8\\u91CD\\u65B0\\u52A0\\u8F7D\\u95F4\\u9694\\uFF1A"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "\\u6D88\\u606F",
          "detail": "\\u5F53\\u5C1D\\u8BD5\\u5BF9 ''{1}'' \\u6267\\u884C\\u6307\\u5B9A\\u64CD\\u4F5C\\u65F6\\uFF0C\\u63A7\\u5236\\u53F0\\u540E\\u7AEF\\u8C03\\u7528\\u751F\\u6210\\u4E86 ''{0}'' \\u54CD\\u5E94\\u3002"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "\\u65E0\\u6CD5\\u786E\\u5B9A\\u786E\\u5207\\u539F\\u56E0\\u3002\\u8BF7\\u67E5\\u770B JavaScript \\u63A7\\u5236\\u53F0\\u4E2D\\u7684\\u63D0\\u793A\\u3002"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "\\u53EF\\u7528",
        "chosen": "\\u6240\\u9009"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "\\u67E5\\u770B {0}..."
          },
          "create": {
            "label": "\\u521B\\u5EFA\\u65B0{0}..."
          },
          "edit": {
            "label": "\\u7F16\\u8F91 {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "\\u8FD8\\u539F\\u4E3A\\u9ED8\\u8BA4\\u503C"
    },
    "placeholder": {
      "value": "\\u9ED8\\u8BA4\\u503C"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "\\u6D88\\u606F",
        "detail": "RDJ \\u4E0D\\u5305\\u542B ''{0}'' \\u9879\\u76EE\\u7684 ''notFoundMessage'' \\u5B57\\u6BB5\\u3002"
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
        "value": "\\u670D\\u52A1\\u5668\\u72B6\\u6001"
      },
      "systemStatus": {
        "value": "\\u7CFB\\u7EDF\\u72B6\\u6001"
      },
      "healthState": {
        "failed": {
          "value": "\\u5931\\u8D25"
        },
        "critical": {
          "value": "\\u4E25\\u91CD"
        },
        "overloaded": {
          "value": "\\u8D85\\u8F7D"
        },
        "warning": {
          "value": "\\u8B66\\u544A"
        },
        "ok": {
          "value": "\\u6B63\\u5E38"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "\\u622A\\u81F3\\u4EE5\\u4E0B\\u65F6\\u95F4\\u6B63\\u5728\\u8FD0\\u884C\\u7684\\u670D\\u52A1\\u5668\\u7684\\u5065\\u5EB7\\u72B6\\u51B5:"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "\\u540D\\u79F0"
        },
        "state": {
          "value": "\\u72B6\\u6001"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "\\u5F53\\u524D\\u65E0\\u6CD5\\u8BBF\\u95EE\\u540E\\u7AEF\\u3002"
      },
      "connectionMessage": {
        "summary": "\\u8FDE\\u63A5\\u6D88\\u606F"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "WebLogic \\u57DF\\u8EAB\\u4EFD\\u8BC1\\u660E\\u65E0\\u6548 "
      },
      "invalidUrl": {
        "detail": "\\u65E0\\u6CD5\\u8BBF\\u95EE WebLogic \\u57DF URL "
      },
      "notSupported": {
        "detail": "\\u4E0D\\u652F\\u6301 WebLogic \\u57DF "
      },
      "unexpectedStatus": {
        "detail": "\\u610F\\u5916\\u7684\\u7ED3\\u679C\\uFF08\\u72B6\\u6001\\uFF1A{0}\\uFF09"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "\\u8BF7\\u6C42\\u672A\\u6210\\u529F",
          "detail": "\\u4ECE\\u63A7\\u5236\\u53F0\\u540E\\u7AEF\\u8C03\\u7528\\u8FD4\\u56DE\\u4E86\\u4E0D\\u6210\\u529F\\u7684\\u54CD\\u5E94\\u3002"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "\\u8BF7\\u67E5\\u770B\\u8FDC\\u7A0B\\u63A7\\u5236\\u53F0\\u7EC8\\u7AEF\\u6216 Javascript \\u63A7\\u5236\\u53F0\\u4EE5\\u4E86\\u89E3\\u5177\\u4F53\\u539F\\u56E0\\u3002"
      },
      "responseMessages": {
        "summary": "\\u54CD\\u5E94\\u6D88\\u606F"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "\\u65E0\\u6CD5\\u8BBF\\u95EE\\u66F4\\u6539\\u7BA1\\u7406\\u5668\\uFF01"
      },
      "changesCommitted": {
        "summary": "\\u5DF2\\u6210\\u529F\\u63D0\\u4EA4\\u66F4\\u6539\\uFF01"
      },
      "changesNotCommitted": {
        "summary": "\\u65E0\\u6CD5\\u63D0\\u4EA4\\u66F4\\u6539\\uFF01"
      },
      "changesDiscarded": {
        "summary": "\\u5DF2\\u6210\\u529F\\u653E\\u5F03\\u66F4\\u6539\\uFF01"
      },
      "changesNotDiscarded": {
        "summary": "\\u65E0\\u6CD5\\u653E\\u5F03\\u66F4\\u6539\\uFF01"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "\\u610F\\u5916\\u7684\\u9519\\u8BEF\\u54CD\\u5E94"
      }
    }
  }
});