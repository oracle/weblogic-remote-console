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
    it.skip('1. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new testJMSServer-1 ', async function() {
        file = "testJMSServer-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-1",2,"configuration","Services","JMS Servers");
            await driver.sleep(1200);
            await services.modifyJMSServerGeneralTab(driver,"testJMSServer-1","General","","PagingFileLockingEnabled");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSServer-1","JMSServers",2,"configuration",
                "Services","JMS Servers","","","",4);
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
        file = "testJMSSystemRes-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSSysRes-1",2,"configuration","Services","JMS System Resources");
            await driver.sleep(1200);
            await services.modifyJMSSysResTargetsTab(driver,"testJMSSysRes-1","Targets","All");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSSysRes-1","JMSSystemResources",2,"configuration",
                "Services","JMS System Resources","","","",3);
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
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","ServicesChevron","File Stores");
            await admin.createNewMBeanFromLandingPage(driver,"testFileStore-1");
            await driver.sleep(2400);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(2400);
            console.log("Enter directory value name = temp");
            await driver.findElement(By.id("Directory|input")).click();
            await driver.findElement(By.id("Directory|input")).sendKeys("temp");
            await admin.saveToShoppingCart(driver);
            await admin.goToFirstCompTab(driver,"Edit Tree","ServicesChevron","File Stores",1,
                "testFileStore-1","Target");
            await admin.selectDropDownValue(driver,"Targets","AdminServer");
            console.log("Select Target for testFileStore-1 as AdminServer");
            await admin.saveToShoppingCart(driver);
            await admin.commitChanges(driver);
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","ServicesChevron","File Stores");
            await driver.sleep(2400);
            //await admin.deleteMBeanFromLandingPage(driver,"File Stores","testFileStore-1");
            await admin.deleteMBeanObject(driver,"testFileStore-1","File Stores",2,"configuration",
                "Services","File Stores","","","",3);
            await driver.sleep(800);
            await admin.commitChanges(driver);
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
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","ServicesChevron","Data Sources");
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
            console.log("Create a new JDBC Store");
            await admin.createNewMBeanObject(driver,"testJDBCStore-2",2,"configuration","Services",
                "JDBC Stores","","","searchselect","oj-searchselect-filter-Targets|input","Targets","AdminServer");

            await services.modifyJDBCStoreGeneralTab(driver,"testJDBCStore-2","General","OFF","testJDBCSysRes-2");
            await driver.sleep(4800);
            await admin.saveAndCommitChanges(driver);

            await admin.deleteMBeanObject(driver,"testJDBCStore-2","JDBC Stores",2,"configuration",
                "Services","JDBC Stores","","","",4);
            await admin.deleteMBeanObject(driver,"testJDBCSysRes-2","Data Sources",2,"configuration",
                "Services","Data Sources","","","",7);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create XML Registry (testXMLRegistry-1)
    // Delete testXMLRegistry-1
    //
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testXMLRegistry-1 ', async function() {
        file = "testXMLRegistry-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testXMLRegistry-1",2,"configuration","Services","XML Registries");
            await admin.deleteMBeanObject(driver,"testXMLRegistry-1","XML Registries",2,"configuration",
                "Services","XML Registries","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create XML Entity Caches (testEntityCache-1)
    // Delete testEntityCache-1
    //
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testEntityCache-1 ', async function() {
        file = "testXMLEntityCahe-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testEntityCache-1",2,"configuration","Services","XML Entity Caches");
            await admin.deleteMBeanObject(driver,"testEntityCache-1","XML Entity Caches",2,"configuration",
                "Services","XML Entity Caches","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create MailSession (testMailSession-1)
    // Delete testMailSession-1
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testMailSession-1 ', async function() {
        file = "testMailSession-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testMailSession-1",2,"configuration","Services","Mail Sessions",
                    "","","input","JNDIName|input","testJNDIName");
            await admin.deleteMBeanObject(driver,"testMailSession-1","Mail Sessions",2,"configuration",
                "Services","Mail Sessions","","","",3);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create MessagingBridge (testMessagingBridge-1)
    // Delete testMessagingBridge-1
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testMessagingBridge-1 ', async function() {
        file = "testMessagingBridge-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testMessagingBridge-1",2,"configuration","Services","Messaging Bridges");
            await admin.deleteMBeanObject(driver,"testMessagingBridge-1","Messaging Bridges",2,"configuration",
                "Services","Messaging Bridges","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test Case:
    // Create Foreign JNDI Providers (testForeignJNDIProviders-1)
    // Delete testForeignJNDIProviders-1
    //
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testForeignJNDIProviders-1 ',
        async function() {
        file = "testForeignJNDIProviders-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testForeignJNDIProviders-1",2,"configuration","Services",
                "Foreign JNDI Providers");
            await admin.deleteMBeanObject(driver,"testForeignJNDIProviders-1","Foreign JNDI Providers",2,"configuration",
                "Services","Foreign JNDI Providers","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Osgi Frameworks is deprecated.
    // Create Osgi Frameworks (testOsgiFrameworks-1)
    // Delete testOsgiFrameworks-1
    //
    it.skip('11. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testOsgiFrameworks-1 ',
        async function() {
            file = "testOsgiFrameworks-1.png";
            try {
                await admin.createNewMBeanObject(driver,"testOsgiFrameworks-1",2,"configuration","Services",
                    "Osgi Frameworks");
                await admin.deleteMBeanObject(driver,"testOsgiFrameworks-1","Osgi Frameworks",2,"configuration",
                    "Services","Osgi Frameworks","","","",1);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
    })

    //Test Case:
    // Create JTA (testJMSBridgeDestinations-1)
    // Delete testJMSBridgeDestinations-1
    //
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testJMSBridgeDestinations-1 ',
        async function() {
            file = "testJMSBridgeDestinations-1.png";
            try {
                await admin.createNewMBeanObject(driver,"testJMSBridgeDestinations-1",2,"configuration","Services",
                    "JMS Bridge Destinations");
                await admin.deleteMBeanObject(driver,"testJMSBridgeDestinations-1","JMS Bridge Destinations",2,"configuration",
                    "Services","JMS Bridge Destinations","","","",3);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
    })

    //Test Case:
    // Create FileStore with Eclipse... menu from JMSServer
    //
    it.skip('14. Test Category: GAT/Risk1\n \t Test Scenario: create->fileStore->EclipseMenu from testJMSServer-2 ', async function() {
        file = "testFileStoreFromJMSServer-2.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-2",2,"configuration","Services","JMS Servers");
            await driver.sleep(4800);
            await services.createFileStoreFromJMSServerEclipseMenu(driver,"testJMSServer-2","testFileStore-2");
            await admin.deleteMBeanObject(driver,"testJMSServer-2","JMSServers",2,"configuration",
                "Services","JMS Servers");
            await driver.sleep(4800);
            await admin.deleteMBeanObject(driver,"testFileStore-2","FileStores",2,"configuration",
                "Services","File Stores");
            await driver.sleep(800);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JDBCStore with Eclipse... menu from JMSServer
    //
    it.skip('15. Test Category: GAT/Risk1\n \t Test Scenario: create->JDBCStore->EclipseMenu from testJMSServer-3 ', async function() {
        file = "testJDBCStoreFromJMSServer-3.png";
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-3",2,"configuration","Services","JMS Servers");
            await driver.sleep(4800);
            await services.createJDBCStoreFromJMSServerEclipseMenu(driver,"testJMSServer-3","testJDBCStore-3");
            await admin.deleteMBeanObject(driver,"testJMSServer-3","JMSServers",2,"configuration",
                "Services","JMS Servers");
            await driver.sleep(4800);
            await admin.deleteMBeanObject(driver,"testJDBCStore-3","JDBCStores",2,"configuration",
                "Services","JDBC Stores");
            await driver.sleep(800);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
