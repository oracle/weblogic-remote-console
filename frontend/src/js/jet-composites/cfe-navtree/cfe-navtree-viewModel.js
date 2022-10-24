/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
  'knockout',
  'ojs/ojcontext',
  'ojs/ojknockout-keyset',
  'wrc-frontend/integration/controller',
  'wrc-frontend/microservices/navtree/navtree-manager',
  'wrc-frontend/microservices/perspective/perspective-manager',
  'wrc-frontend/microservices/perspective/perspective-memory-manager',
  'wrc-frontend/core/runtime',
  'wrc-frontend/integration/viewModels/utils',
  'wrc-frontend/core/utils',
  'wrc-frontend/core/types',
  'ojs/ojknockout',
  'ojs/ojnavigationlist',
  'ojs/ojdialog',
], function (
  ko,
  Context,
  keySet,
  Controller,
  NavtreeManager,
  PerspectiveManager,
  PerspectiveMemoryManager,
  Runtime,
  ViewModelUtils,
  CoreUtils,
  CoreTypes
) {
  function NavtreeViewModel(context) {
    const self = this;

    const signaling = Controller.getSignaling();

    let router = Controller.getRootRouter();

    this.perspective = ko.observable(context.properties.perspective);
    this.beanTree = context.properties.beanTree;

    this.condensedNodes = {};

    this.selectedItem = ko.observable();
    // Must be set before getExpandedSet() call is made
    this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(
      self.beanTree.type
    );
    this.expanded = getExpandedSet();

    this.navtreeManager = new NavtreeManager(self.beanTree);

    this.datasource = ko.observable(this.navtreeManager.getDataProvider());

    this.setBusyContext = function () {
      const context = document.querySelector('#nav');
      if (context) {
        self.busyContext = Context.getContext(context).getBusyContext();
      }
    };

    this.addBusyState = function () {
      let options = { description: '#nav fetching data' };
      return self.busyContext.addBusyState(options);
    };

    this.signalBindings = [];

    /**
     * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</p>
     */
    this.connected = function () {
      this.setBusyContext();

      let resolve;

      this.busyContext.whenReady(10000).then(() => {
        resolve = this.addBusyState();

        $('#navtree-container').css({ display: 'inline-flex' });
        this.navtreeManager
          .refreshTreeModel()
          .then(() => {
            this.navtreeManager.updateTreeView();
            const keys = [...self.expanded()._keys];
            keys.sort((e1, e2) => {
              e1.split('/').length - e2.split('/').length;
            });
            if (keys.length > 0) {
              keys.forEach((key) => {
                expandClickedNode.call(self, key);
              });
              self.selectedItem(null);
            }
          })
          .finally(() => {
            if (resolve) resolve();
          });
      });

      let binding = signaling.navtreeUpdated.add((treeaction) => {
        if (CoreUtils.isUndefinedOrNull(treeaction)) {
          this.expanded.clear();
          this.perspectiveMemory.navtree.keySet = this.expanded;
          return;
        }

        if (treeaction.clearTree) {
          let resolve;
          this.busyContext.whenReady(10000).then(() => {
            resolve = this.addBusyState();

            // refresh the subtree
            this.navtreeManager = new NavtreeManager(this.beanTree);
            this.navtreeManager
              .refreshTreeModel()
              .then(() => {
                this.navtreeManager.updateTreeView();
                this.datasource(this.navtreeManager.getDataProvider());

                // clear the expanded set, unset selected item
                this.expanded.clear();
                this.selectedItem(null);
              })
              .catch((response) => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              })
              .finally(() => {
                if (resolve) resolve();
              });
          });
        }
        else {
          // if navtree needs updating, add node and each of its ancestors to expanded Set
          if (treeaction.update) {
            let iterPath = '';

            treeaction.path.split('/').forEach((segment) => {
              iterPath += decodeURIComponent(segment);
              this.expanded.add([iterPath]);
              iterPath += '/';
            });

            this.perspectiveMemory.navtree.keySet = this.expanded;
            self.selectedItem(decodeURIComponent(treeaction.path));
          }
          else if (treeaction.delete) {
            if (CoreUtils.isNotUndefinedNorNull(treeaction.path)) {
              // Remove from the expanded node list the deleted path
              // and any descendent paths that may have been expanded
              const expandedList = Array.from(this.expanded().values());
              const removeList = expandedList.filter(path => path.startsWith(treeaction.path));
              if (removeList.length > 0) {
                this.expanded.delete(removeList);
                this.perspectiveMemory.navtree.keySet = this.expanded;
              }
            }
          }

          this.navtreeManager.populateNodeSet(this.expanded(), this.selectedItem());
        }
      });

      this.signalBindings.push(binding);

      binding = signaling.navtreeSelectionCleared.add(() => {
        self.selectedItem(null);
      });

      this.signalBindings.push(binding);

      binding = signaling.dataProviderSelected.add((dataProvider, navtreeReset = false) => {
        if (dataProvider.id !== this.beanTree.provider.id || navtreeReset) {
          // We're changing to a new data provider, so replace
          // the existing context.properties.beanTree and this.beanTree
          // variables.
          context.properties.beanTree = dataProvider.beanTrees[0];
          this.beanTree = context.properties.beanTree;
          // Add a "signal" property to this.beanTree, which
          // indicates that it's a "replacement".
          this.beanTree['signal'] = 'replacement';
          // Next, change the existing context.properties.perspective
          // variable and this.perspective knockout observable
          context.properties.perspective = PerspectiveManager.getById(
            this.beanTree.type
          );
          this.perspective(context.properties.perspective);

          // clear the expanded set, unset selected item.
          this.expanded.clear();
          this.selectedItem(null);

          let resolve;
          this.busyContext.whenReady(10000).then(() => {
            resolve = this.addBusyState();

            // Finally, recreate a NavtreeManager using the new
            // beanTree module-scoped variable.
            this.navtreeManager = new NavtreeManager(this.beanTree);
            this.datasource(this.navtreeManager.getDataProvider());

            this.navtreeManager
              .refreshTreeModel()
              .then(() => {
                this.navtreeManager.updateTreeView();
              })
              .catch((response) => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              })
              .finally(() => {
                if (resolve) resolve();
              });
          });
        }
      });

      this.signalBindings.push(binding);

      binding = signaling.projectSwitched.add((fromProject) => {
        if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name)
          router.go('home');
      });

      this.signalBindings.push(binding);

      binding = signaling.dataProviderRemoved.add((dataProvider) => {
        if (this.beanTree.provider.id === dataProvider.id) {
          let resolve;
          // refresh the subtree
          this.busyContext.whenReady(10000).then(() => {
            resolve = self.addBusyState();
            try {
              this.navtreeManager = new NavtreeManager(this.beanTree);
              this.datasource(self.navtreeManager.getDataProvider());

              // clear the expanded set, unset selected item
              this.expanded.clear();
              this.selectedItem(null);

              if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.APP.name)
                router.go('home');
            } finally {
              if (resolve) resolve();
            }
          });
        }
      });

      this.signalBindings.push(binding);

      binding = signaling.unsavedChangesDetected.add((exitFormCallback) => {
        self.canExitCallback = exitFormCallback;
      });

      this.signalBindings.push(binding);

      this.selectedItem(this.perspectiveMemory.contentPage.path);
    }.bind(this);

    /**
     * <p>NOTE: You need to use "function() {...}.bind(this);", as opposed to "() => {...};", here :-)</p>
     */
    this.disconnected = function () {
      if (self.perspectiveMemory.navtree.keySet !== null) {
        self.perspectiveMemory.navtree.keySet.clear();
        self.perspectiveMemory.navtree.keySet = null;
      }

      if (Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name) {
        self.perspectiveMemory.navtree.keySet = self.expanded;
      }

      self.signalBindings.forEach((binding) => {
        binding.detach();
      });

      self.signalBindings = [];
    }.bind(this);

    this.itemSelectable = function (context) {
      // selectable is true by default
      // DON'T USE optional chaining, here!! It's not supported
      // in the JS compiler (esprima) that JET uses, when it does
      // a release build of a JET web app.
      return (context && context.data && context.data.selectable) !== false;
    }.bind(this);

    this.beforeExpand = function (event) {
      // Switching the data provider causes a switch to
      // "home" mode. A "signal" property was added to
      // self.beanTree, during the processing of the
      // dataProviderSelected signal. Check for that
      // property here.
      if (CoreUtils.isNotUndefinedNorNull(self.beanTree['signal'])) {
        // Found it, so send signal to change the title from
        // "Home" to whatever self.beanTree.label is.
        signaling.beanTreeChanged.dispatch(self.beanTree);
        // Don't need the "signal" property anymore, so go
        // ahead and remove it.
        delete self.beanTree['signal'];
      }

      expandClickedNode.call(self, event.detail.key);
    };

    this.onExpand = function (event) {
      // the expanded key has been added to the expanded keyset, however it does not
      // get displayed -- deleting and reading seems to get the UI to repaint
      self.expanded.delete([event.detail.key]);
      self.expanded.add([event.detail.key]);

      self.perspectiveMemory.navtree.keySet = self.expanded;

      resizeNavTreeContainer();
    };

    /**
     * <p>When self.selectedItem node matches event.detail.key and it's already open expanded, then only collapse it if the list item has the class for the expand icon ('oj-navigationlist-expand-icon').</p>
     * <p>In other words, clicking the icons (expand or collapse) always performs the event, but clicking the label only performs the event if the list iten has the icon for the opposite event.</p>
     *
     * @param {CustomEvent} event
     */
    this.beforeCollapse = function (event) {
      if (self.selectedItem() === event.detail.key) {
        // when something node is already open and it is selected, don't close it...
        // ... except if they click on the expanded icon (as opposed to clicking on the label)
        let cl = (event.detail.originalEvent.path ? event.detail.originalEvent.path[0].className : '');

        if (!cl.includes('oj-navigationlist-expand-icon'))
          event.preventDefault();
      }
    };

    this.beforeSelect = (event) => {};

    this.onSelect = function (event) {
      const nodeId = event.detail.value;
      if (nodeId !== null && nodeId !== '') {
        const node = self.navtreeManager.getNodeById(nodeId);
        if (CoreUtils.isNotUndefinedNorNull(node)) {
          const resourceData = node.resourceData.resourceData;
          if (
            CoreUtils.isNotUndefinedNorNull(resourceData) &&
            isRenderableNode(resourceData)
          ) {
            const index = resourceData.indexOf('/data/');
            if (index !== -1) {
              self.perspectiveMemory.contentPage.resourceDataFragment =
                resourceData.substring(index + 1);
            }
            const path = encodeURIComponent(resourceData);
            ViewModelUtils.goToRouterPath(router, `/${self.beanTree.type}/${path}`, self.canExitCallback);
            signaling.navtreeSelectionChanged.dispatch('navtree', node);
          }
        }
      }
    };

    function resizeNavTreeContainer() {
      // Resize navtree container to navtree.maxWidth (400px), if
      // it is less than navtree.minWidth (200px) + navstrip.width (45px)
      // + 2px = 247px.
      const ele = document.getElementById('navtree-container');
      if (ele !== null && ele.offsetWidth < 247) {
        const newOffsetWidth = parseInt(
          ViewModelUtils.getCustomCssProperty('navtree-max-width'),
          10
        );
        signaling.navtreeResized.dispatch(
          'navtree',
          ele.offsetLeft,
          newOffsetWidth
        );
      }
    }

    function isRenderableNode(resourceData) {
      return Runtime.getRole() === CoreTypes.Console.RuntimeRole.TOOL.name
        ? resourceData !==
        decodeURIComponent(
          router.observableModuleConfig().params.ojRouter.parameters.path()
        )
        : true;
    }

    function expandClickedNode(nodeId) {
      let resolve;
      this.busyContext.whenReady(10000).then(() => {
        resolve = this.addBusyState();
        self.navtreeManager.expandNode(nodeId).finally(() => {
          if (resolve) resolve();
        });
      });
    }

    function getExpandedSet() {
      if (self.perspectiveMemory.navtree.keySet === null) {
        self.perspectiveMemory.navtree.keySet = new keySet.ObservableKeySet();
      }
      return self.perspectiveMemory.navtree.keySet;
    }
  }

  return NavtreeViewModel;
});