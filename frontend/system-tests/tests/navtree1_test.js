// NavTree Element Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get navtreeServer properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// NavTree Test Suite
describe.only('Test Suite: navtree1_test for Navtree Test-Suite', function () {
    let driver;
    let file = "snapStripTree.png";
    let element;
    var sec = 1000;
    this.timeout(7000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test NavStrip Image Menu Links:
    //   Toggle Visibility, Configuration, Monitoring, Control
    it.skip('1. Test Category: GAT/Risk1\n \t Test Scenario: NavStrip Menu Elements Test', async function () {
        file = "navStrip.png";
        try {
            await admin.goToNavStripImageMenuLink(driver,"configuration");
            await admin.goToNavStripImageMenuLink(driver,"monitoring");
            //await admin.goToNavStripImageMenuLink(driver,"control");
            console.log("TEST PASS ");
        }
        catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test NavTree Configuration Menu Elements for
    //   Environment, Scheduling, Developments, Services, Security
    //   Interoperability, Diagnostics
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Main Menu Elements Test', async function () {
        file = "navTree.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Environment");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Scheduling");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Deployments");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Services");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Security");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Interoperability");
            //await admin.goToNavTreeLevelOneLink(driver,"configuration","Diagnostics");
            console.log("TEST PASS ");
        }
        catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    // NavTree Configuration -> Environments Menu Elements:
    //    Domain, Servers, Clusters, ServerTemplates, Machines, MigrationTargets,
    //    VirtualHosts, SingletonServices, StartupClasses, ShutdownClasses,
    //    CoherenceClusterSystemResources, CoherenceServers
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration Environment Main Menu Elements Test', async function () {
        file = "navConfigEnv.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Domain");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Servers");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Clusters");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Server Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Machines");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Migratable Targets");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Virtual Hosts");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Singleton Services");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Startup Classes");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Shutdown Classes");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Coherence Cluster System Resources");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
