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
        },
        "unattached": {
          "tooltip": "Desanexada"
        }
      }
    }
  },
  "wrc-footer": {
    "text": {
      "copyrightLegal": "Copyright © 2020, 2022, Oracle e/ou suas empresas afiliadas. <br>Oracle é uma marca comercial registrada da Oracle Corporation e/ou de suas empresas afiliadas.<br> Outros nomes podem ser marcas comerciais de seus respectivos proprietários.<br/>",
      "builtWith": "Criado com o Oracle JET"
    }
  },
  "wrc-data-providers": {
    "icons": {
      "info": {
        "tooltip": "Obter Informações"
      },
      "edit": {
        "tooltip": "Gerenciar"
      },
      "deactivate": {
        "tooltip": "Deactivate"
      },
      "delete": {
        "tooltip": "Remover"
      }
    },
    "labels": {
      "connections": {
        "header": {
          "value": "Projeto não Nomeado"
        },
        "name": {
          "value": "Nome do Provedor de Conexão"
        },
        "url": {
          "value": "URL"
        },
        "username": {
          "value": "Nome do Usuário"
        },
        "password": {
          "value": "Senha"
        }
      },
      "models": {
        "name": {
          "value": "Nome do Provedor de Modelo de WDT"
        },
        "file": {
          "value": "Nome do Arquivo de Modelo de WDT"
        },
        "props": {
          "value": "Variáveis de WDT"
        }
      },
      "composite": {
        "name": {
          "value": "Nome do Provedor de Modelo Composto de WDT"
        },
        "providers": {
          "value": "Modelos de WDT"
        }
      },
      "proplist": {
        "name": {
          "value": "Nome do Provedor da Lista de Propriedades"
        },
        "file": {
          "value": "Nome do Arquivo da Lista de Propriedades"
        }
      },
      "project": {
        "name": {
          "value": "Nome do Projeto"
        },
        "file": {
          "value": "Nome do Arquivo do Projeto"
        }
      },
      "provider": {
        "adminserver": {
          "value": "Conexão do Servidor de Administração"
        },
        "model": {
          "value": "Adicionar Modelo de WDT"
        }
      },
      "dropdown": {
        "none": {
          "value": "Nenhum"
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
            "label": "Nome do Domínio:"
          },
          "url": {
            "label": "URL de Domínio:"
          },
          "version": {
            "label": "Versão do Domínio:"
          },
          "username": {
            "label": "Nome do usuário:"
          },
          "roles": {
            "label": "Atribuições:"
          },
          "connectTimeout": {
            "label": "Timeout da Conexão:"
          },
          "readTimeout": {
            "label": "Time-out p/Leitura:"
          },
          "anyAttempt": {
            "label": "Quaisquer Conexões Tentadas:"
          },
          "lastAttempt": {
            "label": "Última Tentativa Bem-sucedida:"
          }
        },
        "model": {
          "file": {
            "label": "Arquivo:"
          },
          "props": {
            "label": "Variáveis:"
          }
        },
        "composite": {
          "models": {
            "label": "Modelos:"
          }
        },
        "proplist": {
          "file": {
            "label": "Nome do arquivo:"
          }
        }
      }
    },
    "menus": {
      "connections": {
        "add": {
          "value": "Adicionar Provedor de Conexão do Servidor de Administração"
        }
      },
      "models": {
        "add": {
          "value": "Adicionar Provedor de Arquivo de Modelo de WDT"
        },
        "new": {
          "value": "Criar Provedor para Novo Arquivo de Modelo de WDT"
        }
      },
      "composite": {
        "add": {
          "value": "Adicionar Provedor de Arquivo de Modelo Composto de WDT"
        }
      },
      "proplist": {
        "add": {
          "value": "Adicionar Provedor de Lista de Propriedades"
        },
        "new": {
          "value": "Criar Provedor para Nova Lista de Propriedades"
        }
      },
      "providers": {
        "sort": {
          "value": "Classificar por Tipo de Provedor"
        }
      },
      "context": {
        "info": {
          "connection": {
            "domain": {
              "url": {
                "label": "URL de Domínio:"
              },
              "version": {
                "label": "Versão do Domínio:"
              },
              "username": {
                "label": "Nome de usuário:"
              }
            }
          },
          "model": {
            "file": {
              "label": "Arquivo:"
            }
          }
        }
      },
      "project": {
        "export": {
          "value": "Exportar Provedores como Projeto..."
        },
        "import": {
          "value": "Importar Projeto"
        }
      }
    },
    "instructions": {
      "connections": {
        "add": {
          "value": "Digite as novas definições de nome e conectividade do provedor de conexão."
        },
        "edit": {
          "value": "Modifique as definições de conexão do provedor de conexão."
        }
      },
      "models": {
        "add": {
          "value": "Digite as definições do provedor de arquivo de modelo existente. Clique no ícone de upload para procurar o arquivo de modelo."
        },
        "new": {
          "value": "Digite o nome do provedor e o nome do usuário para o novo arquivo de modelo de WDT; em seguida, clique no ícone para selecionar o diretório no qual salvar o arquivo."
        },
        "edit": {
          "value": "Modifique as definições do provedor de arquivo de modelo. Clique no ícone para procurar o arquivo de modelo."
        }
      },
      "composite": {
        "add": {
          "value": "Digite um novo nome e selecione uma lista de modelos ordenada para o provedor de modelo composto."
        },
        "edit": {
          "value": "Modifique as definições para o provedor de modelo composto. Use uma lista ordenada de modelos."
        }
      },
      "proplist": {
        "add": {
          "value": "Digite as definições do provedor de lista de propriedades existente. Clique no ícone de upload para procurar um arquivo de propriedades."
        },
        "new": {
          "value": "Digite o nome do provedor e o nome do arquivo para uma nova lista de propriedades; em seguida, clique no ícone para selecionar o diretório no qual salvar o arquivo."
        },
        "edit": {
          "value": "Modifique as definições do provedor de lista de propriedades. Clique no ícone para procurar um arquivo de propriedades."
        }
      },
      "project": {
        "export": {
          "value": "Digite as definições do novo projeto."
        },
        "import": {
          "value": "Clique no ícone de download para procurar o projeto."
        }
      },
      "task": {
        "startup": {
          "value": "Você está interessado na execução de qual tarefa de inicialização?"
        }
      }
    },
    "titles": {
      "add": {
        "connections": {
          "value": "Criar Provedor para Conexão do Servidor de Administração"
        },
        "models": {
          "value": "Criar Provedor para Arquivo de Modelo de WDT Existente"
        },
        "composite": {
          "value": "Criar Provedor para Novo Modelo Composto de WDT"
        },
        "proplist": {
          "value": "Criar Provedor para Lista de Propriedades Existente"
        }
      },
      "new": {
        "models": {
          "value": "Criar Provedor para Novo Arquivo de Modelo de WDT"
        },
        "proplist": {
          "value": "Criar Provedor para Nova Lista de Propriedades"
        }
      },
      "edit": {
        "connections": {
          "value": "Editar Provedor de Conexão do Servidor de Administração"
        },
        "models": {
          "value": "Editar Provedor de Arquivo de Modelo de WDT"
        },
        "composite": {
          "value": "Editar Provedor de Arquivo de Modelo Composto de WDT"
        },
        "proplist": {
          "value": "Editar Provedor de Lista de Propriedades"
        }
      },
      "export": {
        "project": {
          "value": "Exportar Provedores como Projeto"
        }
      },
      "import": {
        "project": {
          "value": "Importar Projeto"
        }
      },
      "startup": {
        "task": {
          "value": "Tarefa de Inicialização"
        }
      }
    },
    "messages": {
      "export": {
        "failed": {
          "summary": "Exportação Malsucedida",
          "detail": "Não é possível exportar provedores como projeto ''{0}''."
        }
      },
      "import": {
        "failed": {
          "summary": "Salvamento Malsucedido",
          "detail": "Não é possível importar o arquivo do projeto ''{0}''."
        }
      },
      "stage": {
        "failed": {
          "summary": "Criação Malsucedida",
          "detail": "Não é possível criar o item do provedor ''{0}''."
        }
      },
      "use": {
        "failed": {
          "summary": "Conexão Malsucedida",
          "detail": "Não é possível usar o item do provedor ''{0}''."
        }
      },
      "upload": {
        "failed": {
          "detail": "Não é possível carregar o arquivo de modelo de WDT: {0}"
        },
        "props": {
          "failed": {
            "detail": "Não é possível carregar as variáveis de WDT: {0}"
          }
        }
      },
      "response": {
        "nameAlreadyExist": {
          "detail": "Já existe o provedor ''{0}'' neste projeto!"
        },
        "modelsNotFound": {
          "detail": "Não é possível localizar os modelos de WDT configurados ''{0}''"
        },
        "propListNotFound": {
          "detail": "Não é possível localizar as variáveis de WDT: ''{0}''"
        },
        "selectModels": {
          "detail": "Para selecionar o Composto WDT, primeiro selecione todos os Modelos de WDT usados pelo Composto WDT."
        }
      },
      "correctiveAction": {
        "filePathNotFound": {
          "detail": "<p>Edite o caminho no campo de nome de arquivo. Em seguida, clique no botão OK. Como alternativa, clique no ícone de upload e escolha outro arquivo.</p>"
        },
        "fixModelFile": {
          "detail": "<p>Corrija o(s) problema(s) mencionado(s) abaixo e, em seguida, clique no botão OK. Como alternativa, escolha outro arquivo.</p>"
        },
        "yamlException": {
          "detail": "{0} na linha {1}, coluna {2}"
        },
        "wktModelContent": {
          "summary": "Problemas de Conteúdo do Modelo",
          "detail": "Use o editor de modelos na guia <i>View de Código</i> para resolver problemas."
        }
      }
    },
    "prompts": {
      "info": {
        "fileNotSet": "Não definido"
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usar Modelo Esparso"
      }
    }
  },
  "wrc-navstrip": {
    "icons": {
      "configuration": {
        "tooltip": "Editar Árvore"
      },
      "view": {
        "tooltip": "Árvore da View de Configuração"
      },
      "monitoring": {
        "tooltip": "Árvore de Monitoramento"
      },
      "security": {
        "tooltip": "Security Data Tree"
      },
      "modeling": {
        "tooltip": "Modelo de WDT"
      },
      "composite": {
        "tooltip": "Modelo Composto de WDT"
      },
      "properties": {
        "tooltip": "Editor de Lista de Propriedades"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Início",
      "configuration": "Editar Árvore",
      "view": "Árvore da View de Configuração",
      "monitoring": "Árvore de Monitoramento",
      "security": "Security Data Tree",
      "modeling": "Modelo de WDT",
      "composite": "Modelo Composto de WDT",
      "properties": "Lista de Propriedades"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Início"
        },
        "preferences": {
          "label": "Preferências"
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
          "label": "Visão Rápida"
        },
        "projectmanagement": {
          "label": "Gerenciamento de Provedores"
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
        "tooltip": "Histórico"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Limpar Histórico"
        }
      }
    }
  },
  "wrc-monitoring": {
    "icons": {
      "history": {
        "tooltip": "Histórico"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Limpar Histórico"
        }
      }
    }
  },
  "wrc-domain-connection": {
    "labels": {
      "runningAt": {
        "value": "executando às {0}"
      }
    },
    "messages": {
      "lostConnection": {
        "summary": "Conexão Perdida",
        "detail": "A conexão com o backend da console remota foi perdida. Verifique se ele está em execução ou reinicie-o e tente o link novamente."
      },
      "cannotConnect": {
        "summary": "Falha na Tentativa de Conexão",
        "detail": "Não é possível estabelecer conexão com o Domínio do WebLogic {0}; verifique se o WebLogic está em execução."
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
        "label": "Editar Árvore",
        "description": "<p>Maintain configuration of the WebLogic domain you are currently working with.</p>"
      },
      "view": {
        "label": "Árvore da View de Configuração",
        "description": "<p>Examine read-only configuration of the WebLogic domain you are currently working with.</p>"
      },
      "monitoring": {
        "label": "Árvore de Monitoramento",
        "description": "<p>View runtime MBean information for select resources in the WebLogic domain you are currently working with.</p>"
      },
      "security": {
        "label": "Security Data Tree",
        "description": "<p>Manage security-related information (e.g. users, groups, roles, policies, credentials, etc.) in the WebLogic domain you are currently working with.</p>"
      },
      "modeling": {
        "label": "Árvore de Modelo de WDT",
        "description": "<p>Mantenha os arquivos de modelo associados à ferramenta WebLogic Deploy Tooling.</p>"
      },
      "composite": {
        "label": "Árvore de Modelos Compostos de WDT",
        "description": "<p>Veja um conjunto combinado de arquivos de modelo de WebLogic Deploy Tooling com o qual você está trabalhando no momento.</p>"
      },
      "properties": {
        "label": "Editor de Lista de Propriedades",
        "description": "<p>Exiba ou modifique um conjunto de propriedades com base em um arquivo de lista de propriedades.</p>"
      }
    }
  },
  "wrc-shoppingcart": {
    "icons": {
      "discard": {
        "tooltip": "Descartar Alterações"
      },
      "commit": {
        "tooltip": "Fazer Commit de Alterações"
      }
    },
    "sections": {
      "changeManager": {
        "label": "Gerenciador de Alterações"
      },
      "additions": {
        "label": "Inclusões"
      },
      "modifications": {
        "label": "Modificações"
      },
      "removals": {
        "label": "Remoções"
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
      },
      "customize": {
        "label": "Personalizar Tabela"
      }
    },
    "icons": {
      "landing": {
        "tooltip": "Página de Destino"
      },
      "history": {
        "tooltip": "Alternar visibilidade do histórico"
      },
      "instructions": {
        "tooltip": "Alternar visibilidade das instruções"
      },
      "help": {
        "tooltip": "Alternar visibilidade da página de Ajuda"
      },
      "sync": {
        "tooltip": "Recarregar",
        "tooltipOn": "Interromper Recarga Automática"
      },
      "syncInterval": {
        "tooltip": "Definir Intervalo de Recarga Automática"
      },
      "shoppingcart": {
        "tooltip": "Clique para ver as ações do carrinho"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Exibir Alterações"
        },
        "discard": {
          "label": "Descartar Alterações"
        },
        "commit": {
          "label": "Fazer Commit de Alterações"
        }
      }
    },
    "instructions": {
      "selectItems": {
        "value": "Selecione os itens nos quais você deseja executar a operação ''{0}''."
      }
    },
    "messages": {
      "action": {
        "cannotPerform": {
          "summary": "Mensagem",
          "detail": "Não é possível executar a ação ''{0}'' enquanto a recarga automática está em execução! Clique no ícone ''{1}'' para interrompê-la primeiro."
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
    "labels": {
      "totalRows": {
        "value": "Total de Linhas: {0}"
      },
      "reloadHidden": {
        "value": "Reload the table to view the current {0} values"
      }
    }
  },
  "wrc-table-customizer": {
    "labels": {
      "available": {
        "value": "Colunas Disponíveis"
      },
      "selected": {
        "value": "Colunas Selecionadas"
      }
    },
    "messages": {
      "action": {
        "needAtLeastOneColumn": {
          "title": "Colunas Insuficientes",
          "detail": "É necessário pelo menos uma coluna selecionada."
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
        "label": "Próximo"
      },
      "finish": {
        "label": "Criar"
      },
      "customize": {
        "label": "Personalizar Tabela"
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
        "tooltip": "Página de Destino"
      },
      "history": {
        "tooltip": "Alternar visibilidade do histórico"
      },
      "instructions": {
        "tooltip": "Alternar visibilidade das instruções"
      },
      "help": {
        "tooltip": "Alternar visibilidade da página de Ajuda"
      },
      "sync": {
        "tooltip": "Recarregar",
        "tooltipOn": "Interromper Recarga Automática"
      },
      "syncInterval": {
        "tooltip": "Definir Intervalo de Recarga Automática"
      },
      "shoppingcart": {
        "tooltip": "Clique para ver as ações do carrinho"
      }
    },
    "menu": {
      "shoppingcart": {
        "view": {
          "label": "Exibir Alterações"
        },
        "discard": {
          "label": "Descartar Alterações"
        },
        "commit": {
          "label": "Fazer Commit de Alterações"
        }
      }
    }
  },
  "wrc-form": {
    "checkboxes": {
      "showAdvancedFields": {
        "label": "Mostrar Campos Avançados"
      }
    },
    "introduction": {
      "toggleHelp": {
        "text": "Clique no ícone {0} para alternar entre a ajuda resumida e a detalhada."
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
        "tooltip": "Reinicialização do Servidor ou do Aplicativo Obrigatória"
      },
      "wdtIcon": {
        "tooltip": "Definições de WDT"
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
            "description": "Descrição"
          }
        }
      }
    }
  },
  "wrc-create-form": {
    "pageState": {
      "error": {
        "summary": "Campos Obrigatórios Incompletos",
        "detail": "O campo {0} é obrigatório, mas nenhum valor (ou um valor inválido) foi fornecido."
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "apply": {
        "label": "Aplicar"
      },
      "reset": {
        "label": "Redefinir"
      },
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
        "label": "Não"
      },
      "choose": {
        "label": "Escolher"
      },
      "connect": {
        "label": "Conectar"
      },
      "add": {
        "label": "Adicionar/Enviar"
      },
      "edit": {
        "label": "Editar/Enviar"
      },
      "import": {
        "label": "Importar"
      },
      "export": {
        "label": "Exportar"
      },
      "write": {
        "label": "Arquivo p/Download"
      },
      "savenow": {
        "label": "Salvar Agora"
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
        "value": "Mais Ações"
      },
      "download": {
        "value": "Procurar"
      },
      "reset": {
        "value": "Redefinir"
      },
      "submit": {
        "value": "Submeter Alterações"
      },
      "write": {
        "value": "Arquivo p/Download"
      },
      "pick": {
        "value": "Selecionar Diretório"
      },
      "reload": {
        "value": "Recarregar Arquivo"
      }
    },
    "menu": {
      "chooseFile": {
        "value": "Escolher Arquivo..."
      },
      "chooseDir": {
        "value": "Escolher Diretório..."
      }
    },
    "labels": {
      "info": {
        "value": "Informações"
      },
      "warn": {
        "value": "Advertência"
      },
      "error": {
        "value": "Erro"
      }
    },
    "placeholders": {
      "search": {
        "value": "Pesquisar"
      }
    }
  },
  "wrc-wdt-form": {
    "messages": {
      "changesSaved": {
        "summary": "As alterações foram salvas com sucesso no arquivo ''{0}''!"
      },
      "changesNotSaved": {
        "summary": "Não é possível salvar as alterações no arquivo ''{0}''!"
      },
      "changesDownloaded": {
        "summary": "As alterações foram baixadas com sucesso para o arquivo ''{0}''!"
      },
      "changesNotDownloaded": {
        "summary": "Não é possível fazer download das alterações no arquivo ''{0}''!"
      },
      "verifyPathEntered": {
        "detail": ". A definição do campo {0} como falso aceitará o valor inserido, sem validar sua existência como um arquivo ou diretório local."
      }
    },
    "wdtOptionsDialog": {
      "title": "Editar: {0}",
      "default": "Padrão. (Cancelar Definição)",
      "instructions": "Digite o token a ser adicionado à lista de itens selecionáveis.",
      "enterValue": "Informar Valor",
      "selectValue": "Selecionar Valor",
      "selectSwitch": "Alternar Valor",
      "enterUnresolvedReference": "Digitar Referência Não Resolvida",
      "enterModelToken": "Digitar Token de Modelo",
      "selectPropsVariable": "Selecionar Variável de Token de Modelo",
      "createPropsVariable": "Criar Variável de Token de Modelo",
      "propName": "Nome da Variável (Obrigatório)",
      "propValue": "Valor da Variável",
      "enterVariable": "Inserir Variável",
      "variableName": "Nome da Variável (Obrigatório)",
      "variableValue": "Valor da Variável",
      "multiSelectUnset": "\"Padrão. (Selecione na Lista de Itens Disponíveis)"
    }
  },
  "wrc-unsaved-changes": {
    "titles": {
      "unsavedChanges": {
        "value": "Alterações Não Salvas Detectadas"
      },
      "changesNeedDownloading": {
        "value": "Alterações Não Baixadas"
      }
    },
    "prompts": {
      "unsavedChanges": {
        "willBeLost": {
          "value": "Todas as alterações não salvas serão perdidas. Continuar?"
        },
        "areYouSure": {
          "value": "Tem certeza de que deseja sair sem salvar as alterações?"
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
          "value": "Sua nova instância do ''{0}'' ainda não foi adicionada ao modelo do WDT.<br/><br/>Adicioná-la antes de continuar?"
        }
      }
    }
  },
  "wrc-sync-interval": {
    "dialogSync": {
      "title": "Definir Intervalo de Recarga Automática",
      "instructions": "Quantos segundos você deseja configurar para o intervalo de recarga automática?",
      "fields": {
        "interval": {
          "label": "Intervalo de Recarga Automática:"
        }
      }
    }
  },
  "wrc-pdj-actions": {
    "messages": {
      "action": {
        "unableToPerform": {
          "summary": "Mensagem",
          "detail": "A chamada de backend da console gerou uma resposta ''{0}'' durante a tentativa de executar a ação especificada em ''{1}''."
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Não é possível determinar a causa exata. Verifique as dicas na Console do JavaScript."
      }
    }
  },
  "wrc-pdj-fields": {
    "cfe-multi-select": {
      "labels": {
        "available": "Disponíveis",
        "chosen": "Escolhidos"
      }
    },
    "cfe-properties-editor": {
      "labels": {
        "name": "Nome da Propriedade",
        "value": "Valor da Propriedade"
      }
    },
    "cfe-property-list-editor": {
      "labels": {
        "nameHeader": "Nome de Propriedades",
        "valueHeader": "Valor de Propriedades",
        "addButtonTooltip": "Adicionar",
        "deleteButtonTooltip": "Excluir"
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
      "label": "Restaurar para o padrão"
    },
    "placeholder": {
      "value": "padrão"
    }
  },
  "wrc-pdj-crosslinks": {
    "messages": {
      "noNotFoundMessage": {
        "detail": "''{0}'' não está disponível."
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
          "value": "Crítico"
        },
        "overloaded": {
          "value": "Sobrecarregado"
        },
        "warning": {
          "value": "Advertência"
        },
        "ok": {
          "value": "OK"
        }
      }
    },
    "descriptions": {
      "healthState": {
        "value": "Condição dos Servidores em Execução a partir de"
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
        "detail": "O backend não está acessível no momento."
      },
      "connectionMessage": {
        "summary": "Mensagem de Conexão"
      },
      "connectFailed": {
        "detail": "Falha na Tentativa: "
      },
      "badRequest": {
        "detail": "Não é possível processar o arquivo ou a solicitação submetida "
      },
      "invalidCredentials": {
        "detail": "As credenciais do Domínio do WebLogic não são válidas "
      },
      "invalidUrl": {
        "detail": "O URL do Domínio do WebLogic não está acessível "
      },
      "notInRole": {
        "detail": "Falha na Tentativa: O usuário não é um Administrador, Implantador, Operador ou Monitor"
      },
      "notSupported": {
        "detail": "Não há suporte para o Domínio do WebLogic "
      },
      "unexpectedStatus": {
        "detail": "Resultado inesperado: (status: {0}) "
      },
      "cbeRestApi": {
        "requestUnsuccessful": {
          "summary": "Solicitação Malsucedida",
          "detail": "Uma resposta indicadora de falha foi retornada de uma chamada de backend da console."
        }
      }
    }
  },
  "wrc-message-displaying": {
    "messages": {
      "seeJavascriptConsole": {
        "detail": "Consulte o terminal da console remota ou a console do Javascript para ver o(s) motivo(s) específico(s)."
      },
      "responseMessages": {
        "summary": "Mensagens de Resposta"
      }
    }
  },
  "wrc-change-manager": {
    "messages": {
      "cannotGetLockState": {
        "summary": "Não é possível acessar o gerenciador de alterações!"
      },
      "changesCommitted": {
        "summary": "O commit das alterações foi feito com sucesso!"
      },
      "changesNotCommitted": {
        "summary": "Não é possível fazer commit das alterações!"
      },
      "changesDiscarded": {
        "summary": "As alterações foram descartadas com sucesso!"
      },
      "changesNotDiscarded": {
        "summary": "Não é possível descartar as alterações!"
      }
    }
  },
  "wrc-view-model-utils": {
    "labels": {
      "unexpectedErrorResponse": {
        "value": "Resposta ao Erro Inesperada"
      }
    },
    "messages": {
      "connectionRefused": {
        "summary": "Problema de Conexão",
        "details": "Problemas ao enviar e receber dados do provedor! Certifique-se de que eles estejam acessíveis e tente novamente."
      }
    }
  }
});