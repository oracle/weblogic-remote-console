/**
 Copyright (c) 2024, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define([
  'ojs/ojcore',
  'knockout',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/runtime',
  'wrc-frontend/core/utils',
  'ojs/ojknockout'
],
function (
  oj,
  ko,
  PerspectiveMemoryManager,
  ViewModelUtils,
  Runtime,
  CoreUtils
) {
    function BeanPathHistoryIcon(viewParams) {
      const self = this;
  
      this.i18n = {
        icons: {
          'recentpages': {
            id: 'recent-pages', iconFile: ko.observable('toggle-beanpath-history-on-blk_24x24'), disabled: ko.observable(false), visible: ko.observable(false),
            label: oj.Translations.getTranslatedString('wrc-common.tooltips.recentPages.value')
          }
        }
      };
  
      this.perspectiveMemory = undefined;

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.domainChanged.add((source) => {
          self.setIconbarIconVisibility('recentpages', false);
          onIconbarIconClicked(false);
        });

        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.backendConnectionLost.add(() => {
          self.setIconbarIconVisibility('recentpages', false);
        });
  
        self.signalBindings.push(binding);
  
        binding = viewParams.signaling.beanTreeChanged.add(newBeanTree => {
          if (newBeanTree.type !== 'home') {
            self.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(newBeanTree.type);
            self.setIconbarIconVisibility('recentpages', true);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add(dataProvider => {
          self.setIconbarIconVisibility('recentpages', false);
          onIconbarIconClicked(false);
        });

        self.signalBindings.push(binding);

      }.bind(this);

      this.disconnected = function () {
        // Detach all signal "add" bindings.
        self.signalBindings.forEach(binding => {
          binding.detach();
        });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];

      }.bind(this);

      this.contentAreaHeaderIconClickHandler = (event) => {
        // Set visible to false if self.perspectiveMemory
        // is undefined. Otherwise, set it to whatever value
        // is assigned to self.perspectiveMemory.beanPathHistory.visibility
        const visible = (CoreUtils.isUndefinedOrNull(self.perspectiveMemory) ? false : self.perspectiveMemory.historyVisibility());
        // Need to negate value of visible, because the click
        // even is exclusively for toggling the state.
        onIconbarIconClicked(!visible);
      };

      this.setIconbarIconVisibility = function (iconId, visible) {
        if (!Runtime.getProperty('features.iconbarIcons.relocated')) {
          visible = false;
        }
        self.i18n.icons[iconId].visible(visible);
      };

      this.getIconbarIconVisibility = function (iconId) {
        return (self.getIconbarIconToggleState(iconId) === 'inline-flex');
      };

      this.getIconbarIconToggleState = function (iconId) {
        return {value: ViewModelUtils.getCustomCssProperty('--beanpath-history-container-calc-display')};
      };

      function onIconbarIconClicked(visible) {
        ViewModelUtils.abandonUnsavedChanges('exit', self.canExitCallback)
          .then(reply => {
            if (reply) {
              // Use self.perspectiveMemory, if it's not undefined
              if (CoreUtils.isNotUndefinedNorNull(self.perspectiveMemory)) {
                // ..it's not, so set self.perspectiveMemory.beanPathHistory.visibility
                // based on the following:
                //
                // Set it to true, if visible === true and self.perspectiveMemory.beanPathHistory.visibility === true
                // Otherwise, set it to whatever value visible is.
                self.perspectiveMemory.setHistoryVisibility(visible && self.perspectiveMemory.historyVisibility() ? true: visible);
              }
              setIconbarIconToggleState('--beanpath-history-container-calc-display', visible);
            }
          })
          .then(() => {
            viewParams.signaling.resizeObserveeNudged.dispatch('beanpath-history-icon');
          })
          .catch(failure => {
            ViewModelUtils.failureResponseDefaultHandling(failure);
          });
      }

      /**
       * Sets the toggle state of the `recent-pages` view and view model.
       * <p>The <code>visible</code> parameter must already be set to the desired state! In other words, the implementation of this method does not negate it's value.</p>
       * @param {string} cssVariableName
       * @param {boolean} visible
       * @private
       */
      function setIconbarIconToggleState(cssVariableName, visible) {
        // Declare return variable using default values
        const toggleState = {previousValue: undefined, value: undefined};
        // Get current value of cssVariableName, which will
        // be treated as the "previous" value.
        toggleState.previousValue = ViewModelUtils.getCustomCssProperty(cssVariableName);
        // Just use the value assigned to visible parameter
        // to compute "current" value, don't negate it.
        toggleState.value = (visible ? 'inline-flex' : 'none');
        // cssVariableName is tied to a "display" attribute
        // in the CSS stylesheet, so updating it will cause
        // an element to become visible or hidden.
        ViewModelUtils.setCustomCssProperty(cssVariableName, toggleState.value);
        // Change knockout observable for the iconFile, based
        // on toggleState.value;
        self.i18n.icons.recentpages.iconFile(toggleState.value === 'inline-flex' ? 'toggle-beanpath-history-off-blk_24x24' : 'toggle-beanpath-history-on-blk_24x24');
        // Set focus to dropdown, if it is visible
        if (visible) $('#beanpath-history-entries').focus();
      }

    }

    return BeanPathHistoryIcon;
  }
);