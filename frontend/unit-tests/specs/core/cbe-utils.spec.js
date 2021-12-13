define(['wrc-frontend/core/cbe-utils'],
  function (CbeUtils) {

    describe("CbeUtils Tests", function () {

      describe("extractBeanPath", function () {

        let url = "http://localhost:8012/api/data/configuration/Domain/Machines/Machine1";
        it('Extracted bean path should be "configuration/Domain/Machines/Machine1"', function() {
          const beanPath = CbeUtils.extractBeanPath(url);
          expect(beanPath).to.equal("configuration/Domain/Machines/Machine1");
        });

        it('Not providing the url argument should return undefined', function() {
          const beanPath = CbeUtils.extractBeanPath();
          expect(beanPath).to.be.undefined;
        });

        it('Providing a url argument with no "/" characters in it should return undefined', function() {
          const beanPath = CbeUtils.extractBeanPath("/");
          expect(beanPath).to.be.undefined;
        });
      });

    });

  }
);
