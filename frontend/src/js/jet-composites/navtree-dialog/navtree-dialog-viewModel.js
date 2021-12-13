/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['ojs/ojcore', 'knockout', 'ojs/ojcontext', 'ojs/ojknockout-keyset', 'ojs/ojarraytreedataprovider', 'wrc-frontend/controller', 'wrc-frontend/microservices/navtree/navtree-manager', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/core/runtime', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'wrc-frontend/core/types', 'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojdialog'],
  function (oj, ko, Context, keySet, ArrayTreeDataProvider, Controller, NavtreeManager, PerspectiveManager, PerspectiveMemoryManager, Runtime, ViewModelUtils, CoreUtils, CoreTypes) {

    function NavtreeDialogComposite(context) {
      const self = this;

      const signaling = Controller.getSignaling();

      this.i18n = {
        "icons": {
          "docked": {
            "iconFile": "overlay-reattach-icon-blk_24x24",
            "tooltip": oj.Translations.getTranslatedString("wrc-navtree.icons.docked.tooltip")
          },
          "floating": {"iconFile": "overlay-detach-icon-blk_24x24", "tooltip": ko.observable()},
          "minimized": {
            "iconFile": "overlay-minimize-icon-blk_24x24",
            "tooltip": oj.Translations.getTranslatedString("wrc-navtree.icons.minimized.tooltip")
          },
          "closed": {
            "iconFile": "overlay-close-icon-blk_24x24",
            "tooltip": oj.Translations.getTranslatedString("wrc-navtree.icons.closed.tooltip")
          }
        }
      };

      let router = Controller.getRootRouter();

      this.perspective = ko.observable(context.properties.perspective);
      this.beanTree = context.properties.beanTree;

      this.condensedNodes = {};

      this.placement = ko.observable(CoreTypes.Navtree.Placement.DOCKED.name);
      this.selectedItem = ko.observable();
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.beanTree.type);
      this.expanded = getExpandedSet();

      this.navtreeManager = new NavtreeManager(self.beanTree);

      // if there are already nodes expanded (e.g. from
      // switching back to a perspective), make sure the
      // expanded nodes get populated

      this.datasource = ko.observable(this.navtreeManager.getDataProvider());

      this.signalBindings = [];

      /**
       * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</p>
       */
      this.connected = function () {

        this.setBusyContext();

        this.busyContext.whenReady()
          .then(() => {
            const resolve = this.addBusyState();
            const placementState = (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name ? CoreTypes.Navtree.Placement.DOCKED.name : CoreTypes.Navtree.Placement.FLOATING.name);
            if (placementState === CoreTypes.Navtree.Placement.FLOATING.name) {
              const navtreeDialog = document.getElementById("navtreeDialog");
              restoreNavTreeDialogDimensions(navtreeDialog);
            }
            this.placement(placementState);
            resolve();
          });

        this.busyContext.whenReady(10000)
          .then(() => {
            const resolve = this.addBusyState();
            this.navtreeManager.refreshTreeModel()
              .then(() => {
                this.navtreeManager.updateTreeView();
                resolve();
              });
          });

        this.placementSubscription = this.placement.subscribe((state) => {
          function movePlacementIconbar() {
            const placementIconbar = document.getElementById("navtree-floating-iconbar");
            if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
              const ojDialogHeader = document.querySelector("#navtreeDialog > div");
              ojDialogHeader.appendChild(placementIconbar);
            }
            else {
              placementIconbar.parentNode.removeChild(placementIconbar);
              const ojDialogHeader = document.querySelector("#navtreeDialog > div > div");
              ojDialogHeader.appendChild(placementIconbar);
            }
          }

          const navtreeDialog = document.getElementById("navtreeDialog");

          if (navtreeDialog !== null) {
            switch (state) {
              case CoreTypes.Navtree.Placement.CLOSED.name:
                if (navtreeDialog.isOpen()) navtreeDialog.close();
                break;
              case CoreTypes.Navtree.Placement.DOCKED.name:
                if (navtreeDialog.isOpen()) navtreeDialog.close();
                self.i18n.icons.floating.tooltip(oj.Translations.getTranslatedString("wrc-navtree.icons.floating.tooltip"));
                $("oj-navigation-list[id='nav']").css({"display": "inline-flex"});
                signaling.navtreePlacementChanged.dispatch(state);
                break;
              case CoreTypes.Navtree.Placement.FLOATING.name:
                movePlacementIconbar();
                navtreeDialog.style["height"] = self.perspectiveMemory.navtree.floating.height;
                signaling.navtreePlacementChanged.dispatch(state);
                if (!navtreeDialog.isOpen()) navtreeDialog.open();
                break;
              case CoreTypes.Navtree.Placement.MINIMIZED.name:
                self.i18n.icons.floating.tooltip(oj.Translations.getTranslatedString("wrc-navtree.icons.restore.tooltip"));
                navtreeDialog.style["height"] = ViewModelUtils.getCustomCssProperty("navtreeDialog-minimized-height");
                $("oj-navigation-list[id='nav']").css({"min-height": ViewModelUtils.getCustomCssProperty("navtreeDialog-minimized-min-height")});
                break;
            }
            self.perspectiveMemory.navtree.placement = state;
          }

        });

        let binding = signaling.navtreeUpdated.add((treeaction) => {
          if (CoreUtils.isUndefinedOrNull(treeaction)) {
            this.expanded.clear();
            this.perspectiveMemory.navtree.keySet = this.expanded;
            return;
          }

          if (treeaction.clearTree) {
            this.busyContext.whenReady(10000)
              .then(() => {
                const resolve = this.addBusyState();

                // refresh the subtree
                this.navtreeManager = new NavtreeManager(this.beanTree);
                this.navtreeManager.refreshTreeModel()
                  .then(() => {
                    this.navtreeManager.updateTreeView();
                    this.datasource(this.navtreeManager.getDataProvider());

                    // clear the expanded set, unset selected item
                    this.expanded.clear();
                    this.selectedItem("");

                    resolve();
                  })
                  .catch((response) => {
                    ViewModelUtils.failureResponseDefaultHandling(response);
                  });
              });
          } else {
            // iterate through every node in the already expanded Set
            // and ensure they have been populated.
            this.busyContext.whenReady(10000)
              .then(() => {
                const resolve = this.addBusyState();
                this.navtreeManager.populateNodeSet(this.expanded())
                  .finally(() => {
                    resolve();
                  });
              });
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.navtreeSelectionCleared.add(() => {
          this.selectedItem("");
        });

        this.signalBindings.push(binding);

        binding = signaling.navtreeToggled.add((source, visible) => {
          switch (source) {
            case "landing":
              self.placement("docked");
              break;
            case "breadcrumb":
            case "toggle":
              self.placement(visible ? "docked" : "minimized");
              break;
            case "form-tabstrip":
              if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) {
                self.placement(visible ? "floating" : "minimized");
              }
              break;
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.dataProviderSelected.add((dataProvider) => {
          if (dataProvider.id !== this.beanTree.provider.id) {
            // We're changing to a new data provider, so replace
            // the existing context.properties.beanTree and this.beanTree
            // variables.
            context.properties.beanTree = dataProvider.beanTrees[0];
            this.beanTree = context.properties.beanTree;
            // Add a "signal" property to this.beanTree, which
            // indicates that it's a "replacement".
            this.beanTree["signal"] = "replacement";
            // Next, change the existing context.properties.perspective
            // variable and this.perspective knockout observable
            context.properties.perspective = PerspectiveManager.getById(this.beanTree.type);
            this.perspective(context.properties.perspective);

            // clear the expanded set, unset selected item.
            this.expanded.clear();
            this.selectedItem("");

            this.busyContext.whenReady(10000)
              .then(() => {
                const resolve = this.addBusyState();

                // Finally, recreate a NavtreeManager using the new
                // beanTree module-scoped variable.
                this.navtreeManager = new NavtreeManager(this.beanTree);
                this.datasource(this.navtreeManager.getDataProvider());

                this.navtreeManager
                  .refreshTreeModel()
                  .then(() => {
                    this.navtreeManager.updateTreeView();
                    resolve();
                  })
                  .catch((response) => {
                    ViewModelUtils.failureResponseDefaultHandling(response);
                  });
              });
          }
        });

        this.signalBindings.push(binding);

        binding = signaling.projectSwitched.add((fromProject) => {
          self.placement(CoreTypes.Navtree.Placement.CLOSED.name);
          if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) router.go("home");
        });

        this.signalBindings.push(binding);

        binding = signaling.dataProviderRemoved.add((dataProvider) => {
          if (this.beanTree.provider.id === dataProvider.id) {
            // refresh the subtree
            this.busyContext.whenReady(10000)
              .then(() => {
                const resolve = self.addBusyState();
                this.navtreeManager = new NavtreeManager(this.beanTree);
                this.datasource(self.navtreeManager.getDataProvider());

                // clear the expanded set, unset selected item
                this.expanded.clear();
                this.selectedItem("");

                self.placement(CoreTypes.Navtree.Placement.CLOSED.name);
                if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name) router.go("home");

                resolve();
              });
          }
        });

        this.signalBindings.push(binding);

        this.selectedItem(this.perspectiveMemory.navtree.selectedItem);

      }.bind(this);

      /**
       * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</p>
       */
      this.disconnected = function () {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
          const navtreeDialog = document.getElementById("navtreeDialog");
          if (navtreeDialog !== null) storeNavTreeDialogDimensions(navtreeDialog);
        }
        self.perspectiveMemory.navtree["selectedItem"] = self.selectedItem();
        const node = self.navtreeManager.getNodeById(self.selectedItem());
        const resourceData = node.resourceData.resourceData;
        if (CoreUtils.isNotUndefinedNorNull(resourceData)) {
          const index = resourceData.indexOf("/data/");
          if (index !== -1) self.perspectiveMemory.navtree["resourceDataFragment"] = resourceData.substring(index + 1);
        }

        self.placementSubscription.dispose();

        self.signalBindings.forEach(binding => {
          binding.detach();
        });

        self.signalBindings = [];
      }.bind(this);

      this.itemSelectable = function (context) {
        // selectable is true by default
        return context?.data?.selectable !== false;
      }.bind(this);

      this.setBusyContext = () => {
        const context = document.querySelector("#nav");
        if (context !== null) {
          self.busyContext = Context.getContext(context).getBusyContext();
        }
      };

      this.addBusyState = () => {
        let options = {description: "#nav fetching data"};
        return self.busyContext.addBusyState(options);
      };

      this.beforeSelect = event => {
      };

      this.onSelect = function (event) {
        let nodeId = event.detail.value;

        if (nodeId !== null && nodeId !== "") {
          let node = self.navtreeManager.getNodeById(nodeId);

          let resourceData = node.resourceData.resourceData;

          const path = encodeURIComponent(resourceData);

          router.go("/" + self.beanTree.type + "/" + path);
        }
      };

      this.beforeExpand = function (event) {
        // Switching the data provider causes a switch to
        // "home" mode. A "signal" property was added to
        // self.beanTree, during the processing of the
        // dataProviderSelected signal. Check for that
        // property here.
        if (CoreUtils.isNotUndefinedNorNull(self.beanTree["signal"])) {
          // Found it, so send signal to change the title from
          // "Home" to whatever self.beanTree.label is.
          signaling.beanTreeChanged.dispatch(self.beanTree);
          // Don't need the "signal" property anymore, so go
          // ahead and remove it.
          delete self.beanTree["signal"];
        }

        // Expand the node the user clicked on.
        self.busyContext.whenReady(10000)
          .then(() => {
            const resolve = self.addBusyState();

            self.navtreeManager.expandNode(event.detail.key)
              .finally(() => {
                resolve();
              });
          });
      };

      this.onExpand = function (event) {
        // the expanded key has been added to the expanded keyset, however it does not
        // get displayed -- deleting and reading seems to get the UI to repaint
        self.expanded.delete([event.detail.key]);
        self.expanded.add([event.detail.key]);

        self.perspectiveMemory.navtree.keySet = self.expanded;
        resizeNavTreeContainer();
      };

      this.beforeCollapse = event => {
        if (self.selectedItem() === event.detail.key) {
          // when something node is already open and it is selected, don't close it...
          // ... except if they click on the expanded icon (as opposed to clicking on the label)
          let cl = event.detail.originalEvent.path[0].className;

          if (!cl.includes('oj-navigationlist-expand-icon')) event.preventDefault();
        }
      };

      this.placementIconClickHandler = (event) => {
        const state = event.currentTarget.attributes["data-item-state"].value;
        self.placement(state);
      };

      this.onResizeStop = (event) => {
        self.perspectiveMemory.navtree.floating.height = ViewModelUtils.pxToRem(event.detail.size.height);
      };

      this.getRuntimeRole = () => {
        return Runtime.getRole();
      };

      function storeNavTreeDialogDimensions(navtreeDialog) {
        self.perspectiveMemory["navtree"] = {
          placement: self.placement(),
          floating: {
            top: navtreeDialog.style["top"],
            left: navtreeDialog.style["left"],
            height: (self.placement() === CoreTypes.Navtree.Placement.MINIMIZED.name ? ViewModelUtils.getCustomCssProperty("navtreeDialog-default-height") : navtreeDialog.style["height"]),
            width: navtreeDialog.style["width"]
          }
        };
      }

      function restoreNavTreeDialogDimensions(navtreeDialog) {
        const styles = {
          "top": self.perspectiveMemory.navtree.floating.top,
          "left": self.perspectiveMemory.navtree.floating.left,
          "height": self.perspectiveMemory.navtree.floating.height,
          "width": self.perspectiveMemory.navtree.floating.width
        };
        var obj = document.getElementById("container");
        Object.assign(navtreeDialog.style, styles);
      }

      function resizeNavTreeContainer() {
        if (self.placement() === CoreTypes.Navtree.Placement.DOCKED.name) {
          // Resize navtree container to navtree.maxWidth (400px), if
          // it is less than navtree.minWidth (200px) + navstrip.width (45px)
          // + 2px = 247px.
          let ele = document.getElementById("navtree-container");
          if (ele !== null && ele.offsetWidth < 247) {
            const newOffsetWidth = parseInt(ViewModelUtils.getCustomCssProperty("navtree-max-width"), 10);
            signaling.navtreeResized.dispatch("navtree", ele.offsetLeft, newOffsetWidth);
          }
        } else if (self.placement() === CoreTypes.Navtree.Placement.FLOATING.name) {
          let height = parseInt(ViewModelUtils.getCustomCssProperty("navtreeDialog-default-height"), 10);
          const navtreeDialog = $("#navtreeDialog");
          navtreeDialog.css("height", parseInt(navtreeDialog.css("height"), 10) < height ? `${height}px` : navtreeDialog.css("height"));
          height = parseInt(navtreeDialog.css("height"), 10);
          self.perspectiveMemory.navtree.floating.height = ViewModelUtils.pxToRem(height);
        }
      }

      function getExpandedSet() {
        if (self.perspectiveMemory.navtree.keySet === null) {
          self.perspectiveMemory.navtree.keySet = new keySet.ObservableKeySet();
        }
        return self.perspectiveMemory.navtree.keySet;
      }

    }

    return NavtreeDialogComposite;
  });