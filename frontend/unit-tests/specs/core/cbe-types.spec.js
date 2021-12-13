define(['wrc-frontend/core/cbe-types'],
  function (CbeTypes) {

    describe("CbeTypes Tests", function () {

      describe("ServiceType", function () {
        it('ServiceType.CONFIGURATION.name should be configuration', function() {
          expect(CbeTypes.ServiceType.CONFIGURATION.name).to.equal("configuration");
        });

        it('ServiceType.MONITORING.name should be monitoring', function() {
          expect(CbeTypes.ServiceType.MONITORING.name).to.equal("monitoring");
        });

        it('ServiceType.CONTROLLING.name should be controlling', function() {
          expect(CbeTypes.ServiceType.CONTROLLING.name).to.equal("controlling");
        });

        it('ServiceType.SECURITY.name should be security', function() {
          expect(CbeTypes.ServiceType.SECURITY.name).to.equal("security");
        });

        it('ServiceType.INFORMATION.name should be information', function() {
          expect(CbeTypes.ServiceType.INFORMATION.name).to.equal("information");
        });

        it('ServiceType.CONNECTING.name should be connecting', function() {
          expect(CbeTypes.ServiceType.CONNECTING.name).to.equal("connecting");
        });

        it('Return value should be CbeTypes.ServiceType.CONTROLLING', function() {
          expect(CbeTypes.serviceTypeFromName("controlling")).to.equal(CbeTypes.ServiceType.CONTROLLING);
        });

        it('Return value should be CbeTypes.ServiceType.MONITORING', function() {
          expect(CbeTypes.serviceTypeFromName("monitoring")).to.equal(CbeTypes.ServiceType.MONITORING);
        });
      });

      describe("ServiceComponentType", function () {
        it('ServiceComponentType.PAGES.name should be "pages"', function() {
          expect(CbeTypes.ServiceComponentType.PAGES.name).to.equal("pages");
        });

        it('ServiceComponentType.DATA.name should be "data"', function() {
          expect(CbeTypes.ServiceComponentType.DATA.name).to.equal("data");
        });

        it('ServiceComponentType.CHANGE_MANAGER.name should be "changeManager"', function() {
          expect(CbeTypes.ServiceComponentType.CHANGE_MANAGER.name).to.equal("changeManager");
        });

        it('Return value should be CbeTypes.ServiceComponentType.DATA', function() {
          expect(CbeTypes.serviceComponentTypeFromName("data")).to.equal(CbeTypes.ServiceComponentType.DATA);
        });
      });

      describe("ServiceComponentSubType", function () {
        it('ServiceComponentSubType.LIFECYCLE.name should be "lifecycle"', function() {
          expect(CbeTypes.ServiceComponentSubType.LIFECYCLE.name).to.equal("lifecycle");
        });

        it('Return value should be CbeTypes.ServiceComponentType.DATA', function() {
          expect(CbeTypes.serviceComponentTypeFromName("data")).to.equal(CbeTypes.ServiceComponentType.DATA);
        });
      });

      describe("Mode", function () {
        it('Mode.OFFLINE.name should be "offline"', function() {
          expect(CbeTypes.Mode.OFFLINE.name).to.equal("OFFLINE");
        });

        it('Return value should be CbeTypes.Mode.ONLINE', function() {
          expect(CbeTypes.modeFromName("ONLINE")).to.equal(CbeTypes.Mode.ONLINE);
        });
      });

      describe("ConnectionMode", function () {
        it('ConnectionMode.CREDENTIALS.name should be "credentials"', function() {
          expect(CbeTypes.ConnectionMode.CREDENTIALS.name).to.equal("credentials");
        });

        it('Return value should be CbeTypes.ConnectionMode.STANDALONE', function() {
          expect(CbeTypes.connectionModeFromName("standalone")).to.equal(CbeTypes.ConnectionMode.STANDALONE);
        });
      });

      describe("BeanTreeType", function () {
        it('BeanTreeType.EDIT.name should be "edit"', function() {
          expect(CbeTypes.BeanTreeType.EDIT.name).to.equal("edit");
        });

        it('Return value should be CbeTypes.BeanTreeType.DOMAIN_RUNTIME', function() {
          expect(CbeTypes.beanTreeTypeFromName("domainRuntime")).to.equal(CbeTypes.BeanTreeType.DOMAIN_RUNTIME);
        });
      });

      describe("CbeApiError", function (message, extra) {
        it('CbeApiError with "CBE API error occurred." message should be thrown', function() {
          const message = "CBE API error occurred.";
          expect(function () {throw new CbeTypes.CbeApiError(message) })
            .to.throw(message);
        });
      });

      describe("ServiceNotDefinedError", function (message, extra) {
        it('ServiceNotDefinedError with "Foobar service not defined in console-frontend-jet.yaml file." message should be thrown', function() {
          const message = "Foobar service not defined in console-frontend-jet.yaml file.";
          expect(function () {throw new CbeTypes.ServiceNotDefinedError(message) })
            .to.throw(message);
        });
      });
    });

  }
);
