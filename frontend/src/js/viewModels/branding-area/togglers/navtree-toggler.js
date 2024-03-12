/**
 * @license
 * Copyright (c) 2021, 2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define([
    'ojs/ojcore',
    'knockout',
    '../../../app-resizer',
    'wrc-frontend/integration/viewModels/utils',
    'wrc-frontend/core/runtime'
  ],
  function (
    oj,
    ko,
    AppResizer,
    ViewModelUtils,
    Runtime
  ) {
    function NavTreeToggler(viewParams){
      const self = this;

      this.i18n = {
        icons: {
          navtree: {
            toggler: {
              iconFile: ko.observable('navigation-icon-toggle-greyed_24x24'),
              tooltip: oj.Translations.getTranslatedString('wrc-header.icons.navtree.toggler.tooltip')
            }
          }
        },
        canvas: {
          navtree: {
            toggler: {
              greyed: {
                iconFile: 'navigation-icon-toggle-greyed_24x24',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.navtree.toggler.tooltip')
              },
              expanded: {
                iconFile: 'navigation-icon-toggle-on-blk_24x24',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.navtree.toggler.tooltip')
              },
              collapsed: {
                iconFile: 'navigation-icon-toggle-off-blk_24x24',
                tooltip: oj.Translations.getTranslatedString('wrc-header.icons.navtree.toggler.tooltip')
              }
            }
          }
        }
      };

      // Begin with navtree being invisible and disabled
      this.navtreeVisible = ko.observable(false);
      this.navtreeDisabled = ko.observable(true);

      this.signalBindings = [];

      this.connected = function () {
        this.navtreeVisible.subscribe((visible) => {
          signalPerspectiveSelected(visible);
        });

        let binding = viewParams.signaling.perspectiveSelected.add((newPerspective) => {
          if (!self.navtreeDisabled()) {
            // Show navtree
            self.navtreeVisible(true);
          }
          // Enable the toggle navtree visibility icon.
          self.navtreeDisabled(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeLoaded.add((newPerspective) => {
          // Enable the toggle navtree visibility icon,
          self.navtreeDisabled(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.modeChanged.add((newMode) => {
          if (newMode === 'DETACHED') {
            self.navtreeDisabled(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
            setNavtreeTogglerIconImage('greyed-icon');
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            self.navtreeDisabled(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
            setNavtreeTogglerIconImage('greyed-icon');
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          if (dataProvider.id === Runtime.getDataProviderId()) {
            setNavTreeDisabledState(true);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setNavTreeDisabledState(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          setNavTreeDisabledState(true);
          setNavtreeTogglerIconImage('greyed-icon');
        });
        
        self.signalBindings.push(binding);

        binding = viewParams.signaling.beanTreeSelected.add((beanTree) => {
          if (beanTree.type === 'home') {
            setNavTreeVisibility(false);
            setNavTreeDisabledState(true);
          }
        });

        self.signalBindings.push(binding);

        setNavtreeTogglerIconImage('greyed-icon');
      };

      this.disconnected = function () {
        this.navtreeVisible.dispose();

        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      };

      this.navtreeToggleClick = function(event) {
        event.preventDefault();
        setNavTreeVisibility(!self.navtreeVisible());
      };

      function setNavTreeDisabledState(state) {
        self.navtreeDisabled(state);
        // Set navtreeVisible observable to false, if it's
        // currently true. Otherwise, do nothing.
        if (self.navtreeVisible()) self.navtreeVisible(!state);
      }

      function getNavTreeWidthAttribute() {
        const ele = document.getElementById('navtree-toggler-link');
        return (ele !== null ? ele.attributes['data-navtree-width'].value : '0');
      }

      function setNavTreeWidthAttribute(value) {
        // Only update the 'data-navtree-width' attribute if
        // value is greater than 0
        if (value > 0) {
          if (value > AppResizer.prototype.NAVTREE_MIN_WIDTH && value < AppResizer.prototype.NAVTREE_MAX_WIDTH) {
            value = AppResizer.prototype.NAVTREE_MAX_WIDTH;
          }

          const ele = document.getElementById('navtree-toggler-link');
          if (ele !== null) ele.setAttribute('data-navtree-width', `${value}`);
        }
      }

      function toggleNavTree(visible) {
        const container = document.getElementById('navtree-container');
        if (container !== null) {
          setNavTreeWidthAttribute(container.offsetWidth);
          if (visible) {
            container.style.display = 'inline-flex';
            signalNavTreeResized(visible, container.offsetLeft, ~~getNavTreeWidthAttribute());
          }
          else {
            container.style.display = 'none';
            signalNavTreeResized(visible, container.offsetLeft, container.offsetWidth);
          }
        }
      }

      function signalPerspectiveSelected(visible) {
        setNavtreeTogglerIconImage(visible ? 'expanded-icon' : 'collapsed-icon');
        toggleNavTree(visible);
      }

      function signalNavTreeResized(visible, offsetLeft, offsetWidth){
        viewParams.onResized((visible ? 'opener': 'closer') , offsetLeft, offsetWidth);
      }

      function setNavTreeVisibility(visible, source = 'signal'){
        if (!self.navtreeDisabled()) {
          // Toggle navtree visibility icon is enabled, so
          // set navtreeVisible observable to whatever is
          // assigned to the visible parameter.
          if (source === 'signal') {
            self.navtreeVisible(visible);
            // Send signal about navtree being toggled
            viewParams.signaling.navtreeToggled.dispatch(source, visible);
          }
        }
      }

      function setNavtreeTogglerIconImage(iconId){
        const canvas = document.getElementById('navtree-toggler-icon');
        if (canvas !== null) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 24, 24);
          const img = document.getElementById(iconId);
          ctx.drawImage(img, 0, 0);
          img.onload = function(event){
            ctx.drawImage(img, 1, 1, 23, 23, 0, 0, 24, 24);
          }
        }
      }

    }

    return NavTreeToggler;
  }
);