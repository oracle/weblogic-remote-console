define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "icons": {
      "connectivity": {
        "online": {
          "tooltip": "On-line"
        },
        "offline": {
          "tooltip": "Off-line"
        },
        "detached": {
          "tooltip": "Desanexado"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright \\u00A9 2020, 2021, Oracle e/ou suas empresas afiliadas. <br>Oracle \\u00E9 uma marca comercial registrada da Oracle Corporation e/ou de suas empresas afiliadas.<br> Outros nomes podem ser marcas comerciais de seus respectivos propriet\\u00E1rios.<br/>",
      "builtWith": "Criado com o Oracle JET"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Obter Informa\\u00E7\\u00F5es"
      },
      "edit": {
        "tooltip": "Manage"
      },
      "delete": {
        "tooltip": "Remover"
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
          "value": "Nome do Usu\\u00E1rio"
        },
        "password": {
          "value": "Senha"
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
          "value": "Nome do Projeto"
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
            "label": "Id do Provedor:"
          }
        },
        "domain": {
          "name": {
            "label": "Nome do Dom\\u00EDnio:"
          },
          "url": {
            "label": "URL de Dom\\u00EDnio:"
          },
          "version": {
            "label": "Vers\\u00E3o do Dom\\u00EDnio:"
          },
          "username": {
            "label": "Username:"
          },
          "connectTimeout": {
            "label": "Timeout da Conex\\u00E3o:"
          },
          "readTimeout": {
            "label": "Time-out p/Leitura:"
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
                "label": "URL de Dom\\u00EDnio:"
              },
              "version": {
                "label": "Vers\\u00E3o do Dom\\u00EDnio:"
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
          "value": "Importar Projeto"
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
          "value": "Importar Projeto"
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
        "fileNotSet": "N\\u00E3o definido"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Editar \\u00C1rvore"
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
      "home": "In\\u00EDcio",
      "configuration": "Editar \\u00C1rvore",
      "view": "Configuration View Tree",
      "monitoring": "Monitoring Tree",
      "modeling": "WDT Model"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "In\\u00EDcio"
        },
        "preferences": {
          "label": "Prefer\\u00EAncias"
        },
        "search": {
          "label": "Pesquisar"
        }
      }
    }
  },
  "wrc-ancillary-content": {
    "tabstrip": {
      "tabs": {
        "shoppingcart": {
          "label": "Carrinho de Compras"
        },
        "ataglance": {
          "label": "Vis\\u00E3o R\\u00E1pida"
        },
        "projectmanagement": {
          "label": "Provider Management"
        }
      }
    },
    "icons": {
      "kiosk": {
        "tooltip": "Quiosque"
      }
    }
  },
  "wrc-perspective": {
    "icons": {
      "history": {
        "tooltip": "Hist\\u00F3rico"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Limpar Hist\\u00F3rico"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Dados N\\u00E3o Dispon\\u00EDveis"
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Hist\\u00F3rico"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Limpar Hist\\u00F3rico"
        }
      }
    },
    "messages": {
      "dataNotAvailable": {
        "summary": "Dados N\\u00E3o Dispon\\u00EDveis"
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "executando \\u00E0s {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Conex\\u00E3o Perdida",
        "detail": "Connection to remote console backend was lost. Ensure that it is running or restart it and try the link again."
      },
      "cannotConnect": {
        "summary": "Falha na Tentativa de Conex\\u00E3o",
        "detail": "N\\u00E3o \\u00E9 poss\\u00EDvel estabelecer conex\\u00E3o com o Dom\\u00EDnio do WebLogic {0}; verifique se o WebLogic est\\u00E1 em execu\\u00E7\\u00E3o."
      }
    },
    "dialog1": {
      "title": "Estabelecer Conex\\u00E3o com o Dom\\u00EDnio do WebLogic",
      "instructions": "Digite as credenciais do usu\\u00E1rio admin e o URL do dom\\u00EDnio do WebLogic:",
      "labels": {
        "url": "URL"
      },
      "buttons": {
        "connect": {
          "label": "Conectar"
        }
      }
    }
  },
  "wrc-home": {
    "tabstrip": {
      "tabs": {
        "gallery": {
          "label": "Galeria"
        }
      }
    }
  },
  "wrc-gallery": {
    "cards": {
      "configuration": {
        "label": "Editar \\u00C1rvore",
        "description": "<p>Mantenha a configura\\u00E7\\u00E3o do dom\\u00EDnio do WebLogic com a qual voc\\u00EA est\\u00E1 trabalhando no momento.</p>"
      },
      "view": {
        "label": "Configuration View Tree",
        "description": "<p>Examine a configura\\u00E7\\u00E3o somente para leitura do dom\\u00EDnio do WebLogic com a qual voc\\u00EA est\\u00E1 trabalhando no momento.</p>"
      },
      "monitoring": {
        "label": "Monitoring Tree",
        "description": "<p>Exiba informa\\u00E7\\u00F5es de MBean de runtime para recursos selecionados no dom\\u00EDnio do WebLogic com o qual voc\\u00EA est\\u00E1 trabalhando no momento.</p>"
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
        "tooltip": "Descartar Altera\\u00E7\\u00F5es"
      },
      "commit": {
        "tooltip": "Fazer Commit de Altera\\u00E7\\u00F5es"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Gerenciador de Altera\\u00E7\\u00F5es"
      },
      "additions": {
        "label": "Inclus\\u00F5es"
      },
      "modifications": {
        "label": "Modifica\\u00E7\\u00F5es"
      },
      "removals": {
        "label": "Remo\\u00E7\\u00F5es"
      },
      "restart": {
        "label": "Reiniciar"
      }
    }
  },
  "wrc-table-toolbar": {
    "buttons": {
      "new": {
        "label": "Novo"
      },
      "clone": {
        "label": "Clonar"
      },
      "delete": {
        "label": "Excluir"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "P\\u00E1gina de Destino"
      },
      "history": {
        "tooltip": "Alternar visibilidade do hist\\u00F3rico"
      },
      "instructions": {
        "tooltip": "Alternar visibilidade das instru\\u00E7\\u00F5es"
      },
      "help": {
        "tooltip": "Alternar visibilidade da p\\u00E1gina de Ajuda"
      },
      "sync": {
        "tooltip": "Recarregar",
        "tooltipOn": "Interromper Recarga Autom\\u00E1tica"
      },
      "syncInterval": {
        "tooltip": "Definir Intervalo de Recarga Autom\\u00E1tica"
      },
      "shoppingcart": {
        "tooltip": "Clique para ver as a\\u00E7\\u00F5es do carrinho"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Exibir Altera\\u00E7\\u00F5es"
        },
        "discard": {
          "label": "Descartar Altera\\u00E7\\u00F5es"
        },
        "commit": {
          "label": "Fazer Commit de Altera\\u00E7\\u00F5es"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Selecione os itens nos quais voc\\u00EA deseja executar a opera\\u00E7\\u00E3o ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Mensagem",
          "detail": "N\\u00E3o \\u00E9 poss\\u00EDvel executar a a\\u00E7\\u00E3o ''{0}'' enquanto a recarga autom\\u00E1tica est\\u00E1 em execu\\u00E7\\u00E3o! Clique no \\u00EDcone ''{1}'' para interromp\\u00EA-la primeiro."
        }
      }
    },
    "labels": {
      "start": {
        "value": "Inicial"
      },
      "resume": {
        "value": "Retomar"
      },
      "suspend": {
        "value": "Suspender"
      },
      "shutdown": {
        "value": "Fazer shutdown"
      },
      "restartSSL": {
        "value": "Reiniciar SSL"
      },
      "stop": {
        "value": "Interromper"
      }
    }
  },
  "wrc-table": {
    "checkboxes": {
      "showHiddenColumns": {
        "label": "Mostrar Colunas Ocultas"
      }
    },
    "actionsDialog": {
      "buttons": {
        "cancel": {
          "label": "Cancelar"
        }
      }
    }
  },
  "wrc-form-toolbar": {
    "buttons": {
      "save": {
        "label": "Salvar"
      },
      "new": {
        "label": "Criar"
      },
      "delete": {
        "label": "Remover"
      },
      "back": {
        "label": "Voltar"
      },
      "next": {
        "label": "Pr\\u00F3ximo"
      },
      "finish": {
        "label": "Criar"
      }
    },
    "icons": {
      "save": {
        "tooltip": "Salvar"
      },
      "create": {
        "tooltip": "Criar"
      },
      "landing": {
        "tooltip": "P\\u00E1gina de Destino"
      },
      "history": {
        "tooltip": "Alternar visibilidade do hist\\u00F3rico"
      },
      "instructions": {
        "tooltip": "Alternar visibilidade das instru\\u00E7\\u00F5es"
      },
      "help": {
        "tooltip": "Alternar visibilidade da p\\u00E1gina de Ajuda"
      },
      "sync": {
        "tooltip": "Recarregar",
        "tooltipOn": "Interromper Recarga Autom\\u00E1tica"
      },
      "syncInterval": {
        "tooltip": "Definir Intervalo de Recarga Autom\\u00E1tica"
      },
      "shoppingcart": {
        "tooltip": "Clique para ver as a\\u00E7\\u00F5es do carrinho"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Exibir Altera\\u00E7\\u00F5es"
        },
        "discard": {
          "label": "Descartar Altera\\u00E7\\u00F5es"
        },
        "commit": {
          "label": "Fazer Commit de Altera\\u00E7\\u00F5es"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Mostrar Campos Avan\\u00E7ados"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Clique no \\u00EDcone {0} para alternar entre a ajuda resumida e a detalhada."
      }
    },
    "messages": {
      "save": "Altera\\u00E7\\u00F5es adicionadas ao carrinho"
    },
    "icons": {
      "restart": {
        "tooltip": "Reinicializa\\u00E7\\u00E3o do Servidor ou do Aplicativo Obrigat\\u00F3ria"
      },
      "wdtIcon": {
        "tooltip": "WDT Settings"
      }
    }
  },
  "wrc-help-form": {
    "tables": {
      "help": {
        "label": "Tabela de Ajuda",
        "columns": {
          "header": {
            "name": "Nome",
            "description": "Descri\\u00E7\\u00E3o"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campos Obrigat\\u00F3rios Incompletos",
        "detail": "O campo {0} \\u00E9 obrigat\\u00F3rio, mas nenhum valor foi fornecido."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "ok": {
        "label": "OK"
      },
      "cancel": {
        "label": "Cancelar"
      },
      "yes": {
        "label": "Sim"
      },
      "no": {
        "label": "N\\u00E3o"
      },
      "choose": {
        "label": "Choose"
      },
      "connect": {
        "label": "Conectar"
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
        "label": "Atualizar Arquivo"
      }
    },
    "tooltips": {
      "collapse": {
        "value": "Contrair"
      },
      "expand": {
        "value": "Expandir"
      },
      "choose": {
        "value": "Escolher Arquivo"
      },
      "clear": {
        "value": "Remover Arquivo Escolhido"
      },
      "more": {
        "value": "Mais A\\u00E7\\u00F5es"
      },
      "download": {
        "value": "Browse"
      },
      "reset": {
        "value": "Reset"
      },
      "submit": {
        "value": "Submeter Altera\\u00E7\\u00F5es"
      },
      "write": {
        "value": "Atualizar Arquivo"
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
      "enterValue": "Informar Valor",
      "selectValue": "Selecionar Valor",
      "selectSwitch": "Alternar Valor",
      "enterUnresolvedReference": "Enter Unresolved Reference",
      "enterModelToken": "Enter Model Token"
    }
  },
  "wrc-unsaved-changes": {
    "confirmDialog": {
      "title": "Altera\\u00E7\\u00F5es N\\u00E3o Salvas Detectadas"
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Todas as altera\\u00E7\\u00F5es n\\u00E3o salvas ser\\u00E3o perdidas. Continuar?"
        },
        "areYouSure": {
          "value": "Tem certeza de que deseja sair sem salvar as altera\\u00E7\\u00F5es?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Definir Intervalo de Recarga Autom\\u00E1tica",
      "instructions": "Quantos segundos voc\\u00EA deseja configurar para o intervalo de recarga autom\\u00E1tica?",
      "fields": {
        "interval": {
          "label": "Intervalo de Recarga Autom\\u00E1tica:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Mensagem",
          "detail": "A chamada de backend da console gerou uma resposta ''{0}'' durante a tentativa de executar a a\\u00E7\\u00E3o especificada em ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "N\\u00E3o \\u00E9 poss\\u00EDvel determinar a causa exata. Verifique as dicas na Console do JavaScript."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Dispon\\u00EDveis",
        "chosen": "Escolhidos"
      }
    }
  },
  "wrc-pdj-options-sources": {
    "menus": {
      "more": {
        "optionsSources": {
          "view": {
            "label": "Exibir {0}..."
          },
          "create": {
            "label": "Criar Novo(a) {0}..."
          },
          "edit": {
            "label": "Editar {0}..."
          }
        }
      }
    }
  },
  "wrc-pdj-unset": {
    "menu": {
      "label": "Restaurar para o padr\\u00E3o"
    },
    "placeholder": {
      "value": "padr\\u00E3o"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "summary": "Mensagem",
        "detail": "O RDJ n\\u00E3o continha um campo ''notFoundMessage'' para o item ''{0}''."
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
        "value": "Estados do Servidor"
      },
      "systemStatus": {
        "value": "Status do Sistema"
      },
      "healthState": {
        "failed": {
          "value": "Com falha"
        },
        "critical": {
          "value": "Cr\\u00EDtico"
        },
        "overloaded": {
          "value": "Sobrecarregado"
        },
        "warning": {
          "value": "Advert\\u00EAncia"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Condi\\u00E7\\u00E3o dos Servidores em Execu\\u00E7\\u00E3o a partir de"
      }
    },
    "headers": {
      "serverStates": {
        "name": {
          "value": "Nome"
        },
        "state": {
          "value": "Estado"
        }
      }
    }
  },
  "wrc-data-operations": {
    "messages": {
      "backendNotReachable": {
        "detail": "O backend n\\u00E3o est\\u00E1 acess\\u00EDvel no momento."
      },
      "connectionMessage": {
        "summary": "Mensagem de Conex\\u00E3o"
      },
      "connectFailed": {
        "detail": "Attempt Failed: "
      },
      "badRequest": {
        "detail": "Unable to process the submitted file or request "
      },
      "invalidCredentials": {
        "detail": "As credenciais do Dom\\u00EDnio do WebLogic n\\u00E3o s\\u00E3o v\\u00E1lidas "
      },
      "invalidUrl": {
        "detail": "O URL do Dom\\u00EDnio do WebLogic n\\u00E3o est\\u00E1 acess\\u00EDvel "
      },
      "notSupported": {
        "detail": "N\\u00E3o h\\u00E1 suporte para o Dom\\u00EDnio do WebLogic "
      },
      "unexpectedStatus": {
        "detail": "Resultado inesperado: (status: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Solicita\\u00E7\\u00E3o Malsucedida",
          "detail": "Uma resposta indicadora de falha foi retornada de uma chamada de backend da console."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Consulte o terminal da console remota ou a console do Javascript para ver o(s) motivo(s) espec\\u00EDfico(s)."
      },
      "responseMessages": {
        "summary": "Mensagens de Resposta"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "N\\u00E3o \\u00E9 poss\\u00EDvel acessar o gerenciador de altera\\u00E7\\u00F5es!"
      },
      "changesCommitted": {
        "summary": "O commit das altera\\u00E7\\u00F5es foi feito com sucesso!"
      },
      "changesNotCommitted": {
        "summary": "N\\u00E3o \\u00E9 poss\\u00EDvel fazer commit das altera\\u00E7\\u00F5es!"
      },
      "changesDiscarded": {
        "summary": "As altera\\u00E7\\u00F5es foram descartadas com sucesso!"
      },
      "changesNotDiscarded": {
        "summary": "N\\u00E3o \\u00E9 poss\\u00EDvel descartar as altera\\u00E7\\u00F5es!"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Resposta ao Erro Inesperada"
      }
    }
  }
});