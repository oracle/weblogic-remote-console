/**
 * @license
 * Copyright (c) 2020, 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

/**
 * @module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojhtmlutils', 'wrc-frontend/apis/data-operations', 'wrc-frontend/microservices/provider-management/data-provider-manager', 'wrc-frontend/microservices/perspective/perspective-manager', 'wrc-frontend/microservices/perspective/perspective-memory-manager', 'wrc-frontend/microservices/page-definition/utils', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/runtime', 'wrc-frontend/core/utils', 'ojs/ojlogger', 'ojs/ojknockout', 'ojs/ojbinddom', 'ojs/ojmodule', 'ojs/ojconveyorbelt'],
  function(oj, ko, HtmlUtils, DataOperations, DataProviderManager, PerspectiveManager, PerspectiveMemoryManager, PageDefinitionUtils, ViewModelUtils, Runtime, CoreUtils, Logger){
    function LandingPageTemplate(viewParams) {
      const self = this;

      // START: knockout observables referenced in landing.html
      this.perspectiveGroups = ko.observableArray();
      this.perspectiveGroup = ko.observable({name: '', description: '<p/>'});
      this.subtreeItemChildren = ko.observableArray();
      // END:   knockout observables referenced in landing.html

      this.perspective = PerspectiveManager.getById(viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId());
      this.perspectiveMemory = PerspectiveMemoryManager.getPerspectiveMemory(this.perspective.id);
      this.dataProvider = DataProviderManager.getLastActivatedDataProvider();
      this.treeModel = {};

      this.signalBindings = [];

      this.connected = function() {
        // Next, we need to subscribe to the parameters.perspectiveId
        // observable, so we get notified when we need to switch landing
        // pages.
        viewParams.parentRouter.observableModuleConfig().params.ojRouter.parameters.perspectiveId.subscribe((value) => {
          // Clicking the "Home" button toolbar menu item in the content
          // area header, puts you in "home mode". That's the mode that
          // causes the navstrip to treat navstrip icon clicks as requests
          // to load a perspective's navtree, as well as a request to show
          // it's landing page. In "home mode", the user is switching between
          // perspectives, so we need to reinitialize the ko.observables
          // that are referenced in landing.html.
          self.perspectiveGroup({name: '', description: '<p/>'});
          // Hiding the subtree displayed for a perspectiveGroup, is also
          // part of the reinitialization sequence.
          setPagePanelSubtreeVisibility(false);
          Logger.info(`[LANDING] current landing: ${value}`);
          // Only reload the perspectiveGroups, if value isn't the
          // id of the perspective landing page we're working with.
          if (value !== self.perspective.id) {
            Logger.info(`[LANDING] previous landing: ${self.perspective.id}`);
            switchPerspective(value);
          }
        });

        // Be sure to create a binding for any signaling add in
        // this module. In fact, the code for the add needs to
        // be moved here physically.

        let binding = viewParams.signaling.beanTreeChanged.add(newBeanTree => {
          if (newBeanTree.type !== 'home') {
            switchPerspective(newBeanTree.type);
          }
        });

        self.signalBindings.push(binding);

        switchPerspective(self.perspective.id);
      }.bind(this);

      this.disconnected = function () {
        self.signalBindings.forEach(binding => { binding.detach(); });

        self.signalBindings = [];
      }.bind(this);

      function loadPerspectiveGroups() {
        ViewModelUtils.setPreloaderVisibility(true);
        const beanTree = self.dataProvider.getBeanTreeByPerspectiveId(
          self.perspective.id
        );
        getRootContents(beanTree)
          .then((rootContents) => {
            return expandGroups(beanTree, rootContents);
          })
          .then((rootContents) => {
            self.treeModel = rootContents;
            // Determine if there is a single non-expandable root and thus
            // display a single group item which points to the resource data
            if ((rootContents.contents.length === 1) &&
                (rootContents.contents[0].expandable === false) &&
                CoreUtils.isNotUndefinedNorNull(rootContents.contents[0].resourceData)) {
              self.perspectiveGroups([{
                  name: rootContents.contents[0].name,
                  label: rootContents.contents[0].resourceData.label,
                  path: rootContents.contents[0].resourceData.resourceData
                }]
              );
            }
            else if (rootContents.contents.length > 0) {
              self.perspectiveGroups(
                convertRootContentsToGroups(rootContents.contents)
              );
            }

            const expandableName = self.perspectiveMemory.expandableName.call(
              self.perspectiveMemory
            );
            if (expandableName !== null) {
              const fauxEvent = {
                currentTarget: {
                  children: [{ id: expandableName, attributes: [] }],
                },
              };
              self.landingPanelClickHandler(fauxEvent);
            } else {
              setPagePanelSubtreeVisibility(false);
            }
          })
          .catch(response => {
            ViewModelUtils.failureResponseDefaultHandling(response);
          })
          .finally(() => {
            ViewModelUtils.setPreloaderVisibility(false);
          });
      }

      function convertRootContentsToGroups(pathModels) {
        function removeDuplicates(groups, key) {
          return [
            ...new Map(groups.map(obj => [key(obj), obj])).values()
          ];
        }

        let groups = [];
        pathModels.forEach((pathModel) => {
          pathModels.forEach((pathModel) => {
            if (pathModel.type === 'group') {
              groups.push({name: pathModel.name, label: pathModel.label});
            }
            else if (pathModel.type === 'collection') {
              groups.push({name: pathModel.resourceData.label, label: pathModel.resourceData.label, path: pathModel.resourceData.resourceData});
            }
          });
        });
        // TODO: Switch this to just return groups, once Mason
        // resolves the duplicates issue
        return removeDuplicates(groups, group => group.name);
      }

      function setPagePanelSubtreeVisibility(visible) {
        $('#landing-page-panel-subtree').css({'display': (visible ? 'block' : 'none')});
      }

      function toggleSubtreePageVisibility(subtreeName){
        let ele = document.getElementById('landing-page-panel-subtree');
        if (ele !== null) {
          const visible = (ele.style.display === 'block');
          const ele1 = document.getElementById(subtreeName + 'Chevron');
          if (visible) {
            ele.style.display = 'none';
            if (ele1 !== null) ele1.setAttribute('class', 'landing-page-panel-chevron oj-fwk-icon oj-fwk-icon-caret03-s');
          }
          else {
            ele.style.display = 'block';
            if (ele1 !== null) ele1.setAttribute('class', 'landing-page-panel-chevron oj-fwk-icon oj-fwk-icon-caret03-n');
          }
        }
      }

      /**
       * <p>This is like the one in navtree-manager.js, except it doesn't use instance variables. Not using instance variables allows it to be moved to a utility module.</p>
       * @param {[{label: string, name: string, selectable: boolean, expanded?: boolean, expandable?: boolean, type: "root|group|collection", children?: any}]} contents
       * @param {undefined|any} treeModel
       * @returns {[{identifier: string, label: string, name: string, selectable: boolean, expanded?: boolean, expandable?: boolean, type: "root|group|collection", children?: [any], contents?: any}]}
       * @private
       */
      function processContents(contents, treeModel) {
        let tree = [];

        contents?.forEach((item) => {
          // [{"name":"Environment","label":"Environment","expandable":true,"type":"group"},
          let identifier = (treeModel ? treeModel + '/' : '') + item.name;

          let node = item;
          node.identifier = identifier;

          // tree nodes are not marked as expanding because they do not have landing pages
          if (node.expandable !== false) {
            node.children = ko.observableArray([]);
          }

          node.children?.removeAll();

          if (item.contents) {
            processContents(item.contents, node.identifier)
              ?.forEach((n) => {
                node.children.push(n);
              });

            node.children.valueHasMutated();
          }

          tree.push(node);
        });
        return tree;
      }

      /**
       *
       * @param {{actionsEnabled: boolean, content?: {view: Array}, iconFile: string, label: string, name: "edit|serverConfig|domainRuntime", type: "configuration|monitoring|view|modeling", navtree: string, changeManager?: string, readOnly?: boolean, provider?: {id: string, name: string}}} beanTree
       * @returns {Promise<{contents: [{identifier: string, label: string, name: string, type: "configuration|monitoring|view|modeling", selectable: boolean, expanded?: boolean, expandable?: boolean, type: "root|group|collection", children?: [any], contents?: any}]}>}
       * @private
       */
      function getRootContents(beanTree, treeModel={}) {
        return new Promise((resolve) => {
          if (CoreUtils.isUndefinedOrNull(self.treeModel.contents)) {
            return DataOperations.navtree.refreshNavtreeData(beanTree.navtree, treeModel)
              .then( rootTreeModel => {
                rootTreeModel = processContents(rootTreeModel.contents);
                resolve({contents: rootTreeModel});
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              });
          }
          else {
            resolve(self.treeModel);
          }
        });
      }

      function expandGroups(beanTree, root) {
        root.contents.forEach((content) => {
          content.expanded = true;
        });

        return getRootContents(beanTree, root);
      }

      /**
       *
       * @param {{actionsEnabled: boolean, content?: {view: Array}, iconFile: string, label: string, name: "edit|serverConfig|domainRuntime", type: "configuration|monitoring|view|modeling", navtree: string, changeManager?: string, readOnly?: boolean, provider?: {id: string, name: string}}} beanTree
       * @param {any} treeModel
       * @param {string} groupName
       * @returns {Promise<{contents: [{identifier: string, label: string, name: string, type: "configuration|monitoring|view|modeling", selectable: boolean, expanded?: boolean, type: "root|group|collection", children?: [any], contents?: any}]}>}
       * @private
       */
      function getGroupContents(beanTree, treeModel, groupName) {
        return new Promise((resolve) => {
          const group = treeModel.contents.find(
            (group) => group.name === groupName
          );
          if (CoreUtils.isUndefinedOrNull(group.contents)) {
            let p;

            if (group.expanded !== true) {
              group.expanded = true;
              p = DataOperations.navtree.refreshNavtreeData(
                beanTree.navtree,
                treeModel
              );
            } else {
              p = Promise.resolve(group);
            }

            return p.then((groupTreeModel) => {
              groupTreeModel = processContents(groupTreeModel.contents);
              resolve({ contents: groupTreeModel });
            });
          } else {
            resolve(treeModel);
          }
        });
      }

      /**
       *
       * @param {[{label: string, name: string, selectable: boolean, expanded?: boolean, type: "root|group|collection", children?: any}]} contents
       * @param {string} groupName
       * @returns {Promise<[]|[{label: string, type: "root|group|collection", path: string, descriptionHTML: any}]>}
       * @private
       */
      function getGroupContentsChildren(contents, groupName) {
        function getIntroductionHtml(pdjIntro, rdjIntro) {
          let bindHtml = (CoreUtils.isNotUndefinedNorNull(rdjIntro) ? rdjIntro : pdjIntro);
          if (CoreUtils.isNotUndefinedNorNull(bindHtml)) {
            bindHtml = (bindHtml.startsWith('<p>') ? bindHtml : `<p>${bindHtml}</p>`);
          }
          else {
            bindHtml = '<p></p>';
          }
          return bindHtml;
        }

        function getSubtreePageItem(item) {
          if (CoreUtils.isUndefinedOrNull(item.resourceData)) {
            const itemHTML = '<p></p>';
            return Promise.resolve({
              type: item.type,
              path: '#',
              label: `${item.label} (Not selectable)`,
              descriptionHTML: {view: HtmlUtils.stringToNodeArray(`<span>${itemHTML}</span>`)}
            });
          }
          else {
            return DataOperations.mbean.get(item.resourceData.resourceData)
              .then(reply => {
                const rdjData = reply.body.data.get('rdjData');
                const pdjData = reply.body.data.get('pdjData');
                const itemHTML = getIntroductionHtml(pdjData.introductionHTML, rdjData.introductionHTML);
                return {
                  type: item.type,
                  path: item.resourceData.resourceData,
                  label: item.resourceData.label,
                  descriptionHTML: {view: HtmlUtils.stringToNodeArray(`<span>${itemHTML}</span>`)}
                };
              })
              .catch(response => {
                ViewModelUtils.failureResponseDefaultHandling(response);
              });
          }
        }

        // Initialize index and array used as
        // the return value.
        let i = 0, results = [];

        const group = contents.find(group => group.name === groupName);

        let nextPromise = () => {
          if (CoreUtils.isUndefinedOrNull(group.contents)) {
            // We're done, so return the results
            // array in a Promise.resolve()
            return Promise.resolve(results);
          }
          else {
            if (i >= group.contents.length) {
              // We're done, so return the results
              // array in a Promise.resolve()
              return Promise.resolve(results);
            }

            let newPromise = Promise.resolve(getSubtreePageItem(group.contents[i]))
              .then(result => {
                if (result !== {}) results.push(result);
              });
            i++;
            return newPromise.then(nextPromise);
          }
        };

        // Kick off the chain by calling the
        // nextPromise function.
        return Promise.resolve().then(nextPromise);
      }

      this.perspectiveGroupSubtreeItemClickHandler = function(event) {
        const resourceData = event.currentTarget.children[0].id;
        if (CoreUtils.isUndefinedOrNull(resourceData)) return;

        Logger.log(`[LANDING] data-path=${resourceData}, perspective-group=${self.perspectiveGroup().name}`);

        // expand the navtree nodes
        viewParams.parentRouter.go('/' + self.perspective.id + '/' + encodeURIComponent(resourceData));
      };

      /**
       * Called when user clicks icon or label of card item
       * @param event
       */
      this.landingPanelClickHandler = function(event) {
        // The Kiosk will more than likely just be in the
        // way from here on out, so go ahead and hide it.
        viewParams.signaling.ancillaryContentAreaToggled.dispatch('landing', false);
        // The id attribute with the perspectiveId assigned
        // to it, is on the first child element of the
        // click event's current target. The click event's
        // current target is the <a> tag, and the first
        // child element (e.g. children[0]) of that is a
        // <div> tag.
        const value = event.currentTarget.children[0].id;
        if (CoreUtils.isUndefinedOrNull(value)) return;

        let pathValue;
        const path = event.currentTarget.children[0].attributes['data-path'];
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
          if (CoreUtils.isUndefinedOrNull(self.perspectiveGroup())) {
            self.perspectiveGroup({name: '', description: '<p/>'});
          }
          const name = self.perspectiveGroup().name;

          if (previousName !== '') toggleSubtreePageVisibility(previousName);

          if (name !== previousName) {
            const beanTree = self.dataProvider.getBeanTreeByPerspectiveId(self.perspective.id);
            ViewModelUtils.setPreloaderVisibility(true);
            getGroupContents(beanTree, self.treeModel, name)
              .then(groupContents => {
                self.treeModel = groupContents;
                if (CoreUtils.isNotUndefinedNorNull(groupContents.contents)) {
                  return getGroupContentsChildren(groupContents.contents, name)
                }
                else {
                  return [];
                }
              })
              .then(subtreePageItems => {
                return getSubGroups(subtreePageItems, beanTree, self.treeModel, name);
              })
              .then(subtreePageItems => {
                self.perspectiveMemory.setExpandableName.call(self.perspectiveMemory, name);
                self.subtreeItemChildren(subtreePageItems);
                toggleSubtreePageVisibility(name);
              })
              .finally(() => {
                ViewModelUtils.setPreloaderVisibility(false);
              });
          }
          else {
            // Reinitialize perspectiveGroup, so previousName const
            // const will be "" if/when a different perspectiveGroup
            // is selected
            self.perspectiveGroup({name: '', description: '<p/>'});
          }
        }

      };

      // Get subgroups by looking for the non-selectable items from the supplied
      // subtree page items. When non-selectable items exist, expand those subgroups
      // using the navtree and then for each subgroup expanded, replace the original
      // subtree page item for the non-selectable item with the expanded list...
      async function getSubGroups(subtreePageItems, beanTree, treeModel, subtreeName) {
        // An item is selectable when the path is not an # character
        function isSelectableGroup(item) {
          return (item.path !== '#');
        }

        // Check to see if any subtree page items contain a non-selectable item and
        // return the original subtree page items if everything is selectable...
        if ((subtreePageItems.length === 0) || subtreePageItems.every(isSelectableGroup)) {
          return subtreePageItems;
        }

        // Now find all the non-selectable groups (i.e. subgroups) and set them to be exapanded
        // then issue the navtree request to obtain the expanded contents...
        const subtree = treeModel.contents.find(group => group.name === subtreeName);
        subtree.contents.forEach(item => {
          if ((item.selectable === false) && (item.type === 'group')) {
            item.expanded = true;
          }
        });
        const response = await DataOperations.navtree.refreshNavtreeData(beanTree.navtree, treeModel)
          .catch(error => {
            // Display the problem and return the original subtree page items
            ViewModelUtils.failureResponseDefaultHandling(error);
            return subtreePageItems;
          });

        // Walk the list of subtree page items and replace the non-selectable entries...
        const results = [];
        const respSubtree = response.contents.find(group => group.name === subtreeName);
        for (let index = 0; index < subtreePageItems.length; index++) {
          const item = subtreePageItems[index];
          if (isSelectableGroup(item)) {
            // Keep the current item as this one is selectable
            results.push(item);
          } else {
            // Otherwise get then insert the subgroup item contents for the non-selectable item
            // Update the subgroup label using parent group's label as the prefix
            const subGroup = await getGroupContentsChildren(respSubtree.contents, respSubtree.contents[index].name);
            if (CoreUtils.isNotUndefinedNorNull(subGroup) && (subGroup.length > 0)) {
              subGroup.forEach(item => {
                item.label = `${respSubtree.contents[index].label} / ${item.label}`;
              });
              results.push(...subGroup);
            } else {
              // Keep the original item when there is no subgroup content
              results.push(item);
            }
          }
        }
        return results;
      }

      function switchPerspective(perspectiveId){
        self.perspective = PerspectiveManager.getById(perspectiveId);
        viewParams.signaling.perspectiveSelected.dispatch(self.perspective);
        viewParams.signaling.perspectiveChanged.dispatch(self.perspective);
        document.title = Runtime.getName() + ' - ' + self.perspective.label;
        self.treeModel = {};
        loadPerspectiveGroups();
      }

    }

    return LandingPageTemplate;
  }
);
