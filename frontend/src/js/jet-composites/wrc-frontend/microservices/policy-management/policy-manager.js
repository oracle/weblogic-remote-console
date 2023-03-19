/**
 * @license
 * Copyright (c) 2022, 2023 Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
'use strict';

define(['./policy-data', 'wrc-frontend/apis/data-operations', 'wrc-frontend/core/utils'],
  function(PolicyData, DataOperations, CoreUtils) {
    function createPolicyDataFromEntry(rdjData) {
      let policyData;
      if (CoreUtils.isNotUndefinedNorNull(rdjData)) {
        policyData = new PolicyData(rdjData.data);
      }
      return policyData;
    }

  //public:
    return {
      /**
       *
       * @param {object} rdjData
       * @returns {PolicyData|undefined}
       */
      createPolicyData: function (rdjData) {
        return createPolicyDataFromEntry(rdjData);
      },

      /**
       * Submits the policy changes.
       * @param {{Policy: value: {parsedExpression: ParsedExpressionNode}}} fieldValue
       * @param {string} stringExpression
       * @param {string} rdjUrl
       * @returns {Promise<{object}>}
       */
      submitPolicyChange: async function (fieldValue, stringExpression, rdjUrl) {
        // Wrap the fieldValue parameter in a dataPayload
        // JS object.
        const dataPayload = {
          data: fieldValue
        };

        return DataOperations.policy.submitPolicyChange(rdjUrl, dataPayload);
      },

      validatePolicyChange: async function (policyData, parsedExpression, stringExpression, rdjUrl) {
        // Wrap the parsedExpression parameter in a dataPayload
        // JS object. It's fine to hard-code "Policy" as the
        // section, because "DefaultPolicy" sections are not
        // updatabble! In other words, they are "read-only"
        // with regards to the CFE and CBE protocol :-)
        const dataPayload = {
          data: {
            Policy: {
              value: {parsedExpression: parsedExpression}
            }
          }
        };


        return DataOperations.policy.submitPolicyChange(rdjUrl, dataPayload)
          .then(reply => {
            return Promise.resolve({
              succeeded: true
            });
          });
      }

    };

  }
);