/**
 * @license
 * Copyright (c) 2020, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojknockout-keyset',
  'ojs/ojcontext',
  'wrc-frontend/microservices/app-profile/app-profile-manager',
  'wrc-frontend/microservices/page-definition/form-layouts',
  'wrc-frontend/apis/message-displaying',
  'wrc-frontend/common/dialog-fields',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/types',
  'wrc-frontend/core/utils',
  'ojs/ojknockout',
  'ojs/ojinputtext',
  'ojs/ojlabel',
  'ojs/ojformlayout',
  'ojs/ojselectsingle',
  'ojs/ojswitcher',
  'ojs/ojswitch',
  'ojs/ojlistview',
  'cfe-property-list-editor/loader'
],
  function(
    oj,
    ko,
    ArrayDataProvider,
    ojkeyset_1,
    Context,
    AppProfileManager,
    PageDefinitionFormLayouts,
    MessageDisplaying,
    DialogFields,
    ViewModelUtils,
    Runtime,
    CoreTypes,
    CoreUtils
  ) {
    function AppProfileTemplate(viewParams){
      const self = this;

      const PROFILE_EDITOR_MIN_HEIGHT = parseInt(ViewModelUtils.getCustomCssProperty('app-profile-editor-min-height'), 10);

      this.i18n = {
        icons: {
          'close': {
            iconFile: 'dialog-close-blk_24x24',
            tooltip: oj.Translations.getTranslatedString('wrc-common.buttons.close.label')
          },
          profile: {
            popup: {
              launcher: {
                id: 'profile-popup-launcher', iconFile: 'profile-image-blk_32x32', visible: ko.observable(!Runtime.getProperty('features.appProfiles.disabled')),
                tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.popup.launcher.tooltip')
              }
            },
            dialog: {
              launcher: {
                id: 'profile-dialog-launcher', iconFile: 'profile-image-blk_32x32', visible: ko.observable(Runtime.getProperty('features.appProfiles.disabled')),
                tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.launcher.tooltip')
              },
              editor: {
                id: 'profile-editor', iconFile: ko.observable('oj-ux-ico-panel-collapse-bottom'), visible: ko.observable(true),
                tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.editor.tooltip'),
                toolbar: {
                  save: {
                    id: 'profile-editor-save-icon',
                    tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.editor.toolbar.save.tooltip')
                  },
                  activate: {
                    id: 'profile-editor-activate-icon', visible: ko.observable(false),
                    tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.editor.toolbar.activate.tooltip')
                  },
                  add: {
                    id: 'profile-editor-add-icon',
                    tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.editor.toolbar.add.tooltip')
                  },
                  remove: {
                    id: 'profile-editor-remove-icon',
                    tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.dialog.editor.toolbar.remove.tooltip')
                  }
                }
              }
            },
            image: {
              id: 'profile-image', iconFile: 'app-profile-icon-blk_24x24', visible: ko.observable(true),
              tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.image.tooltip'),
              capture: {
                id: 'profile-image-capture', iconFile: 'profile-image-blk_72x72', visible: true,
                tooltip: oj.Translations.getTranslatedString('wrc-app-profile.icons.profile.image.capture.tooltip')
              }
            }
          }
        },
        dialog: {
          changeImage: {value: oj.Translations.getTranslatedString('wrc-app-profile.dialog.changeImage.value')},
          clearImage: {value: oj.Translations.getTranslatedString('wrc-app-profile.dialog.clearImage.value')},
          profile: {
            editor: {
              default: {value: oj.Translations.getTranslatedString('wrc-app-profile.dialog.profile.default.value')},
              toggler: {
                editor: {
                  value: ko.observable(),
                  show: {value: oj.Translations.getTranslatedString('wrc-app-profile.dialog.profile.toggler.editor.show.value')},
                  hide: {value: oj.Translations.getTranslatedString('wrc-app-profile.dialog.profile.toggler.editor.hide.value')}
                }
              }
            }
          }
        },
        popup: {
          profile: {
            manager: {
              open: {value: oj.Translations.getTranslatedString('wrc-app-profile.popup.profile.manager.open.value')},
              signout: {value: oj.Translations.getTranslatedString('wrc-app-profile.popup.profile.manager.signout.value')}
            }
          }
        },
        labels: {
          profile: {
            fields: {
              id: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.id.value')},
              organization: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.organization.value')},
              name: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.name.value')},
              email: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.email.value')},
              role: {
                default: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.role.default.value')}
              },
              settings: {
                useCredentialStorage:{value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.useCredentialStorage.value')},
                disableHNV: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.disableHNV.value')},
                proxyAddress: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.proxyAddress.value')},
                trustStoreType: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.trustStoreType.value')},
                trustStorePath: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.trustStorePath.value')},
                trustStoreKey: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.trustStoreKey.value')},
                connectionTimeout: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.connectionTimeout.value')},
                readTimeout: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.settings.readTimeout.value')}
              },
              preferences: {
                theme:{value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.theme.value')},
                startupTaskChooserType: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.startupTaskChooserType.value')},
                useTreeMenusAsRootNodes:{value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.useTreeMenusAsRootNodes.value')},
                onQuit: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.onQuit.value')},
                onDelete: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.onDelete.value')},
                onActionNotAllowed: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.onActionNotAllowed.value')},
                onUnsavedChangesDetected: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.onUnsavedChangesDetected.value')},
                onChangesNotDownloaded: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.preferences.onChangesNotDownloaded.value')}
              },
              properties: {
                javaSystemProperties: {value: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.fields.properties.javaSystemProperties.value')}
              }
            }
          }
        }
      };

      this.dialogFields = {
        id: ko.observable(null),
        imageDataUrl: ko.observable(''),
        general: {
          account: {
            organization: ko.observable(''),
            name: ko.observable(oj.Translations.getTranslatedString('wrc-app-profile.dialog.profile.editor.default.value')),
            email: ko.observable('')
          },
          role: {
            isDefault: ko.observable(true)
          }
        },
        settings: {
          disableHNV: ko.observable(false),
          useCredentialStorage: ko.observable(true),
          proxyAddress: ko.observable(''),
          trustStoreType: ko.observable('pkcs12'),
          trustStorePath: ko.observable(''),
          trustStoreKey: ko.observable(''),
          connectionTimeout: ko.observable(10000),
          readTimeout: ko.observable(10000)
        },
        preferences: {
          theme: ko.observable('light'),
          startupTaskChooserType: ko.observable('use-dialog'),
          useTreeMenusAsRootNodes: ko.observable(false),
          onQuit:  ko.observable(false),
          onDelete:  ko.observable(true),
          onActionNotAllowed:  ko.observable(true),
          onUnsavedChangesDetected:  ko.observable(true),
          onChangesNotDownloaded:  ko.observable(true)
        },
        properties: {
          javaSystemProperties: ko.observable('')
        }
      };

      this.profileListSelectedItem = new ojkeyset_1.ObservableKeySet();
      this.profilesListDataProvider = ko.observable();

      this.taskChooserTypeDataProvider = new ArrayDataProvider(
        [
          {'value':'use-dialog', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.taskChooserTypeOptions.useDialog.value')},
          {'value':'use-cards', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.taskChooserTypeOptions.useCards.value')}
        ],
        { keyAttributes: 'value' }
      );

      this.trustStoreTypeDataProvider = new ArrayDataProvider(
        [
          {'value': 'jks', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.trustStoreTypeOptions.jks.value')},
          {'value': 'pkcs12', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.trustStoreTypeOptions.pkcs12.value')},
          {'value': 'windowsRoot', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.trustStoreTypeOptions.windowsRoot.value')},
          {'value': 'keyChainStore', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.trustStoreTypeOptions.keyChainStore.value')}
        ],
        { keyAttributes: 'value' }
      );
      
      this.themeDataProvider = new ArrayDataProvider(
        [
          {'value':'light', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.themeOptions.light.value')},
          {'value':'dark', 'label': oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.legalValues.themeOptions.dark.value')}
        ],
        { keyAttributes: 'value' }
      );
      
      this.profileEditorTabsDataProvider = new ArrayDataProvider(
        loadProfileEditorTabStripItems(),
        { keyAttributes: 'id' }
      );
      
      function loadProfileEditorTabStripItems() {
        const dataArray = [];
        const tabs = AppProfileManager.getSchemaTabs();
        for (const tab of tabs) {
          dataArray.push({
            id: tab,
            label: oj.Translations.getTranslatedString(`wrc-app-profile.tabstrip.tabs.${tab}.value`)
          });
        }
    
        return dataArray;
      }
      
      this.selectedTabStripItem = ko.observable();
      this.profileWasChanged = false;

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.appProfileActionTriggered.add((source, type, options) => {
          if (type === 'viewAppProfile') {
            const id = getDataProfileId();
            if (id === null) {
              viewAppProfileSelector();
            }
            else {
              showProfileEditorSection(id, options.section);
            }
          }
          else if (type === 'closeAppProfile') {
            closeAppProfileDialog('app-profile-dialog');
            closeSelectAppProfilePopup('selectAppProfilePopup');
          }
        });
  
        this.signalBindings.push(binding);

      }.bind(this);
  
      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => {
          binding.detach();
        });
    
        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);
  
      this.onOjFocus = (event) => {
        removeDialogResizableHandleNodes(event);
      };

      this.onOjBeforeClose = (event) => {
        closeAppProfileDialog('app-profile-dialog');
      };
  
      this.onOjResizeStop = (event) => {
        // First, we need to compute mew min-height foe the divs
        // that uses the --profile-editor-content-calc-min-height
        // CSS custom variable, to set min-height DOM property
        const newMinHeight = (event.detail.size.height - PROFILE_EDITOR_MIN_HEIGHT);
        document.documentElement.style.setProperty('--profile-editor-content-calc-min-height', `${newMinHeight}px`);
        // Next, we need to tell the dialog to set it's height to fit
        // the height of the content. This is because JET is dynamically
        // calculating the height of the app-profile-editor behind our
        // backs. If the user resizes the dialog to be taller and then
        // clicks the "Hide Profile Editor" link, the dialog will just
        // stay the taller size. To correct that we need to set the height
        // to 'fit-content', which will make the height the one used when
        // the editor is "hidden".
        $('#app-profile-dialog').css({'height': 'fit-content'});
      };

      this.closeIconClickHandler = function(event) {
        closeAppProfileDialog('app-profile-dialog');
      };

      this.sectionExpanderClickHandler = (event) => {
        PageDefinitionFormLayouts.handleSectionExpanderClicked(event);
      };

      this.hiddenAccessKeyClickHandler = (event) => {
        event.preventDefault();
        switch(event.currentTarget.id) {
          case 'select-settings-tab':
            showProfileEditorSection(self.dialogFields.id(), 'settings');
            break;
          case 'select-preferences-tab':
            showProfileEditorSection(self.dialogFields.id(), 'preferences');
            break;
        }
      };

      this.appProfileIconClickHandler = (event) => {
        viewParams.signaling.ancillaryContentItemCleared.dispatch('app-profile');
        const defaultImageDataUrl = `js/jet-composites/wrc-frontend/1.0.0/images/${self.i18n.icons.profile.image.capture.iconFile}.png`;
        AppProfileManager.getAppProfiles(defaultImageDataUrl)
          .then(reply => {
            self.profilesListDataProvider(new ArrayDataProvider(
              reply.body.data, { keyAttributes: 'id' }
            ));
            viewAppProfileSelector();
          })
          .catch(response => {
            if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
              MessageDisplaying.displayMessagesAsHTML(response.body.messages, 'Replace Profile Image', 'error', 5000);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          });
      };

      this.onKeyUpProfileImage = (event) => {
        if (event.key === 'Enter') {
          $('#profile-file-chooser').click();
        }
      };

      this.onChangeProfileImage = (event) => {
        replaceAppProfileImage(event.target.files[0]);
        clearFileChooser();
      };

      this.profileEditorToolbarAction = (event) => {
        function saveAppProfile(dialogFields) {
          AppProfileManager.saveAppProfile(dialogFields)
            .then(reply => {
              MessageDisplaying.displayMessage({
                severity: 'confirmation',
                summary: oj.Translations.getTranslatedString('wrc-app-profile.labels.profile.messages.save.succeeded.summary', dialogFields.id())
              }, 2500);
              setActivateIconVisibility(true);
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }
  
        function addNewAppProfile()
        {
          clearAppProfile();
          showProfileEditorSection(self.dialogFields.id(), 'general')
        }

        function removeAppProfile(id) {
          AppProfileManager.removeAppProfile(id)
            .then(reply => {
              closeAppProfileDialog('app-profile-dialog');
              clearAppProfile();
            })
            .catch(response => {
              ViewModelUtils.failureResponseDefaultHandling(response);
            });
        }

        switch(event.currentTarget.id) {
          case 'profile-editor-save-icon':
            saveAppProfile(self.dialogFields);
            break;
          case 'profile-editor-activate-icon':
            activateAppProfile(self.dialogFields.id());
            break;
          case 'profile-editor-add-icon':
            addNewAppProfile();
            break;
          case 'profile-editor-remove-icon':
            removeAppProfile(self.dialogFields.id());
            break;
        }
      };
  
      function showProfileEditorSection(id, section = 'general') {
        viewParams.signaling.ancillaryContentItemCleared.dispatch('app-profile');
        viewAppProfileManager(id, section);

        const onTimeout = () => {
          setProfileEditorState('show');
        };
  
        setTimeout(onTimeout.bind(undefined), 5);
      }
  
      this.profilesListSelectedChanged = (event) => {
        const id = Array.from(event.detail.value.keys.keys)[0];
        AppProfileManager.setCurrentAppProfile(id)
          .then(() => {
            setActivateIconVisibility(CoreUtils.isNotUndefinedNorNull(id));
            showProfileEditorSection(id, 'general');
          });
      };
    
      this.appProfilePopupClickListener = (event) => {
        const action = event.currentTarget.id;
        switch(action) {
          case 'open-profile-viewer-link':
            clearAppProfile();
            viewAppProfileManager(null);
            break;
          case 'profile-signout-link':
            closeSelectAppProfilePopup('selectAppProfilePopup');
            break;
        }
      };

      this.appProfileDialogClickListener = (event) => {
        const action = event.currentTarget.id;
        switch(action) {
          case 'profile-editor-toggler':
            setProfileEditorState();
            break;
          case 'clear-image-icon':
            clearAppProfileImage();
            break;
        }
      };

      function activateAppProfile(id) {
        AppProfileManager.activateAppProfile(id)
          .then(reply => {
            if (reply.body.messages.length > 0) {
              MessageDisplaying.displayMessagesAsHTML(reply.body.messages, 'Account Sign-In', 'warning', 5000);
            }
  
            closeAppProfileDialog('app-profile-dialog');
            const chooser = reply.body.data.preferences.startupTaskChooserType;
            viewParams.onAppProfileActivated('domain-connection', 'provider-management', {chooser: chooser, stealthEnabled: chooser === 'use-cards'});
          });
      }

      function viewAppProfileSelector() {
        openSelectAppProfilePopup('selectAppProfilePopup', '#appProfileDialogLauncher');
      }

      function getDataProfileId() {
        // Set return value to null
        let id = null;
        const target = document.getElementById('appProfileDialogLauncher');
        if (target !== null) {
          // Found node with attribute ('data-profile-id') we
          // store id in. Look for the attribute.
          const attr = target.attributes['data-profile-id'];
          if (CoreUtils.isNotUndefinedNorNull(attr)) {
            // Found the attribute, so get value assigned to it.
            // Be mindful that attribute values are strings, so
            // the value will be 'null' if it null was stored.
            id = attr.value;
          }
        }
        // The return value will either be null (i.e value
        // assigned when variable was declared), 'null' or
        // a real profile id. Return null, if not the latter
        // is not the case.
        return (id !== null && id !== 'null' ? id : null);
      }
  
      function setDataProfileId(id) {
        const previousId = getDataProfileId();
        if (!self.profileWasChanged) {
          self.profileWasChanged = (previousId === null);
        }
        const target = document.getElementById('appProfileDialogLauncher');
        target.setAttribute('data-profile-id', id);
      }
      
      function setProfileDialogFields(profile) {
        self.dialogFields.id(profile.id);
        self.dialogFields.general.account.organization(profile.general.account.organization);
        self.dialogFields.general.account.name(profile.general.account.name);
        self.dialogFields.general.account.email(profile.general.account.email);
        self.dialogFields.settings.useCredentialStorage(profile.settings.useCredentialStorage);
        self.dialogFields.settings.disableHNV(profile.settings.disableHNV);
        self.dialogFields.settings.proxyAddress(profile.settings.networking.proxyAddress);
        self.dialogFields.settings.trustStoreType(profile.settings.security.trustStoreType);
        self.dialogFields.settings.trustStorePath(profile.settings.security.trustStorePath);
        self.dialogFields.settings.trustStoreKey(profile.settings.security.trustStoreKey);
        self.dialogFields.settings.connectionTimeout(profile.settings.timeouts.connectionTimeout);
        self.dialogFields.settings.readTimeout(profile.settings.timeouts.readTimeout);
        self.dialogFields.preferences.theme(profile.preferences.theme);
        self.dialogFields.preferences.startupTaskChooserType(profile.preferences.startupTaskChooserType);
        self.dialogFields.preferences.onQuit(profile.preferences.confirmations.onQuit);
        self.dialogFields.preferences.onDelete(profile.preferences.confirmations.onDelete);
        self.dialogFields.preferences.onActionNotAllowed(profile.preferences.popups.onActionNotAllowed);
        self.dialogFields.preferences.onUnsavedChangesDetected(profile.preferences.popups.onUnsavedChangesDetected);
        self.dialogFields.preferences.onChangesNotDownloaded(profile.preferences.popups.onChangesNotDownloaded);
        self.dialogFields.properties.javaSystemProperties(profile.properties.javaSystemProperties);
        self.dialogFields.imageDataUrl(profile.imageDataUrl);
  
        setProfileEditorVisibility(profile.id !== null);
      }

      function setProfileEditorState(state) {
        const profileEditor = document.getElementById('profile-editor-container');
        if (profileEditor !== null) {
          if (CoreUtils.isUndefinedOrNull(state)) {
            state = profileEditor.attributes['data-profile-editor-state'];
            profileEditor.setAttribute('data-profile-editor-state', (state.value === 'hide' ? 'show' : 'hide'));
          }
          else {
            profileEditor.setAttribute('data-profile-editor-state', state.value);
          }
          self.i18n.dialog.profile.editor.toggler.editor.value((state.value === 'hide' ? self.i18n.dialog.profile.editor.toggler.editor.show.value : self.i18n.dialog.profile.editor.toggler.editor.hide.value));
        }
      }

      function setProfileEditorVisibility(visible) {
        self.i18n.icons.profile.dialog.editor.visible(visible);
      }

      function setActivateIconVisibility(visible) {
        self.i18n.icons.profile.dialog.editor.toolbar.activate.visible(visible);
      }

      function clearAppProfile() {
        AppProfileManager.getDefaultAppProfile()
          .then(newProfile => {
            setDataProfileId(newProfile.id);
            clearAppProfileImages();
            setProfileDialogFields(newProfile);
            Runtime.setStartupTaskChooser(newProfile.preferences.startupTaskChooserType);
          })
          .catch(response => {
            if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
              MessageDisplaying.displayMessagesAsHTML(response.body.messages, 'Replace Profile Image', 'error', 5000);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          });
      }
  
      function createCurrentProfilePic() {
        const span = document.querySelector('.cfe-branding-area-profile-icon');
  
        if (span !== null) {
          const img = document.createElement('img');
          img.setAttribute('id', 'current-profile-pic');
          img.setAttribute('alt', self.i18n.icons.profile.dialog.launcher.tooltip);
          img.setAttribute('title', self.i18n.icons.profile.dialog.launcher.tooltip);
          img.setAttribute('src', `js/jet-composites/wrc-frontend/1.0.0/images/${self.i18n.icons.profile.dialog.launcher.iconFile}.png`);
  
          span.append(img);
        }
      }

      function setAppProfileImages(imageDataUrl) {
        if (imageDataUrl) {
          let img = document.getElementById('new-profile-pic');
          img.src = imageDataUrl;
          img = document.getElementById('current-profile-pic');
          img.src = imageDataUrl;
        }
      }

      function replaceAppProfileImage(file) {
        AppProfileManager.replaceAppProfileImage(getDataProfileId(), file)
          .then(reply => {
            setAppProfileImages(reply.body.data.imageDataUrl);
            self.dialogFields.imageDataUrl(reply.body.data.imageDataUrl);
          })
          .catch(response => {
            if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
              MessageDisplaying.displayMessagesAsHTML(response.body.messages, 'Replace Profile Image', 'error', 5000);
            }
            else {
              ViewModelUtils.failureResponseDefaultHandling(response);
            }
          });
      }
  
      function clearFileChooser() {
        $('#profile-file-chooser').val(null);
      }
  
      function clearAppProfileImage() {
        if (self.dialogFields.imageDataUrl() !== '') {
          AppProfileManager.clearAppProfileImage(getDataProfileId())
            .then(reply => {
              clearAppProfileImages();
              self.dialogFields.imageDataUrl('');
            })
            .catch(response => {
              if (CoreUtils.isNotUndefinedNorNull(response.body.messages) && response.body.messages.length > 0) {
                MessageDisplaying.displayMessagesAsHTML(response.body.messages, 'Replace Profile Image', 'error', 5000);
              }
              else {
                ViewModelUtils.failureResponseDefaultHandling(response);
              }
            });
        }
      }

      function clearAppProfileImages() {
        let img = document.getElementById('new-profile-pic');
        if (img !== null) {
          img.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + self.i18n.icons.profile.image.capture.iconFile + '.png');
        }
        img = document.getElementById('current-profile-pic');
        if (img !== null) {
          img.setAttribute('src', 'js/jet-composites/wrc-frontend/1.0.0/images/' + self.i18n.icons.profile.dialog.launcher.iconFile + '.png');
        }
      }

      function openAppProfileDialog(dialogElementId, launcherSelector) {
        const dialog = document.getElementById(dialogElementId);
        if (dialog !== null) {
          removeDialogHeaderTitleNode(dialog);
          setDialogPosition(dialog, launcherSelector);
          setProfileEditorState({value: 'hide'});
          clearFileChooser();
          dialog.open(launcherSelector);
        }
      }

      function closeAppProfileDialog(dialogElementId) {
        const dialog = document.getElementById(dialogElementId);
        if (dialog !== null) {
//MLW          setProfileEditorState({value: 'hide'});
          if (dialog.isOpen()) dialog.close();
          dialog.style.height = 'unset';
        }
      }

      function viewAppProfileManager(id, section = 'general') {
        AppProfileManager.loadAppProfile(id)
          .then(reply => {
            if (reply.body.messages.length > 0) {
              MessageDisplaying.displayMessagesAsHTML(reply.body.messages, 'Account Sign-In', 'warning', 5000);
            }

            setDataProfileId(id);
            setAppProfileImages(reply.body.data.imageDataUrl);
            setProfileDialogFields(reply.body.data);
            self.selectedTabStripItem(section);
            openAppProfileDialog('app-profile-dialog', '#appProfileDialogLauncher');
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          });
      }

      function openSelectAppProfilePopup(popupElementId, launcherSelector = '#appProfileDialogLauncher') {
        const popup = closeSelectAppProfilePopup(popupElementId);
        if (popup !== null) {
          popup.open(launcherSelector);
        }
      }

      function closeSelectAppProfilePopup(popupElementId) {
        const popup = document.getElementById(popupElementId);
        if (popup !== null) {
          if (popup.isOpen()) popup.close();
        }
        return popup;
      }

      function removeDialogHeaderTitleNode(dialog) {
        const nodeList = document.querySelectorAll(`#${dialog.id} > div.oj-dialog-container > div.oj-dialog-header`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            nodeList[i].remove();
          }
        }
      }

      function removeDialogResizableHandleNodes(event) {
        const nodeList = document.querySelectorAll(`#${event.currentTarget.id} .oj-resizable-handle`);
        if (nodeList !== null) {
          let arr = Array.from(nodeList);
          for (let i in arr.reverse()) {
            const classList = nodeList[i].className.split(' ').filter(e => e);
            if (!['oj-resizable-w', 'oj-resizable-sw','oj-resizable-s'].includes(classList.at(-1))) {
              nodeList[i].remove();
            }
          }
        }
      }

      function setDialogPosition(dialog, launcherSelector) {
        dialog.setProperty('position.of', launcherSelector);
        dialog.setProperty('position.at.horizontal', 'right');
        dialog.setProperty('position.at.vertical', 'bottom');
        dialog.setProperty('position.my.vertical', 'top');
      }

      Context.getPageContext().getBusyContext().whenReady()
        .then(() => {
          if (self.i18n.icons.profile.popup.launcher.visible()) {
            createCurrentProfilePic();
            clearAppProfileImages();
            AppProfileManager.getCurrentAppProfile()
              .then(reply => {
                setDataProfileId(reply.body.data.id);
                setAppProfileImages(reply.body.data.imageDataUrl);
                setProfileDialogFields(reply.body.data);
                Runtime.setStartupTaskChooser(reply.body.data.preferences.startupTaskChooserType);
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              })
              .finally(() => {
                setProfileEditorState({value: 'show'});
                self.i18n.icons.profile.dialog.editor.toolbar.activate.visible(false);
              });
          }
        });
    }
  
    return AppProfileTemplate;
  }
);