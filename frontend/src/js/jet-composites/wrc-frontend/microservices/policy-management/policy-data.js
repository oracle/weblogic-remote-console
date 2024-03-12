/**
 * @license
 * Copyright (c) 2022,2024, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['./parsed-expression-tree', 'wrc-frontend/microservices/policy-management/condition-phraser', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
    function(ParsedExpressionTree, ConditionPhraser, CoreUtils, CfeErrors){
      /**
       * Creates a new `PolicyData` object from the `data` field in the RDJ
       * @param {{DefaultPolicy, object, Policy: object}} data
       * @constructor
       * @throws {InvalidParameterError} If value of `data`is `undefined` or `null`.
       */
      function PolicyData(data){
        this.data = data;
        this.parsedExpressionTree = new ParsedExpressionTree(data);
//MLW      console.info(JSON.stringify(data, null, 2));
      }

      function isValidSection(name) {
        let rtnval = false;
        if (CoreUtils.isNotUndefinedNorNull(name)) {
          rtnval = Object.values(ParsedExpressionTree.prototype.Section).includes(name);
        }
        return rtnval;
      }

      function getRdjValue(section) {
        let value;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section])
        ){
          value = this.data[section].value;
        }
        if (CoreUtils.isUndefinedOrNull(value)) {
          const obj = {data: {}};
          obj.data[section] = {value: null};
          value = obj.data[section].value;
        }
        return value;
      }

      function getRdjParsedExpression(section) {
        let parsedExpression;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value.parsedExpression)
        ){
          parsedExpression = this.data[section].value.parsedExpression;
        }
        if (CoreUtils.isUndefinedOrNull(parsedExpression)) {
          const obj = {data: {}};
          obj.data[section] = {value: {parsedExpression: null}};
          parsedExpression = obj.data[section].value.parsedExpression;
        }
        return parsedExpression;
      }

      function setRdjParsedExpression(section, value) {
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value)
        ){
          this.data[section].value['parsedExpression'] = value;
        }
      }

      function getRdjStringExpression(section) {
        let stringExpression;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value.stringExpression)
        ){
          stringExpression = this.data[section].value.stringExpression;
        }
        if (CoreUtils.isUndefinedOrNull(stringExpression)) {
          const obj = {data: {}};
          obj.data[section] = {value: {stringExpression: null}};
          stringExpression = obj.data[section].value.stringExpression;
        }
        return stringExpression;
      }

      function setRdjStringExpression(section, value) {
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value)
        ){
          this.data[section].value['stringExpression'] = value;
        }
      }

      function getRdjSupportedPredicates(section) {
        let supportedPredicates;
        if (CoreUtils.isNotUndefinedNorNull(this) &&
            CoreUtils.isNotUndefinedNorNull(this.data) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section]) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value) &&
            CoreUtils.isNotUndefinedNorNull(this.data[section].value.supportedPredicates)
        ){
          supportedPredicates = this.data[section].value.supportedPredicates;
        }
        if (CoreUtils.isUndefinedOrNull(supportedPredicates)) {
          const obj = {data: {}};
          obj.data[section] = {value: {supportedPredicates: null}};
          supportedPredicates = obj.data[section].value.supportedPredicates;
        }
        return supportedPredicates;
      }

      function getSupportedPredicateFormattedTypes(i18n = {labels: { DateTime: '', GMTOffset: '', Time: '', WeekDay: '', MonthDay: ''}}) {
        return {
          'weblogic.entitlement.rules.Before': [
            { displayName: 'Date', type: 'DateTime', placeholder: i18n.labels.DateTime},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.After': [
            { displayName: 'Date', type: 'DateTime', placeholder: i18n.labels.DateTime},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.TimePredicate': [
            { displayName: 'Starting time', type: 'Time', placeholder: i18n.labels.Time},
            { displayName: 'Ending time', type: 'Time', placeholder: i18n.labels.Time},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.IsDayOfWeek': [
            { displayName: 'Day of week', type: 'WeekDay', placeholder: i18n.labels.WeekDay},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.IsDayOfMonth': [
            { displayName: 'The day of the month', type: 'MonthDay', placeholder: i18n.labels.MonthDay},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.BeforeDayOfMonth': [
            { displayName: 'The day of the month', type: 'MonthDay', placeholder: i18n.labels.MonthDay},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ],
          'weblogic.entitlement.rules.AfterDayOfMonth': [
            { displayName: 'The day of the month', type: 'MonthDay', placeholder: i18n.labels.MonthDay},
            { displayName: 'GMT offset', type: 'GMTOffset', placeholder: i18n.labels.GMTOffset}
          ]
        }
      }

      function hasSplittableArgumentValues(name) {
        return (!['weblogic.entitlement.rules.IsDayOfWeek'].includes(name));
      }

      function getPredicateArgumentValues(predicate) {
        let values = [];

        if (CoreUtils.isNotUndefinedNorNull(predicate) &&
            CoreUtils.isNotUndefinedNorNull(predicate['arguments'])
        ){
          // Create a multiple item array containing the value
          // assigned to the value property, of each object in
          // the "arguments" array.
          values = predicate['arguments'].map(({ value }) => value);

          if (values.length > 0) {
            // All of the values in the "arguments" array have
            // the same value assigned to the array property.
            // Get whether the first one has the value true
            // assigned to it.
            const concatValues = predicate['arguments'][0].array;

            if (concatValues) {
              // It does, so create a single item array, which
              // containing the values in the "arguments" array,
              // separated with commas.
              values = [values.join(',')];
            }
          }
        }

        return values;
      }

      /**
       *
       * @param {{uid: string, operator: string, expression: string, options: {negated: boolean}, predicate: {name: string, arguments: [{value: string, array: boolean, displayName: string}]}}} predicateItem
       * @returns {{isValid: boolean}}
       * @private
       * @example:
       * const result = validatePredicateItem(predicateItem);
       */
      function validatePredicateItem(predicateItem) {
        let isValid = true, failureReasons = [];
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.uid) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: uid');
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.parentUid) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: parentUid');
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.options) &&
          CoreUtils.isNotUndefinedNorNull(predicateItem.options.negated) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: options.negated');
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.options) &&
          CoreUtils.isNotUndefinedNorNull(predicateItem.options.combined) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: options.combined');
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.predicate) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: predicate');
        isValid = (
          CoreUtils.isNotUndefinedNorNull(predicateItem.predicate) &&
          CoreUtils.isNotUndefinedNorNull(predicateItem.predicate.name) && true
        );
        if (!isValid) failureReasons.push('Predicate item is missing a required property: predicate.name');

        return {isValid: failureReasons.length === 0, failureReasons: failureReasons};
      }

      /**
       * Returns `stringExpression` associated with a given `section` (i.e. 'DefaultPolicy', 'Policy')
       * @param {'DefaultPolicy'|'Policy'} section
       * @returns {string|undefined}
       * @private
       * @example:
       *  const stringExpression = getStringExpression(PolicyData.prototype.POLICY);
       */
      function getStringExpression(section) {
        let stringExpression = null;
        if (isValidSection(section)) {
          stringExpression = getRdjStringExpression.call(this, section);
          if (CoreUtils.isUndefinedOrNull(stringExpression)) stringExpression = null;
        }
        return stringExpression;
      }

      /**
       * Returns `stringExpression` representation of a given `parsedExpression`
       * @param {object} parsedExpression
       * @returns {{stringExpression: string}|null}
       * @private
       */
      function covertToStringExpression(parsedExpression) {
        return {stringExpression: 'Usr(aaa)|Grp(everyone)'};
      }

      /**
       *
       * @param {[{displayName: string, descriptionHTML: HTMLElement, optional?: boolean, type: string}]} predicateArguments
       * @returns {[{name: string, type: string, label: string, helpSummaryHTML: string, detailedHelpHTML: string, readOnly: boolean, required: boolean, restartNeeded: boolean, supportsModelTokens: boolean}]}
       * @private
       */
      function convertPredicateArgumentsToProperties(predicateArguments) {
        const properties = [];
        for (const predicateArgument of predicateArguments) {
          const property = {
            name: predicateArgument.displayName,
            label: predicateArgument.displayName,
            helpSummaryHTML: predicateArgument.descriptionHTML,
            detailedHelpHTML: predicateArgument.descriptionHTML,
            readOnly: false,
            required: !predicateArgument.optional,
            restartNeeded: false,
            supportsModelTokens: false,
          };
          if (predicateArgument.array) {
            property['array'] = true;
          }
          else {
            property['type'] = 'string';
          }
          properties.push(property);
        }
        return properties;
      }

      /**
       * Returns JS object from `supportedPredicates` under `section`, which has a value assigned to `className` that matches a given `name`.
       * @param {'DefaultPolicy'|'Policy'} section
       * @param {string} name - Value assigned to `className` property of `supportedPredicates`
       * @returns {{arguments?: [{displayName: string, descriptionHTML: HTMLElement, optional?: boolean, type: string}], className: string}|undefined}
       * @private
       * @example:
       *  const predicate = policyData.getPredicateByName(
       *    'Policy',
       *    'weblogic.console.wls.rest.extension.security.authorization.predicates.UserPredicate'
       *  );
       */
      function getPredicateByName(section, name) {
        let predicate;
        if (isValidSection(section) && name) {
          const rdjSupportedPredicates = getRdjSupportedPredicates.call(this, section);
          if (CoreUtils.isNotUndefinedNorNull(rdjSupportedPredicates)) {
            predicate = this.data[section].value.supportedPredicates.find(predicate => predicate.className === name);
          }
        }
        return predicate;
      }

      /**
       * Returns string that gets assigned to `policyCondition.expression`, or an empty string
       * @param {{children?: {children?: [object]}|{arguments: [string], name: string, type: string}, type: "or"|"and"|"combine"|"negate"}} parsedExpression
       * @param {{arguments?: [{displayName: string, descriptionHTML: HTMLElement, optional?: boolean, type: string}], className: string}} predicate - The `supportedPredicate` object with a `className` that matches value assigned to `parsedExpression.name`
       * @param {boolean} [isNegated = false] - Flag indicating if `policyCondition.expression` needs to include the word "Not", or not
       * @param {boolean} [isCombined = false] - Flag indicating if this is for a `type-group` parsedExpression, or not.
       * @returns {string} - String that gets assigned to `policyCondition.expression`, or an empty string
       * @private
       */
      function getPredicateClause(parsedExpression, predicate, isNegated = false, isCombined = false) {
        const policyCondition = {
          options: {
            negated: isNegated,
            combined: isCombined
          },
          predicate: {
            arguments: [],
            displayName: predicate.displayName
          }
        };
        for (const i in parsedExpression['arguments']) {
          policyCondition.predicate['arguments'].push({
            value: parsedExpression['arguments'][i],
            displayName: predicate['arguments'][i].displayName
          });
        }
        if (isCombined) policyCondition['children'] = [];
        return ConditionPhraser.getPredicateClause(policyCondition);
      }

      /**
       * Returns a new "empty" `PolicyCondition`
       * <p><b>IMPORTANT:&nbsp;&nbsp;&nbsp;Do not alter default value for the `operator` property! It is intentionally set to 'none', and must remain that way in order for things to work properly.</b></p>
       * @returns {PolicyCondition}
       * @private
       */
      function getEmptyPolicyCondition() {
        return {
          uid: '0',
          parentUid: '-1',
          isLastSibling: false,
          isLastCondition: false,
          operator: 'none',
          joiner: undefined,
          expression: '',
          options: {
            negated: false,
            combined: false,
            deleted: false
          },
          predicate: {
            name: '',
            arguments: [],
            descriptionHTML: '',
            displayName: ''
          }
        };
      }

      function processNonNullRDJParsedExpression(rdjParsedExpression, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids) {
        // Don't make a "deep copy" of the JS object returned from
        // the getRdjParsedExpression() function! If you do, the
        // uid and parentUid properties are not going to be in
        // the object returned from the same getRdjParsedExpression()
        // call made in the updatePredicateItem() function.

        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
          // This means the root node of the RDJ's parsedExpression
          // tree has a children property.

          switch(rdjParsedExpression.type) {
            case 'group':
              break;
            case 'negate':
              negatedUids.push('' + uidsMap.uid[0]);
              break;
            default:
              // Only push rdjParsedExpression.type onto typesStack, if
              // value assigned to rdjParsedExpression.type isn't "negate".
              typesStack.push(rdjParsedExpression.type);
              typesUidMap['' + uidsMap.uid[0]] = {operator: rdjParsedExpression.type};
          }

          if (rdjParsedExpression.type === 'group') {
            assignUids([rdjParsedExpression], uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
          }
          else {
            // Call the tail-recursion function that inserts uid and
            // parentUid properties, to some parsedExpression tree
            // nodes.
            assignUids(rdjParsedExpression.children, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
          }
        }
        else if (rdjParsedExpression.type === 'predicate') {
          // Add a "uid: '0'" property, if it isn't already there.
          if (CoreUtils.isUndefinedOrNull(rdjParsedExpression.uid)) {
            rdjParsedExpression['uid'] = '0';
          }
          // Add a "parentUid: '-1'" property, if it isn't already there.
          if (CoreUtils.isUndefinedOrNull(rdjParsedExpression.parentUid)) {
            rdjParsedExpression['parentUid'] = '-1';
          }
          // Need to put rdjParsedExpression in an array named
          // children, so it can be processed correctly by the
          // transformParsedExpression() tail-recursion function.
          rdjParsedExpression  = {
            children: [rdjParsedExpression]
          };

          typesUidMap['0'] = {operator: undefined};
        }
        else {
          console.info(`[POLICY-DATA] rdjParsedExpression.type=${rdjParsedExpression.type}`);
          console.info(`[POLICY-DATA] typesStack.type=${JSON.stringify(typesStack)}`);
        }

        return rdjParsedExpression;
      }

      /**
       * Returns an array of `PolicyCondition` objects built from the parsedExpression fpr a fiven `section`.
       * <p>The UI (i.e. policy-form.js, cfe-policy-editor-viewModel.js) "speaks" PolicyCondition and Predicate arrays, not parsedExpression trees.</p>
       * @param {'Policy'|'DefaultPolicy'} section
       * @returns {[{uid: number, operator: 'none'|'or'|'and', expression: string, isChecked: boolean, isCombined: boolean, isNegated: boolean, isChecked: boolean,options: {negated: boolean, location: { at: {uid: string}|above: {uid: string}|below: {uid: string}}},predicate: {name: string,arguments: [{value: string, array: boolean,  displayName: string, descriptionHTML: string}],descriptionHTML: string,displayName: string}}]}
       * @private
       */
      function createPolicyConditions(section) {
        /**
         * Tail-recursion function that transforms a parsedExpression tree into an array of PolicyCondition JS objects.
         * @param {'Policy'|'DefaultPolicy'} section
         * @param {{children?: [{children?: [object]}]|{arguments?: [string], name: string, type: "and"|"or"|"group"|"negate"|"predicate"}, type: "or"|"and"|"combine"|"negate"}} parsedExpression
         * @param {[{PolicyCondition}]} policyConditions
         * @param {{uid: [number], lastSiblingUid: [number]}} uidsMap
         * @param {[string]} typesStack
         * @param {object} typesUidMap
         * @param {object} groupsUidMap
         * @param {[string]} negatedUids
         */
        const transformParsedExpression = (section, parsedExpression, policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids) => {

          function populateCombinationPolicyCondition(child, policyCondition) {
            policyCondition.operator = undefined;

            // Set options.combined property to true.
            policyCondition.options.combined = true;

            // Remove predicate property, because a
            // "Combination" policy condition doesn't
            // have one.
            delete policyCondition.predicate;

            // Create children property we will populate
            // later, with the child policy conditions of
            // the "Combination" policy condition.
            policyCondition['children'] = [];

            // We have everything needed to generate the
            // expression, so go ahead and do that.
            policyCondition['expression'] = ConditionPhraser.getPredicateClause(policyCondition);
          }

          function populateNonCombinationPolicyCondition(child, section, uidsMap, policyCondition) {
            function processArrayPredicateArguments(child, predicate, policyCondition) {
              for (const i in child['arguments']) {
                // child['arguments'][i] can be null or undefined for
                // an argument with an "optional: true" property, so
                // guard against that.
                if (CoreUtils.isNotUndefinedNorNull(child['arguments'][i])) {
                  // Break arg value up into string array items
                  const args = child['arguments'][i].split(',').filter(e => e);
                  for (const arg of args) {
                    if (CoreUtils.isNotUndefinedNorNull(arg)) {
                      const argument = {
                        value: arg,
                        array: predicate['arguments'][i].array || true,
                        displayName: predicate['arguments'][i].displayName || '',
                        descriptionHTML: predicate['arguments'][i].descriptionHTML || '',
                        optional: predicate['arguments'][i].optional || false
                      };

                      policyCondition.predicate['arguments'].push(argument);
                    }
                  }
                }
              }
            }

            function processNonArrayPredicateArguments(child, predicate, policyCondition) {
              for (const i in predicate['arguments']) {
                const argument = {
                  value: null,
                  array: predicate['arguments'][i].array || false,
                  displayName: predicate['arguments'][i].displayName || '',
                  descriptionHTML: predicate['arguments'][i].descriptionHTML || '',
                  optional: predicate['arguments'][i].optional || false
                };
                // predicate['arguments'][i] can be null or undefined for
                // an argument with an "optional: true" property, so
                // guard against that.
                if (CoreUtils.isNotUndefinedNorNull(child['arguments'][i])) {
                  if (hasSplittableArgumentValues(child.name) && argument['array']) {
                    // Break arg value up into string array items
                    const args = child['arguments'][i].split(',').filter(e => e);
                    for (const arg of args) {
                      argument['value'] = arg;
                      policyCondition.predicate['arguments'].push(argument);
                    }
                  }
                  else {
                    argument['value'] = child['arguments'][i];
                    policyCondition.predicate['arguments'].push(argument);
                  }
                }
                else {
                  policyCondition.predicate['arguments'].push(argument);
                }
              }
            }

            policyCondition.predicate['name'] = child.name;
            const predicate = getPredicateByName.call(this, section, child.name);

            if (CoreUtils.isNotUndefinedNorNull(predicate)) {
              // This means that the supportedPredicates
              // array under the specified section had
              // an item with the className property matching
              // child.name, so use found item to update some
              // properties in the policyCondition.predicate.
              policyCondition.predicate['displayName'] = predicate.displayName || '';
              policyCondition.predicate['descriptionHTML'] = predicate.descriptionHTML || '';

              // Some "type: predicate" RDJ parsedExpression tree
              // nodes don't have "arguments"

              if (CoreUtils.isNotUndefinedNorNull(child['arguments'])) {
                if (CoreUtils.isNotUndefinedNorNull(predicate['arguments']) &&
                    predicate['arguments'].length > 0 &&
                    predicate['arguments'][0].array
                ) {
                  processArrayPredicateArguments(child, predicate, policyCondition);
                }
                else {
                  processNonArrayPredicateArguments(child, predicate, policyCondition);
                }
              }
              else {
                // This means we're working with a "predicate" type
                // expression node that has no predicate['arguments']
                // property, so we need to remove the predicate.arguments
                // property from policyCondition before we put it in the
                // propertyConditions array returned from this function.
                delete policyCondition.predicate['arguments'];
              }
            }

            // We have everything needed to generate the
            // expression, so go ahead and do that.
            policyCondition['expression'] = ConditionPhraser.getPredicateClause(policyCondition);
          }

          // Declare local-scoped array that will be used when
          // concatenating children properties together.
          let children = [];
          return parsedExpression.map((child) => {
            if (CoreUtils.isNotUndefinedNorNull(child.uid)) {
              // Next, create an empty policyCondition.
              const policyCondition = getEmptyPolicyCondition();

              // Use child to update the uid and parentUid
              // properties of empty policyCondition.
              policyCondition.uid = child.uid;
              policyCondition.parentUid = child.parentUid;

              policyCondition.operator = typesUidMap[child.uid].operator;
              policyCondition.isLastCondition = (child.uid === '' + uidsMap.lastSiblingUid[0]);

              if (policyCondition.isLastCondition) {
                policyCondition.operator = undefined;
              }

              policyCondition.options.negated = (negatedUids.includes(policyCondition.uid));

              if (child.type === 'group') {
                populateCombinationPolicyCondition(child, policyCondition);

                // Set the joiner before we update the
                // policyCondition to groupsUidMap[child.uid].
                policyCondition.joiner = groupsUidMap[child.uid].lastSibling.joiner;

                // There is a groupsUidMap item for the uid
                // associated with this "Combination" policy
                // condition, so update it's policyCondition
                // property with it.
                groupsUidMap[child.uid].policyCondition = policyCondition;
              }
              else {
                // The getPredicateByName() function will be
                // called while doing this, so make sure you
                // use .call(this, ...) when you call the
                // populateNonCombinationPolicyCondition()
                // function.
                populateNonCombinationPolicyCondition.call(this, child, section, uidsMap, policyCondition);

                // When child.parentUid is '-1', the following will
                // always return false. This is because there will
                // never be a groupsUidMap['-1'] property, thus the
                // the CoreUtils.isNotUndefinedNorNull() will always
                // evaluate to false. The second condition means you
                // need to make sure the insertUids tail-recursion
                // function is updating the lastSibling.uid property
                // correctly. If it's not, you're going to be desperately
                // changing code all over the place, and still not
                // getting the desired result :-)
                const isGroupLastSibling = (CoreUtils.isNotUndefinedNorNull(groupsUidMap[child.parentUid]) && (groupsUidMap[child.parentUid].lastSibling.uid === child.uid));

                if (isGroupLastSibling) {
                  // You have to wait until you get here to update the
                  // islastSibling property, because you can't know
                  // that until after the insertUids tail-recursion
                  // function completes.
                  policyCondition.isLastSibling = true;
                  policyCondition.joiner = groupsUidMap[child.parentUid].lastSibling.joiner;
//MLW                  policyCondition.joiner = typesUidMap[child.uid].operator;
                }
              }

              // "Combination" and non-"Combination" items
              // can be siblings or nested, so we need to
              // use groupsUidMap and child.parentUid to
              // figure out where they go.
              const entry = groupsUidMap[child.parentUid];

              // Use whether entry and entry.children are
              // undefined or not, to decide next step.
              if (CoreUtils.isNotUndefinedNorNull(entry) &&
                  CoreUtils.isNotUndefinedNorNull(entry.policyCondition)
              ) {
                // This means we need to add policyCondition
                // to the children array of an existing
                // "Combination" policy condition.
                entry.policyCondition.children.push(policyCondition);
              }
              else {
                // This means child.parentUid must be "-1",
                // because groupsUidMap has an entry for
                // everything besides that. That means We
                // can just insert the policyCondition
                // into the policyConditions array.
                policyConditions.push(policyCondition);
              }
            }

            if (CoreUtils.isNotUndefinedNorNull(child.children)) {
              children = [...child.children];
              if (children.length > 0) {
                // Array resulting from the concatenation contains
                // something, so continue tail-recursion.
                transformParsedExpression(section, children, policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
              }
            }
            if (child.type === 'negate') children = [];
          });
        };

        let policyConditions = [];

        // Call function that guards against undefined properties
        // in the RDJ, and the 'this' variable being undefined.
        let rdjParsedExpression = getRdjParsedExpression.call(this, section);

        // You can't use an undefined rdjParsedExpression variable to
        // populate the policyConditions array, so there's nothing to
        // do if that's the case.
        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
          let uidsMap = {uid: [0], parentUid: [-1], lastSiblingUid: [0]};
          let typesStack = [];
          let typesUidMap = {};
          let groupsUidMap = {};
          let negatedUids = [];

          rdjParsedExpression = processNonNullRDJParsedExpression(
            rdjParsedExpression,
            uidsMap,
            typesStack,
            typesUidMap,
            groupsUidMap,
            negatedUids
          );

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
            if (rdjParsedExpression.type === 'group') {
              transformParsedExpression(section, [rdjParsedExpression], policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
            }
            else {
              transformParsedExpression(section, rdjParsedExpression.children, policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
            }
          }
          else {
            transformParsedExpression(section, [rdjParsedExpression], policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
          }
        }

        return policyConditions;
      }

      /**
       *
       * @returns {{rdjParsedExpression?: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}}
       * @private
       */
      function initializeExpressionNodes() {
        return {
          negateExpressionNode: {value: null, index: -1},
          predicateExpressionNode: {value: null, index: -1},
          groupExpressionNode: {value: null, index: -1}
        };
      }

      /**
       *
       * @param {[ParsedExpressionNode]} parsedExpression
       * @param {string} targetUid
       * @param {{rdjParsedExpression: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}} expressionNodes
       * @returns {{rdjParsedExpression: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}}
       * @private
       */
      function findExpressionNodes(parsedExpression, targetUid, expressionNodes) {
        function setRdjParsedExpression(child, index, expressionNodes) {
          expressionNodes.rdjParsedExpression = {
            value: child,
            index: index
          };
        }

        function setPredicateExpressionNode(child, index, expressionNodes) {
          expressionNodes.predicateExpressionNode = {
            value: child,
            index: index
          };
        }

        function setGroupExpressionNode(child, index, expressionNodes) {
          expressionNodes.groupExpressionNode = {
            value: child,
            index: index
          };
        }

        function setNegateExpressionNode(child, index, expressionNodes, targetUid) {
          if (CoreUtils.isUndefinedOrNull(expressionNodes.negateExpressionNode.targetUid)) {
            expressionNodes.negateExpressionNode = {
              targetUid: targetUid,
              value: child,
              index: index
            };
          }
        }

        let children = [];

        for (let child of parsedExpression) {
          if (CoreUtils.isNotUndefinedNorNull(child.children)) {
            // See if child.children contains an expression node
            // with a uid property, and the value assigned to
            // that uid property equals targetUid.
            const index = child.children.map(item => item.uid).indexOf(targetUid);
            if (index !== -1) {
              if (child.type === 'negate') {
                // We found the expression node with a uid property
                // equal to targetUid, and it is negated.
                setNegateExpressionNode(child, index, expressionNodes[targetUid], targetUid);
              }
              else if (child.children[index].type === 'predicate') {
                // The type property of the one it contained was set
                // to 'predicate', so call setPredicateExpressionNode().
                setPredicateExpressionNode(child, index, expressionNodes[targetUid]);
                // We found what we were looking for, so break out of
                // the for loop.
                break;
              }
              else if (child.children[index].type === 'group') {
                // The type property of the one it contained was set
                // to 'group', so call setGroupExpressionNode().
                setGroupExpressionNode(child, index, expressionNodes[targetUid]);
                // We found what we were looking for, so break out of
                // the for loop.
                break;
              }
            }
            else if (child.type === 'group') {
              // The child is a "group" expression node, so see if
              // it's the one we're looking for.
              if (child.uid === targetUid) {
                // It is, so call setGroupExpressionNode().
                setGroupExpressionNode(child, index, expressionNodes[targetUid]);
                // We found what we were looking for, so break out of
                // the for loop.
                break;
              }
            }
          }
          else {
            // child doesn't have a children property, so it's at
            // the root-level. Being at the root-level doesn't mean
            // it can't be the expression node with a 'predicate' or
            // 'group' type we're looking for.
            if (child.type === 'predicate') {
              if (child.uid === targetUid) {
                // See, it was the 'predicate' type expression node
                // we were looking for, so call setPredicateExpressionNode()
                // wrapping it in an array. Pass 0 as the value of
                // the index argument.
                setPredicateExpressionNode(child, 0, expressionNodes[targetUid]);
                // We found what we were looking for, so break out of
                // the for loop.
                break;
              }
            }
            else if (child.type === 'group') {
              if (child.uid === targetUid) {
                // It was the 'group' type expression node we were
                // looking for, so call setPredicateExpressionNode()
                // wrapping it in an array. Pass 0 as the value of the
                // index argument.
                setGroupExpressionNode(child, 0, expressionNodes[targetUid]);
                break;
              }
            }
            else if (child.type === 'negate') {
              console.info(`[POLICY-DATA] findExpressionNodes() - child.type === 'negate', targetUid=${targetUid}`);
              setNegateExpressionNode(child, 0, expressionNodes[targetUid], targetUid);
            }
          }

          if (child.children) {
            child.children.forEach((item, index) => {
              if (item.type === 'negate') {
                const index1 = item.children.map(item => item.uid).indexOf(targetUid);
                if (index1 !== -1) {
                  // It does have an object with a uid equak to
                  // targetUid, so go ahead and set the data for
                  // the "negate" expression node.
                  setNegateExpressionNode(child, index, expressionNodes[targetUid], targetUid);
                }
              }
            });

            children = [...children, ...child.children];
            findExpressionNodes(children, targetUid, expressionNodes);
          }
        }

        return expressionNodes[targetUid];
      }

      /**
       * @param {[ParsedExpressionNode]} parsedExpression
       * @param {{uid: string, operator: string, expression: string, options: {negated: boolean}, predicate: {name: string, arguments: [{value: string, array: boolean, displayName: string}]}}} predicateItem
       * @param {{rdjParsedExpression: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}} expressionNodes
       * @private
       */
      function populateExpressionNodes(parsedExpression, predicateItem, expressionNodes) {
        function setRdjParsedExpression(child, index, expressionNodes) {
          expressionNodes.rdjParsedExpression = {
            value: child,
            index: index
          };
        }

        function setPredicateExpressionNode(child, index, expressionNodes) {
          expressionNodes.predicateExpressionNode = {
            value: child,
            index: index
          };
        }

        function setGroupExpressionNode(child, index, expressionNodes) {
          expressionNodes.groupExpressionNode = {
            value: child,
            index: index
          };
        }

        function setNegateExpressionNode(child, index, expressionNodes, targetUid) {
          if (CoreUtils.isUndefinedOrNull(expressionNodes.negateExpressionNode.targetUid)) {
            expressionNodes.negateExpressionNode = {
              targetUid: targetUid,
              value: child,
              index: index
            };
          }
        }

        let children = [];

        for (let child of parsedExpression) {
          if (CoreUtils.isUndefinedOrNull(child.children)) {
            if (child.uid === predicateItem.uid) {
              setPredicateExpressionNode(child, -1, expressionNodes[predicateItem.uid]);
              break;
            }
          }
          else {
            let index = -1;
            if (predicateItem.parentUid !== '-1') {
              index = child.children.map(item => item.uid).indexOf(predicateItem.uid);
              if (index !== -1) {
                setPredicateExpressionNode(child, index, expressionNodes[predicateItem.uid]);
                break;
              }
              else if (child.type === 'group' &&
                  CoreUtils.isUndefinedOrNull(expressionNodes[predicateItem.parentUid].groupExpressionNode.value)
              ) {
                // Be mindful that index is -1, here
                setGroupExpressionNode(child, index, expressionNodes[predicateItem.parentUid]);
              }
              else {
                index = child.children.map(item => item.type).indexOf('negate');
                if (index !== -1) {
                  // We know we're on an expression node with
                  // negation turned ON, so check to see if
                  // it's the "group" we're looking for
                  const index1 = child.children[index].children.map(item => item.uid).indexOf(predicateItem.parentUid);
                  if (index1 !== -1) {
                    setNegateExpressionNode(child, index1, expressionNodes[predicateItem.parentUid], predicateItem.parentUid);
                  }
                  else {
                    index = child.children[index].children.map(item => item.uid).indexOf(predicateItem.uid);
                    if (index !== -1) {
                      setNegateExpressionNode(child, index, expressionNodes[predicateItem.uid], predicateItem.uid);
                    }
                  }
                }
                if (index === -1) {
                  index = child.children.map(item => item.uid ===  predicateItem.parentUid && item.type).indexOf('group');
                  if (index !== -1) {
                    setGroupExpressionNode(child, index, expressionNodes[predicateItem.parentUid]);
                  }
                }
              }
            }

            if (index === -1) {
              index = child.children.map(item => item.uid).indexOf(predicateItem.uid);
              if (index !== -1) {
                setPredicateExpressionNode(child, index, expressionNodes[predicateItem.uid]);
                break;
              }
              else {
                index = child.children.map(item => item.type).indexOf('negate');
                if (index !== -1) {
                  if (CoreUtils.isNotUndefinedNorNull(child.children[index].children)) {
                    index = child.children[index].children.map(item => item.uid).indexOf(predicateItem.uid);
                    if (index !== -1) {
                      setNegateExpressionNode(child, index, expressionNodes[predicateItem.uid], predicateItem.uid);
                    }
                  }
                }
              }
            }

            if (child.children) {
              children = [...children, ...child.children];
              populateExpressionNodes(children, predicateItem, expressionNodes);
            }
          }
        }
      }

      function updateParentUids(parsedExpression, parentUid) {
        if (parsedExpression) {
          let children = [];
          return parsedExpression.map((child) => {
            if (['group', 'predicate'].includes(child.type)) {
              child.parentUid = parentUid;
            }

            if (child.children) {
              children = [...child.children];
              updateParentUids(children, parentUid);
            }
          });
        }
      }

      /**
       * Tail-recursion function that inserts uid and parentUid properties into select parsedExpression tree items.
       * <p>The following objects are populated while inserting the uid and parentUid:</p>
       * <ul>
       *   <li><b>typesStack</b>&nbsp;&nbsp;&nbsp;This is a string array containing the value assigned to the "type" property (i.e. and, or, group, negate, etc.) of a parsedExpression tree node.</li>
       *   <li><b>groupsUidMap</b>&nbsp;&nbsp;&nbsp;This is a JS object that maps the uid assigned to "type: group" parsedExpression tree nodes, to a policy condition.</li>
       *   <li><b>negatedUids</b>&nbsp;&nbsp;&nbsp;This is a string array containing the uid assigned to parsedExpression tree items, which are associated with "type: group" and "type: predicate" parsedExpression tree items that are negated.</li>
       * </ul>
       * <p>IMPORTANT: This tail-recursion function must be modifying the actual JS object returned from the getRdjParsedExpression(section) function! If not, the parsedExpression JS object returned from the getRdjParsedExpression() call in the updatePredicateItem() function, WILL NOT HAVE any nodes with uid or parentUid properties in them.</p>
       * @param {{children?: [{children?: [object]}]|{arguments: [string], name: string, type: string}, type: "or"|"and"|"combine"|"negate"}} parsedExpression
       * @param {{uid: [number], parentUid: [number], lastSiblingUid: [number]}} uidsMap
       * @param {[string]} typesStack
       * @param {object} typesUidMap
       * @param {object} groupsUidMap
       * @param {[string]} negatedUids
       */
      function assignUids(parsedExpression, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids) {

        const getParentUid = () => { return uidsMap.parentUid.at(-1); };

        let children = [];
        return parsedExpression.map((child, index) => {
          if (child.type === 'predicate') {
            child.uid = '' + uidsMap.uid[0];
            if (CoreUtils.isUndefinedOrNull(child.parentUid)) {
              child.parentUid = '' + getParentUid();
            }

            if (CoreUtils.isNotUndefinedNorNull(groupsUidMap[child.parentUid])) {
              // Means this "predicate" expression node is a
              // child of a "group" expression node. Update
              // the lastSibling.uid property of that "group"
              // expression node.
              groupsUidMap[child.parentUid].lastSibling.uid = child.uid;
            }

            if (CoreUtils.isUndefinedOrNull(typesUidMap['' + uidsMap.uid[0]])) {
              let operator;
              if (child.parentUid !== '-1') {
                // When child.parentUid !== '-1', we need to get the value
                // for typesUidMap['' + uidsMap.uid[0]].operator from
                // groupsUidMap[child.parentUid].lastSibling.joiner
                operator = groupsUidMap[child.parentUid].lastSibling.joiner;
              }
              else {
                // Otherwise, get the value from typesStack
                operator = typesStack.at(uidsMap.lastSiblingUid[0] - 1);
              }
              typesUidMap['' + uidsMap.uid[0]] = {operator: operator};
            }

            uidsMap.lastSiblingUid[0] = uidsMap.uid[0];
            uidsMap.uid[0] += 1;
          }
          else if (child.type === 'group') {
            child.uid = '' + uidsMap.uid[0];
            if (CoreUtils.isUndefinedOrNull(child.parentUid)) {
              child.parentUid = '' + getParentUid();
            }
            updateParentUids(child.children, child.uid);
            if (child.parentUid !== '-1') {
              // Means this is a nested "group" expression node.
              // Update lastSibling.uid of the parent "group"
              // expression node, using uidsMap.lastSiblingUid[0].
              groupsUidMap[child.parentUid].lastSibling.uid = uidsMap.lastSiblingUid[0];
            }
            // Means this is root level "group" expression node.
            // Add a new entry to groupsUidMap, using child.uid
            // as the key.
            groupsUidMap[child.uid] = {
              parentUid: child.parentUid,
              lastSibling: {
                uid: '-1',
                joiner: typesStack.at(typesStack.length - 1)
              },
              policyCondition: null
            };
            if (typesStack.length === 0) {
              const joiner = child.children[0].type;
              groupsUidMap[child.uid].lastSibling.joiner = (['and', 'or'].includes(joiner) ? joiner : 'or');
            }
            // Add entry for "group" expression node to
            // typesUidMap. Be sure to use the corresponding
            // groupsUidMap entry's lastSibling.joiner, for
            // the operator.
            typesUidMap[child.uid] = {operator: groupsUidMap[child.uid].lastSibling.joiner};
            // Update uidsMap.lastSiblingUid[0], because this
            // is a tail-recursion function. You don't know
            // what the lastSiblingUid is going to be, so
            // each recursion can only say what the last one
            // is, at this point :-)
            uidsMap.lastSiblingUid[0] = uidsMap.uid[0];
            uidsMap.uid[0] += 1;
          }
          else if (child.type === 'negate') {
            negatedUids.push('' + uidsMap.uid[0]);
          }
          else {
            typesStack.push(child.type);
            typesUidMap['' + uidsMap.uid[0]] = {operator: child.type};
          }

          if (child.children) {
            children = [...child.children];
            assignUids(children, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
          }
        });
      }

      /**
       * Returns the parsedExpression JS object that gets passed as a parameter to the PolicyManager.submitPolicyChange() function
       * <p>This parsedExpression cannot have uid or parentUid properties in it, because it will be used when doing an HTTP POST to the CBE. </p>
       * <p>We need to let the PolicyManager wrap the returned parsedExpression in a dataPayload JS object, because the policy-data.js module isn't suppose to know how to call the CBE.</p>
       * @param {object} parsedExpression
       * @returns {object}
       */
      function createSubmitChangesParsedExpression(parsedExpression) {
        const removeUidsAndParentUids = (parsedExpression) => {
          const removeUidsForEach = (parsedExpression) => {
            let children = [];
            return parsedExpression.map((child) => {
              if (CoreUtils.isNotUndefinedNorNull(child)) {
                delete child.uid;
                delete child.parentUid;
              }
              if (child && child.children) {
                children = [...child.children];
                removeUidsForEach(children);
              }
            });
          };

          if (parsedExpression) {
            removeUidsForEach(parsedExpression);
          }
        };

        // Initialize return value to null
        let pristineParsedExpression = null;

        if (CoreUtils.isNotUndefinedNorNull(parsedExpression)) {
          // This means the parsedExpression parameter passed
          // to us wasn't undefined, so we can go through the
          // trouble of creating a "deep copy" to work on.
          pristineParsedExpression = JSON.parse(JSON.stringify(parsedExpression));

          if (CoreUtils.isNotUndefinedNorNull(pristineParsedExpression.children)) {
            // Call tail-recursion function that removes the uid and
            // parentUid property, from every parsed expression node
            // in pristineParsedExpression that has those properties.
            // Pass [pristineParsedExpression] to the tail recursion
            // function, because the root expression node could be
            // a "group". If you pass pristineParsedExpression.children
            // as the argument, then the uid and parentUid properties
            // assigned to that "group" root expression node will get
            // skipped during the tail recursion. Later, when the user
            // does a "Save", the CBE will return a parsing error
            // (because the uid and parentUid weren't removed from
            // the "group" root expression node), and not allow the
            // user to save their changes to the policy.
            removeUidsAndParentUids([pristineParsedExpression]);
          }
          else {
            // This means parsedExpression is not an array,
            // which is generally the case when the first
            // "type: predicate" node is added. We just
            // remove the uid and parentUid, and continue.
            delete pristineParsedExpression.uid;
            delete pristineParsedExpression.parentUid;
          }
        }

        // Returned pristineParsedExpression JS object will
        // be undefined, or a parsedExpression JS object with
        // no uid and parentUid properties.
        return pristineParsedExpression;
      }

      function removeEmptyParsedExpressionChildren(parsedExpression) {
        const removeEmptyChild = (child) => {
          child.children.splice(0, 1);
          if (child.children) {
            if (child.children.length === 0) {
              delete child.children;
              delete child.type;
            }
            else if (child.children[0] && Object.keys(child.children[0]) === 0) {
              delete child.children;
              delete child.type;
            }
          }
        };

        let children = [];
        return parsedExpression.map((child) => {
          if (child.children && Array.isArray(child.children)) {
            if (child.children[0]) {
              if (Object.keys(child.children[0]).length === 0) {
                removeEmptyChild(child);
              }
              else if (child.children[0].children) {
                if (child.children[0].children.length === 0) {
                  removeEmptyChild(child);
                }
              }
            }
          }

          if (child.children) {
            children = [...child.children];
            removeEmptyParsedExpressionChildren(children);
          }
        });
      }

      function spliceEmptyParsedExpressionChildren(rdjParsedExpression) {
        let result = {succeeded: false};
        if (Object.keys(rdjParsedExpression).length === 0 ||
            (rdjParsedExpression.children && rdjParsedExpression.children.length === 0)
        ) {
          result.succeeded = true;
        }
        else if (rdjParsedExpression.children[0]) {
          if (rdjParsedExpression.children[0].children &&
              rdjParsedExpression.children[0].children.length === 0
          ) {
            rdjParsedExpression.children.splice(0, 1);
            if (rdjParsedExpression.children.length === 0) {
              result.succeeded = true;
            }
          }
          else if (rdjParsedExpression.children[0].children &&
              rdjParsedExpression.children[0].children[0] &&
              Object.keys(rdjParsedExpression.children[0].children[0]).length === 0
          ) {
            rdjParsedExpression.children[0].children.splice(0, 1);
            if (rdjParsedExpression.children[0].children.length === 0) {
              rdjParsedExpression.children.splice(0, 1);
              if (rdjParsedExpression.children.length === 0) {
                result.succeeded = true;
              }
            }
          }
          else if (Object.keys(rdjParsedExpression.children[0]).length === 0) {
            rdjParsedExpression.children.splice(0, 1);
            if (rdjParsedExpression.children.length === 0) {
              result.succeeded = true;
            }
          }
        }
        return result;
      }

      function removeTargetExpressionNode(entry) {
        if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
          entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1);
          if (entry.negateExpressionNode.value.children.length === 0) {
            delete entry.negateExpressionNode.value.children;
            delete entry.negateExpressionNode.value.type;
          }
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
          entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index, 1);
          if (entry.predicateExpressionNode.value.children.length === 0) {
            delete entry.predicateExpressionNode.value.children;
            delete entry.predicateExpressionNode.value.type;
          }
          else if (entry.predicateExpressionNode.value.children[0] &&
              Object.keys(entry.predicateExpressionNode.value.children[0]).length === 0
          ) {
            delete entry.predicateExpressionNode.value.children;
            delete entry.predicateExpressionNode.value.type;
          }
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
          entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1);
          if (entry.groupExpressionNode.value.children.length === 0) {
            delete entry.groupExpressionNode.value.children;
            delete entry.groupExpressionNode.value.type;
          }
          else if (entry.groupExpressionNode.value.children[0] &&
              Object.keys(entry.groupExpressionNode.value.children[0]).length === 0
          ) {
            delete entry.groupExpressionNode.value.children;
            delete entry.groupExpressionNode.value.type;
          }
        }
      }

      function createSuccessfulReply(section, rdjParsedExpression, predicateItem) {
        const reply = {};

        reply['succeeded'] = true;
        reply['parsedExpression'] = createSubmitChangesParsedExpression(rdjParsedExpression);
        if (CoreUtils.isNotUndefinedNorNull(predicateItem)) reply['predicateItem'] = predicateItem;
        reply['policyConditions'] = createPolicyConditions.call(this, section);
        reply['stringExpression'] = getStringExpression.call(this, section, rdjParsedExpression);

        return reply;
      }

      function createFailureReply(failureMessages) {
        const reply = {};

        reply['succeeded'] = false;
        reply['failure'] = {
          messages: failureMessages.map(failureMessage => {
            return {
              message: failureMessage,
              severity: 'error'
            };
          })
        };

        return reply;
      }

      /**
       *
       * @param {string} name
       * @param {[string]} argumentValues
       * @private
       */
      function createParsedExpressionNode(name, argumentValues = []) {
        const emptyParsedExpression = {};

        // Some predicates don't have "arguments". For example,
        // "weblogic.entitlement.rules.InDevelopmentMode". When
        // that's the case, we don't put an "arguments" property
        // in the emptyParsedExpression variable that's returned.

        if (argumentValues.length > 0) {
          emptyParsedExpression['arguments'] = argumentValues;
        }

        emptyParsedExpression['name'] = name;
        emptyParsedExpression['type'] = 'predicate';

        return emptyParsedExpression;
      }

      function addPredicateItem(section, predicateItem) {
        function createNewExpressionNode(predicateItem, argumentValues) {
          let newExpressionNode = createParsedExpressionNode(
            predicateItem.predicate.name,
            argumentValues
          );

          newExpressionNode.uid = predicateItem.uid;
          newExpressionNode.parentUid = predicateItem.parentUid;

          return newExpressionNode;
        }

        const insertAboveParsedExpressionNode = (entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.rdjParsedExpression.value)) {
            const relocatedExpressionNode = entry.rdjParsedExpression.value.children.splice(entry.rdjParsedExpression.index, 1);
            entry.rdjParsedExpression.value.children = [newExpressionNode, relocatedExpressionNode[0]];
          }
        };

        const insertBelowParsedExpressionNode = (entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.rdjParsedExpression.value)) {
            const relocatedExpressionNode = entry.rdjParsedExpression.value.children.splice(entry.rdjParsedExpression.index, 1);
            entry.rdjParsedExpression.value.children = [relocatedExpressionNode[0], newExpressionNode];
          }
        };

        const insertNewExpressionBeforeFirstSibling = (predicareItem, entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
            entry.negateExpressionNode.value['type'] = predicateItem.options.insertion.parentExpression.type;
            entry.negateExpressionNode.value['children'] = [
              newExpressionNode,
              {
                type: 'negate',
                children: [relocatedExpressionNode]
              }
            ];
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]));
            entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index, 1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [
                  newExpressionNode,
                  {
                    type: entry.predicateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                ]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
            if (entry.groupExpressionNode.value.type === 'group') {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value));
              entry.groupExpressionNode.value['children'] = [
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [
                    newExpressionNode,
                    {
                      type: predicateItem.options.insertion.parentExpression.type,
                      children: [relocatedExpressionNode]
                    }
                  ]
                }
              ];
              delete entry.groupExpressionNode.value.uid;
              delete entry.groupExpressionNode.value.parentUid;
            }
            else {
              // This means "and" or "or" is assigned to the type
              // property of entry.groupExpressionNode.value.type
              const relocatedExpressionNode = entry.groupExpressionNode.value.children[entry.groupExpressionNode.index];
              entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index,1,
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [newExpressionNode,
                    {
                      type: entry.groupExpressionNode.value.type,
                      children: [relocatedExpressionNode]
                    }
                  ]
                }
              );
            }
          }
        };

        const insertNewExpressionBeforeExistingSibling = (predicateItem, entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
            entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [newExpressionNode, relocatedExpressionNode]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            // This means the "predicate" condition we're inserting
            // above has negation turned OFF.
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]));
            entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index, 1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [newExpressionNode,
                  {
                    type: entry.predicateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                ]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
            if (entry.groupExpressionNode.value.type === 'group') {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value));
              entry.groupExpressionNode.value['children'] = [
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [newExpressionNode]
                },
                relocatedExpressionNode
              ];
              delete entry.groupExpressionNode.value.uid;
              delete entry.groupExpressionNode.value.parentUid;
            }
            else if (entry.groupExpressionNode.value.children[entry.groupExpressionNode.index].type === 'group') {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
              entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [newExpressionNode,
                    {
                      type: entry.groupExpressionNode.value.type,
                      children: [relocatedExpressionNode]
                    }
                  ]
                }
              );
            }
            else {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
              entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [newExpressionNode, relocatedExpressionNode]
                }
              );
            }
          }
        };

        const insertNewExpressionAfterExistingSibling = (predicateItem, entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
            entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [relocatedExpressionNode, newExpressionNode]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]));
            entry.predicateExpressionNode.value.children.splice(
              entry.predicateExpressionNode.index, 1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [relocatedExpressionNode, newExpressionNode]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
            const index = entry.groupExpressionNode.value.children.map(item => item.type).indexOf('predicate');
            if (index === -1) {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
              entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
                {
                  type: predicateItem.options.insertion.parentExpression.type,
                  children: [relocatedExpressionNode, newExpressionNode]
                }
              );
            }
            else {
              const targetExpressionNode = entry.groupExpressionNode.value.children[entry.groupExpressionNode.index];
              if (targetExpressionNode.type === 'group') {
                const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
                entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
                  {
                    type: predicateItem.options.insertion.parentExpression.type,
                    children: [relocatedExpressionNode, newExpressionNode]
                  }
                );
              }
              else {
                const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[index]));
                entry.groupExpressionNode.value.children.splice(index, 1,
                  {
                    type: predicateItem.options.insertion.parentExpression.type,
                    children: [newExpressionNode, relocatedExpressionNode]
                  }
                );
              }
            }
          }
        };

        const insertNewExpressionBeforeExistingGroup = (predicateItem, entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.rdjParsedExpression.value)) {
            entry.rdjParsedExpression.value['children'] = [
              newExpressionNode,
              entry.rdjParsedExpression.value.children[entry.rdjParsedExpression.index]
            ];
          }
        };

        const insertNewExpressionAfterExistingGroup = (predicateItem, entry, newExpressionNode) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.rdjParsedExpression.value)) {
            entry.rdjParsedExpression.value['children'] = [
              entry.rdjParsedExpression.value.children[entry.rdjParsedExpression.index],
              newExpressionNode
            ];
          }
        };

        let reply = {};

        const validatePredicateItemResults = validatePredicateItem(predicateItem);

        if (validatePredicateItemResults.isValid) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          const argumentValues = getPredicateArgumentValues(predicateItem.predicate);

          if (CoreUtils.isUndefinedOrNull(rdjParsedExpression)) {
            rdjParsedExpression = createNewExpressionNode(predicateItem, argumentValues);
          }
          else {
            let newExpressionNode = createNewExpressionNode(predicateItem, argumentValues);
            let targetUid, expressionNodes = {};

            targetUid = predicateItem.options.insertion.checkedItem.uid;

            expressionNodes[targetUid] = initializeExpressionNodes();

            expressionNodes[targetUid] = findExpressionNodes(
              [rdjParsedExpression],
              predicateItem.options.insertion.checkedItem.uid,
              expressionNodes
            );

            switch (predicateItem.options.insertion.type) {
              case 'at':
                if (rdjParsedExpression.type === 'group') {
                  if (CoreUtils.isNotUndefinedNorNull(expressionNodes[targetUid].groupExpressionNode.value)) {
                    expressionNodes[targetUid]['rdjParsedExpression'] = {
                      index: 0,
                      value: {
                        type: predicateItem.options.insertion.parentExpression.type,
                        children: [rdjParsedExpression]
                      }
                    };

                    insertNewExpressionBeforeExistingGroup(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                    rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                  }
                }
                else {
                  if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
                    insertNewExpressionBeforeFirstSibling(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                  }
                  else {
                    expressionNodes[targetUid]['rdjParsedExpression'] = {
                      index: 0,
                      value: {
                        type: predicateItem.options.insertion.parentExpression.type,
                        children: [rdjParsedExpression]
                      }
                    };

                    insertAboveParsedExpressionNode(
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                    rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                  }
                }
                break;
              case 'above':
                if (rdjParsedExpression.type === 'group') {
                  if (CoreUtils.isNotUndefinedNorNull(expressionNodes[targetUid].groupExpressionNode.value)) {
                    expressionNodes[targetUid]['rdjParsedExpression'] = {
                      index: 0,
                      value: {
                        type: predicateItem.options.insertion.parentExpression.type,
                        children: [rdjParsedExpression]
                      }
                    };

                    insertNewExpressionBeforeExistingGroup(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                    rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                  }
                  else {
                    insertNewExpressionBeforeExistingSibling(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                  }
                }
                else {
                  if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
                    insertNewExpressionBeforeExistingSibling(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                  }
                  else {
                    expressionNodes[targetUid]['rdjParsedExpression'] = {
                      index: 0,
                      value: {
                        type: predicateItem.options.insertion.parentExpression.type,
                        children: [rdjParsedExpression]
                      }
                    };

                    insertAboveParsedExpressionNode(
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                    rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                  }
                }
                break;
              case 'below':
                if (rdjParsedExpression.type === 'group') {
                  if (CoreUtils.isNotUndefinedNorNull(expressionNodes[targetUid].groupExpressionNode.value)) {
                    expressionNodes[targetUid]['rdjParsedExpression'] = {
                      index: 0,
                      value: {
                        type: predicateItem.options.insertion.parentExpression.type,
                        children: [rdjParsedExpression]
                      }
                    };

                    insertNewExpressionAfterExistingGroup(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                    rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                  }
                  else {
                    insertNewExpressionAfterExistingSibling(
                      predicateItem,
                      expressionNodes[targetUid],
                      newExpressionNode
                    );
                  }
                }
                else if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
                  insertNewExpressionAfterExistingSibling(
                    predicateItem,
                    expressionNodes[targetUid],
                    newExpressionNode
                  );
                }
                else {
                  expressionNodes[targetUid]['rdjParsedExpression'] = {
                    index: 0,
                    value: {
                      type: predicateItem.options.insertion.parentExpression.type,
                      children: [rdjParsedExpression]
                    }
                  };

                  insertBelowParsedExpressionNode(
                    expressionNodes[targetUid],
                    newExpressionNode
                  );
                  rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
                }
                break;
            }
          }

          setRdjParsedExpression.call(this, section, rdjParsedExpression);

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression, predicateItem)
        }
        else {
          reply = createFailureReply(validatePredicateItemResults.failureReasons);
        }

        return reply;
      }

      function updatePredicateItem(section, predicateItem) {
        function performOperatorUpdate(predicateItem, expressionNodes) {
          const entry = expressionNodes[predicateItem.uid];

          if (predicateItem.parentUid !== '-1') {
            // The "predicate" expression node being updated
            // is a sibling of a "group" expression node.
            if (predicateItem.isLastSibling) {
              // ... and it's the last sibling
              const entry1 = expressionNodes[predicateItem.parentUid];
              if (CoreUtils.isNotUndefinedNorNull(entry1)) {
                // Found the "group" expression node
                if (CoreUtils.isNotUndefinedNorNull(entry1.negateExpressionNode.value)) {
                  // ...and it has negation turned ON.
                  if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry1.negateExpressionNode.value.type) {
                    // Update the joiner for the "group"
                    // expression node,
                    entry1.negateExpressionNode.value.type = predicateItem.operator;
                  }
                }
                else {
                  // ...and it doesn't have negation turned ON.
                  if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry1.groupExpressionNode.value.type) {
                    // Update the joiner for the "group"
                    // expression node,
                    entry1.groupExpressionNode.value.type = predicateItem.operator;
                  }
                }
              }
            }
            else {
              // ... but it's not the last sibling
              if (predicateItem.options.negated) {
                // ...and it has negation turned ON.
                if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry.negateExpressionNode.value.type) {
                  entry.negateExpressionNode.value.type = predicateItem.operator;
                }
              }
              else {
                // ...and it doesn't have negation turned ON.
                if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry.predicateExpressionNode.value.type) {
                  entry.predicateExpressionNode.value.type = predicateItem.operator;
                }
              }
            }
          }
          else {
            // The "predicate" expression node being updated
            // is not a sibling of a "Combination" condition.
            if (predicateItem.options.negated) {
              // ...and it has negation turned ON.
              if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry.negateExpressionNode.value.type) {
                entry.negateExpressionNode.value.type = predicateItem.operator;
              }
            }
            else {
              if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) && predicateItem.operator !== entry.predicateExpressionNode.value.type) {
                entry.predicateExpressionNode.value.type = predicateItem.operator;
              }
            }
          }
        }

        function performArgumentsUpdate(predicateItem, expressionNodes) {
          const entry = expressionNodes[predicateItem.uid];
          if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            if (CoreUtils.isUndefinedOrNull(entry.predicateExpressionNode.value.children)) {
              entry.predicateExpressionNode.value['arguments'] = getPredicateArgumentValues(predicateItem.predicate);
            }
            else {
              const relocatedExpressionNode = entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index];
              relocatedExpressionNode['arguments'] = getPredicateArgumentValues(predicateItem.predicate);
            }
          }
        }

        let reply = {};

        const validatePredicateItemResults = validatePredicateItem(predicateItem);

        if (validatePredicateItemResults.isValid) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
            let expressionNodes = {};

            expressionNodes[predicateItem.uid] = initializeExpressionNodes();
            if (predicateItem.parentUid !== '-1') {
              expressionNodes[predicateItem.parentUid] = initializeExpressionNodes();
            }

            populateExpressionNodes(
              [rdjParsedExpression],
              predicateItem,
              expressionNodes
            );

            performOperatorUpdate(
              predicateItem,
              expressionNodes
            );

            if (CoreUtils.isNotUndefinedNorNull(predicateItem.predicate['arguments'])) {
              performArgumentsUpdate(
                predicateItem,
                expressionNodes
              );
            }

            setRdjParsedExpression.call(this, section, rdjParsedExpression);
          }

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression, predicateItem)
        }
        else {
          reply = createFailureReply(validatePredicateItemResults.failureReasons);
        }

        return reply;
      }

      function combinePredicateItems(section, combinedItems, relocatedItems) {

        function insertNewExpressionNode(entry, child, modulo, isLastSibling) {
          const appendExpressionNodesEntry = (entry, child, modulo, isLastSibling) => {
            if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
              if (isLastSibling) {
                if (child.children.length === 1) {
                  if (modulo === 0) modulo = 1;
                }
                child.children.splice(modulo, 0,
                  relocatedExpressionNode
                );
              }
              else if (child.children.length === 1) {
                if (modulo === 0) modulo = 1;
                child.children.splice(modulo, 0,
                  {
                    type: entry.negateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
              else {
                child.children.splice(modulo, 0,
                  {
                    type: entry.negateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
            }
            else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]));
              if (isLastSibling) {
                if (child.children.length === 1) {
                  if (modulo === 0) modulo = 1;
                }
                child.children.splice(modulo, 0,
                  relocatedExpressionNode
                );
              }
              else if (child.children.length === 1) {
                child.children.splice(modulo, 0,
                  {
                    type: entry.predicateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
              else {
                child.children.splice(modulo, 0,
                  {
                    type: entry.predicateExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
            }
            else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
              if (isLastSibling) {
                if (child.children.length === 1) {
                  if (modulo === 0) modulo = 1;
                }
                child.children.splice(modulo, 0,
                  relocatedExpressionNode
                );
              }
              else if (child.children.length === 1) {
                child.children.splice(modulo, 0,
                  {
                    type: relocatedExpressionNode.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
              else {
                child.children.splice(modulo, 0,
                  {
                    type: entry.groupExpressionNode.value.type,
                    children: [relocatedExpressionNode]
                  }
                );
              }
            }
          };

          appendExpressionNodesEntry(entry, child, modulo, isLastSibling);

          return child.children.at(-1);
        }

        function processRelocatedItems(rdjParsedExpression, relocatedItems) {
          function addRelocatedExpressionNode(expressionNodes, targetUids) {
            let nodeStack = [{
              type: null,
              children: []
            }];

            let child = nodeStack[0];

            for (let index = 0; index < targetUids.length; index++) {
              const targetUid = targetUids[index];
              const entry = expressionNodes[targetUid];
              const modulo = (index % 2);
              const isLastSibling = (targetUid === targetUids.at(-1));

              child = insertNewExpressionNode(entry, child, modulo, isLastSibling);

              if (modulo) {
                nodeStack.push(child);
              }
            }

            return nodeStack[0];
          }

          function getRelocatedExpressionNodes(rdjParsedExpression, targetUids) {
            let expressionNodes = {};
            for (let index = 0; index < targetUids.length; index++) {
              const targetUid = targetUids[index];
              expressionNodes[targetUid] = initializeExpressionNodes();

              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );
            }
            return expressionNodes;
          }

          const targetUids = relocatedItems.map(relocatedItem => relocatedItem.uid);
          let expressionNodes = getRelocatedExpressionNodes(rdjParsedExpression, targetUids);

          const nodeStackNode = addRelocatedExpressionNode(
            expressionNodes,
            targetUids
          );

          return nodeStackNode.children[0];
        }

        function processCombinedItems(rdjParsedExpression, combinedItems) {
          function addCombinedExpressionNode(expressionNodes, targetUids) {
            let nodeStack = [{
              type: 'group',
              children: []
            }];

            let child = nodeStack[0];

            for (let index = 0; index < targetUids.length; index++) {
              const targetUid = targetUids[index];
              const entry = expressionNodes[targetUid];
              const modulo = (index % 2);
              const isLastSibling = (targetUid === targetUids.at(-1));

              child = insertNewExpressionNode(entry, child, modulo, isLastSibling);

              if (modulo) {
                nodeStack.push(child);
              }
            }

            return nodeStack[0];
          }

          function getCombinedExpressionNodes(rdjParsedExpression, targetUids) {
            let expressionNodes = {};

            for (let index = 0; index < targetUids.length; index++) {
              const targetUid = targetUids[index];
              expressionNodes[targetUid] = initializeExpressionNodes();

              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );
            }

            return expressionNodes;
          }

          const targetUids = combinedItems.map(combinedItem => combinedItem.uid);
          let expressionNodes = getCombinedExpressionNodes(rdjParsedExpression, targetUids);

          return addCombinedExpressionNode(
            expressionNodes,
            targetUids
          );
        }

        function applyNodeStackNodes(parsedExpression, targetUid, nodeStackNodes) {
          const connectNodeStackNodes = (nodeStackNodes) => {
            if (nodeStackNodes.length === 2) {
              const relocatedExpressionNode = JSON.parse(JSON.stringify(nodeStackNodes[1]));
              nodeStackNodes[1] = {
                type: 'and',
                children: [
                  nodeStackNodes[0],
                  relocatedExpressionNode
                ]
              };
            }
          };

          connectNodeStackNodes(nodeStackNodes);

          let expressionNodes = {};

          expressionNodes[targetUid] = initializeExpressionNodes();

          expressionNodes[targetUid] = findExpressionNodes(
            [parsedExpression],
            targetUid,
            expressionNodes
          );

          const entry = expressionNodes[targetUid];

          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            if (nodeStackNodes.length === 1) {
              entry.negateExpressionNode.value.children = nodeStackNodes[0].children;
              entry.negateExpressionNode.value.type = nodeStackNodes[0].type;
            }
            else if (nodeStackNodes.length === 2) {
              entry.negateExpressionNode.value.children = nodeStackNodes[1].children;
            }
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            if (nodeStackNodes.length === 1) {
              entry.predicateExpressionNode.value.children = nodeStackNodes[0].children;
              entry.predicateExpressionNode.value.type = nodeStackNodes[0].type;
            }
            else if (nodeStackNodes.length === 2) {
              entry.predicateExpressionNode.value.children = nodeStackNodes[1].children;
            }
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
            if (nodeStackNodes.length === 1) {
              entry.groupExpressionNode.value.children = nodeStackNodes[0].children;
              entry.groupExpressionNode.value.type = nodeStackNodes[0].type;
            }
            else if (nodeStackNodes.length === 2) {
              entry.groupExpressionNode.value.children = nodeStackNodes[1].children;
            }
          }
        }

        let reply = {};

        if (isValidSection(section)) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression) &&
              CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)
          ) {
            const haveSameParentUid = (combinedItems.filter(combinedItem => combinedItem.parentUid !== combinedItems[0].parentUid).length === 0);

            // Don't even bother, if all the combinedItems
            // don't have the same parentUid.

            if (haveSameParentUid) {
              let nodeStackNodes = [];

              nodeStackNodes.splice(0, 0,
                processCombinedItems(rdjParsedExpression, combinedItems)
              );

              // The relocatedItems object contains the uids
              // of the sibling expression nodes, which are
              // greater than combinedItems[0].uid. They are
              // important because creating a new "Combination"
              // condition involves relocating sibling expression
              // nodes THAT ARE NOT going to be in it...without
              // doing a bunch of unnecessary tail-recursion :-)

              if (relocatedItems.length > 0) {
                nodeStackNodes.splice(1, 0,
                  processRelocatedItems(rdjParsedExpression, relocatedItems)
                );
              }

              applyNodeStackNodes(
                rdjParsedExpression,
                combinedItems[0].uid,
                nodeStackNodes
              );

              setRdjParsedExpression.call(this, section, rdjParsedExpression);
            }
          }

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression)
        }
        else {
          reply = createFailureReply([`${section} is not one of the supported value for the "section" parameter! Must be the string "DefaultPolicy" or "Policy".`]);
        }

        return reply;
      }

      function uncombinePredicateItem(section, combinedItems) {
        function uncombineNegatedCombination(entry) {
          const targetExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
          const relocatedExpressionNode = targetExpressionNode.children[0];
          if (targetExpressionNode.type === 'negate') {
            updateParentUids(relocatedExpressionNode.children, relocatedExpressionNode.parentUid);
            entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
              relocatedExpressionNode.children[0]
            );
          }
          else {
            updateParentUids(relocatedExpressionNode.children, targetExpressionNode.parentUid);
            entry.negateExpressionNode.value['type'] = relocatedExpressionNode.type;
            entry.negateExpressionNode.value['children'] = relocatedExpressionNode.children;
          }
        }

        /**
         * Manipulates reference to a non-negated, "group" parsed expression tree node, which was the very first condition in the policy.
         * @param {{negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}, rdjParsedExpression?: {value: ParsedExpressionNode|null, index: number}}} entry
         * @private
         */
        function uncombineNonNegatedCombination(entry) {
          if (CoreUtils.isNotUndefinedNorNull(entry.rdjParsedExpression)) {
            const targetExpressionNode = JSON.parse(JSON.stringify(entry.rdjParsedExpression.value.children[entry.rdjParsedExpression.index]));
            const relocatedExpressionNode = targetExpressionNode.children[0];
            updateParentUids(relocatedExpressionNode.children, targetExpressionNode.parentUid);
            entry.rdjParsedExpression.value.children[entry.rdjParsedExpression.index] = relocatedExpressionNode;
          }
          else {
            const targetExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
            const relocatedExpressionNode = targetExpressionNode.children[0];
            updateParentUids(relocatedExpressionNode.children, targetExpressionNode.parentUid);
            entry.groupExpressionNode.value.children[entry.groupExpressionNode.index] = relocatedExpressionNode;
          }
        }

        const uncombineExpressionNodes = (entry) => {
          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            uncombineNegatedCombination(entry);
          }
          else {
            uncombineNonNegatedCombination(entry);
          }
        };

        let reply = {};

        if (isValidSection(section)) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression) &&
              CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)
          ) {
            let expressionNodes = {}, targetUid;

            for (let i = 0; i < combinedItems.length; i++) {
              targetUid = combinedItems[i].uid;
              expressionNodes[targetUid] = initializeExpressionNodes();

              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );
            }

            if (rdjParsedExpression.type === 'group') {
              expressionNodes[targetUid]['rdjParsedExpression'] = {
                index: 0,
                value: {
                  children: [rdjParsedExpression]
                }
              };

              uncombineExpressionNodes(expressionNodes[targetUid]);

              rdjParsedExpression = expressionNodes[targetUid].rdjParsedExpression.value;
            }
            else {
              uncombineExpressionNodes(expressionNodes[targetUid]);
            }

            setRdjParsedExpression.call(this, section, rdjParsedExpression);
          }

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression)
        }
        else {
          reply = createFailureReply([`${section} is not one of the supported value for the "section" parameter! Must be the string "DefaultPolicy" or "Policy".`]);
        }

        return reply;
      }

      function removeParsedExpressionItems(section, removedItems) {
        let reply = {};

        if (isValidSection(section)) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
            if (CoreUtils.isUndefinedOrNull(rdjParsedExpression.children)) {
              rdjParsedExpression = null;
            }
            else {
              let expressionNodes = {};
              for (const removedItem of removedItems.reverse()) {
                expressionNodes[removedItem.uid] = initializeExpressionNodes();
                expressionNodes[removedItem.uid] = findExpressionNodes(
                    [rdjParsedExpression],
                    removedItem.uid,
                    expressionNodes
                );
                removeTargetExpressionNode(expressionNodes[removedItem.uid]);
              }

              if (rdjParsedExpression.children) {
                removeEmptyParsedExpressionChildren(rdjParsedExpression.children);
              }

              const result = spliceEmptyParsedExpressionChildren(rdjParsedExpression);

              if (result.succeeded) {
                rdjParsedExpression = null;
              }
            }

            setRdjParsedExpression.call(this, section, rdjParsedExpression);

            if (rdjParsedExpression === null) setRdjStringExpression.call(this, section, null);
          }

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression)
        }
        else {
          reply = createFailureReply([`${section} is not one of the supported value for the "section" parameter! Must be the string "DefaultPolicy" or "Policy".`]);
        }

        return reply;
      }

      function negateParsedExpressionItems(section, negatedItems) {
        function removeNegateExpressionNode(entry, negatedItem) {
          if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.negateExpressionNode.value.children[entry.negateExpressionNode.index]));
            if (CoreUtils.isNotUndefinedNorNull(relocatedExpressionNode.children)) {
              entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
                relocatedExpressionNode.children[0]
              );
            }
            else if (relocatedExpressionNode.type === 'predicate') {
              Object.assign(entry.negateExpressionNode.value, relocatedExpressionNode);
              delete entry.negateExpressionNode.value.children;
            }
            else {
              entry.negateExpressionNode.value['children'] = [relocatedExpressionNode];
            }
          }
        }

        function negateTargetExpressionNode(entry, negatedItem, toggleDirection) {
          if (toggleDirection === 'on') {
            if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
              if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value.children)) {
                const relocatedExpressionNode = entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index];
                entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index,1,
                  {
                    type: 'negate',
                    children: [relocatedExpressionNode]
                  }
                );
              }
              else {
                // This means we're negating a "predicate" type
                // expression node, which is the only sibling
                // in the RDJ's parsedExpression tree. That means
                // entry.predicateExpressionNode.value directly
                // refers to rdjParsedExpression, so we need to
                // make sure we make all of our changes to the
                // entry.predicateExpressionNode.value JS object.

                // First, make a "deep copy" of the "predicate"
                // expression node.
                const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value));
                // Next, change type: "predicate" to type: "negate".
                entry.predicateExpressionNode.value['type'] = 'negate';
                // Next, add a "children" property that is an
                // array containing relocatedExpressionNode
                entry.predicateExpressionNode.value['children'] = [relocatedExpressionNode];
                // Next, we need to delete the "uid" property that
                // was on the "predicate" type expression node.
                delete entry.predicateExpressionNode.value.uid;
                // Next, we need to delete the "parentUid" property
                // that was on the "predicate" type expression node.
                delete entry.predicateExpressionNode.value.parentUid;
                // Next, we need to delete the "arguments" property
                // that may have been on the "predicate" type
                // expression node.
                delete entry.predicateExpressionNode.value['arguments'];
                // And finally, we need to delete the "name" property
                // that was on the "predicate" type expression node.
                delete entry.predicateExpressionNode.value.name;
              }
            }
            else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
              if (entry.groupExpressionNode.index === -1) {
                // -1 is assigned to entry.groupExpressionNode.index,
                // so the "group" being negated must be the first
                // condition in the policy.
                const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value));
                entry.groupExpressionNode.value['type'] = 'negate';
                entry.groupExpressionNode.value['children'] = [relocatedExpressionNode];
                delete entry.groupExpressionNode.value.uid;
                delete entry.groupExpressionNode.value.parentUid;
              }
              else {
                const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
                entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
                  {
                    type: 'negate',
                    children: [relocatedExpressionNode]
                  }
                );
              }
            }
          }
          else if (toggleDirection === 'off') {
            removeNegateExpressionNode(entry, negatedItem);
          }
        }

        let reply = {};

        if (isValidSection(section)) {
          let rdjParsedExpression = getRdjParsedExpression.call(this, section);

          if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
            let expressionNodes = {}, targetUid;

            const targetUids = negatedItems.map(negatedItem => negatedItem.uid);

            for (let i = 0; i < targetUids.length; i++) {
              // Capture targetUid from targetUids array
              targetUid = targetUids[i];
              // Initialize expressionNodes JS object.
              expressionNodes[targetUid] = initializeExpressionNodes();
              // Call findExpressionNodes() to capture references
              // to the rdjParseExpression node, that will be changed.
              // You must capture and use these node references,
              // because you cannot perform splice operations on
              // array items while searching for them, in the tree.
              // Making changes to the captured node reference, results
              // in the change being made to the tree itself.
              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );
            }

            for (const [targetUid, entry] of Object.entries(expressionNodes).reverse()) {
              const negatedItem = negatedItems.find(item => item.uid === targetUid);
              if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
                // This means the "predicate" condition we're negating
                // has negation turned ON, and we're toggling it OFF.
                negateTargetExpressionNode(entry, negatedItem, 'off');
              }
              else {
                // This means targetUid isn't currently negated,
                // so we are toggling it's negate state to "on".
                negateTargetExpressionNode(entry, negatedItem, 'on');
              }
            }

            setRdjParsedExpression.call(this, section, rdjParsedExpression);
          }

          reply = createSuccessfulReply.call(this, section, rdjParsedExpression)
        }
        else {
          reply = createFailureReply([`${section} is not one of the supported value for the "section" parameter! Must be the string "DefaultPolicy" or "Policy".`]);
        }

        return reply;
      }

    //public:
      PolicyData.prototype = {
        Section: Object.freeze({
          DEFAULT_POLICY: 'DefaultPolicy',
          POLICY: 'Policy'
        }),
        /**
         *
         * @param {'DefaultPolicy'|'Policy'} name
         * @returns {PolicyData.data.DefaultPolicy|PolicyData.data.Policy|undefined}
         */
        getSection: function (name) {
          let rtnval;
          if (isValidSection(name)) {
            rtnval = this.data[name];
          }
          return rtnval;
        },
        /**
         *
         * @param {'Policy'|'DefaultPolicy'} section
         * @param {object} i18n
         * @returns {[{value: string, label: string}]|[]}
         */
        getSupportedPredicatesList: function (section, i18n) {
          function getArguments(predicate, formattedTypes) {
            let formattedType;
            const args = [];
            for (const argument of predicate['arguments']) {
              const arg = {};
              arg['displayName'] = argument.displayName;
              arg['descriptionHTML'] = argument.descriptionHTML;
              arg['array'] = argument.array;
              arg['optional'] = argument.optional;
              formattedType = formattedTypes[predicate.className];
              if (CoreUtils.isNotUndefinedNorNull(formattedType)) {
                const entry = formattedType.find(item => item.displayName === argument.displayName);
                if (CoreUtils.isNotUndefinedNorNull(entry)) {
                  arg['type'] = entry.type;
                  arg['placeholder'] = entry.placeholder;
                }
              }
              args.push(arg);
            }
            return args;
          }

          let supportedPredicatesList = [];

          if (isValidSection(section)) {
            const predicates = getRdjSupportedPredicates.call(this, section);
            if (CoreUtils.isNotUndefinedNorNull(predicates)) {
              const topItems = [
                {value: 'weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate'},
                {value: 'weblogic.console.wls.rest.extension.security.authorization.predicates.GroupPredicate'},
                {value: 'weblogic.console.wls.rest.extension.security.authorization.predicates.UserPredicate'}
              ];
              const formattedTypes = getSupportedPredicateFormattedTypes(i18n);
              const bottomItems = [];
              for (const predicate of predicates) {
                const index = topItems.findIndex(item => item.value === predicate.className);
                const args = getArguments(predicate, formattedTypes);
                if (index !== -1) {
                  topItems[index]['label'] = predicate.displayName;   // label will be used as displayName in the UI
                  topItems[index]['arguments'] = [...args];
                  topItems[index]['descriptionHTML'] = predicate.descriptionHTML;
                }
                else {
                  bottomItems.push({
                    value: predicate.className,
                    label: predicate.displayName,                     // label will be used as displayName in the UI
                    arguments: [...args],
                    descriptionHTML: predicate.descriptionHTML
                  });
                }
              }
              supportedPredicatesList = topItems.concat(bottomItems);
            }
          }
          return supportedPredicatesList;
        },
        /**
         *
         * @param {'DefaultPolicy'|'Policy'} section
         * @returns {[object]|undefined}
         */
        getSupportedPredicates: function (section) {
          let supportedPredicates;
          if (isValidSection(section)) {
            supportedPredicates = getRdjSupportedPredicates.call(this, section);
            supportedPredicates = this.data[section].value.supportedPredicates;
          }
          return supportedPredicates;
        },
        getPredicateArgumentsAsProperties: function (section, name) {
          let properties;
          const predicate = getPredicateByName.call(this, section, name);
          if (CoreUtils.isNotUndefinedNorNull(predicate) &&
              CoreUtils.isNotUndefinedNorNull(predicate['arguments'])
          ) {
            properties = convertPredicateArgumentsToProperties(predicate['arguments']);
          }
          return properties;
        },
        /**
         *
         * @param {'Policy'|'DefaultPolicy'} section
         * @returns {[{uid: number, operator: ''|'or'|'and', expression: string, isChecked: boolean, isCombined: boolean, isNegated: boolean}]}
         */
        getPolicyConditions: function (section) {
          return createPolicyConditions.call(this, section);
        },
        /**
         *
         * @param {'DefaultPolicy'|'Policy'} section
         * @returns {object|null}
         */
        getParsedExpression: function (section) {
          let parsedExpression = null;
          if (isValidSection(section)) {
            parsedExpression = getRdjParsedExpression.call(this, section);
          }
          return parsedExpression;
        },
        /**
         *
         * @param {'DefaultPolicy'|'Policy'} section
         * @returns {string|null}
         */
        getStringExpression: function (section) {
          let stringExpression = null;
          if (isValidSection(section)) {
            stringExpression = getRdjStringExpression.call(this, section);
          }
          return stringExpression;
        },
        /**
         * Adds a new condition to the specified `section` of the `parsedExpression` tree, using data in the `predicateItem` parameter.
         * @param {object} data
         * @param {'Policy'|'DefaultPolicy'} section
         * @param {{PolicyCondition}} predicateItem
         * @returns {{succeeded: boolean, failure?: {messages: [{message: string, severity: string}]}, policyConditions?: [PolicyCondition]}}
         * @example
         * const section = 'Policy';
         * const predicateItem = {
         *   "uid": "0",
         *   "parentUid": "-1",
         *   "operator": "none",
         *   "expression": "Group: grp11",
         *   "options": {
         *     "negated": false,
         *     "combined": false,
         *     "deleted": false,
         *     "insertion": {
         *       "type": "above",
         *       "operator": "or",
         *       "checkedItem": {"uid": "0", "parentUid": "-1"},
         *       "addedItem": {"uid": "0", "parentUid": "-1"}
         *     }
         *   },
         *   "predicate": {
         *     "name": "weblogic.entitlement.rules.IDDGroup",
         *     "arguments": [
         *       {"value": "grp7" ,"array": false, "displayName": "Group Name Argument", "optional": false, "type": "string", "placeholder": ""},
         *       {"value": "domain1", "array": false, "displayName": "Identity Domain Argument", "optional": false, "type": "string", "placeholder": ""}
         *     ]
         *   }
         *  }
         * };
         * const results = this.policyData().addPolicyCondition(section, predicateItem);
         */
        addPolicyCondition: (data, section, predicateItem) => {
          return addPredicateItem.call(data, section, predicateItem);
        },
        /**
         * Modify a previously saved condition from the specified `section` of the `parsedExpression` tree, using data in the `predicateItem` parameter.
         * @param {object} data - Referencf;e to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'Policy'|'DefaultPolicy'} section
         * @param {{PolicyCondition}} predicateItem
         * @returns {{succeeded: boolean, failure?: {messages: [{message: string, severity: string}]}, policyConditions?: [PolicyCondition]}}       * @example
         * const section = 'Policy';
         * const predicateItem = {
         *   "uid": "7",
         *   "parentUid": "5",
         *   "operator": "none",
         *   "expression": "Group has the same Identity Domain as the specified Identity Domain: ("grp1","domain1","grp5")",
         *   "options": {
         *    "negated": false,
         *    "combined": false
         *   },
         *   "predicate": {
         *     "name": "weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate",
         *     "arguments": [
         *       {"value": "grp7" ,"array": false, "displayName": "Group Name Argument"},
         *       {"value": "domain1", "array": false, "displayName": "Identity Domain Argument"}
         *     ]
         *   }
         *  }
         * };
         * const results = this.policyData().updatePolicyCondition(section, predicateItem);
         */
        updatePolicyCondition: (data, section, predicateItem) => {
          return updatePredicateItem.call(data, section, predicateItem);
        },
        /**
         *
         * @param {object} data - Reference to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'DefaultPolicy'|'Policy'} section
         * @param {CombinedItems} combinedItems
         * @param {CombinedItems} relocatedItems
         * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, combinedUids: CombinedItems}}}
         */
        combinePolicyConditions: (data, section, combinedItems, relocatedItems) => {
          return combinePredicateItems.call(data, section, combinedItems, relocatedItems);
        },
        /**
         *
         * @param {object} data - Reference to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'DefaultPolicy'|'Policy'} section
         * @param {CombinedItems} combinedItems
         * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, uncombinedUids: UncombinedUids}}}
         */
        uncombinePolicyConditions: (data, section, combinedItems) => {
          return uncombinePredicateItem.call(data, section, combinedItems);
        },
        /**
         *
         * @param {object} data - Reference to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'DefaultPolicy'|'Policy'} section
         * @param {[{beforeUid: string, afterUid: string}]} recomputedUids
         * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, recomputedUids: RecomputedUids}}}
         */
        moveConditions: (data, section, recomputedUids) => {
          const reply = {succeeded: false};
          reply.succeeded = true;
          reply['recomputedUids'] = recomputedUids;
          return reply;
        },
        /**
         *
         * @param {object} data - Reference to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'DefaultPolicy'|'Policy'} section
         * @param {[{RemovedUids}]} removedItems
         * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, removedUids: RemovedUids, recomputedUids: RecomputedUids}}}
         * @example
         * const section = 'Policy';
         * const removedUids = [
         *  {"uid": "3", "parentUid": "2"}
         * ];
         * const results = this.policyData().removeConditions(section, removedItems);
         */
        removeConditions: (data, section, removedItems) => {
          return removeParsedExpressionItems.call(data, section, removedItems);
        },
        /**
         *
         * @param {object} data - Reference to the object to bind the `this` variable to, when anonymous JS functions are at play.
         * @param {'DefaultPolicy'|'Policy'} section
         * @param {[{NegatedItems}]} negatedItems
         * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, removedUids: RemovedUids, negatedUids: NegatedUids}}}
         * @example
         * const section = 'Policy';
         * const negatedItems = [
         *  {"uid": "2", "parentUid": "-1", "previousValue": false, "value": true},
         *  {"uid": "4", "parentUid": "2", "previousValue": true, "value": false}
         * ];
         * const results = this.policyData().negateConditions(section, negatedItems);
         */
        negateConditions: (data, section, negatedItems) => {
          return negateParsedExpressionItems.call(data, section, negatedItems);
        }

      };

      // Return the class constructor
      return PolicyData;
    }
);