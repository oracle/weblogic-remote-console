/**
 Copyright (c) 2023, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/
 */

'use strict';

define(['./queue-node'],
  function(QueueNode) {

    function Queue() {
      this.first = null;
      this.last = null;
      this.size = 0;

      return {
        enqueue: (value) => {
          // newnode goes to back of the line/end of the queue
          const newNode = new QueueNode(value);
          //if queue is empty
          if (this.size === 0) {
            this.first = newNode;
            this.last = newNode;
            // add current first pointer to new first(new node), and make new node new first
          }
          else {
            this.last.next = newNode;
            this.last = newNode;
          }
          //add 1 to size
          this.size++;

          return this;
        },
        dequeue: () => {
          //if queue is empty return false
          if (this.size === 0) return false;
          //get dequeuedNode
          const dequeuedNode = this.first;
          //get new first (could be NULL if stack is length 1)
          const newFirst = this.first.next;
          //if newFirst is null, reassign last to newFirst(null)
          if (!newFirst) {
            this.last = newFirst;
          }
          //assign new first
          this.first = newFirst;
          //remove reference to list
          dequeuedNode.next = null;
          //remove 1 from size
          this.size--;
          //return dequeuednode
          return dequeuedNode;
        },
        entries: () => {
          let i = 0, currentNode = this.first;
          const arr = [];
          while (currentNode) {
            arr.push({
              index: i,
              current: currentNode.value
            });
            i++;
            currentNode = currentNode.next;
          }
          return arr;
        }
      };
    }

    // Return the class constructor
    return Queue;
  }
);
