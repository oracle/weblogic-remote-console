define({
  "wrc-header": {
    "text": {
      "appName": "WebLogicリモート・コンソール"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "オンライン"
        },
        "offline": {
          "tooltip": "オフライン"
        },
        "detached": {
          "tooltip": "デタッチ済"
        },
        "unattached": {
          "tooltip": "アタッチ解除済"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright Â© 2020, 2022, Oracle and/or its affiliates.<br/>Oracleはオラクルおよびその関連会社の登録商標です。その他の社名、商品名等は各社の商標または登録商標である場合があります。<br/>",
      "builtWith": "Oracle JETで構築"
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
        "tooltip": "Deactivate"
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
          "version": {
            "label": "ドメイン・バージョン:"
          },
          "username": {
            "label": "ユーザー名:"
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
        "fileNotSet": "未設定"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "疎テンプレートの使用"
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
        "tooltip": "Security Data Tree"
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
  "wrc-content-area-header": {
    "title": {
      "home": "ホーム",
      "configuration": "ツリーの編集",
      "view": "構成ビュー・ツリー",
      "monitoring": "モニタリング・ツリー",
      "security": "Security Data Tree",
      "modeling": "WDTモデル",
      "composite": "WDTコンポジット・モデル",
      "properties": "プロパティ・リスト"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "ホーム"
        },
        "preferences": {
          "label": "プリファレンス"
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
          "label": "プロバイダ管理"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "キオスク"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "履歴"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "履歴のクリア"
        }
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "履歴"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "履歴のクリア"
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
          "label": "ギャラリ"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "ツリーの編集",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "構成ビュー・ツリー",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "モニタリング・ツリー",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
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
    "labels": {
      "start": {
        "value": "起動"
      },
      "resume": {
        "value": "再開"
      },
      "suspend": {
        "value": "一時停止"
      },
      "shutdown": {
        "value": "シャットダウン"
      },
      "restartSSL": {
        "value": "SSLの再起動"
      },
      "stop": {
        "value": "停止"
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
        "value": "Reload the table to view the current {0} values"
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
        "shoppingcart": "Changes were added to cart!",
        "customView": "Changes were saved!"
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
  "wrc-common": {
    "buttons": {
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
      "default": "デフォルト。(設定解除)",
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
      "multiSelectUnset": "\"デフォルト。(使用可能なアイテム・リストから選択)\""
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
          "value": "変更を保存せずに終了してもよろしいですか。"
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
          "value": "新しい''{0}''インスタンスはまだWDTモデルに追加されていません。<br/><br/>続行する前に追加しますか。"
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
          "detail": "''{1}''で指定されたアクションを実行しようとしたときに、コンソール・バックエンド呼出しが''{0}''レスポンスを生成しました。"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "正確な原因を特定できません。JavaScriptコンソールでヒントを確認してください。"
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
      }
    }
  }
});