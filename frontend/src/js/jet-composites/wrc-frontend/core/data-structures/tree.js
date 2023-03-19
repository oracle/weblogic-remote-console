/**
 Copyright (c) 2023, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define(['./tree-node', './queue'],
  function(TreeNode, Queue) {

    function Tree() {
      this.root = null;
    }

    function traverseDFS(traversalType) {
      //if there is no root, return false
      if (!this.root) {
        return false;
      }
      //make a variable for tree values
      const treeValues = [];
      //current values always starts at root
      let current = this.root;

      //helper methods for order choice
      const preOrderHelper = node => {
        //push value onto array FIRST
        treeValues.push(node.value);
        //recursively call function on all node children
        if (node.children.length !== 0) {
          node.children.forEach(child => {
            preOrderHelper(child);
          });
        }
        return true;
      };

      const postOrderHelper = node => {
        //recursively call function on all node children FIRST
        if (node.children.length !== 0) {
          node.children.forEach(child => {
            postOrderHelper(child);
          });
        }
        //push value onto array
        treeValues.push(node.value);
        return true;
      };

      const inOrderHelper = node => {
        //if node had children, split nodes into left and right halves in case tree is not binary FIRST
        if (node.children.length !== 0) {
          //get halfway point
          const halfway = Math.floor(node.children.length / 2);
          //recursively call function on all node children left of halfway point
          for (let i = 0; i < halfway; i++) {
            inOrderHelper(node.children[i]);
          }
          // push parent node value to array
          treeValues.push(node.value);
          //recursively call function on all node children right of halfway point
          for (let i = halfway; i < node.children.length; i++) {
            inOrderHelper(node.children[i]);
          }
          // else push value into array
        }
        else {
          treeValues.push(node.value);
        }
        return true;
      };

      // Use a switch statment to select proper order and
      // start recursive function calls
      switch (traversalType) {
        case 'PRE_ORDER':
          preOrderHelper(current);
          break;
        case 'POST_ORDER':
          postOrderHelper(current);
          break;
        case 'IN_ORDER':
          inOrderHelper(current);
          break;
      }

      //return array
      return treeValues;
    }

    function traverseBFS() {
      //if there is no root, return false
      if (!this.root) {
        return false;
      }
      //start a new Queue
      const queue = new Queue();
      //keep a tally of all values in the tree
      const treeValues = [];
      //add root to queue
      queue.enqueue(this.root);
      //while queue is not empty
      while (queue.size !== 0) {
        //get TreeNode Children
        const nodeChildren = queue.first.value.children;
        //if node has children, loop and add each to queue
        if (nodeChildren.length !== 0) {
          nodeChildren.forEach(child => queue.enqueue(child));
        }
        //push the first item in the queue to the tree values
        treeValues.push(queue.first.value);
        //remove first node from queue
        queue.dequeue();
      }
      //return values, should be all TreeNodes
      return treeValues;
    }

  //public:
    Tree.prototype = {
      TraversalMethod: Object.freeze({
        DepthFirst: 'DFS',
        BreadthFirst: 'BFS'
      }),
      TraversalType: Object.freeze({
        InOrder: 'IN_ORDER',
        PreOrder: 'PRE_ORDER',
        PostOrder: 'POST_ORDER'
      }),
      traverse: {
        depthFirst: (traversalType = Tree.prototype.TraversalType.InOrder) => {
          return traverseDFS.call(this, traversalType);
        },
        breadthFirst: () => {
          return traverseBFS.call(this);
        }
      }
    };

    // Return the class constructor
    return Tree;
  }
);
