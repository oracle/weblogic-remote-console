define({
  "wrc-header": {
    "text": {
      "appName": "WebLogic Remote Console"
    },
    "icons": {
      "navtree": {
        "toggler": {
          "tooltip": "Alternar visibilidade da Árvore de Navegação"
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
        "tooltip": "Abrir Documentação Interna do WebLogic Remote Console"
      },
      "profile": {
        "tooltip": "Profile"
      }
    },
    "menus": {
      "messageCenter": {
        "value": "Abrir Message Center"
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
      "copyrightLegal": "Copyright (c) 2020, 2024, Oracle e/ou suas empresas afiliadas.<br/>Oracle (r), Java, MySQL e NetSuite são marcas comerciais registradas da Oracle Corporation e/ou de suas empresas afiliadas. Outros nomes podem ser marcas comerciais de seus respectivos proprietários.<br/>",
      "builtWith": "Criado com o Oracle JET"
    }
  },
  "wrc-connectivity": {
    "labels": {
      "insecure": {
        "value": "Não seguro"
      }
    },
    "icons": {
      "insecure": {
        "tooltip": "Conexão do Servidor de Administração Não Segura"
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
            "tooltip": "Gerenciar Perfis"
          },
          "editor": {
            "tooltip": "Profile Editor",
            "toolbar": {
              "save": {
                "tooltip": "Salvar Perfil"
              },
              "activate": {
                "tooltip": "Active Profile"
              },
              "add": {
                "tooltip": "Adicionar Perfil"
              },
              "remove": {
                "tooltip": "Excluir Perfil"
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
          "value": "Geral"
        },
        "settings": {
          "value": "Definições"
        },
        "preferences": {
          "value": "Preferências"
        },
        "properties": {
          "value": "Propriedades"
        }
      }
    },
    "dialog": {
      "changeImage": {
        "value": "Alterar Imagem"
      },
      "clearImage": {
        "value": "Clear Image"
      },
      "profile": {
        "default": {
          "value": "Perfil Padrão"
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
            "value": "Sign out"
          }
        }
      }
    },
    "labels": {
      "profile": {
        "fields": {
          "id": {
            "value": "ID do Perfil"
          },
          "organization": {
            "value": "Organization"
          },
          "name": {
            "value": "Nome"
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
              "value": "Armazenar credenciais criptografadas para seus projetos?"
            },
            "disableHNV": {
              "value": "Desativar verificação de nome do host?"
            },
            "proxyAddress": {
              "value": "Endereço do Proxy"
            },
            "trustStoreType": {
              "value": "Tipo de Armazenamento Confiável"
            },
            "trustStorePath": {
              "value": "Caminho do Armazenamento Confiável"
            },
            "trustStoreKey": {
              "value": "Chave de Armazenamento Confiável"
            },
            "connectionTimeout": {
              "value": "Timeout da Conexão do Servidor de Administração"
            },
            "readTimeout": {
              "value": "Timeout de Leitura do Servidor de Administração"
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
        "tooltip": "Obter Informações"
      },
      "edit": {
        "tooltip": "Gerenciar"
      },
      "deactivate": {
        "tooltip": "Desativar"
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
        "proxyOverride": {
          "value": "Substituição de Proxy"
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
        "project": {
          "name": {
            "label": "Nome do Projeto:"
          }
        },
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
          "proxyOverride": {
            "label": "Substituição de Proxy:"
          },
          "version": {
            "label": "Versão do Domínio:"
          },
          "username": {
            "label": "Nome do usuário:"
          },
          "sso": {
            "label": "SSO:"
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
          "insecure": {
            "label": "Inseguro:"
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
      },
      "project-busy": {
        "value": "Salve ou abandone as alterações não salvas antes de fazer alterações em qualquer parte do projeto"
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
      },
      "project-busy": {
        "value": "Projeto Ocupado"
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
      "sso": {
        "secureContextRequired": {
          "detail": "The URL must specify the HTTPS protocol or use localhost"
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
        "fileNotSet": {
          "value": "Não definido"
        }
      }
    },
    "checkboxes": {
      "useSparseTemplate": {
        "label": "Usar Modelo Esparso"
      },
      "usesso": {
        "label": "Use Web Authentication"
      },
      "insecure": {
        "label": "Tornar Conexão Não Segura"
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
        "tooltip": "Árvore de Dados de Segurança"
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
  "wrc-navigation": {
    "navstrip": {
      "ariaLabel": {
        "value": "Faixa de Navegação"
      }
    },
    "navtree": {
      "ariaLabel": {
        "value": "Árvore de Navegação"
      }
    }
  },
  "wrc-content-area-header": {
    "title": {
      "home": "Início",
      "configuration": "Editar Árvore",
      "view": "Árvore da View de Configuração",
      "monitoring": "Árvore de Monitoramento",
      "security": "Árvore de Dados de Segurança",
      "modeling": "Modelo de WDT",
      "composite": "Modelo Composto de WDT",
      "properties": "Lista de Propriedades"
    },
    "toolbar": {
      "buttons": {
        "home": {
          "label": "Início"
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
          "label": "Providers"
        },
        "tips": {
          "label": "User Tips"
        },
        "dashboards": {
          "label": "Painéis de Controle"
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
          "value": "Ocultar Tudo"
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
          "value": "Segurança"
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
        "tooltip": "Histórico"
      },
      "separator": {
        "tooltip": "Separador"
      }
    },
    "menus": {
      "history": {
        "clear": {
          "value": "Limpar Entradas do Histórico",
          "label": "Limpar Entradas do Histórico"
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
          "label": "Árvores"
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
        "label": "Editar Árvore",
        "description": "<p>Mantenha a configuração do domínio do WebLogic com o qual você está trabalhando no momento.</p>"
      },
      "view": {
        "label": "Árvore da View de Configuração",
        "description": "<p>Examine a configuração somente para leitura do domínio do WebLogic com o qual você está trabalhando no momento.</p>"
      },
      "monitoring": {
        "label": "Árvore de Monitoramento",
        "description": "<p>Exiba informações de MBean de runtime para recursos selecionados no domínio do WebLogic com o qual você está trabalhando no momento.</p>"
      },
      "security": {
        "label": "Árvore de Dados de Segurança",
        "description": "<p>Gerencie informações relacionadas a segurança (por exemplo, usuários, grupos, atribuições, políticas, credenciais etc.) no domínio do WebLogic com o qual você está trabalhando no momento.</p>"
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
  "wrc-startup-tasks": {
    "cards": {
      "addAdminServer": {
        "label": "Adicionar Provedor de Conexão do Servidor de Administração",
        "description": "This task creates a project resource that allows you to connect to an Admin Server"
      },
      "addWdtModel": {
        "label": "Adicionar Provedor de Arquivo de Modelo de WDT",
        "description": "This task creates a project resource that allows you to manage a WDT Model file, existing on your local filesystem"
      },
      "addWdtComposite": {
        "label": "Adicionar Provedor de Arquivo de Modelo Composto de WDT",
        "description": "This task creates a project resource that allows you to manage WDT Model file fragments, existing on your local filesystem"
      },
      "addPropertyList": {
        "label": "Adicionar Provedor de Lista de Propriedades",
        "description": "This task creates a project resource that allows you to manage a .properties file stored on your local filesystem"
      },
      "createWdtModel": {
        "label": "Criar Provedor para Novo Arquivo de Modelo de WDT",
        "description": "This task creates a project resource that is a new WDT Model file, stored on your local filesystem"
      },
      "createPropertyList": {
        "label": "Criar Provedor para Nova Lista de Propriedades",
        "description": "This task creates a project resource that is a new .properties file, stored on your local filesystem"
      },
      "importProject": {
        "label": "Importar Projeto",
        "description": "This task loads a previously exported project containing providers immediately ready for you to use or modify"
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
    "prompts": {
      "download": {
        "value": "Locais de arquivos de log baixados:"
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
        "value": "Recarregar a tabela para ver os valores {0} atuais"
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
      },
      "dashboard": {
        "label": "Novo Painel de Controle"
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
        "shoppingcart": "As alterações foram adicionadas ao carrinho!",
        "generic": "As alterações foram salvas!",
        "notSaved": "Nada salvo porque não foram detectadas alterações."
      },
      "action": {
        "notAllowed": {
          "summary": "Ação Não Permitida",
          "detail": "Não é possível executar a ação solicitada durante uma operação de criação. Clique no botão Cancelar para cancelar a operação de criação."
        }
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
    },
    "labels": {
      "relatedTopics": {
        "value": "<b>Tópicos Relacionados:</b>"
      }
    },
    "tabs": {
      "attributes": {
        "label": "Atributos"
      },
      "actions": {
        "label": "Ações"
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
  "wrc-policy-management": {
    "menus": {
      "action": {
        "addCondition": {
          "label": "Adicionar Condição"
        },
        "combine": {
          "label": "Combinar"
        },
        "uncombine": {
          "label": "Não Combinar"
        },
        "moveup": {
          "label": "Mover para cima"
        },
        "movedown": {
          "label": "Mover para baixo"
        },
        "remove": {
          "label": "Remover"
        },
        "negate": {
          "label": "Negar"
        },
        "reset": {
          "label": "Redefinir"
        }
      }
    },
    "contextMenus": {
      "action": {
        "addCondition": {
          "at": {
            "label": "Adicionar Nova Primeira Condição..."
          },
          "above": {
            "label": "Adicionar Condição acima da Linha Clicada..."
          },
          "below": {
            "label": "Adicionar Condição abaixo da Linha Clicada..."
          }
        }
      }
    },
    "buttonMenus": {
      "action": {
        "addCondition": {
          "above": {
            "label": "Adicionar Condição Marcada acima..."
          },
          "below": {
            "label": "Adicionar Condição Marcada abaixo..."
          }
        }
      }
    },
    "messages": {
      "requiredFieldsMissing": {
        "detail": "Um ou mais dos campos obrigatórios não contêm dados!"
      },
      "argumentValueHasWrongFormat": {
        "summary": "O campo ''{0}'' contém dados formatados incorretamente!"
      },
      "conditionHasNoArgValues": {
        "summary": "A condição selecionada não tem valores de argumento para editar!"
      },
      "conditionAlreadyExists": {
        "summary": "Esta política de segurança já tem uma condição criada usando o predicado selecionado ou um predicado com valores de argumento correspondentes!"
      }
    },
    "instructions": {
      "policyEditor": {
        "value": "<p>Para especificar a localização da nova condição, coloque uma marca de seleção próximo à condição relativa e, em seguida, clique no botão <b>+Adicionar Condição</b>.</p>"
      }
    }
  },
  "wrc-policy-editor": {
    "labels": {
      "monthDay": {
        "value": "Faixa: -31 a 31"
      },
      "dateTime": {
        "value": "Formato: a-MM-dd HH:mm:ss [HH:mm:ss] (ex.: 2006-04-25 00:00:00)"
      },
      "time": {
        "value": "Formato: HH:mm:ss (ex.: 14:22:47)"
      },
      "gmtOffset": {
        "value": "Formato: GMT+|-h:mm (ex.: GMT-5:00)"
      },
      "weekDay": {
        "value": "ex.: domingo, segunda-feira, terça-feira,..."
      },
      "or": {
        "value": "ou"
      },
      "not": {
        "value": "NOT"
      },
      "combination": {
        "value": "Combinação"
      },
      "nodata": {
        "Policy": {
          "value": "Use o botão <b>+ Adicionar Condição</b> para adicionar uma condição de política."
        },
        "DefaultPolicy": {
          "value": "Não há condições de política de segurança padrão definidas."
        }
      }
    },
    "tables": {
      "policyConditions": {
        "columns": {
          "header": {
            "combination": "Combinação",
            "operator": "Operador",
            "expression": "Expressão de Condição"
          }
        },
        "dropdowns": {
          "operator": {
            "or": "Or",
            "and": "And"
          }
        }
      }
    },
    "wizard": {
      "title": "Gerenciamento de Políticas",
      "pages": {
        "choosePredicate": {
          "header": {
            "title": "Escolha um Predicado",
            "instructions": "Escolha na lista dropdown o predicado para sua nova condição."
          },
          "body": {
            "labels": {
              "predicateList": "Lista de Predicados"
            },
            "help": {
              "predicateList": "A lista de predicados é uma lista de predicados disponíveis que podem ser usados para criar uma condição da política de segurança."
            }
          }
        },
        "manageArgumentValues": {
          "header": {
            "title": "Predicado do Grupo",
            "instructions": "Comece digitando no campo <i></i> para adicionar valores de argumento ou procurar os existentes. Pressione Enter para adicionar o valor digitado à lista. Para editar o valor do argumento existente, clique nele e modifique usando o campo de entrada de dados popup."
          },
          "body": {
            "labels": {
              "conditionPhrase": "Expressão de Condição",
              "negate": "Negar Condição"
            },
            "help": {
              "negate": "Converte a condição para ter o significado oposto (por exemplo, \"é igual\" torna-se \"não é igual\", \"em\" torna-se \"não está em\")."
            }
          }
        }
      }
    }
  },
  "wrc-common": {
    "buttons": {
      "action": {
        "label": "Ação"
      },
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
      "restart": {
        "label": "Reiniciar"
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
      },
      "next": {
        "label": "Próximo"
      },
      "previous": {
        "label": "Anterior"
      },
      "finish": {
        "label": "Finalizar"
      },
      "done": {
        "label": "Concluído"
      },
      "close": {
        "label": "Fechar"
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
      "filter": {
        "value": "Filtro"
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
      },
      "delete": {
        "value": "Excluir"
      },
      "remove": {
        "value": "Remover"
      },
      "noData": {
        "value": "Sem Dados"
      },
      "preloader": {
        "value": "Preloader"
      },
      "checkAll": {
        "value": "Marcar Tudo"
      },
      "checkNone": {
        "value": "Desmarcar Tudo"
      },
      "checkSome": {
        "value": "Remover Itens Marcados"
      },
      "close": {
        "value": "Fechar"
      },
      "recentPages": {
        "value": "Alternar visibilidade do histórico"
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
    },
    "title": {
      "incorrectFileContent": {
        "value": "Conteúdo Incorreto Detectado"
      }
    },
    "messages": {
      "incorrectFileContent": {
        "detail": "''{0}'' contém JSON, mas não é uma representação JSON de um(a) {1}!"
      },
      "dataCopiedToClipboard": {
        "summary": "Os dados foram copiados para a área de transferência!"
      },
      "tableCopiedToClipboard": {
        "summary": "Table was successfully copied to the clipboard!"
      },
      "emptyCellData": {
        "detail": "Dados não copiados para a área de transferência porque a célula selecionada estava vazia!"
      },
      "emptyRowData": {
        "detail": "Dados não copiados para a área de transferência porque a linha selecionada estava vazia!"
      },
      "browserPermissionDenied": {
        "summary": "Browser Permission Denied",
        "detail": "You need to enable writing to the clipboard from JavaScript, in order to perform this operation. Also, the Clipboard API is only supported for pages served over HTTPS."
      }
    },
    "contextMenus": {
      "copyData": {
        "cell": {
          "label": "Copiar Célula para a Área de Transferência"
        },
        "row": {
          "label": "Copiar Linha para a Área de Transferência"
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
      "default": "Cancelar a Definição do Valor",
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
      "multiSelectUnset": "Selecione um Valor na Lista de Itens Disponíveis"
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
          "value": "Tem certeza de que deseja {0} sem salvar suas alterações?"
        },
        "saveBeforeExiting": {
          "value": "Deseja salvar as alterações antes de sair?"
        },
        "needDownloading": {
          "value": "Suas alterações em ''{0}'' não foram baixadas para o arquivo.<br/><br/>Fazer o download delas antes de continuar?"
        }
      },
      "uncommitedCreate": {
        "abandonForm": {
          "value": "Sua nova instância do ''{0}'' não foi adicionada ao modelo do WDT.<br/><br/>Adicioná-la antes de continuar?"
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
          "detail": "A chamada de backend da console gerou uma resposta ''{0}'' ao tentar executar a ação ''{1}''"
        },
        "actionNotPerformed": {
          "detail": "Não é possível executar a ação ''{0}'' em um ou mais dos itens assinalados"
        },
        "actionSucceeded": {
          "summary": "A ação ''{0}'' foi realizada com sucesso!"
        }
      }
    },
    "labels": {
      "cannotDetermineExactCause": {
        "value": "Não é possível determinar a causa exata. Verifique as dicas na Console do JavaScript."
      }
    }
  },
  "wrc-actions-strip": {
    "dialogs": {
      "cannotBeUndone": {
        "title": "Confirmação da Ação",
        "prompt": "A ação ''{0}'' não pode ser desfeita!<br/><br/>Continuar?"
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
        "detail": "Não é possível processar o arquivo ou a solicitação submetida"
      },
      "invalidCredentials": {
        "detail": "As credenciais do Domínio do WebLogic não são válidas"
      },
      "invalidUrl": {
        "detail": "O URL do Domínio do WebLogic não está acessível"
      },
      "notInRole": {
        "detail": "Falha na Tentativa: O usuário não é um Administrador, Implantador, Operador ou Monitor"
      },
      "notSupported": {
        "detail": "Não há suporte para o Domínio do WebLogic"
      },
      "unexpectedStatus": {
        "detail": "Resultado inesperado: (status: {0})"
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
      },
      "pathNotFound": {
        "summary": "Caminho Não Encontrado",
        "details": "''{0}'' não é um arquivo ou diretório acessível no sistema de arquivos local."
      }
    }
  },
  "wrc-message-line": {
    "menus": {
      "more": {
        "clear": {
          "label": "Mensagem de Remoção"
        },
        "suppress": {
          "info": {
            "label": "Suprimir Mensagens de Informações"
          },
          "warning": {
            "label": "Suprimir Mensagens de Advertência"
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
          "value": "Exibir Alertas"
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