/**
 * @license
 * Copyright (c) 2022,2023, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

'use strict';

define(['text!./policy-conditions.json', './parsed-expression-tree', 'wrc-frontend/microservices/policy-management/condition-phraser', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function(jsonData, ParsedExpressionTree, ConditionPhraser, CoreUtils, CfeErrors){
    /**
     * Creates a new `PolicyData` object from the `data` field in the RDJ
     * @param {{DefaultPolicy, object, Policy: object}} data
     * @constructor
     * @throws {InvalidParameterError} If value of `data`is `undefined` or `null`.
     */
    function PolicyData(data){
      this.data = data;
      this.parsedExpressionTree = new ParsedExpressionTree(data);
//MLW      console.info(JSON.stringify(data));
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

    function getInitialParentUids(rdjParsedExpression) {
      let parentUids = [-1];
      if (rdjParsedExpression.type !== 'predicate') {
        const index = rdjParsedExpression.children.map(child => child.type).indexOf('group');
        if (index !== -1) {
          parentUids.splice(index, '0');
        }
      }
      return parentUids;
    }

    function processNonNullRDJParsedExpression(rdjParsedExpression, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids) {
      let parentUids = [-1];
      // Don't make a "deep copy" of the JS object returned from
      // the getRdjParsedExpression() function! If you do, the
      // uid and parentUid properties are not going to be in
      // the object returned from the same getRdjParsedExpression()
      // call made in the updatePredicateItem() function.

      if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
        // This means the root node of the RDJ's parsedExpression
        // tree has a children property.

        if (rdjParsedExpression.type !== 'negate') {
          // Only push rdjParsedExpression.type onto typesStack, if
          // value assigned to rdjParsedExpression.type isn't "negate".
          typesStack.push(rdjParsedExpression.type);
          typesUidMap['' + uidsMap.uid[0]] = {operator: rdjParsedExpression.type};
        }
        else {
          negatedUids.push('' + uidsMap.uid[0]);
        }

/*
//MLW
        const index = rdjParsedExpression.children.map(item => item.type).indexOf('group');
        if (index === 0) {
          typesStack.pop();
          insertUids([rdjParsedExpression], uidsMap, parentUids, typesStack, typesUidMap, groupsUidMap, negatedUids);
        }
        else {
          // Call the tail-recursion function that inserts uid and
          // parentUid properties, to some parsedExpression tree
          // nodes.
          insertUids(rdjParsedExpression.children, uidsMap, parentUids, typesStack, typesUidMap, groupsUidMap, negatedUids);
        }
*/
        // Call the tail-recursion function that inserts uid and
        // parentUid properties, to some parsedExpression tree
        // nodes.
        insertUids(rdjParsedExpression.children, uidsMap, parentUids, typesStack, typesUidMap, groupsUidMap, negatedUids);
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
                if (hasSplittableArgumentValues(child.name)) {
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

        // Prevent people from using the old console to
        // perform "Combine" and "Uncombine" actions, until
        // we enable those buttons above the new Policy
        // Editor :-)
/*
//MLW
        if (Object.keys(groupsUidMap).length > 0) {
          return;
        }
*/
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

              const isGroupLastSibling = (CoreUtils.isNotUndefinedNorNull(groupsUidMap[child.parentUid]) && (groupsUidMap[child.parentUid].lastSibling.uid === child.uid));

              if (isGroupLastSibling) {
                policyCondition.isLastSibling = true;
                // child.parentUid will be the groupsUidMap key
                // we need, in order to get the joiner.
                policyCondition.joiner = groupsUidMap[child.parentUid].lastSibling.joiner;
              }
              else {
                policyCondition.joiner = typesUidMap[child.uid].operator;
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
        let uidsMap = {uid: [0], lastSiblingUid: [0]};
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
          transformParsedExpression(section, rdjParsedExpression.children, policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
        }
        else {
          transformParsedExpression(section, [rdjParsedExpression], policyConditions, uidsMap, typesStack, typesUidMap, groupsUidMap, negatedUids);
        }
      }

      return policyConditions;
    }

    /**
     *
     * @returns {{negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}}
     * @private
     */
    function initializeExpressionNodes() {
      return {
        negateExpressionNode: {value: null, index: -1},
        groupExpressionNode: {value: null, index: -1},
        predicateExpressionNode: {value: null, index: -1}
      };
    }

    /**
     *
     * @param {[ParsedExpressionNode]} parsedExpression
     * @param {string} targetUid
     * @param {{negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}} expressionNodes
     * @returns {{negateExpressionNode: {value: ParsedExpressionNode|null, index: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}}
     * @private
     */
    function findExpressionNodes(parsedExpression, targetUid, expressionNodes) {
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
            if (child.children[index].type === 'predicate') {
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
          // See if child.children contains an object with
          // "negate" assigned to the type property.
          let index = child.children.map(item => item.type).indexOf('negate');
          if (index !== -1) {
            // It does have an object like that, so see if
            // child.children[index].children has an object
            // with a uid property equal to targetUid.
            const index1 = child.children[index].children.map(item => item.uid).indexOf(targetUid);
            if (index1 !== -1) {
              // It does have an object with a uid equak to
              // targetUid, so go ahead and set the data for
              // the "negate" expression node.
              setNegateExpressionNode(child, index, expressionNodes[targetUid], targetUid);
            }
          }

          children = [...child.children];
          findExpressionNodes(children, targetUid, expressionNodes);
        }
      }

      return expressionNodes[targetUid];
    }

    function getRootExpressionNode(expressionNodes, targetUid) {
      const entry = expressionNodes[targetUid];
      const rootExpressionNode = {
        index: -1,
        value: {children: null}
      };
      if (entry.negateExpressionNode.value !== null) {
        rootExpressionNode.index = entry.negateExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
        rootExpressionNode.value = entry.negateExpressionNode.value;
      }
      else if (entry.predicateExpressionNode.value !== null) {
        rootExpressionNode.index = entry.predicateExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
        rootExpressionNode.value = entry.predicateExpressionNode.value;
      }
      else if (entry.groupExpressionNode.value !== null) {
        rootExpressionNode.index = entry.groupExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
        rootExpressionNode.value = entry.groupExpressionNode.value;
      }
      return rootExpressionNode;
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
     * @param {{uid: [number], lastSiblingUid: [number]}} uidsMap
     * @param {[number]} parentUids
     * @param {[string]} typesStack
     * @param {object} typesUidMap
     * @param {object} groupsUidMap
     * @param {[string]} negatedUids
     */
    function insertUids(parsedExpression, uidsMap, parentUids, typesStack, typesUidMap, groupsUidMap, negatedUids) {
      let children = [];
      return parsedExpression.map((child, index) => {
        if (child.type === 'predicate') {
          child.uid = '' + uidsMap.uid[0];
          child.parentUid = '' + parentUids.at(-1);
          // The value of index will be "1", if we need to
          // do a parentUids.pop(). parentUids always has
          // "-1" as the first array item, so we care about
          // there being more that 1 array item.
          if (index === 1 && parentUids.length > 1) {
            parentUids.pop();
          }
/*
//MLW
          if (child.parentUid !== '' + parentUids.at(-1)) {
            // This mean we did the parentUids.pop(), and we
            // have to update child.parentUid. You only do
            // that if the children array isn't empty.
            if (children.length > 0) {
              child.parentUid = '' + parentUids.at(-1);
            }
          }
*/
          if (CoreUtils.isUndefinedOrNull(typesUidMap['' + uidsMap.uid[0]])) {
            let operator;
            if (child.parentUid !== '-1') {
              // When child.parentUid !== '-1', we need to get the value
              // for typesUidMap['' + uidsMap.uid[0]].operator from
              // groupsUidMap[child.parentUid].lastSibling.joiner
              operator = groupsUidMap[child.parentUid].lastSibling.joiner;
              // We also need to update the lastSibling.uid property
              // of the "group" expression node.
              groupsUidMap[child.parentUid].lastSibling.uid = child.uid;
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
          child.parentUid = '' + parentUids.at(-1);
          groupsUidMap[child.uid] = {
            parentUid: child.parentUid,
            lastSibling: {
              uid: '-1',
              joiner: typesStack.at(typesStack.length - 1)
            },
            policyCondition: null
          };
          // Add entry for "group" expression node to
          // typesUidMap. Be sure to use the cooresponding
          // groupsUidMap entry's lastSibling.joiner, for
          // the operator.
          typesUidMap[child.uid] = {operator: groupsUidMap[child.uid].lastSibling.joiner};
          // Need to push ~~child.uid onto parentUids, or
          // else the parentUid assigned to the group siblings
          // will be wrong...and they will get put under the
          // wrong "Combination" policy condition!
          parentUids.push(~~child.uid);
          // Update uidsMap.lastSiblingUid[0], because this
          // is a tail-recursion function. You don't know
          // what the lastSiblingUid is going to be, so
          // each recursion can only say what the last one
          // is, at this point :-)
          uidsMap.lastSiblingUid[0] = uidsMap.uid[0];
          // Increment uuidsMap.uid[0] by 1, so the
          // next uid getting assigned is correct.
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
          insertUids(children, uidsMap, parentUids, typesStack, typesUidMap, groupsUidMap, negatedUids);
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
            delete child.uid;
            delete child.parentUid;
            if (child.children) {
              children = [...child.children];
              removeUidsForEach(children);
            }
          });
        };
        if (parsedExpression) {
          removeUidsForEach(parsedExpression);
        }
      };

      // Initialize return value to undefined
      let pristineParsedExpression = null;

      if (CoreUtils.isNotUndefinedNorNull(parsedExpression)) {
        // This means the parsedExpression parameter passed
        // to us wasn't undefined, so we can go through the
        // trouble of creating a "deep copy" to work on.

        pristineParsedExpression = JSON.parse(JSON.stringify(parsedExpression));

        if (CoreUtils.isNotUndefinedNorNull(pristineParsedExpression.children)) {
          // Call tail-recursion function that removes every
          // uid and parentUid property it finds, in the
          // parsedExpression tree.
          removeUidsAndParentUids(pristineParsedExpression.children);
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
          const relocatedExpressionNode = entry.negateExpressionNode.value.children[entry.negateExpressionNode.index];
          entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
            {
              type: predicateItem.options.insertion.parentExpression.type,
              children: [newExpressionNode, relocatedExpressionNode]
            }
          );
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
          if (entry.predicateExpressionNode.value.type === 'negate') {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value));
            entry.predicateExpressionNode.value['children'] = [newExpressionNode, relocatedExpressionNode];
            entry.predicateExpressionNode.value['type'] = predicateItem.options.insertion.parentExpression.type;
          }
          else {
            const relocatedExpressionNode = entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index];
            entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index,1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [newExpressionNode, relocatedExpressionNode]
              }
            );
          }
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
          if (entry.groupExpressionNode.value.type === 'negate') {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value));
            entry.groupExpressionNode.value = {
              type: predicateItem.options.insertion.parentExpression.type,
              children: [newExpressionNode, relocatedExpressionNode]
            };
          }
          else {
            const relocatedExpressionNode = entry.groupExpressionNode.value.children[entry.groupExpressionNode.index];
            entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index,1,
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [newExpressionNode, relocatedExpressionNode]
              }
            );
          }
        }
      };

      const insertNewExpressionBeforeExistingSibling = (predicateItem, entry, newExpressionNode) => {
        if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
          if (entry.predicateExpressionNode.value.type === 'negate') {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value));
            entry.predicateExpressionNode.value['children'] = [newExpressionNode, relocatedExpressionNode];
            entry.predicateExpressionNode.value['type'] = predicateItem.options.insertion.parentExpression.type;
            delete entry.predicateExpressionNode.value.uid;
            delete entry.predicateExpressionNode.value.parentUid;
            delete entry.predicateExpressionNode.value['arguments'];
            delete entry.predicateExpressionNode.value.name;
          }
          else {
            const relocatedExpressionNode = entry.predicateExpressionNode.value.children.splice(entry.predicateExpressionNode.index, 1);
            entry.predicateExpressionNode.value.children.push(
              {
                type: predicateItem.options.insertion.parentExpression.type,
                children: [newExpressionNode, relocatedExpressionNode[0]]
              }
            );
          }
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
          if (entry.groupExpressionNode.value.type === 'negate') {
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value));
            entry.groupExpressionNode.value['children'] = [newExpressionNode, relocatedExpressionNode];
            entry.groupExpressionNode.value['type'] = predicateItem.options.insertion.parentExpression.type;
            delete entry.groupExpressionNode.value.uid;
            delete entry.groupExpressionNode.value.parentUid;
            delete entry.groupExpressionNode.value['arguments'];
            delete entry.groupExpressionNode.value.name;
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
          if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
            entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
              {
                type: entry.negateExpressionNode.value.type,
                children: [entry.predicateExpressionNode.value, newExpressionNode]
              }
            );
          }
          else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
            // This means newExpressionNode will not be a child
            // expression node, inside groupExpressionNode. It
            // will be a sibling of groupExpressionNode, which
            // means we need to splice newExpressionNode into
            // the entry.negateExpressionNode.value.children[1]
            // array element.
            entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1,
              {
                type: entry.negateExpressionNode.value.type,
                children: [entry.groupExpressionNode.value, newExpressionNode]
              }
            );
          }
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
          const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
          entry.groupExpressionNode.value.children.splice(
            entry.groupExpressionNode.index, 1,
            {
              type: predicateItem.options.insertion.parentExpression.type,
              children: [relocatedExpressionNode, newExpressionNode]
            }
          );
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
              break;
            case 'above':
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
              break;
            case 'below':
              if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)) {
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
      function performExpressionUpdate(predicateItem, entry) {
        if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.value)) {
          // This means we're on "predicate" expression node
          // that has been negated. You need to be on the
          // "negate" expression node in order to modify
          // the operator for the predicateItem.
          if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator)) {
            entry.negateExpressionNode.value.type = predicateItem.operator;
          }

          const parsedExpressionPredicate = entry.negateExpressionNode.value.children[entry.negateExpressionNode.index].children[0];
          if (CoreUtils.isNotUndefinedNorNull(parsedExpressionPredicate['arguments'])) {
            parsedExpressionPredicate['arguments'] = getPredicateArgumentValues(predicateItem.predicate);
          }
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
          if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value.children) &&
              CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]) &&
              CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]['arguments'])
          ) {
            entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]['arguments'] = getPredicateArgumentValues(predicateItem.predicate);
          }
          else if (CoreUtils.isNotUndefinedNorNull(predicateItem.predicate['arguments'])) {
            entry.predicateExpressionNode.value['arguments'] = getPredicateArgumentValues(predicateItem.predicate);
          }

          if (CoreUtils.isNotUndefinedNorNull(predicateItem.operator) &&
              (entry.predicateExpressionNode.value.type !== predicateItem.operator)
          ) {
            entry.predicateExpressionNode.value.type = predicateItem.operator;
          }
        }
      }

      let reply = {};

      const validatePredicateItemResults = validatePredicateItem(predicateItem);

      if (validatePredicateItemResults.isValid) {
        let rdjParsedExpression = getRdjParsedExpression.call(this, section);

        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
          const targetUid = predicateItem.uid;

          let expressionNodes = {};

          expressionNodes[targetUid] = initializeExpressionNodes();

          // We need to pass rdjParsedExpression as an
          // array, because insertUids works
          // exclusively with array objects.
          expressionNodes[targetUid] = findExpressionNodes(
            [rdjParsedExpression],
            targetUid,
            expressionNodes
          );

          performExpressionUpdate(
            predicateItem,
            expressionNodes[targetUid]
          );

          setRdjParsedExpression.call(this, section, rdjParsedExpression);
        }

        reply = createSuccessfulReply.call(this, section, rdjParsedExpression, predicateItem)
      }
      else {
        reply = createFailureReply(validatePredicateItemResults.failureReasons);
      }

      return reply;
    }

    function combinePredicateItems(section, combinedItems) {
      /**
       *
       * @param {ParsedExpressionNode} rdjParsedExpression
       * @param {{negateExpressionNode: {value: ParsedExpressionNode|null, index?: number, targetUid?: string}, predicateExpressionNode: {value: ParsedExpressionNode|null, index: number}, groupExpressionNode: {value: ParsedExpressionNode|null, index: number}}} expressionNodes
       * @param {CombinedItems} combinedItems
       * @returns {{targetExpressionNode: {parentUid, uid, children, type}, index: number}}
       * @private
       */
      const combineExpressionNodes = (rdjParsedExpression, expressionNodes, combinedItems) => {

        function combineNewExpressionNode(entry, targetUid, newExpressionNode, excludedExpressionNodes) {
          if (entry.negateExpressionNode.value !== null) {
            const index = entry.negateExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
            newExpressionNode.children.push(entry.negateExpressionNode.value.children[index]);
            newExpressionNode.type = entry.negateExpressionNode.value.type;
            excludedExpressionNodes.push(entry.negateExpressionNode.value.children[1]);
          }
          else if (entry.predicateExpressionNode.value !== null) {
            const index = entry.predicateExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
            newExpressionNode.children.push(entry.predicateExpressionNode.value.children[index]);
            newExpressionNode.type = entry.predicateExpressionNode.value.type;
            excludedExpressionNodes.push(entry.predicateExpressionNode.value.children[1]);
          }
          else if (entry.groupExpressionNode.value !== null) {
            const index = entry.groupExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
            newExpressionNode.children.push(entry.groupExpressionNode.value.children.at(0));
            newExpressionNode.type = entry.groupExpressionNode.value.type;
            excludedExpressionNodes.push(entry.groupExpressionNode.value.children[1]);
          }
          return excludedExpressionNodes.filter(item => CoreUtils.isNotUndefinedNorNull(item.uid) && item.uid !== targetUid);
        }

        let newExpressionNode = {children: [], type: null};
        let excludedExpressionNodes = [];

        for (const [targetUid, entry] of Object.entries(expressionNodes)) {
          excludedExpressionNodes = combineNewExpressionNode(
            entry,
            targetUid,
            newExpressionNode,
            excludedExpressionNodes
          );
        }

        return {
          rootExpressionNode: getRootExpressionNode(
            expressionNodes,
            combinedItems.at(0).uid
          ),
          newExpressionNode: {
            children: JSON.parse(JSON.stringify(newExpressionNode.children)),
            type: newExpressionNode.type
          },
          excludedExpressionNodes: JSON.parse(JSON.stringify(excludedExpressionNodes))
        };

      };

      let reply = {};

      if (isValidSection(section)) {
        let rdjParsedExpression = getRdjParsedExpression.call(this, section);

        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression) &&
          CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)
        ) {
          const haveSameParentUid = (combinedItems.filter(combinedItem => combinedItem.parentUid !== combinedItems[0].parentUid).length === 0);

          if (haveSameParentUid) {
            let expressionNodes = {}, targetUid;

            const targetUids = combinedItems.map(combinedItem => combinedItem.uid);

            for (let i = 0; i < targetUids.length; i++) {
              targetUid = targetUids[i];
              expressionNodes[targetUid] = initializeExpressionNodes();

              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );
            }

            let results = combineExpressionNodes(
              rdjParsedExpression,
              expressionNodes,
              combinedItems
            );

            if (results.rootExpressionNode.value.children.length > 0) {
              const index = results.rootExpressionNode.index;
              // Remove everything from results.rootExpressionNode.value.children
              results.rootExpressionNode.value.children.splice(index, 2);
              results.rootExpressionNode.value['children'] = [{
                children: results.newExpressionNode.children,
                type: results.newExpressionNode.type
              }];
              results.rootExpressionNode.value['type'] = 'group';
              results.rootExpressionNode.value['uid'] = combinedItems.at(0).uid;
              results.rootExpressionNode.value['parentUid'] = combinedItems.at(0).parentUid;

              if (results.excludedExpressionNodes.length > 0) {
                results.rootExpressionNode.value.children[index].children[1] = results.excludedExpressionNodes[0];
              }
            }
//MLW            setRdjParsedExpression.call(this, section, rdjParsedExpression);
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
      function getNewExpressionNode(entry, targetUid) {
        let newExpressionNode = {children: null, type: null};
        if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.targetUid) && (entry.negateExpressionNode.targetUid === targetUid)) {
          const index = entry.negateExpressionNode.value.children[entry.negateExpressionNode.index].children.map(item => item.uid).indexOf(targetUid);
          if (index !== -1) {
            entry.groupExpressionNode.index = index;
            const children = entry.negateExpressionNode.value.children[entry.negateExpressionNode.index].children[index];
            entry.groupExpressionNode.value = {
              children: JSON.parse(JSON.stringify([children])),
              type: entry.negateExpressionNode.value.type
            };
          }
        }

        if (entry.groupExpressionNode.value !== null) {
          const children = entry.groupExpressionNode.value.children[entry.groupExpressionNode.index].children;
          newExpressionNode.children = JSON.parse(JSON.stringify(children[0].children));
          newExpressionNode.type = entry.groupExpressionNode.value.type;
          const relocatedExpressionNode = newExpressionNode.children.splice(1,1);
          newExpressionNode.children.push(relocatedExpressionNode[0]);
          entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index,1,newExpressionNode);
          entry.groupExpressionNode.value.type = children[0].type;
        }

        return newExpressionNode;
      }

      let reply = {};

      if (isValidSection(section)) {
        let rdjParsedExpression = getRdjParsedExpression.call(this, section);

        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression) &&
          CoreUtils.isNotUndefinedNorNull(rdjParsedExpression.children)
        ) {
          let expressionNodes = {}, targetUid;
          let newExpressionNode = {children: [], type: null};

          const targetUids = combinedItems.map(combinedItem => combinedItem.uid);

          for (let i = 0; i < targetUids.length; i++) {
            targetUid = targetUids[i];
            expressionNodes[targetUid] = initializeExpressionNodes();

            expressionNodes[targetUid] = findExpressionNodes(
              [rdjParsedExpression],
              targetUid,
              expressionNodes
            );

            newExpressionNode = getNewExpressionNode(
              expressionNodes[targetUid],
              targetUid
            );
          }

          if (CoreUtils.isNotUndefinedNorNull(newExpressionNode.children)) {
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

    function removeParsedExpressionItems(section, removedItems) {
      function removeExistingExpressionNode(entry, targetUid) {
        if (CoreUtils.isNotUndefinedNorNull(entry.negateExpressionNode.targetUid) && (entry.negateExpressionNode.targetUid === targetUid)) {
          entry.negateExpressionNode.value.children.splice(entry.negateExpressionNode.index, 1);
          entry.negateExpressionNode.value.children = entry.negateExpressionNode.value.children[0].children;
        }
        else if (entry.groupExpressionNode.value !== null) {
          const index = entry.groupExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
          if (index !== -1) {
            entry.groupExpressionNode.value.children.splice(index, 1);
          }
        }
        else if (entry.predicateExpressionNode.value !== null) {
          const index = entry.predicateExpressionNode.value.children.map(item => item.uid).indexOf(targetUid);
          if (index !== -1) {
            entry.predicateExpressionNode.value.children.splice(index, 1);
          }
        }
      }

      let reply = {};

      if (isValidSection(section)) {
        let rdjParsedExpression = getRdjParsedExpression.call(this, section);

        if (CoreUtils.isNotUndefinedNorNull(rdjParsedExpression)) {
          if (CoreUtils.isUndefinedOrNull(rdjParsedExpression.children)) {
            rdjParsedExpression = null;
          }
          else {
            const targetUids = removedItems.reverse().map(removedItem => removedItem.uid);

            let expressionNodes = {}, targetUid;
            for (let i = 0; i < targetUids.length; i++) {
              targetUid = targetUids[i];
              expressionNodes[targetUid] = initializeExpressionNodes();

              expressionNodes[targetUid] = findExpressionNodes(
                [rdjParsedExpression],
                targetUid,
                expressionNodes
              );

              removeExistingExpressionNode(
                expressionNodes[targetUid],
                targetUid
              );
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
      function removeNegateExpressionNode(entry) {
        if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
          const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.predicateExpressionNode.value.children[entry.predicateExpressionNode.index]));
          Object.assign(entry.predicateExpressionNode.value, relocatedExpressionNode);
          delete entry.predicateExpressionNode.value.children;
        }
        else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
          const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
          Object.assign(entry.groupExpressionNode.value, relocatedExpressionNode);
        }
      }

      function negateTargetExpressionNode(entry, toggleDirection) {
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
            const relocatedExpressionNode = JSON.parse(JSON.stringify(entry.groupExpressionNode.value.children[entry.groupExpressionNode.index]));
            entry.groupExpressionNode.value.children.splice(entry.groupExpressionNode.index, 1,
              {
                type: 'negate',
                children: [relocatedExpressionNode]
              }
            );
          }
        }
        else if (toggleDirection === 'off') {
          removeNegateExpressionNode(entry);
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
            if (CoreUtils.isNotUndefinedNorNull(entry.predicateExpressionNode.value)) {
              if (entry.predicateExpressionNode.value.type === 'negate') {
                // This also means targetUid is currently negated, so
                // we are toggling it's negate state to 'off'.
                negateTargetExpressionNode(entry, 'off');
              }
              else {
                // This means targetUid isn't currently negated,
                // so we are toggling it's negate state to "on".
                negateTargetExpressionNode(entry, 'on');
              }
            }
            else if (CoreUtils.isNotUndefinedNorNull(entry.groupExpressionNode.value)) {
              if (entry.groupExpressionNode.value.type === 'negate') {
                // This also means targetUid is currently negated, so
                // we are toggling it's negate state to 'off'.
                negateTargetExpressionNode(entry, 'off');
              }
              else {
                // This also means targetUid isn't currently negated,
                // so we are toggling it's negate state to "on".
                negateTargetExpressionNode(entry, 'on');
              }
            }
            else {
              // This means targetUid isn't currently negated,
              // so we are toggling it's negate state to "on".
              negateTargetExpressionNode(entry, 'on');
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
       * @param {{name: string, arguments: [{value: string, array: boolean, displayName: string}],options: {negated: boolean, location?: {at: {uid: string}|above: {uid: string}|below: {uid: string}}}}} predicateItem
       * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|policyConditions?: {PolicyCondition}}}
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
       * @param {{uid: string, operator: string, expression: string, options: {negated: boolean}, predicate: {name: string, arguments: [{value: string, array: boolean, displayName: string}]}}} predicateItem
       * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|policyConditions?: {PolicyCondition}}}
       * @example
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
       * @returns {{succeeded: boolean,failure?: { messages: [{message: string, severity: string}]}|{succeeded: boolean, parsedExpression: object, combinedUids: CombinedUids}}}
       */
      combinePolicyConditions: (data, section, combinedItems) => {
        return combinePredicateItems.call(data, section, combinedItems);
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