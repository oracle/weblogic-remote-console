// Navtree, Form, Table, Create, Shopping Cart Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get Navtree elements and Cluster table/form properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;
const user = require('../lib/admin').credential.userName;
const password = require('../lib/admin').credential.password;

// Get Cluster and Machines functions
const Cluster = require('../lib/machineAndClusterProps');

// NavTree Form, Table, Create, Shopping Cart Test Suite
describe.only('Test Suite: basic_test for Navtree structure view, Object creation/modification from Landing page ' +
    'and Shopping Cart functionality', function () {
    let driver;
    let file = "sanityTest.png";
    let element;
    var sec = 1000;
    this.timeout(600 * sec);

    before(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        cluster = new Cluster(driver, file);
    })
    after(async function () {
        await driver.quit();
    })

    //Test Login and logout with credential
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Login with credential - Connect-Disconnect Utilities ', async function () {
        try {
            await admin.goToHomePageUrl(driver);
            await driver.sleep(4800);
            element = driver.findElement(By.id("connect-disconnect-image"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
                console.log("Click Disconnect Image link.");
            }
            await driver.sleep(4800);
            element = driver.findElement(By.id("connect-disconnect-image"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
                console.log("Click Connect Image link.");
            }
            await driver.sleep(4800);
            element = driver.findElement(By.id("username-field|input"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(user);
                console.log("Enter userName: " + user);
            }
            await driver.sleep(200);
            element = driver.findElement(By.id("password-field|input"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(password);
                console.log("Enter Password: " + password);
            }
            await driver.sleep(300);
            element = driver.findElement(By.id("url-field|input"));
            await driver.sleep(400);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(adminUrl);
                console.log("Enter adminUrl: " + adminUrl);
            }
            element =  driver.findElement(By.id("connection-dialog-button-label"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(600);
            if (element.isEnabled()) {
                await element.click();
                console.log("Connect to AdminServer " + adminUrl + " successful");
            }
            console.log("TEST PASS ");
        } catch (e) {
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
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration Menu Elements Test', async function () {
        file = "navConfigEnv.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Servers");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete TestCluster-1
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete the recently created TestCluster-1 ', async function() {
       file = "TestCluster-1.png";
       try {
            await admin.createNewMBeanObject(driver,"TestCluster-1",2,"configuration","Environment","Clusters");
            await driver.sleep(2400);
            //Test: Table, Tab and Form
            await cluster.modifyClusterGeneralTab(driver,"TestCluster-1","general","Random",
                "localhost",4,"TxnAffinityEnabled","ConcurrentSingletonActivationEnabled",
                "WeblogicPluginEnabled","360","2","3");
            await driver.sleep(1400);
            await cluster.deleteCluster(driver,"TestCluster-1");
            await driver.sleep(1200);
            console.log("TEST PASS ");
       } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
       }
    })
})
