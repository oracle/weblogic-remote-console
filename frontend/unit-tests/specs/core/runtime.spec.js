define(['wrc-frontend/core/runtime', 'wrc-frontend/core/cbe-types', 'wrc-frontend/core/types', 'wrc-frontend/core/utils'],
  function (Runtime, CbeTypes, CoreTypes, CoreUtils) {

    describe("Runtime Tests", function () {

      describe("setProperty", function () {
        it('Set Runtime.PropertyName.CFE_AUTO_SYNC_SECS property to 35', function() {
          Runtime.setProperty(Runtime.PropertyName.CFE_AUTO_SYNC_SECS, 35);
        });
      });

      describe("getProperty", function () {
        it('Value of Runtime.PropertyName.CFE_AUTO_SYNC_SECS property should be 35', function() {
          expect(Runtime.getProperty(Runtime.PropertyName.CFE_AUTO_SYNC_SECS)).to.equal(35);
        });
      });

      describe("Convenience getters", function () {
        it('Return value of getMode() should be DETACHED, OFFLINE or ONLINE', function() {
          expect([
            CoreTypes.Console.RuntimeMode.DETACHED.name,
            CoreTypes.Console.RuntimeMode.OFFLINE.name,
            CoreTypes.Console.RuntimeMode.ONLINE.name
          ]).to.include(Runtime.getMode());
        });

        it('Return value of getBaseUrl() should contain /api', function() {
          expect(Runtime.getBaseUrl()).to.have.string('/api');
        });

        it('Return value of getPathUri() should be /configuration/data', function() {
          const pathUri = Runtime.getPathUri(CbeTypes.ServiceType.CONFIGURATION, CbeTypes.ServiceComponentType.DATA);
          expect(pathUri).to.equal("/configuration/data");
        });

        it('Return value of getLoggingLevel() should be 3 (INFO), as specified in ', function() {
          expect(Runtime.getLoggingLevel()).to.equal(3);
        });

        it('Return value of getServiceConfig() should be a JS object with an monitoring', function() {
          const serviceConfig = Runtime.getServiceConfig(CbeTypes.ServiceType.MONITORING);
          serviceConfig.should.have.property('id').to.be.equal("monitoring");
        });

        it('getName()', function() {
          expect(Runtime.getName()).not.to.be.undefined;
        });

        it('getVersion()', function() {
          expect(Runtime.getVersion()).not.to.be.undefined;
        });

        it('getDomainName()', function() {
          expect(Runtime.getDomainName()).not.to.be.undefined;
        });

        it('Return value of getDomainVersion() should be undefined', function() {
          expect(Runtime.getDomainVersion()).to.be.undefined;
        });

        it('Return value of getDomainUrl() should be undefined', function() {
          expect(Runtime.getDomainUrl()).to.be.undefined;
        });

        it('getWebLogicUsername()', function() {
          expect(Runtime.getWebLogicUsername()).not.to.be.undefined;
        });

        it('Return value of getBackendMode() should be undefined', function() {
          expect(Runtime.getBackendMode()).to.be.undefined;
        });

        it('Return value of getPollingMillis() should be 60000', function() {
          expect(Runtime.getPollingMillis()).to.be.equal(60000);
        });

        it('Return value of getRetryAttempts() should be 5', function() {
          expect(Runtime.getRetryAttempts()).to.be.equal(5);
        });

        it('Return value of getAutoSyncMinimumSecs() should be 35', function() {
          expect(Runtime.getAutoSyncMinimumSecs()).to.be.equal(35);
        });
      });

    });

  }
);
