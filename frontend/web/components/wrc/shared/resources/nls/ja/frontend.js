define({
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "prompt": "'{0}'アクションは元に戻せません。<br/><br/>続行しますか。",
        "title": "アクションの確認"
      }
    }
  },
  "wrc-alerts": {
    "menus": {
      "alerts": {
        "error": {
          "value": "{0}個の高優先度エラー・アラートがあります"
        },
        "info": {
          "value": "{0}個の高優先度情報アラートがあります"
        },
        "view": {
          "value": "警告の表示"
        },
        "warning": {
          "value": "{0}個の高優先度警告アラートがあります"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "popups": {
      "tips": {
        "checkboxes": {
          "accessibility": "アクセシビリティに関するヒントの表示",
          "connectivity": "接続性に関するヒントの表示",
          "hideall": "すべてのヒントの非表示",
          "other": "その他のヒントの表示",
          "personalization": "パーソナライズに関するヒントの表示",
          "productivity": "生産性に関するヒントの表示",
          "security": "セキュリティに関するヒントの表示",
          "whereis": "...の場所に関するヒントの表示"
        },
        "title": "フィルタ・ヒント"
      }
    },
    "tabstrip": {
      "tabs": {
        "dashboards": {
          "label": "ダッシュボード"
        },
        "projectmanagement": {
          "label": "プロバイダ"
        },
        "shoppingcart": {
          "label": "ショッピング・カート"
        },
        "tips": {
          "label": "ユーザー・ヒント"
        }
      }
    },
    "tips": {
      "cards": {
        "tip0": {
          "descriptionHTML": "<p>コンソールの一番上にある検索フィールドに検索語句を入力して、現在の視点で一致を詳細に検索します。<b>「最近の検索」</b>ノードで前の問合せに戻ることもできます。</p>",
          "title": "ドメイン内のすべてのMBeanを検索します。"
        },
        "tip1": {
          "descriptionHTML": "<p>ダッシュボードでは、カスタム基準を定義し、それをドメインと照合して、ドメインに基づく包括的で正確なレポートを生成できます。</p><p>開始するには、<b>「モニタリング・ツリー」</b>で任意のノードを開き、<b>「新規ダッシュボード」</b>をクリックします。または、<b>「ダッシュボード」</b>最上位レベル・ノードを開き、組込みのダッシュボードを表示します。</p>",
          "title": "重要なデータを迅速にフィルタして検索します。"
        },
        "tip10": {
          "descriptionHTML": "<p>「セキュリティに関するヒント#1」の簡潔な説明。改行文字はHTML要素ではないため、この説明ではそれらを使用しません。</p>",
          "title": "セキュリティに関するヒント#1"
        },
        "tip11": {
          "descriptionHTML": "<p>キーボード・ショートカットを使用して、特定のUIコンポーネントに直接ジャンプします。</p><p>上位5:</p><li><code><b>[Alt]+[P]</b></code> - <b>プロバイダ</b>・ドロワーを開きます。</li><li><code><b>[Alt]+[C]</b></code> - フォーカスを<b>ショッピング・カート</b>に移動します。</li><li><code><b>[Alt]+[T]</b></code> - フォーカスを表の最初の列ヘッダーに移動します。</li><li><code><b>[Alt]+[|]</b></code> - フォーカスをナビゲーション・ツリーの幅リサイザに移動します。矢印キーを使用してツリーの幅を変更します。</li><li><code><b>[Alt]+[;]</b></code> - フォーカスを最初のクリック可能なブレッドクラム・ラベルに移動します。</li></ul><p>キーボード・ショートカットの完全なリストは、ドキュメントを参照してください。</p>",
          "title": "ワークフローを高速化します。"
        },
        "tip2": {
          "descriptionHTML": "<p>重要なデータにフォーカスできるように、無関係な列を非表示にして表を簡略化します。</p><p>表の上で<b>「表のカスタマイズ」</b>をクリックし、必要に応じて列を選択または選択解除します。</p>",
          "title": "表の内容を絞り込みます"
        },
        "tip3": {
          "descriptionHTML": "<p></p>",
          "title": "表とアクションでキーボードを使用"
        },
        "tip4": {
          "descriptionHTML": "<p>「この表のカスタマイズ」リンクは「<i>表のカスタマイズ</i>」ボタンになりました。</p>",
          "title": "「この表のカスタマイズ」リンクはどこにありますか?"
        },
        "tip5": {
          "descriptionHTML": "<p>ショッピング・カートを開き、ドメインに保存されているがまだコミットされていない変更のリストを表示します。</p><p>ショッピング・カートに<b>「変更の表示」</b>が表示されない場合、<a href='#' tabindex='0' on-click data-url='@@docsURL@@/set-console/#GUID-40440E0F-0310-4830-9B4B-00FC9ABBB591'>WebLogic Remote Console拡張機能のインストール</a>を試してください。",
          "title": "保留中の変更を確認します"
        },
        "tip6": {
          "descriptionHTML": "<ul><li>ツールチップを表示するには、フィールドの横にある<b>「?」</b>の上にカーソルを置きます。</li><li>すべての可視属性に関する詳細なヘルプは、ページレベルの<b>「?」</b>をクリックします。</li><li><b>「ヘルプ」</b>メニューで、<b>「WebLogic Remote Console GitHubプロジェクトにアクセス」</b>をクリックします。</li><li>Slackチャネルに参加: <a href='#' tabindex='0' on-click data-url='https://join.slack.com/t/oracle-weblogic/shared_invite/zt-1ni1gtjv6-PGC6CQ4uIte3KBdm_67~aQ'>#remote-console</a>。</li><li>ドキュメントを参照: <a href='#' tabindex='0' on-click data-url='@@docsURL@@/'></a>。</li></ul>",
          "title": "サポートが必要ですか。"
        },
        "tip7": {
          "descriptionHTML": "<p>「その他のヒント#1」の簡潔な説明。改行文字はHTML要素ではないため、この説明ではそれらを使用しません。</p>",
          "title": "その他のヒント#1"
        },
        "tip8": {
          "descriptionHTML": "<p><b>「モニタリング・ツリー」</b>→<b>「環境」</b>→<b>「サーバー」</b>で、応答のないサーバーを選択し、その<b>「トラブルシューティング」</b>タブを開いて問題を試行および診断します。</p><p>ドメインにまったく接続できない場合は、WebLogic Remote Consoleドキュメントの<a href='#' tabindex='0' on-click data-url='@@docsURL@@/troubleshoot-weblogic-remote-console/#GUID-B3D14A11-0144-4B31-BFE3-E6AC59AEFCBE'>「管理サーバーに接続できない」</a>でトラブルシューティング・ヘルプを参照してください。</p>",
          "title": "サーバーへの接続に問題がありますか。"
        },
        "tip9": {
          "descriptionHTML": "<p>「接続性に関するヒント#2」の簡潔な説明。改行文字はHTML要素ではないため、この説明ではそれらを使用しません。</p>",
          "title": "接続性に関するヒント#2"
        }
      },
      "labels": {
        "accessibility": {
          "value": "アクセシビリティ"
        },
        "connectivity": {
          "value": "接続性"
        },
        "hideall": {
          "value": "すべて非表示"
        },
        "other": {
          "value": "その他"
        },
        "personalization": {
          "value": "パーソナライズ"
        },
        "productivity": {
          "value": "生産性"
        },
        "security": {
          "value": "セキュリティ"
        },
        "whereis": {
          "value": "...の場所"
        }
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
      "changesDiscarded": {
        "summary": "変更は正常に破棄されました。"
      },
      "changesNotCommitted": {
        "summary": "変更をコミットできません。"
      },
      "changesNotDiscarded": {
        "summary": "変更を破棄できません。"
      }
    }
  },
  "wrc-common": {
    "ariaLabel": {
      "icons": {
        "landing": {
          "value": "プロバイダ・ツリーのランディング・ページに戻ります。"
        },
        "reset": {
          "value": "ページ値のリフレッシュ"
        }
      }
    },
    "buttons": {
      "action": {
        "label": "アクション"
      },
      "add": {
        "label": "追加/送信"
      },
      "apply": {
        "label": "適用"
      },
      "cancel": {
        "label": "取消"
      },
      "choose": {
        "label": "選択"
      },
      "clear": {
        "label": "クリア"
      },
      "close": {
        "label": "閉じる"
      },
      "connect": {
        "label": "接続"
      },
      "done": {
        "label": "完了"
      },
      "edit": {
        "label": "編集/送信"
      },
      "export": {
        "label": "エクスポート"
      },
      "finish": {
        "label": "終了"
      },
      "import": {
        "label": "インポート"
      },
      "next": {
        "label": "次"
      },
      "no": {
        "label": "いいえ"
      },
      "ok": {
        "label": "結構です"
      },
      "previous": {
        "label": "前"
      },
      "reset": {
        "label": "リセット"
      },
      "restart": {
        "label": "再起動"
      },
      "savenow": {
        "label": "今すぐ保存"
      },
      "write": {
        "label": "ファイルのダウンロード"
      },
      "yes": {
        "label": "はい"
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
        "tableAsJSON": {
          "label": "表をクリップボードにコピー(JSON)"
        },
        "tableAsText": {
          "label": "表をクリップボードにコピー(Text)"
        },
        "tableAsYAML": {
          "label": "表をクリップボードにコピー(YAML)"
        }
      }
    },
    "labels": {
      "alerts": {
        "value": "アラート"
      },
      "error": {
        "value": "エラー"
      },
      "info": {
        "value": "情報"
      },
      "pagesBookmark": {
        "notreachable": {
          "value": "このページは現在のプロバイダでは使用できません。"
        },
        "value": "次に示すのは、{0}プロバイダ・タイプにブックマークされたページです。行の任意の列をクリックすると、関連付けられたページに移動します。"
      },
      "pagesHistory": {
        "value": "次に示すのは、現在のプロバイダを選択して以降アクセスしたページです。行の任意の列をクリックすると、関連付けられたページに移動します。"
      },
      "warn": {
        "value": "警告"
      }
    },
    "menu": {
      "chooseDir": {
        "value": "ディレクトリの選択..."
      },
      "chooseFile": {
        "value": "ファイルの選択..."
      }
    },
    "messages": {
      "browserPermissionDenied": {
        "detail": "この操作を実行するには、JavaScriptからクリップボードへの書込みを有効にする必要があります。また、クリップボードAPIはHTTPSを介して提供されたページでのみサポートされます。",
        "summary": "ブラウザ権限が拒否されました"
      },
      "dataCopiedToClipboard": {
        "detail": "データがクリップボードにコピーされました。"
      },
      "emptyCellData": {
        "detail": "選択したセルが空であったため、データはクリップボードにコピーされませんでした。"
      },
      "emptyRowData": {
        "detail": "選択した行が空であったため、データはクリップボードにコピーされませんでした。"
      },
      "incorrectFileContent": {
        "detail": "'{0}'にはJSONが含まれていますが、これは{1}のJSON表現ではありません。"
      },
      "tableCopiedToClipboard": {
        "summary": "表がクリップボードに正常にコピーされました!"
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
    "tooltips": {
      "checkAll": {
        "value": "すべて選択"
      },
      "checkNone": {
        "value": "すべて選択解除"
      },
      "checkSome": {
        "value": "チェック済のクリア"
      },
      "choose": {
        "value": "ファイルの選択"
      },
      "clear": {
        "value": "選択したファイルのクリア"
      },
      "close": {
        "value": "閉じる"
      },
      "collapse": {
        "value": "縮小"
      },
      "delete": {
        "value": "削除"
      },
      "download": {
        "value": "参照"
      },
      "expand": {
        "value": "展開"
      },
      "filter": {
        "value": "フィルタ"
      },
      "more": {
        "value": "その他のアクション"
      },
      "noData": {
        "value": "データなし"
      },
      "pageInfo": {
        "value": "クリックして固定および固定解除します"
      },
      "pagesHistory": {
        "back": {
          "value": "前のページ"
        },
        "launch": {
          "value": "ページ履歴の表示"
        },
        "next": {
          "value": "次のページ"
        },
        "star": {
          "value": "ページ・ブックマーク"
        }
      },
      "pick": {
        "value": "ディレクトリの選択"
      },
      "preloader": {
        "value": "プリローダー"
      },
      "recentPages": {
        "value": "履歴の表示の切替え"
      },
      "reload": {
        "value": "ファイルの再ロード"
      },
      "remove": {
        "value": "削除"
      },
      "reset": {
        "value": "リセット"
      },
      "submit": {
        "value": "変更の送信"
      },
      "write": {
        "value": "ファイルのダウンロード"
      }
    }
  },
  "wrc-confirm-dialogs": {
    "adminServerShutdown": {
      "prompt": {
        "value": "<b>{0}</b>を停止すると、現在のプロバイダがリセットされます。続行しますか。"
      },
      "title": {
        "value": "確認"
      }
    }
  },
  "wrc-connectivity": {
    "icons": {
      "insecure": {
        "tooltip": "セキュアでない管理サーバー接続"
      }
    },
    "labels": {
      "insecure": {
        "value": "非セキュア"
      }
    }
  },
  "wrc-content-area-header": {
    "ariaLabel": {
      "button": {
        "home": {
          "value": "ホーム。プロバイダのツリーのカードを含むページに戻ります"
        }
      },
      "popup": {
        "provider": {
          "value": "プロバイダ・アクション"
        }
      },
      "region": {
        "title": {
          "value": "コンテンツ領域ヘッダー"
        }
      }
    },
    "icons": {
      "shoppingcart": {
        "tooltip": "クリックしてショッピング・カート・アクションを表示します"
      }
    },
    "menu": {
      "shoppingcart": {
        "commit": {
          "label": "変更のコミット"
        },
        "discard": {
          "label": "変更の破棄"
        },
        "view": {
          "label": "変更の表示..."
        }
      }
    },
    "title": {
      "compositeConfig": "WDTコンポジット・モデル",
      "domainRuntime": "モニタリング・ツリー",
      "edit": "ツリーの編集",
      "home": "ホーム",
      "model": "WDTモデル",
      "propertyList": "プロパティ・リスト",
      "securityData": "セキュリティ・データ・ツリー",
      "serverConfig": "構成ビュー・ツリー"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "ホーム"
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "detail": "{0}フィールドは必須ですが、値が指定されていないか、指定されている値が無効です。",
        "summary": "必須フィールドが不完全です"
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "現在、バックエンドにアクセスできません。"
      },
      "badRequest": {
        "detail": "送信されたファイルまたはリクエストを処理できません。"
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "detail": "失敗を示すレスポンスがコンソール・バックエンド呼出しから返されました。",
          "summary": "リクエスト失敗"
        }
      },
      "connectFailed": {
        "detail": "試行に失敗しました: "
      },
      "connectionMessage": {
        "summary": "接続メッセージ"
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
      }
    }
  },
  "wrc-data-providers": {
    "checkboxes": {
      "insecure": {
        "label": "セキュアでない接続の確立"
      },
      "useSparseTemplate": {
        "label": "疎テンプレートの使用"
      },
      "usesso": {
        "label": "Web認証の使用"
      }
    },
    "icons": {
      "deactivate": {
        "tooltip": "このプロバイダを非アクティブ化します"
      },
      "delete": {
        "tooltip": "このプロバイダを削除します"
      },
      "edit": {
        "tooltip": "このプロバイダの設定を管理します"
      },
      "hoverMenu": {
        "ariaLabel": {
          "value": "プロバイダ・アクション "
        }
      },
      "info": {
        "tooltip": "このプロバイダの情報を取得します"
      }
    },
    "instructions": {
      "composite": {
        "add": {
          "value": "コンポジット・モデル・プロバイダの新しい名前を入力し、モデルの順序付きリストを選択します。"
        },
        "edit": {
          "value": "コンポジット・モデル・プロバイダの設定を変更します。モデルの順序付きリストを使用します。"
        }
      },
      "connections": {
        "add": {
          "value": "接続プロバイダの新しい名前および接続設定を入力します。"
        },
        "deactivate": {
          "value": "接続プロバイダを非アクティブ化し、ドメイン・ステータス・プーリングを停止します。"
        },
        "edit": {
          "value": "接続プロバイダの接続設定を変更します。"
        }
      },
      "models": {
        "add": {
          "value": "既存のモデル・ファイル・プロバイダの設定を入力します。アップロード・アイコンをクリックして、モデル・ファイルを参照します。"
        },
        "edit": {
          "value": "モデル・ファイル・プロバイダの設定を変更します。アイコンをクリックして、モデル・ファイルを参照します。"
        },
        "new": {
          "value": "新規WDTモデル・ファイルのプロバイダ名およびファイル名を入力し、アイコンをクリックして、ファイルを保存するディレクトリを選択します。"
        }
      },
      "project-busy": {
        "value": "プロジェクトに変更を加える前に、保存されていない変更を保存するか破棄してください"
      },
      "project": {
        "export": {
          "value": "新規プロジェクトの設定を入力します。"
        },
        "import": {
          "value": "ダウンロード・アイコンをクリックして、プロジェクトを参照します。"
        }
      },
      "proplist": {
        "add": {
          "value": "既存のプロパティ・リスト・プロバイダの設定を入力します。アップロード・アイコンをクリックして、プロパティ・ファイルを参照します。"
        },
        "edit": {
          "value": "プロパティ・リスト・プロバイダの設定を変更します。アイコンをクリックして、プロパティ・ファイルを参照します。"
        },
        "new": {
          "value": "新規プロパティ・リストのプロバイダ名およびファイル名を入力し、アイコンをクリックして、ファイルを保存するディレクトリを選択します。"
        }
      },
      "task": {
        "startup": {
          "value": "どの起動タスクを実行することに関心がありますか。"
        }
      }
    },
    "labels": {
      "composite": {
        "name": {
          "value": "WDTコンポジット・モデル・プロバイダ名"
        },
        "providers": {
          "value": "WDTモデル"
        }
      },
      "connections": {
        "header": {
          "value": "名前のないプロジェクト"
        },
        "name": {
          "value": "接続プロバイダ名"
        },
        "password": {
          "value": "パスワード"
        },
        "proxyOverride": {
          "value": "プロキシ・オーバーライド"
        },
        "username": {
          "value": "ユーザー名"
        }
      },
      "dropdown": {
        "none": {
          "value": "なし"
        }
      },
      "models": {
        "file": {
          "value": "WDTモデル・ファイル名"
        },
        "name": {
          "value": "WDTモデル・プロバイダ名"
        },
        "props": {
          "value": "WDT変数"
        }
      },
      "project": {
        "file": {
          "value": "プロジェクト・ファイル名"
        },
        "name": {
          "value": "プロジェクト名"
        }
      },
      "proplist": {
        "file": {
          "value": "プロパティ・リスト・ファイル名"
        },
        "name": {
          "value": "プロパティ・リスト・プロバイダ名"
        }
      },
      "provider": {
        "adminserver": {
          "value": "管理サーバー接続"
        },
        "model": {
          "value": "WDTモデルの追加"
        }
      }
    },
    "menus": {
      "composite": {
        "add": {
          "value": "WDTコンポジット・モデル・ファイル・プロバイダの追加"
        }
      },
      "connections": {
        "add": {
          "value": "管理サーバー接続プロバイダの追加"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "ドメインURL:"
              },
              "username": {
                "label": "ユーザー名:"
              },
              "version": {
                "label": "ドメイン・バージョン:"
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
      "models": {
        "add": {
          "value": "WDTモデル・ファイル・プロバイダの追加"
        },
        "new": {
          "value": "新規WDTモデル・ファイルのプロバイダの作成"
        }
      },
      "project": {
        "export": {
          "value": "プロバイダをプロジェクトとしてエクスポート..."
        },
        "import": {
          "value": "プロジェクトのインポート"
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
      }
    },
    "messages": {
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>ファイル名フィールドのパスを編集し、「OK」ボタンをクリックします。または、アップロード・アイコンをクリックして別のファイルを選択します。</p>"
        },
        "fixModelFile": {
          "detail": "<p>次に示す問題を修正したら、「OK」ボタンをクリックします。または、別のファイルを選択します。</p>"
        },
        "wktModelContent": {
          "detail": "<i>「コード・ビュー」</i>タブでモデル・エディタを使用して、問題を解決します。",
          "summary": "モデル・コンテンツの問題"
        },
        "yamlException": {
          "detail": "行 {1}、列{2}で{0}が発生しました"
        }
      },
      "export": {
        "failed": {
          "detail": "プロバイダを'{0}'プロジェクトとしてエクスポートできません。",
          "summary": "エクスポート失敗"
        }
      },
      "import": {
        "failed": {
          "detail": "'{0}'プロジェクト・ファイルをインポートできません。",
          "summary": "保存失敗"
        }
      },
      "response": {
        "modelsNotFound": {
          "detail": "構成済のWDTモデル'{0}'が見つかりません"
        },
        "nameAlreadyExist": {
          "detail": "'{0}'という名前のプロバイダはすでにこのプロジェクトに含まれています。"
        },
        "propListNotFound": {
          "detail": "WDT変数'{0}'が見つかりません"
        },
        "selectModels": {
          "detail": "WDTコンポジットを選択するには、まず、WDTコンポジットで使用されたすべてのWDTモデルを選択します。"
        }
      },
      "sso": {
        "secureContextRequired": {
          "detail": "URLではHTTPSプロトコルを指定するかlocalhostを使用する必要があります"
        }
      },
      "stage": {
        "failed": {
          "detail": "'{0}'プロバイダ・アイテムを作成できません。",
          "summary": "作成失敗"
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
      "use": {
        "failed": {
          "detail": "'{0}'プロバイダ・アイテムを使用できません。",
          "summary": "接続失敗"
        }
      }
    },
    "popups": {
      "info": {
        "composite": {
          "models": {
            "label": "モデル:"
          }
        },
        "domain": {
          "anyAttempt": {
            "label": "試行された接続:"
          },
          "connectTimeout": {
            "label": "接続タイムアウト:"
          },
          "consoleExtensionVersion": {
            "label": "コンソール拡張バージョン:"
          },
          "insecure": {
            "label": "非セキュア:"
          },
          "lastAttempt": {
            "label": "最後に成功した試行:"
          },
          "name": {
            "label": "ドメイン名:"
          },
          "proxyOverride": {
            "label": "プロキシ・オーバーライド:"
          },
          "readTimeout": {
            "label": "読取りタイムアウト:"
          },
          "roles": {
            "label": "ロール:"
          },
          "sso": {
            "label": "Web認証:"
          },
          "url": {
            "label": "ドメインURL:"
          },
          "username": {
            "label": "ユーザー名:"
          },
          "version": {
            "label": "ドメイン・バージョン:"
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
        "project": {
          "name": {
            "label": "プロジェクト名:"
          }
        },
        "proplist": {
          "file": {
            "label": "ファイル名:"
          }
        },
        "provider": {
          "id": {
            "label": "プロバイダID:"
          }
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
    "titles": {
      "add": {
        "composite": {
          "value": "新規WDTコンポジット・モデルのプロバイダの作成"
        },
        "connections": {
          "value": "管理サーバー接続のプロバイダの作成"
        },
        "models": {
          "value": "既存のWDTモデル・ファイルのプロバイダの作成"
        },
        "proplist": {
          "value": "既存のプロパティ・リストのプロバイダの作成"
        }
      },
      "edit": {
        "composite": {
          "value": "WDTコンポジット・モデル・プロバイダの編集"
        },
        "connections": {
          "value": "管理サーバー接続プロバイダの編集"
        },
        "models": {
          "value": "WDTモデル・ファイル・プロバイダの編集"
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
      "new": {
        "models": {
          "value": "新規WDTモデル・ファイルのプロバイダの作成"
        },
        "proplist": {
          "value": "新規プロパティ・リストのプロバイダの作成"
        }
      },
      "project-busy": {
        "value": "プロジェクトがビジーです"
      },
      "startup": {
        "task": {
          "value": "起動タスク"
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
      "cannotConnect": {
        "detail": "WebLogicドメイン{0}に接続できません。WebLogicが稼働していることを確認してください。",
        "summary": "接続の試行に失敗しました"
      },
      "lostConnection": {
        "detail": "接続が失われました。リフレッシュしてください。",
        "summary": "接続が失われました"
      }
    }
  },
  "wrc-footer": {
    "text": {
      "builtWith": "Oracle JETで構築",
      "copyrightLegal": "Copyright (c) 2020, 2026, Oracle and/or its affiliates.<br/>Oracle (r)、Java、MySQLおよびNetSuiteはオラクルおよびその関連会社の登録商標です。その他の社名、商品名等は各社の商標または登録商標である場合があります。<br/>"
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "back": {
        "label": "戻る"
      },
      "cancel": {
        "label": "取消"
      },
      "customize": {
        "label": "表のカスタマイズ"
      },
      "dashboard": {
        "label": "新規ダッシュボード"
      },
      "delete": {
        "label": "削除"
      },
      "finish": {
        "label": "作成"
      },
      "forward": {
        "label": "進む"
      },
      "new": {
        "label": "作成"
      },
      "save": {
        "label": "保存"
      },
      "savenow": {
        "label": "今すぐ保存"
      },
      "write": {
        "label": "ファイルのダウンロード"
      }
    },
    "icons": {
      "create": {
        "tooltip": "作成"
      },
      "help": {
        "tooltip": "ヘルプ・ページの表示の切替え"
      },
      "history": {
        "tooltip": "履歴の表示の切替え"
      },
      "instructions": {
        "tooltip": "インストラクションの表示の切替え"
      },
      "landing": {
        "tooltip": "ランディング・ページ"
      },
      "save": {
        "tooltip": "保存"
      },
      "sync": {
        "tooltip": "再ロード",
        "tooltipOn": "自動再ロードの停止"
      },
      "syncInterval": {
        "tooltip": "自動再ロードの間隔の設定"
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "拡張フィールドの表示"
      }
    },
    "icons": {
      "restart": {
        "tooltip": "サーバーまたはアプリケーションの再起動が必要です"
      },
      "wdtIcon": {
        "tooltip": "フィールド設定"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "{0}アイコンをクリックすると、サマリー・ヘルプと詳細ヘルプの間で切り替えることができます。"
      }
    },
    "messages": {
      "action": {
        "notAllowed": {
          "detail": "作成操作中はリクエストされたアクションを実行できません。作成操作を取り消すには「取消」ボタンをクリックします。",
          "summary": "アクションは許可されません"
        }
      },
      "savedTo": {
        "generic": "変更が保存されました。",
        "notSaved": "変更が検出されていないため、保存するものはありません。",
        "shoppingcart": "カートに変更が追加されました。"
      }
    }
  },
  "wrc-header": {
    "buttons": {
      "logout": {
        "label": "ログアウト"
      }
    },
    "icons": {
      "help": {
        "tooltip": "WebLogic Remote Console内部ドキュメントを開く"
      },
      "howDoI": {
        "tooltip": "「...の方法」タスクを開く"
      },
      "navtree": {
        "toggler": {
          "tooltip": "ナビゲーション・ツリーの表示の切替え"
        }
      },
      "theme": {
        "tooltip": "テーマの切替え"
      },
      "tips": {
        "tooltip": "ユーザー・ヒントの可視性の切替え"
      },
      "whatsNew": {
        "tooltip": "新機能!"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "メッセージ・センターを開く"
      },
      "theme": {
        "dark": {
          "value": "暗い"
        },
        "light": {
          "value": "明るい"
        }
      }
    },
    "region": {
      "ariaLabel": {
        "value": "アプリケーション・ヘッダー"
      }
    },
    "tooltips": {
      "appName": {
        "value": "クリックしてWebLogic Remote Consoleをリセットします"
      }
    }
  },
  "wrc-help-form": {
    "labels": {
      "relatedTopics": {
        "value": "<b>関連トピック:</b>"
      }
    },
    "tables": {
      "help": {
        "columns": {
          "header": {
            "description": "説明",
            "name": "名前"
          }
        },
        "label": "ヘルプ表"
      }
    },
    "tabs": {
      "actions": {
        "label": "アクション"
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
          "label": "起動タスク"
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "responseMessages": {
        "summary": "レスポンス・メッセージ"
      },
      "seeJavascriptConsole": {
        "detail": "特定の理由については、リモート・コンソール端末またはJavascriptコンソールを参照してください。"
      }
    }
  },
  "wrc-message-line": {
    "ariaLabel": {
      "region": {
        "value": "メッセージ行"
      }
    },
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
    },
    "messages": {
      "adminServerShutdown": {
        "details": "WebLogicドメインの管理サーバーに接続できません。"
      },
      "shutdownSequenceError": {
        "details": "管理対象サーバーを停止してから、管理サーバーを停止してください。"
      }
    }
  },
  "wrc-navigation": {
    "ariaLabel": {
      "navstrip": {
        "value": "プロバイダ・ツリー・メニュー"
      },
      "navtree": {
        "value": "プロバイダ・ツリー・ナビゲータ"
      },
      "panelResizer": {
        "value": "プロバイダ・ツリー・ナビゲータ・リサイザ。左右の矢印キーを使用して、ナビゲータのサイズを変更します"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "compositeConfig": {
        "tooltip": "WDTコンポジット・モデル"
      },
      "domainRuntime": {
        "tooltip": "モニタリング・ツリー"
      },
      "edit": {
        "tooltip": "ツリーの編集"
      },
      "model": {
        "tooltip": "WDTモデル"
      },
      "propertyList": {
        "tooltip": "プロパティ・リスト・エディタ"
      },
      "securityData": {
        "tooltip": "セキュリティ・データ・ツリー"
      },
      "serverConfig": {
        "tooltip": "構成ビュー・ツリー"
      }
    }
  },
  "wrc-navtree-toolbar": {
    "menu": {
      "collapseAll": {
        "value": "すべて縮小"
      },
      "useTreeMenusAsRootNodes": {
        "value": "ツリー・メニューをルート・ノードとして使用"
      }
    }
  },
  "wrc-navtree": {
    "labels": {
      "root": "ルート",
      "showless": "表示を減らす",
      "showmore": "すべて表示({0}件以上)"
    }
  },
  "wrc-pages-bookmark": {
    "labels": {
      "ariaLabel": {
        "value": "ページ・ブックマーク"
      }
    },
    "menus": {
      "bookmark": {
        "add": {
          "label": "ブックマークの追加"
        },
        "remove": {
          "label": "ブックマークの削除"
        },
        "show": {
          "label": "ページ・ブックマークの表示..."
        }
      }
    },
    "messages": {
      "pageAlreadyBookmarked": {
        "summary": "このページには、すでにブックマークがあります。"
      },
      "pagesBookmarkAdded": {
        "summary": "現在のページは正常にブックマークされました。"
      }
    }
  },
  "wrc-pdj-actions": {
    "labels": {
      "cannotDetermineExactCause": {
        "value": "正確な原因を特定できません。JavaScriptコンソールでヒントを確認してください。"
      }
    },
    "messages": {
      "action": {
        "actionNotPerformed": {
          "detail": "選択された1つ以上のアイテムで、'{0}'アクションを実行できません"
        },
        "actionNotPerformedNoRow": {
          "detail": "'{0}'アクションを実行できません"
        },
        "actionSucceeded": {
          "summary": "'{0}'アクションは正常に実行されました。"
        },
        "unableToPerform": {
          "detail": "'{1}'アクションを実行しようとしたときに、コンソール・バックエンド呼出しが'{0}'レスポンスを生成しました",
          "summary": "メッセージ"
        }
      }
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "'{0}'は使用できません。"
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
        "addButtonTooltip": "追加",
        "deleteButtonTooltip": "削除",
        "nameHeader": "プロパティ名",
        "valueHeader": "プロパティ値"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "create": {
            "label": "{0}の新規作成..."
          },
          "edit": {
            "label": "{0}の編集..."
          },
          "view": {
            "label": "{0}の表示..."
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
  "wrc-perspective": {
    "ariaLabel": {
      "region": {
        "breadcrumbs": {
          "value": "ブレッドクラム"
        }
      }
    },
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
          "label": "履歴エントリのクリア",
          "value": "履歴エントリのクリア"
        }
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "combination": {
        "value": "結合"
      },
      "dateTime": {
        "value": "書式: yyyy-MM-dd [HH:mm:ss [AM|PM]] (例: 2022-02-14 09:00:00 AM)"
      },
      "gmtOffset": {
        "value": "書式: GMT+|-h:mm (例: GMT-5:00)"
      },
      "monthDay": {
        "value": "範囲: -31から31"
      },
      "nodata": {
        "DefaultPolicy": {
          "value": "デフォルトのセキュリティ・ポリシー条件が定義されていません。"
        },
        "Policy": {
          "value": "<b>「+ 条件の追加」</b>ボタンを使用してポリシー条件を追加します。"
        }
      },
      "not": {
        "value": "なし"
      },
      "or": {
        "value": "または"
      },
      "time": {
        "value": "書式: HH:mm:ss (例: 14:22:47)"
      },
      "weekDay": {
        "value": "例: Sunday, Monday, Tuesday, ..."
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "結合",
            "expression": "条件句",
            "operator": "演算子"
          }
        },
        "dropdowns": {
          "operator": {
            "and": "および",
            "or": "または"
          }
        }
      }
    },
    "wizard": {
      "pages": {
        "choosePredicate": {
          "body": {
            "help": {
              "predicateList": "述部リストは、セキュリティ・ポリシー条件を構成するために使用可能な述部のリストです"
            },
            "labels": {
              "predicateList": "述部リスト"
            }
          },
          "header": {
            "instructions": "ドロップダウン・リストから新しい条件の述部を選択します。",
            "title": "述部の選択"
          }
        },
        "manageArgumentValues": {
          "body": {
            "help": {
              "negate": "条件を変換して逆の意味を持たせます(たとえば、\"次と等しい\"が\"次と等しくない\"になり、\"次に含まれる\"が\"次に含まれない\"になります)。"
            },
            "labels": {
              "conditionPhrase": "条件句",
              "negate": "否定条件"
            }
          },
          "header": {
            "instructions": "<i></i>フィールドへの入力を開始して引数値を追加するか、既存の引数値を検索します。[Enter]を押すと、入力した値がリストに追加されます。既存の引数値を編集するには、それをクリックし、ポップアップ入力フィールドを使用して変更します。",
            "title": "グループ述部"
          }
        }
      },
      "title": "ポリシー管理"
    }
  },
  "wrc-policy-management": {
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
    "contextMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "クリックした行の上に条件を追加..."
          },
          "at": {
            "label": "新しい最初の条件を追加..."
          },
          "below": {
            "label": "クリックした行の下に条件を追加..."
          }
        }
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>新しい条件の場所を指定するには、関連する条件の隣にチェックを入れ、<b>「+条件の追加」</b>ボタンをクリックします。</p>"
      }
    },
    "menus": {
      "action": {
        "addCondition": {
          "label": "条件の追加"
        },
        "combine": {
          "label": "結合"
        },
        "movedown": {
          "label": "下に移動"
        },
        "moveup": {
          "label": "上に移動"
        },
        "negate": {
          "label": "否定"
        },
        "remove": {
          "label": "削除"
        },
        "reset": {
          "label": "リセット"
        },
        "uncombine": {
          "label": "結合解除"
        }
      }
    },
    "messages": {
      "argumentValueHasWrongFormat": {
        "summary": "'{0}'フィールドに、書式設定が不適切なデータがあります。"
      },
      "conditionAlreadyExists": {
        "summary": "このセキュリティ・ポリシーには、選択した述部を使用した条件がすでに作成されているか、引数値が一致する条件がすでに存在します。"
      },
      "conditionHasNoArgValues": {
        "summary": "選択した条件には編集する引数値がありません。"
      },
      "requiredFieldsMissing": {
        "detail": "1つ以上の必須フィールドにデータが含まれていません。"
      }
    }
  },
  "wrc-recently-visited": {
    "labels": {
      "ariaLabel": {
        "value": "ページ履歴"
      },
      "page": {
        "value": "ページ"
      },
      "tab": {
        "value": "タブ"
      },
      "tree": {
        "value": "ツリー"
      }
    },
    "messages": {
      "pageNoLongerExists": {
        "detail1": "次の理由で、{0}ページにリダイレクトされました: ",
        "detail2": "{0}が別のユーザーによって削除されたか、存在しません。 ",
        "summary": "ページはすでに存在しません"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "commit": {
        "tooltip": "変更のコミット"
      },
      "discard": {
        "tooltip": "変更の破棄"
      }
    },
    "sections": {
      "additions": {
        "label": "追加"
      },
      "changeManager": {
        "label": "マネージャの変更"
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
  "wrc-startup-tasks": {
    "ariaLabel": {
      "cards": {
        "panel": {
          "value": "起動タスク"
        }
      }
    },
    "cards": {
      "addAdminServer": {
        "description": "このタスクは、管理サーバーへの接続を可能にするプロジェクト・リソースを作成します",
        "label": "管理サーバー接続プロバイダの追加"
      },
      "addPropertyList": {
        "description": "このタスクは、ローカル・ファイルシステムに格納されている.propertiesファイルの管理を可能にするプロジェクト・リソースを作成します",
        "label": "プロパティ・リスト・プロバイダの追加"
      },
      "addWdtComposite": {
        "description": "このタスクは、ローカル・ファイルシステムに存在するWDTモデル・ファイル断片の管理を可能にするプロジェクト・リソースを作成します",
        "label": "WDTコンポジット・モデル・ファイル・プロバイダの追加"
      },
      "addWdtModel": {
        "description": "このタスクは、ローカル・ファイルシステムに存在するWDTモデル・ファイルの管理を可能にするプロジェクト・リソースを作成します",
        "label": "WDTモデル・ファイル・プロバイダの追加"
      },
      "createPropertyList": {
        "description": "このタスクは、ローカル・ファイルシステムに格納される新規.propertiesファイルであるプロジェクト・リソースを作成します",
        "label": "新規プロパティ・リストのプロバイダの作成"
      },
      "createWdtModel": {
        "description": "このタスクは、ローカル・ファイルシステムに格納される新規WDTモデル・ファイルであるプロジェクト・リソースを作成します",
        "label": "新規WDTモデル・ファイルのプロバイダの作成"
      },
      "importProject": {
        "description": "このタスクは、すぐに使用または変更する準備ができているプロバイダを含む、以前にエクスポートされたプロジェクトをロードします",
        "label": "プロジェクトのインポート"
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "fields": {
        "interval": {
          "label": "自動再ロードの間隔:"
        }
      },
      "instructions": "自動再ロードの間隔は何秒にしますか。",
      "title": "自動再ロードの間隔の設定"
    }
  },
  "wrc-table-customizer": {
    "ariaLabel": {
      "availableColumns": {
        "list": {
          "value": "「使用可能な列」リスト"
        },
        "listItem": {
          "value": "「使用可能な列」リスト項目"
        },
        "title": {
          "value": "使用可能な列"
        }
      },
      "button": {
        "addAllRight": {
          "value": "「使用可能な列」リストのすべての項目を「選択済の列」リストに移動します"
        },
        "addToRight": {
          "value": "「使用可能な列」リストのチェック済項目を「選択済の列」リストに移動します"
        },
        "apply": {
          "value": "列のカスタマイズを表に適用します"
        },
        "cancel": {
          "value": "すべての列カスタマイズを取り消します"
        },
        "removeAll": {
          "value": "「選択済の列」リストのすべての項目を「使用可能な列」リストに移動します"
        },
        "removeRight": {
          "value": "「選択済の列」リストのチェック済項目を「使用可能な列」リストに移動します"
        },
        "reset": {
          "value": "「選択済の列」リストの列を、表カスタマイザがオープンに切り替わったときに存在していた列に戻します。"
        }
      },
      "selectedColumns": {
        "list": {
          "value": "「選択済の列」リスト"
        },
        "listItem": {
          "value": "「選択済の列」リスト項目"
        },
        "title": {
          "value": "選択済の列"
        }
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "clone": {
        "label": "クローン"
      },
      "customize": {
        "label": "表のカスタマイズ"
      },
      "delete": {
        "label": "削除"
      },
      "new": {
        "label": "新規"
      }
    },
    "icons": {
      "help": {
        "tooltip": "ヘルプ・ページの表示の切替え"
      },
      "history": {
        "tooltip": "履歴の表示の切替え"
      },
      "instructions": {
        "tooltip": "インストラクションの表示の切替え"
      },
      "landing": {
        "tooltip": "ランディング・ページ"
      },
      "sync": {
        "tooltip": "再ロード",
        "tooltipOn": "自動再ロードの停止"
      },
      "syncInterval": {
        "tooltip": "自動再ロードの間隔の設定"
      }
    },
    "instructions": {
      "selectItems": {
        "value": "'{0}'操作を実行するアイテムを選択します。"
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "detail": "自動再ロードの実行中は'{0}'アクションを実行できません。まず、'{1}'アイコンをクリックして停止してください。",
          "summary": "メッセージ"
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
      "noData": {
        "value": "データが見つかりません。"
      },
      "reloadHidden": {
        "value": "表を再ロードして現在の{0}値を表示します"
      },
      "totalRows": {
        "value": "合計行: {0}"
      }
    }
  },
  "wrc-unsaved-changes": {
    "prompts": {
      "uncommitedCreate": {
        "abandonForm": {
          "value": "新しい'{0}'インスタンスはWDTモデルに追加されていません。<br/><br/>続行する前に追加しますか。"
        }
      },
      "unsavedChanges": {
        "areYouSure": {
          "value": "変更を保存せずに{0}してもよろしいですか。"
        },
        "needDownloading": {
          "value": "'{0}'に対する変更はファイルにダウンロードされていません。<br/><br/>続行する前にダウンロードしますか。"
        },
        "saveBeforeExiting": {
          "value": "終了する前に変更を保存しますか。"
        },
        "willBeLost": {
          "value": "未保存の変更内容はすべて失われます。続行しますか。"
        }
      }
    },
    "titles": {
      "changesNeedDownloading": {
        "value": "変更がダウンロードされません"
      },
      "unsavedChanges": {
        "value": "保存されていない変更が検出されました"
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
        "details": "プロバイダからのデータの送受信に問題があります。続行する前に、アクセス可能であることを確認しください。",
        "summary": "接続の問題"
      },
      "pathNotFound": {
        "details": "'{0}'は、ローカル・ファイルシステムでアクセスできるファイルまたはディレクトリではありません。",
        "summary": "パスが見つかりません"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesDownloaded": {
        "summary": "変更は'{0}'ファイルに正常にダウンロードされました。"
      },
      "changesNotDownloaded": {
        "summary": "変更を'{0}'ファイルにダウンロードできません。"
      },
      "changesNotSaved": {
        "summary": "変更を'{0}'ファイルに保存できません。"
      },
      "changesSaved": {
        "summary": "変更は'{0}'ファイルに正常に保存されました。"
      },
      "verifyPathEntered": {
        "detail": "{0}フィールドをfalseに設定すると、ローカル・ファイルまたはディレクトリとして存在することを検証せずに、入力された値を受け入れます。"
      }
    },
    "wdtOptionsDialog": {
      "createPropsVariable": "モデル・トークン変数の作成",
      "default": "値の設定を解除",
      "enterModelToken": "モデル・トークンの入力",
      "enterUnresolvedReference": "未解決の参照の入力",
      "enterValue": "値の入力",
      "enterVariable": "変数の入力",
      "instructions": "トークンを入力して、選択可能なアイテムのリストに追加します。",
      "multiSelectUnset": "使用可能なアイテムのリストから値を選択",
      "propName": "変数名(必須)",
      "propValue": "変数値",
      "seeValue": "値",
      "selectPropsVariable": "モデル・トークン変数の選択",
      "selectSwitch": "値の切替え",
      "selectValue": "値の選択",
      "title": "編集: {0}",
      "variableName": "変数名(必須)",
      "variableValue": "変数値"
    }
  },
  "wrc": {
    "prefs": {
      "darkmode": "ダーク・モード"
    }
  }
});