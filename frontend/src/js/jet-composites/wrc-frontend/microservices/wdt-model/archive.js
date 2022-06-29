/**
 * @license
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['knockout', 'ojs/ojlogger'],
  function(ko, Logger) {
    function ModelArchive(archiveRoots, entryTypes) {
      this.archiveRoots = archiveRoots;
      this.entryTypes = entryTypes;
    }

    /**
     * Add the archive entry to the model, so it will be displayed in the tree.
     * @param {string} archivePath
     * @param {object} leafEntryType
     * @param {any} leafChildPaths
     * @private
     */
    function addToArchiveModel(archivePath, leafEntryType, leafChildPaths) {
      const pathNames = archivePath.split('/');
      const leafIsDir = ['dir', 'emptyDir'].includes(leafEntryType.subtype);
      addToArchiveFolder.call(this, pathNames, 0, this.archiveRoots, leafIsDir, leafChildPaths);
    }

    /**
     * Add the path member to the specified entry list in the archive model tree.
     * <p>if already present, recurse to the next path member and list if needed.</p>
     * <p>if not present, add the path member and recurse with an empty list if needed.</p>
     * @param {*} pathNames
     * @param {*} memberIndex
     * @param {*} entryList
     * @param {*} leafIsDir
     * @param {*} leafChildPaths
     * @private
     */
    function addToArchiveFolder(pathNames, memberIndex, entryList, leafIsDir, leafChildPaths) {
      const thisMember = pathNames[memberIndex];

      let matchEntry = false;
      for (let entry of entryList()) {
        if(entry['title'] === thisMember) {
          matchEntry = entry;
          break;
        }
      }

      const isLeaf = memberIndex === pathNames.length - 1;
      let children = null;

      if(matchEntry) {
        // entry exists in tree
        children = matchEntry['children'];

      } else {
        // idPath is a unique key for the tree element, and the path used for subsequent archive operations
        let idPath = pathNames.slice(0, memberIndex + 1).join('/');

        // this path member is a directory if it is not the leaf, or the leaf is a directory type
        const isDir = !isLeaf || leafIsDir;

        // if this is a directory, append / to the path and add children list.
        // the children list will make it render as a folder, even if no children are added.
        if (isDir) {
          idPath = idPath + '/';
          children = ko.observableArray();
        }
        entryList.push({id: idPath, title: thisMember, children: children});

        if(isLeaf) {
          addLeafChildPaths.call(this, idPath, leafChildPaths);
        }
      }

      if(!isLeaf) {
        // add the next name in the path to the children list
        addToArchiveFolder.call(this, pathNames, memberIndex + 1, children, leafIsDir, leafChildPaths);
      }
    }

    /**
     * If the new entry is a directory, the result may include it's child files and folders, so add those to the tree.
     * <p>they don't need archive update entries for save.</p>
     * @param {*} parentPath
     * @param {*} leafChildPaths
     * @private
     */
    function addLeafChildPaths(parentPath, leafChildPaths) {
      if(leafChildPaths) {
        for (const leafPath of leafChildPaths) {
          let fullPath = parentPath + leafPath;
          let leafIsDir = false;
          if(fullPath.endsWith('/')) {
            fullPath = fullPath.slice(0, -1);
            leafIsDir = true;
          }
          const pathNames = fullPath.split('/');
          const childList = this.archiveRoots;
          addToArchiveFolder.call(this, pathNames, 0, childList, leafIsDir, null);
        }
      }
    }

    /**
     *
     * @param {string} id
     * @param {*} list
     * @param {object} branches
     * @returns string[]}
     * @private
     */
    function deleteBranchesIfEmpty(id, list, branches) {
      const paths = [], removable = [];
      if (id !== 'null' && id.startsWith('wlsdeploy/')) {
        let delimPos = id.lastIndexOf('/');
        while (delimPos !== -1) {
          paths.push(id.substring(0, delimPos + 1));
          removable.push(id.substring(0, delimPos + 1));
          delimPos = id.lastIndexOf('/', delimPos - 1);
        }
      }

      for (const i in removable) {
        if (branches[removable[i]] && branches[removable[i]].children && branches[removable[i]].children().length === 0) {
          deleteArchiveNode(removable[i], list, {});
        }
        else {
          const index = paths.indexOf(removable[i]);
          if (index !== -1) paths.splice(index, 1);
        }
      }
      return paths;
    }

    /**
     *
     * @param {string} id
     * @param {*} list
     * @param {object} branches
     * @private
     */
    function deleteArchiveNode(id, list, branches) {
      for (let item of list()) {
        if (item.id === id || (item.id !== 'wlsdeploy/' && item.id === `${id}/`)) {
          list.remove(item);

          // this shouldn't be required, but resolves tree view problems with emptied lists
          list.sort();
          break;
        }

        const children = item['children'];
        if (children) {
          branches[item.id] = item;
          deleteArchiveNode(id, children, branches);
        }
      }
    }

    //public:
    ModelArchive.prototype = {
      /**
       *
       * @param {object} result
       * @param {object} entryType
       */
      addToArchive: function (result, entryType) {
        if (this.archiveRoots) {
          addToArchiveModel.call(this, result.archivePath, entryType, result.childPaths);
        }
      },
      /**
       *
       * @param {string} id
       * @returns string[]}
       */
      removeFromArchive: function (id) {
        let paths = [id];
        if (this.archiveRoots) {
          const branches = {};
          deleteArchiveNode.call(this, id, this.archiveRoots, branches);
          if (Object.keys(branches).length > 0) {
            paths = [...paths, ...deleteBranchesIfEmpty.call(this, id, this.archiveRoots, branches)];
          }
        }
        return paths;
      }
    };

    // Return ModelArchive constructor function
    return ModelArchive;
  }
);