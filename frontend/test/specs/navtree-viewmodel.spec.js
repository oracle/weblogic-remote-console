define(['viewModels/modules/navtree-manager', 'sinon', 'knockout'],
  function (NavtreeManager, sinon, ko) {

    describe("NavtreeManager Tests", function () {
      describe("isLeaf function", function () {

        beforeEach(function () {
          this.server = sinon.fakeServer.create();
        })

        afterEach(function () {
          this.server.restore();
        })

        beforeEach(function () {
          this.nm = new NavtreeManager({ id: 'test', name: 'test-perspective' });
        });

        it('should consider a collection node is a leaf', function () {
          expect(this.nm.isLeaf({ identity: { kind: 'collection' } })).to.be.false;
        });

        it('node with navigation is not a leaf', function () {
          this.server.respondWith(
            [200, { "Content-Type": "application/json" },
              '{ "navigation": "something" }']);

          var isLeaf = this.nm.isLeaf({ identity: { kind: 'somethingelse', path: 'path/doesnt/matter' } });

          expect(isLeaf).to.be.false;
        });

        it('node without navigation is a leaf', function () {
          this.server.respondWith(
            [200, { "Content-Type": "application/json" },
              '{ "nothing": "here" }']);

          var isLeaf = this.nm.isLeaf({ identity: { kind: 'somethingelse', path: 'path/doesnt/matter' } });

          expect(isLeaf).to.be.true;
        });

      });

      describe("getIconClass", function () {
        beforeEach(function () {
          this.nm = new NavtreeManager({ id: 'test', name: 'test-perspective' });
        })

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


      describe("getPathModel", function () {

        beforeEach(async () => {
          this.server = sinon.fakeServer.create();
          this.server.autoRespond = true;
        })

        afterEach(async () => {
          this.server.restore();
        })

        it("simple test getPathModel", async () => {


          this.server.respondWith(
            [200, { "Content-Type": "application/json" },
              '{"navigation":[{"groupLabel":"TestGroup","contents":[{"identity":{"perspective":"test","kind":"root","path":[{"type":"Domain","typeLabel":"Domain"}]}}]}]}']);

          this.nm = new NavtreeManager({ id: 'test', name: 'test-perspective' });

          let node = await this.nm.getPathModel("TestGroup");

          expect(node).not.to.be.undefined;

          expect(node.breadcrumbs).to.be.equal("TestGroup");
          expect(node.group).to.be.equal("TestGroup");

          node = await this.nm.getPathModel("nonexisting");

          expect(JSON.stringify(node)).to.equal("{}");
        })


        it("test getPathModel with ancestors", async () => {
          let rootObject = {
            navigation: [{
              groupLabel: "MyGroup",
              contents: [{
                descriptionHTML: "<p/>",
                identity: {
                  perspective: "test",
                  kind: "collection",
                  path: [
                    {
                      type: "Domain",
                      typeLabel: "Domain"
                    },
                    {
                      type: "Server",
                      typeLabel: "Server",
                      property: "Servers",
                      propertyLabel: "Servers"
                    }
                  ]
                }
              }]
            }]
          }

          let testGroupResponse = { data: { foo: "bar" } }

          this.server.respondWith("GET", /api\/test\/data\/$/,
            [200, { "Content-Type": "application/json" },
              JSON.stringify(rootObject)]);

          this.server.respondWith("GET", /api\/test\/data\/Foo\/Bar$/, [200, { "Content-Type": "application/json" },
            JSON.stringify(testGroupResponse)]);

          let serversResponse = {
            data: [{
              Name: {
                set: true,
                value: "MyServer"
              },
              identity: {
                perspective: "test", kind: "collectionChild",
                path: [{ type: "Domain", typeLabel: "Domain" }, { type: "Server", typeLabel: "Server", property: "Servers", propertyLabel: "Servers", key: "MyServer" }]
              }

            }]
          }

          this.server.respondWith("GET", /api\/test\/data\/Domain\/Servers$/, [200, { "Content-Type": "application/json" },
            JSON.stringify(serversResponse)]);

          this.server.respondWith("GET", /api\/test\/data\/Domain$/, [200, { "Content-Type": "application/json" },
            JSON.stringify({})]);

          this.server.respondWith("GET", /api\/test\/data\/Domain\/Servers\/MyServer$/, [200, { "Content-Type": "application/json" },
            JSON.stringify({})]);

          this.nm = new NavtreeManager({ id: 'test', name: 'test-perspective' });

          let node = await this.nm.getPathModel("Domain/Servers/MyServer");

          expect(node).not.to.be.undefined;

          expect(node.label).to.be.equal("MyServer");
          expect(node.breadcrumbs).to.be.equal("Domain/Servers/MyServer");
          expect(node.path).to.be.equal("Domain/Servers/MyServer");

          let children = await this.nm.getPathChildrenModels("Domain/Servers");

          expect(children.length).to.be.equal(1);

          node = children[0];
          expect(node.label).to.be.equal("MyServer");
          expect(node.breadcrumbs).to.be.equal("Domain/Servers/MyServer");
          expect(node.path).to.be.equal("Domain/Servers/MyServer");

        })
      });

      describe("condenseChildren", function () {
        beforeEach(function () {
          this.nm = new NavtreeManager({ id: 'test', name: 'test-perspective' });
        })

        it("test condenseChildren", function () {

          let nodeWithChildren = { name: "foo", path: "Foo/Bar", kind: "testnode", children: ko.observableArray([]) };

          function addNChildren(n, start = 0) {
            for (let i = start; i < n + start; i++) {
              nodeWithChildren.children.push({ name: "child " + i, path: "Foo/Bar/" + i, breadcrumbs: "Foo/Bar/" + i, kind: "kid" });
            }
          }

          addNChildren(9);

          let beforeInvocation = ko.toJSON(nodeWithChildren);

          this.nm.condenseChildren(nodeWithChildren);

          let afterInvocation = ko.toJSON(nodeWithChildren);
          expect(beforeInvocation).to.be.equal(afterInvocation);

          // add another child, will condense the last child (...)
          addNChildren(1, 9);

          beforeInvocation = ko.toJSON(nodeWithChildren);

          this.nm.condenseChildren(nodeWithChildren);

          afterInvocation = ko.toJSON(nodeWithChildren);

          expect(beforeInvocation).not.to.be.equal(afterInvocation);
          expect(nodeWithChildren.children().length).to.be.equal(11); // 10 children plus the collapsed node

          let condensedChild = nodeWithChildren.children.pop();

          expect(condensedChild.kind).to.be.equal("condensed");
          expect(condensedChild.label).to.be.equal("...");
          expect(condensedChild.name).to.be.equal("...");
          expect(condensedChild.breadcrumbs).to.be.equal(nodeWithChildren.breadcrumbs);
          expect(condensedChild.path).to.be.equal(nodeWithChildren.path + "/...");
        });

      });
    });
  }

);
