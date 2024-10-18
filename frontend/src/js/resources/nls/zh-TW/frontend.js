define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "region": {
      "ariaLabel": {
        "value": "應用程式標頭"
      }
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "切換導覽樹狀結構可見性"
        }
      },
      "theme": {
        "tooltip": "切換主題"
      },
      "whatsNew": {
        "tooltip": "新功能！"
      },
      "howDoI": {
        "tooltip": "開啟「操作指示」作業"
      },
      "tips": {
        "tooltip": "切換使用者提示可見性"
      },
      "help": {
        "tooltip": "開啟 WebLogic Remote Console 內部文件"
      },
      "profile": {
        "tooltip": "設定檔"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "開啟訊息中心"
      },
      "theme": {
        "light": {
          "value": "淺色"
        },
        "dark": {
          "value": "深色"
        }
      }
    },
    "tooltips": {
      "appName": {
        "value": "按一下以重設 WebLogic Remote Console"
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "著作權所有 (c) 2020，2024，Oracle 和 (或) 其關係企業。<br/>Oracle (r)、Java、MySQL 和 NetSuite 是 Oracle 和 (或) 其關係企業的註冊商標。其他名稱為各商標持有人所擁有之商標。<br/>",
      "builtWith": "使用 Oracle JET 建置"
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
        "tooltip": "管理伺服器連線不安全"
      }
    }
  },
  "wrc-app-profile": {
    "icons": {
      "profile": {
        "popup": {
          "launcher": {
            "tooltip": "顯示設定檔清單"
          }
        },
        "dialog": {
          "launcher": {
            "tooltip": "管理設定檔"
          },
          "editor": {
            "tooltip": "設定檔編輯器",
            "toolbar": {
              "save": {
                "tooltip": "儲存設定檔"
              },
              "activate": {
                "tooltip": "作用中設定檔"
              },
              "add": {
                "tooltip": "新增設定檔"
              },
              "remove": {
                "tooltip": "刪除設定檔"
              }
            }
          }
        },
        "image": {
          "tooltip": "設定檔",
          "capture": {
            "tooltip": "新增或變更影像"
          }
        }
      }
    },
    "tabstrip": {
      "tabs": {
        "general": {
          "value": "一般"
        },
        "settings": {
          "value": "設定值"
        },
        "preferences": {
          "value": "偏好設定"
        },
        "properties": {
          "value": "特性"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "變更影像"
      },
      "clearImage": {
        "value": "清除影像"
      },
      "profile": {
        "default": {
          "value": "預設設定檔"
        },
        "toggler": {
          "editor": {
            "show": {
              "value": "顯示設定檔編輯器"
            },
            "hide": {
              "value": "隱藏設定檔編輯器"
            }
          }
        }
      }
    },
    "popup": {
      "profile": {
        "manager": {
          "open": {
            "value": "開啟設定檔管理程式"
          },
          "signout": {
            "value": "登出"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "設定檔 ID"
          },
          "organization": {
            "value": "組織"
          },
          "name": {
            "value": "名稱"
          },
          "email": {
            "value": "電子郵件"
          },
          "role": {
            "default": {
              "value": "作為預設設定檔"
            }
          },
          "settings": {
            "useCredentialStorage": {
              "value": "要儲存專案的加密證明資料嗎？"
            },
            "disableHNV": {
              "value": "要停用主機名稱驗證嗎？"
            },
            "proxyAddress": {
              "value": "代理主機位址"
            },
            "trustStoreType": {
              "value": "信任存放區類型"
            },
            "trustStorePath": {
              "value": "信任存放區路徑"
            },
            "trustStoreKey": {
              "value": "信任存放區金鑰"
            },
            "connectionTimeout": {
              "value": "管理伺服器連線逾時"
            },
            "readTimeout": {
              "value": "管理伺服器讀取逾時"
            }
          },
          "preferences": {
            "theme": {
              "value": "主題"
            },
            "startupTaskChooserType": {
              "value": "啟動作業選擇器類型"
            },
            "useTreeMenusAsRootNodes": {
              "value": "要以樹狀結構功能表作為樹狀結構導覽器的根層級嗎？"
            },
            "onQuit": {
              "value": "如有未儲存變更，是否要讓應用程式無法結束？"
            },
            "onDelete": {
              "value": "需要確認所有刪除嗎？"
            },
            "onActionNotAllowed": {
              "value": "要使用「不允許此動作」彈出式視窗防止資料遺失嗎？"
            },
            "onUnsavedChangesDetected": {
              "value": "要使用「偵測到未儲存的變更」彈出式視窗防止資料遺失嗎？"
            },
            "onChangesNotDownloaded": {
              "value": "要使用「未下載變更」彈出式視窗防止資料遺失嗎？"
            }
          },
          "properties": {
            "javaSystemProperties": {
              "value": "Java 系統特性"
            }
          }
        },
        "legalValues": {
          "themeOptions": {
            "light": {
              "value": "淺色"
            },
            "dark": {
              "value": "深色"
            }
          },
          "taskChooserTypeOptions": {
            "useDialog": {
              "value": "使用對話方塊"
            },
            "useCards": {
              "value": "使用卡片"
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
              "value": "金鑰鏈存放區"
            }
          }
        },
        "messages": {
          "save": {
            "succeeded": {
              "summary": "設定檔 \"{0}\" 已順利儲存！"
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
          "value": "提供者動作"
        }
      },
      "info": {
        "tooltip": "取得此提供者的資訊"
      },
      "edit": {
        "tooltip": "管理此提供者的設定值"
      },
      "deactivate": {
        "tooltip": "停用此提供者"
      },
      "delete": {
        "tooltip": "移除此提供者"
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
        "proxyOverride": {
          "value": "代理主機覆寫"
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
        "project": {
          "name": {
            "label": "專案名稱："
          }
        },
        "provider": {
          "id": {
            "label": "提供者 ID："
          }
        },
        "domain": {
          "consoleExtensionVersion": {
            "label": "主控台擴充版本："
          },
          "name": {
            "label": "網域名稱:"
          },
          "url": {
            "label": "網域 URL："
          },
          "proxyOverride": {
            "label": "代理主機覆寫："
          },
          "version": {
            "label": "網域版本："
          },
          "username": {
            "label": "使用者名稱："
          },
          "sso": {
            "label": "Web 認證："
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
          "insecure": {
            "label": "不安全："
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
        },
        "deactivate": {
          "value": "停用連線提供者並停止網域狀態輪詢。"
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
      },
      "project-busy": {
        "value": "在對專案的任何部分進行變更之前，請先儲存或放棄未儲存的變更"
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
      },
      "project-busy": {
        "value": "專案忙碌"
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "匯出失敗",
          "detail": "無法將提供者匯出成為 '{0}' 專案。"
        }
      },
      "import": {
        "failed": {
          "summary": "儲存失敗",
          "detail": "無法匯入 '{0}' 專案檔案。"
        }
      },
      "stage": {
        "failed": {
          "summary": "建立失敗",
          "detail": "無法建立 '{0}' 提供者項目。"
        }
      },
      "use": {
        "failed": {
          "summary": "連線失敗",
          "detail": "無法使用 '{0}' 提供者項目。"
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
          "detail": "此專案中已經有名為 '{0}' 的專案！"
        },
        "modelsNotFound": {
          "detail": "找不到已設定的 WDT 模型 '{0}'"
        },
        "propListNotFound": {
          "detail": "找不到 WDT 變數 '{0}'"
        },
        "selectModels": {
          "detail": "若要選取 WDT 複合項目，請先選取 WDT 複合項目使用的所有 WDT 模型。"
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "URL 必須指定 HTTPS 通訊協定或使用本端主機"
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
        "fileNotSet": {
          "value": "未設定"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "使用稀疏樣板"
      },
      "usesso": {
        "label": "使用 Web 認證"
      },
      "insecure": {
        "label": "進行非安全連線"
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
        "tooltip": "安全資料樹狀結構"
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
  "wrc-navigation": {
    "ariaLabel": {
      "navstrip": {
        "value": "提供者樹狀結構功能表"
      },
      "navtree": {
        "value": "提供者樹狀結構導覽器"
      },
      "panelResizer": {
        "value": "提供者樹狀結構導覽器大小調整工具。請使用向左鍵和向右鍵調整導覽器的大小"
      }
    }
  },
  "wrc-content-area-header": {
    "ariaLabel": {
      "button": {
        "home": {
          "value": "首頁。返回包含提供者樹狀結構卡片的頁面"
        }
      },
      "region": {
        "title": {
          "value": "內容區域標頭"
        }
      },
      "popup": {
        "provider": {
          "value": "提供者動作"
        }
      }
    },
    "title": {
      "home": "首頁",
      "configuration": "編輯樹狀結構",
      "view": "組態檢視樹狀結構",
      "monitoring": "監督樹狀結構",
      "security": "安全資料樹狀結構",
      "modeling": "WDT 模型",
      "composite": "WDT 複合模型",
      "properties": "特性清單"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "首頁"
        }
      }
    },
    "icons": {
      "shoppingcart": {
        "tooltip": "按一下即可檢視購物車動作"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "檢視變更..."
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
          "label": "提供者"
        },
        "tips": {
          "label": "使用者提示"
        },
        "dashboards": {
          "label": "儀表板"
        }
      }
    },
    "popups": {
      "tips": {
        "title": "篩選提示",
        "checkboxes": {
          "hideall": "隱藏所有提示",
          "productivity": "顯示生產力提示",
          "personalization": "顯示個人化提示",
          "whereis": "顯示「在何處...」提示",
          "accessibility": "顯示輔助功能提示",
          "connectivity": "顯示連線提示",
          "security": "顯示安全提示",
          "other": "顯示其他提示"
        }
      }
    },
    "tips": {
      "labels": {
        "hideall": {
          "value": "全部隱藏"
        },
        "productivity": {
          "value": "生產力"
        },
        "personalization": {
          "value": "個人化"
        },
        "whereis": {
          "value": "在何處..."
        },
        "accessibility": {
          "value": "輔助功能"
        },
        "connectivity": {
          "value": "連線"
        },
        "security": {
          "value": "安全"
        },
        "other": {
          "value": "其他"
        }
      },
      "cards": {
        "tip0": {
          "title": "搜尋您網域中的所有 MBean！",
          "descriptionHTML": "<p>在主控台頂端的搜尋欄位中輸入搜尋詞彙，即可仔細搜尋目前觀點的相符項目。您也可以從<b>最近的搜尋</b>節點重新存取先前的查詢。</p>"
        },
        "tip1": {
          "title": "快速篩選並找出重要的資料！",
          "descriptionHTML": "<p>您可以在儀表板中定義自訂條件，將其與您的網域進行比對，並且根據您的網域產生全面且精確的報表。</p><p>若要開始進行，請從<b>監督樹狀結構</b>中開啟任何節點，然後按一下<b>新建儀表板</b>。或者，開啟<b>儀表板</b>最上層節點以查看內建儀表板。</p>"
        },
        "tip2": {
          "title": "精簡表格內容",
          "descriptionHTML": "<p>將不相關的資料欄隱藏起來以簡化表格，讓您專注於重要的資料。</p><p>請按一下任何表格上方的<b>自訂表格</b>，然後視需要選取或取消選取資料欄。</p>"
        },
        "tip3": {
          "title": "使用鍵盤操控表格及執行動作",
          "descriptionHTML": "<p></p>"
        },
        "tip4": {
          "title": "「自訂此表格」連結在何處？",
          "descriptionHTML": "<p>「自訂此表格」連結現在是<i>自訂表格</i>按鈕。</p>"
        },
        "tip5": {
          "title": "複查擱置變更",
          "descriptionHTML": "<p>開啟「購物車」以查看已儲存至網域但尚未確認的變更清單。</p><p>如果在購物車中未見到<b>檢視變更</b>，請嘗試<a href='#' tabindex='0' on-click data-url='@@docsURL@@/set-console/#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591'>安裝 WebLogic Remote Console 擴充</a>。"
        },
        "tip6": {
          "title": "需要協助嗎?",
          "descriptionHTML": "<ul><li>請將游標停駐於欄位旁邊的 <b>?</b> 以顯示工具提示。</li><li>按一下頁面層級的 <b>?</b> 即可顯示每個可見屬性的詳細說明。</li><li>按一下<b>說明</b>功能表中的<b>前往 WebLogic Remote Console GitHub 專案</b>。</li><li>加入我們的 Slack 頻道：<a href='#' tabindex='0' on-click data-url='https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ'>#remote-console</a>。</li><li>瀏覽我們的文件，網址為 <a href='#' tabindex='0' on-click data-url='@@docsURL@@/'></a>。</li></ul>"
        },
        "tip7": {
          "title": "其他提示 #1",
          "descriptionHTML": "<p>「其他提示 #1」的精簡描述。換行字元並不是 HTML 元素，請勿在此描述中使用。</p>"
        },
        "tip8": {
          "title": "無法連線至伺服器嗎？",
          "descriptionHTML": "<p>請從 <b>監督樹狀結構</b> > <b>環境</b> > <b>伺服器</b>底下，選取沒有回應的伺服器並開啟其<b>疑難排解</b>頁籤，以嘗試並診斷問題。</p><p>如果完全無法連線至網域，請參閱 WebLogic Remote Console 文件中的<a href='#' tabindex='0' on-click data-url='@@docsURL@@/troubleshoot-weblogic-remote-console/#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE'>無法連線至管理伺服器</a>，以取得疑難排解說明。</p>"
        },
        "tip9": {
          "title": "連線提示 #2",
          "descriptionHTML": "<p>「連線提示 #2」的精簡描述。換行字元並不是 HTML 元素，請勿在此描述中使用。</p>"
        },
        "tip10": {
          "title": "安全提示 #1",
          "descriptionHTML": "<p>「安全提示 #1」的精簡描述。換行字元並不是 HTML 元素，請勿在此描述中使用。</p>"
        },
        "tip11": {
          "title": "加快您的工作流程！",
          "descriptionHTML": "<p>您可使用鍵盤快速鍵直接跳至特定 UI 元件。</p><p>前 5 名常用快速鍵：</p><li><code><b>Alt+P</b></code> - 開啟<b>提供者</b>側邊功能表。</li><li><code><b>Alt+C</b></code> - 將焦點移至<b>購物車</b>。</li><li><code><b>Alt+T</b></code> - 將焦點移至表格的第一個資料欄標頭。</li><li><code><b>Alt+|</b></code> - 將焦點移至導覽樹狀結構寬度大小調整工具。使用方向鍵變更樹狀結構的寬度。</li><li><code><b>Alt+;</b></code> - 將焦點移至第一個可點選的導覽路徑標籤。</li></ul><p>如需完整的鍵盤快速鍵清單，請參閱文件。</p>"
        }
      }
    }
  },
  "wrc-perspective": {
    "ariaLabel": {
      "region": {
        "breadcrumbs": {
          "value": "導覽路徑"
        }
      }
    },
    "icons": {
      "history": {
        "tooltip": "歷史記錄"
      },
      "separator": {
        "tooltip": "分隔符號"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "清除歷史記錄項目",
          "label": "清除歷史記錄項目"
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
        "detail": "連線中斷。請重新整理。"
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
          "label": "樹狀結構"
        },
        "startup-tasks": {
          "label": "啟動作業"
        }
      }
    }
  },
  "wrc-landing": {
    "ariaLabel": {
      "cards": {
        "panel": {
          "value": "登陸頁面"
        }
      },
      "cardLinks": {
        "panel": {
          "value": "登陸頁面連結"
        }
      },
      "screenreader": {
        "value1": "您目前在 {0} 項目。請按 Enter 鍵選取。",
        "value2": "您目前在 {0} 項目。按 Enter 鍵即可展開或隱藏。展開之後，可使用向下鍵存取相關連結。",
        "value3": "{0}。按 Tab/Shift+Tab 即可在相關連結之間移動，按 Esc 鍵則會返回上次存取的最上層項目。"
      }
    }
  },
  "wrc-gallery": {
    "ariaLabel": {
      "cards": {
        "panel": {
          "value": "提供者樹狀結構"
        }
      }
    },
    "cards": {
      "configuration": {
        "label": "編輯樹狀結構",
        "description": "<p>維護目前所使用 WebLogic 網域的組態。</p>"
      },
      "view": {
        "label": "組態檢視樹狀結構",
        "description": "<p>檢查目前所使用 WebLogic 網域的唯讀組態。</p>"
      },
      "monitoring": {
        "label": "監督樹狀結構",
        "description": "<p>檢視目前所使用 WebLogic 網域中所選資源的執行時期 MBean 資訊。</p>"
      },
      "security": {
        "label": "安全資料樹狀結構",
        "description": "<p>管理目前所使用 WebLogic 網域中的安全相關資訊 (例如使用者、群組、角色、原則、證明資料等)。</p>"
      },
      "modeling": {
        "label": "WDT 模型樹狀結構",
        "description": "<p>維護 WebLogic Deploy Tooling 工具的模型檔案。</p>"
      },
      "composite": {
        "label": "WDT 複合模型樹狀結構",
        "description": "<p>檢視您目前正在使用的 WebLogic Deploy Tooling 模型檔案組合。</p>"
      },
      "properties": {
        "label": "特性清單編輯器",
        "description": "<p>可檢視或修改特性清單檔中的一組特性。</p>"
      }
    }
  },
  "wrc-startup-tasks": {
    "ariaLabel": {
      "cards": {
        "panel": {
          "value": "啟動作業"
        }
      }
    },
    "cards": {
      "addAdminServer": {
        "label": "新增管理伺服器連線提供者",
        "description": "此作業會建立專案資源，讓您連線至管理伺服器"
      },
      "addWdtModel": {
        "label": "新增 WDT 模型檔案提供者",
        "description": "此作業會建立專案資源，讓您管理本機檔案系統上的現有 WDT 模型檔案"
      },
      "addWdtComposite": {
        "label": "新增 WDT 複合模型檔案提供者",
        "description": "此作業會建立專案資源，讓您管理本機檔案系統上的現有 WDT 模型檔案片段"
      },
      "addPropertyList": {
        "label": "新增特性清單提供者",
        "description": "此作業會建立專案資源，讓您管理儲存在本機檔案系統上的 .properties 檔案"
      },
      "createWdtModel": {
        "label": "建立新 WDT 模型檔案的提供者",
        "description": "此作業會建立專案資源，也就是儲存在您本機檔案系統上的新 WDT 模型檔案"
      },
      "createPropertyList": {
        "label": "建立新特性清單的提供者",
        "description": "此作業會建立專案資源，也就是儲存在您本機檔案系統上的新 .properties 檔案"
      },
      "importProject": {
        "label": "匯入專案",
        "description": "此作業會載入先前匯出的專案，其中包含可立即使用或修改的提供者"
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
      }
    },
    "instructions": {
      "selectItems": {
        "value": "選取要對其執行 '{0}' 操作的項目。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "訊息",
          "detail": "自動重新載入執行時無法執行 '{0}' 動作！請先按一下 '{1}' 圖示將其停止。"
        }
      }
    },
    "prompts": {
      "download": {
        "value": "下載的日誌檔位置："
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
        "value": "重新載入表格以檢視目前的 {0} 值"
      }
    }
  },
  "wrc-table-customizer": {
    "ariaLabel": {
      "availableColumns": {
        "title": {
          "value": "可用的資料欄"
        },
        "list": {
          "value": "可用的資料欄清單"
        },
        "listItem": {
          "value": "可用的資料欄清單項目"
        }
      },
      "selectedColumns": {
        "title": {
          "value": "選取的資料欄"
        },
        "list": {
          "value": "選取的資料欄清單"
        },
        "listItem": {
          "value": "選取的資料欄清單項目"
        }
      },
      "button": {
        "addToRight": {
          "value": "將「可用的資料欄」清單中勾選的項目移至「選取的資料欄」清單"
        },
        "addAllRight": {
          "value": "將「可用的資料欄」清單中的所有項目移至「選取的資料欄」清單"
        },
        "removeRight": {
          "value": "將「選取的資料欄」清單中勾選的項目移至「可用的資料欄」清單"
        },
        "removeAll": {
          "value": "將「選取的資料欄」清單中的所有項目移至「可用的資料欄」清單"
        },
        "reset": {
          "value": "將「選取的資料欄」清單中的資料欄回復成開啟表格自訂程式時顯示的資料欄。"
        },
        "apply": {
          "value": "將資料欄自訂項目套用至表格"
        },
        "cancel": {
          "value": "取消所有資料欄自訂項目"
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
      },
      "dashboard": {
        "label": "新建儀表板"
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
        "shoppingcart": "已將變更新增至購物車！",
        "generic": "已儲存變更！",
        "notSaved": "未偵測到任何變更，因此未儲存任何項目。"
      },
      "action": {
        "notAllowed": {
          "summary": "不允許此動作",
          "detail": "在建立作業期間不允許執行要求的動作。按一下「取消」按鈕可取消建立作業。"
        }
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
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>相關主題：</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "屬性"
      },
      "actions": {
        "label": "動作"
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
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "新增條件"
        },
        "combine": {
          "label": "組合"
        },
        "uncombine": {
          "label": "取消組合"
        },
        "moveup": {
          "label": "上移"
        },
        "movedown": {
          "label": "下移"
        },
        "remove": {
          "label": "移除"
        },
        "negate": {
          "label": "否定"
        },
        "reset": {
          "label": "重設"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "新增第一個條件..."
          },
          "above": {
            "label": "在點選的資料列上方新增條件..."
          },
          "below": {
            "label": "在點選的資料列下方新增條件..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "在上方新增勾選的條件..."
          },
          "below": {
            "label": "在下方新增勾選的條件..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "一或多個必要欄位未包含資料！"
      },
      "argumentValueHasWrongFormat": {
        "summary": "'{0}' 欄位包含格式不正確的資料！"
      },
      "conditionHasNoArgValues": {
        "summary": "選取的條件沒有可編輯的引數值！"
      },
      "conditionAlreadyExists": {
        "summary": "此安全原則已經有使用所選述詞建立的條件，或是有相符引數值的條件！"
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>若要指定新條件的位置，請勾選相關條件旁的核取方塊，然後按一下 <b>+新增條件</b>按鈕。</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "範圍：-31 到 31"
      },
      "dateTime": {
        "value": "格式：yyyy-MM-dd [HH:mm:ss [AM|PM]] (例如 2022-02-14 09:00:00 AM)"
      },
      "time": {
        "value": "格式：HH:mm:ss (例如 14:22:47)"
      },
      "gmtOffset": {
        "value": "格式：GMT+|-h:mm (例如 GMT-5:00)"
      },
      "weekDay": {
        "value": "例如，星期日、星期一、星期二..."
      },
      "or": {
        "value": "或"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "組合"
      },
      "nodata": {
        "Policy": {
          "value": "使用 <b>+ 新增條件</b>按鈕新增原則條件。"
        },
        "DefaultPolicy": {
          "value": "未定義預設安全原則條件。"
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "組合",
            "operator": "運算子",
            "expression": "條件句"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "或",
            "and": "且"
          }
        }
      }
    },
    "wizard": {
      "title": "原則管理",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "選擇述詞",
            "instructions": "從下拉式清單中選擇新條件的述詞。"
          },
          "body": {
            "labels": {
              "predicateList": "述詞清單"
            },
            "help": {
              "predicateList": "述詞清單是可以用來組成安全原則條件之可用述詞的清單。"
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "群組述詞",
            "instructions": "開始在 <i></i> 欄位中輸入以新增引數值或搜尋現有值。按 Enter 鍵即可將輸入的值新增至清單。若要編輯現有引數值，請按一下該值，然後使用彈出式輸入欄位進行修改。"
          },
          "body": {
            "labels": {
              "conditionPhrase": "條件句",
              "negate": "否定條件"
            },
            "help": {
              "negate": "將條件轉換成相反的意思 (例如，「等於」會變成「不等於」、「在」會變成「不在」)。"
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "ariaLabel": {
      "icons": {
        "landing": {
          "value": "返回提供者樹狀結構的登陸頁面。"
        },
        "reset": {
          "value": "Refresh page values"
        }
      }
    },
    "buttons": {
      "action": {
        "label": "動作"
      },
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
      "restart": {
        "label": "重新啟動"
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
      },
      "next": {
        "label": "下一頁"
      },
      "previous": {
        "label": "上一頁"
      },
      "finish": {
        "label": "結束"
      },
      "done": {
        "label": "完成"
      },
      "close": {
        "label": "關閉"
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
      "filter": {
        "value": "篩選"
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
      },
      "delete": {
        "value": "刪除"
      },
      "remove": {
        "value": "移除"
      },
      "noData": {
        "value": "沒有資料"
      },
      "preloader": {
        "value": "預先載入器"
      },
      "checkAll": {
        "value": "全部勾選"
      },
      "checkNone": {
        "value": "全部取消勾選"
      },
      "checkSome": {
        "value": "清除勾選的項目"
      },
      "close": {
        "value": "關閉"
      },
      "recentPages": {
        "value": "切換歷史記錄可見性"
      },
      "pageInfo": {
        "value": "按一下以固定或取消固定"
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
      },
      "alerts": {
        "value": "警示"
      }
    },
    "placeholders": {
      "search": {
        "value": "搜尋"
      }
    },
    "title": {
      "incorrectFileContent": {
        "value": "偵測到不正確的內容"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "'{0}' 包含 JSON，但不是 {1} 的 JSON 表示法！"
      },
      "dataCopiedToClipboard": {
        "detail": "資料已複製到剪貼簿！"
      },
      "tableCopiedToClipboard": {
        "summary": "表格已順利複製到剪貼簿！"
      },
      "emptyCellData": {
        "detail": "選取的儲存格是空的，因此未將資料複製到剪貼簿！"
      },
      "emptyRowData": {
        "detail": "選取的資料列是空的，因此未將資料複製到剪貼簿！"
      },
      "browserPermissionDenied": {
        "summary": "瀏覽器權限被拒",
        "detail": "您必須啟用從 JavaScript 寫入至剪貼簿，才能執行此操作。此外，也只對透過 HTTPS 提供的頁面提供剪貼簿 API 支援。"
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "將儲存格複製到剪貼簿"
        },
        "row": {
          "label": "將資料列複製到剪貼簿"
        },
        "tableAsText": {
          "label": "將表格複製到剪貼簿 (文字)"
        },
        "tableAsJSON": {
          "label": "將表格複製到剪貼簿 (JSON)"
        },
        "tableAsYAML": {
          "label": "將表格複製到剪貼簿 (YAML)"
        }
      }
    }
  },
  "wrc-navtree-toolbar": {
    "menu": {
      "collapseAll": {
        "value": "全部隱藏"
      },
      "useTreeMenusAsRootNodes": {
        "value": "以樹狀結構功能表作為根節點"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "已順利將變更儲存至 '{0}' 檔案！"
      },
      "changesNotSaved": {
        "summary": "無法將變更儲存至 '{0}' 檔案！"
      },
      "changesDownloaded": {
        "summary": "已順利將變更下載至 '{0}' 檔案！"
      },
      "changesNotDownloaded": {
        "summary": "無法將變更下載至 '{0}' 檔案！"
      },
      "verifyPathEntered": {
        "detail": "若將 {0} 欄位設為 false，將會接受輸入的值，不會驗證其是否為本機檔案還是目錄。"
      }
    },
    "wdtOptionsDialog": {
      "title": "編輯：{0}",
      "default": "取消設定值",
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
      "multiSelectUnset": "從可用的項目清單中選取值"
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
          "value": "確定要 {0} 而不儲存變更嗎？"
        },
        "saveBeforeExiting": {
          "value": "要先儲存變更再結束嗎？"
        },
        "needDownloading": {
          "value": "您對 '{0}' 的變更尚未下載至檔案。<br/><br/>要先下載變更再繼續嗎？"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "您的新建 '{0}' 執行處理尚未新增至 WDT 模型。<br/><br/>要先新增至模型再繼續嗎？"
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
          "detail": "嘗試執行 '{1}' 動作時，主控台後端呼叫產生 '{0}' 回應"
        },
        "actionNotPerformed": {
          "detail": "無法在一或多個勾選的項目上執行 '{0}' 動作"
        },
        "actionNotPerformedNoRow": {
          "detail": "Unable to perform '{0}' action"
        },
        "actionSucceeded": {
          "summary": "'{0}' 動作已順利執行！"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "無法判斷確切原因。請查看「JavaScript 主控台」以獲取提示。"
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "動作確認",
        "prompt": "'{0}' 動作無法還原！<br/><br/>要繼續進行嗎？"
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
        "detail": "'{0}' 無法使用。"
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
        "detail": "無法處理送出的檔案或要求"
      },
      "invalidCredentials": {
        "detail": "WebLogic 網域證明資料無效"
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
        "detail": "未預期的結果 (狀態：{0})"
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
  "wrc-confirm-dialogs": {
    "adminServerShutdown": {
      "title": {
        "value": "確認"
      },
      "prompt": {
        "value": "關閉 <b>{0}</b> 將會重設目前的提供者。要繼續進行嗎？"
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
        "details": "無法傳送資料至提供者及從提供者接收資料！請確定提供者可供存取後再繼續。"
      },
      "pathNotFound": {
        "summary": "找不到路徑",
        "details": "'{0}' 不是本機檔案系統上可存取的檔案或目錄。"
      }
    }
  },
  "wrc-message-line": {
    "ariaLabel": {
      "region": {
        "value": "訊息行"
      }
    },
    "menus": {
      "more": {
        "clear": {
          "label": "清除訊息"
        },
        "suppress": {
          "info": {
            "label": "抑制資訊訊息"
          },
          "warning": {
            "label": "抑制警告訊息"
          }
        }
      }
    },
    "messages": {
      "adminServerShutdown": {
        "details": " 無法連線至 WebLogic 網域的管理伺服器。"
      },
      "shutdownSequenceError": {
        "details": "關閉受管理伺服器，然後關閉管理伺服器。"
      }
    }
  },
  "wrc-alerts": {
    "menus": {
      "alerts": {
        "error": {
          "value": "您有 {0} 則高優先順序錯誤警示"
        },
        "warning": {
          "value": "您有 {0} 則高優先順序警告警示"
        },
        "info": {
          "value": "您有 {0} 則高優先順序資訊警示"
        },
        "view": {
          "value": "檢視警示"
        }
      }
    }
  }
});