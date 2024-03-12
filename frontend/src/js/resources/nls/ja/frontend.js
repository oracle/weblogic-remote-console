define({
  "wrc-header": {
    "text": {
      "appName": "WebLogicリモート・コンソール"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "ナビゲーション・ツリーの表示の切替え"
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
        "tooltip": "WebLogicリモート・コンソール内部ドキュメントを開く"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "メッセージ・センターを開く"
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
      "copyrightLegal": "Copyright (c) 2020, 2024, Oracle and/or its affiliates.<br/>Oracle (r)、Java、MySQLおよびNetSuiteはオラクルおよびその関連会社の登録商標です。その他の社名、商品名等は各社の商標または登録商標である場合があります。<br/>",
      "builtWith": "Oracle JETで構築"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "非セキュア"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "セキュアでない管理サーバー接続"
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
            "tooltip": "プロファイルの管理"
          },
          "editor": {
            "tooltip": "Profile Editor",
            "toolbar": {
              "save": {
                "tooltip": "プロファイルの保存"
              },
              "activate": {
                "tooltip": "アクティブ・プロファイル"
              },
              "add": {
                "tooltip": "プロファイルの追加"
              },
              "remove": {
                "tooltip": "プロファイルの削除"
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
          "value": "一般"
        },
        "settings": {
          "value": "設定"
        },
        "preferences": {
          "value": "プリファレンス"
        },
        "properties": {
          "value": "プロパティ"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "イメージの変更"
      },
      "clearImage": {
        "value": "イメージのクリア"
      },
      "profile": {
        "default": {
          "value": "デフォルト・プロファイル"
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
            "value": "サインアウト"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "プロファイルID"
          },
          "organization": {
            "value": "Organization"
          },
          "name": {
            "value": "名前"
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
              "value": "プロジェクトの暗号化済資格証明を格納しますか。"
            },
            "disableHNV": {
              "value": "ホスト名の検証を無効にしますか。"
            },
            "proxyAddress": {
              "value": "プロキシ・アドレス"
            },
            "trustStoreType": {
              "value": "信頼ストアのタイプ"
            },
            "trustStorePath": {
              "value": "トラスト・ストア・パス"
            },
            "trustStoreKey": {
              "value": "トラスト・ストア・キー"
            },
            "connectionTimeout": {
              "value": "管理サーバー接続タイムアウト"
            },
            "readTimeout": {
              "value": "管理サーバー読取りタイムアウト"
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
        "tooltip": "情報"
      },
      "edit": {
        "tooltip": "管理"
      },
      "deactivate": {
        "tooltip": "非アクティブ化"
      },
      "delete": {
        "tooltip": "削除"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "名前のないプロジェクト"
        },
        "name": {
          "value": "接続プロバイダ名"
        },
        "url": {
          "value": "URL"
        },
        "proxyOverride": {
          "value": "プロキシ・オーバーライド"
        },
        "username": {
          "value": "ユーザー名"
        },
        "password": {
          "value": "パスワード"
        }
      },
      "models": {
        "name": {
          "value": "WDTモデル・プロバイダ名"
        },
        "file": {
          "value": "WDTモデル・ファイル名"
        },
        "props": {
          "value": "WDT変数"
        }
      },
      "composite": {
        "name": {
          "value": "WDTコンポジット・モデル・プロバイダ名"
        },
        "providers": {
          "value": "WDTモデル"
        }
      },
      "proplist": {
        "name": {
          "value": "プロパティ・リスト・プロバイダ名"
        },
        "file": {
          "value": "プロパティ・リスト・ファイル名"
        }
      },
      "project": {
        "name": {
          "value": "プロジェクト名"
        },
        "file": {
          "value": "プロジェクト・ファイル名"
        }
      },
      "provider": {
        "adminserver": {
          "value": "管理サーバー接続"
        },
        "model": {
          "value": "WDTモデルの追加"
        }
      },
      "dropdown": {
        "none": {
          "value": "なし"
        }
      }
    },
    "popups": {
      "info": {
        "project": {
          "name": {
            "label": "プロジェクト名:"
          }
        },
        "provider": {
          "id": {
            "label": "プロバイダID:"
          }
        },
        "domain": {
          "name": {
            "label": "ドメイン名:"
          },
          "url": {
            "label": "ドメインURL:"
          },
          "proxyOverride": {
            "label": "プロキシ・オーバーライド:"
          },
          "version": {
            "label": "ドメイン・バージョン:"
          },
          "username": {
            "label": "ユーザー名:"
          },
          "sso": {
            "label": "SSO:"
          },
          "roles": {
            "label": "ロール:"
          },
          "connectTimeout": {
            "label": "接続タイムアウト:"
          },
          "readTimeout": {
            "label": "読取りタイムアウト:"
          },
          "insecure": {
            "label": "非セキュア:"
          },
          "anyAttempt": {
            "label": "試行された接続:"
          },
          "lastAttempt": {
            "label": "最後に成功した試行:"
          }
        },
        "model": {
          "file": {
            "label": "ファイル:"
          },
          "props": {
            "label": "変数:"
          }
        },
        "composite": {
          "models": {
            "label": "モデル:"
          }
        },
        "proplist": {
          "file": {
            "label": "ファイル名:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "管理サーバー接続プロバイダの追加"
        }
      },
      "models": {
        "add": {
          "value": "WDTモデル・ファイル・プロバイダの追加"
        },
        "new": {
          "value": "新規WDTモデル・ファイルのプロバイダの作成"
        }
      },
      "composite": {
        "add": {
          "value": "WDTコンポジット・モデル・ファイル・プロバイダの追加"
        }
      },
      "proplist": {
        "add": {
          "value": "プロパティ・リスト・プロバイダの追加"
        },
        "new": {
          "value": "新規プロパティ・リストのプロバイダの作成"
        }
      },
      "providers": {
        "sort": {
          "value": "プロバイダ・タイプでソート"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "ドメインURL:"
              },
              "version": {
                "label": "ドメイン・バージョン:"
              },
              "username": {
                "label": "ユーザー名:"
              }
            }
          },
          "model": {
            "file": {
              "label": "ファイル:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "プロバイダをプロジェクトとしてエクスポート..."
        },
        "import": {
          "value": "プロジェクトのインポート"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "接続プロバイダの新しい名前および接続設定を入力します。"
        },
        "edit": {
          "value": "接続プロバイダの接続設定を変更します。"
        }
      },
      "models": {
        "add": {
          "value": "既存のモデル・ファイル・プロバイダの設定を入力します。アップロード・アイコンをクリックして、モデル・ファイルを参照します。"
        },
        "new": {
          "value": "新規WDTモデル・ファイルのプロバイダ名およびファイル名を入力し、アイコンをクリックして、ファイルを保存するディレクトリを選択します。"
        },
        "edit": {
          "value": "モデル・ファイル・プロバイダの設定を変更します。アイコンをクリックして、モデル・ファイルを参照します。"
        }
      },
      "composite": {
        "add": {
          "value": "コンポジット・モデル・プロバイダの新しい名前を入力し、モデルの順序付きリストを選択します。"
        },
        "edit": {
          "value": "コンポジット・モデル・プロバイダの設定を変更します。モデルの順序付きリストを使用します。"
        }
      },
      "proplist": {
        "add": {
          "value": "既存のプロパティ・リスト・プロバイダの設定を入力します。アップロード・アイコンをクリックして、プロパティ・ファイルを参照します。"
        },
        "new": {
          "value": "新規プロパティ・リストのプロバイダ名およびファイル名を入力し、アイコンをクリックして、ファイルを保存するディレクトリを選択します。"
        },
        "edit": {
          "value": "プロパティ・リスト・プロバイダの設定を変更します。アイコンをクリックして、プロパティ・ファイルを参照します。"
        }
      },
      "project": {
        "export": {
          "value": "新規プロジェクトの設定を入力します。"
        },
        "import": {
          "value": "ダウンロード・アイコンをクリックして、プロジェクトを参照します。"
        }
      },
      "task": {
        "startup": {
          "value": "どの起動タスクを実行することに関心がありますか。"
        }
      },
      "project-busy": {
        "value": "プロジェクトに変更を加える前に、保存されていない変更を保存するか破棄してください"
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "管理サーバー接続のプロバイダの作成"
        },
        "models": {
          "value": "既存のWDTモデル・ファイルのプロバイダの作成"
        },
        "composite": {
          "value": "新規WDTコンポジット・モデルのプロバイダの作成"
        },
        "proplist": {
          "value": "既存のプロパティ・リストのプロバイダの作成"
        }
      },
      "new": {
        "models": {
          "value": "新規WDTモデル・ファイルのプロバイダの作成"
        },
        "proplist": {
          "value": "新規プロパティ・リストのプロバイダの作成"
        }
      },
      "edit": {
        "connections": {
          "value": "管理サーバー接続プロバイダの編集"
        },
        "models": {
          "value": "WDTモデル・ファイル・プロバイダの編集"
        },
        "composite": {
          "value": "WDTコンポジット・モデル・プロバイダの編集"
        },
        "proplist": {
          "value": "プロパティ・リスト・プロバイダの編集"
        }
      },
      "export": {
        "project": {
          "value": "プロバイダをプロジェクトとしてエクスポート"
        }
      },
      "import": {
        "project": {
          "value": "プロジェクトのインポート"
        }
      },
      "startup": {
        "task": {
          "value": "起動タスク"
        }
      },
      "project-busy": {
        "value": "プロジェクトがビジーです"
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "エクスポート失敗",
          "detail": "プロバイダを''{0}''プロジェクトとしてエクスポートできません。"
        }
      },
      "import": {
        "failed": {
          "summary": "保存失敗",
          "detail": "''{0}''プロジェクト・ファイルをインポートできません。"
        }
      },
      "stage": {
        "failed": {
          "summary": "作成失敗",
          "detail": "''{0}''プロバイダ・アイテムを作成できません。"
        }
      },
      "use": {
        "failed": {
          "summary": "接続失敗",
          "detail": "''{0}''プロバイダ・アイテムを使用できません。"
        }
      },
      "upload": {
        "failed": {
          "detail": "WDTモデル・ファイルをロードできません: {0}"
        },
        "props": {
          "failed": {
            "detail": "WDT変数をロードできません: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "''{0}''という名前のプロバイダはすでにこのプロジェクトに含まれています。"
        },
        "modelsNotFound": {
          "detail": "構成済のWDTモデル''{0}''が見つかりません"
        },
        "propListNotFound": {
          "detail": "WDT変数''{0}''が見つかりません"
        },
        "selectModels": {
          "detail": "WDTコンポジットを選択するには、まず、WDTコンポジットで使用されたすべてのWDTモデルを選択します。"
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>ファイル名フィールドのパスを編集し、「OK」ボタンをクリックします。または、アップロード・アイコンをクリックして別のファイルを選択します。</p>"
        },
        "fixModelFile": {
          "detail": "<p>次に示す問題を修正したら、「OK」ボタンをクリックします。または、別のファイルを選択します。</p>"
        },
        "yamlException": {
          "detail": "行 {1}、列{2}で{0}が発生しました"
        },
        "wktModelContent": {
          "summary": "モデル・コンテンツの問題",
          "detail": "<i>「コード・ビュー」</i>タブでモデル・エディタを使用して、問題を解決します。"
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
        "label": "疎テンプレートの使用"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "セキュアでない接続の確立"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "ツリーの編集"
      },
      "view": {
        "tooltip": "構成ビュー・ツリー"
      },
      "monitoring": {
        "tooltip": "モニタリング・ツリー"
      },
      "security": {
        "tooltip": "セキュリティ・データ・ツリー"
      },
      "modeling": {
        "tooltip": "WDTモデル"
      },
      "composite": {
        "tooltip": "WDTコンポジット・モデル"
      },
      "properties": {
        "tooltip": "プロパティ・リスト・エディタ"
      }
    }
  },
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "ナビゲーション・ストリップ"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "ナビゲーション・ツリー"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "ホーム",
      "configuration": "ツリーの編集",
      "view": "構成ビュー・ツリー",
      "monitoring": "モニタリング・ツリー",
      "security": "セキュリティ・データ・ツリー",
      "modeling": "WDTモデル",
      "composite": "WDTコンポジット・モデル",
      "properties": "プロパティ・リスト"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "ホーム"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "ショッピング・カート"
        },
        "ataglance": {
          "label": "即時"
        },
        "projectmanagement": {
          "label": "Providers"
        },
        "tips": {
          "label": "ユーザー・ヒント"
        },
        "dashboards": {
          "label": "ダッシュボード"
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
          "value": "すべて非表示"
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
          "value": "セキュリティ"
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
        "tooltip": "履歴"
      },
      "separator": {
        "tooltip": "セパレータ"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "履歴エントリのクリア",
          "label": "履歴エントリのクリア"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "{0}時に実行"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "接続が失われました",
        "detail": "リモート・コンソール・バックエンドへの接続が失われました。稼働していることを確認するか、再起動してリンクを再試行してください。"
      },
      "cannotConnect": {
        "summary": "接続の試行に失敗しました",
        "detail": "WebLogicドメイン{0}に接続できません。WebLogicが稼働していることを確認してください。"
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "ツリー"
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
        "label": "ツリーの編集",
        "description": "<p>現在作業中のWebLogicドメインの構成を維持します。</p>"
      },
      "view": {
        "label": "構成ビュー・ツリー",
        "description": "<p>現在作業中のWebLogicドメインの読取り専用構成を調べます。</p>"
      },
      "monitoring": {
        "label": "モニタリング・ツリー",
        "description": "<p>現在作業中のWebLogicドメインの選択されたリソースのランタイムMBean情報を表示します。</p>"
      },
      "security": {
        "label": "セキュリティ・データ・ツリー",
        "description": "<p>現在作業中のWebLogicドメインのセキュリティ関連情報(ユーザー、グループ、ロール、ポリシー、資格証明など)を管理します。</p>"
      },
      "modeling": {
        "label": "WDTモデル・ツリー",
        "description": "<p>WebLogic Deploy Toolingツールに関連付けられたモデル・ファイルを維持します。</p>"
      },
      "composite": {
        "label": "WDTコンポジット・モデル・ツリー",
        "description": "<p>現在作業中のWebLogic Deploy Toolingモデル・ファイルの結合セットを表示します。</p>"
      },
      "properties": {
        "label": "プロパティ・リスト・エディタ",
        "description": "<p>プロパティ・リスト・ファイルからプロパティのセットを表示または変更します。</p>"
      }
    }
  },
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "管理サーバー接続プロバイダの追加",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "WDTモデル・ファイル・プロバイダの追加",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "WDTコンポジット・モデル・ファイル・プロバイダの追加",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "プロパティ・リスト・プロバイダの追加",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "新規WDTモデル・ファイルのプロバイダの作成",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "新規プロパティ・リストのプロバイダの作成",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "プロジェクトのインポート",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "変更の破棄"
      },
      "commit": {
        "tooltip": "変更のコミット"
      }
    },
    "sections": {
      "changeManager": {
        "label": "変更マネージャ"
      },
      "additions": {
        "label": "追加"
      },
      "modifications": {
        "label": "変更"
      },
      "removals": {
        "label": "削除"
      },
      "restart": {
        "label": "再起動"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "新規"
      },
      "clone": {
        "label": "クローン"
      },
      "delete": {
        "label": "削除"
      },
      "customize": {
        "label": "表のカスタマイズ"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "ランディング・ページ"
      },
      "history": {
        "tooltip": "履歴の表示の切替え"
      },
      "instructions": {
        "tooltip": "インストラクションの表示の切替え"
      },
      "help": {
        "tooltip": "ヘルプ・ページの表示の切替え"
      },
      "sync": {
        "tooltip": "再ロード",
        "tooltipOn": "自動再ロードの停止"
      },
      "syncInterval": {
        "tooltip": "自動再ロードの間隔の設定"
      },
      "shoppingcart": {
        "tooltip": "クリックしてカートに対するアクションを表示"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "変更の表示"
        },
        "discard": {
          "label": "変更の破棄"
        },
        "commit": {
          "label": "変更のコミット"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "''{0}''操作を実行するアイテムを選択します。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "メッセージ",
          "detail": "自動再ロードの実行中は''{0}''アクションを実行できません。まず、''{1}''アイコンをクリックして停止してください。"
        }
      }
    },
    "prompts": {
      "download": {
        "value": "ダウンロードされたログ・ファイルの場所:"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "非表示の列を表示"
      }
    },
    "labels": {
      "totalRows": {
        "value": "合計行: {0}"
      },
      "reloadHidden": {
        "value": "表を再ロードして現在の{0}値を表示します"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "使用可能な列"
      },
      "selected": {
        "value": "選択済の列"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "不十分な列",
          "detail": "少なくとも選択済の列が1つ必要です。"
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
        "label": "作成"
      },
      "delete": {
        "label": "削除"
      },
      "back": {
        "label": "戻る"
      },
      "next": {
        "label": "次"
      },
      "finish": {
        "label": "作成"
      },
      "customize": {
        "label": "表のカスタマイズ"
      },
      "dashboard": {
        "label": "新規ダッシュボード"
      }
    },
    "icons": {
      "save": {
        "tooltip": "保存"
      },
      "create": {
        "tooltip": "作成"
      },
      "landing": {
        "tooltip": "ランディング・ページ"
      },
      "history": {
        "tooltip": "履歴の表示の切替え"
      },
      "instructions": {
        "tooltip": "インストラクションの表示の切替え"
      },
      "help": {
        "tooltip": "ヘルプ・ページの表示の切替え"
      },
      "sync": {
        "tooltip": "再ロード",
        "tooltipOn": "自動再ロードの停止"
      },
      "syncInterval": {
        "tooltip": "自動再ロードの間隔の設定"
      },
      "shoppingcart": {
        "tooltip": "クリックしてカートに対するアクションを表示"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "変更の表示"
        },
        "discard": {
          "label": "変更の破棄"
        },
        "commit": {
          "label": "変更のコミット"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "拡張フィールドの表示"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "{0}アイコンをクリックすると、サマリー・ヘルプと詳細ヘルプの間で切り替えることができます。"
      }
    },
    "messages": {
      "savedTo": {
        "shoppingcart": "カートに変更が追加されました。",
        "generic": "変更が保存されました。",
        "notSaved": "変更が検出されていないため、保存するものはありません。"
      },
      "action": {
        "notAllowed": {
          "summary": "アクションは許可されません",
          "detail": "作成操作中はリクエストされたアクションを実行できません。作成操作を取り消すには「取消」ボタンをクリックします。"
        }
      }
    },
    "icons": {
      "restart": {
        "tooltip": "サーバーまたはアプリケーションの再起動が必要です"
      },
      "wdtIcon": {
        "tooltip": "WDT設定"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "ヘルプ表",
        "columns": {
          "header": {
            "name": "名前",
            "description": "説明"
          }
        }
      }
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>関連トピック:</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "属性"
      },
      "actions": {
        "label": "アクション"
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "必須フィールドが不完全です",
        "detail": "{0}フィールドは必須ですが、値が指定されていないか、指定されている値が無効です。"
      }
    }
  },
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "条件の追加"
        },
        "combine": {
          "label": "結合"
        },
        "uncombine": {
          "label": "結合解除"
        },
        "moveup": {
          "label": "上に移動"
        },
        "movedown": {
          "label": "下に移動"
        },
        "remove": {
          "label": "削除"
        },
        "negate": {
          "label": "否定"
        },
        "reset": {
          "label": "リセット"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "新しい最初の条件を追加..."
          },
          "above": {
            "label": "クリックした行の上に条件を追加..."
          },
          "below": {
            "label": "クリックした行の下に条件を追加..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "選択した条件の上に追加..."
          },
          "below": {
            "label": "選択した条件の下に追加..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "1つ以上の必須フィールドにデータが含まれていません。"
      },
      "argumentValueHasWrongFormat": {
        "summary": "''{0}''フィールドに、書式設定が不適切なデータがあります。"
      },
      "conditionHasNoArgValues": {
        "summary": "選択した条件には編集する引数値がありません。"
      },
      "conditionAlreadyExists": {
        "summary": "このセキュリティ・ポリシーには、選択した述部を使用した条件がすでに作成されているか、引数値が一致する条件がすでに存在します。"
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>新しい条件の場所を指定するには、関連する条件の隣にチェックを入れ、<b>「+条件の追加」</b>ボタンをクリックします。</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "範囲: -31から31"
      },
      "dateTime": {
        "value": "書式: y-MM-dd HH:mm:ss [HH:mm:ss] (例: 2006-04-25 00:00:00)"
      },
      "time": {
        "value": "書式: HH:mm:ss (例: 14:22:47)"
      },
      "gmtOffset": {
        "value": "書式: GMT+|-h:mm (例: GMT-5:00)"
      },
      "weekDay": {
        "value": "例: Sunday, Monday, Tuesday, ..."
      },
      "or": {
        "value": "OR"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "結合"
      },
      "nodata": {
        "Policy": {
          "value": "<b>「+ 条件の追加」</b>ボタンを使用してポリシー条件を追加します。"
        },
        "DefaultPolicy": {
          "value": "デフォルトのセキュリティ・ポリシー条件が定義されていません。"
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "結合",
            "operator": "演算子",
            "expression": "条件句"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "OR",
            "and": "AND"
          }
        }
      }
    },
    "wizard": {
      "title": "ポリシー管理",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "述部の選択",
            "instructions": "ドロップダウン・リストから新しい条件の述部を選択します。"
          },
          "body": {
            "labels": {
              "predicateList": "述部リスト"
            },
            "help": {
              "predicateList": "述部リストは、セキュリティ・ポリシー条件を構成するために使用可能な述部のリストです"
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "グループ述部",
            "instructions": "<i></i>フィールドへの入力を開始して引数値を追加するか、既存の引数値を検索します。[Enter]を押すと、入力した値がリストに追加されます。既存の引数値を編集するには、それをクリックし、ポップアップ入力フィールドを使用して変更します。"
          },
          "body": {
            "labels": {
              "conditionPhrase": "条件句",
              "negate": "否定条件"
            },
            "help": {
              "negate": "条件を変換して逆の意味を持たせます(たとえば、\"次と等しい\"が\"次と等しくない\"になり、\"次に含まれる\"が\"次に含まれない\"になります)。"
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "アクション"
      },
      "apply": {
        "label": "適用"
      },
      "reset": {
        "label": "リセット"
      },
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "取消"
      },
      "restart": {
        "label": "再起動"
      },
      "yes": {
        "label": "はい"
      },
      "no": {
        "label": "いいえ"
      },
      "choose": {
        "label": "選択"
      },
      "connect": {
        "label": "接続"
      },
      "add": {
        "label": "追加/送信"
      },
      "edit": {
        "label": "編集/送信"
      },
      "import": {
        "label": "インポート"
      },
      "export": {
        "label": "エクスポート"
      },
      "write": {
        "label": "ファイルのダウンロード"
      },
      "savenow": {
        "label": "今すぐ保存"
      },
      "next": {
        "label": "次"
      },
      "previous": {
        "label": "前"
      },
      "finish": {
        "label": "終了"
      },
      "done": {
        "label": "完了"
      },
      "close": {
        "label": "閉じる"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "縮小"
      },
      "expand": {
        "value": "展開"
      },
      "choose": {
        "value": "ファイルの選択"
      },
      "clear": {
        "value": "選択したファイルのクリア"
      },
      "more": {
        "value": "その他のアクション"
      },
      "download": {
        "value": "参照"
      },
      "reset": {
        "value": "リセット"
      },
      "filter": {
        "value": "フィルタ"
      },
      "submit": {
        "value": "変更の送信"
      },
      "write": {
        "value": "ファイルのダウンロード"
      },
      "pick": {
        "value": "ディレクトリの選択"
      },
      "reload": {
        "value": "ファイルの再ロード"
      },
      "delete": {
        "value": "削除"
      },
      "remove": {
        "value": "削除"
      },
      "noData": {
        "value": "データなし"
      },
      "preloader": {
        "value": "プレローダー"
      },
      "checkAll": {
        "value": "すべて選択"
      },
      "checkNone": {
        "value": "すべて選択解除"
      },
      "checkSome": {
        "value": "チェック済のクリア"
      },
      "close": {
        "value": "閉じる"
      },
      "recentPages": {
        "value": "履歴の表示の切替え"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "ファイルの選択..."
      },
      "chooseDir": {
        "value": "ディレクトリの選択..."
      }
    },
    "labels": {
      "info": {
        "value": "情報"
      },
      "warn": {
        "value": "警告"
      },
      "error": {
        "value": "エラー"
      }
    },
    "placeholders": {
      "search": {
        "value": "検索"
      }
    },
    "title": {
      "incorrectFileContent": {
        "value": "正しくないコンテンツが検出されました"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}''にはJSONが含まれていますが、これは{1}のJSON表現ではありません。"
      },
      "dataCopiedToClipboard": {
        "summary": "データがクリップボードにコピーされました。"
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "選択したセルが空であったため、データはクリップボードにコピーされませんでした。"
      },
      "emptyRowData": {
        "detail": "選択した行が空であったため、データはクリップボードにコピーされませんでした。"
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "セルのクリップボードへのコピー"
        },
        "row": {
          "label": "行のクリップボードへのコピー"
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
        "summary": "変更は''{0}''ファイルに正常に保存されました。"
      },
      "changesNotSaved": {
        "summary": "変更を''{0}''ファイルに保存できません。"
      },
      "changesDownloaded": {
        "summary": "変更は''{0}''ファイルに正常にダウンロードされました。"
      },
      "changesNotDownloaded": {
        "summary": "変更を''{0}''ファイルにダウンロードできません。"
      },
      "verifyPathEntered": {
        "detail": "{0}フィールドをfalseに設定すると、ローカル・ファイルまたはディレクトリとして存在することを検証せずに、入力された値を受け入れます。"
      }
    },
    "wdtOptionsDialog": {
      "title": "編集: {0}",
      "default": "値の設定を解除",
      "instructions": "トークンを入力して、選択可能なアイテムのリストに追加します。",
      "enterValue": "値の入力",
      "selectValue": "値の選択",
      "selectSwitch": "値の切替え",
      "enterUnresolvedReference": "未解決の参照の入力",
      "enterModelToken": "モデル・トークンの入力",
      "selectPropsVariable": "モデル・トークン変数の選択",
      "createPropsVariable": "モデル・トークン変数の作成",
      "propName": "変数名(必須)",
      "propValue": "変数値",
      "enterVariable": "変数の入力",
      "variableName": "変数名(必須)",
      "variableValue": "変数値",
      "multiSelectUnset": "使用可能なアイテムのリストから値を選択"
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "保存されていない変更が検出されました"
      },
      "changesNeedDownloading": {
        "value": "変更がダウンロードされません"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "未保存の変更内容はすべて失われます。続行しますか。"
        },
        "areYouSure": {
          "value": "変更を保存せずに{0}してもよろしいですか。"
        },
        "saveBeforeExiting": {
          "value": "終了する前に変更を保存しますか。"
        },
        "needDownloading": {
          "value": "''{0}''に対する変更はファイルにダウンロードされていません。<br/><br/>続行する前にダウンロードしますか。"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "新しい''{0}''インスタンスはWDTモデルに追加されていません。<br/><br/>続行する前に追加しますか。"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "自動再ロードの間隔の設定",
      "instructions": "自動再ロードの間隔は何秒にしますか。",
      "fields": {
        "interval": {
          "label": "自動再ロードの間隔:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "メッセージ",
          "detail": "''{1}''アクションを実行しようとしたときに、コンソール・バックエンド呼出しが''{0}''レスポンスを生成しました"
        },
        "actionNotPerformed": {
          "detail": "選択された1つ以上のアイテムで、''{0}''アクションを実行できません"
        },
        "actionSucceeded": {
          "summary": "''{0}''アクションは正常に実行されました。"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "正確な原因を特定できません。JavaScriptコンソールでヒントを確認してください。"
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "アクションの確認",
        "prompt": "''{0}''アクションは元に戻せません。<br/><br/>続行しますか。"
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "使用可能",
        "chosen": "選択済"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "プロパティ名",
        "value": "プロパティ値"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "プロパティ名",
        "valueHeader": "プロパティ値",
        "addButtonTooltip": "追加",
        "deleteButtonTooltip": "削除"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "{0}の表示..."
          },
          "create": {
            "label": "{0}の新規作成..."
          },
          "edit": {
            "label": "{0}の編集..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "デフォルトに戻す"
    },
    "placeholder": {
      "value": "デフォルト"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}''は使用できません。"
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
        "value": "サーバーの状態"
      },
      "systemStatus": {
        "value": "システム・ステータス"
      },
      "healthState": {
        "failed": {
          "value": "失敗"
        },
        "critical": {
          "value": "クリティカル"
        },
        "overloaded": {
          "value": "過負荷"
        },
        "warning": {
          "value": "警告"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "実行中のサーバーの現時点のヘルス"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "名前"
        },
        "state": {
          "value": "状態"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "現在、バックエンドにアクセスできません。"
      },
      "connectionMessage": {
        "summary": "接続メッセージ"
      },
      "connectFailed": {
        "detail": "試行に失敗しました: "
      },
      "badRequest": {
        "detail": "送信されたファイルまたはリクエストを処理できません。"
      },
      "invalidCredentials": {
        "detail": "Weblogicドメイン資格証明が有効ではありません"
      },
      "invalidUrl": {
        "detail": "WebLogicドメインのURLにアクセスできません"
      },
      "notInRole": {
        "detail": "試行できませんでした: ユーザーは管理者、デプロイヤ、オペレータまたはモニターではありません"
      },
      "notSupported": {
        "detail": "WebLogicドメインはサポートされていません"
      },
      "unexpectedStatus": {
        "detail": "予期しない結果(ステータス: {0})"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "リクエスト失敗",
          "detail": "失敗を示すレスポンスがコンソール・バックエンド呼出しから返されました。"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "特定の理由については、リモート・コンソール端末またはJavascriptコンソールを参照してください。"
      },
      "responseMessages": {
        "summary": "レスポンス・メッセージ"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "変更マネージャにアクセスできません。"
      },
      "changesCommitted": {
        "summary": "変更は正常にコミットされました。"
      },
      "changesNotCommitted": {
        "summary": "変更をコミットできません。"
      },
      "changesDiscarded": {
        "summary": "変更は正常に破棄されました。"
      },
      "changesNotDiscarded": {
        "summary": "変更を破棄できません。"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "予期しないエラー・レスポンス"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "接続の問題",
        "details": "プロバイダからのデータの送受信に問題があります。アクセス可能であることを確認し、再試行してください。"
      },
      "pathNotFound": {
        "summary": "パスが見つかりません",
        "details": "''{0}''は、ローカル・ファイルシステムでアクセスできるファイルまたはディレクトリではありません。"
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "メッセージのクリア"
        },
        "suppress": {
          "info": {
            "label": "情報メッセージの抑制"
          },
          "warning": {
            "label": "警告メッセージの抑制"
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
          "value": "警告の表示"
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