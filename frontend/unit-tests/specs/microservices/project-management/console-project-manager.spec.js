define(['wrc-frontend/microservices/project-management/console-project-manager', 'wrc-frontend/microservices/project-management/console-project', 'wrc-frontend/microservices/provider-management/data-provider', 'wrc-frontend/core/utils', 'wrc-frontend/core/cfe-errors'],
  function (ConsoleProjectManager, ConsoleProject, DataProvider, CoreUtils, CfeErrors) {

    let project = new ConsoleProject(
      "Project0",
      "MyProject2",
      false,
      [
        {
          "id": "0123456789012",
          "name": "hr_domain",
          "type": DataProvider.prototype.Type.ADMINSERVER.name,
          "url": "http://slc15bju.us.oracle.com:7010",
          "username": "weblogic",
          "password": "welcome1",
          "beanTrees": [
            {"name":  "edit", "type": "configuration", "navtreeUri": "/api/hr_domain/edit/navtree", "changeManagerUri": "/api/hr_domain/edit/changeManager"},
            {"name":  "domainRuntime", "type": "monitoring", "navtreeUri": "/api/hr_domain/domainRuntime/navtree", "readOnly":  true},
            {"name":  "serverConfig", "type": "view", "navtreeUri": "/api/hr_domain/serverConfig/navtree", "readOnly":  true}
          ]
        },
        {
          "id": "0123456789013",
          "name": "MyModelJDBCFragment",
          "type": DataProvider.prototype.Type.MODEL.name,
          "file": "mymodel-jdbc.yaml",
          "beanTrees": [
            {"name":  "edit", "type": "modeling", "navtreeUri": "/api/MyModelJDBCFragment/edit/navtree"}
          ]
        }
      ]
    );

    describe("ConsoleProject Tests", function () {
      describe("constructor", function () {
        it('CfeErrors.InvalidParameterError should be thrown when id === undefined', function() {
          expect(function() { ConsoleProject() })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be undefined: id");
        });

        it('Return value should be null if name parameter is undefined', function() {
          const project = new ConsoleProject({id: "Project1"});
          expect(project.name).to.equal(null);
        });

        it('Return value should be true if isDefault parameter is undefined', function() {
          const project = new ConsoleProject({id: "Project1", name: "MyProject"});
          expect(project.isDefault).to.equal(true);
        });
      });

      describe("name", function () {
        it('Return value should be "MyProject2"', function() {
          expect(project.name).to.equal("MyProject2");
        });
      });

      describe("getDataProviders", function () {
        const dataProviders = project.getDataProviders();
        it('Return value should be 2', function() {
          expect(dataProviders.length).to.equal(2);
        });

        it('Return value should be "0123456789013"', function() {
          expect(dataProviders[1].id).to.equal("0123456789013");
        });
      });

      describe("getDataProviderById", function () {
        it('Verifying that not passing in name argument returns undefined', function() {
          expect(project.getDataProviderById()).to.be.undefined;
        });

        it('Verifying that passing in invalid name argument returns undefined', function() {
          expect(project.getDataProviderById("Veronica Lodge")).to.be.undefined;
        });

        const dataProvider = project.getDataProviderById("0123456789013");

        it('Return value should be "model"', function() {
          expect(dataProvider.type).to.equal("model");
        });

        it('Return value should be "mymodel-jdbc.yaml"', function() {
          expect(dataProvider.file).to.equal("mymodel-jdbc.yaml");
        });
      });

      describe("getDataProviderByName", function () {
        it('Verifying that not passing in name argument returns undefined', function() {
          expect(project.getDataProviderByName()).to.be.undefined;
        });

        it('Verifying that passing in invalid name argument returns undefined', function() {
          expect(project.getDataProviderByName("Veronica Lodge")).to.be.undefined;
        });

        const dataProvider = project.getDataProviderByName("hr_domain");

        it('Return value should be "adminserver"', function() {
          expect(dataProvider.type).to.equal("adminserver");
        });

        it('Return value should be "http://slc15bju.us.oracle.com:7010"', function() {
          expect(dataProvider.url).to.equal("http://slc15bju.us.oracle.com:7010");
        });

        it('Return value should be ["configuration", "monitoring", "view"]', function() {
          const types = CoreUtils.getValues(dataProvider.beanTrees, "type");
          expect(CoreUtils.isSame(types, ["configuration", "monitoring", "view"])).to.equal(true);
        });
      });

      describe("addDataProvider", function () {
        let dataProvider;
        it('Adding a new data provider to "MyProject2" project.', function() {
          dataProvider = new DataProvider(
            "0123456789014",
            "MyModelSAFAgentFragment",
            DataProvider.prototype.Type.MODEL.name,
            [{"name":  "edit", "type": "modeling", "navtree": "/api/MyModelSAFAgentFragment/edit/navtree"}]
          );
          dataProvider.putValue("file", "mymodel-saf-agent.yaml");
          project.addDataProvider(dataProvider);
        });

        it('Return value should be "MyModelSAFAgentFragment".', function() {
          dataProvider = project.getDataProviderById("0123456789014");
          expect(dataProvider.name).to.equal("MyModelSAFAgentFragment");
        });
      });

    });

    describe("DataProvider Tests", function () {
      describe("constructor", function () {
        it('CfeErrors.InvalidParameterError should be thrown when name === undefined', function() {
          expect(function() { DataProvider() })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be undefined: name");
        });

        it('CfeErrors.InvalidParameterError should be thrown when type === null', function() {
          expect(function() { DataProvider("DomainConnection1", "domain1", null) })
            .to.throw(CfeErrors.InvalidParameterError(), "Parameter cannot be undefined: type");
        });
      });

      describe("DataProvider.Type", function () {
        it('DataProvider.prototype.Type.ADMINSERVER.name should be "adminserver"', function() {
          expect(DataProvider.prototype.Type.ADMINSERVER.name).to.equal("adminserver");
        });

        it('Return value should be DataProvider.prototype.Type.MODEL', function() {
          expect(DataProvider.prototype.typeFromName("model")).to.equal(DataProvider.prototype.Type.MODEL);
        });
      });

      describe("getBeanTreesByType", function () {
        it('Return value should be [] when type parameter is undefined', function() {
          const beanTrees = DataProvider.prototype.getBeanTreesByType();
          expect(CoreUtils.isSame(beanTrees, [])).to.equal(true);
        });

        it('Return value should be [{name: "edit", type: "configuration"}, {name: "serverConfig", type: "view"}, {name: "domainRuntime", type: "monitoring"}]', function() {
          const beanTrees = DataProvider.prototype.getBeanTreesByType(DataProvider.prototype.Type.ADMINSERVER);
          console.log(`beanTrees=${JSON.stringify(beanTrees)}`);
          expect(CoreUtils.isSame(beanTrees, [{name: "edit", type: "configuration"}, {name: "serverConfig", type: "view"}, {name: "domainRuntime", type: "monitoring"}])).to.equal(true);
        });

        it('Return value should be [{name: "edit", type: "modeling"}]', function() {
          const beanTrees = DataProvider.prototype.getBeanTreesByType(DataProvider.prototype.Type.MODEL);
          expect(CoreUtils.isSame(beanTrees, [{name: "edit", type: "modeling"}])).to.equal(true);
        });

      });

      describe("getBeanTreeNavtreeUri", function () {
        let dataProvider = project.getDataProviderByName("MyModelJDBCFragment");
/*
        it('Verifying that passing "foobar" as the beanTreeName argument, returns undefined', function () {
          expect(dataProvider.getBeanTreeNavtreeUri("foobar")).to.be.undefined;
        });

        it('Verifying that passing null as the beanTreeName argument, returns undefined', function () {
          expect(dataProvider.getBeanTreeNavtreeUri(null)).to.be.undefined;
        });

        it('Return value should be "/api/MyModelJDBCFragment/edit/navtree"', function() {
          const navtreeUri = dataProvider.getBeanTreeNavtreeUri("edit");
          expect(navtreeUri).to.equal("/api/MyModelJDBCFragment/edit/navtree");
        });
*/
      });

      describe("getBeanTreeChangeManagerUri", function () {
        let dataProvider = project.getDataProviderByName("MyModelJDBCFragment");
/*
        it('Verifying that a WDTModel data provider returns undefined, even when the beanTreeName argument is valid', function() {
          expect(dataProvider.getBeanTreeChangeManagerUri("edit")).to.be.undefined;
        });
*/
      });

    });

    describe("ConsoleProjectManager Tests", function () {
      describe("add", function () {
        it('Adding "MyProject2" to projects multiple (5) times, should only add it once.', function() {
          ConsoleProjectManager.add(project);
          ConsoleProjectManager.add(project);
          ConsoleProjectManager.add(project);
          ConsoleProjectManager.add(project);
          ConsoleProjectManager.add(project);
        });
      });

      describe("getAll", function () {
        it('projects.length should be 1: 0 projects from localStorage, and 1 for the "MyProject2" Project.', function() {
          const projects = ConsoleProjectManager.getAll();
          expect(Object.keys(projects).length).to.equal(1);
          projects.forEach((project) => {
            console.log(`project name=${project.name}, isDefault=${project.isDefault}`);
          });
        });

      });

      describe("getByName", function () {
        it('Return value should be ConsoleProject instance for the "MyProject2" project', function() {
          const name = "MyProject2";
          project = ConsoleProjectManager.getByName(name);
          expect(project.name).to.equal(name);
        });
      });

    });

  }
);
