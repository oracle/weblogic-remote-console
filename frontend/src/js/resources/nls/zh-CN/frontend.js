define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic 远程控制台"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "联机"
        },
        "offline": {
          "tooltip": "脱机"
        },
        "detached": {
          "tooltip": "已分离"
        },
        "unattached": {
          "tooltip": "未附加"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "版权所有 © 2020，2022，Oracle 和/或其关联公司。<br/>Oracle 是 Oracle Corporation 和/或其关联公司的注册商标。其他名称可能是各自所有者的商标。<br/>",
      "builtWith": "使用 Oracle JET 构建"
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
        "tooltip": "Deactivate"
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
          "version": {
            "label": "域版本："
          },
          "username": {
            "label": "用户名："
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
        "fileNotSet": "未设置"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "使用稀疏模板"
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
        "tooltip": "Security Data Tree"
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
  "wrc-content-area-header": {
    "title": {
      "home": "主页",
      "configuration": "编辑树",
      "view": "配置视图树",
      "monitoring": "监视树",
      "security": "Security Data Tree",
      "modeling": "WDT 模型",
      "composite": "WDT 组合模型",
      "properties": "属性列表"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "主页"
        },
        "preferences": {
          "label": "首选项"
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
          "label": "提供程序管理"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "信息终端"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "历史记录"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除历史记录"
        }
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "历史记录"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除历史记录"
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
          "label": "库"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "编辑树",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "配置视图树",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "监视树",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "WDT 模型树",
        "description": "<p>维护与 WebLogic Deploy Tooling 工具关联的模型文件。</p>"
      },
      "composite": {
        "label": "WDT 组合模型树",
        "description": "<p>查看当前正在使用的 WebLogic 部署工具模型文件的组合集。</p>"
      },
      "properties": {
        "label": "属性列表编辑器",
        "description": "<p>查看或修改属性列表文件中的一组属性。</p>"
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
    "labels": {
      "start": {
        "value": "启动"
      },
      "resume": {
        "value": "恢复"
      },
      "suspend": {
        "value": "挂起"
      },
      "shutdown": {
        "value": "关闭"
      },
      "restartSSL": {
        "value": "重新启动 SSL"
      },
      "stop": {
        "value": "停止"
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
        "value": "Reload the table to view the current {0} values"
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
        "shoppingcart": "Changes were added to cart!",
        "customView": "Changes were saved!"
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
  "wrc-common": {
    "buttons": {
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
      "default": "默认值。（取消设置）",
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
      "multiSelectUnset": "\"默认值。（从可用项列表中选择）\""
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
          "value": "是否确实要退出而不保存更改？"
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
          "detail": "当尝试对 ''{1}'' 执行指定操作时，控制台后端调用生成了 ''{0}'' 响应。"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "无法确定确切原因。请查看 JavaScript 控制台中的提示。"
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
        "detail": "WebLogic 域身份证明无效 "
      },
      "invalidUrl": {
        "detail": "无法访问 WebLogic 域 URL "
      },
      "notInRole": {
        "detail": "尝试失败：用户不是管理员、部署人员、操作员或监视人员"
      },
      "notSupported": {
        "detail": "不支持 WebLogic 域 "
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
      }
    }
  }
});