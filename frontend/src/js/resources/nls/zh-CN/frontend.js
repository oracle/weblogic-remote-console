define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic 远程控制台"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "显示/隐藏导航树"
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
        "tooltip": "打开 WebLogic 远程控制台内部文档"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "打开消息中心"
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
      "copyrightLegal": "版权所有 (c) 2020，2024，Oracle 和/或其关联公司。<br/>Oracle (r)、Java、MySQL 和 NetSuite 是 Oracle 和/或其关联公司的注册商标。其他名称可能是各自所有者的商标。<br/>",
      "builtWith": "使用 Oracle JET 构建"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "不安全"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "管理服务器连接不安全"
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
          "value": "一般信息"
        },
        "settings": {
          "value": "设置"
        },
        "preferences": {
          "value": "首选项"
        },
        "properties": {
          "value": "属性"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "更改图像"
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
            "value": "注销"
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
            "value": "名称"
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
              "value": "是否为您的项目存储加密身份证明？"
            },
            "disableHNV": {
              "value": "是否禁用主机名验证？"
            },
            "proxyAddress": {
              "value": "代理地址"
            },
            "trustStoreType": {
              "value": "信任库类型"
            },
            "trustStorePath": {
              "value": "信任库路径"
            },
            "trustStoreKey": {
              "value": "信任库密钥"
            },
            "connectionTimeout": {
              "value": "管理服务器连接超时"
            },
            "readTimeout": {
              "value": "管理服务器读取超时"
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
        "tooltip": "获取信息"
      },
      "edit": {
        "tooltip": "管理"
      },
      "deactivate": {
        "tooltip": "停用"
      },
      "delete": {
        "tooltip": "删除"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "未命名项目"
        },
        "name": {
          "value": "连接提供程序名称"
        },
        "url": {
          "value": "URL"
        },
        "proxyOverride": {
          "value": "代理覆盖"
        },
        "username": {
          "value": "用户名"
        },
        "password": {
          "value": "密码"
        }
      },
      "models": {
        "name": {
          "value": "WDT 模型提供程序名称"
        },
        "file": {
          "value": "WDT 模型文件名"
        },
        "props": {
          "value": "WDT 变量"
        }
      },
      "composite": {
        "name": {
          "value": "WDT 组合模型提供程序名称"
        },
        "providers": {
          "value": "WDT 模型"
        }
      },
      "proplist": {
        "name": {
          "value": "属性列表提供程序名称"
        },
        "file": {
          "value": "属性列表文件名"
        }
      },
      "project": {
        "name": {
          "value": "项目名称"
        },
        "file": {
          "value": "项目文件名"
        }
      },
      "provider": {
        "adminserver": {
          "value": "管理服务器连接"
        },
        "model": {
          "value": "添加 WDT 模型"
        }
      },
      "dropdown": {
        "none": {
          "value": "无"
        }
      }
    },
    "popups": {
      "info": {
        "project": {
          "name": {
            "label": "项目名称："
          }
        },
        "provider": {
          "id": {
            "label": "提供程序 ID："
          }
        },
        "domain": {
          "name": {
            "label": "域名:"
          },
          "url": {
            "label": "域 URL："
          },
          "proxyOverride": {
            "label": "代理覆盖："
          },
          "version": {
            "label": "域版本："
          },
          "username": {
            "label": "用户名："
          },
          "sso": {
            "label": "SSO："
          },
          "roles": {
            "label": "角色："
          },
          "connectTimeout": {
            "label": "连接超时："
          },
          "readTimeout": {
            "label": "读取超时:"
          },
          "insecure": {
            "label": "不安全："
          },
          "anyAttempt": {
            "label": "尝试的任何连接："
          },
          "lastAttempt": {
            "label": "上次成功尝试："
          }
        },
        "model": {
          "file": {
            "label": "文件："
          },
          "props": {
            "label": "变量："
          }
        },
        "composite": {
          "models": {
            "label": "模型："
          }
        },
        "proplist": {
          "file": {
            "label": "文件名："
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "添加管理服务器连接提供程序"
        }
      },
      "models": {
        "add": {
          "value": "添加 WDT 模型文件提供程序"
        },
        "new": {
          "value": "为新 WDT 模型文件创建提供程序"
        }
      },
      "composite": {
        "add": {
          "value": "添加 WDT 组合模型文件提供程序"
        }
      },
      "proplist": {
        "add": {
          "value": "添加属性列表提供程序"
        },
        "new": {
          "value": "为新属性列表创建提供程序"
        }
      },
      "providers": {
        "sort": {
          "value": "按提供程序类型排序"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "域 URL："
              },
              "version": {
                "label": "域版本："
              },
              "username": {
                "label": "用户名："
              }
            }
          },
          "model": {
            "file": {
              "label": "文件："
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "将提供程序作为项目导出..."
        },
        "import": {
          "value": "导入项目"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "输入连接提供程序的新名称和连接设置。"
        },
        "edit": {
          "value": "修改连接提供程序的连接设置。"
        }
      },
      "models": {
        "add": {
          "value": "输入现有模型文件提供程序的设置。单击上载图标以浏览模型文件。"
        },
        "new": {
          "value": "输入新 WDT 模型文件的提供程序名称和文件名，然后单击用于选取文件保存目录的图标。"
        },
        "edit": {
          "value": "修改模型文件提供程序的设置。单击用于浏览模型文件的图标。"
        }
      },
      "composite": {
        "add": {
          "value": "输入新名称，并为组合模型提供程序选择经过排序的模型列表。"
        },
        "edit": {
          "value": "修改组合模型提供程序的设置。使用经过排序的模型列表。"
        }
      },
      "proplist": {
        "add": {
          "value": "输入现有模型列表提供程序的设置。单击上载图标以浏览属性文件。"
        },
        "new": {
          "value": "输入新属性列表的提供程序名称和文件名，然后单击用于选取文件保存目录的图标。"
        },
        "edit": {
          "value": "修改属性列表提供程序的设置。单击用于浏览属性文件的图标。"
        }
      },
      "project": {
        "export": {
          "value": "输入新项目的设置。"
        },
        "import": {
          "value": "单击下载图标以浏览项目。"
        }
      },
      "task": {
        "startup": {
          "value": "您希望执行哪个启动任务？"
        }
      },
      "project-busy": {
        "value": "在对项目的任何部分进行更改之前，请保存或放弃未保存的更改"
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "为管理服务器连接创建提供程序"
        },
        "models": {
          "value": "为现有 WDT 模型文件创建提供程序"
        },
        "composite": {
          "value": "为新 WDT 组合模型创建提供程序"
        },
        "proplist": {
          "value": "为现有属性列表创建提供程序"
        }
      },
      "new": {
        "models": {
          "value": "为新 WDT 模型文件创建提供程序"
        },
        "proplist": {
          "value": "为新属性列表创建提供程序"
        }
      },
      "edit": {
        "connections": {
          "value": "编辑管理服务器连接提供程序"
        },
        "models": {
          "value": "编辑 WDT 模型文件提供程序"
        },
        "composite": {
          "value": "编辑 WDT 组合模型提供程序"
        },
        "proplist": {
          "value": "编辑属性列表提供程序"
        }
      },
      "export": {
        "project": {
          "value": "将提供程序作为项目导出"
        }
      },
      "import": {
        "project": {
          "value": "导入项目"
        }
      },
      "startup": {
        "task": {
          "value": "启动任务"
        }
      },
      "project-busy": {
        "value": "项目繁忙"
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "导出未成功",
          "detail": "无法将提供程序作为 ''{0}'' 项目导出。"
        }
      },
      "import": {
        "failed": {
          "summary": "保存未成功",
          "detail": "无法导入 ''{0}'' 项目文件。"
        }
      },
      "stage": {
        "failed": {
          "summary": "创建未成功",
          "detail": "无法创建 ''{0}'' 提供程序项。"
        }
      },
      "use": {
        "failed": {
          "summary": "连接未成功",
          "detail": "无法使用 ''{0}'' 提供程序项。"
        }
      },
      "upload": {
        "failed": {
          "detail": "无法加载 WDT 模型文件 {0}"
        },
        "props": {
          "failed": {
            "detail": "无法加载 WDT 变量：{0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "此项目中已存在名为 ''{0}'' 的提供程序！"
        },
        "modelsNotFound": {
          "detail": "找不到所配置的 WDT 模型 ''{0}''"
        },
        "propListNotFound": {
          "detail": "找不到 WDT 变量 ''{0}''"
        },
        "selectModels": {
          "detail": "要选择 WDT 组合，请首先选择 WDT 组合使用的所有 WDT 模型。"
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>在文件名字段中编辑路径，然后单击“确定”按钮。或者，单击上载图标并选择其他文件。</p>"
        },
        "fixModelFile": {
          "detail": "<p>修复下面引用的问题，然后单击“确定”按钮。或者，选择其他文件。</p>"
        },
        "yamlException": {
          "detail": "{0} 位于第 {1} 行，第 {2} 列"
        },
        "wktModelContent": {
          "summary": "模型内容问题",
          "detail": "使用<i>代码视图</i>选项卡上的模型编辑器来解决问题。"
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": {
          "value": "未设置"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "使用稀疏模板"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "建立不安全的连接"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "编辑树"
      },
      "view": {
        "tooltip": "配置视图树"
      },
      "monitoring": {
        "tooltip": "监视树"
      },
      "security": {
        "tooltip": "安全数据树"
      },
      "modeling": {
        "tooltip": "WDT 模型"
      },
      "composite": {
        "tooltip": "WDT 组合模型"
      },
      "properties": {
        "tooltip": "属性列表编辑器"
      }
    }
  },
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "导航条"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "导航树"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "主页",
      "configuration": "编辑树",
      "view": "配置视图树",
      "monitoring": "监视树",
      "security": "安全数据树",
      "modeling": "WDT 模型",
      "composite": "WDT 组合模型",
      "properties": "属性列表"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "主页"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "购物车"
        },
        "ataglance": {
          "label": "概览"
        },
        "projectmanagement": {
          "label": "Providers"
        },
        "tips": {
          "label": "用户提示"
        },
        "dashboards": {
          "label": "仪表盘"
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
          "value": "全部隐藏"
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
          "value": "安全"
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
        "tooltip": "历史记录"
      },
      "separator": {
        "tooltip": "分隔符"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除历史记录条目",
          "label": "清除历史记录条目"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "在 {0} 运行"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "连接丢失",
        "detail": "与远程控制台后端的连接丢失。确保它正在运行或重新启动它并重试链接。"
      },
      "cannotConnect": {
        "summary": "尝试连接失败",
        "detail": "无法连接到 WebLogic 域 {0}，请检查 WebLogic 是否在运行。"
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "树"
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
        "label": "编辑树",
        "description": "<p>维护您当前使用的 WebLogic 域的配置。</p>"
      },
      "view": {
        "label": "配置视图树",
        "description": "<p>检查您当前使用的 WebLogic 域的只读配置。</p>"
      },
      "monitoring": {
        "label": "监视树",
        "description": "<p>查看您当前使用的 WebLogic 域中选定资源的运行时 MBean 信息。</p>"
      },
      "security": {
        "label": "安全数据树",
        "description": "<p>管理您当前使用的 WebLogic 域中的安全相关信息（例如用户、组、角色、策略、身份证明等）。</p>"
      },
      "modeling": {
        "label": "WDT 模型树",
        "description": "<p>维护与 WebLogic Deploy Tooling 工具关联的模型文件。</p>"
      },
      "composite": {
        "label": "WDT 组合模型树",
        "description": "<p>查看当前正在使用的 WebLogic Deploy Tooling 模型文件的组合集。</p>"
      },
      "properties": {
        "label": "属性列表编辑器",
        "description": "<p>查看或修改属性列表文件中的一组属性。</p>"
      }
    }
  },
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "添加管理服务器连接提供程序",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "添加 WDT 模型文件提供程序",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "添加 WDT 组合模型文件提供程序",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "添加属性列表提供程序",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "为新 WDT 模型文件创建提供程序",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "为新属性列表创建提供程序",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "导入项目",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "放弃更改"
      },
      "commit": {
        "tooltip": "提交更改"
      }
    },
    "sections": {
      "changeManager": {
        "label": "更改管理器"
      },
      "additions": {
        "label": "添加"
      },
      "modifications": {
        "label": "修改"
      },
      "removals": {
        "label": "删除"
      },
      "restart": {
        "label": "重新启动"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "新建"
      },
      "clone": {
        "label": "克隆"
      },
      "delete": {
        "label": "删除"
      },
      "customize": {
        "label": "定制表"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "登录页"
      },
      "history": {
        "tooltip": "显示/隐藏历史记录"
      },
      "instructions": {
        "tooltip": "显示/隐藏说明"
      },
      "help": {
        "tooltip": "显示/隐藏帮助页"
      },
      "sync": {
        "tooltip": "重新加载",
        "tooltipOn": "停止自动重新加载"
      },
      "syncInterval": {
        "tooltip": "设置自动重新加载间隔"
      },
      "shoppingcart": {
        "tooltip": "单击以查看购物车的操作"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "查看更改"
        },
        "discard": {
          "label": "放弃更改"
        },
        "commit": {
          "label": "提交更改"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "选择要执行 ''{0}'' 操作的项目。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "消息",
          "detail": "无法在运行自动重新加载时执行 ''{0}'' 操作！请首先单击 ''{1}'' 图标停止重新加载。"
        }
      }
    },
    "prompts": {
      "download": {
        "value": "下载的日志文件位置："
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "显示隐藏的列"
      }
    },
    "labels": {
      "totalRows": {
        "value": "总行数: {0}"
      },
      "reloadHidden": {
        "value": "重新加载表以查看当前的 {0} 个值"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "可用列"
      },
      "selected": {
        "value": "选定列"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "列数不足",
          "detail": "必须至少选择一列。"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "保存"
      },
      "new": {
        "label": "创建"
      },
      "delete": {
        "label": "删除"
      },
      "back": {
        "label": "上一步"
      },
      "next": {
        "label": "下一步"
      },
      "finish": {
        "label": "创建"
      },
      "customize": {
        "label": "定制表"
      },
      "dashboard": {
        "label": "新建仪表盘"
      }
    },
    "icons": {
      "save": {
        "tooltip": "保存"
      },
      "create": {
        "tooltip": "创建"
      },
      "landing": {
        "tooltip": "登录页"
      },
      "history": {
        "tooltip": "显示/隐藏历史记录"
      },
      "instructions": {
        "tooltip": "显示/隐藏说明"
      },
      "help": {
        "tooltip": "显示/隐藏帮助页"
      },
      "sync": {
        "tooltip": "重新加载",
        "tooltipOn": "停止自动重新加载"
      },
      "syncInterval": {
        "tooltip": "设置自动重新加载间隔"
      },
      "shoppingcart": {
        "tooltip": "单击以查看购物车的操作"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "查看更改"
        },
        "discard": {
          "label": "放弃更改"
        },
        "commit": {
          "label": "提交更改"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "显示高级字段"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "单击 {0} 图标以在概要和详细帮助信息之间切换。"
      }
    },
    "messages": {
      "savedTo": {
        "shoppingcart": "更改已添加到购物车！",
        "generic": "已保存更改！",
        "notSaved": "由于未检测到任何更改，未保存任何内容。"
      },
      "action": {
        "notAllowed": {
          "summary": "不允许操作",
          "detail": "在创建操作期间，无法执行请求的操作。单击“取消”按钮可取消创建操作。"
        }
      }
    },
    "icons": {
      "restart": {
        "tooltip": "需要重新启动服务器或应用程序"
      },
      "wdtIcon": {
        "tooltip": "WDT 设置"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "帮助表",
        "columns": {
          "header": {
            "name": "名称",
            "description": "说明"
          }
        }
      }
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>相关主题：</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "属性"
      },
      "actions": {
        "label": "操作"
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "必填字段不完整",
        "detail": "{0} 字段是必填字段，但是尚未提供任何值（或提供的值无效）。"
      }
    }
  },
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "添加条件"
        },
        "combine": {
          "label": "组合"
        },
        "uncombine": {
          "label": "取消组合"
        },
        "moveup": {
          "label": "上移"
        },
        "movedown": {
          "label": "下移"
        },
        "remove": {
          "label": "删除"
        },
        "negate": {
          "label": "求反"
        },
        "reset": {
          "label": "重置"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "添加新的第一个条件..."
          },
          "above": {
            "label": "在单击的行上面添加条件..."
          },
          "below": {
            "label": "在单击的行下面添加条件..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "在选中条件上面添加..."
          },
          "below": {
            "label": "在选中条件下面添加..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "一个或多个必填字段不包含数据！"
      },
      "argumentValueHasWrongFormat": {
        "summary": "''{0}'' 字段包含格式不正确的数据！"
      },
      "conditionHasNoArgValues": {
        "summary": "所选条件没有可编辑的参数值！"
      },
      "conditionAlreadyExists": {
        "summary": "此安全策略已具有使用所选谓词构建的条件，或者具有与参数值匹配的条件！"
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>要指定新条件的位置，请在相对条件旁边打勾，然后单击 <b>+添加条件</b>按钮。</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "范围: -31 到 31"
      },
      "dateTime": {
        "value": "格式：y-MM-dd HH:mm:ss [HH:mm:ss]（例如 2006-04-25 00:00:00）"
      },
      "time": {
        "value": "格式：HH:mm:ss（例如 14:22:47）"
      },
      "gmtOffset": {
        "value": "格式：GMT+|-h:mm（例如 GMT-5:00）"
      },
      "weekDay": {
        "value": "例如星期日、星期一、星期二、..."
      },
      "or": {
        "value": "或"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "组合"
      },
      "nodata": {
        "Policy": {
          "value": "使用 <b>+ 添加条件</b>按钮添加策略条件。"
        },
        "DefaultPolicy": {
          "value": "未定义默认安全策略条件。"
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "组合",
            "operator": "运算符",
            "expression": "条件短语"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "或",
            "and": "与"
          }
        }
      }
    },
    "wizard": {
      "title": "策略管理",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "选择谓词",
            "instructions": "从下拉列表中为您的新条件选择谓词。"
          },
          "body": {
            "labels": {
              "predicateList": "谓词列表"
            },
            "help": {
              "predicateList": "谓词列表是可用于组成安全策略条件的可用谓词的列表。"
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "组谓词",
            "instructions": "首先，在<i></i>字段中键入值以添加参数值或搜索现有参数值。按 Enter 键以将键入的值添加到列表中。要编辑现有参数值，请单击它并使用弹出式输入字段进行修改。"
          },
          "body": {
            "labels": {
              "conditionPhrase": "条件短语",
              "negate": "条件求反"
            },
            "help": {
              "negate": "将条件转换为具有相反含义（例如，“等于”变为“不等于”，“位于”变为“不位于”）。"
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "操作"
      },
      "apply": {
        "label": "应用"
      },
      "reset": {
        "label": "重置"
      },
      "ok": {
        "label": "确定"
      },
      "cancel": {
        "label": "取消"
      },
      "restart": {
        "label": "重新启动"
      },
      "yes": {
        "label": "是"
      },
      "no": {
        "label": "否"
      },
      "choose": {
        "label": "选择"
      },
      "connect": {
        "label": "连接"
      },
      "add": {
        "label": "添加/发送"
      },
      "edit": {
        "label": "编辑/发送"
      },
      "import": {
        "label": "导入"
      },
      "export": {
        "label": "导出"
      },
      "write": {
        "label": "下载文件"
      },
      "savenow": {
        "label": "立即保存"
      },
      "next": {
        "label": "下一步"
      },
      "previous": {
        "label": "上一个"
      },
      "finish": {
        "label": "完成"
      },
      "done": {
        "label": "完成"
      },
      "close": {
        "label": "关闭"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "折叠"
      },
      "expand": {
        "value": "展开"
      },
      "choose": {
        "value": "选择文件"
      },
      "clear": {
        "value": "清除所选文件"
      },
      "more": {
        "value": "更多操作"
      },
      "download": {
        "value": "浏览"
      },
      "reset": {
        "value": "重置"
      },
      "filter": {
        "value": "筛选器"
      },
      "submit": {
        "value": "提交更改"
      },
      "write": {
        "value": "下载文件"
      },
      "pick": {
        "value": "选取目录"
      },
      "reload": {
        "value": "重新加载文件"
      },
      "delete": {
        "value": "删除"
      },
      "remove": {
        "value": "删除"
      },
      "noData": {
        "value": "无数据"
      },
      "preloader": {
        "value": "预加载器"
      },
      "checkAll": {
        "value": "全部选中"
      },
      "checkNone": {
        "value": "全部取消选中"
      },
      "checkSome": {
        "value": "清除选中"
      },
      "close": {
        "value": "关闭"
      },
      "recentPages": {
        "value": "显示/隐藏历史记录"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "选择文件..."
      },
      "chooseDir": {
        "value": "选择目录..."
      }
    },
    "labels": {
      "info": {
        "value": "信息"
      },
      "warn": {
        "value": "警告"
      },
      "error": {
        "value": "错误"
      }
    },
    "placeholders": {
      "search": {
        "value": "搜索"
      }
    },
    "title": {
      "incorrectFileContent": {
        "value": "检测到不正确内容"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}'' 包含 JSON，但不是 {1} 的 JSON 表示形式！"
      },
      "dataCopiedToClipboard": {
        "summary": "数据已复制到剪贴板！"
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "数据未复制到剪贴板，因为所选单元格为空！"
      },
      "emptyRowData": {
        "detail": "数据未复制到剪贴板，因为所选行为空！"
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "将单元格复制到剪贴板"
        },
        "row": {
          "label": "将行复制到剪贴板"
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
        "summary": "更改已成功保存到 ''{0}'' 文件！"
      },
      "changesNotSaved": {
        "summary": "无法将更改保存到 ''{0}'' 文件！"
      },
      "changesDownloaded": {
        "summary": "更改已成功下载到 ''{0}'' 文件！"
      },
      "changesNotDownloaded": {
        "summary": "无法将更改下载到 ''{0}'' 文件！"
      },
      "verifyPathEntered": {
        "detail": ". 将 {0} 字段设置为 false 将接受输入的值，而不验证该值是否作为本地文件或目录存在。"
      }
    },
    "wdtOptionsDialog": {
      "title": "编辑：{0}",
      "default": "取消设置值",
      "instructions": "输入要添加到可选项目列表的令牌。",
      "enterValue": "输入值",
      "selectValue": "选择值",
      "selectSwitch": "切换值",
      "enterUnresolvedReference": "输入未解析的引用",
      "enterModelToken": "输入模型令牌",
      "selectPropsVariable": "选择模型令牌变量",
      "createPropsVariable": "创建模型令牌变量",
      "propName": "变量名（必需）",
      "propValue": "变量值",
      "enterVariable": "输入变量",
      "variableName": "变量名（必需）",
      "variableValue": "变量值",
      "multiSelectUnset": "从可用项目列表中选择值"
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "检测到未保存的更改"
      },
      "changesNeedDownloading": {
        "value": "未下载更改"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "所有未保存的更改都将丢失。是否继续？"
        },
        "areYouSure": {
          "value": "是否确实要 {0} 而不保存所做的更改？"
        },
        "saveBeforeExiting": {
          "value": "退出前是否要保存更改？"
        },
        "needDownloading": {
          "value": "您对 ''{0}'' 所做更改尚未下载到文件。<br/><br/>先进行下载再继续？"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "您的新 ''{0}'' 实例尚未添加到 WDT 模型中。<br/><br/>先进行添加再继续？"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "设置自动重新加载间隔",
      "instructions": "您希望自动重新加载间隔是多少秒？",
      "fields": {
        "interval": {
          "label": "自动重新加载间隔："
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "消息",
          "detail": "当尝试执行 ''{1}'' 操作时，控制台后端调用生成了 ''{0}'' 响应"
        },
        "actionNotPerformed": {
          "detail": "无法对一个或多个选中的项目执行 ''{0}'' 操作"
        },
        "actionSucceeded": {
          "summary": "已成功执行 ''{0}'' 操作！"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "无法确定确切原因。请查看 JavaScript 控制台中的提示。"
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "操作确认",
        "prompt": "无法撤消 ''{0}'' 操作！<br/><br/>是否继续？"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "可用",
        "chosen": "所选"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "属性名称",
        "value": "属性值"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "属性名称",
        "valueHeader": "属性值",
        "addButtonTooltip": "添加",
        "deleteButtonTooltip": "删除"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "查看 {0}..."
          },
          "create": {
            "label": "创建新{0}..."
          },
          "edit": {
            "label": "编辑 {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "还原为默认值"
    },
    "placeholder": {
      "value": "默认值"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}'' 不可用。"
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
        "value": "服务器状态"
      },
      "systemStatus": {
        "value": "系统状态"
      },
      "healthState": {
        "failed": {
          "value": "失败"
        },
        "critical": {
          "value": "严重"
        },
        "overloaded": {
          "value": "超载"
        },
        "warning": {
          "value": "警告"
        },
        "ok": {
          "value": "正常"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "截至以下时间正在运行的服务器的健康状况:"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "名称"
        },
        "state": {
          "value": "状态"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "当前无法访问后端。"
      },
      "connectionMessage": {
        "summary": "连接消息"
      },
      "connectFailed": {
        "detail": "尝试失败："
      },
      "badRequest": {
        "detail": "无法处理提交的文件或请求"
      },
      "invalidCredentials": {
        "detail": "WebLogic 域身份证明无效"
      },
      "invalidUrl": {
        "detail": "无法访问 WebLogic 域 URL"
      },
      "notInRole": {
        "detail": "尝试失败：用户不是管理员、部署人员、操作员或监视人员"
      },
      "notSupported": {
        "detail": "不支持 WebLogic 域"
      },
      "unexpectedStatus": {
        "detail": "意外的结果（状态：{0}）"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "请求未成功",
          "detail": "从控制台后端调用返回了不成功的响应。"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "请查看远程控制台终端或 Javascript 控制台以了解具体原因。"
      },
      "responseMessages": {
        "summary": "响应消息"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "无法访问更改管理器！"
      },
      "changesCommitted": {
        "summary": "已成功提交更改！"
      },
      "changesNotCommitted": {
        "summary": "无法提交更改！"
      },
      "changesDiscarded": {
        "summary": "已成功放弃更改！"
      },
      "changesNotDiscarded": {
        "summary": "无法放弃更改！"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "意外的错误响应"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "连接问题",
        "details": "从提供程序发送和接收数据出现问题！请确保提供程序可访问，然后重试。"
      },
      "pathNotFound": {
        "summary": "找不到路径",
        "details": "''{0}'' 是在本地文件系统上不可访问的文件或目录。"
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "清除消息"
        },
        "suppress": {
          "info": {
            "label": "隐藏信息消息"
          },
          "warning": {
            "label": "隐藏警告消息"
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
          "value": "查看预警"
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