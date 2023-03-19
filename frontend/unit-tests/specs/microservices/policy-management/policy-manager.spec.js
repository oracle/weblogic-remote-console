define(['wrc-frontend/microservices/policy-management/parsed-expression-tree', 'wrc-frontend/microservices/policy-management/policy-manager', 'wrc-frontend/microservices/policy-management/policy-data', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ParsedExpressionTree, PolicyManager, PolicyData, CoreUtils, CfeErrors) {

    describe("PolicyManager Tests", function () {
      let rdjData;

      describe("Set rdjData variable from microservices/policy-management/initial-root-level-policy.json fixture file.", function () {
        rdjData = fixture.load('microservices/policy-management/initial-root-level-policy.json');
        fixture.cleanup();
      });

      describe("createPolicyData", function () {
        it('Should return undefined when invoked with no arguments.', function() {
          expect(PolicyManager.createPolicyData()).to.be.undefined;
        });

        it('Should return a PolicyData object when invoked with rdjData variable, passed as the rdjData parameter.', function() {
          const policyData = PolicyManager.createPolicyData(rdjData);
          expect(policyData instanceof PolicyData).to.equal(true);
        });
      });

      describe("submitPolicyChange", function () {
/*
//MLW
        TODO: Setup a sinon mock server to handle HTTP POST

        PolicyManager.submitPolicyChange(policyData, parsedExpression, stringExpression, rdjUrl)
          .then(reply => {
            it('reply.succeeded should be true', function() {
              expect(reply.succeeded).to.equal(true);
            });
          })
          .catch(response => {
            it('reply.succeeded should not be undefined', function() {
              expect(CoreUtils.isNotUndefinedNorNull(response.failureReason)).to.equal(true);
            });
          });
*/
      });

    });

    describe("PolicyData Tests", function () {
      let policyData;

      describe("constructor", function () {
        describe("Set rdjData variable from microservices/policy-management/policy-data.json fixture file.", function () {
          const rdjData = fixture.load('microservices/policy-management/policy-data.json');
          fixture.cleanup();

          it('Should return a PolicyData object when constructor is called with rdjData.data object for the data parameter.', function() {
            policyData = new PolicyData(rdjData.data);
            expect(policyData instanceof PolicyData).to.equal(true);
          });
        });
      });

      describe("PolicyData.prototype.Section", function () {
        it('Should return the string "DefaultPolicy"', function() {
          expect(PolicyData.prototype.Section.DEFAULT_POLICY).to.be.equal('DefaultPolicy');
        });

        it('Should return the string "Policy"', function() {
          expect(PolicyData.prototype.Section.POLICY).to.be.equal('Policy');
        });
      });

      describe("getSection", function () {
        it('Should return undefined when invoked with no arguments.', function() {
          expect(policyData.getSection()).to.be.undefined;
        });

        it('Should return undefined when invoked with name="".', function() {
          expect(policyData.getSection("")).to.be.undefined;
        });

        it('Should return undefined when invoked with name="Nosebleed" (i.e. an invalid value).', function() {
          expect(policyData.getSection("Nosebleed")).to.be.undefined;
        });

        it('Should return undefined when invoked with name=12.453 (i.e. the wrong data type).', function() {
          expect(policyData.getSection(12.453)).to.be.undefined;
        });

        it('Should return object with keys[0] === "value" when invoked with name="DefaultPolicy".', function() {
          expect(Object.keys(policyData.getSection('DefaultPolicy'))[0]).to.be.equal('value');
        });

        it('Should return object with keys[0] === "value" when invoked with name="Policy".', function() {
          expect(Object.keys(policyData.getSection('Policy'))[0]).to.be.equal('value');
        });

      });

      describe("getSupportedPredicatesList", function () {
        const i18n = {
          labels: {
            DateTime: 'Format: y-MM-dd HH:mm:ss [HH:mm:ss] (e.g. 2006-04-25 00:00:00)',
            GMTOffset: 'Format: GMT+|-h:mm (e.g. GMT-5:00)',
            Time: 'Format: HH:mm:ss (e.g. 14:22:47)',
            WeekDay: 'e.g. Sunday, Monday, Tuesday, ...',
            MonthDay: 'Range: -31 to 31'
          }
        }
        it('Should return [] when invoked with no arguments.', function() {
          expect(policyData.getSupportedPredicatesList().length).to.equal(0);
        });

        it('Should return [] when invoked with section="UN_KNOWN" (i.e. an invalid value).', function() {
          expect(policyData.getSupportedPredicatesList('UN_KNOWN').length).to.equal(0);
        });

        it('Should return "weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate" as value of the [0].value item in returned array.', function() {
          expect(policyData.getSupportedPredicatesList('DefaultPolicy')[0].value).to.equal("weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate");
        });

        it('Should return "Group" as value of the [0].label item in returned array.', function() {
          expect(policyData.getSupportedPredicatesList('Policy')[1].label).to.equal("Group");
        });

      });

      describe("getPredicateArgumentsAsProperties", function () {
        let properties;

        it('Return value should be undefined because no arguments were provided.', function() {
          properties = policyData.getPredicateArgumentsAsProperties();
          expect(properties).to.be.undefined;
        });

        it('Return value should be undefined when name argument has invalid value (e.g.."UN_KNOWN").', function() {
          properties = policyData.getPredicateArgumentsAsProperties('Policy', 'UN_KNOWN');
          expect(properties).to.be.undefined;
        });

        it('Return value should be "arguments" array of [Policy] "weblogic.entitlement.rules.TimePredicate" predicate, converted to PDJ-like properties.', function() {
          properties = policyData.getPredicateArgumentsAsProperties('Policy', 'weblogic.entitlement.rules.TimePredicate');
          expect(Array.isArray(properties)).to.equal(true);
        });

        it('Return value should be "GMT offset", which is properties[2].name in previously converted PDJ-like properties.', function() {
          expect(properties[2].name).to.equal("GMT offset");
        });

        it('Return value for properties[1].type should be "string", because converted "arguments" array item had "array: false".', function() {
          expect(properties[1].type).to.equal("string");
        });

        it('Return value properties[0].array should be true, because converted "arguments" array item had "array: true".', function() {
          properties = policyData.getPredicateArgumentsAsProperties('DefaultPolicy', 'weblogic.console.wls.rest.extension.security.authorization.predicates.RolePredicate');
          expect(properties[0].array).to.equal(true);
        });

      });

    });

  }
);