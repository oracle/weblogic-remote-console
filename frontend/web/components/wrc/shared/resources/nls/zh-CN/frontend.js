define({
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "prompt": "无法撤消 '{0}' 操作！<br/><br/>是否继续？",
        "title": "操作确认"
      }
    }
  },
  "wrc-alerts": {
    "menus": {
      "alerts": {
        "error": {
          "value": "存在 {0} 个高优先级错误预警"
        },
        "info": {
          "value": "存在 {0} 个高优先级信息预警"
        },
        "view": {
          "value": "查看预警"
        },
        "warning": {
          "value": "存在 {0} 个高优先级警告预警"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "popups": {
      "tips": {
        "checkboxes": {
          "accessibility": "显示可访问性提示",
          "connectivity": "显示连接提示",
          "hideall": "隐藏所有提示",
          "other": "显示其他提示",
          "personalization": "显示个性化提示",
          "productivity": "显示工作效率提示",
          "security": "显示安全提示",
          "whereis": "显示“...在哪里”提示"
        },
        "title": "筛选器提示"
      }
    },
    "tabstrip": {
      "tabs": {
        "dashboards": {
          "label": "仪表盘"
        },
        "projectmanagement": {
          "label": "提供程序"
        },
        "shoppingcart": {
          "label": "购物车"
        },
        "tips": {
          "label": "用户提示"
        }
      }
    },
    "tips": {
      "cards": {
        "tip0": {
          "descriptionHTML": "<p>在控制台顶部的搜索字段中输入搜索词，以梳理当前透视图中的匹配项。您还可以在<b>最近搜索</b>节点中重新访问以前的查询。</p>",
          "title": "搜索域中的所有 MBean！"
        },
        "tip1": {
          "descriptionHTML": "<p>通过仪表盘，可以定义定制标准，将其与您的域进行匹配，并根据域生成全面且准确的报告。</p><p>要开始使用，请打开<b>监视树</b>中的任何节点，然后单击<b>新建仪表盘</b>。或者，打开<b>仪表盘</b>顶级节点查看内置仪表盘。</p>",
          "title": "快速筛选并找到对您重要的数据！"
        },
        "tip10": {
          "descriptionHTML": "<p>“安全提示 1”的简要说明。换行符不是 HTML 元素，因此不需要在此说明中使用换行符。</p>",
          "title": "安全提示 1"
        },
        "tip11": {
          "descriptionHTML": "<p>使用键盘快捷方式直接跳转到特定的 UI 组件。</p><p>前 5 个：</p><li><code><b>Alt+P</b></code> - 打开<b>提供程序</b>抽屉。</li><li><code><b>Alt+C</b></code> - 将焦点移动到<b>购物车</b>。</li><li><code><b>Alt+T</b></code> - 将焦点移动到表中的第一列标题。</li><li><code><b>Alt+|</b></code> - 将焦点移动到导航树宽度调整大小工具。使用方向键更改树的宽度。</li><li><code><b>Alt+;</b></code> - 将焦点移动到第一个可单击的面包屑标签。</li></ul><p>有关键盘快捷方式的完整列表，请参阅文档。</p>",
          "title": "加快您的工作流！"
        },
        "tip2": {
          "descriptionHTML": "<p>通过隐藏不相关的列来简化表，以便可以专注于对您重要的数据。</p><p>在任何表上方，单击<b>定制表</b>，然后根据需要选择或取消选择列。</p>",
          "title": "细化表内容"
        },
        "tip3": {
          "descriptionHTML": "<p></p>",
          "title": "使用键盘处理表和操作"
        },
        "tip4": {
          "descriptionHTML": "<p>“定制此表”链接现在变为<i>定制表</i>按钮。</p>",
          "title": "“定制此表”链接在哪里？"
        },
        "tip5": {
          "descriptionHTML": "<p>打开购物车，查看已保存到域但尚未提交的更改列表。</p><p>如果您在购物车中看不到<b>查看更改</b>，请尝试<a href='#' tabindex='0' on-click data-url='@@docsURL@@/set-console/#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591'>安装 WebLogic Remote Console 扩展</a>。",
          "title": "复查暂挂更改"
        },
        "tip6": {
          "descriptionHTML": "<ul><li>将光标悬停在工具提示字段旁边的 <b>?</b> 上。</li><li>单击页级别的 <b>?</b> 获取每个可见属性的详细帮助信息。</li><li>在<b>帮助</b>菜单上，单击<b>访问 WebLogic Remote Console GitHub 项目</b>。</li><li>加入我们的 Slack 渠道：<a href='#' tabindex='0' on-click data-url='https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ'>#remote-console</a>。</li><li>访问我们的文档，网址为 <a href='#' tabindex='0' on-click data-url='@@docsURL@@/'></a>。</li></ul>",
          "title": "需要帮助?"
        },
        "tip7": {
          "descriptionHTML": "<p>“其他提示 1”的简要说明。换行符不是 HTML 元素，因此不需要在此说明中使用换行符。</p>",
          "title": "其他提示 1"
        },
        "tip8": {
          "descriptionHTML": "<p>在<b>监视树</b> > <b>环境</b> > <b>服务器</b>下，选择无响应的服务器并打开其<b>故障排除</b>选项卡，尝试诊断问题。</p><p>如果您根本无法连接到域，请参阅 WebLogic Remote Console 文档中的<a href='#' tabindex='0' on-click data-url='@@docsURL@@/troubleshoot-weblogic-remote-console/#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE'>无法连接到管理服务器</a>以获取故障排除帮助。</p>",
          "title": "连接到服务器时出现问题？"
        },
        "tip9": {
          "descriptionHTML": "<p>“连接提示 2”的简要说明。换行符不是 HTML 元素，因此不需要在此说明中使用换行符。</p>",
          "title": "连接提示 2"
        }
      },
      "labels": {
        "accessibility": {
          "value": "可访问性"
        },
        "connectivity": {
          "value": "连接"
        },
        "hideall": {
          "value": "全部隐藏"
        },
        "other": {
          "value": "其他"
        },
        "personalization": {
          "value": "个性化"
        },
        "productivity": {
          "value": "工作效率"
        },
        "security": {
          "value": "安全"
        },
        "whereis": {
          "value": "...在哪里"
        }
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
      "changesDiscarded": {
        "summary": "已成功放弃更改！"
      },
      "changesNotCommitted": {
        "summary": "无法提交更改！"
      },
      "changesNotDiscarded": {
        "summary": "无法放弃更改！"
      }
    }
  },
  "wrc-common": {
    "ariaLabel": {
      "icons": {
        "landing": {
          "value": "返回到提供程序树的登录页。"
        },
        "reset": {
          "value": "刷新页面值"
        }
      }
    },
    "buttons": {
      "action": {
        "label": "操作"
      },
      "add": {
        "label": "添加/发送"
      },
      "apply": {
        "label": "应用"
      },
      "cancel": {
        "label": "取消"
      },
      "choose": {
        "label": "选择"
      },
      "clear": {
        "label": "清除"
      },
      "close": {
        "label": "关闭"
      },
      "connect": {
        "label": "连接"
      },
      "done": {
        "label": "完成"
      },
      "edit": {
        "label": "编辑/发送"
      },
      "export": {
        "label": "导出"
      },
      "finish": {
        "label": "完成"
      },
      "import": {
        "label": "导入"
      },
      "next": {
        "label": "下一步"
      },
      "no": {
        "label": "不"
      },
      "ok": {
        "label": "好的"
      },
      "previous": {
        "label": "上一个"
      },
      "reset": {
        "label": "重置"
      },
      "restart": {
        "label": "重新启动"
      },
      "savenow": {
        "label": "立即保存"
      },
      "write": {
        "label": "下载文件"
      },
      "yes": {
        "label": "是"
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
        "tableAsJSON": {
          "label": "将表复制到剪贴板 (JSON)"
        },
        "tableAsText": {
          "label": "将表复制到剪贴板（文本）"
        },
        "tableAsYAML": {
          "label": "将表复制到剪贴板 (YAML)"
        }
      }
    },
    "labels": {
      "alerts": {
        "value": "预警"
      },
      "error": {
        "value": "错误"
      },
      "info": {
        "value": "信息"
      },
      "pagesBookmark": {
        "notreachable": {
          "value": "给定当前提供程序，此页不可用。"
        },
        "value": "以下是为 {0} 提供程序类型添加书签的页面。单击行中的任何列以导航到关联页。"
      },
      "pagesHistory": {
        "value": "以下是自选择当前提供程序以来访问的页面。单击行中的任何列以导航到关联页。"
      },
      "warn": {
        "value": "警告"
      }
    },
    "menu": {
      "chooseDir": {
        "value": "选择目录..."
      },
      "chooseFile": {
        "value": "选择文件..."
      }
    },
    "messages": {
      "browserPermissionDenied": {
        "detail": "为了执行此操作，您需要启用从 JavaScript 向剪贴板写入。此外，只有通过 HTTPS 提供的页才支持剪贴板 API。",
        "summary": "浏览器权限被拒绝"
      },
      "dataCopiedToClipboard": {
        "detail": "数据已复制到剪贴板！"
      },
      "emptyCellData": {
        "detail": "数据未复制到剪贴板，因为所选单元格为空！"
      },
      "emptyRowData": {
        "detail": "数据未复制到剪贴板，因为所选行为空！"
      },
      "incorrectFileContent": {
        "detail": "'{0}' 包含 JSON，但不是 {1} 的 JSON 表示形式！"
      },
      "tableCopiedToClipboard": {
        "summary": "表已成功复制到剪贴板！"
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
    "tooltips": {
      "checkAll": {
        "value": "全部选中"
      },
      "checkNone": {
        "value": "全部取消选中"
      },
      "checkSome": {
        "value": "清除选中"
      },
      "choose": {
        "value": "选择文件"
      },
      "clear": {
        "value": "清除所选文件"
      },
      "close": {
        "value": "关闭"
      },
      "collapse": {
        "value": "折叠"
      },
      "delete": {
        "value": "删除"
      },
      "download": {
        "value": "浏览"
      },
      "expand": {
        "value": "展开"
      },
      "filter": {
        "value": "筛选器"
      },
      "more": {
        "value": "更多操作"
      },
      "noData": {
        "value": "无数据"
      },
      "pageInfo": {
        "value": "单击以固定和取消固定"
      },
      "pagesHistory": {
        "back": {
          "value": "上一页"
        },
        "launch": {
          "value": "显示页历史记录"
        },
        "next": {
          "value": "下一页"
        },
        "star": {
          "value": "页书签"
        }
      },
      "pick": {
        "value": "选取目录"
      },
      "preloader": {
        "value": "预加载程序"
      },
      "recentPages": {
        "value": "显示/隐藏历史记录"
      },
      "reload": {
        "value": "重新加载文件"
      },
      "remove": {
        "value": "删除"
      },
      "reset": {
        "value": "重置"
      },
      "submit": {
        "value": "提交更改"
      },
      "write": {
        "value": "下载文件"
      }
    }
  },
  "wrc-confirm-dialogs": {
    "adminServerShutdown": {
      "prompt": {
        "value": "关闭 <b>{0}</b> 将重置当前提供程序。是否继续？"
      },
      "title": {
        "value": "确认"
      }
    }
  },
  "wrc-connectivity": {
    "icons": {
      "insecure": {
        "tooltip": "管理服务器连接不安全"
      }
    },
    "labels": {
      "insecure": {
        "value": "不安全"
      }
    }
  },
  "wrc-content-area-header": {
    "ariaLabel": {
      "button": {
        "home": {
          "value": "主页。返回到包含提供程序树的卡的页面"
        }
      },
      "popup": {
        "provider": {
          "value": "提供程序操作"
        }
      },
      "region": {
        "title": {
          "value": "内容区域标题"
        }
      }
    },
    "icons": {
      "shoppingcart": {
        "tooltip": "单击以查看购物车操作"
      }
    },
    "menu": {
      "shoppingcart": {
        "commit": {
          "label": "提交更改"
        },
        "discard": {
          "label": "放弃更改"
        },
        "view": {
          "label": "查看更改..."
        }
      }
    },
    "title": {
      "compositeConfig": "WDT 组合模型",
      "domainRuntime": "监视树",
      "edit": "编辑树",
      "home": "主页",
      "model": "WDT 模型",
      "propertyList": "属性列表",
      "securityData": "安全数据树",
      "serverConfig": "配置视图树"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "主页"
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "detail": "{0} 字段是必填字段，但是尚未提供任何值（或提供的值无效）。",
        "summary": "必填字段不完整"
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "当前无法访问后端。"
      },
      "badRequest": {
        "detail": "无法处理提交的文件或请求"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "detail": "从控制台后端调用返回了不成功的响应。",
          "summary": "请求未成功"
        }
      },
      "connectFailed": {
        "detail": "尝试失败："
      },
      "connectionMessage": {
        "summary": "连接消息"
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
      }
    }
  },
  "wrc-data-providers": {
    "checkboxes": {
      "insecure": {
        "label": "建立不安全的连接"
      },
      "useSparseTemplate": {
        "label": "使用稀疏模板"
      },
      "usesso": {
        "label": "使用 Web 验证"
      }
    },
    "icons": {
      "deactivate": {
        "tooltip": "停用此提供程序"
      },
      "delete": {
        "tooltip": "删除此提供程序"
      },
      "edit": {
        "tooltip": "管理此提供程序的设置"
      },
      "hoverMenu": {
        "ariaLabel": {
          "value": "提供程序操作"
        }
      },
      "info": {
        "tooltip": "获取有关此提供程序的信息"
      }
    },
    "instructions": {
      "composite": {
        "add": {
          "value": "输入新名称，并为组合模型提供程序选择经过排序的模型列表。"
        },
        "edit": {
          "value": "修改组合模型提供程序的设置。使用经过排序的模型列表。"
        }
      },
      "connections": {
        "add": {
          "value": "输入连接提供程序的新名称和连接设置。"
        },
        "deactivate": {
          "value": "停用连接提供程序并停止域状态轮询。"
        },
        "edit": {
          "value": "修改连接提供程序的连接设置。"
        }
      },
      "models": {
        "add": {
          "value": "输入现有模型文件提供程序的设置。单击上载图标以浏览模型文件。"
        },
        "edit": {
          "value": "修改模型文件提供程序的设置。单击用于浏览模型文件的图标。"
        },
        "new": {
          "value": "输入新 WDT 模型文件的提供程序名称和文件名，然后单击用于选取文件保存目录的图标。"
        }
      },
      "project-busy": {
        "value": "在对项目的任何部分进行更改之前，请保存或放弃未保存的更改"
      },
      "project": {
        "export": {
          "value": "输入新项目的设置。"
        },
        "import": {
          "value": "单击下载图标以浏览项目。"
        }
      },
      "proplist": {
        "add": {
          "value": "输入现有模型列表提供程序的设置。单击上载图标以浏览属性文件。"
        },
        "edit": {
          "value": "修改属性列表提供程序的设置。单击用于浏览属性文件的图标。"
        },
        "new": {
          "value": "输入新属性列表的提供程序名称和文件名，然后单击用于选取文件保存目录的图标。"
        }
      },
      "task": {
        "startup": {
          "value": "您希望执行哪个启动任务？"
        }
      }
    },
    "labels": {
      "composite": {
        "name": {
          "value": "WDT 组合模型提供程序名称"
        },
        "providers": {
          "value": "WDT 模型"
        }
      },
      "connections": {
        "header": {
          "value": "未命名项目"
        },
        "name": {
          "value": "连接提供程序名称"
        },
        "password": {
          "value": "密码"
        },
        "proxyOverride": {
          "value": "代理覆盖"
        },
        "username": {
          "value": "用户名"
        }
      },
      "dropdown": {
        "none": {
          "value": "无"
        }
      },
      "models": {
        "file": {
          "value": "WDT 模型文件名"
        },
        "name": {
          "value": "WDT 模型提供程序名称"
        },
        "props": {
          "value": "WDT 变量"
        }
      },
      "project": {
        "file": {
          "value": "项目文件名"
        },
        "name": {
          "value": "项目名称"
        }
      },
      "proplist": {
        "file": {
          "value": "属性列表文件名"
        },
        "name": {
          "value": "属性列表提供程序名称"
        }
      },
      "provider": {
        "adminserver": {
          "value": "管理服务器连接"
        },
        "model": {
          "value": "添加 WDT 模型"
        }
      }
    },
    "menus": {
      "composite": {
        "add": {
          "value": "添加 WDT 组合模型文件提供程序"
        }
      },
      "connections": {
        "add": {
          "value": "添加管理服务器连接提供程序"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "域 URL："
              },
              "username": {
                "label": "用户名："
              },
              "version": {
                "label": "域版本："
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
      "models": {
        "add": {
          "value": "添加 WDT 模型文件提供程序"
        },
        "new": {
          "value": "为新 WDT 模型文件创建提供程序"
        }
      },
      "project": {
        "export": {
          "value": "将提供程序作为项目导出..."
        },
        "import": {
          "value": "导入项目"
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
      }
    },
    "messages": {
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>在文件名字段中编辑路径，然后单击“确定”按钮。或者，单击上载图标并选择其他文件。</p>"
        },
        "fixModelFile": {
          "detail": "<p>修复下面引用的问题，然后单击“确定”按钮。或者，选择其他文件。</p>"
        },
        "wktModelContent": {
          "detail": "使用<i>代码视图</i>选项卡上的模型编辑器来解决问题。",
          "summary": "模型内容问题"
        },
        "yamlException": {
          "detail": "{0} 位于第 {1} 行，第 {2} 列"
        }
      },
      "export": {
        "failed": {
          "detail": "无法将提供程序作为 '{0}' 项目导出。",
          "summary": "导出未成功"
        }
      },
      "import": {
        "failed": {
          "detail": "无法导入 '{0}' 项目文件。",
          "summary": "保存未成功"
        }
      },
      "response": {
        "modelsNotFound": {
          "detail": "找不到所配置的 WDT 模型 '{0}'"
        },
        "nameAlreadyExist": {
          "detail": "此项目中已存在名为 '{0}' 的提供程序！"
        },
        "propListNotFound": {
          "detail": "找不到 WDT 变量 '{0}'"
        },
        "selectModels": {
          "detail": "要选择 WDT 组合，请首先选择 WDT 组合使用的所有 WDT 模型。"
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "该 URL 必须指定 HTTPS 协议或者使用 localhost"
        }
      },
      "stage": {
        "failed": {
          "detail": "无法创建 '{0}' 提供程序项。",
          "summary": "创建未成功"
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
      "use": {
        "failed": {
          "detail": "无法使用 '{0}' 提供程序项。",
          "summary": "连接未成功"
        }
      }
    },
    "popups": {
      "info": {
        "composite": {
          "models": {
            "label": "模型："
          }
        },
        "domain": {
          "anyAttempt": {
            "label": "尝试的任何连接："
          },
          "connectTimeout": {
            "label": "连接超时："
          },
          "consoleExtensionVersion": {
            "label": "控制台扩展版本："
          },
          "insecure": {
            "label": "不安全："
          },
          "lastAttempt": {
            "label": "上次成功尝试："
          },
          "name": {
            "label": "域名:"
          },
          "proxyOverride": {
            "label": "代理覆盖："
          },
          "readTimeout": {
            "label": "读取超时:"
          },
          "roles": {
            "label": "角色："
          },
          "sso": {
            "label": "Web 验证："
          },
          "url": {
            "label": "域 URL："
          },
          "username": {
            "label": "用户名："
          },
          "version": {
            "label": "域版本："
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
        "project": {
          "name": {
            "label": "项目名称："
          }
        },
        "proplist": {
          "file": {
            "label": "文件名："
          }
        },
        "provider": {
          "id": {
            "label": "提供程序 ID："
          }
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
    "titles": {
      "add": {
        "composite": {
          "value": "为新 WDT 组合模型创建提供程序"
        },
        "connections": {
          "value": "为管理服务器连接创建提供程序"
        },
        "models": {
          "value": "为现有 WDT 模型文件创建提供程序"
        },
        "proplist": {
          "value": "为现有属性列表创建提供程序"
        }
      },
      "edit": {
        "composite": {
          "value": "编辑 WDT 组合模型提供程序"
        },
        "connections": {
          "value": "编辑管理服务器连接提供程序"
        },
        "models": {
          "value": "编辑 WDT 模型文件提供程序"
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
      "new": {
        "models": {
          "value": "为新 WDT 模型文件创建提供程序"
        },
        "proplist": {
          "value": "为新属性列表创建提供程序"
        }
      },
      "project-busy": {
        "value": "项目繁忙"
      },
      "startup": {
        "task": {
          "value": "启动任务"
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
      "cannotConnect": {
        "detail": "无法连接到 WebLogic 域 {0}，请检查 WebLogic 是否在运行。",
        "summary": "尝试连接失败"
      },
      "lostConnection": {
        "detail": "连接丢失。请刷新。",
        "summary": "连接丢失"
      }
    }
  },
  "wrc-footer": {
    "text": {
      "builtWith": "使用 Oracle JET 构建",
      "copyrightLegal": "版权所有 (c) 2020，2026，Oracle 和/或其关联公司。<br/>Oracle (r)、Java、MySQL 和 NetSuite 是 Oracle 和/或其关联公司的注册商标。其他名称可能是各自所有者的商标。<br/>"
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "back": {
        "label": "上一步"
      },
      "cancel": {
        "label": "取消"
      },
      "customize": {
        "label": "定制表"
      },
      "dashboard": {
        "label": "新建仪表盘"
      },
      "delete": {
        "label": "删除"
      },
      "finish": {
        "label": "创建"
      },
      "forward": {
        "label": "转发"
      },
      "new": {
        "label": "创建"
      },
      "save": {
        "label": "保存"
      },
      "savenow": {
        "label": "立即保存"
      },
      "write": {
        "label": "下载文件"
      }
    },
    "icons": {
      "create": {
        "tooltip": "创建"
      },
      "help": {
        "tooltip": "显示/隐藏帮助页"
      },
      "history": {
        "tooltip": "显示/隐藏历史记录"
      },
      "instructions": {
        "tooltip": "显示/隐藏说明"
      },
      "landing": {
        "tooltip": "登录页"
      },
      "save": {
        "tooltip": "保存"
      },
      "sync": {
        "tooltip": "重新加载",
        "tooltipOn": "停止自动重新加载"
      },
      "syncInterval": {
        "tooltip": "设置自动重新加载间隔"
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "显示高级字段"
      }
    },
    "icons": {
      "restart": {
        "tooltip": "需要重新启动服务器或应用程序"
      },
      "wdtIcon": {
        "tooltip": "字段设置"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "单击 {0} 图标以在概要和详细帮助信息之间切换。"
      }
    },
    "messages": {
      "action": {
        "notAllowed": {
          "detail": "在创建操作期间，无法执行请求的操作。单击“取消”按钮可取消创建操作。",
          "summary": "不允许操作"
        }
      },
      "savedTo": {
        "generic": "已保存更改！",
        "notSaved": "由于未检测到任何更改，未保存任何内容。",
        "shoppingcart": "更改已添加到购物车！"
      }
    }
  },
  "wrc-header": {
    "buttons": {
      "logout": {
        "label": "注销"
      }
    },
    "icons": {
      "help": {
        "tooltip": "打开 WebLogic Remote Console 内部文档"
      },
      "howDoI": {
        "tooltip": "打开“如何操作...？”任务"
      },
      "navtree": {
        "toggler": {
          "tooltip": "显示/隐藏导航树"
        }
      },
      "theme": {
        "tooltip": "切换主题"
      },
      "tips": {
        "tooltip": "显示/隐藏用户提示"
      },
      "whatsNew": {
        "tooltip": "新增功能！"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "打开消息中心"
      },
      "theme": {
        "dark": {
          "value": "深色"
        },
        "light": {
          "value": "浅色"
        }
      }
    },
    "region": {
      "ariaLabel": {
        "value": "应用程序标头"
      }
    },
    "tooltips": {
      "appName": {
        "value": "单击以重置 WebLogic Remote Console"
      }
    }
  },
  "wrc-help-form": {
    "labels": {
      "relatedTopics": {
        "value": "<b>相关主题：</b>"
      }
    },
    "tables": {
      "help": {
        "columns": {
          "header": {
            "description": "说明",
            "name": "名称"
          }
        },
        "label": "帮助表"
      }
    },
    "tabs": {
      "actions": {
        "label": "操作"
      },
      "attributes": {
        "label": "属性"
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "startup-tasks": {
          "label": "启动任务"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "responseMessages": {
        "summary": "响应消息"
      },
      "seeJavascriptConsole": {
        "detail": "请查看远程控制台终端或 Javascript 控制台以了解具体原因。"
      }
    }
  },
  "wrc-message-line": {
    "ariaLabel": {
      "region": {
        "value": "消息行"
      }
    },
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
    },
    "messages": {
      "adminServerShutdown": {
        "details": "无法连接到 WebLogic 域的管理服务器。"
      },
      "shutdownSequenceError": {
        "details": "关闭托管服务器，然后关闭管理服务器。"
      }
    }
  },
  "wrc-navigation": {
    "ariaLabel": {
      "navstrip": {
        "value": "提供程序树菜单"
      },
      "navtree": {
        "value": "提供程序树导航器"
      },
      "panelResizer": {
        "value": "提供程序树导航器调整大小工具。使用向左箭头键和向右箭头键调整导航器大小"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "compositeConfig": {
        "tooltip": "WDT 组合模型"
      },
      "domainRuntime": {
        "tooltip": "监视树"
      },
      "edit": {
        "tooltip": "编辑树"
      },
      "model": {
        "tooltip": "WDT 模型"
      },
      "propertyList": {
        "tooltip": "属性列表编辑器"
      },
      "securityData": {
        "tooltip": "安全数据树"
      },
      "serverConfig": {
        "tooltip": "配置视图树"
      }
    }
  },
  "wrc-navtree-toolbar": {
    "menu": {
      "collapseAll": {
        "value": "全部折叠"
      },
      "useTreeMenusAsRootNodes": {
        "value": "使用树菜单作为根节点"
      }
    }
  },
  "wrc-navtree": {
    "labels": {
      "root": "根",
      "showless": "显示更少",
      "showmore": "显示全部（另外 {0} 个）"
    }
  },
  "wrc-pages-bookmark": {
    "labels": {
      "ariaLabel": {
        "value": "页书签"
      }
    },
    "menus": {
      "bookmark": {
        "add": {
          "label": "添加书签"
        },
        "remove": {
          "label": "删除书签"
        },
        "show": {
          "label": "显示页书签..."
        }
      }
    },
    "messages": {
      "pageAlreadyBookmarked": {
        "summary": "此页已有书签！"
      },
      "pagesBookmarkAdded": {
        "summary": "当前页已成功添加书签！"
      }
    }
  },
  "wrc-pdj-actions": {
    "labels": {
      "cannotDetermineExactCause": {
        "value": "无法确定确切原因。请查看 JavaScript 控制台中的提示。"
      }
    },
    "messages": {
      "action": {
        "actionNotPerformed": {
          "detail": "无法对一个或多个选中的项目执行 '{0}' 操作"
        },
        "actionNotPerformedNoRow": {
          "detail": "无法执行 '{0}' 操作"
        },
        "actionSucceeded": {
          "summary": "已成功执行 '{0}' 操作！"
        },
        "unableToPerform": {
          "detail": "当尝试执行 '{1}' 操作时，控制台后端调用生成了 '{0}' 响应",
          "summary": "消息"
        }
      }
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "'{0}' 不可用。"
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
        "addButtonTooltip": "添加",
        "deleteButtonTooltip": "删除",
        "nameHeader": "属性名称",
        "valueHeader": "属性值"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "create": {
            "label": "创建新{0}..."
          },
          "edit": {
            "label": "编辑 {0}..."
          },
          "view": {
            "label": "查看 {0}..."
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
  "wrc-perspective": {
    "ariaLabel": {
      "region": {
        "breadcrumbs": {
          "value": "面包屑"
        }
      }
    },
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
          "label": "清除历史记录条目",
          "value": "清除历史记录条目"
        }
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "combination": {
        "value": "组合"
      },
      "dateTime": {
        "value": "格式：yyyy-MM-dd [HH:mm:ss [AM|PM]]（例如 2022-02-14 09:00:00 AM）"
      },
      "gmtOffset": {
        "value": "格式：GMT+|-h:mm（例如 GMT-5:00）"
      },
      "monthDay": {
        "value": "范围: -31 到 31"
      },
      "nodata": {
        "DefaultPolicy": {
          "value": "未定义默认安全策略条件。"
        },
        "Policy": {
          "value": "使用 <b>+ 添加条件</b>按钮添加策略条件。"
        }
      },
      "not": {
        "value": "不允许"
      },
      "or": {
        "value": "或者"
      },
      "time": {
        "value": "格式：HH:mm:ss（例如 14:22:47）"
      },
      "weekDay": {
        "value": "例如星期日、星期一、星期二、..."
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "组合",
            "expression": "条件短语",
            "operator": "运算符"
          }
        },
        "dropdowns": {
          "operator": {
            "and": "并且",
            "or": "或者"
          }
        }
      }
    },
    "wizard": {
      "pages": {
        "choosePredicate": {
          "body": {
            "help": {
              "predicateList": "谓词列表是可用于组成安全策略条件的可用谓词的列表。"
            },
            "labels": {
              "predicateList": "谓词列表"
            }
          },
          "header": {
            "instructions": "从下拉列表中为您的新条件选择谓词。",
            "title": "选择谓词"
          }
        },
        "manageArgumentValues": {
          "body": {
            "help": {
              "negate": "将条件转换为具有相反含义（例如，“等于”变为“不等于”，“位于”变为“不位于”）。"
            },
            "labels": {
              "conditionPhrase": "条件短语",
              "negate": "条件求反"
            }
          },
          "header": {
            "instructions": "首先，在<i></i>字段中键入值以添加参数值或搜索现有参数值。按 Enter 键以将键入的值添加到列表中。要编辑现有参数值，请单击它并使用弹出式输入字段进行修改。",
            "title": "组谓词"
          }
        }
      },
      "title": "策略管理"
    }
  },
  "wrc-policy-management": {
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
    "contextMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "在单击的行上面添加条件..."
          },
          "at": {
            "label": "添加新的第一个条件..."
          },
          "below": {
            "label": "在单击的行下面添加条件..."
          }
        }
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>要指定新条件的位置，请在相对条件旁边打勾，然后单击 <b>+添加条件</b>按钮。</p>"
      }
    },
    "menus": {
      "action": {
        "addCondition": {
          "label": "添加条件"
        },
        "combine": {
          "label": "组合"
        },
        "movedown": {
          "label": "下移"
        },
        "moveup": {
          "label": "上移"
        },
        "negate": {
          "label": "求反"
        },
        "remove": {
          "label": "删除"
        },
        "reset": {
          "label": "重置"
        },
        "uncombine": {
          "label": "取消组合"
        }
      }
    },
    "messages": {
      "argumentValueHasWrongFormat": {
        "summary": "'{0}' 字段包含格式不正确的数据！"
      },
      "conditionAlreadyExists": {
        "summary": "此安全策略已具有使用所选谓词构建的条件，或者具有与参数值匹配的条件！"
      },
      "conditionHasNoArgValues": {
        "summary": "所选条件没有可编辑的参数值！"
      },
      "requiredFieldsMissing": {
        "detail": "一个或多个必填字段不包含数据！"
      }
    }
  },
  "wrc-recently-visited": {
    "labels": {
      "ariaLabel": {
        "value": "页历史记录"
      },
      "page": {
        "value": "页面"
      },
      "tab": {
        "value": "选项卡"
      },
      "tree": {
        "value": "树"
      }
    },
    "messages": {
      "pageNoLongerExists": {
        "detail1": "您已重定向到 {0} 页，因为",
        "detail2": "{0} 已被其他用户删除，或不再存在。",
        "summary": "页不再存在"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "commit": {
        "tooltip": "提交更改"
      },
      "discard": {
        "tooltip": "放弃更改"
      }
    },
    "sections": {
      "additions": {
        "label": "添加"
      },
      "changeManager": {
        "label": "更改经理"
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
  "wrc-startup-tasks": {
    "ariaLabel": {
      "cards": {
        "panel": {
          "value": "启动任务"
        }
      }
    },
    "cards": {
      "addAdminServer": {
        "description": "此任务会创建项目资源，该资源可用于连接到管理服务器",
        "label": "添加管理服务器连接提供程序"
      },
      "addPropertyList": {
        "description": "此任务会创建项目资源，该资源可用于管理存储在本地文件系统上的 .properties 文件",
        "label": "添加属性列表提供程序"
      },
      "addWdtComposite": {
        "description": "此任务会创建项目资源，该资源可用于管理本地文件系统上现有的 WDT 模型文件片段",
        "label": "添加 WDT 组合模型文件提供程序"
      },
      "addWdtModel": {
        "description": "此任务会创建项目资源，该资源可用于管理本地文件系统上现有的 WDT 模型文件",
        "label": "添加 WDT 模型文件提供程序"
      },
      "createPropertyList": {
        "description": "此任务会创建项目资源，该资源是存储在本地文件系统中的新 .properties 模型文件",
        "label": "为新属性列表创建提供程序"
      },
      "createWdtModel": {
        "description": "此任务会创建项目资源，该资源是存储在本地文件系统中的新 WDT 模型文件",
        "label": "为新 WDT 模型文件创建提供程序"
      },
      "importProject": {
        "description": "此任务会加载以前导出的项目，该项目包含可立即使用或修改的提供程序",
        "label": "导入项目"
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "fields": {
        "interval": {
          "label": "自动重新加载间隔："
        }
      },
      "instructions": "您希望自动重新加载间隔是多少秒？",
      "title": "设置自动重新加载间隔"
    }
  },
  "wrc-table-customizer": {
    "ariaLabel": {
      "availableColumns": {
        "list": {
          "value": "“可用列”列表"
        },
        "listItem": {
          "value": "“可用列”列表项"
        },
        "title": {
          "value": "可用列"
        }
      },
      "button": {
        "addAllRight": {
          "value": "将“可用列”列表中的所有项移至“选定列”列表"
        },
        "addToRight": {
          "value": "将“可用列”列表中的选中项移至“选定列”列表"
        },
        "apply": {
          "value": "将列定制设置应用于表"
        },
        "cancel": {
          "value": "取消所有列定制设置"
        },
        "removeAll": {
          "value": "将“选定列”列表中的所有项移至“可用列”列表"
        },
        "removeRight": {
          "value": "将“选定列”列表中的选中项移至“可用列”列表"
        },
        "reset": {
          "value": "将“选定列”列表中的列还原为打开表定制器时显示的那些列。"
        }
      },
      "selectedColumns": {
        "list": {
          "value": "“选定列”列表"
        },
        "listItem": {
          "value": "“选定列”列表项"
        },
        "title": {
          "value": "选定列"
        }
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "clone": {
        "label": "克隆"
      },
      "customize": {
        "label": "定制表"
      },
      "delete": {
        "label": "删除"
      },
      "new": {
        "label": "新建"
      }
    },
    "icons": {
      "help": {
        "tooltip": "显示/隐藏帮助页"
      },
      "history": {
        "tooltip": "显示/隐藏历史记录"
      },
      "instructions": {
        "tooltip": "显示/隐藏说明"
      },
      "landing": {
        "tooltip": "登录页"
      },
      "sync": {
        "tooltip": "重新加载",
        "tooltipOn": "停止自动重新加载"
      },
      "syncInterval": {
        "tooltip": "设置自动重新加载间隔"
      }
    },
    "instructions": {
      "selectItems": {
        "value": "选择要执行 '{0}' 操作的项目。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "detail": "无法在运行自动重新加载时执行 '{0}' 操作！请首先单击 '{1}' 图标停止重新加载。",
          "summary": "消息"
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
      "noData": {
        "value": "未找到数据。"
      },
      "reloadHidden": {
        "value": "重新加载表以查看当前的 {0} 个值"
      },
      "totalRows": {
        "value": "总行数: {0}"
      }
    }
  },
  "wrc-unsaved-changes": {
    "prompts": {
      "uncommitedCreate": {
        "abandonForm": {
          "value": "您的新 '{0}' 实例尚未添加到 WDT 模型中。<br/><br/>先进行添加再继续？"
        }
      },
      "unsavedChanges": {
        "areYouSure": {
          "value": "是否确实要 {0} 而不保存所做的更改？"
        },
        "needDownloading": {
          "value": "您对 '{0}' 所做更改尚未下载到文件。<br/><br/>先进行下载再继续？"
        },
        "saveBeforeExiting": {
          "value": "退出前是否要保存更改？"
        },
        "willBeLost": {
          "value": "所有未保存的更改都将丢失。是否继续？"
        }
      }
    },
    "titles": {
      "changesNeedDownloading": {
        "value": "未下载更改"
      },
      "unsavedChanges": {
        "value": "检测到未保存的更改"
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
        "details": "从提供程序发送和接收数据时出现问题！请确保提供程序可访问，然后再继续操作。",
        "summary": "连接问题"
      },
      "pathNotFound": {
        "details": "'{0}' 是在本地文件系统上不可访问的文件或目录。",
        "summary": "找不到路径"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesDownloaded": {
        "summary": "更改已成功下载到 '{0}' 文件！"
      },
      "changesNotDownloaded": {
        "summary": "无法将更改下载到 '{0}' 文件！"
      },
      "changesNotSaved": {
        "summary": "无法将更改保存到 '{0}' 文件！"
      },
      "changesSaved": {
        "summary": "更改已成功保存到 '{0}' 文件！"
      },
      "verifyPathEntered": {
        "detail": ". 将 {0} 字段设置为 false 将接受输入的值，而不验证该值是否作为本地文件或目录存在。"
      }
    },
    "wdtOptionsDialog": {
      "createPropsVariable": "创建模型令牌变量",
      "default": "取消设置值",
      "enterModelToken": "输入模型令牌",
      "enterUnresolvedReference": "输入未解析的引用",
      "enterValue": "输入值",
      "enterVariable": "输入变量",
      "instructions": "输入要添加到可选项目列表的令牌。",
      "multiSelectUnset": "从可用项目列表中选择值",
      "propName": "变量名（必需）",
      "propValue": "变量值",
      "seeValue": "值",
      "selectPropsVariable": "选择模型令牌变量",
      "selectSwitch": "切换值",
      "selectValue": "选择值",
      "title": "编辑：{0}",
      "variableName": "变量名（必需）",
      "variableValue": "变量值"
    }
  },
  "wrc": {
    "prefs": {
      "darkmode": "深色模式"
    }
  }
});