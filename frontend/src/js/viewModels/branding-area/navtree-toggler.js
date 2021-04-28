/**
 * @license
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

define(['knockout', '../../core/runtime', '../../microservices/preferences/preferences'],
  function (ko, Runtimes, Preferences) {
    function NavTreeToggler(viewParams){
      var self = this;

      // Begin with navtree being invisible and disabled
      this.navtreeVisible = ko.observable(false);
      this.navtreeDisabled = ko.observable(true);

      this.connected = function () {
        this.navtreeVisible.subscribe((visible) => {
          signalPerspectiveSelected(visible);
        });
      };

      this.disconnected = function () {
        this.navtreeVisible.dispose();
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

      this.navtreeToggleClick = function(event) {
        event.preventDefault();
        setNavTreeVisibility(!self.navtreeVisible());
      };

      function signalPerspectiveSelected(visible) {
        let ele = document.getElementById("navtree-container");
        if (ele !== null) {
          if (visible) {
            ele.style.display = "inline-flex";
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
          }
          else {
            signalNavTreeResized(visible, ele.offsetLeft, ele.offsetWidth);
            ele.style.display = "none";
          }
          setNavTreeVisibility(visible);
        }
      }

      function signalNavTreeResized(visible, offsetLeft, offsetWidth){
        viewParams.onResized((visible ? "opener": "closer") , offsetLeft, offsetWidth);
      }

      function setNavTreeVisibility(visible){
        if (!self.navtreeDisabled()) {
          self.navtreeVisible(visible);
          viewParams.signaling.navtreeToggled.dispatch(visible);
        }
      }

      viewParams.signaling.perspectiveSelected.add((newPerspective, showNavTree) => {
        if (typeof showNavTree === "undefined") showNavTree = true;
        if (showNavTree) self.navtreeVisible(true);
        // Enable the toggle navtree visibility icon
        self.navtreeDisabled(false);
      });

      viewParams.signaling.ancillaryContentAreaToggled.add((visible) => {
        setNavTreeVisibility(!visible);
      });

      viewParams.signaling.navtreeLoaded.add((newPerspective) => {
        self.navtreeDisabled(false);
      });

      viewParams.signaling.modeChanged.add((newMode) => {
        if (newMode === "DETACHED") {
          self.navtreeDisabled(true);
          if (self.navtreeVisible()) self.navtreeVisible(false);
        }
      });


    }

    return NavTreeToggler;
  }
);