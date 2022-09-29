define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic 遠端主控台"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "線上"
        },
        "offline": {
          "tooltip": "離線"
        },
        "detached": {
          "tooltip": "已取消連附"
        },
        "unattached": {
          "tooltip": "已取消附加"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "著作權所有 Â© 2020，2022，Oracle 和 (或) 其關係企業。<br/>Oracle 是 Oracle Corporation 和 (或) 其關係企業的註冊商標。其他名稱為各商標持有人所擁有之商標。<br/>",
      "builtWith": "使用 Oracle JET 建置"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "取得資訊"
      },
      "edit": {
        "tooltip": "管理"
      },
      "deactivate": {
        "tooltip": "Deactivate"
      },
      "delete": {
        "tooltip": "移除"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "未命名的專案"
        },
        "name": {
          "value": "連線提供者名稱"
        },
        "url": {
          "value": "URL"
        },
        "username": {
          "value": "使用者名稱"
        },
        "password": {
          "value": "密碼"
        }
      },
      "models": {
        "name": {
          "value": "WDT 模型提供者名稱"
        },
        "file": {
          "value": "WDT 模型檔案名稱"
        },
        "props": {
          "value": "WDT 變數"
        }
      },
      "composite": {
        "name": {
          "value": "WDT 複合模型提供者名稱"
        },
        "providers": {
          "value": "WDT 模型"
        }
      },
      "proplist": {
        "name": {
          "value": "特性清單提供者名稱"
        },
        "file": {
          "value": "特性清單檔案名稱"
        }
      },
      "project": {
        "name": {
          "value": "專案名稱"
        },
        "file": {
          "value": "專案檔案名稱"
        }
      },
      "provider": {
        "adminserver": {
          "value": "管理伺服器連線"
        },
        "model": {
          "value": "新增 WDT 模型"
        }
      },
      "dropdown": {
        "none": {
          "value": "無"
        }
      }
    },
    "popups": {
      "info": {
        "provider": {
          "id": {
            "label": "提供者 ID："
          }
        },
        "domain": {
          "name": {
            "label": "網域名稱:"
          },
          "url": {
            "label": "網域 URL："
          },
          "version": {
            "label": "網域版本："
          },
          "username": {
            "label": "使用者名稱："
          },
          "roles": {
            "label": "角色："
          },
          "connectTimeout": {
            "label": "連線逾時："
          },
          "readTimeout": {
            "label": "讀取逾時："
          },
          "anyAttempt": {
            "label": "嘗試的任何連線："
          },
          "lastAttempt": {
            "label": "上次成功的嘗試："
          }
        },
        "model": {
          "file": {
            "label": "檔案："
          },
          "props": {
            "label": "變數："
          }
        },
        "composite": {
          "models": {
            "label": "模型："
          }
        },
        "proplist": {
          "file": {
            "label": "檔案名稱："
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "新增管理伺服器連線提供者"
        }
      },
      "models": {
        "add": {
          "value": "新增 WDT 模型檔案提供者"
        },
        "new": {
          "value": "建立新 WDT 模型檔案的提供者"
        }
      },
      "composite": {
        "add": {
          "value": "新增 WDT 複合模型檔案提供者"
        }
      },
      "proplist": {
        "add": {
          "value": "新增特性清單提供者"
        },
        "new": {
          "value": "建立新特性清單的提供者"
        }
      },
      "providers": {
        "sort": {
          "value": "依提供者類型排序"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "網域 URL："
              },
              "version": {
                "label": "網域版本："
              },
              "username": {
                "label": "使用者名稱："
              }
            }
          },
          "model": {
            "file": {
              "label": "檔案："
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "將提供者匯出成為專案..."
        },
        "import": {
          "value": "匯入專案"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "輸入連線提供者的新名稱和連線設定值。"
        },
        "edit": {
          "value": "修改連線提供者的連線設定值。"
        }
      },
      "models": {
        "add": {
          "value": "輸入現有模型檔案提供者的設定值。按一下上傳圖示即可瀏覽模型檔案。"
        },
        "new": {
          "value": "輸入新 WDT 模型檔案的提供者名稱和檔案名稱，然後按一下圖示以選擇用於儲存檔案的目錄。"
        },
        "edit": {
          "value": "修改模型檔案提供者的設定值。按一下圖示即可瀏覽模型檔案。"
        }
      },
      "composite": {
        "add": {
          "value": "輸入複合模型提供者的新名稱並選取已排序的模型清單。"
        },
        "edit": {
          "value": "修改複合模型提供者的設定值。使用已排序的模型清單。"
        }
      },
      "proplist": {
        "add": {
          "value": "輸入現有特性清單提供者的設定值。按一下上傳圖示即可瀏覽特性檔案。"
        },
        "new": {
          "value": "輸入新特性清單的提供者名稱和檔案名稱，然後按一下圖示以選擇用於儲存檔案的目錄。"
        },
        "edit": {
          "value": "修改特性清單提供者的設定值。按一下圖示即可瀏覽特性檔案。"
        }
      },
      "project": {
        "export": {
          "value": "輸入新專案的設定值。"
        },
        "import": {
          "value": "按一下下載圖示以瀏覽專案。"
        }
      },
      "task": {
        "startup": {
          "value": "您想要執行哪個啟動作業？"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "建立管理伺服器連線的提供者"
        },
        "models": {
          "value": "建立現有 WDT 模型檔案的提供者"
        },
        "composite": {
          "value": "建立新 WDT 複合模型的提供者"
        },
        "proplist": {
          "value": "建立現有特性清單的提供者"
        }
      },
      "new": {
        "models": {
          "value": "建立新 WDT 模型檔案的提供者"
        },
        "proplist": {
          "value": "建立新特性清單的提供者"
        }
      },
      "edit": {
        "connections": {
          "value": "編輯管理伺服器連線提供者"
        },
        "models": {
          "value": "編輯 WDT 模型檔案提供者"
        },
        "composite": {
          "value": "編輯 WDT 複合模型提供者"
        },
        "proplist": {
          "value": "編輯特性清單提供者"
        }
      },
      "export": {
        "project": {
          "value": "將提供者匯出成為專案"
        }
      },
      "import": {
        "project": {
          "value": "匯入專案"
        }
      },
      "startup": {
        "task": {
          "value": "啟動作業"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "匯出失敗",
          "detail": "無法將提供者匯出成為 ''{0}'' 專案。"
        }
      },
      "import": {
        "failed": {
          "summary": "儲存失敗",
          "detail": "無法匯入 ''{0}'' 專案檔案。"
        }
      },
      "stage": {
        "failed": {
          "summary": "建立失敗",
          "detail": "無法建立 ''{0}'' 提供者項目。"
        }
      },
      "use": {
        "failed": {
          "summary": "連線失敗",
          "detail": "無法使用 ''{0}'' 提供者項目。"
        }
      },
      "upload": {
        "failed": {
          "detail": "無法載入 WDT 模型檔案：{0}"
        },
        "props": {
          "failed": {
            "detail": "無法載入 WDT 變數：{0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "此專案中已經有名為 ''{0}'' 的專案！"
        },
        "modelsNotFound": {
          "detail": "找不到已設定的 WDT 模型 ''{0}''"
        },
        "propListNotFound": {
          "detail": "找不到 WDT 變數 ''{0}''"
        },
        "selectModels": {
          "detail": "若要選取 WDT 複合項目，請先選取 WDT 複合項目使用的所有 WDT 模型。"
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>請編輯檔案名稱欄位中的路徑，然後按一下「確定」按鈕。或者，按一下上傳圖示並選擇其他檔案。</p>"
        },
        "fixModelFile": {
          "detail": "<p>請修正下方所列的問題，然後按一下「確定」按鈕。或者，請選擇其他檔案。</p>"
        },
        "yamlException": {
          "detail": "{0} 在第 {1} 行，第 {2} 欄"
        },
        "wktModelContent": {
          "summary": "模型內容問題",
          "detail": "請使用<i>程式碼檢視</i>頁籤中的模型編輯器來解決問題。"
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "未設定"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "使用稀疏樣板"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "編輯樹狀結構"
      },
      "view": {
        "tooltip": "組態檢視樹狀結構"
      },
      "monitoring": {
        "tooltip": "監督樹狀結構"
      },
      "security": {
        "tooltip": "Security Data Tree"
      },
      "modeling": {
        "tooltip": "WDT 模型"
      },
      "composite": {
        "tooltip": "WDT 複合模型"
      },
      "properties": {
        "tooltip": "特性清單編輯器"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "首頁",
      "configuration": "編輯樹狀結構",
      "view": "組態檢視樹狀結構",
      "monitoring": "監督樹狀結構",
      "security": "Security Data Tree",
      "modeling": "WDT 模型",
      "composite": "WDT 複合模型",
      "properties": "特性清單"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "首頁"
        },
        "preferences": {
          "label": "偏好設定"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "購物車"
        },
        "ataglance": {
          "label": "快速瀏覽"
        },
        "projectmanagement": {
          "label": "提供者管理"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "資訊小站"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "歷史記錄"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除歷史記錄"
        }
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "歷史記錄"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除歷史記錄"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "(執行於 {0})"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "連線中斷",
        "detail": "與遠端主控台後端的連線中斷。請確定該後端正在執行中，或將其重新啟動並嘗試再次連線。"
      },
      "cannotConnect": {
        "summary": "連線嘗試失敗",
        "detail": "無法連線至 WebLogic 網域 {0}，請確認 WebLogic 在執行中。"
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "配置庫"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "編輯樹狀結構",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "組態檢視樹狀結構",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "監督樹狀結構",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "WDT 模型樹狀結構",
        "description": "<p>維護與「WebLogic 部署工具」關聯的模型檔案。</p>"
      },
      "composite": {
        "label": "WDT 複合模型樹狀結構",
        "description": "<p>檢視您目前正在使用的 WebLogic 部署工具模型檔案組合。</p>"
      },
      "properties": {
        "label": "特性清單編輯器",
        "description": "<p>可檢視或修改特性清單檔中的一組特性。</p>"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "捨棄變更"
      },
      "commit": {
        "tooltip": "確認變更"
      }
    },
    "sections": {
      "changeManager": {
        "label": "變更管理程式"
      },
      "additions": {
        "label": "新增項目"
      },
      "modifications": {
        "label": "修改項目"
      },
      "removals": {
        "label": "移除項目"
      },
      "restart": {
        "label": "重新啟動"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "新建"
      },
      "clone": {
        "label": "複製"
      },
      "delete": {
        "label": "刪除"
      },
      "customize": {
        "label": "自訂表格"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "登陸頁面"
      },
      "history": {
        "tooltip": "切換歷史記錄可見性"
      },
      "instructions": {
        "tooltip": "切換指示可見性"
      },
      "help": {
        "tooltip": "切換「說明」頁面可見性"
      },
      "sync": {
        "tooltip": "重新載入",
        "tooltipOn": "停止自動重新載入"
      },
      "syncInterval": {
        "tooltip": "設定自動重新載入間隔"
      },
      "shoppingcart": {
        "tooltip": "按一下即可檢視購物車動作"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "檢視變更"
        },
        "discard": {
          "label": "捨棄變更"
        },
        "commit": {
          "label": "確認變更"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "選取要對其執行 ''{0}'' 操作的項目。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "訊息",
          "detail": "自動重新載入執行時無法執行 ''{0}'' 動作！請先按一下 ''{1}'' 圖示將其停止。"
        }
      }
    },
    "labels": {
      "start": {
        "value": "啟動"
      },
      "resume": {
        "value": "繼續"
      },
      "suspend": {
        "value": "暫停"
      },
      "shutdown": {
        "value": "關閉"
      },
      "restartSSL": {
        "value": "重新啟動 SSL"
      },
      "stop": {
        "value": "停止"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "顯示隱藏的資料欄"
      }
    },
    "labels": {
      "totalRows": {
        "value": "資料列總數: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "可用的資料欄"
      },
      "selected": {
        "value": "選取的資料欄"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "資料欄不足",
          "detail": "至少需要一個選取的資料欄."
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "儲存"
      },
      "new": {
        "label": "建立"
      },
      "delete": {
        "label": "移除"
      },
      "back": {
        "label": "上一頁"
      },
      "next": {
        "label": "下一頁"
      },
      "finish": {
        "label": "建立"
      },
      "customize": {
        "label": "自訂表格"
      }
    },
    "icons": {
      "save": {
        "tooltip": "儲存"
      },
      "create": {
        "tooltip": "建立"
      },
      "landing": {
        "tooltip": "登陸頁面"
      },
      "history": {
        "tooltip": "切換歷史記錄可見性"
      },
      "instructions": {
        "tooltip": "切換指示可見性"
      },
      "help": {
        "tooltip": "切換「說明」頁面可見性"
      },
      "sync": {
        "tooltip": "重新載入",
        "tooltipOn": "停止自動重新載入"
      },
      "syncInterval": {
        "tooltip": "設定自動重新載入間隔"
      },
      "shoppingcart": {
        "tooltip": "按一下即可檢視購物車動作"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "檢視變更"
        },
        "discard": {
          "label": "捨棄變更"
        },
        "commit": {
          "label": "確認變更"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "顯示進階欄位"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "按一下 {0} 圖示即可在摘要與詳細說明之間做切換。"
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
        "tooltip": "需要重新啟動伺服器或應用程式"
      },
      "wdtIcon": {
        "tooltip": "WDT 設定值"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "說明表格",
        "columns": {
          "header": {
            "name": "名稱",
            "description": "描述"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "必要欄位未完成",
        "detail": "尚未提供必要 {0} 欄位的值或提供的值無效。"
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "apply": {
        "label": "套用"
      },
      "reset": {
        "label": "重設"
      },
      "ok": {
        "label": "確定"
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
        "label": "選擇"
      },
      "connect": {
        "label": "連線"
      },
      "add": {
        "label": "新增/傳送"
      },
      "edit": {
        "label": "編輯/傳送"
      },
      "import": {
        "label": "匯入"
      },
      "export": {
        "label": "匯出"
      },
      "write": {
        "label": "下載檔案"
      },
      "savenow": {
        "label": "立即儲存"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "隱藏"
      },
      "expand": {
        "value": "展開"
      },
      "choose": {
        "value": "選擇檔案"
      },
      "clear": {
        "value": "清除選擇的檔案"
      },
      "more": {
        "value": "其他動作"
      },
      "download": {
        "value": "瀏覽"
      },
      "reset": {
        "value": "重設"
      },
      "submit": {
        "value": "送出變更"
      },
      "write": {
        "value": "下載檔案"
      },
      "pick": {
        "value": "選擇目錄"
      },
      "reload": {
        "value": "重新載入檔案"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "選擇檔案..."
      },
      "chooseDir": {
        "value": "選擇目錄..."
      }
    },
    "labels": {
      "info": {
        "value": "資訊"
      },
      "warn": {
        "value": "出現警告"
      },
      "error": {
        "value": "錯誤"
      }
    },
    "placeholders": {
      "search": {
        "value": "搜尋"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "已順利將變更儲存至 ''{0}'' 檔案！"
      },
      "changesNotSaved": {
        "summary": "無法將變更儲存至 ''{0}'' 檔案！"
      },
      "changesDownloaded": {
        "summary": "已順利將變更下載至 ''{0}'' 檔案！"
      },
      "changesNotDownloaded": {
        "summary": "無法將變更下載至 ''{0}'' 檔案！"
      },
      "verifyPathEntered": {
        "detail": "若將 {0} 欄位設為 false，將會接受輸入的值，不會驗證其是否為本機檔案還是目錄。"
      }
    },
    "wdtOptionsDialog": {
      "title": "編輯：{0}",
      "default": "預設值。(未設定)",
      "instructions": "輸入要新增至可選項目清單中的權杖。",
      "enterValue": "輸入值",
      "selectValue": "選取值",
      "selectSwitch": "切換值",
      "enterUnresolvedReference": "輸入未解析的參照",
      "enterModelToken": "輸入模型權杖",
      "selectPropsVariable": "選取模型權杖變數",
      "createPropsVariable": "建立模型權杖變數",
      "propName": "變數名稱 (必要)",
      "propValue": "變數值",
      "enterVariable": "輸入變數",
      "variableName": "變數名稱 (必要)",
      "variableValue": "變數值",
      "multiSelectUnset": "\"預設值。(從可用的項目清單中選取)\""
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "偵測到未儲存的變更"
      },
      "changesNeedDownloading": {
        "value": "未下載變更"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "所有未儲存的變更都將會遺失。要繼續進行嗎？"
        },
        "areYouSure": {
          "value": "確定要結束但不儲存變更嗎？"
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
          "value": "您的新 ''{0}'' 執行處理尚未加到 WDT 模型。<br/><br/>要先將它加到模型後再繼續嗎？"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "設定自動重新載入間隔",
      "instructions": "自動重新載入間隔要有幾秒？",
      "fields": {
        "interval": {
          "label": "自動重新載入間隔："
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "訊息",
          "detail": "嘗試對 ''{1}'' 執行指定動作時，主控台後端呼叫產生 ''{0}'' 回應。"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "無法判斷確切原因。請查看「JavaScript 主控台」以獲取提示。"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "可用",
        "chosen": "已選擇"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "特性名稱",
        "value": "特性值"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "特性名稱",
        "valueHeader": "特性值",
        "addButtonTooltip": "新增",
        "deleteButtonTooltip": "刪除"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "檢視 {0}..."
          },
          "create": {
            "label": "建立新的 {0}..."
          },
          "edit": {
            "label": "編輯 {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "回復為預設值"
    },
    "placeholder": {
      "value": "預設值"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}'' 無法使用。"
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
        "value": "伺服器狀態"
      },
      "systemStatus": {
        "value": "系統狀態"
      },
      "healthState": {
        "failed": {
          "value": "失敗"
        },
        "critical": {
          "value": "嚴重"
        },
        "overloaded": {
          "value": "超載"
        },
        "warning": {
          "value": "出現警告"
        },
        "ok": {
          "value": "良好"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "截至下列時間為止的執行中伺服器狀況:"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "名稱"
        },
        "state": {
          "value": "狀態"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "目前無法連線後端。"
      },
      "connectionMessage": {
        "summary": "連線訊息"
      },
      "connectFailed": {
        "detail": "嘗試失敗："
      },
      "badRequest": {
        "detail": "無法處理送出的檔案或要求 "
      },
      "invalidCredentials": {
        "detail": "WebLogic 網域證明資料無效 "
      },
      "invalidUrl": {
        "detail": "無法連線 WebLogic 網域 URL"
      },
      "notInRole": {
        "detail": "嘗試失敗：使用者不具備管理員、部署者、操作員或監督者身分"
      },
      "notSupported": {
        "detail": "不支援 WebLogic 網域"
      },
      "unexpectedStatus": {
        "detail": "未預期的結果 (狀態：{0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "要求失敗",
          "detail": "主控台後端呼叫傳回不成功的回應。"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "請查看遠端主控台終端機或 Javascript 主控台以瞭解具體原因。"
      },
      "responseMessages": {
        "summary": "回應訊息"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "無法存取變更管理程式！"
      },
      "changesCommitted": {
        "summary": "變更已順利確認！"
      },
      "changesNotCommitted": {
        "summary": "無法確認變更！"
      },
      "changesDiscarded": {
        "summary": "變更已順利捨棄！"
      },
      "changesNotDiscarded": {
        "summary": "無法捨棄變更！"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "未預期的錯誤回應"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "連線問題",
        "details": "無法傳送資料至提供者及從提供者接收資料！請確定提供者可供存取，然後再試一次。"
      }
    }
  }
});