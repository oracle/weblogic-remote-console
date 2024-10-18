// Modify and verify:
// Configuration -> Environment -> Clusters/Machines 
//     General, Security, JTA, Concurrency, EJB, Web Application and Batch Pages
//

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Cluster and Machines functions
const Cluster = require('../lib/machineAndClusterProps');
const Machine = require('../lib/machineAndClusterProps');

// Configuration Machines and Cluster Test Suite
describe.only('Test Suite: machineAndCluster_test for Machine and Cluster functionality', function () {
    let driver;
    let file = "clusterAndMachineProp.png";
    let element;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        cluster = new Cluster(driver, file);
        machine = new Machine(driver, file);
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })


    //Test Case:
    // Create and configure new machine - TestMachine-1
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create and delete a new machine, TestMachine-123 ', async function () {
        file = "TestMachine-123.png";
        try {
            await admin.createNewMBeanObject(driver,"TestMachine-123",2,"configuration","Environment","Machines");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"TestMachine-123","Machines",2,"configuration",
                "Environment","Machines","","","",3);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete TestCluster-123
    //
    it.skip('2. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new TestCluster-123 ', async function() {
            await admin.deleteMBeanObject(driver,"TestMachine-123","Machines",2,"configuration",
                "Environment","Machines","","","",3);
        file = "TestCluster-123.png";
        try {
            await admin.createNewMBeanObject(driver,"TestCluster-123",2,"configuration","Environment","Clusters");
            await driver.sleep(2400);

            //Modify test start Here
            await cluster.modifyClusterGeneralTab(driver,"TestCluster-123","general","Random",
                "localhost",4,"TxnAffinityEnabled","ConcurrentSingletonActivationEnabled",
                "WeblogicPluginEnabled","360","2","3");
            await driver.sleep(2400);
            await admin.deleteMBeanObject(driver,"TestCluster-123","Clusters",2,"configuration",
                "Environment","Clusters","","","",3);
            await driver.sleep(2400);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(NodeManager tab)->delete TestMachine-2
    //
    it.skip('3. Test Category: GAT/Risk3\n \t Test Scenario: create->modify->delete TestMachine-2 ', async function() {
        file = "serverTemplate-2.png";
        try {
            await admin.createNewMBeanObject(driver,"TestMachine-2",2,"configuration","Environment","Machines")
            await driver.sleep(1200);
            await machine.modifyMachineNodeManagerTab(driver,"TestMachine-2","Node Manager","Plain","127.1.1.0",
                "5558","nodeManagerDir","nmCmd","DebugEnabled");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"TestMachine-2","Machines",2,"configuration",
                "Environment","Machines");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case: test addAllToChosen (multi-select) button at Cluster Migration->Candidates tab
    // After (multi-select) button click, go to Migratable Targets navTree node
    // Change Not Download dialog appears -> CLick Yes button
    //
    it('4. Test Category: GAT/Risk3\n \t Test Scenario: ' +
        'addAllToChosen (multi-select) button at Cluster Migration->Candidates tab ', async function() {
        file = "addAllToChosenButtonAtClusterMigration.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration",
                "Environment", "Clusters","Cluster1");
            await driver.sleep(1200);
            console.log("Click Migration tab ");
            element = driver.findElement(By.xpath("//span[contains(.,'Migration')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click Candidates tab ");
            element = driver.findElement(By.xpath("//span[contains(.,'Candidates')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click addAllToChosen button ");
            element = driver.findElement(By.xpath("//oj-button[@id='addAllToChosen']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click Migratable Targets NavTree Node ");
            element = driver.findElement(By.xpath("//span[contains(.,'Migratable Targets')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            console.log("Click Yes button at Change Not Downloaded Dialog ");
            await driver.sleep(600);
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case: test addToChosen (single-select) button at Migration Tagets-> Servers Candidates tab
    // From Migratable Targets navTree node -> click ManagedServer1(migratble) -> Candidates tab
    // Select AdminServer -> ManagedServer1(migratble) -> click addToChosen button
    // Click Save button -> click Machines navtree tab to validate the change (CND) dialog should not appear
    // Click Shopping Cart to Discard Changes
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: ' +
        'test addToChosen (single-select) button at Migration Tagets-> Migration tab', async function() {
        file = "addoChosenButtonAtClusterMigration.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration",
                "Environment", "Migratable Targets","ManagedServer1 (migratable)");
            await driver.sleep(3600);
            console.log("Click Migration tab ");
            element = driver.findElement(By.xpath("//span[contains(.,'Migration')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click select to add ManagedServer1 to candidates list");
            element = driver.findElement(By.xpath("//oj-option[text()='ManagedServer1']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click select to add ManagedServer2 to candidates list");
            await driver.findElement(By.xpath("//oj-option[text()='ManagedServer2']")).click();
            await driver.sleep(2400);
            console.log("Click addToChosen button ");
            element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(3600);
            await driver.findElement(By.xpath("//span[contains(.,'Save')]")).click();
            await driver.sleep(3600);
            console.log("Click Machines NavTree Node ");
            element = driver.findElement(By.xpath("//span[contains(.,'Machines')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(3600);
            console.log("Click Shopping Cart Image Icon");
            element = driver.findElement(By.xpath("//img[@id='shoppingCartImage']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(3600);
            console.log("Click discard changes from shopping cart");
            await driver.findElement(By.xpath("//span[contains(.,'Discard Changes')]")).click();
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
