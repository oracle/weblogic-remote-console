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
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create and delete a new machine, TestMachine-1 ', async function () {
        file = "TestMachine-1.png";
        try {
            await admin.createNewMBeanObject(driver,"TestMachine-1",2,"configuration","Environment","Machines");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"TestMachine-1","Machines",2,"configuration",
                "Environment","Machines");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete TestCluster-1
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new TestCluster-1 ', async function() {
        file = "TestCluster-1.png";
        try {
            await admin.createNewMBeanObject(driver,"TestCluster-1",2,"configuration","Environment","Clusters");
            await driver.sleep(1200);
            //await admin.createNewMBeanObject(driver,"TestServerFailureTrigger-1",4,"configuration",
            //    "Environment","Clusters","TestCluster-1","Server Failure Trigger");
            await driver.sleep(1200);

            //Modify test start Here
            await cluster.modifyClusterGeneralTab(driver,"TestCluster-1","general","Random",
                "localhost",4,"TxnAffinityEnabled","ConcurrentSingletonActivationEnabled",
                "WeblogicPluginEnabled","360","2","3");

            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"TestCluster-1","Clusters",2,"configuration",
                "Environment","Clusters");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(NodeManager tab)->delete TestMachine-2
    //
    it('3. Test Category: GAT/Risk3\n \t Test Scenario: create->modify->delete TestMachine-2 ', async function() {
        file = "serverTemplate-2.png";
        try {
            await admin.createNewMBeanObject(driver,"TestMachine-2",2,"configuration","Environment","Machines")
            await driver.sleep(1200);
            await machine.modifyMachineNodeManagerTab(driver,"TestMachine-2","Nodemanager","Plain","127.1.1.0",
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

})
