/**
 Copyright (c) 2023, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

/**
 * @example
 * // DFS, IN_ORDER
 * let binaryTree = new BinaryTree(6);
 * console.log(`[BINARY_TREE] root.val=${binaryTree.root.val}`);
 * binaryTree.insert(4);
 * binaryTree.insert(9);
 * binaryTree.insert(5);
 * binaryTree.insert(2);
 * binaryTree.insert(8);
 * binaryTree.insert(12);
 * binaryTree.print(binaryTree.root, BinaryTree.prototype.TraversalType.InOrder);
 *
 * // DFS, PRE_ORDER
 * binaryTree = new BinaryTree(6);
 * console.log(`[BINARY_TREE] root.val=${binaryTree.root.val}`);
 * binaryTree.insert(4);
 * binaryTree.insert(9);
 * binaryTree.insert(5);
 * binaryTree.insert(2);
 * binaryTree.insert(8);
 * binaryTree.insert(12);
 * binaryTree.insert(10);
 * binaryTree.insert(14);
 * binaryTree.print(binaryTree.root, BinaryTree.prototype.TraversalType.PreOrder);
 *
 * // DFS, POST_ORDER
 * binaryTree = new BinaryTree(6);
 * console.log(`[BINARY_TREE] root.val=${binaryTree.root.val}`);
 * binaryTree.insert(4);
 * binaryTree.insert(9);
 * binaryTree.insert(5);
 * binaryTree.insert(2);
 * binaryTree.insert(8);
 * binaryTree.insert(12);
 * binaryTree.print(binaryTree.root, BinaryTree.prototype.TraversalType.PostOrder);
 */
define(['./tree', './tree-node'],
  function(Tree, TreeNode) {
    function BinaryTreeNode(value) {
      let _node = new TreeNode(value);
      _node.children.push(null);
      _node.children.push(null);

      this.leftChild = (val) => {
        if (typeof val !== 'undefined') {
          _node.children[0] = val;
        }
        return _node.children[0];
      };
      this.rightChild = (val) => {
        if (typeof val !== 'undefined') {
          _node.children[1] = val;
        }
        return _node.children[1];
      };
    }

    function BinaryTree(rootValue) {
      Tree.call(this, rootValue);

      BinaryTree.prototype = Object.create(Tree.prototype);

      this.root = new BinaryTreeNode(rootValue);
    }

    function insert(currentNode, newValue) {
      if (currentNode === null) {
        currentNode = new BinaryTreeNode(newValue);
      }
      else if (newValue < currentNode.val) {
        currentNode.leftChild(insert(currentNode.leftChild(), newValue));
      }
      else {
        currentNode.rightChild(insert(currentNode.rightChild(), newValue));
      }

      return currentNode;
    }

  //public:
    BinaryTree.prototype = {
      insert: (newValue) => {
        if (this.root == null){
          this.root = new BinaryTreeNode(newValue);
          return;
        }

        insert.call(this, this.root, newValue);
      },
      print: (currentNode, traversalType = BinaryTree.prototype.TraversalType.InOrder) => {
        if (typeof currentNode !== 'undefined' && currentNode !== null) {
          switch(traversalType) {
            case 'IN_ORDER':
              this.print(currentNode.leftChild(), traversalType);
              console.log(`[BINARY_TREE] traversalType=${traversalType}, currentNode.val=${currentNode.val}`);
              this.print(currentNode.rightChild(), traversalType);
              break;
            case 'PRE_ORDER':
              console.log(`[BINARY_TREE] traversalType=${traversalType}, currentNode.val=${currentNode.val}`);
              this.print(currentNode.leftChild(), traversalType);
              this.print(currentNode.rightChild(), traversalType);
              break;
            case 'POST_ORDER':
              this.print(currentNode.leftChild(), traversalType);
              this.print(currentNode.rightChild(), traversalType);
              console.log(`[BINARY_TREE] traversalType=${traversalType}, currentNode.val=${currentNode.val}`);
              break;
          }
        }
      }
    };

    // Return the class constructor
    return BinaryTree;
  }
);
