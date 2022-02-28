// Modify and verify:
// Configuration -> Environment -> Domain Properties Tabs
//     General, Security, JTA, Concurrency, EJB, Web Application and Batch Pages
//

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Server and ServerTemplates functions
const Server = require('../lib/serverAndTemplateProperty');

// Configuration Server and Server Template Test Suite
describe.only('Test Suite: serverAndTemplate_test for Configuration-Servers-And-ServerTemplates-Test-Suite',
    function () {
    let driver;
    let file = "serverProp.png";
    let element;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        server = new Server(driver, file);
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case Name for modify:
    // Configuration -> Environments > Server General Page Property:
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: for querying ServerName properties', async function () {
        file = "getServerName.png";
        try {
            await server.getServerName(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for modify:
    // Configuration -> Environments > Server General Page Property:
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: for Modifying Configuration>Environment->Server->General Properties Page', async function () {
        file = "modifyServerGeneralProp.png";
        try {
            await server.modifyServerGeneralTab(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create and configure new managed server - ms1
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: for creating and deleting a managed server-1 ',
        async function () {
        file = "server1.png";
        try {
            await admin.createNewMBeanObject(driver,"server-1",2,"configuration","Environment","Servers");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"server-1","Servers",2,"configuration",
                "Environment","Servers","","","",5);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete serverTemplate-1
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: for create->modify->delete a new testServerTemplate-1 ',
        async function() {
        file = "testServerTemplate-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testServerTemplate-1",2,"configuration",
                "Environment","Server Templates");
            await driver.sleep(1200);
            await server.modifyServerTemplateGeneralTab(driver,"testServerTemplate-1","Machine1",
                "Cluster2","localhost", "ListenPortEnabled","7771", "SSL_Enabled",
                "9992","ClientCertProxyEnabled","javac");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testServerTemplate-1","ServerTemplates",2,"configuration",
                "Environment","Server Templates","","","",2);
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(migration tab)->delete serverTemplate-2
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: for create->modify(migration) ->delete a new serverTemplate-2 ',
        async function() {
        file = "serverTemplate-2.png";
        try {
            await admin.createNewMBeanObject(driver,"testServerTemplate-2",2,"configuration","Environment","Server Templates");
            await driver.sleep(1200);
            await server.modifyServerTemplateMigrationTab(driver,"testServerTemplate-2","AutoMigrationEnabled");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testServerTemplate-2","ServerTemplates",2,"configuration",
                "Environment","Server Templates","","","",2);
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Config AdminServer Debug properties for
    //    Application, Containers, Core, Diagnostics, Management, Messaging, Networking, Persistence, Security, Transaction, ALL
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: for Config AdminServer Debug Application properties ', async function() {
        file = "configAdminServerApplicationDebug-1.png";
        try {
            await server.modifyServerDebugTab(driver,"AdminServer","Application",
                "ClassChangeNotifier","ClassLoader","ClassLoaderVerbose");
            await driver.sleep(1200);

            await server.modifyServerDebugTab(driver,"AdminServer","Containers",
                "DebugConnectorService","DebugEjbCaching","DebugEjbCmpDeployment");
            await driver.sleep(1200);

            await server.modifyServerDebugTab(driver,"AdminServer","Core",
                "DebugAsyncQueue","DebugCluster","DebugClusterAnnouncements");
            await driver.sleep(1200);

            await server.modifyServerDebugTab(driver,"AdminServer","Diagnostics",
                "DebugBeanTreeHarvesterControl","DebugBeanTreeHarvesterDataCollection","DebugBeanTreeHarvesterResolution",
                "DebugBeanTreeHarvesterThreading","DebugDiagnosticAccessor");
            await driver.sleep(1200);

            //TODO: Management, Messaging, Networking, Persistence and Security
            await server.modifyServerDebugTab(driver,"AdminServer","Transactions",
                "DebugJTA2PC","DebugJTA2PCStackTrace");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
