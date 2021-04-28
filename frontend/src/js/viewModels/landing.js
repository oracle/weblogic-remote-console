/**
 * @license
 * Copyright (c) 2020, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
"use strict";

/**
 * @module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', '../core/runtime', '../microservices/navtree/navtree-manager', '../microservices/perspective/perspective-manager', '../microservices/perspective/perspective-memory-manager', 'ojs/ojlogger', '../microservices/page-definition/utils', '../core/utils', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojmodule', 'ojs/ojconveyorbelt'],
  function(oj, ko, HtmlUtils, Runtime, NavtreeManager, PerspectiveManager, PerspectiveMemoryManager, Logger, PageDefinitionUtils, CoreUtils){
    function LandingPageTemplate(viewParams) {
      const self = this;

      this.perspectiveGroups = ko.observableArray();
      this.perspectiveGroup = ko.observable({name: "", description: "<p/>"});
      this.subtreeItemChildren = ko.observableArray();

      // The router's state parameter contains the perspectiveId
      // associated with the landing page. Use that to obtain the
      // actual perspective.
      this.perspective = selectPerspective(viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId());
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(this.perspective.id);
      this.navtreeManager = new NavtreeManager(this.perspective);

      this.connected = function() {
        loadPerspectiveGroups(self.perspective.id);

        // Next, we need to subscribe to the parameters.perspectiveId
        // observable, so we get notified when we need to switch landing
        // pages.
        viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId.subscribe((value) => {
          // Clicking the "Home" navbar menu item puts you in "home mode".
          // That's the mode that causes the navstrip to treat navstrip
          // icon clicks as requests to load a perspective's navtree, as
          // well as a request to show it's landing page. In "home mode",
          // the user is switching between perspective, so we need to
          // reinitialize the ko.observables referenced in landing.html.
          self.perspectiveGroup({name: "", description: "<p/>"});
          // Hiding the subtree displayed for a perspectiveGroup, is also
          // part of the reinitialization sequence.
          setPagePanelSubtreeVisibility(false);
          Logger.info(`[LANDING] selected landing: ${value}`);
          // Only reload the perspectiveGroups, if value isn't the
          // id of the perspective landing page we're working with.
          if (value !== self.perspective.id) {
            Logger.info(`[LANDING] previous landing: ${self.perspective.id}, current landing: ${value}`);
            self.perspective = selectPerspective(value);
            self.navtreeManager = new NavtreeManager(self.perspective);
            loadPerspectiveGroups(self.perspective.id);
          }
        });
      };

      function loadPerspectiveGroups(perspectiveId) {
        self.navtreeManager.populateNode("")
        .then(() => {
          self.navtreeManager.getPathChildrenModels("/")
          .then((navgroups) => {
            const pathModels = [];
            navgroups.forEach((group) => {
              pathModels.push(group);
            });

            if (pathModels.length > 0) {
              self.perspectiveGroups(convertPathModelsToGroups(pathModels));
            }

            const expandableName = self.perspectiveMemory.expandableName.call(self.perspectiveMemory);
            if (expandableName !== null) {
              const fauxEvent = {currentTarget: {children: [{id: expandableName, attributes: []}]}};
              self.landingPanelClickHandler(fauxEvent);
            }
            else {
              setPagePanelSubtreeVisibility(false);
            }
          });
        });
      }

      function convertPathModelsToGroups(pathModels) {
        // This function can be remove once Mason resolves
        // the issue where the fulfillment value returned by
        // navtree-manager.getPathChildrenModels() has
        // duplicates in it.
        function removeDuplicates(groups, key) {
          return [
            ...new Map(groups.map(obj => [key(obj), obj])).values()
          ];
        }

        let groups = [];
        pathModels.forEach((pathModel) => {
          if (typeof pathModel === "string") {
            groups.push({name: pathModel, label: pathModel});
          }
          else if (typeof pathModel.group !== "undefined") {
            groups.push({name: pathModel.group, label: pathModel.group});
          }
          else {
            groups.push({name: pathModel.label, label: pathModel.label, path: pathModel.path});
          }
        });
        // TODO: Switch this to just return groups, once Mason
        // resolves the duplicates issue
        return removeDuplicates(groups, group => group.name);
      }

      function setPagePanelSubtreeVisibility(visible) {
        let ele = document.getElementById("landing-page-panel-subtree");
        if (ele !== null) ele.style.display = (visible ? "block" : "none");
      }

      function toggleSubtreePageVisibility(subtreeName){
        let ele = document.getElementById("landing-page-panel-subtree");
        if (ele !== null) {
          const visible = (ele.style.display === "block");
          const ele1 = document.getElementById(subtreeName + "Chevron");
          if (visible) {
            ele.style.display = "none";
            if (ele1 !== null) ele1.setAttribute("class", "landing-page-panel-chevron oj-fwk-icon oj-fwk-icon-caret03-s");
          }
          else {
            ele.style.display = "block";
            if (ele1 !== null) ele1.setAttribute("class", "landing-page-panel-chevron oj-fwk-icon oj-fwk-icon-caret03-n");
          }
        }
      }

      this.perspectiveGroupSubtreeItemClickHandler = function(event) {
        const path = event.currentTarget.children[0].id;
        if (typeof path === "undefined") return;

        Logger.log(`[LANDING] data-path=${path}, perspective-group=${self.perspectiveGroup().name}`);

        // expand the navtree nodes
        viewParams.parentRouter.go("/" + self.perspective.id + "/" + encodeURIComponent(path));
        viewParams.signaling.navtreeUpdated.dispatch({path:path});
      };

      /**
       * Called when user clicks icon or label of card item
       * @param event
       */
      this.landingPanelClickHandler = function(event) {
        // The id attribute with the perspectiveId assigned
        // to it, is on the first child element of the
        // click event's current target. The click event's
        // current target is the <a> tag, and the first
        // child element (e.g. children[0]) of that is a
        // <div> tag.
        const value = event.currentTarget.children[0].id;
        if (CoreUtils.isUndefinedOrNull(value)) return;

        let pathValue;
        const path = event.currentTarget.children[0].attributes["data-path"];
        if (CoreUtils.isNotUndefinedNorNull(path)) {
          pathValue = path.value;
        }
        else {
          const item = self.perspectiveGroups().find(item => item.name === value);
          if (CoreUtils.isNotUndefinedNorNull(item)) pathValue = item.path;
        }

        if (CoreUtils.isNotUndefinedNorNull(pathValue)) {
          const fauxEvent = {currentTarget: {children: [{id: pathValue}]}};
          self.perspectiveGroupSubtreeItemClickHandler(fauxEvent);
        }
        else {
          const previousName = self.perspectiveGroup().name;
          self.perspectiveGroup(self.perspectiveGroups().find(item => item.name === value));
          const name = self.perspectiveGroup().name;

          if (previousName !== "") toggleSubtreePageVisibility(previousName);

          if (name !== previousName) {
            let subtreePageItems = [];
            self.navtreeManager.getGroupContents(name)
              .then(groupContents => {
                groupContents.forEach((item) => {
                  const itemHTML = (typeof item.descriptionHTML !== "undefined" ? item.descriptionHTML : "<p>CBE did not provide a description for this item.</p>");
                  subtreePageItems.push({
                    type: item.identity.kind,
                    path: PageDefinitionUtils.pathEncodedFromIdentity(item.identity),
                    label: PageDefinitionUtils.displayNameFromIdentity(item.identity),
                    descriptionHTML: { view: HtmlUtils.stringToNodeArray(`<span>${itemHTML}</span>`) }
                  });
                });
              }).then(() => {
                self.perspectiveMemory.setExpandableName.call(self.perspectiveMemory, name);
                self.subtreeItemChildren(subtreePageItems);
                toggleSubtreePageVisibility(name);

                // expand navtree group
                viewParams.signaling.navtreeUpdated.dispatch({ path: name, unlock: true });
              });
          }
          else {
            // Reinitialize perspectiveGroup, so previousName const
            // const will be "" if/when a different perspectiveGroup
            // is selected
            self.perspectiveGroup({name: "", description: "<p/>"});
          }
        }

      };

      function selectPerspective(perspectiveId){
        const perspective = PerspectiveManager.getById(perspectiveId);
        if (typeof perspective !== "undefined") {
          viewParams.signaling.perspectiveSelected.dispatch(perspective);
          viewParams.signaling.perspectiveChanged.dispatch(perspective);
          document.title = Runtime.getName() + " - " + perspective.label;
        }

        return perspective;
      }

    }

    return LandingPageTemplate;
  }
);
