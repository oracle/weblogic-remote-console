/**
 Copyright (c) 2022,2023, Oracle and/or its affiliates.
 Licensed under The Universal Permissive License (UPL), Version 1.0
 as shown at https://oss.oracle.com/licenses/upl/

 */
'use strict';

/**
 * @typedef {{direction: 'moveup'|'movedown'|'moveout', before: {uid: string, parentUid: string}, after: {uid: string, parentUid: string}}} Movement
 * @type {Movement}
 * @typedef {{uid: string, parentUid: string}} CheckedItems
 * @type {CheckedItems}
 * @typedef {{type: 'above'|'below'|'at', checkedItem: {uid: string, parentUid: string}, addedItem?: {uid: string, parentUid: string}, operator?: 'or'|'and'|undefined}} Insertion
 * @type {Insertion}
 * @typedef {{value: string, array: boolean, displayName: string, descriptionHTML: string}} Argument
 * @type {Argument}
 * @typedef {{uid: string, parentUid: string, operator: 'none'|'and'|'or', expression: string, options: {negated: boolean, combined: boolean, insertion?: Insertion},children?:[PolicyCondition],predicate: {name: string,arguments:[Argument],descriptionHTML: string,displayName: string}}} PolicyCondition
 * @type {PolicyCondition}
 * @typedef {[{before: {uid: string, parentUid: string}, after: {uid: string, parentUid: string}}]} RecomputedUids
 * @type {RecomputedUids}
 */
define(['knockout', 'ojs/ojarraydataprovider', 'ojs/ojarraytreedataprovider', 'ojs/ojflattenedtreedataproviderview', 'ojs/ojlistdataproviderview', 'ojs/ojknockout-keyset', 'ojs/ojkeyset', './wizard/policy-editor-wizard', 'wrc-frontend/microservices/policy-management/condition-phraser', 'wrc-frontend/apis/message-displaying', 'wrc-frontend/integration/viewModels/utils', 'wrc-frontend/core/utils', 'ojs/ojtable', 'ojs/ojselector', 'ojs/ojselectsingle', 'ojs/ojselectcombobox', 'ojs/ojrowexpander'],
  function (ko, ArrayDataProvider, ArrayTreeDataProvider, FlattenedTreeDataProviderView, ListDataProviderView, keySet, ojkeyset_1, PolicyEditorWizard, ConditionPhraser, MessageDisplaying, ViewModelUtils,  CoreUtils) {

    function PolicyEditorViewModel(context) {
      const self = this;

      this.i18n = {
        labels: {
          nodata: ko.observable()
        },
        messages: {
          conditionHasNoArgValues: {summary: ko.observable()}
        },
        contextMenus: {
          action: {
            at: {id: 'at', label: ko.observable()},
            above: {id: 'above', label: ko.observable()},
            below: {id: 'below', label: ko.observable()}
          }
        },
        wizard: {
          title: ko.observable(),
          buttons: {
            ok: {
              disabled: ko.observable(false),
              label: 'OK'
            },
            cancel: {
              disabled: false,
              label: 'Cancel'
            }
          }
        }
      };

      this.actionItems = {
        disabled: {
          above: ko.observable(true),
          below: ko.observable(true),
          combine: ko.observable(true),
          uncombine: ko.observable(true),
          moveup: ko.observable(true),
          movedown: ko.observable(true),
          remove: ko.observable(true),
          negate: ko.observable(true)
        },
      };

      this.responseMessage = ko.observable('');

      this.fieldValueChanged = undefined;
      this.readOnly = ko.observable(context.properties.readonly);

      this.wizardPageModuleConfig = ko.observable({view: [], viewModel: null});

      this.operatorLegalValues = new ArrayDataProvider(
        context.properties.operatorLegalValues.filter(value => value !== 'none'),
        {keyAttributes: 'value'}
      );

      this.tableColumnHeaders = context.properties.tableColumnHeaders;

      this.expandedSet = new ojkeyset_1.KeySetImpl();
      this.checkedSet = new ojkeyset_1.KeySetImpl();
      this.supportedPredicatesList = [];
      /**
       *
       * @type {[PolicyCondition]}
       */
      this.policyConditions = ko.observableArray([
        {uid: '0', operator: 'none', expression: ''}
      ]);
      this.arrayTreeDataProvider = new ArrayTreeDataProvider(
        this.policyConditions,
        {keyAttributes: 'uid'}
      );
      this.policyConditionsDataProvider = ko.observable();
      this.flattenedPolicyConditions = [];

      this.selectedRows = new keySet.ObservableKeySet();

      function getDataProvider() {
        self.arrayTreeDataProvider = new ArrayTreeDataProvider(
          self.policyConditions,
          {keyAttributes: 'uid'}
        );
        if (CoreUtils.isUndefinedOrNull(self.policyConditionsDataProvider())) {
          return new FlattenedTreeDataProviderView(self.arrayTreeDataProvider);
        }
        else {
          return self.policyConditionsDataProvider();
        }
      }

      function getAllCombined() {
        return self.flattenedPolicyConditions.filter(condition => condition.options.combined).map((condition) => {
          return { uid: condition.uid, parentUid: condition.parentUid};
        });
      }

      function expandAllCombined() {
        const combined = getAllCombined();
        const combinedUids = combined.map(({uid}) => uid);

        if (combinedUids.length > 0) {
          self.policyConditionsDataProvider().setExpanded(self.expandedSet.add(combinedUids));
        }
      }

      function triggerCheckedValueChangedEvent() {
        const fauxEvent = {
          target: {
            rowKey: '0'
          },
          detail: {
            value: new Set()
          }
        };
        self.checkedValueChanged(fauxEvent);
      }

      function handleAddConditionActionResults(results, action) {
        const dispatchPolicyConditionAddedEvent = (action, policyCondition) => {
          const params = {
            'bubbles': true,
            'detail': {
              'notification': {
                action: action
              },
              'target': policyCondition
            }
          };
          context.element.dispatchEvent(new CustomEvent(action.event, params));
        };

        if (results.succeeded) {
          let uid = 0, parentUid = -1, recomputedUids = [];
          getRecomputedUids(self.policyConditions(), results.data.policyCondition.options.insertion, uid, parentUid, recomputedUids);
          setInsertionParentExpressionType(results.data.policyCondition);
          dispatchPolicyConditionAddedEvent(action, results.data.policyCondition);
        }
      }

      function handleEditConditionActionResults(results, action) {
        const dispatchPolicyConditionModifiedEvent = (action, policyCondition) => {
          const params = {
            'bubbles': true,
            'detail': {
              'notification': {
                action: action
              },
              'target': policyCondition
            }
          };
          context.element.dispatchEvent(new CustomEvent(action.event, params));
        };

        if (results.succeeded) {
          dispatchPolicyConditionModifiedEvent(
            action,
            results.data.policyCondition
          );
        }
      }

      function setInsertionParentExpressionType(policyCondition) {
        policyCondition.options.insertion['parentExpression'] = {
          type: (['at','above','below'].includes(policyCondition.options.insertion.type) ? 'or' : 'and')
        };
        const uid = getLastSiblingsPolicyConditionUid(policyCondition.parentUid);
        // uid will be undefined if there is nothing in the
        // self.flattenedPolicyConditions array. We know
        // the policy condition being added will be the
        // only sibling, so we can just set operator to
        // undefined.
        if (CoreUtils.isUndefinedOrNull(uid) ||
          (~~policyCondition.options.insertion.addedItem.uid >= ~~uid)
        ) {
          policyCondition.operator = undefined;
        }
      }

      function getLastSiblingsPolicyConditionUid(parentUid) {
        let uid;
        if (self.flattenedPolicyConditions.length > 0) {
          const filtered = self.flattenedPolicyConditions.filter(policyCondition => policyCondition.parentUid === parentUid);
          if (filtered.length > 0) {
            uid = filtered.at(-1).uid;
          }
        }
        return uid;
      }

      function setResponseMessageVisibility(visible) {
        const div = document.getElementById('wizard-response-message');
        if (div !== null) {
          div.style.display = (visible ? 'inline-flex' : 'none');
        }
      }

      function displayFailureMessage(failureMessage) {
        setResponseMessageVisibility(true);
        self.responseMessage(`<p>${failureMessage}</p>`);
      }

      function clearFailureMessage() {
        self.responseMessage('<p></p>');
        setResponseMessageVisibility(false);
      }

      function disableAllActions(actionItems) {
        const disabled = {};

        disabled['above'] = true;
        disabled['below'] = true;
        disabled['combine'] = true;
        disabled['uncombine'] = true;
        disabled['moveup'] = true;
        disabled['movedown'] = true;
        disabled['remove'] = true;
        disabled['negate'] = true;

        const params = {
          'bubbles': true,
          'detail': {
            'notification': {
              type: 'isChecked',
              value: false,
              disabled: disabled,
              actionItems: actionItems
            }
          }
        };

        context.element.dispatchEvent(new CustomEvent('conditionCheckedChanged', params));
      }

      this.propertyChanged = function (context) {
        if (context.property === 'readonly') {
          const propertyValue = context.value || false;
          if (propertyValue) {
            self.readOnly(propertyValue);
            disableAllActions(self.actionItems);
          }
        }
      };

      function editPolicyCondition(action, policyCondition, failureMessage) {
        function updatePredicateArguments(predicate) {
          if (CoreUtils.isNotUndefinedNorNull(predicate['arguments']) &&
            (predicate['arguments'].length > 0)
          ) {
            const predicatesList = self.supportedPredicatesList.find(item => item.value === predicate.name);
            if (CoreUtils.isNotUndefinedNorNull(predicatesList)) {
              for (const i in predicate['arguments']) {
                const entry = predicatesList['arguments'].find(item => item.displayName === predicate['arguments'][i].displayName);
                if (CoreUtils.isNotUndefinedNorNull(entry)) {
                  predicate['arguments'][i]['type'] = entry.type || 'string';
                  predicate['arguments'][i]['placeholder'] = entry.placeholder || '';
                }
              }
            }
          }
        }

        // Value for editorAction will either be
        // 'addCondition' or 'editCondition'.
        const viewParams = {
          editorAction: action.id,
          i18n: context.properties.i18n,
          data: {
            supportedPredicatesList: self.supportedPredicatesList,
            policyCondition: policyCondition
          },
          displayFailureMessage: displayFailureMessage,
          clearFailureMessage: clearFailureMessage
        };

        updatePredicateArguments(policyCondition.predicate);

        if (action.id === 'addCondition') {
          PolicyEditorWizard.startWizard('manage-argument-values', self.wizardPageModuleConfig, viewParams)
            .then(results => {
              handleAddConditionActionResults(results, action);
            });
        }
        else if (action.id === 'editCondition') {
          if (CoreUtils.isNotUndefinedNorNull(policyCondition.predicate['arguments']) &&
            (policyCondition.predicate['arguments'].length > 0)
          ) {
            PolicyEditorWizard.startWizard('manage-argument-values', self.wizardPageModuleConfig, viewParams)
              .then(results => {
                  handleEditConditionActionResults(results, action);
              });
          }
          else {
            MessageDisplaying.displayMessage({
              severity: 'info',
              summary: self.i18n.messages.conditionHasNoArgValues.summary()
            }, 2500);
          }
        }

        // Unselect the row that's currently selected.
        // If we don't do that, then the selected
        // changed event won't re-fire when the user
        // clicks the same row.
        self.selectedRows(null);

      }

      this.policyConditionsSelectedChanged = (event) => {
        if (event.type === 'selectedChanged'&&
          event.detail.value.row !== null &&
          event.detail.value.row?.values()?.size > 0 &&
          !context.properties.readonly
        ) {
          const uid = Array.from(event.detail.value.row.values())[0];
          // Create a deep copy from self.flattenedPolicyConditions[~~uid]
          const policyCondition = JSON.parse(JSON.stringify(self.flattenedPolicyConditions[~~uid]));

          if (!policyCondition.options.combined) {
            const action = {
              id: 'editCondition',
              event: 'policyConditionModified'
            };
            editPolicyCondition(action, policyCondition);
          }
        }

      };

      this.operatorValueChanged = (event) => {
        const dispatchPolicyConditionModifiedEvent = (policyCondition, previousValue, newValue) => {
          const params = {
            'bubbles': true,
            'detail': {
              'notification': {
                action: {
                  id: 'operatorValueChanged',
                  event: 'policyConditionModified'
                },
                previousValue: previousValue,
                value: newValue
              },
              'target': policyCondition
            }
          };
          context.element.dispatchEvent(new CustomEvent('policyConditionModified', params));
        };

        const uid = event.target.attributes['data-uid'].value;
        const policyCondition = JSON.parse(JSON.stringify(self.flattenedPolicyConditions[~~uid]));
        policyCondition.operator = event.detail.value;
        dispatchPolicyConditionModifiedEvent(policyCondition, event.detail.previousValue, event.detail.value);
      };

      this.addPolicyCondition = (policyCondition, recomputedUids) => {
        let uid = 0, data = JSON.parse(JSON.stringify(self.policyConditions()));

        self.setPolicyConditions(data);

        triggerCheckedValueChangedEvent.call(this);
      };

      /**
       *
       * @returns {[CheckedItems]|[]}
       */
      this.getCheckedPolicyConditionUids = () => {
        return self.flattenedPolicyConditions.filter(item => item.checked().length > 0).map((policyCondition) => {
          return {uid: policyCondition.uid, parentUid: policyCondition.parentUid};
        });
      };

      /**
       *
       * @param {[{PolicyCondition}]|[]} policyConditions
       * @param {Insertion} insertion
       * @param {number} uid
       * @param {number} parentUid
       * @param {RecomputedUids} recomputedUids
       */
      const getRecomputedUids = (policyConditions, insertion, uid, parentUid, recomputedUids) => {
        function getAddedItem(uid, parentUid) {
          const addedItem = {uid: uid, parentUid: parentUid, isFirstSibling: (uid === '0')};
          if ((~~uid - 1) >= 0) {
            addedItem.isFirstSibling = self.flattenedPolicyConditions[(~~uid - 1)].options.combined;
          }
          return addedItem;
        }

        let children = [];
        if (policyConditions.length > 0) {
          return policyConditions.map((child) => {
            if (~~child.uid === ~~insertion.checkedItem.uid) {
              switch (insertion.type) {
                case 'at':
                  recomputedUids.push({
                    before: {uid: child.uid, parentUid: child.parentUid},
                    after: {uid: '' + uid, parentUid: child.parentUid}
                  });
                  insertion['addedItem'] = getAddedItem('' + uid, child.parentUid);
                  break;
                case 'above':
                  recomputedUids.push({
                    before: {uid: '-1', parentUid: child.parentUid},
                    after: {uid: insertion.checkedItem.uid, parentUid: insertion.checkedItem.parentUid}
                  });
                  insertion['addedItem'] = getAddedItem(insertion.checkedItem.uid, insertion.checkedItem.parentUid);
                  break;
                case 'below':
                  recomputedUids.push({
                    before: {uid: child.uid, parentUid: child.parentUid},
                    after: {uid: insertion.checkedItem.uid, parentUid: insertion.checkedItem.parentUid}
                  });
                  break;
              }

              uid += 1;

              switch (insertion.type) {
                case 'at':
                  recomputedUids.push({
                    before: {uid: child.uid, parentUid: child.parentUid},
                    after: {uid: '' + uid, parentUid: child.parentUid}
                  });
                  break;
                case 'above':
                  recomputedUids.push({
                    before: {uid: child.uid, parentUid: child.parentUid},
                    after: {uid: (insertion.checkedItem.uid === '0' ? child.uid : '' + uid), parentUid: insertion.checkedItem.parentUid}
                  });
                  break;
                case 'below':
                  recomputedUids.push({
                    before: {uid: '-1', parentUid: insertion.checkedItem.parentUid},
                    after: {uid: '' + uid, parentUid: child.parentUid}
                  });
                  insertion['addedItem'] = getAddedItem('' + uid, child.parentUid);
                  break;
              }
            }
            else {
              parentUid = (~~child.parentUid > ~~insertion.checkedItem.parentUid ? ~~child.parentUid + 1: ~~child.parentUid);
              recomputedUids.push({
                before: {uid: child.uid, parentUid: child.parentUid},
                after: {uid: '' + uid, parentUid: '' + parentUid}
              });
            }
            uid += 1;

            if (child.children) {
              children = [...child.children];
              getRecomputedUids(children, insertion, uid, parentUid, recomputedUids);
            }
          });
        }
        else {
          recomputedUids.push({
            before: {uid: '-1', parentUid: '-1'},
            after: {uid: insertion.checkedItem.uid, parentUid: insertion.checkedItem.parentUid}
          });
          insertion['addedItem'] = getAddedItem(insertion.checkedItem.uid, insertion.checkedItem.parentUid);
        }
      };

      this.refreshPolicyConditions = () => {
        triggerCheckedValueChangedEvent.call(this);
      };

      /**
       *
       * @param {{id: string, event: string, pages: [string], options?: {Insertion}}} action
       */
      this.performPolicyEditorAction = (action) => {
        function performAddConditionAction(action) {

          const viewParams = {
            editorAction: action.id,
            i18n: context.properties.i18n,
            data: {
              supportedPredicatesList: self.supportedPredicatesList,
              insertion: action.insertion
            },
            displayFailureMessage: displayFailureMessage,
            clearFailureMessage: clearFailureMessage
          };

          PolicyEditorWizard.startWizard('choose-predicate', self.wizardPageModuleConfig, viewParams)
            .then(results => {
              handleAddConditionActionResults(results, action);
            });
        }

        function performCombineAction(action) {
          const dispatchPolicyConditionsCombinedEvent = (action, checkedUids) => {

            const params = {
              'bubbles': true,
              'detail': {
                'notification': {
                  type: action.id,
                  combinedUids: checkedUids
                }
              }
            };

            context.element.dispatchEvent(new CustomEvent('policyConditionsCombined', params));
          };

          const checkedUids = self.getCheckedPolicyConditionUids();

          // Doing a combine action requires at least two
          // policy conditions to be checked, in the table.
          if (checkedUids.length > 1) {
            const haveSameParentUid = (checkedUids.filter(checkedUid => checkedUid.parentUid !== checkedUids[0].parentUid).length === 0);
            // All the checked policy conditions must have
            // the same value assigned to their parentUid
            // property.
            if (haveSameParentUid) {
              // They do, so go ahead and dispatch the event
              // to event listeners.
              dispatchPolicyConditionsCombinedEvent(action, checkedUids);
            }
          }
        }

        function performUncombineAction(action) {
          const dispatchPolicyConditionsUncombinedEvent = (action, combinedUids) => {

            const params = {
              'bubbles': true,
              'detail': {
                'notification': {
                  type: action.id,
                  combinedUids: combinedUids
                }
              }
            };

            context.element.dispatchEvent(new CustomEvent('policyConditionsUncombined', params));
          };

          const checkedUids = self.getCheckedPolicyConditionUids();

          // Doing an uncombine action requires that at
          // least one "Combination" policy condition
          // item is checked, in the table.
          if (checkedUids.length > 0) {
            // This only means that we have checked items.
            // However, it doesn't mean they're all for
            // "Combination" policy conditions, which is
            // what they need to be. First, get an array
            // containing all the "Combination" policy
            // conditions.
            const combined = getAllCombined();
            // Next, use map to create an array with the
            // value assigned to the uid property, of every
            // "Combination" policy condition item.
            const combinedUids = combined.map(({uid}) => uid);
            // Next, use filter to look for checked items
            // that are not "Combination" policy conditions.
            const checkedNotCombined = checkedUids.filter(item => combinedUids.indexOf(item.uid) === -1);

            if (checkedNotCombined.length === 0) {
              // This means that only "Combination" policy
              // conditions have been checked, so go ahead
              // and dispatch the event to event listeners.
              dispatchPolicyConditionsUncombinedEvent(action, checkedUids);
            }
          }
        }

        function performMoveConditionAction(action) {
          const dispatchPolicyConditionMovedEvent = (recomputedUids) => {
            const params = {
              'bubbles': true,
              'detail': {
                'notification': {
                  type: action.id,
                  recomputedUids: recomputedUids
                }
              }
            };
            context.element.dispatchEvent(new CustomEvent('policyConditionMoved', params));
          };

          const checkedUids = self.getCheckedPolicyConditionUids();

          if (checkedUids.length > 0) {
            const recomputedUids = {
              direction: action.direction,
              movements: [
                {
                  before: {uid: '0', parentUid: '-1'},
                  after: {uid: '1', parentUid: '-1'}
                }
              ]
            };
            dispatchPolicyConditionMovedEvent(recomputedUids);
          }
        }

        function performRemoveAction(action) {
          const captureRemovedUids = (policyConditions, policyCondition, parentUid, removedUids) => {
            let children = [];
            return policyConditions.map((child) => {
              if (child.parentUid === parentUid) {
                removedUids.push(
                  {uid: child.uid, parentUid: child.parentUid}
                );
              }
              if (child.children) {
                children = [...children, ...child.children];
                if (~~child.uid > ~~parentUid) {
                  // Only update parentUid if child.uid is a uid greater
                  // than the current value assigned to parentUid.
                  parentUid = child.uid;
                }
                captureRemovedUids(children, policyCondition, parentUid, removedUids);
              }
            });
          };

          const dispatchPolicyConditionRemoveEvent = (removedItems) => {
            const params = {
              'bubbles': true,
              'detail': {
                'notification': {
                  type: 'policyConditionRemoved',
                  removedItems: removedItems
                }
              }
            };
            context.element.dispatchEvent(new CustomEvent('policyConditionRemoved', params));
          };

          if ((CoreUtils.isNotUndefinedNorNull(action.checkedItems)) &&
            Array.isArray(action.checkedItems) &&
            (CoreUtils.isNotUndefinedNorNull(action.checkedItems[0].uid))
          ) {
            const uid = action.checkedItems[0].uid;
            const policyCondition = self.flattenedPolicyConditions[~~uid];

            let removedItems = [];

            let data = JSON.parse(JSON.stringify(self.policyConditions()));

            if (policyCondition.options.combined) {
              let parentUid = policyCondition.uid;
              removedItems = [{uid: policyCondition.uid, parentUid: policyCondition.parentUid}];
              // This means we're removing a "Combination" policy
              // condition, which means we need to remove it and
              // all of it's descendants.
              captureRemovedUids(data, policyCondition, parentUid, removedItems);
            }
            else {
              // This means the policy condition we're removing is
              // not a "Combination" policy condition, and therefore
              // it will be the only thing removed.
              removedItems.push(
                {uid: policyCondition.uid, parentUid: policyCondition.parentUid}
              );
            }

            dispatchPolicyConditionRemoveEvent(removedItems);
          }
        }

        function performNegateAction(action) {
          const dispatchPolicyConditionNegatedEvent = (negatedItems) => {
            const params = {
              'bubbles': true,
              'detail': {
                'notification': {
                  type: 'policyConditionNegated',
                  negatedItems: negatedItems
                }
              }
            };
            context.element.dispatchEvent(new CustomEvent('policyConditionNegated', params));
          };

          const negatedItems = [];

          for (const policyCondition of self.flattenedPolicyConditions) {
            if (policyCondition.checked().length > 0) {
              negatedItems.push(
                {uid: policyCondition.uid, parentUid: policyCondition.parentUid, previousValue: policyCondition.options.negated, value: !policyCondition.options.negated}
              );
            }
          }

          dispatchPolicyConditionNegatedEvent(negatedItems);
        }

        switch (action.id) {
          case 'addCondition':
            performAddConditionAction(action);
            break;
          case 'combine':
            performCombineAction(action);
            break;
          case 'uncombine':
            performUncombineAction(action);
            break;
          case 'moveCondition':
            performMoveConditionAction(action);
            break;
          case 'remove':
            performRemoveAction(action);
            break;
          case 'negate':
            performNegateAction(action);
            break;
        }
      };

      /**
       * Triggered when the user clicks on the checkbox, for a row in the table.
       * <p>Clicking will either cause the checkbox to appear "checked" or "unchecked"</p>
       * @param {CustomEvent} event
       */
      this.checkedValueChanged = (event) => {
        const dispatchConditionCheckedChangedEvent = (toggledUid, policyCondition, options, combinedUids) => {
          const isFirstSibling = (toggledUid === '0') || (typeof options.firstCheckedUid !== 'undefined') && combinedUids.includes('' + (~~options.firstCheckedUid - 1));
          const isLastSibling = (typeof options.lastCheckedUid !== 'undefined') && combinedUids.includes('' + (~~options.lastCheckedUid + 1));
          const haveSameParentUids = (options.checkedItems.filter(item => item.parentUid !== policyCondition.parentUid).length === 0);
          const isSingleCombinedChecked = (options.checkedItems.filter(item => combinedUids.indexOf[item.uid] !== -1).length < 2);
          const onlyCombinedChecked = (options.checkedItems.filter(item => combinedUids.indexOf(item.uid) === -1).length === 0);

          const disabled = {};

          if (context.properties.readonly) {
            disabled['above'] = true;
            disabled['below'] = true;
            disabled['combine'] = true;
            disabled['uncombine'] = true;
            disabled['moveup'] = true;
            disabled['movedown'] = true;
            disabled['remove'] = true;
            disabled['negate'] = true;
          }
          else {
            disabled['above'] = (
              (policyCondition.options.combined) ||
              (options.checkedItems.length === 0) ||
              (options.checkedItems.length > 1)
            );

            disabled['below'] = (
              (policyCondition.isLastSibling) ||
              (options.checkedItems.length === 0) ||
              (options.checkedItems.length > 1)
            );

            disabled['combine'] = true;
/*
//MLW
              disabled['combine'] = !(
              (options.checkedItems.length > 1) &&
              haveSameParentUids &&
              isSingleCombinedChecked
            );
*/

            disabled['uncombine'] = true;
/*
            disabled['uncombine'] = !(
              (options.checkedItems.length > 0) &&
              onlyCombinedChecked
            );
*/
            disabled['moveup'] = true;
/*
//MLW
            disabled['moveup'] = (
              combinedUids.includes('' + (~~options.firstCheckedUid - 1)) ||
              (options.firstCheckedUid === '0') ||
              (options.checkedItems.length === 0) ||
              (options.checkedItems.length > 1)
            );
*/

            disabled['movedown'] = true;
/*
//MLW
            disabled['movedown'] = (
              combinedUids.includes('' + (~~options.firstCheckedUid + 1)) ||
              (options.checkedItems.length === 0) ||
              (options.checkedItems.length > 1)
            );
*/

//MLW            disabled['remove'] = true;

            disabled['remove'] = (
              (options.checkedItems.length === 0) ||
              (options.checkedItems.length > 1)
            );

            disabled['negate'] = (
              (options.checkedItems.length === 0)
            );
          }

          const params = {
            'bubbles': true,
            'detail': {
              'notification': {
                type: 'isChecked',
                value: options.checkedItems.indexOf(toggledUid) !== -1,
                disabled: disabled,
                actionItems: self.actionItems
              },
              'target': policyCondition
            }
          };

          context.element.dispatchEvent(new CustomEvent('conditionCheckedChanged', params));

          return disabled;
        };

        /**
         *
         * @returns {{checkedItems: [{uid: string, parentUid: string}], firstCheckedUid?: number, lastCheckedUid?: number}}
         */
        const getCheckedValueOptions = () => {
          const options = {checkedItems: []};
          options.checkedItems = self.getCheckedPolicyConditionUids();
          if (options.checkedItems.length > 0) {
            options['firstCheckedUid'] = options.checkedItems.at(0).uid;
            options['lastCheckedUid'] = options.checkedItems.at(-1).uid;
          }
          return options;
        };

        // Grab rowKey (i.e. the uid) that JET keeps track of.
        const toggledUid = event.target.rowKey;
        // Get policy condition for toggledUid from the module-scoped
        // "flattened" policy conditions array.
        const policyCondition = self.flattenedPolicyConditions[~~toggledUid];

        if (CoreUtils.isNotUndefinedNorNull(policyCondition)) {
          const isChecked = event.detail.value.has(toggledUid);

          // Update observable array of the policy condition
          // item, associated with row the user toggled the checkbox
          // for.
          policyCondition.checked.valueWillMutate();
          policyCondition.checked(isChecked ? [toggledUid] : []);
          policyCondition.checked.valueHasMutated();

          let combinedUids = [];
          const options = getCheckedValueOptions();

          if (options.checkedItems.length > 0) {
            // Get array containing just the "Combination" policy
            const combined = getAllCombined();
            // Use map to create an array with the value assigned
            // to the uid property, of every "Combination" policy
            // condition item.
            combinedUids = combined.map(({uid}) => uid);
          }
          const disabled = dispatchConditionCheckedChangedEvent(toggledUid, policyCondition, options, combinedUids);
        }
      };

      this.fieldValueChangedCallback = (callback) => {
        self.fieldValueChanged = callback;
      };

      this.sendFieldValueChangedEvent = (fieldName, fieldValue) => {
        if (CoreUtils.isNotUndefinedNorNull(fieldName) &&
          CoreUtils.isNotUndefinedNorNull(self.fieldValueChanged)
        ) {
          self.fieldValueChanged(
            fieldName,
            {
              Policy: {
                value: {parsedExpression: fieldValue}
              }
            }
          );
        }
      };

      this.setActionItems = (actionItems) => {
        self.actionItems = actionItems;
      };

      this.onContextMenuAction = (event) => {
        const menuItemId = event.detail.selectedValue;
      };

      this.onContextMenuBeforeOpen = (event) => {
        console.log('Yo!');
      };

      /**
       *
       * @param {{id: string, event: string}} action
       * @param {PolicyCondition} policyCondition
       * @param {string} failureMessage
       * @example
       *  const controlElement = document.getElementById('wrc-policy-editor');
       *  if (controlElement !== null) {
       *    results = {
       *      succeeded: true,
       *      policyCondition: policyCondition
       *    };
       *    action = {
       *      id: 'addCondition',
       *      event: 'policyConditionAdded'
       *    };
       *    const response = {
       *      failure: {
       *        body: {
       *          messages: [
       *            { message: 'Invalid data', severity: 'error' }
       *          ]
       *        }
       *      }
       *    };
       *    controlElement.getWizardPageInput(
       *      action,
       *      results.policyCondition,
       *      response.failure.body.messages[0].message
       *    );
       *  }
       */
      this.getWizardPageInput = (action, policyCondition, failureMessage) => {
        const showFailureMessage = CoreUtils.isNotUndefinedNorNull(failureMessage);

        setResponseMessageVisibility(showFailureMessage);

        if (showFailureMessage) {
          displayFailureMessage(failureMessage);
        }

        if (action.id === 'addCondition') {
          editPolicyCondition(action, policyCondition, failureMessage);
        }
        else if (action.id === 'editCondition') {
          editPolicyCondition(action, policyCondition, failureMessage);
        }
      };

      this.setTranslationStrings = (section, i18n) => {
        if (CoreUtils.isNotUndefinedNorNull(i18n)) {
          context.properties['i18n'] = i18n;
          self.i18n.wizard.title(i18n.wizard.title);
          self.i18n.labels.nodata(i18n.labels.nodata[section]);

          self.i18n.messages.conditionHasNoArgValues.summary(i18n.messages.conditionHasNoArgValues.summary);

          self.i18n.contextMenus.action.at.label(i18n.contextMenus.action.addCondition.at.label);
          self.i18n.contextMenus.action.above.label(i18n.contextMenus.action.addCondition.above.label);
          self.i18n.contextMenus.action.below.label(i18n.contextMenus.action.addCondition.below.label);
        }
      };

      this.setSupportedPredicatesList = (data) => {
        self.supportedPredicatesList = data;
      };

      this.setPolicyConditions = (data) => {
        if (CoreUtils.isNotUndefinedNorNull(data) && Array.isArray(data)) {
          const setJoinerPolicyCondition = (policyConditions) => {
            let children = [];
            return policyConditions.map((child) => {
              if (child.options.combined) {
                if (typeof child.children.at(-1).operator !== 'undefined') {
                  child.children.at(-1)['joiner'] = child.children.at(-1).operator;
                }
              }

              if (child.children) {
                children = [...children, ...child.children];
                setJoinerPolicyCondition(children);
              }
            });
          };

          const flattenPolicyConditions = (data, flattened) => {
            return data.map(({children = [], ...rest}) => {
              flattened.push({
                ...rest
              });
              if (children.length) flattenPolicyConditions(children, flattened);
            });
          };

          let flattened = [];

          flattenPolicyConditions([...data], flattened);

          // flattened needs to have the knockout observable
          // for the checkbox, added to each item.
          for (let i = 0; i < flattened.length; i++) {
            if (CoreUtils.isUndefinedOrNull(flattened[i]['checked'])) {
              flattened[i]['checked'] = ko.observableArray([]);
            }
          }

          // flattened is now "good to go", so assign a shallow
          // copy of it to self.flattenedPolicyConditions..
          self.flattenedPolicyConditions = [...flattened];

          // self.policyConditions is still needed when expanding
          // or collapsing programmatically. data is still a tree
          // so assign that to it. It's an observableArray that is
          // bound to the table, so we need to use valueWillMutate()
          // and valueHasMutated() around the assignment.
          self.policyConditions.valueWillMutate();
          self.policyConditions(data);
          self.policyConditions.valueHasMutated();

//MLW          console.info(JSON.stringify(data));

          self.policyConditionsDataProvider(getDataProvider());
          // Programmatically expand all the "Combination" rows.
          expandAllCombined();
          setJoinerPolicyCondition(self.policyConditions());
        }
      };

    }

    return PolicyEditorViewModel;
  }
);