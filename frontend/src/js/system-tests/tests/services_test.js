// Modify and verify:
// Configuration -> Services
//     JMS Servers, SAF Agents, JMS System Resources, ...
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
    // Create->modify(general tab)->delete testFileStore-1
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: create->modify->delete a new testFileStore-1 ', async function() {
        file = "testFileStore-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","ServicesChevron","Domain/FileStores");
            await admin.createNewMBeanFromLandingPage(driver,"testFileStore-1");
            await admin.saveToShoppingCart(driver);
            await driver.findElement(By.id("Directory|input")).click();
            await driver.findElement(By.id("Directory|input")).sendKeys("temp");
            console.log("Enter directory value = temp")
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

})
