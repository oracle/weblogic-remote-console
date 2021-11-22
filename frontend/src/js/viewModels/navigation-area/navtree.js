/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * frontend viewModel for NavTreeManager
 */
define(['jquery', 'knockout', 'ojs/ojcontext', 'ojs/ojrouter', 'ojs/ojknockout-keyset', 'ojs/ojarraytreedataprovider', '../../microservices/navtree/navtree-manager', '../../microservices/perspective/perspective-manager', '../../microservices/perspective/perspective-memory-manager','../utils', '../../core/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function ($, ko, Context, Router, keySet, ArrayTreeDataProvider, NavtreeManager, PerspectiveManager, PerspectiveMemoryManager, ViewModelUtils, CoreUtils, Logger) {
    function NavtreeViewModel(viewParams) {
      let self = this;
      let router = Router.rootInstance;

      // Needs to be a ko.observable() in order to allow us
      // to obtain the id, from the navTreeModuleConfig.
      this.perspective = ko.observable(viewParams.perspective);

      this.beanTree = viewParams.beanTree;

      this.condensedNodes = {};

      this.selectedItem = ko.observable();
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(self.beanTree.type);
      this.expanded = getExpandedSet();
      
      this.navtreeManager = new NavtreeManager(self.beanTree);

      this.setBusyContext = function() {
     let context = document.querySelector("#nav");
        if (context && context !== null) {
          self.busyContext = Context.getContext(context).getBusyContext();
        } 
      }

      this.addBusyState = function () {
        
        let options = { description: "#nav fetching data" };

        return self.busyContext.addBusyState(options);
        
      };
      
      // if there are already nodes expanded (e.g. from
      // switching back to a perspective), make sure the
      // expanded nodes get populated

      this.datasource = ko.observable(this.navtreeManager.getDataProvider());

      this.beforeSelect = event =>  {};

      this.beforeCollapse = event => {
        if (self.selectedItem() === event.detail.key) {
          // when something node is already open and it is selected, don't close it...
          // ... except if they click on the expanded icon (as opposed to clicking on the label)
          let cl = event.detail.originalEvent.path[0].className;

          if (!cl.includes('oj-navigationlist-expand-icon')) event.preventDefault();
        }
      };

      this.signalBindings = [];

      this.connected = function () {
        this.setBusyContext();

        self.busyContext.whenReady(10000).then(() => {
          const resolve = this.addBusyState();
          this.navtreeManager.refreshTreeModel().then(() => {
            this.navtreeManager.updateTreeView();
            resolve();
          });
        });

        let binding = viewParams.signaling.navtreeUpdated.add((treeaction) => {
          if (CoreUtils.isUndefinedOrNull(treeaction)) {
            self.expanded.clear();
            self.perspectiveMemory.navtree.keySet = self.expanded;
            return;
          }

          if (treeaction.clearTree) {
            self.busyContext.whenReady(10000).then(() => {
              const resolve = self.addBusyState();

              // refresh the subtree
              self.navtreeManager = new NavtreeManager(self.beanTree);
              self.navtreeManager
                .refreshTreeModel()
                .then(() => {
                  self.navtreeManager.updateTreeView();
                  self.datasource(self.navtreeManager.getDataProvider());

                  // clear the expanded set, unset selected item
                  self.expanded.clear();
                  self.selectedItem("");

                  resolve();
                })
                .catch((response) => {
                  ViewModelUtils.failureResponseDefaultHandling(response);
                });
            });
          } else {
            // iterate through every node in the already expanded Set
            // and ensure they have been populated.
            self.busyContext.whenReady(10000).then(() => {
              const resolve = self.addBusyState();
              self.navtreeManager.populateNodeSet(self.expanded()).finally(()=>{ resolve();});
             
            });
          }
        });

        self.signalBindings.push(binding);


        binding = viewParams.signaling.navtreeSelectionCleared.add(() => {
          self.selectedItem("");
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderSelected.add(
          (dataProvider) => {
            if (dataProvider.id !== self.beanTree.provider.id) {
              // We're changing to a new data provider, so replace
              // the existing viewParams.beanTree and self.beanTree
              // variables.
              viewParams.beanTree = dataProvider.beanTrees[0];
              self.beanTree = viewParams.beanTree;
              // Add a "signal" property to self.beanTree, which
              // indicates that it's a "replacement".
              self.beanTree["signal"] = "replacement";

              // Next, change the existing viewParams.perspective
              // variable and self.perspective knockout observable
              viewParams.perspective = PerspectiveManager.getById(
                self.beanTree.type
              );
              self.perspective(viewParams.perspective);

              // clear the expanded set, unset selected item
              self.expanded.clear();
              self.selectedItem("");

              self.busyContext.whenReady(10000).then(() => {
                const resolve = self.addBusyState();

                // Finally, recreate a NavtreeManager using the new
                // beanTree module-scoped variable.
                self.navtreeManager = new NavtreeManager(self.beanTree);
                self.datasource(self.navtreeManager.getDataProvider());

                self.navtreeManager
                  .refreshTreeModel()
                  .then(() => {
                    self.navtreeManager.updateTreeView();
                    resolve();
                  })
                  .catch((response) => {
                    ViewModelUtils.failureResponseDefaultHandling(response);
                  });
              });
            }
          }
        );

        self.signalBindings.push(binding);

        binding = viewParams.signaling.projectSwitched.add((fromProject) => {
          router.go("home");
        });

        self.signalBindings.push(binding);

        binding = viewParams.signaling.dataProviderRemoved.add(
          (dataProvider) => {
            if (self.beanTree.provider.id === dataProvider.id) {
              // refresh the subtree
              self.busyContext.whenReady(10000).then(() => {
                const resolve = self.addBusyState();
                self.navtreeManager = new NavtreeManager(self.beanTree);
                self.datasource(self.navtreeManager.getDataProvider());

                // clear the expanded set, unset selected item
                self.expanded.clear();
                self.selectedItem("");

                resolve();
              });
            }
          }
        );

        self.signalBindings.push(binding);

        self.selectedItem(self.perspectiveMemory.contentPage.path);
      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      this.onSelect = function(event) {

        let nodeId = event.detail.value;

        if (nodeId !== null && nodeId !== "") {
          let node = self.navtreeManager.getNodeById(nodeId);

          let resourceData = node.resourceData.resourceData;

          const path = encodeURIComponent(resourceData);

          router.go("/" + self.beanTree.type + "/" + path);
        }
      };

      this.itemSelectable = function (context) {
        // selectable is true by default
        return context?.data?.selectable !== false;
      }.bind(this);

      this.beforeExpand = function (event) {
        // Switching the data provider causes a switch to
        // "home" mode. A "signal" property was added to
        // self.beanTree, during the processing of the
        // dataProviderSelected signal. Check for that
        // property here.
        if (CoreUtils.isNotUndefinedNorNull(self.beanTree["signal"])) {
          // Found it, so send signal to change the title from
          // "Home" to whatever self.beanTree.label is.
          viewParams.signaling.beanTreeChanged.dispatch(self.beanTree);
          // Don't need the "signal" property anymore, so go
          // ahead and remove it.
          delete self.beanTree["signal"];
        }

        // Expand the node the user clicked on.
        self.busyContext.whenReady(10000).then(() => {
          const resolve = self.addBusyState();

          self.navtreeManager.expandNode(event.detail.key).finally(() => {
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

      function resizeNavTreeContainer() {
        // Resize navtree container to navtree.maxWidth (400px), if
        // it is less than navtree.minWidth (200px) + navstrip.width (45px)
        // + 2px = 247px.
        let ele = document.getElementById("navtree-container");
        if (ele !== null && ele.offsetWidth < 247) {
          const newOffsetWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navtree-max-width"), 10);
          viewParams.onResized("navtree", ele.offsetLeft, newOffsetWidth);
        }
      }

      function getExpandedSet() {
        if (self.perspectiveMemory.navtree.keySet === null) {
          self.perspectiveMemory.navtree.keySet = new keySet.ObservableKeySet();
        }
        return self.perspectiveMemory.navtree.keySet;
      }
    }

    return NavtreeViewModel;
  }
);
