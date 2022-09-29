define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic 원격 콘솔"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "온라인"
        },
        "offline": {
          "tooltip": "오프라인"
        },
        "detached": {
          "tooltip": "분리됨"
        },
        "unattached": {
          "tooltip": "연결되지 않음"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright © 2020, 2022, Oracle and/or its affiliates.<br/>Oracle은 Oracle Corporation 및/또는 그 자회사의 등록상표입니다. 기타 명칭들은 각 소속 회사의 상표일 수 있습니다.<br/>",
      "builtWith": "Oracle JET로 구축됨"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "정보 얻기"
      },
      "edit": {
        "tooltip": "관리"
      },
      "deactivate": {
        "tooltip": "Deactivate"
      },
      "delete": {
        "tooltip": "제거"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "이름 없는 프로젝트"
        },
        "name": {
          "value": "접속 제공자 이름"
        },
        "url": {
          "value": "URL"
        },
        "username": {
          "value": "사용자 이름"
        },
        "password": {
          "value": "비밀번호"
        }
      },
      "models": {
        "name": {
          "value": "WDT 모델 제공자 이름"
        },
        "file": {
          "value": "WDT 모델 파일 이름"
        },
        "props": {
          "value": "WDT 변수"
        }
      },
      "composite": {
        "name": {
          "value": "WDT 조합 모델 제공자 이름"
        },
        "providers": {
          "value": "WDT 모델"
        }
      },
      "proplist": {
        "name": {
          "value": "속성 목록 제공자 이름"
        },
        "file": {
          "value": "속성 목록 파일 이름"
        }
      },
      "project": {
        "name": {
          "value": "프로젝트 이름"
        },
        "file": {
          "value": "프로젝트 파일 이름"
        }
      },
      "provider": {
        "adminserver": {
          "value": "관리 서버 접속"
        },
        "model": {
          "value": "WDT 모델 추가"
        }
      },
      "dropdown": {
        "none": {
          "value": "없음"
        }
      }
    },
    "popups": {
      "info": {
        "provider": {
          "id": {
            "label": "제공자 ID:"
          }
        },
        "domain": {
          "name": {
            "label": "도메인 이름:"
          },
          "url": {
            "label": "도메인 URL:"
          },
          "version": {
            "label": "도메인 버전:"
          },
          "username": {
            "label": "사용자 이름:"
          },
          "roles": {
            "label": "롤:"
          },
          "connectTimeout": {
            "label": "접속 시간 초과:"
          },
          "readTimeout": {
            "label": "읽기 시간 초과:"
          },
          "anyAttempt": {
            "label": "시도된 접속:"
          },
          "lastAttempt": {
            "label": "마지막 시도 성공:"
          }
        },
        "model": {
          "file": {
            "label": "파일:"
          },
          "props": {
            "label": "변수:"
          }
        },
        "composite": {
          "models": {
            "label": "모델:"
          }
        },
        "proplist": {
          "file": {
            "label": "파일 이름:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "관리 서버 접속 제공자 추가"
        }
      },
      "models": {
        "add": {
          "value": "WDT 모델 파일 제공자 추가"
        },
        "new": {
          "value": "새 WDT 모델 파일용 제공자 생성"
        }
      },
      "composite": {
        "add": {
          "value": "WDT 조합 모델 파일 제공자 추가"
        }
      },
      "proplist": {
        "add": {
          "value": "속성 목록 제공자 추가"
        },
        "new": {
          "value": "새 속성 목록에 대한 제공자 생성"
        }
      },
      "providers": {
        "sort": {
          "value": "제공자 유형별 정렬"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "도메인 URL:"
              },
              "version": {
                "label": "도메인 버전:"
              },
              "username": {
                "label": "사용자 이름:"
              }
            }
          },
          "model": {
            "file": {
              "label": "파일:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "제공자를 프로젝트로 익스포트..."
        },
        "import": {
          "value": "프로젝트 임포트"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "접속 제공자에 대한 새 이름과 접속 설정을 입력합니다."
        },
        "edit": {
          "value": "접속 제공자에 대한 접속 설정을 수정합니다."
        }
      },
      "models": {
        "add": {
          "value": "기존 모델 파일 제공자에 대한 설정을 입력합니다. 업로드 아이콘을 눌러 모델 파일을 찾아봅니다."
        },
        "new": {
          "value": "새 WDT 모델 파일에 대한 제공자 이름과 파일 이름을 입력하고, 아이콘을 눌러 파일을 저장할 디렉토리를 선택합니다."
        },
        "edit": {
          "value": "모델 파일 제공자에 대한 설정을 수정합니다. 아이콘을 눌러 모델 파일을 찾아봅니다."
        }
      },
      "composite": {
        "add": {
          "value": "새 이름을 입력하고 조합 모델 제공자에 대해 정렬된 모델 목록을 선택합니다."
        },
        "edit": {
          "value": "조합 모델 제공자에 대한 설정을 수정합니다. 정렬된 모델 목록을 사용합니다."
        }
      },
      "proplist": {
        "add": {
          "value": "기존 속성 목록 제공자에 대한 설정을 입력합니다. 업로드 아이콘을 눌러 속성 파일을 찾아봅니다."
        },
        "new": {
          "value": "새 속성 목록에 대한 제공자 이름과 파일 이름을 입력하고, 아이콘을 눌러 파일을 저장할 디렉토리를 선택합니다."
        },
        "edit": {
          "value": "속성 목록 제공자에 대한 설정을 수정합니다. 아이콘을 눌러 속성 파일을 찾아봅니다."
        }
      },
      "project": {
        "export": {
          "value": "새 프로젝트에 대한 설정을 입력합니다."
        },
        "import": {
          "value": "다운로드 아이콘을 눌러 프로젝트를 찾아봅니다."
        }
      },
      "task": {
        "startup": {
          "value": "어떤 시작 태스크를 수행하고 싶습니까?"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "관리 서버 접속용 제공자 생성"
        },
        "models": {
          "value": "기존 WDT 모델 파일용 제공자 생성"
        },
        "composite": {
          "value": "새 WDT 조합 모델에 대한 제공자 생성"
        },
        "proplist": {
          "value": "기존 속성 목록에 대한 제공자 생성"
        }
      },
      "new": {
        "models": {
          "value": "새 WDT 모델 파일용 제공자 생성"
        },
        "proplist": {
          "value": "새 속성 목록에 대한 제공자 생성"
        }
      },
      "edit": {
        "connections": {
          "value": "관리 서버 접속 제공자 편집"
        },
        "models": {
          "value": "WDT 모델 파일 제공자 편집"
        },
        "composite": {
          "value": "WDT 조합 모델 제공자 편집"
        },
        "proplist": {
          "value": "속성 목록 제공자 편집"
        }
      },
      "export": {
        "project": {
          "value": "제공자를 프로젝트로 익스포트"
        }
      },
      "import": {
        "project": {
          "value": "프로젝트 임포트"
        }
      },
      "startup": {
        "task": {
          "value": "시작 태스크"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "익스포트 실패",
          "detail": "제공자를 ''{0}'' 프로젝트로 익스포트할 수 없습니다."
        }
      },
      "import": {
        "failed": {
          "summary": "저장 실패",
          "detail": "''{0}'' 프로젝트 파일을 임포트할 수 없습니다."
        }
      },
      "stage": {
        "failed": {
          "summary": "생성 실패",
          "detail": "''{0}'' 제공자 항목을 생성할 수 없습니다."
        }
      },
      "use": {
        "failed": {
          "summary": "접속 실패",
          "detail": "''{0}'' 제공자 항목을 사용할 수 없습니다."
        }
      },
      "upload": {
        "failed": {
          "detail": "WDT 모델 파일을 로드할 수 없음: {0}"
        },
        "props": {
          "failed": {
            "detail": "WDT 변수를 로드할 수 없음: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "''{0}'' 이름의 제공자가 이 프로젝트에 이미 있습니다!"
        },
        "modelsNotFound": {
          "detail": "구성된 WDT 모델 ''{0}''을(를) 찾을 수 없습니다."
        },
        "propListNotFound": {
          "detail": "WDT 변수 ''{0}''을(를) 찾을 수 없습니다."
        },
        "selectModels": {
          "detail": "WDT 조합을 선택하려면 먼저 WDT 조합에 사용된 모든 WDT 모델을 선택하십시오."
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>파일 이름 필드에서 경로를 편집하고 [확인] 단추를 누릅니다. 또는 업로드 아이콘을 누르고 다른 파일을 선택하십시오.</p>"
        },
        "fixModelFile": {
          "detail": "<p>아래 언급된 문제를 수정하고 [확인] 단추를 누릅니다. 또는 다른 파일을 선택하십시오.</p>"
        },
        "yamlException": {
          "detail": "{1}행, {2}열의 {0}"
        },
        "wktModelContent": {
          "summary": "모델 콘텐츠 문제",
          "detail": "<i>코드 뷰</i> 탭의 모델 편집기를 사용하여 문제를 해결하십시오."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "설정되지 않음"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "희소 템플리트 사용"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "트리 편집"
      },
      "view": {
        "tooltip": "구성 뷰 트리"
      },
      "monitoring": {
        "tooltip": "모니터링 트리"
      },
      "security": {
        "tooltip": "Security Data Tree"
      },
      "modeling": {
        "tooltip": "WDT 모델"
      },
      "composite": {
        "tooltip": "WDT 조합 모델"
      },
      "properties": {
        "tooltip": "속성 목록 편집기"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "홈",
      "configuration": "트리 편집",
      "view": "구성 뷰 트리",
      "monitoring": "모니터링 트리",
      "security": "Security Data Tree",
      "modeling": "WDT 모델",
      "composite": "WDT 조합 모델",
      "properties": "속성 목록"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "홈"
        },
        "preferences": {
          "label": "환경설정"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "쇼핑 카트"
        },
        "ataglance": {
          "label": "간략히 보기"
        },
        "projectmanagement": {
          "label": "제공자 관리"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "키오스크"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "내역"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "내역 지우기"
        }
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "내역"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "내역 지우기"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "{0}에서 실행 중"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "접속 끊김",
        "detail": "원격 콘솔 백엔드에 대한 접속이 끊겼습니다. 실행 중인지 확인하거나 재시작하고 링크를 다시 시도하십시오."
      },
      "cannotConnect": {
        "summary": "접속 시도 실패",
        "detail": "WebLogic 도메인 {0}에 접속할 수 없습니다. WebLogic이 실행 중인지 확인하십시오."
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "갤러리"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "트리 편집",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "구성 뷰 트리",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "모니터링 트리",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "WDT 모델 트리",
        "description": "<p>WebLogic Deploy Tooling 툴과 연관된 모델 파일을 유지 관리합니다.</p>"
      },
      "composite": {
        "label": "WDT 조합 모델 트리",
        "description": "<p>현재 사용 중인 일련의 결합된 WebLogic Deploy Tooling 모델 파일을 확인합니다.</p>"
      },
      "properties": {
        "label": "속성 목록 편집기",
        "description": "<p>속성 목록 파일에서 속성 집합을 보거나 수정합니다.</p>"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "변경사항 무시"
      },
      "commit": {
        "tooltip": "변경사항 커밋"
      }
    },
    "sections": {
      "changeManager": {
        "label": "변경 관리자"
      },
      "additions": {
        "label": "추가"
      },
      "modifications": {
        "label": "수정"
      },
      "removals": {
        "label": "제거"
      },
      "restart": {
        "label": "재시작"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "새로 만들기"
      },
      "clone": {
        "label": "복제"
      },
      "delete": {
        "label": "삭제"
      },
      "customize": {
        "label": "테이블 사용자정의"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "시작 페이지"
      },
      "history": {
        "tooltip": "내역 표시 토글"
      },
      "instructions": {
        "tooltip": "지침 표시 토글"
      },
      "help": {
        "tooltip": "도움말 페이지 표시 토글"
      },
      "sync": {
        "tooltip": "다시 로드",
        "tooltipOn": "자동 다시 로드 정지"
      },
      "syncInterval": {
        "tooltip": "자동 다시 로드 간격 설정"
      },
      "shoppingcart": {
        "tooltip": "눌러서 카트에 대한 작업 보기"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "변경사항 보기"
        },
        "discard": {
          "label": "변경사항 무시"
        },
        "commit": {
          "label": "변경사항 커밋"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "''{0}'' 작업을 수행할 항목을 선택하십시오."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "메시지",
          "detail": "자동 다시 로드가 실행 중인 동안에는 ''{0}'' 작업을 수행할 수 없습니다! 먼저 ''{1}'' 아이콘을 눌러 정지하십시오."
        }
      }
    },
    "labels": {
      "start": {
        "value": "시작"
      },
      "resume": {
        "value": "재개"
      },
      "suspend": {
        "value": "일시 중지"
      },
      "shutdown": {
        "value": "종료"
      },
      "restartSSL": {
        "value": "SSL 재시작"
      },
      "stop": {
        "value": "정지"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "숨겨진 열 표시"
      }
    },
    "labels": {
      "totalRows": {
        "value": "총 행: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "사용 가능한 열"
      },
      "selected": {
        "value": "선택한 열"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "열 부족",
          "detail": "적어도 하나의 선택된 열이 필요합니다."
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "저장"
      },
      "new": {
        "label": "생성"
      },
      "delete": {
        "label": "제거"
      },
      "back": {
        "label": "뒤로"
      },
      "next": {
        "label": "다음"
      },
      "finish": {
        "label": "생성"
      },
      "customize": {
        "label": "테이블 사용자정의"
      }
    },
    "icons": {
      "save": {
        "tooltip": "저장"
      },
      "create": {
        "tooltip": "생성"
      },
      "landing": {
        "tooltip": "시작 페이지"
      },
      "history": {
        "tooltip": "내역 표시 토글"
      },
      "instructions": {
        "tooltip": "지침 표시 토글"
      },
      "help": {
        "tooltip": "도움말 페이지 표시 토글"
      },
      "sync": {
        "tooltip": "다시 로드",
        "tooltipOn": "자동 다시 로드 정지"
      },
      "syncInterval": {
        "tooltip": "자동 다시 로드 간격 설정"
      },
      "shoppingcart": {
        "tooltip": "눌러서 카트에 대한 작업 보기"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "변경사항 보기"
        },
        "discard": {
          "label": "변경사항 무시"
        },
        "commit": {
          "label": "변경사항 커밋"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "고급 필드 표시"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "요약과 자세한 도움말 간에 토글하려면 {0} 아이콘을 누릅니다."
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
        "tooltip": "서버 또는 앱 재시작 필요"
      },
      "wdtIcon": {
        "tooltip": "WDT 설정"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "도움말 테이블",
        "columns": {
          "header": {
            "name": "이름",
            "description": "설명"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "불완전한 필수 필드",
        "detail": "{0}은(는) 필수 필드이지만, 값이 제공되지 않았거나 부적합한 값이 제공되었습니다."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "apply": {
        "label": "적용"
      },
      "reset": {
        "label": "재설정"
      },
      "ok": {
        "label": "확인"
      },
      "cancel": {
        "label": "취소"
      },
      "yes": {
        "label": "예"
      },
      "no": {
        "label": "아니오"
      },
      "choose": {
        "label": "선택"
      },
      "connect": {
        "label": "접속"
      },
      "add": {
        "label": "추가/보내기"
      },
      "edit": {
        "label": "편집/보내기"
      },
      "import": {
        "label": "임포트"
      },
      "export": {
        "label": "익스포트"
      },
      "write": {
        "label": "파일 다운로드"
      },
      "savenow": {
        "label": "지금 저장"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "축소"
      },
      "expand": {
        "value": "확장"
      },
      "choose": {
        "value": "파일 선택"
      },
      "clear": {
        "value": "선택한 파일 지우기"
      },
      "more": {
        "value": "추가 작업"
      },
      "download": {
        "value": "찾아보기"
      },
      "reset": {
        "value": "재설정"
      },
      "submit": {
        "value": "변경사항 제출"
      },
      "write": {
        "value": "파일 다운로드"
      },
      "pick": {
        "value": "디렉토리 선택"
      },
      "reload": {
        "value": "파일 다시 로드"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "파일 선택..."
      },
      "chooseDir": {
        "value": "디렉토리 선택..."
      }
    },
    "labels": {
      "info": {
        "value": "정보"
      },
      "warn": {
        "value": "경고"
      },
      "error": {
        "value": "오류"
      }
    },
    "placeholders": {
      "search": {
        "value": "검색"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "변경사항이 성공적으로 ''{0}'' 파일에 저장되었습니다!"
      },
      "changesNotSaved": {
        "summary": "''{0}'' 파일에 변경사항을 저장할 수 없습니다!"
      },
      "changesDownloaded": {
        "summary": "변경사항이 성공적으로 ''{0}'' 파일에 다운로드되었습니다!"
      },
      "changesNotDownloaded": {
        "summary": "''{0}'' 파일에 변경사항을 다운로드할 수 없습니다!"
      },
      "verifyPathEntered": {
        "detail": ". {0} 필드를 false로 설정하면 로컬 파일 또는 디렉토리인지 검증하지 않고 입력된 값을 수락합니다."
      }
    },
    "wdtOptionsDialog": {
      "title": "편집: {0}",
      "default": "기본값. (설정 해제)",
      "instructions": "선택 가능한 항목 목록에 추가할 토큰을 입력합니다.",
      "enterValue": "값 입력",
      "selectValue": "값 선택",
      "selectSwitch": "값 토글",
      "enterUnresolvedReference": "확인되지 않은 참조 입력",
      "enterModelToken": "모델 토큰 입력",
      "selectPropsVariable": "모델 토큰 변수 선택",
      "createPropsVariable": "모델 토큰 변수 생성",
      "propName": "변수 이름(필수)",
      "propValue": "변수 값",
      "enterVariable": "변수 입력",
      "variableName": "변수 이름(필수)",
      "variableValue": "변수 값",
      "multiSelectUnset": "\"기본값. (사용 가능한 항목 목록에서 선택)\""
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "저장되지 않은 변경사항이 감지됨"
      },
      "changesNeedDownloading": {
        "value": "변경사항이 다운로드되지 않음"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "저장되지 않은 변경사항이 모두 손실됩니다. 계속하겠습니까?"
        },
        "areYouSure": {
          "value": "변경사항을 저장하지 않고 종료하겠습니까?"
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
          "value": "새 ''{0}'' 인스턴스가 WDT 모델에 아직 추가되지 않았습니다.<br/><br/>계속하기 전에 추가하겠습니까?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "자동 다시 로드 간격 설정",
      "instructions": "자동 다시 로드 간격에 대한 시간(초)을 지정하십시오.",
      "fields": {
        "interval": {
          "label": "자동 다시 로드 간격:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "메시지",
          "detail": "''{1}''에서 지정된 작업을 수행하려고 시도할 때 콘솔 백엔드 호출이 ''{0}'' 응답을 생성했습니다."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "정확한 원인을 확인할 수 없습니다. 힌트를 얻으려면 JavaScript 콘솔을 확인하십시오."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "사용 가능",
        "chosen": "선택됨"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "속성 이름",
        "value": "속성 값"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "속성 이름",
        "valueHeader": "속성값",
        "addButtonTooltip": "추가",
        "deleteButtonTooltip": "삭제"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "{0} 보기..."
          },
          "create": {
            "label": "새 {0} 생성..."
          },
          "edit": {
            "label": "{0} 편집..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "기본값으로 복원"
    },
    "placeholder": {
      "value": "기본값"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}''을(를) 사용할 수 없습니다."
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
        "value": "서버 상태"
      },
      "systemStatus": {
        "value": "시스템 상태"
      },
      "healthState": {
        "failed": {
          "value": "실패"
        },
        "critical": {
          "value": "심각"
        },
        "overloaded": {
          "value": "오버로드됨"
        },
        "warning": {
          "value": "경고"
        },
        "ok": {
          "value": "확인"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "실행 중인 서버 건전성"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "이름"
        },
        "state": {
          "value": "상태"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "현재 백엔드에 연결할 수 없습니다."
      },
      "connectionMessage": {
        "summary": "접속 메시지"
      },
      "connectFailed": {
        "detail": "시도 실패: "
      },
      "badRequest": {
        "detail": "제출된 파일 또는 요청을 처리할 수 없습니다. "
      },
      "invalidCredentials": {
        "detail": "WebLogic 도메인 인증서가 부적합합니다. "
      },
      "invalidUrl": {
        "detail": "WebLogic 도메인 URL에 연결할 수 없습니다. "
      },
      "notInRole": {
        "detail": "시도 실패: 사용자가 관리자, 배치자, 운영자 또는 감독자가 아닙니다."
      },
      "notSupported": {
        "detail": "WebLogic 도메인은 지원되지 않습니다. "
      },
      "unexpectedStatus": {
        "detail": "예상치 않은 결과(상태: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "요청 실패",
          "detail": "콘솔 백엔드 호출에서 실패한 응답이 반환되었습니다."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "구체적인 원인은 원격 콘솔 터미널 또는 JavaScript 콘솔을 참조하십시오."
      },
      "responseMessages": {
        "summary": "응답 메시지"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "변경 관리자에 액세스할 수 없습니다!"
      },
      "changesCommitted": {
        "summary": "변경사항이 성공적으로 커밋되었습니다!"
      },
      "changesNotCommitted": {
        "summary": "변경사항을 커밋할 수 없습니다!"
      },
      "changesDiscarded": {
        "summary": "변경사항이 성공적으로 무시되었습니다!"
      },
      "changesNotDiscarded": {
        "summary": "변경사항을 무시할 수 없습니다!"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "예상치 않은 오류 응답"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "접속 문제",
        "details": "제공자로부터 데이터를 전송 및 수신하는 데 문제가 있습니다! 액세스 가능한지 확인하고 다시 시도하십시오."
      }
    }
  }
});