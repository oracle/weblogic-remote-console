/**
 * @license
 * Copyright (c) 2023, 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils',
  'ojs/ojmenu',
  'ojs/ojoption',
  'ojs/ojmenuselectmany'
],
  function(
    oj,
    ko,
    ViewModelUtils,
    Runtime,
    CoreUtils
  ) {

    function MessageLineTemplate(viewParams){
      const self = this;

      this.i18n = {
        'ariaLabel': {
          'region': {
            'value': oj.Translations.getTranslatedString('wrc-message-line.ariaLabel.region.value')
          }
        },
        icons: {
          'more': {
            iconFile: ko.observable('more-vertical-wht-18x24'),
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.more.value')
          },
          'clear': {
            iconFile: ko.observable('close-icon-blk_24x24'),
            tooltip: oj.Translations.getTranslatedString('wrc-common.tooltips.close.value')
          }
        },
        menus: {
          more: {
            'clear': {id: 'clear-message', disabled: false,
              value: 'clear-message',
              label: oj.Translations.getTranslatedString('wrc-message-line.menus.more.clear.label')
            },
            'suppress-info': {id: 'suppress-info', disabled: false,
              value: 'suppress-info',
              label: oj.Translations.getTranslatedString('wrc-message-line.menus.more.suppress.info.label')
            },
            'suppress-warning': {id: 'suppress-warning', disabled: false,
              value: 'suppress-warning',
              label: oj.Translations.getTranslatedString('wrc-message-line.menus.more.suppress.warning.label')
            }
          }
        }
      };

      // Initialize instance-scope variables used in message-line.html
      this.suppressMenuItemValues = ko.observableArray([]);

      this.messageLine = {
        message: ko.observable(''),
        severity: ko.observable('none'),
        link: {
          label: ko.observable()
        },
        details: {
          label: ko.observable()
        },
        pollWhenQuiesced: false
      };

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          clearHeaderMessageLine();
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            clearHeaderMessageLine();
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.domainStatusPollingCompleted.add((data) => {
          function getPollWhenQuiesced(data) {
            return (data.messageHTML ? data.messageHTML.startsWith('Unable to connect to the WebLogic domain') : false);
          }

          if (CoreUtils.isNotUndefinedNorNull(data) && Object.keys(data).length > 0) {
            setMessageCenterAlerts(data)
              .then((counts) => {
                // Comment out the following line to use the
                // data from the GET response, instead of the
                // "demo" messages. Don't comment out the
                // setHeaderMessageLine(data) line, though!
                if (!Runtime.getProperty('features.appAlerts.disabled')) data = getMockupMessageLine(3);
                setHeaderMessageLine(data);
                if (getPollWhenQuiesced(data)) {
                  viewParams.signaling.adminServerShutdown.dispatch();
                }
                else {
                  viewParams.onAlertsReceived({alerts: data.alerts, counts: counts});
                }
              });
          }
          else {
            clearHeaderMessageLine();
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          clearHeaderMessageLine();
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      }.bind(this);

      function setMessageCenterAlerts(data) {
        return new Promise(function (resolve) {
          const highPriority = {
            errors: 2,
            warnings: 1,
            infos: 0,
            total: 3
          };
          resolve(highPriority);
        });
      }

      function getMockupMessageLine(index) {
        function getMessageLineIndex(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          // FortifyIssueSuppression Insecure Randomness
          // The Math.random is used to come up with an array index into mockup message lines, used for demo and CSS styling purposes.
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
/*
        href: 'https://oracle.github.io/weblogic-remote-console/troubleshoot-weblogic-remote-console/'
              resourceData: `/api/${Runtime.getDataProviderId()}/domainRuntime/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings`
*/
        const messageLines = [
          {
            messageHTML: 'Click the "Troubleshooting Docs" button to get more details on the issue that just occurred',
            severity: 'info',
            link: {
              label: 'Troubleshooting Docs',
              href: 'http://lcr01022.us.oracle.com:8080/reference/troubleshoot/'
            }
          },
          {},
          {
            messageHTML: 'Domain not reachable',
            severity: 'warning'
          },
          {
            messageHTML: 'Security warnings detected!',
            severity: 'error',
            link: {
              label: 'View/Refresh Report',
              resourceData: `/api/${Runtime.getDataProviderId()}/domainRuntime/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings`
            },
            alerts: {
              resourceData: `/api/${Runtime.getDataProviderId()}/domainRuntime/data/DomainRuntime/MessageCenter/Alerts`
            }
          },
          {
            messageHTML: 'This is an example of a really long messageHTML value. It has multiple sentences, and doesn\'t use any HTML elements (because the person creating the message didn\'t know that you can do that). In this case, the entire messageHTML value is going to wrap, increasing the height of the message line box to accommodate the space needed.',
            severity: 'warning',
            link: {
              label: 'Show Log',
              resourceData: `/api/${Runtime.getDataProviderId()}/domainRuntime/data/DomainRuntime/DomainSecurityRuntime?slice=SecurityWarnings`
            }
          },
          {
            messageHTML: 'This is an example of a message line after someone realizes that the value assigned to the <b><i>messageHTML</i></b> JSON object, can contain any HTML. It will wrap to multiple lines if needed, and can also include <a href="#">hyperlinks</a> to documentation. If you want a button that takes you to a form or table when clicked, just add a <code>link</code> JSON object:<pre>   {\n      "messageHTML":"String containing HTML elements",\n      "severity":"error|warning|info",\n      "link":{\n         "label":"Button Label",\n         "resourceData":"/api/provider-id/..."\n      }\n   }</pre><p>The <code>link</code> JSON object is used to create the button appearing in the lower-right corner of the message line.</p>',
            severity: 'info',
            link: {
              label: 'Show Form/Table'
            }
          },
          {
            messageHTML: 'This is the same really long messageHTML value, except there is a link to go with it. It has multiple sentences, and doesn\'t use any HTML elements (because the person creating the message didn\'t know that you can do that). In this case, the entire messageHTML value is going to wrap, increasing the height of the message line box to accommodate the space needed.',
            severity: 'info'
          }
        ];

        if (typeof index !== 'undefined') {
          return messageLines[index];
        }
        else {
          return messageLines[getMessageLineIndex(0, messageLines.length - 1)];
        }
      }

      this.messageLineLinkClickHandler = (event) => {
        if (CoreUtils.isNotUndefinedNorNull(self.messageLine.link.href)) {
          openHRefIfPresent(self.messageLine.link.href);
        }
        else if (CoreUtils.isNotUndefinedNorNull(self.messageLine.link.resourceData)) {
          const perspectiveId = 'monitoring';
          viewParams.parentRouter.go(`/${perspectiveId}/${encodeURIComponent(self.messageLine.link.resourceData)}`);
          viewParams.signaling.galleryItemSelected.dispatch(perspectiveId);
        }
      };

      this.messageLineDetailsClickHandler = (event) => {
        if (CoreUtils.isNotUndefinedNorNull(self.messageLine.details.messageDetails)) {
          const displayMessage = {
            severity: (self.messageLine.details.messageSeverity || 'error'),
            summary: self.messageLine.message(),
            detail: self.messageLine.details.messageDetails
          };
          ViewModelUtils.displayResponseMessage(displayMessage);
        }
      };

      this.launchMoreMenu = function (event) {
        event.preventDefault();
        document.getElementById('messageLineMoreMenu').open(event);
      }.bind(this);

      this.moreMenuClickListener = (event) => {
        switch (event.target.value) {
          case 'clear':
            clearHeaderMessageLine();
            break;
          case 'suppress-info':
          case 'suppress-warning':
            console.log(`[MESSAGE-LINE] event.target.value=${event.target.value}`);
            break;
        }
      };

      function openHRefIfPresent(url) {
        if (!CoreUtils.isValidUrl(url)) return;

        if (ViewModelUtils.isElectronApiAvailable()) {
          window.electron_api.ipc.invoke('external-url-opening', url);
        }
        else {
          window.open(url, '_blank', 'noopener noreferrer');
        }
      }

      function setHeaderMessageLine(obj) {
        delete self.messageLine.link.resourceData;
        delete self.messageLine.link.href;
        delete self.messageLine.details.messageDetails;
        delete self.messageLine.details.messageSeverity;

        if (CoreUtils.isNotUndefinedNorNull(obj.messageHTML)) {
          self.messageLine.message(obj.messageHTML);
          self.messageLine.severity(obj.severity);
          self.i18n.icons.more.iconFile(obj.severity === 'info' ? 'more-vertical-blk-18x24' : 'more-vertical-wht-18x24');
          self.i18n.icons.clear.iconFile(obj.severity === 'info' ? 'close-icon-blk_24x24' : 'close-icon-wht_24x24');
        }
        else {
          self.messageLine.message('');
        }

        if (CoreUtils.isNotUndefinedNorNull(obj.link)) {
          self.messageLine.link.label(obj.link.label);
          if (CoreUtils.isNotUndefinedNorNull(obj.link.resourceData)) self.messageLine.link['resourceData'] = obj.link.resourceData;
          if (CoreUtils.isNotUndefinedNorNull(obj.link.href)) self.messageLine.link['href'] = obj.link.href;
        }
        else {
          self.messageLine.link.label('');
        }

        if (CoreUtils.isNotUndefinedNorNull(obj.messageDetails)) {
          self.messageLine.details.label(obj.messageDetails.label);
          self.messageLine.details['messageDetails'] = obj.messageDetails.message;
          self.messageLine.details['messageSeverity'] = obj.severity;
        }
        else {
          self.messageLine.details.label('');
        }
      }

      this.clearIconClickListener = (event) => {
        clearHeaderMessageLine();
      };

      function clearHeaderMessageLine() {
        self.messageLine.message('');
        self.messageLine.link.label('');
        delete self.messageLine.link.resourceData;
        delete self.messageLine.link.href;
        self.messageLine.details.label('');
        delete self.messageLine.details.messageDetails;
        delete self.messageLine.details.messageSeverity;
      }
    }

    return MessageLineTemplate;
  }
);