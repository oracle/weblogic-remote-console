// Modify and verify:
// Configuration -> Services
//     JMS Servers, SAF Agents, JMS System Resources, JDBC Stores, JDBC System Resources
//
'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Services functions
const Services = require('../lib/servicesProps');

// Services Configuration Test Suite
describe.only('Test Suite: services_test for JMS, JTA, JDBC, Datasource, Messaging, JNDI, XML, ' +
    'Mail, SAF, Osgi modules', function () {
    let driver;
    let file = "servicesProp.png";
    let element;
    let admin;
    let services;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        services = new Services(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case:
    // Create->modify(general tab)->delete testJMSServer-1
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new testJMSServer-1 ', async function() {
        file = "testJMSServer-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-1",2,"configuration","Services","JMS Servers");
            await driver.sleep(1200);
            await services.modifyJMSServerGeneralTab(driver,"testJMSServer-1","General","","PagingFileLockingEnabled");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSServer-1","JMSServers",2,"configuration",
                "Services","JMS Servers");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->assign(Target tab) to testJMSSystemRes-1, validate the operation then delete testJMSSystemRes-1
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Create->assign(All Target) to testJMSSystemRes-1, ' +
        'validate the operation then delete testJMSSystemRes-1 ', async function() {
        file = "testJMSServer-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSSysRes-1",2,"configuration","Services","JMS System Resources");
            await driver.sleep(1200);
            await services.modifyJMSSysResTargetsTab(driver,"testJMSSysRes-1","Targets","All");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSSysRes-1","JMSSystemResources",2,"configuration",
                "Services","JMS System Resources");
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(general tab)->delete testFileStore-1
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new testFileStore-1 ', async function() {
        file = "testFileStore-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","ServicesChevron","Domain/FileStores");
            await admin.createNewMBeanFromLandingPage(driver,"testFileStore-1");
            await driver.sleep(2400);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(2400);
            console.log("Enter directory value name = temp");
            await driver.findElement(By.id("Directory|input")).click();
            await driver.findElement(By.id("Directory|input")).sendKeys("temp");
            await admin.saveToShoppingCart(driver);
            await admin.goToFirstCompTab(driver,"Configuration","ServicesChevron","Domain/FileStores",1,
                "testFileStore-1","Target");
            await admin.selectDropDownValue(driver,"Target","AdminServer");
            console.log("Select Target for testFileStore-1 as AdminServer");
            await admin.saveToShoppingCart(driver);
            await admin.commitChanges(driver);
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","ServicesChevron","Domain/FileStores");
            await admin.deleteMBeanFromLandingPage(driver,"FileStores","testFileStore-1");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create a Generic Oracle JDBC System Resource (testJDBCSysRes-1), save than delete it.
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: create->save->delete a new testJDBCSysRes-1 ', async function() {
        file = "testJDBCSysRes-1.png";
        try {
            await services.createJDBCSystemResource(driver,"testJDBCSysRes-1","testJdbcJNDIName-1","All","Generic Data Source",
                "Oracle","GENERIC_Oracle_DatabaseDriver","orcl","provencelx.us.oracle.com","1521","system","oracle");
            await admin.saveToShoppingCart(driver,"finish");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","ServicesChevron","Domain/JDBCSystemResources");
            await driver.sleep(1200);
            await admin.discardChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JDBC System Resource (testJDBCSysRes-2)
    // Create JDBC Store (testJDBCStore-2), assign testJDBCSysRes-2 to testJDBCStore-2
    // Delete testJDBCStore-2 and testJDBCSysRes-2 after work done
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: create testJDBCSysRes-2, create testJDBCStore-2, ' +
        'assign testJDBCSysRes-2 to testJDBCStore-2 - Validate the operation, ' +
        'delete testJDBCSysRes-2 and testJDBCStore-2', async function() {
        file = "testJDBCStore-2.png";
        try {
            await services.createJDBCSystemResource(driver,"testJDBCSysRes-2","testJdbcJNDIName-2","All","Generic Data Source",
                "Oracle","GENERIC_Oracle_DatabaseDriver","orcl","provencelx.us.oracle.com","1521","system","oracle");
            await admin.saveToShoppingCart(driver,"finish");
            await admin.createNewMBeanObject(driver,"testJDBCStore-2",2,"configuration","Services","JDBC Stores");
            await services.modifyJDBCStoreGeneralTab(driver,"testJDBCStore-2","General","OFF","testJDBCSysRes-2");
            await driver.sleep(2400);
            await admin.saveAndCommitChanges(driver);

            await admin.deleteMBeanObject(driver,"testJDBCStore-2","JDBCStores",2,"configuration",
                "Services","JDBC Stores");
            await admin.deleteMBeanObject(driver,"testJDBCSysRes-2","JDBCSystemResources",2,"configuration",
                "Services","JDBC System Resources");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
