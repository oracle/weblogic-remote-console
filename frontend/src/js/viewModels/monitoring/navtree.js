/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * Module for the navtree associated with the monitoring perspective
 */
define(['jquery', 'knockout', 'ojs/ojrouter', 'ojs/ojknockout-keyset', 'ojs/ojarraytreedataprovider', '../modules/navtree-manager', '../../cfe/services/perspective/perspective-memory-manager', '../../cfe/common/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojnavigationlist'],
  function ($, ko, Router, keySet, ArrayTreeDataProvider, NavtreeManager, PerspectiveMemoryManager, Utils, Logger) {
    function NavtreeViewModel(viewParams) {
      const self = this;
      const router = Router.rootInstance;

      const perspective = viewParams.perspective;
      const perspectiveState = { rootNode: { name: "DomainRuntime" } };

      // Needs to be a ko.observable() in order to allow us
      // to obtain the id, from the navTreeModuleConfig
      this.perspective = ko.observable(viewParams.perspective);

      this.condensedNodes = {};

      this.selectedItem = ko.observable();
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(perspective.id);
      this.expanded = getExpandedSet();

      this.navtreeManager = new NavtreeManager(perspective);

      this.navtreeManager.populateNodeSet(this.expanded());
      
      this.datasource = ko.observable(this.navtreeManager.getDataProvider());

      this.signalBindings = [];

      this.connected = function () {
        let binding = viewParams.signaling.navtreeUpdated.add(function (treeaction) {
          if (typeof treeaction === 'undefined' || treeaction === null) {
            self.expanded.clear();
            self.perspectiveMemory.navtree.keySet = self.expanded;
            return;
          }

          if (!treeaction.isEdit) {
            // refresh the subtree
            self.navtreeManager = new NavtreeManager(perspective);
            self.datasource(self.navtreeManager.getDataProvider());
            self.expanded.clear();
          }

          self.perspectiveMemory.navtree.keySet = self.expanded;
        });

        self.signalBindings.push(binding);

        binding =
          viewParams.signaling.navtreeSelectionCleared.add(() => {
            self.selectedItem(null);
          });

        self.signalBindings.push(binding);
      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach();} );

        self.signalBindings = [];
      };

      this.beforeExpand = e => { self.navtreeManager.populateNode(e.detail.key) };

      this.selectedItem.subscribe(function (id) {
        if (id != null) {
          if (self.condensedNodes.hasOwnProperty(id)) id = self.condensedNodes[id];
          const path = encodeURIComponent(id);

          // if the navtree is selecting the already displayed path,
          // it is likely because breadcrumb navigation deselected the node and
          // router.go would cause an empty form/displayed to be displayed,
          // so do nothing...
          const params = router.observableModuleConfig().params.ojRouter.parameters;

          if (typeof params.path !== 'undefined') {
            if (params.path() === path)
              return;
          }

          // If path is for navtree group node (e.g. "Runtimes"), then
          // a router.go() will call the CBE to try to get a table/form for
          // it. This will result in an HTTP error, so make sure path starts
          // with perspectiveState.rootNode.name before you do a router.go()
          if (path.startsWith(perspectiveState.rootNode.name)) {
            router.go("/" + perspective.id + "/" + path);
          }
        }
      });

      this.itemSelectable = function (context) {
        const kind = context.data.kind;
        if (kind === "condensed") {
          // Navtree pagination is supported using a "condensed" node
          // type. This node type has "..." for it's label, and needs
          // to temporarily use the path of it's parent collection as
          // it's path. We use this.condensedNodes to map this parent
          // collection's path to the "condensed" node, and retrieve
          // it when doing a router.go().
          const index = context.key.lastIndexOf("/");
          if (index !== -1) self.condensedNodes[context.key] = context.key.substring(0, index);
        }

        // Groups are not selectable as there is no corresponding screen
        return typeof context.data.group === 'undefined';
      }.bind(this);

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
        if (self.perspectiveMemory.navtree.keySet === null) self.perspectiveMemory.navtree.keySet = new keySet.ObservableKeySet();
        return self.perspectiveMemory.navtree.keySet;
      }

    }

    return NavtreeViewModel;
  }
);