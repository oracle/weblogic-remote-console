/**
 * @license
 * Copyright (c) 2020, 2023, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

/**
 * @module
 */
define([
  'knockout',
  'wrc-frontend/apis/data-operations',
  'ojs/ojarraytreedataprovider',
  'wrc-frontend/core/runtime',
  'wrc-frontend/microservices/page-definition/utils',
  'wrc-frontend/core/mutex',
], function (
  ko,
  DataOperations,
  ArrayTreeDataProvider,
  Runtime,
  PageDefinitionUtils,
  Mutex
) {
  function NavtreeManager(beanTree) {
    // new Navtree
    this.treeModel = {};
    this.nodes = [];
    this.treeModelReferences = [];
    this.beanTree = beanTree;
    //

    var self = this;

    this.treeData = ko.observableArray();
  }

  NavtreeManager.prototype = {
    //constructor: NavtreeManager,

    /**
     * set and return redwood class for a given node
     * @param {*} node
     */
    getIconClass: function (node) {
      node.class = 'oj-navigationlist-item-icon ';
      if (node.type === 'group') {
        node.class += 'oj-ux-ico-bag';
      } else if (node.type === 'root') {
        node.class += 'oj-ux-ico-domain';
      } else if (node.type === 'collection') {
        node.class += 'oj-ux-ico-collections';
      } else if (node.type === 'condensed') {
        node.class += 'oj-ux-ico-browse';
      } else if (node.type === 'collectionChild') {
        if (
          node.parentProperty === 'Servers' ||
          node.parentProperty === 'RunningServers' ||
          node.parentProperty === 'ServerStates'
        ) {
          node.class += 'oj-ux-ico-server';
        } else if (node.parentProperty === 'Clusters') {
          node.class += 'oj-ux-ico-cluster';
        } else if (
          node.parentProperty === 'Machines' ||
          node.parentProperty === 'NodeManagerRuntimes'
        ) {
          node.class += 'oj-ux-ico-server';
        }
      } else {
        // type === 'creatableOptionalSingleton'
        // type === 'nonCreatableOptionalSingleton'
        node.class += 'oj-ux-ico-assets';
      }
      return node.class;
    },

    refreshTreeModel: async function () {
      return DataOperations.navtree
        .refreshNavtreeData(this.beanTree.navtree, this.treeModel)
        .then((newTreeModel) => {
          this.treeModel = newTreeModel;
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },

    /**
     * Convert treeModel into data structure that oj-navigation-list needs
     * @param {string} selectedItem - Path of node (e.g. Environment/Servers/AdminServer) that was selected
     */
    updateTreeView: function (selectedItem = '') {
      // recursive function to process contents attribute of a node
      function processContents(contents, parentPath, selectedItem) {
        let tree = [];

        contents?.forEach((item) => {
          // [{"name":"Environment","label":"Environment","expandable":true,"type":"group"},
          let identifier = (parentPath ? parentPath + '/' : '') + item.name;

          let node = this.nodes[identifier];

          let extraNodes = [];

          if (node) {
            Object.assign(node, item);
          } else {
            node = item;
          }

          node.identifier = identifier;

          this.treeModelReferences[identifier] = item;

          // tree nodes are not marked as expanding because they do not have landing pages
          if (node.expandable !== false && !node.children) {
            node.children = ko.observableArray([]);
          }

          //node.children?.removeAll();
          let childrenHaveMutated = false;

          if (item.contents) {

            if (!node.children) {
              node.children = ko.observableArray([]);
            }

            // Find all the extra nodes
            extraNodes = node.children().filter(item => item['extra'] === true);

            // Remove the ellipses and the extra nodes when present
            node.children.remove(function (item) {
              return ((item.identifier === '...') || (item['extra'] === true));
            });

            processContents
              .call(this, item.contents, node.identifier, selectedItem)
              ?.forEach((n, ix) => {
                let childNode;

                let existingChild = node
                  .children()
                  .find((element) => element.identifier === n.identifier);

                if (existingChild) {
                  Object.assign(existingChild, n);
                  childNode = existingChild;
                }
                else if (node.children && n) {
                  childNode = n;
                  node.children.push(childNode);
                  childrenHaveMutated = true;
                }

                // if node is not a group only process first 9 children as the list will be ellipsized,
                // this will avoid processing large lists
                if (
                  (node.children().length < 9 || node.type !== 'group') &&
                  node.children()[ix].identifier !== childNode.identifier
                ) {
                  node.children()[ix] = childNode;
                  childrenHaveMutated = true;
                }
              });

            // if the number of children on a node has reduced, remove obsolete children
            if (node.children().length > item.contents.length) {
              node.children.splice(item.contents.length);
            }

            if (childrenHaveMutated === true) node.children.valueHasMutated();
          }
          else {
            // Remove the children from the node when there
            // are no contents and the item is not exapandable
            if (item.expandable === false) delete node['children'];
          }

          this.nodes[node.identifier] = node;

          if (node.children) {
            const childLen = node.children().length;
            if (childLen > 9 && 'collection' === node.type) {

              // Find selected item in the children
              var selectedNode;
              if (selectedItem && (selectedItem !== '')) {
                selectedNode = node.children().find(item => item.identifier === selectedItem);
              }

              // Check for exta nodes still available and enure they are marked as an extra
              const foundExtraNodes = [];
              extraNodes.forEach(extra => {
                var extraNode = node.children().find(item => item.identifier === extra.identifier);
                if (extraNode) {
                  extraNode['extra'] = true;
                  foundExtraNodes.push(extraNode);
                }
              });

              // Shorten the list of children
              node.children.splice(9);

              // Remove extra nodes in the list of children to prevent duplicates
              foundExtraNodes.forEach(extra => {
                node.children.remove(function (item) {
                  return (item.identifier === extra.identifier);
                });
              });

              // Check and add the selected item when not present marking as extra
              if (selectedNode) {
                const found = node.children().find(item => item.identifier === selectedItem);
                const extra = foundExtraNodes.find(item => item.identifier === selectedItem);
                if (!found && !extra) {
                  selectedNode['extra'] = true;
                  foundExtraNodes.push(selectedNode);
                }
              }

              // Add the extra nodes and also the ellipses when there are remaining children
              node.children.push(...foundExtraNodes);
              if (node.children().length < childLen) {
                node.children.push({
                  identifier: '...',
                  label: '...',
                  name: '...',
                  selectable: false,
                });
              }
            }
          }

          this.getIconClass(node);
          tree.push(node);
        });
        return tree;
      }

      let newTreeData = processContents.call(this, this.treeModel.contents, undefined, selectedItem);

      if (this.treeData().length === 0) {
        this.treeData(newTreeData);
      }
      this.treeData.valueHasMutated();
    },

    getNodeById: function (nodeId) {
      return this.nodes[nodeId];
    },

    expandNode: function (nodeId) {
      let node = this.nodes[nodeId];

      if (node) {
        this.treeModelReferences[nodeId].expanded = true;
        node.expanded = true;
        return this.refreshTreeModel().then(() => {
          this.updateTreeView();
        });
      }

      return Promise.resolve(1);
    },

    /**
     * create a new jet DataProvider representing the navtree
     */
    getDataProvider: function () {
      return new ArrayTreeDataProvider(this.treeData, {
        keyAttributes: 'identifier',
      });
    },

    /**
     * Refresh the tree model and populate the nodes of the selected item when specified
     * @param {string} selectedItem - Path of node (e.g. Environment/Servers/AdminServer) that was selected
     * @param {string} encodedPath - The encoded path of the selectedItem used to traverse the segments
     */
    populateNodeSet: function (selectedItem, encodedPath = null) {
      // Get the parent path and the child name from the specified path
      function getParentItem(path) {
        let parentPath = '';
        const pathSegments = path.split('/');
        pathSegments.slice(0,-1).forEach(segment => {
          if (parentPath.length > 0) parentPath += '/';
          parentPath += segment;
        });
        return {path: parentPath, child: pathSegments.slice(-1)[0]};
      }

      // Get the item value and decode the specified value when encoded
      function getItem(value, isEncoded) {
        return (isEncoded ? decodeURIComponent(value) : value);
      }

      // Check if the selected item is not available in the tree model
      if (selectedItem && (selectedItem !== '') && !this.treeModelReferences[selectedItem]) {
        let treeRef;

        // An encoded path requires the path segments to be decoded
        const isEncoded = (encodedPath && encodedPath !== '') ? true : false;
        const childPath = (encodedPath && encodedPath !== '') ? encodedPath : selectedItem;

        // Create a path to the selected item in the tree model by
        // finding the first available tree model node in the path
        // of the selected item and save each child segment along
        // that path so the contents can be requested...
        let parentItem = getParentItem(childPath);
        let childItems = [getItem(parentItem.child, isEncoded)];
        while (!treeRef && (parentItem.path !== '')) {
          treeRef = this.treeModelReferences[getItem(parentItem.path, isEncoded)];
          if (!treeRef) {
            parentItem = getParentItem(parentItem.path);
            childItems.push(getItem(parentItem.child, isEncoded));
          }
        }

        // Expand the tree model node that was found
        // otherwise point to the root of the tree model
        if (treeRef) treeRef.expanded = true;
        else treeRef = this.treeModel;

        // Once the tree model node is found build the path
        // to the selected item from the array of child items
        if (treeRef) {
          const childPathItems = childItems.reverse();
          for (let i = 0; i < childPathItems.length; i++) {
            let childContent = { name: childPathItems[i], expanded: true };
            if (treeRef.contents) treeRef.contents.push(childContent);
            else treeRef.contents = [childContent];
            treeRef = childContent;
          }
        }
      }

      return new Promise((resolve, reject) => {
        // Ensure that the selected node is expanded
        let node = (selectedItem && (selectedItem !== '')) ? this.nodes[selectedItem] : null;
        if (node && !node.contents) {
          if (this.treeModelReferences[selectedItem])
            this.treeModelReferences[selectedItem].expanded = true;
          node.expanded = true;
        }
        // Refresh and update the tree model
        this.refreshTreeModel()
          .then(() => {
            this.updateTreeView(selectedItem);
            resolve(1);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

  };

  return NavtreeManager;
});