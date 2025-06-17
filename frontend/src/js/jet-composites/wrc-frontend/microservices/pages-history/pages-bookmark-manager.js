/**
 * @license
 * Copyright (c) 2025, Oracle and/or its affiliates.
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
      const FailureReason = Object.freeze({
        PAGE_ALREADY_BOOKMARKED: {name: 'PAGE_ALREADY_BOOKMARKED'},
        INVALID_BOOKMARK: {name: 'INVALID_BOOKMARK'}
      });

      let pagesBookmarkData = {
        bookmarks: []
      };

      function getBookmarkSearchFragment(bookmark) {
        const searchFragment = {value: null, slice: ''};
        if (bookmark?.value && bookmark?.value !== '') {
          const pathSegments = bookmark.value.split('/').filter(e => e);
          if (pathSegments.length > 2) searchFragment.value = pathSegments.slice(2).join('/');
          if (bookmark.slice.name !== '') searchFragment.slice = bookmark.slice.name;
        }
        return searchFragment;
      }

      /**
       *
       * @param {{value: string, slice: string}} searchFragment
       * @returns {{failureReason?: boolean, index: number}}
       * @private
       */
      function findBookmarkSearchFragment(searchFragment) {
        const results = {index: -1};
        if (searchFragment.value) {
          results.index = pagesBookmarkData.bookmarks.findIndex(item => item.value.endsWith(searchFragment.value) && item.slice.name === searchFragment.slice);
          if (results.index !== -1) results['failureReason'] = FailureReason.PAGE_ALREADY_BOOKMARKED;
        }
        else {
          results['failureReason'] = FailureReason.INVALID_BOOKMARK;
        }
        return results;
      }

      /**
       * @param {{value: string, slice: string}} searchFragment1
       * @param {{value: string, slice: string}} searchFragment2
       * @returns {{failureReason?: boolean, matched: boolean}}
       * @private
       */
      function matchBookmarkSearchFragments(searchFragment1, searchFragment2) {
        const results = {matched: false};
        if (searchFragment1.value !== null && searchFragment2.value !== null) {
          results.matched = (searchFragment1.value === searchFragment2.value && searchFragment1.slice === searchFragment2.slice)
        }
        else {
          results['failureReason'] = FailureReason.INVALID_BOOKMARK;
        }
        return results;
      }

      function updateBookmarkValueProviderId(data, provider) {
        if (data?.bookmarks) {
          let wasUpdated = (data.bookmarks.length === 0);
          data.bookmarks.forEach((bookmark, index) => {
            if (provider?.id && bookmark?.provider?.id) {
              wasUpdated = true;
              if (bookmark.provider.id !== provider.id) {
                const pathSegments = bookmark.value.split('/').filter(e => e);
                pathSegments[1] = provider.id;
                data.bookmarks[index].provider.id = provider.id;
                data.bookmarks[index].value = `/${pathSegments.join('/')}`;
              }
            }
          });
          if (wasUpdated) {
            pagesBookmarkData.bookmarks = [...data.bookmarks];
          }
        }
      }

    //public:
      return {
        FailureReason: FailureReason,
        getPagesBookmarkData: (provider) => {
          const data = {
            bookmarks: pagesBookmarkData.bookmarks.filter(bookmark => bookmark.provider.type === provider.type)
          };
          return data;
        },
        setPagesBookmarkData: (data, provider) => {
          updateBookmarkValueProviderId(data, provider);
        },
        getPagesBookmarkByIndex: (index) => {
          let bookmark;
          if (index > -1 && index < pagesBookmarkData.bookmarks.length) {
            bookmark = pagesBookmarkData.bookmarks[index];
          }
          return bookmark;
        },
        getPagesBookmarkByValue: (value) => {
          return pagesBookmarkData.bookmarks.find(item => item.value === value);
        },
        getAppliedPageBookmarks: (deleted_bookmarks_values) => {
          let applied_bookmarks = [];
          if (deleted_bookmarks_values.length === 0) {
            applied_bookmarks = [...pagesBookmarkData.bookmarks];
          }
          else {
            pagesBookmarkData.bookmarks.forEach((bookmark) => {
              for (const value of deleted_bookmarks_values) {
                if (!deleted_bookmarks_values.includes(bookmark.value)) {
                  applied_bookmarks.push(bookmark);
                }
              }
            });
          }
          return applied_bookmarks;
        },
        hasPagesBookmark: (bookmark) => {
          let index = -1;
          if (bookmark) {
            const searchFragment = getBookmarkSearchFragment(bookmark);
            index = pagesBookmarkData.bookmarks.findIndex(item => item.provider.type === bookmark.provider.type && item.value.endsWith(searchFragment.value) && item.slice.name === searchFragment.slice);
          }
          return (index !== -1);
        },
        removePagesBookmark: (bookmark) => {
          const removeResults = {succeeded: false};
          const searchFragment1 = getBookmarkSearchFragment(bookmark);
          if (searchFragment1.value !== null) {
            const filtered = [];
            pagesBookmarkData.bookmarks.forEach((item) => {
              const searchFragment2 = getBookmarkSearchFragment(item);
              const matchResults = matchBookmarkSearchFragments(searchFragment1, searchFragment2);
              if (matchResults.matched) {
                filtered.push(item);
                removeResults.succeeded = true;
              }
            });
            if (removeResults.succeeded) {
              pagesBookmarkData.bookmarks = [...filtered];
            }
          }
          return removeResults;
        }

      };
    }

);