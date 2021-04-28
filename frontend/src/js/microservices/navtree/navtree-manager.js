/**
 * @license
 * Copyright (c) 2020, 2021, Oracle Corporation and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";

/**
 * @module
 */
define(['knockout', 'ojs/ojarraytreedataprovider', 'ojs/ojkeyset', '../../core/runtime', '../page-definition/utils', '../../core/mutex'],
  function (ko, ArrayTreeDataProvider, keySet, Runtime, PageDefinitionUtils, Mutex) {
    // purge cache every n ms
    const CACHE_EXPIRY = 10000;

    function NavtreeManager(perspective) {

      this.mutex = new Mutex();

      this.groups = {};

      var self = this;

      this.perspective = perspective;

      this.treeData = ko.observableArray();

      this.jsonCache = {};
      this.nodeCache = {};

      this.jsonLoadTimes = {};

      this.initialized = false;

      // initialize the top-level tree.. Once it is initialized, make it visible
      // after a 450ms delay. this eliminates a temporary "No items to display" 
      // message that appears while the oj-navigation-list is initializing. 
      // https://jira.oraclecorp.com/jira/browse/JET-41067
      this.initPromise = this.populateNode('').then(() => {
        new Promise(resolve => setTimeout(resolve, 450)).then(() => {
          let n = document.getElementById("navtree");
          if (n !== null) n.style.visibility = "visible";
        });
      }
      ).then(() => { self.initialized = true; });
    }

    NavtreeManager.MAX_CHILDREN = 10;

    NavtreeManager.prototype = {
      constructor: NavtreeManager,

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
                groupPath = PageDefinitionUtils.pathEncodedFromIdentity(response.data.identity) + "/" + item.groupLabel;
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
                class: this.getIconClass({ type: "group" }),
                children: ko.observableArray([])
              };

              this.nodeCache[groupPath] = groupNode;
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
                    class: this.getIconClass({ type: "group" })
                  };

                  groupNode.children.push(groupChildNode);
                  groupNode.populated = true;
                  this.nodeCache[nestedGroupPath] = groupNode;
                  this.groups[nestedGroupPath] = g.contents;

                  g.contents.forEach(c => {
                    let node = {
                      label: PageDefinitionUtils.displayNameFromIdentity(c.identity),
                      kind: c.identity.kind,
                      path: PageDefinitionUtils.pathEncodedFromIdentity(c.identity),
                      breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(c.identity),
                      class: this.getIconClass({ type: c.identity.kind, parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(c.identity) }),
                      leaf: this.isLeaf(c)
                    };

                    if (!node.leaf) node.children = ko.observableArray([]);

                    this.nodeCache[node.path] = node;
                    groupChildNode.children.push(node);
                    groupChildNode.populated = true;
                  });
                } else {
                  let node = {
                    label: PageDefinitionUtils.displayNameFromIdentity(g.identity),
                    kind: g.identity.kind,
                    path: PageDefinitionUtils.pathEncodedFromIdentity(g.identity),
                    breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(g.identity),
                    class: this.getIconClass({ type: g.identity.kind, parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(g.identity) }),
                    leaf: this.isLeaf(g)
                  };

                  if (!node.leaf) { node.children = ko.observableArray([]); }
                  this.nodeCache[node.path] = node;

                  groupNode.children.push(node);
                  groupNode.populated = true;
                }
              }.bind(this));

              this.groups[groupPath] = { data: item.contents };
            } else if (typeof item.contents === "undefined") {
              let node = {
                label: PageDefinitionUtils.displayNameFromIdentity(item.identity),
                kind: item.identity.kind,
                path: PageDefinitionUtils.pathEncodedFromIdentity(item.identity),
                breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(item.identity),
                class: this.getIconClass({ type: item.identity.kind, parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(item.identity) }),
                leaf: this.isLeaf(item)
              };

              if (!node.leaf) { node.children = ko.observableArray([]); }
              this.nodeCache[node.path] = node;
              nodeList.push(node);
            }
          });
        } else if ("data" in response) {
          let data;

          if (Array.isArray(response.data)) data = response.data; else data = [response.data];

          data.forEach(item => {
            if (typeof item.Name !== 'undefined') {
              let label = (typeof item.Name.value === "undefined" ? item.Name : item.Name.value);
              let path = PageDefinitionUtils.pathEncodedFromIdentity(item.identity);
              let kind = item.identity.kind;
              // in an identity, if a segment is for a singleton, it won't have a key 
              if (kind.endsWith('Singleton')) {
                path += "/" + label;
              }

              let node = {
                kind: kind,
                path: path,
                breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(item.identity),
                label: label,
                class: this.getIconClass({ type: item.identity.kind, parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(item.identity) }),
                leaf: this.isLeaf(item)
              }
              if (!node.leaf) node.children = ko.observableArray([]);
              nodeList.push(node);
            } else {
              if (!item.groupLabel) {

                let node = {
                  label: PageDefinitionUtils.displayNameFromIdentity(item.identity),
                  kind: item.identity.kind,
                  path: PageDefinitionUtils.pathEncodedFromIdentity(item.identity),
                  breadcrumbs: PageDefinitionUtils.breadcrumbsFromIdentity(item.identity),
                  class: this.getIconClass({ type: item.identity.kind, parentProperty: PageDefinitionUtils.parentPropertyFromIdentity(item.identity) }),
                  leaf: this.isLeaf(item)
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
          let collections = node.children().find(child => child.kind === 'collection');
          let collectionCount = collections ? collections.length : 0;

          if (node.kind !== 'group' && collectionCount == 0) {
            if (node.children().length >= NavtreeManager.MAX_CHILDREN) {
              let slicedArray = node.children.slice(0, NavtreeManager.MAX_CHILDREN);
              node.children(slicedArray);
              node.children.push({ label: "...", name: "...", breadcrumbs: node.breadcrumbs, path: node.path + "/...", kind: "condensed" });
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
        return this.mutex.runExclusive(function () { return this._evictNode(path); }.bind(this));
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
        return new ArrayTreeDataProvider(this.treeData, { keyAttributes: 'path' });
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
        return this.mutex.runExclusive(function () {
          return this._getGroupContents(group);
        }.bind(this));
      },

      _getGroupContents: async function (group) {
        return this.groups[group].data;
      },


      /**
       * set and return redwood class for a given node
       * @param {*} node 
       */
      getIconClass: function (node) {
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
      },

      /**
      * Return models for the children (single-level) of a given path, as an array. 
      * Use an empty array to indicate there are no children
      *
      * @param {*} path 
      */
      getPathChildrenModels: async function (path) {
        let node = await this.getPathModel(path);

        let isRoot = path === '/' || path === '';

        return isRoot ? node() : node.children();
      },

      /**
       * get the model for a path.. because tree traversal is
       * iterative, fetch all the ancestor nodes too.. then pull from
       * node cache
       * 
       * @param {*} path 
       */
      getPathModel: async function (path) {
        await this.initPromise;

        let pathSegments = path.split("/");
        let workingPath = '';

        for (let i = 0; i < pathSegments.length; i++) {
          let pathSegment = pathSegments[i];
          workingPath += pathSegment;

          if (workingPath !== '/' && workingPath !== '') {
            await this.populateNode(workingPath);
          }
          workingPath += '/';
        }

        if (path === '/') return this.nodeCache[''];

        return this.nodeCache[path];
      },

      /**
       * Determine if a node is a leaf-node or may have children
       * 
       * @param {*} item object
       */
      isLeaf: function (item) {
        const kind = (typeof item.identity !== "undefined" && typeof item.identity.kind !== "undefined" ? item.identity.kind : "");
        if (kind === 'collection') {
          return false;
        }

        let leaf = true;

        // for non-collection, you need to get the RDJ
        // and see if it has child nav tree nodes
        // get the encoded path avoiding any confusion
        // with bean path names that require encoding
        //console.log(PageDefinitionUtils.pathSegmentsFromIdentity(item.identity));
        let path = PageDefinitionUtils.pathEncodedFromIdentity(item.identity);

        if (path !== "") {
          let url = Runtime.getBaseUrl() + "/" + this.perspective.id + "/data/" + path + "?properties="

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
      },


      expireCache: function(pathToExpand) {
        let p = Promise.resolve(1);

        if (pathToExpand in this.jsonLoadTimes) {
          let elapsed = Date.now() - this.jsonLoadTimes[pathToExpand];

          if (elapsed > CACHE_EXPIRY) {
            //console.log(`Navtree evicting '${pathToExpand}'`);
            p = p.then(this.evictNode(pathToExpand));
          }
        }

        return p;
      },

      /**
       * Query the cache or backend for an MBean (or group) and modify the observableArray 
       * backing the oj-navigation-list component by pushing the child nodes into the children
       * observableArray of the specified path. Called in response to a navigation-list-item being expanded.
       * 
       * @param {*} pathToExpand Path of node to populate (i.e. expand)
       */
      populateNode: function (pathToExpand) {
        return this.expireCache(pathToExpand).then(() => {
          return this.mutex.runExclusive(
            function () { return this._populateNode(pathToExpand); }.bind(this))
            .then(function () { return this.treeData.valueHasMutated(); }.bind(this))
        });
      },

      _populateNode: function (pathToExpand) {

        // check to see if the node has already been populated...
        if (pathToExpand in this.nodeCache) {
          if (this.nodeCache[pathToExpand].populated) {
            return Promise.resolve(1);
          }
          this.nodeCache[pathToExpand].populated = true;
        }

        // if it's a group look for the prefetched json
        if (pathToExpand in this.groups) {
          let json = this.groups[pathToExpand];

          this.addNodesToTree(pathToExpand, json);
          return Promise.resolve(1);
        }

        let baseUrl = Runtime.getBaseUrl() + "/" + this.perspective.id + "/data/";
        let url = baseUrl + pathToExpand + "?properties="

        if (!(pathToExpand in this.jsonCache)) {
          return $.getJSON({ url: url }).then(function (childrenJson) {
            this.jsonCache[pathToExpand] = childrenJson;
            this.jsonLoadTimes[pathToExpand] = Date.now();
            this.addNodesToTree(pathToExpand, childrenJson);
          }.bind(this)
          );
        } else {
          let childrenJson = this.jsonCache[pathToExpand];
          this.addNodesToTree(pathToExpand, childrenJson);
        }

        return Promise.resolve(1);
      },


      /**
       * populate a given set of paths
       * @param {Set} paths of nodes to populate 
       */
      populateNodeSet: function (nodes) {
        let promise = this.initPromise;

        nodes.values().forEach(n => {
          promise = promise.then((() => { promise = this.populateNode(n); }).bind(this));
        });

        return promise;
      }
    }
    return NavtreeManager;
  }
);
