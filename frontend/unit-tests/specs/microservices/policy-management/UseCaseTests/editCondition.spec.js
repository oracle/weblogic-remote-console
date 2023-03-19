define(['wrc-frontend/microservices/policy-management/parsed-expression-tree', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/microservices/policy-management/policy-data', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ParsedExpressionTree, PolicyManager, PolicyData, CoreUtils, CfeErrors) {

    describe("editCondition Use Cases Tests", function () {
      const rdjDataWrapper = {data: {}};

      const fixturesMap = {
        "kitchen-sink": "microservices/policy-management/UseCaseTests/kitchen-sink.json",
        "single-combine": "microservices/policy-management/UseCaseTests/single-combine-policy.json",
        "no-predicate-arguments": "microservices/policy-management/UseCaseTests/no-predicate-arguments.json"
      };

      let rdjData, fixturesMapKey = "no-predicate-arguments";

      describe("Use fixturesMap and fixturesMapKey to load rdjData fixture file.", function () {
        rdjDataWrapper.data = fixture.load(fixturesMap[fixturesMapKey]);
        rdjData = JSON.parse(JSON.stringify(rdjDataWrapper));
        fixture.cleanup();
      });

      let policyData;

      describe("createPolicyData", function () {
        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          policyData = PolicyManager.createPolicyData(rdjData);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });

      describe("UC-nnn: <use-case-description>", function () {
      });

    });

  }
);