/**
 * @license
 * Copyright (c) 2021, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['knockout', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils'],
  function (ko, Preferences, Runtime, CoreUtils) {
    function NavTreeToggler(viewParams){
      var self = this;

      // Begin with navtree being invisible and disabled
      this.navtreeVisible = ko.observable(false);
      this.navtreeDisabled = ko.observable(true);

      this.signalBindings = [];

      this.connected = function () {
        this.navtreeVisible.subscribe((visible) => {
          signalPerspectiveSelected(visible);
        });

        let binding = viewParams.signaling.perspectiveSelected.add((newPerspective) => {
          // Show navtree
          self.navtreeVisible(true);
          // Enable the toggle navtree visibility icon.
          self.navtreeDisabled(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.ancillaryContentAreaToggled.add((source, visible) => {
          // Set visibility of navtree based on a negation of
          // the visible parameter.
          setNavTreeVisibility(!visible, source);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeLoaded.add((newPerspective) => {
          // Enable the toggle navtree visibility icon,
          self.navtreeDisabled(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSectionToggled.add((visible) => {
          // Only hide navtree if visible === true
          if (visible) setNavTreeVisibility(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.modeChanged.add((newMode) => {
          if (newMode === 'DETACHED') {
            self.navtreeDisabled(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((removedDataProvider) => {
          if (removedDataProvider.id === Runtime.getDataProviderId()) {
            self.navtreeDisabled(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderLoadFailed.add((dataProvider) => {
          setNavTreeDisabledState(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setNavTreeDisabledState(true);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.backendConnectionLost.add(() => {
          setNavTreeDisabledState(true);
        });

        self.signalBindings.push(binding);

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

      this.navTreeToggleThemeIcon = function(state){
        const theme = Preferences.general.themePreference();
        if (state === 'on') {
          return (theme === 'light' ? 'navigation-icon-toggle-on-blk_24x24' : 'navigation-icon-toggle-on-blk_24x24');
        }
        else {
          return (theme === 'light' ? 'navigation-icon-toggle-off-blk_24x24' : 'navigation-icon-toggle-off-blk_24x24');
        }
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

      function signalPerspectiveSelected(visible) {
        let ele = document.getElementById('navtree-container');
        if (ele !== null) {
          if (visible) {
            ele.style.display = 'inline-flex';
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
          }
          else {
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
            ele.style.display = 'none';
          }
          setNavTreeVisibility(visible);
        }
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

    }

    return NavTreeToggler;
  }
);
