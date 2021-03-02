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
            await admin.createNewMBeanObject(driver,"server-1",2,"configuration","Environment","Servers")
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"server-1","Servers",2,"configuration",
                "Environment","Servers");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete serverTemplate-1
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: for create->modify->delete a new serverTemplate-1 ',
        async function() {
        file = "serverTemplate-1.png";
        try {
            await admin.createNewMBeanObject(driver,"serverTemplate-1",2,"configuration","Environment","Server Templates");
            await driver.sleep(1200);
            await server.modifyServerTemplateGeneralTab(driver,"serverTemplate-1","ui-id-2240","ui-id-2297","localhost",
                "ListenPortEnabled","9991","SSLListenPortEnabled","9992","ClientCertProxyEnabled","javac");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"serverTemplate-1","ServerTemplates",2,"configuration",
                "Environment","Server Templates");
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
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: for create->modify(migration) ->delete a new serverTemplate-2 ', async function() {
        file = "serverTemplate-2.png";
        try {
            await admin.createNewMBeanObject(driver,"testServerTemplate-2",2,"configuration","Environment","Server Templates");
            await driver.sleep(1200);
            await server.modifyServerTemplateMigrationTab(driver,"testServerTemplate-2","AutoMigrationEnabled");
            //*[@id="AutoMigrationEnabled"]/div[1]/div
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testServerTemplate-2","ServerTemplates",2,"configuration",
                "Environment","Server Templates");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
