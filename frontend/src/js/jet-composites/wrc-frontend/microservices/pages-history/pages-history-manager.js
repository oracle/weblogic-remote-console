/**
 * @license
 * Copyright (c) 2024,2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define([
    'wrc-frontend/microservices/page-definition/utils',
    'wrc-frontend/core/runtime'
  ],
  function(
    PageDefinitionUtils,
    Runtime
  ){
    let pagesHistoryData = {
      currentAction: 'bypass',   // 'route', 'navigate.back', 'navigate.next', 'navigate.to', 'bypass', 'cancel', 'integrate'
      current: null,
      positionSequence: -1,
      canNext: false,
      canBack: false,
      canLaunch: false,
      canBookmark: false,
      back: [],
      next: [],
      items: []
    };

    function getPagesHistoryItem(position) {
      let item;
      const index = pagesHistoryData.items.findIndex(item => item.position === position);
      if (index !== -1) {
        item = pagesHistoryData.items[index];
      }
      return item;
    }

    function getPagesHistoryPositionIndex(searchPosition) {
      return pagesHistoryData.items.findIndex(item => item.position === searchPosition);
    }

    function getPagesHistoryPositionData(searchPosition) {
      const result = {
        stack: null,
        index: -1
      };
      let index = pagesHistoryData.back.findIndex(position => position === searchPosition);
      if (index !== -1) {
        result.stack = 'back';
        result.index = index;
      }
      else {
        index = pagesHistoryData.next.findIndex(position => position === searchPosition);
        if (index !== -1) {
          result.stack = 'next';
          result.index = index;
        }
      }
      return result;
    }

    function verifyPagesHistoryCurrent(currentPosition) {
      const result = getPagesHistoryPositionData(currentPosition);
      if (result.stack !== null) {
        if (result.stack === 'back') {
          const removed = pagesHistoryData.back.splice(result.index, 1);
          pagesHistoryData.next.push(removed[0]);
        }
        else if (result.stack === 'next') {
          const removed = pagesHistoryData.next.splice(result.index, 1);
          pagesHistoryData.next = [...pagesHistoryData.next, ...removed];
        }
        pagesHistoryData.current = getPagesHistoryItem(pagesHistoryData.next.at(-1));
      }
      else if (pagesHistoryData.next.length > 0) {
        pagesHistoryData.current = getPagesHistoryItem(pagesHistoryData.next.at(-1));
      }
    }

    function truncatePagesHistory() {
      // Remove and save first item in items array
      const item = pagesHistoryData.items.shift();
      // Get position data for item.position
      const result = getPagesHistoryPositionData(item.position);
      if (result.stack !== null) {
        if (result.stack === 'back') {
          // Remove item.position from back stack
          pagesHistoryData.back = pagesHistoryData.back.filter(position => position !== item.position);
        }
        else if (result.stack === 'next') {
          // Remove item.position from next stack
          pagesHistoryData.next = pagesHistoryData.next.filter(position => position !== item.position);
        }
      }
    }

    function createPagesHistoryItem(pathParam, breadcrumbLabels, provider, perspective, sliceItem) {
      pagesHistoryData.positionSequence++;
      const newItem = {
        position: pagesHistoryData.positionSequence,
        value: pathParam,
        breadcrumbLabels: breadcrumbLabels,
        provider: {id: provider.id, type: provider.type},
        perspective: perspective
      };
      if (typeof sliceItem === 'undefined') {
        newItem['slice'] = {
          name: PageDefinitionUtils.getPathParamsTab(pathParam),
          level: 0
        };
      }
      else {
        newItem['slice'] = sliceItem;
      }
      pagesHistoryData.items.push(newItem);
      pagesHistoryData.next.push(newItem.position);

      pagesHistoryData.back = [];

      const newPosition = pagesHistoryData.next.at(-1);
      pagesHistoryData.current = getPagesHistoryItem(newPosition);

      if (pagesHistoryData.items.length > Runtime.getPagesHistoryMaxQueueSize()) {
        truncatePagesHistory();
      }
    }

  //public:
    return {
      addPagesHistoryItem: (pathParam, breadcrumbLabels, provider, perspective, sliceItem) => {
        if (pathParam && pathParam !== '' && pagesHistoryData.currentAction === 'route') {
          createPagesHistoryItem(pathParam, breadcrumbLabels, provider, perspective, sliceItem);
        }
      },
      deletePagesHistoryItem: (pathParam) => {
        function getPathParamSegment(pathParam) {
          const pathParamSegments = pathParam.split('/').filter(e => e);
          let pathParamSegment = `/${pathParamSegments.at(-1)}`;
          const match = pathParamSegment.match(/(.+)\?slice=.+/);
          if (match) pathParamSegment = match[1];
          return pathParamSegment;
        }

        let removedPagesHistoryItems = [];

        if (pathParam && pathParam !== '') {
          const pathSegment = getPathParamSegment(pathParam);
          removedPagesHistoryItems = pagesHistoryData.items.filter(item => item.value.indexOf(pathSegment) !== -1);
          removedPagesHistoryItems.forEach((item) => {
            pagesHistoryData.back = pagesHistoryData.back.filter(position => position !== item.position);
            pagesHistoryData.next = pagesHistoryData.next.filter(position => position !== item.position);
          });

          pagesHistoryData.items = pagesHistoryData.items.filter(item => item.value.indexOf(pathSegment) === -1);
          verifyPagesHistoryCurrent(pagesHistoryData.current.position);
        }
        return removedPagesHistoryItems;
      },
      resetPagesHistoryData: () => {
        pagesHistoryData.currentAction = 'bypass';
        pagesHistoryData.current = null;
        pagesHistoryData.positionSequence = -1;
        pagesHistoryData.canNext = false;
        pagesHistoryData.canBack = false;
        pagesHistoryData.canLaunch = false;
        pagesHistoryData.canBookmark = false,
        pagesHistoryData.back = [];
        pagesHistoryData.next = [];
        pagesHistoryData.items = [];
      },
      isBackAllowed: () => {
        return pagesHistoryData.canBack;
      },
      isNextAllowed: () => {
        return pagesHistoryData.canNext;
      },
      isLaunchAllowed: () => {
        return pagesHistoryData.canLaunch;
      },
      isBookmarkAllowed: () => {
        return pagesHistoryData.canBookmark;
      },
      getPagesHistoryData: () => {
        // Disable the "Back" and "Next" icons by default
        pagesHistoryData.canBack = false;
        pagesHistoryData.canNext = false;
        // Use length of items array to enable/disable the
        // "Launch" and "b=Bookmark: icons
        pagesHistoryData.canLaunch = (pagesHistoryData.items.length > 0);
        pagesHistoryData.canBookmark = (pagesHistoryData.items.length > 0);

        // Only need to override the default state of the
        // "Back" and "Next" icons, if the next stack isn't
        // empty.

        if (pagesHistoryData.next.length > 0) {
          // The next stack has at least 1 element, but we
          // need there to be at lest 2 to enable it.
          pagesHistoryData.canBack = (pagesHistoryData.next.length > 1);

          // Check if top last element of the next stack is
          // equal to the value of positionSequence

          if (pagesHistoryData.next.at(-1) !== pagesHistoryData.positionSequence) {
            // It is, so enable the "Next" icon based on whether
            // the back stack isn't empty.
            pagesHistoryData.canNext = (pagesHistoryData.back.length > 0);
          }
          else {
            // It isn't. so enable the "Next" icon based on whether
            // the back stack isn't empty.
            pagesHistoryData.canNext = (pagesHistoryData.back.length > 0);
          }
        }

        return pagesHistoryData;
      },
      getPagesHistoryCurrentItem: () => {
        return pagesHistoryData.current;
      },
      findPagesHistoryItems: (pathParam) => {
        return pagesHistoryData.items.filter(item => item.value === pathParam);
      },
      getPagesHistoryCurrentAction: () => {
        return pagesHistoryData.currentAction;
      },
      setPagesHistoryCurrentAction: (value = 'bypass') => {
        pagesHistoryData.currentAction = (['route', 'navigate.back', 'navigate.next', 'navigate.to', 'bypass', 'cancel', 'integrate'].includes(value) ? value: 'bypass');
      },
      performNavigateBackAction: () => {
        if (pagesHistoryData.currentAction === 'navigate.back') {
          if (pagesHistoryData.next.length > 1) {
            const position = pagesHistoryData.next.pop();
            if (typeof position !== 'undefined') {
              pagesHistoryData.back.push(position);
              const currentPosition = pagesHistoryData.next.at(-1);
              pagesHistoryData.current = getPagesHistoryItem(currentPosition);
            }
          }
        }
        return pagesHistoryData.current;
      },
      performNavigateNextAction: () => {
        if (pagesHistoryData.currentAction === 'navigate.next') {
          if (pagesHistoryData.back.length > 0) {
            const position = pagesHistoryData.back.pop();
            if (typeof position !== 'undefined') {
              pagesHistoryData.next.push(position);
            }
            const currentPosition = pagesHistoryData.next.at(-1);
            pagesHistoryData.current = getPagesHistoryItem(currentPosition);
          }
        }
        return pagesHistoryData.current;
      },
      performNavigateToAction: (newPosition) => {
        if (pagesHistoryData.currentAction === 'navigate.to') {
          const result = getPagesHistoryPositionData(newPosition);
          if (result.stack === null) {
            // Means that newPosition was in the back stack, but
            // addPagesHistoryItem cleared it out. We handle this
            // by pushing newPosition onto the next stack.
            pagesHistoryData.next.push(newPosition);
          }
          else {
            if (result.stack === 'back') {
              // Remove newPosition from back stack
              const removed = pagesHistoryData.back.splice(result.index, 1);
              // Push newPosition onto next stack
              pagesHistoryData.next.push(removed[0]);
            }
            else if (result.stack === 'next') {
              // Remove newPosition from wherever it
              // was in the next stack
              const removed = pagesHistoryData.next.splice(result.index, 1);
              // Push newPosition onto next stack
              pagesHistoryData.next = [...pagesHistoryData.next, ...removed];
            }
          }
          // Make newPosition the current item
          pagesHistoryData.current = getPagesHistoryItem(newPosition);
        }
        // Return the current item
        return pagesHistoryData.current;
      },
      performIntegrateAction: (bookmark) => {
        if (pagesHistoryData.currentAction === 'integrate') {
          createPagesHistoryItem(bookmark.value, bookmark.breadcrumbLabels, bookmark.provider, bookmark.perspective, bookmark.slice);
        }
        // Return the current item
        return pagesHistoryData.current;
      }

    };

  }

);