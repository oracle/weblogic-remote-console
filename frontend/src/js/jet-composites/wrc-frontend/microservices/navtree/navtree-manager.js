/**
 * @license
 * Copyright (c) 2020, 2022, Oracle Corporation and/or its affiliates.
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
      return DataOperations.navtree.refreshNavtreeData(this.beanTree.navtree, this.treeModel)
        .then((newTreeModel) => {
          this.treeModel = newTreeModel;
          console.log(this.treeModel);
        })
        .catch(error => {
          return Promise.reject(error);
        });
    },

    /**
     * convert treeModel into the datastructure that oj-navigation-list needs
     */
    updateTreeView: function () {
      // recursive function to process contents attribute of a node
      function processContents(contents, parentPath) {
        let tree = [];

        contents?.forEach((item) => {
          // [{"name":"Environment","label":"Environment","expandable":true,"type":"group"},
          let identifier = (parentPath ? parentPath + '/' : '') + item.name;

          let node = item;
          node.identifier = identifier;

          // tree nodes are not marked as expanding because they do not have landing pages
          if (node.expandable !== false) {
            node.children = ko.observableArray([]);
          }

          node.children?.removeAll();

          if (item.contents) {
            processContents
              .call(this, item.contents, node.identifier)
              ?.forEach((n) => {
                node.children.push(n);
              });

            node.children.valueHasMutated();
          }

          this.nodes[node.identifier] = node;

          if (node.children) {
            if (node.children().length > 9 && 'group' !== node.type) {
              node.children.splice(9);
              node.children.push({
                identifier: '...',
                label: '...',
                name: '...',
                selectable: false,
              });
            }
          }
          
          this.getIconClass(node);
          tree.push(node);
        });
        return tree;
      }

      this.treeData(processContents.call(this, this.treeModel.contents));
      this.treeData.valueHasMutated();
    },

    getNodeById: function (nodeId) {
      return this.nodes[nodeId];
    },

    expandNode: function (nodeId) {
      
      let node = this.nodes[nodeId];

      if (node) {
        node.expanded = true;
        return this.refreshTreeModel()
          .then(() => {
            this.updateTreeView();
          });
      }

      return Promise(1);
    },

    /**
     * add nodes represented by the provided json to the given path, generally called during an invocation
     * of `populateNode`
     *
     * @param {string} pathToExpand Path of node to which to add children
     * @param {string} json Backend json representation of the mbean or contents of a group
     */
    addNodesToTree: function (pathToExpand, json) {
      let nodeToExpand = this.nodeCache[pathToExpand];

      // because the navtree is incremental, the nodes are placed in the cache
      // before their children are populated. therefore if there is no cache entry,
      // it is the root node
      if (!nodeToExpand) {
        nodeToExpand = this.treeData;
      }

      let childNodes = this.buildTreeNode(json);

      let isRoot = pathToExpand === '';
      if (!this.nodeCache[pathToExpand]) {
        if (isRoot) {
          this.nodeCache[pathToExpand] = ko.observableArray(childNodes);
        } else {
          this.nodeCache[pathToExpand] = { children: ko.observableArray([]) };
        }
      }
      childNodes.forEach((item) => {
        if (isRoot) {
          nodeToExpand.push(item);
        } else {
          if (!nodeToExpand.children) {
            nodeToExpand.children = ko.observableArray([]);
          }

          if (item) {
            // check to see the item is already there before adding.
            let dupes = nodeToExpand
              .children()
              .filter((c) => c.path === item.path);

            if (!dupes || dupes.length === 0) {
              nodeToExpand.children.push(item);
            } else {
              console.log(item.path + ' would be a duplicate child');
            }
          }
        }

        this.nodeCache[item.path] = item;
      });

      this.condenseChildren(nodeToExpand);

      if (isRoot) {
        // this call is necessary to eliminate erroneous "No items to display" message
        nodeToExpand.valueHasMutated();
      }

      nodeToExpand.populated = true;
    },

    /**
     * parse and build the tree node from a response from the backend, generally called during an invocation
     * of `populateNode`
     *
     * @param {*} response json from the backend to parse
     */
    buildTreeNode: function (response) {
      let nodeList = [];

      if (
        typeof response.navigation !== 'undefined' &&
        response.navigation.length > 0
      ) {
        // in the case of a group (i.e. configuration perspective),
        // For the configuration perspective, item has a contents
        //  populate the groups cache with the contents of the navigation mode.
        // field that is an array of the children associated with
        // referenced by the getChildrenCB() method when the group is expanded.

        response.navigation.forEach((item) => {
          // check if this is a group
          if (typeof item.groupLabel !== 'undefined') {
            var groupPath;
            // determine groupPath from the identity is
            // available -- otherwise it's a top-level group
            // so path is the group label
            if (
              typeof response.data !== 'undefined' &&
              typeof response.data.identity !== 'undefined'
            ) {
              groupPath =
                PageDefinitionUtils.pathEncodedFromIdentity(
                  response.data.identity
                ) +
                '/' +
                item.groupLabel;
            } else {
              groupPath = item.groupLabel;
            }

            let groupNode = {
              group: groupPath,
              kind: 'group',
              label: item.groupLabel,
              path: groupPath,
              breadcrumbs: groupPath,
              leaf: false,
              class: this.getIconClass({ type: 'group' }),
              children: ko.observableArray([]),
            };

            this.nodeCache[groupPath] = groupNode;
            nodeList.push(groupNode);

            // look for a group containing a group
            item.contents.forEach(
              function (g) {
                if (typeof g.groupLabel !== 'undefined') {
                  let nestedGroupPath = groupPath + '/' + g.groupLabel;

                  let groupChildNode = {
                    group: nestedGroupPath,
                    kind: 'group',
                    identity: { kind: 'group', path: [] },
                    label: g.groupLabel,
                    path: nestedGroupPath,
                    breadcrumbs: nestedGroupPath,
                    leaf: false,
                    children: ko.observableArray([]),
                    class: this.getIconClass({ type: 'group' }),
                  };

                  groupNode.children.push(groupChildNode);
                  groupNode.populated = true;
                  this.nodeCache[nestedGroupPath] = groupNode;
                  this.groups[nestedGroupPath] = g.contents;

                  g.contents.forEach((c) => {
                    let node = {
                      label: PageDefinitionUtils.displayNameFromIdentity(
                        c.identity
                      ),
                      kind: c.identity.kind,
                      path: PageDefinitionUtils.pathEncodedFromIdentity(
                        c.identity
                      ),
                      breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(
                        c.identity
                      ),
                      class: this.getIconClass({
                        type: c.identity.kind,
                        parentProperty:
                          PageDefinitionUtils.parentPropertyFromIdentity(
                            c.identity
                          ),
                      }),
                      leaf: this.isLeaf(c),
                    };

                    if (!node.leaf) node.children = ko.observableArray([]);

                    this.nodeCache[node.path] = node;
                    groupChildNode.children.push(node);
                    groupChildNode.populated = true;
                  });
                } else {
                  let node = {
                    label: PageDefinitionUtils.displayNameFromIdentity(
                      g.identity
                    ),
                    kind: g.identity.kind,
                    path: PageDefinitionUtils.pathEncodedFromIdentity(
                      g.identity
                    ),
                    breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(
                      g.identity
                    ),
                    class: this.getIconClass({
                      type: g.identity.kind,
                      parentProperty:
                        PageDefinitionUtils.parentPropertyFromIdentity(
                          g.identity
                        ),
                    }),
                    leaf: this.isLeaf(g),
                  };

                  if (!node.leaf) {
                    node.children = ko.observableArray([]);
                  }
                  this.nodeCache[node.path] = node;

                  groupNode.children.push(node);
                  groupNode.populated = true;
                }
              }.bind(this)
            );

            this.groups[groupPath] = { data: item.contents };
          } else if (typeof item.contents === 'undefined') {
            let node = {
              label: PageDefinitionUtils.displayNameFromIdentity(item.identity),
              kind: item.identity.kind,
              path: PageDefinitionUtils.pathEncodedFromIdentity(item.identity),
              breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(
                item.identity
              ),
              class: this.getIconClass({
                type: item.identity.kind,
                parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(
                  item.identity
                ),
              }),
              leaf: this.isLeaf(item),
            };

            if (!node.leaf) {
              node.children = ko.observableArray([]);
            }
            this.nodeCache[node.path] = node;
            nodeList.push(node);
          }
        });
      } else if ('data' in response) {
        let data;

        if (Array.isArray(response.data)) data = response.data;
        else data = [response.data];

        data.forEach((item) => {
          if (typeof item.Name !== 'undefined') {
            let label =
              typeof item.Name.value === 'undefined'
                ? item.Name
                : item.Name.value;
            let path = PageDefinitionUtils.pathEncodedFromIdentity(
              item.identity
            );
            let kind = item.identity.kind;
            // in an identity, if a segment is for a singleton, it won't have a key
            if (kind.endsWith('Singleton')) {
              path += '/' + label;
            }

            let node = {
              kind: kind,
              path: path,
              breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(
                item.identity
              ),
              label: label,
              class: this.getIconClass({
                type: item.identity.kind,
                parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(
                  item.identity
                ),
              }),
              leaf: this.isLeaf(item),
            };
            if (!node.leaf) node.children = ko.observableArray([]);
            nodeList.push(node);
          } else {
            if (!item.groupLabel) {
              let node = {
                label: PageDefinitionUtils.displayNameFromIdentity(
                  item.identity
                ),
                kind: item.identity.kind,
                path: PageDefinitionUtils.pathEncodedFromIdentity(
                  item.identity
                ),
                breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(
                  item.identity
                ),
                class: this.getIconClass({
                  type: item.identity.kind,
                  parentProperty:
                    PageDefinitionUtils.parentPropertyFromIdentity(
                      item.identity
                    ),
                }),
                leaf: this.isLeaf(item),
              };

              if (!node.leaf) node.children = ko.observableArray([]);

              this.nodeCache[node.path] = node;
              nodeList.push(node);
            }
          }
        });
      }

      return nodeList;
    },

    /**
     * condense an array of children by adding an ellipsis if there are more than MAX_CHILDREN
     *
     * @param {*} node
     */
    condenseChildren: function (node) {
      if (node.children) {
        // if there are any collections as children do not condense because theres no other way to navigate to them
        let collections = node
          .children()
          .find((child) => child.kind === 'collection');
        let collectionCount = collections ? collections.length : 0;

        if (node.kind !== 'group' && collectionCount == 0) {
          if (node.children().length >= NavtreeManager.MAX_CHILDREN) {
            let slicedArray = node.children.slice(
              0,
              NavtreeManager.MAX_CHILDREN
            );
            node.children(slicedArray);
            node.children.push({
              label: '...',
              name: '...',
              breadcrumbs: node.breadcrumbs,
              path: node.path + '/...',
              kind: 'condensed',
            });
          }
        }
      }
    },

    /**
     * depopulate a node from the navigation tree by clearing out its children and also purging the json cache
     * so the content will be refetched from the backend on a subsequent populateNode invocation
     *
     * @param {*} path
     */
    evictNode: function (path) {
      return this.mutex.runExclusive(
        function () {
          return this._evictNode(path);
        }.bind(this)
      );
    },

    _evictNode: async function (path) {
      delete this.jsonCache[path];
      delete this.jsonLoadTimes[path];

      if (this.nodeCache[path]) {
        if (this.nodeCache[path].children) {
          this.nodeCache[path].children.removeAll();
        }
        this.nodeCache[path].populated = false;
      }

      this.treeData.valueHasMutated();
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
     * return a list of groups
     */
    getGroups: function () {
      return this.mutex.runExclusive(this._getGroups.bind(this));
    },

    _getGroups: async function () {
      return Object.keys(this.groups);
    },

    /**
     * get backend json representation of a group
     * @param {string} group
     */
    getGroupContents: async function (group) {
      return this.mutex.runExclusive(
        function () {
          return this._getGroupContents(group);
        }.bind(this)
      );
    },

    _getGroupContents: async function (group) {
      return this.groups[group].data;
    },

    /**
     * Determine if a node is a leaf-node or may have children
     *
     * @param {*} item object
     */
    isLeaf: function (item) {
      const kind =
        typeof item.identity !== 'undefined' &&
        typeof item.identity.kind !== 'undefined'
          ? item.identity.kind
          : '';
      if (kind === 'collection') {
        return false;
      }

      let leaf = true;

      // for non-collection, you need to get the RDJ
      // and see if it has child nav tree nodes
      // get the encoded path avoiding any confusion
      // with bean path names that require encoding
      let path = PageDefinitionUtils.pathEncodedFromIdentity(item.identity);

      if (path !== '') {
        let url =
          Runtime.getBaseUrl() +
          '/' +
          this.beanTree.type +
          '/data/' +
          path +
          '?properties=';

        $.ajax({
          type: 'GET',
          url: url,
          async: false,
          success: function (result) {
            if (typeof result.navigation !== 'undefined') leaf = false;
          },
        });
      }

      return leaf;
    },

    /**
     * Populates a given set of paths
     * @param {Set} nodes - paths of nodes to populate
     */
    populateNodeSet: function (nodes) {
      let promise = Promise.resolve(1);
      // Iterate through every node in nodes
      // arguments, which is assumed to be a
      // Set of labels.
      nodes.values().forEach((n) => {
        promise = promise.then(() => {
          return this.expandNode(n);
        });
      });

      return promise;
    }

  };

  return NavtreeManager;
});