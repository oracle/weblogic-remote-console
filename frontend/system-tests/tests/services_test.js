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

    let dbSourceType = "Generic Data Source";
    let dbType = "Oracle";
    let dbDriver = "GENERIC_Oracle_DatabaseDriver";
    let dbName = "pdb1.vcn2racregional.devweblogic2phx.oraclevcn.com";
    let dbHost = "wlsqa.vcn2racregional.devweblogic2phx.oraclevcn.com";
    let dbPort = "1521";
    let dbUser = "admin";
    let dbPassword = "welcome1";

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
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: testJMSServer-1 : create->modify->delete a new testJMSServer-1 ', async function() {
        file = "testJMSServer-1.png";
        console.log("-----Start to run testJMSServer-1 test case....");
        console.log("------------------------------------------------");
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-1",2,"configuration","Services","JMS Servers");
            await driver.sleep(7200);
            await services.modifyJMSServerGeneralTab(driver,"testJMSServer-1","General","","PagingFileLockingEnabled");
            await driver.sleep(7200);
            await admin.deleteMBeanObject(driver,"testJMSServer-1","JMSServers",2,"configuration",
                "Services","JMS Servers","","","",4);
            await driver.sleep(7200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->assign(Target tab) to testJMSModules-1, validate the operation then delete testJMSModules-1
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: testJMSModules-1: Create->assign(All Target) to testJMSModules-1, ' +
        'validate the operation then delete testJMSModules-1', async function() {
        file = "testJMSSystemRes-1.png";
        console.log("-----Start to run testJMSModules-1 modify target test case....");
        console.log("--------------------------------------------------");
        try {
            await admin.createNewMBeanObject(driver,"testJMSModules-1",2,"configuration","Services","JMS Modules");
            await driver.sleep(1200);
            await services.modifyJMSModulesTargetsTab(driver,"testJMSModules-1","Targets","All");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSModules-1","JMSModules",2,"configuration",
                "Services","JMS Modules","","","",3);
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
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: testFileStore-1: create->modify->delete a new testFileStore-1 ', async function() {
        file = "testFileStore-1.png";
        console.log("-----Start to run testFileStore-1 test case....");
        console.log("-----------------------------------------------");
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","ServicesChevron","File Stores");
            await admin.createNewMBeanFromLandingPage(driver,"testFileStore-1");
            await driver.sleep(6400);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(6400);
            console.log("Enter directory value name = temp");
            element = driver.findElement(By.id("Directory|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(6400);
            await driver.findElement(By.id("Directory|input")).sendKeys("temp");
            await admin.saveToShoppingCart(driver);
            await admin.goToFirstCompTab(driver,"Edit Tree","ServicesChevron","File Stores",1,
                "testFileStore-1","Target");
            await driver.sleep(2400);
            await admin.selectDropDownValue(driver,"Targets","AdminServer");
            await driver.sleep(2400);
            console.log("Select Target for testFileStore-1 as AdminServer");
            await admin.saveToShoppingCart(driver);
            await admin.commitChanges(driver);
            await driver.sleep(2400);
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
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: testJDBCSysRes-1: create->save->delete a new testJDBCSysRes-1 ', async function() {
        file = "testJDBCSysRes-1.png";
        console.log("-----Start to run testJDBCSysRes-1 test case....");
        console.log("------------------------------------------------");
        try {
            await services.createJDBCSystemResource(driver,"testJDBCSysRes-1","testJdbcJNDIName-1","All",
                dbSourceType, dbType, dbDriver, dbName, dbHost, dbPort, dbUser, dbPassword);
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
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: testJDBCStore-2: create testJDBCSysRes-2, create testJDBCStore-2, ' +
        'assign testJDBCSysRes-2 to testJDBCStore-2 - Validate the operation, ' +
        'delete testJDBCSysRes-2 and testJDBCStore-2', async function() {
        file = "testJDBCStore-2.png";
        console.log("-----Start to run testJDBCStore-2 test case....");
        console.log("-----------------------------------------------");
        try {
            await services.createJDBCSystemResource(driver,"testJDBCSysRes-2","testJdbcJNDIName-2","AdminServer",
                dbSourceType, dbType, dbDriver, dbName, dbHost, dbPort, dbUser, dbPassword);
            await driver.sleep(4800);
            console.log("Click Finish button to save testJDBCSysRes-2 to shopping cart. ");
            await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button")).click();
            await driver.sleep(4800);
            console.log("Create a new JDBC Store");
            await admin.createNewMBeanObject(driver,"testJDBCStore-2",2,"configuration","Services",
                "JDBC Stores","","","searchselect","oj-searchselect-filter-Targets|input","Targets","AdminServer");
            await driver.sleep(4800);
            await services.modifyJDBCStoreGeneralTab(driver,"testJDBCStore-2","General","OFF","testJDBCSysRes-2");
            await driver.sleep(4800);
            await admin.saveAndCommitChanges(driver);

            await admin.deleteMBeanObject(driver,"testJDBCStore-2","JDBC Stores",2,"configuration",
                "Services","JDBC Stores","","","",4);
            await admin.deleteMBeanObject(driver,"testJDBCSysRes-2","Data Sources",2,"configuration",
                "Services","Data Sources","","","",6);
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
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: testXMLRegistry-1: create/save/delete testXMLRegistry-1 ', async function() {
        file = "testXMLRegistry-1.png";
        console.log("-----Start to run testXMLRegistry-1 test case....");
        console.log("-------------------------------------------------");
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","ServicesChevron","XML Registries");
            await driver.sleep(8400);
            await admin.createNewMBeanFromLandingPage(driver,"testXMLRegistry-1");
            await driver.sleep(8400);
            console.log("Click Create button ");
            element = driver.findElement(By.xpath("//span[@class='button-label' and text()='Create']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(9600);
            console.log("Click Open Shopping Cart ");
            element = driver.findElement(By.xpath("//img[@id='shoppingCartImage']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(9600);
            console.log("Click commit button ");
            await driver.findElement(By.xpath("//span[@id='commit-changes']")).click();
            await driver.sleep(24000);
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
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: testXMLEntityCache-1: create/save/delete testEntityCache-1 ', async function() {
        file = "testXMLEntityCache-1.png";
        console.log("-----Start to run testXMLEntityCache-1 test case....");
        console.log("----------------------------------------------------");
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
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: testMailSession-1: create/save/delete testMailSession-1 ', async function() {
        file = "testMailSession-1.png";
        console.log("-----Start to run testMailSession-1 test case....");
        console.log("--------------------------------------------------");
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
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: testMessagingBridge-1: create/save/delete testMessagingBridge-1 ', async function() {
        file = "testMessagingBridge-1.png";
        console.log("-----Start to run testMessagingBridge-1 test case....");
        console.log("-----------------------------------------------------");
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
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: testForeignJNDIProviders-1: create/save/delete testForeignJNDIProviders-1 ',
        async function() {
        file = "testForeignJNDIProviders-1.png";
        console.log("-----Start to run testForeignJNDIProviders-1 test case....");
        console.log("----------------------------------------------------------");
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
    // Feature: deprecated
    //
    it.skip('11. Test Category: GAT/Risk1\n \t Test Scenario: testOsgiFrameworks-1: create/save/delete testOsgiFrameworks-1 ',
        async function() {
            file = "testOsgiFrameworks-1.png";
            console.log("-----Start to run testOsgiFrameworks-1 test case..........");
            console.log("----------------------------------------------------------");
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
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: testJMSBridgeDestinations-1: create/save/delete testJMSBridgeDestinations-1 ',
        async function() {
            file = "testJMSBridgeDestinations-1.png";
            console.log("-----Start to run testJMSBridgeDestinations-1 test case..........");
            console.log("-----------------------------------------------------------------");
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
    it('14. Test Category: GAT/Risk1\n \t Test Scenario: testFileStoreFromJMSServer-2: create->fileStore->EclipseMenu from testJMSServer-2 ', async function() {
        file = "testFileStoreFromJMSServer-2.png";
        console.log("-----Start to run testFileStoreFromJMSServer-2 test case..........");
        console.log("------------------------------------------------------------------");
        try {
            await admin.createNewMBeanObject(driver,"testJMSServer-2",2,"configuration","Services","JMS Servers");
            await driver.sleep(1200);
            await services.createFileStoreFromJMSServerEclipseMenu(driver,"testJMSServer-2","testFileStore-2");
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testFileStore-2","FileStores",2,"configuration",
                "Services","File Stores","","","",3);
            await driver.sleep(1200);
            await admin.deleteMBeanObject(driver,"testJMSServer-2","JMSServers",2,"configuration",
                "Services","JMS Servers","","","",4);
            await driver.sleep(6400);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JDBCStore with Eclipse... menu from JMSServer
    // WC-1616
    //
    it.skip('15. Test Category: GAT/Risk1\n \t Test Scenario: testJDBCStoreFromJMSServer-: create->JDBCStore->EclipseMenu from testJMSServer-3 ', async function() {
        file = "testJDBCStoreFromJMSServer-3.png";
        console.log("-----Start to run testJDBCStoreFromJMSServer-3 test case..........");
        console.log("------------------------------------------------------------------");
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
