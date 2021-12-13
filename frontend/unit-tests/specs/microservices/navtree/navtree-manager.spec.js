define(['wrc-frontend/microservices/navtree/navtree-manager'],
  function (NavtreeManager, fakefetch) {

    describe("NavtreeManager Tests", function () {

      let beanTree = { navtree: 'foo', type: 'bar'}
      describe("getIconClass", function () {
        beforeEach(function () {
          this.nm = new NavtreeManager(beanTree);
        });

        afterEach(function () {
        });
  

        it("test getIconClass", function () {

          let testInputItems = [{ type: "group" },
          { type: "root" },
          { type: "collection" },
          { type: "condensed" },
          { type: "collectionChild", parentProperty: "Servers" },
          { type: "collectionChild", parentProperty: "RunningServers" },
          { type: "collectionChild", parentProperty: "ServerStates" },
          { type: "collectionChild", parentProperty: "Clusters" },
          { type: "collectionChild", parentProperty: "Machines" },
          { type: "collectionChild", parentProperty: "NodeManagerRuntimes" },
          { type: "something" }
          ]
          let testExpectedStrings = ['oj-navigationlist-item-icon oj-ux-ico-bag',
            'oj-navigationlist-item-icon oj-ux-ico-domain',
            'oj-navigationlist-item-icon oj-ux-ico-collections',
            'oj-navigationlist-item-icon oj-ux-ico-browse',
            'oj-navigationlist-item-icon oj-ux-ico-server',
            'oj-navigationlist-item-icon oj-ux-ico-server',
            'oj-navigationlist-item-icon oj-ux-ico-server',
            'oj-navigationlist-item-icon oj-ux-ico-cluster',
            'oj-navigationlist-item-icon oj-ux-ico-server',
            'oj-navigationlist-item-icon oj-ux-ico-server',
            'oj-navigationlist-item-icon oj-ux-ico-assets'
          ]
          expect(testInputItems.length).to.equal(testExpectedStrings.length);

          for (var i = 0; i < testInputItems.length; i++) {
            expect(this.nm.getIconClass(testInputItems[i])).to.equal(testExpectedStrings[i]);
          }

        });

      });


    })

  }
);
