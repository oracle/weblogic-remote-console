define(['wrc-frontend/microservices/policy-management/parsed-expression-tree', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/microservices/policy-management/policy-data', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ParsedExpressionTree, PolicyManager, PolicyData, CoreUtils, CfeErrors) {

    describe("addCondition Use Cases Tests", function () {
      const fixturesMap = {
        "no-value": "microservices/policy-management/UseCaseTests/no-value-rdjData.json",
        "null-parsedExpression": "microservices/policy-management/UseCaseTests/null-parsedExpression-rdjData.json",
        "undefined-parsedExpression": "microservices/policy-management/UseCaseTests/undefined-parsedExpression-rdjData.json"
      };

      let rdjData, fixturesMapKey = "null-parsedExpression";

      describe("Use fixturesMap and fixturesMapKey to load rdjData fixture file.", function () {
        rdjData = fixture.load(fixturesMap[fixturesMapKey]);
        fixture.cleanup();
      });

      let policyData;

      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });

      describe("UC-001: Create initial expression under Policy.value.parsedExpression.", function () {
        let predicateItem, results;

        describe("Set predicateItem variable from fixtures/microservices/policy-management/UseCaseTests/addCondition/UC-001-predicateItem.json fixture file.", function () {
          predicateItem = fixture.load('microservices/policy-management/UseCaseTests/addCondition/UC-001-predicateItem.json');
          fixture.cleanup();
        });

        it('Returned results should contain succeeded=true property', function() {
          results = policyData.addPolicyCondition(policyData, 'Policy', predicateItem);
console.log(`SUCCEEDED = ${results.succeeded}`);
          expect(results.succeeded).to.equal(true);
        });

        it('Returned results should contain a non-empty parsedExpression."', function() {
console.log(`PARSED_EXPRESSION = ${JSON.stringify(results.parsedExpression)}`);
        });

        it('Returned result.policyConditions array should have 1 elements, regardless of value assigned to fixturesMapKey variable."', function() {
console.log(`POLICY_CONDITIONS = ${JSON.stringify(results.policyConditions)}`);
          expect(results.policyConditions.length).to.equal(1);
        });

      });

    });

  }
);