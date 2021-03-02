/**
 * @license
 * Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

define(['knockout', 'ojs/ojarraytreedataprovider', 'ojs/ojkeyset', '../../cfe/common/runtime', '../../cfe/common/utils', '../../cfe/common/mutex', 'ojs/ojlogger'],
  function (ko, ArrayTreeDataProvider, keySet, Runtime, Utils, Mutex, Logger) {

    const PAGINATION_THRESHOLD = 10;

    function NavtreeManager(perspective) {

      this.mutex = new Mutex();

      this.groups = {};

      var self = this;

      this.perspective = perspective;

      this.treeData = ko.observableArray();


      this.jsonCache = {};
      this.nodeCache = {};

      this.populateNode = function (pathToExpand) {
        return self.mutex.runExclusive(
          function () { return self._populateNode(pathToExpand); })
          .then(function () { return self.treeData.valueHasMutated(); });
      }

      this._populateNode = function (pathToExpand) {

        // check to see if the node has already been populated...
        if (pathToExpand in self.nodeCache) {
          if (self.nodeCache[pathToExpand].populated) {
            return Promise.resolve(1);
          }
          self.nodeCache[pathToExpand].populated=true;
        }

        // if it's a group look for the prefetched json
        if (pathToExpand in self.groups) {
          let json = self.groups[pathToExpand];

          self.addNodesToTree(pathToExpand, json);
          return Promise.resolve(1);
        }

        let baseUrl = Runtime.getBaseUrl() + "/" + self.perspective.id + "/data/";
        let url = baseUrl + pathToExpand;

        if (!(pathToExpand in self.jsonCache)) {
          return $.getJSON({ url: url }).then(function (childrenJson) {
            self.jsonCache[pathToExpand] = childrenJson;
            self.addNodesToTree(pathToExpand, childrenJson);
          }
          );
        } else {
          let childrenJson = self.jsonCache[pathToExpand];
          self.addNodesToTree(pathToExpand, childrenJson);
        }

        return Promise.resolve(1);
      }

      this.buildTreeNode = function (response) {

        let nodeList = [];

        if (typeof response.navigation !== 'undefined' && response.navigation.length > 0) {
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
              if (typeof response.data !== 'undefined' && typeof response.data.identity !== 'undefined') {
                groupPath = Utils.pathEncodedFromIdentity(response.data.identity) + "/" + item.groupLabel;
              } else {
                groupPath = item.groupLabel;
              }

              let groupNode = {
                group: groupPath,
                kind: "group",
                label: item.groupLabel,
                path: groupPath,
                breadcrumbs: groupPath,
                leaf: false,
                class: self.getIconClass({ type: "group" }),
                children: ko.observableArray([])
              };

              self.nodeCache[groupPath]=groupNode;
              nodeList.push(groupNode);

              // look for a group containing a group
              item.contents.forEach(function (g) {
                if (typeof g.groupLabel !== 'undefined') {
                  let nestedGroupPath = groupPath + "/" + g.groupLabel;

                  let groupChildNode = {
                    group: nestedGroupPath,
                    kind: "group",
                    identity: { kind: "group", path: [] },
                    label: g.groupLabel,
                    path: nestedGroupPath,
                    breadcrumbs: nestedGroupPath,
                    leaf: false,
                    children: ko.observableArray([]),
                    class: self.getIconClass({ type: "group" })
                  };

                  groupNode.children.push(groupChildNode);
                  groupNode.populated = true;
                  self.nodeCache[nestedGroupPath] = groupNode;
                  self.groups[nestedGroupPath] = g.contents;

                  g.contents.forEach(c => {
                    let node = {
                      label: Utils.displayNameFromIdentity(c.identity),
                      kind: c.identity.kind,
                      path: Utils.pathEncodedFromIdentity(c.identity),
                      breadcrumbs: Utils.breadcrumbsFromIdentity(c.identity),
                      class: self.getIconClass({ type: c.identity.kind, parentProperty: Utils.parentPropertyFromIdentity(c.identity) }),
                      leaf: self.isLeaf(c)
                    };

                    if (!node.leaf) node.children = ko.observableArray([]);

                    self.nodeCache[node.path] = node;
                    groupChildNode.children.push(node);
                    groupChildNode.populated = true;
                  });
                } else {
                  let node = {
                    label: Utils.displayNameFromIdentity(g.identity),
                    kind: g.identity.kind,
                    path: Utils.pathEncodedFromIdentity(g.identity),
                    breadcrumbs: Utils.breadcrumbsFromIdentity(g.identity),
                    class: self.getIconClass({ type: g.identity.kind, parentProperty: Utils.parentPropertyFromIdentity(g.identity) }),
                    leaf: self.isLeaf(g)
                  };

                  if (!node.leaf) { node.children = ko.observableArray([]); }
                  self.nodeCache[node.path] = node;

                  groupNode.children.push(node);
                  groupNode.populated = true;
                }
              });

              self.groups[groupPath] = { data: item.contents };
            } else if (typeof item.contents === "undefined") {
              let node = {
                label: Utils.displayNameFromIdentity(item.identity),
                kind: item.identity.kind,
                path: Utils.pathEncodedFromIdentity(item.identity),
                breadcrumbs: Utils.breadcrumbsFromIdentity(item.identity),
                class: self.getIconClass({ type: item.identity.kind, parentProperty: Utils.parentPropertyFromIdentity(item.identity) }),
                leaf: self.isLeaf(item)
              };

              if (!node.leaf) { node.children = ko.observableArray([]); }
              self.nodeCache[node.path] = node;
              nodeList.push(node);
            }
          });
        } else if ("data" in response) {
          let data;

          if (Array.isArray(response.data)) data = response.data; else data = [response.data];
        
          data.forEach(item => {
            if (typeof item.Name !== 'undefined') {
              let label = (typeof item.Name.value === "undefined" ? item.Name : item.Name.value);
              let path = Utils.pathEncodedFromIdentity(item.identity);
              let kind = item.identity.kind;
              // in an identity, if a segment is for a singleton, it won't have a key 
              if (kind.endsWith('Singleton')) {
                path += "/" + label;
              }

              let node = {
                kind: kind,
                path: path,
                breadcrumbs: Utils.breadcrumbsFromIdentity(item.identity),
                label: label,
                class: self.getIconClass({ type: item.identity.kind, parentProperty: Utils.parentPropertyFromIdentity(item.identity) }),
                leaf: self.isLeaf(item)
              }
              if (!node.leaf) node.children = ko.observableArray([]);
              nodeList.push(node);
            } else {
              if (!item.groupLabel) {

                let node = {
                  label: Utils.displayNameFromIdentity(item.identity),
                  kind: item.identity.kind,
                  path: Utils.pathEncodedFromIdentity(item.identity),
                  breadcrumbs: Utils.breadcrumbsFromIdentity(item.identity),
                  class: self.getIconClass({ type: item.identity.kind, parentProperty: Utils.parentPropertyFromIdentity(item.identity) }),
                  leaf: self.isLeaf(item)
                };

                if (!node.leaf) node.children = ko.observableArray([]);

                self.nodeCache[node.path]=node;
                nodeList.push(node);
              }
            }
          });
        }

        return nodeList;

      };

      this.evictNode = function (path) {
        return self.mutex.runExclusive(function () { return self._evictNode(path); });
      }

      this._evictNode = async function(path) {
        delete self.jsonCache[path];

        if (self.nodeCache[path]) {
          if (self.nodeCache[path].children) {
            self.nodeCache[path].children.removeAll();
          }
          self.nodeCache[path].populated = false;
        }

        self.treeData.valueHasMutated();
      }

      this.addNodesToTree = function (pathToExpand, json) {

        let nodeToExpand = self.nodeCache[pathToExpand];

        // because the navtree is incremental, the nodes are placed in the cache
        // before their children are populated. therefore if there is no cache entry,
        // it is the root node
        if (!nodeToExpand) {
          nodeToExpand = self.treeData;
        }

        let childNodes = self.buildTreeNode(json);

        let isRoot = pathToExpand === '';
        if (!self.nodeCache[pathToExpand]) {
          if (isRoot) {
            self.nodeCache[pathToExpand] = ko.observableArray(childNodes);
          } else {
            self.nodeCache[pathToExpand] = { children: ko.observableArray([]) };
          }
        }
        childNodes.forEach(item => {
          if (isRoot) {
            nodeToExpand.push(item);
          } else {
            if (!nodeToExpand.children) {
              nodeToExpand.children = ko.observableArray([]);
            }

            if (item) {
              // check to see the item is already there before adding.
              let dupes = nodeToExpand.children().filter(c => c.path === item.path);

              if (!dupes || dupes.length === 0) {
                nodeToExpand.children.push(item);
              }
              else {
                console.log(item.path + " would be a duplicate child");
              }

            }

          }

          self.nodeCache[item.path] = item;
        });

        self.condenseChildren(nodeToExpand);

        if (isRoot) {
          // this call is necessary to eliminate erroneous "No items to display" message
          nodeToExpand.valueHasMutated();
        }

        nodeToExpand.populated = true;
      };

      this.initialized = false;

      // utility method to determine if a node is a leaf-node or may have
      // children
      this.isLeaf = function (item) {
        const kind = (typeof item.identity !== "undefined" && typeof item.identity.kind !== "undefined" ? item.identity.kind : "");
        if (kind === 'collection') {
          return false;
        }

        let leaf = true;

        // for non-collection, you need to get the RDJ
        // and see if it has child nav tree nodes
        // get the encoded path avoiding any confusion
        // with bean path names that require encoding
        //console.log(Utils.pathSegmentsFromIdentity(item.identity));
        let path = Utils.pathEncodedFromIdentity(item.identity);

        if (path !== "") {
          let url = Runtime.getBaseUrl() + "/" + self.perspective.id + "/data/" + path;

          $.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function (result) {
              if (typeof result.navigation !== 'undefined') leaf = false;
            }
          });
        }

        return leaf;
      };

      this.getGroups = function () {
        return self.mutex.runExclusive(self._getGroups);
      }

      this._getGroups = async function () {
        return Object.keys(self.groups);
      };

      this.getGroupContents = async function (group) {
        return self.mutex.runExclusive(function () {
          return self._getGroupContents(group);
        });
      }

      this._getGroupContents = async function (group) {
        return self.groups[group].data;
      };

      this.getDataProvider = function () {
        return new ArrayTreeDataProvider(self.treeData, { keyAttributes: 'path' });
      }

      this.getIconClass = function (node) {
        node.class = "oj-navigationlist-item-icon ";
        if (node.type === "group") {
          node.class += "oj-ux-ico-bag";
        }
        else if (node.type === 'root') {
          node.class += "oj-ux-ico-domain"
        }
        else if (node.type === 'collection') {
          node.class += "oj-ux-ico-collections";
        }
        else if (node.type === 'condensed') {
          node.class += "oj-ux-ico-browse"
        }
        else if (node.type === 'collectionChild') {
          if (node.parentProperty === 'Servers' || node.parentProperty === 'RunningServers' || node.parentProperty === 'ServerStates') {
            node.class += "oj-ux-ico-server";
          } else if (node.parentProperty === 'Clusters') {
            node.class += "oj-ux-ico-cluster";
          } else if (node.parentProperty === 'Machines' || node.parentProperty === 'NodeManagerRuntimes') {
            node.class += "oj-ux-ico-server";
          }
        }
        else {
          // type === 'creatableOptionalSingleton'
          // type === 'nonCreatableOptionalSingleton'
          node.class += "oj-ux-ico-assets";
        }
        return node.class;
      }

      // get the model for a path.. because tree traversal is
      // iterative, fetch all the ancestor nodes too.. then pull from
      // node cache
      this.getPathModel = async function (path) {
        await self.initPromise;

        let pathSegments = path.split("/");
        let workingPath = '';

        for (let i = 0; i < pathSegments.length; i++) {
          let pathSegment = pathSegments[i];
          workingPath += pathSegment;

          if (workingPath !== '/' && workingPath !== '') {
            await self.populateNode(workingPath);
          }
          workingPath += '/';
        }

        if (path === '/') return self.nodeCache[''];

        return self.nodeCache[path];
      }

      // Return models for the children (single-level) of a given path, as an array. Use an empty array to indicate there are no children
      this.getPathChildrenModels = async function (path) {
        let node = await self.getPathModel(path);

        let isRoot = path === '/' || path === '';

        return isRoot ? node() : node.children();
      }


      const MAX_CHILDREN = 10;
      this.condenseChildren = function (node) {

        if (node.children) {
          // if there are any collections as children do not condense because theres no other way to navigate to them
          let collections = node.children().find(child => child.kind === 'collection');
          let collectionCount = collections ? collections.length : 0;

          if (node.kind !== 'group' && collectionCount == 0) {
            if (node.children().length >= MAX_CHILDREN) {
              node.children.slice(0, MAX_CHILDREN);
              node.children.push({ label: "...", name: "...", breadcrumbs: node.breadcrumbs, path: node.path + "/...", kind: "condensed" });
            }
          }
        }
      }

      // initialize the top-level tree.. Once it is initialized, make it visible
      // after a 300ms delay. this eliminates a temporary "No items to display" 
      // message that appears while the oj-navigation-list is initializing. 
      // https://jira.oraclecorp.com/jira/browse/JET-41067
      this.initPromise = this.populateNode('').then(() => {
        new Promise(resolve => setTimeout(resolve, 300)).then(() => {
          let n = document.getElementById("navtree");
          if (n !== null) n.style.visibility = "visible";
        });
      }
      ).then(() => { self.initialized = true; });

      // populate a given set of paths
      this.populateNodeSet = function (nodes) {
        let promise = self.initPromise;

        nodes.values().forEach(n => {
          promise = promise.then(() => { promise = self.populateNode(n); });
        });

        return promise;
      }
    }


    return NavtreeManager;
  }
);
