/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', 'wrc-frontend/microservices/preferences/preferences', 'wrc-frontend/core/runtime', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types'],
  function (ko, Preferences, Runtime, ViewModelUtils, CoreUtils, CoreTypes) {
    function NavTreeToggler(viewParams){
      var self = this;

      // Begin with navtree being invisible and disabled
      this.navtreeVisible = ko.observable(false);
      this.navtreeDisabled = ko.observable(true);

      this.signalBindings = [];

      this.connected = function () {
        this.navtreeVisibleSubscription = this.navtreeVisible.subscribe((visible) => {
          signalPerspectiveSelected(visible);
        });

        let binding = viewParams.signaling.perspectiveSelected.add((newPerspective) => {
          // Show navtree
          self.navtreeVisible(true);
          setNavTreeDisabledState(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.ancillaryContentAreaToggled.add((source, visible) => {

          // Set visibility of navtree based on a negation of
          // the visible parameter.
          setNavTreeVisibility(!visible, source);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreeLoaded.add((newPerspective) => {
          setNavTreeDisabledState(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.navtreePlacementChanged.add((newPlacement) => {
          if (!self.navtreeDisabled()) {
            switch (newPlacement) {
              case CoreTypes.Navtree.Placement.DOCKED.name:
                setNavTreeVisibility(true);
                break;
              case CoreTypes.Navtree.Placement.FLOATING.name:
                setNavTreeVisibility(false);
                break;
            }
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSectionToggled.add((visible) => {
          // Only hide navtree if visible === true
          if (visible) setNavTreeVisibility(false);
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.modeChanged.add((newMode) => {
          if (newMode === "DETACHED") {
            setNavTreeDisabledState(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add((dataProvider) => {
          const beanTree = dataProvider.beanTrees.find(beanTree => beanTree.provider.id === dataProvider.id);
          if (CoreUtils.isNotUndefinedNorNull(beanTree)) {
            setNavTreeDisabledState(true);
            if (self.navtreeVisible()) self.navtreeVisible(false);
          }
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          setNavTreeDisabledState(true);
        });

        self.signalBindings.push(binding);

      };

      this.disconnected = function () {
        this.navtreeVisibleSubscription.dispose();

        // Detach all signal "add" bindings
        self.signalBindings.forEach(binding => { binding.detach(); });

        // Reinitialize module-scoped array for storing
        // signal "add" bindings, so it can be GC'd by
        // the JS engine.
        self.signalBindings = [];
      };

      this.navTreeToggleThemeIcon = function(state){
        const theme = Preferences.general.themePreference();
        if (state === "on") {
          return (theme === "light" ? "navigation-icon-toggle-on-blk_24x24" : "navigation-icon-toggle-on-blk_24x24");
        }
        else {
          return (theme === "light" ? "navigation-icon-toggle-off-blk_24x24" : "navigation-icon-toggle-off-blk_24x24");
        }
      };

      this.navtreeToggleClick = (event) => {
        event.preventDefault();
        if (!self.navtreeDisabled()) {
          setNavTreeVisibility(!self.navtreeVisible(), "toggle");
        }
      };

      function setNavTreeDisabledState(state) {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
          self.navtreeDisabled(state);
          // Set navtreeVisible observable to false, if it's
          // currently true. Otherwise, do nothing.
          if (self.navtreeVisible()) self.navtreeVisible(!state);
        }
      }

      function signalPerspectiveSelected(visible) {
        const ele = document.getElementById("navtree-container");
        // Check for null to guard against being called before
        // the DOM is rendered.
        if (ele !== null) {
          // The DOM has been rendered, but we only want to do
          // something if we're running in the "app" role. In
          // that role, the navtree can either be "docked" or
          // "floating".
          if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
            if (visible) {
              const dockedMinWidth = ViewModelUtils.getCustomCssProperty("resizer-left-panel-min-width");
              // Show (e.g. add) "docked" navtree to the DOM, and
              // set width to min-width
              const styles = {display: "inline-flex", width: dockedMinWidth};
              Object.assign(ele.style, styles);
              // Send signal that navtree has been resized
              signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
            }
            else {
              // Send signal that navtree has been resized
              signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
              // Hide (e.g. remove) "docked" navtree in the DOM, and
              // set width to 0
              const styles = {display: "none", width: '0px'};
              Object.assign(ele.style, styles);
            }
          }

          setNavTreeVisibility(visible);
        }
      }

      function signalNavTreeResized(visible, offsetLeft, offsetWidth){
        viewParams.onResized((visible ? "opener": "closer") , offsetLeft, offsetWidth);
      }

      function setNavTreeVisibility(visible, source = "signal"){
        if (!self.navtreeDisabled()) {
          // Toggle navtree visibility icon is enabled, so
          // set navtreeVisible observable to whatever is
          // assigned to the visible parameter.
          if (source !== "breadcrumb") self.navtreeVisible(visible);
        }
        // Send signal about navtree being toggled
        viewParams.signaling.navtreeToggled.dispatch(source, visible);
      }

    }

    return NavTreeToggler;
  }
);