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
describe.only('Test Suite: basic_test: Add WLS Domain Connection/WDT Model file and Save/Load ' +
    'Domain Connection and WDT file projects, view Navtree structure, Object creation/modification from Landing page ' +
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

    //Test Add Domain Admin Server Connection
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Create WLS Domain Connection, Vew Configuration Tree, ' +
        'Valid navTree Environment -> AdminServer ', async function () {
        file = "domainConnectionTest.png";
        try {
            await admin.goToHomePageUrl(driver,"","Cancel");
            await driver.sleep(4800);
            console.log("Click Configuration View Tree Image");
            await driver.findElement(By.xpath("//*[@id=\'view\']/img")).click();
            console.log("Click Navtree Environment");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//span[contains(.,\'Environment\')]")).click();
            console.log("Click Navtree Server");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//span[contains(.,\'Servers\')]")).click();
            console.log("Click Navtree AdminServer");
            await driver.sleep(4800);
            await driver.findElement(By.xpath("//span[contains(.,\'AdminServer\')]")).click();

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Add WDT Model File Connection
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Add WDT Model File Connection, Vew Configuration Tree, ' +
        'Valid navTree Environment', async function () {
        file = "WDTFileConnectionTest.png";
        try {
            let modelName = "baseDomain";
            const file = "frontend/system-tests/lib/baseDomain.yaml";
            const path = require('path');
            const wdtModelFile = process.env.OLDPWD + path.sep + file;
            await admin.addWDTModelExistingFile(driver,modelName,wdtModelFile);
            await driver.sleep(2400);

            console.log("Click WDT Model Tree");
            await driver.findElement(By.xpath("//*[@id=\"modeling\"]/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Environment");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//span[contains(.,\'Environment\')]")).click();
            console.log("Click Navtree Server");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//span[contains(.,\'Servers\')]")).click();
            console.log("Click Navtree AdminServer");
            await driver.sleep(4800);
            await driver.findElement(By.xpath("//span[contains(.,\'AdminServer\')]")).click();
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
            //Test: Table, Tab and Form
           await admin.createNewMBeanObject(driver,"TestCluster-1",2,"configuration","Environment","Clusters");
           await driver.sleep(2400);
           await cluster.modifyClusterGeneralTab(driver,"TestCluster-1","general","round-robin-affinity",
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
