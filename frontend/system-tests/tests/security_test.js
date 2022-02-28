// Create, modify and verify:
// Configuration -> Security
//     Realms, JASPIC:AuthConfigProvider, Certificate Authority Overrides, Webservices Security
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
const Security = require('../lib/securityProps');

// Services Configuration Test Suite
describe.only('Test Suite: security_test for Realms, Certificate Authority Overrides, Webservices Security',
    function () {
    let driver;
    let file = "security.png";
    let element;
    let admin;
    let security;
    var sec = 1000;
    this.timeout(800 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        security = new Security(driver,file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case:
    // Create Realm (testRealm-1)
    //
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create and save testRealm-1 ',
        async function () {
        file = "testRealm-1.png";
        try {
            await security.createRealm(driver,"testRealm-1");
            await driver.sleep(3600);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Modify realm (testRealm-1) for Security Model Default and Combined Role Mapping Enabled options.
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: modify and delete Realms: testRealm-1 ',
        async function () {
        file = "testMyRealm-1.png";
        try {
            await security.modifyRealmsGeneralTab(driver,"testRealm-1","general",true,"Advanced",
                "CombinedRoleMappingEnabled");
            await driver.sleep(6400);
            await admin.deleteMBeanObject(driver,"testRealm-1","Realms",2,"configuration",
                "Security","Realms","","","",3);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JASPIC (testAuthConfigProvider-1)
    // Delete testAuthConfigProvider-1
    //
    it.skip('3. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testAuthConfigProvider-1 ',
        async function () {
        file = "testAuthConfigProvider-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","SecurityChevron","Domain/JASPIC",5);
            await driver.sleep(6400);
            await admin.createMBeanFromMenuDropDown(driver,"Auth Config Providers","testAuthConfigProvider-1");
            await admin.commitChanges(driver);

            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","SecurityChevron","Domain/JASPIC",5);
            await driver.sleep(6400);
            await driver.findElement(By.css(".oj-end")).click();
            await driver.findElement(By.xpath("//span[contains(.,\'Auth Config Providers\')]")).click();
            await driver.sleep(6400);
            await admin.deleteMBeanFromLandingPage(driver,"JASPIC/AuthConfigProviders","testAuthConfigProvider-1");
            await driver.sleep(6400);
            await admin.commitChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JTA (testCertAuthOverrides-1)
    // Delete testCertAuthOverrides-1
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testCertAuthOverrides-1 ',
        async function () {
        file = "testCertAuthOverrides-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testCertAuthOverrides-1", 2, "configuration", "Security",
                "Certificate Authority Overrides");
            await admin.deleteMBeanObject(driver,"testCertAuthOverrides-1","Certificate Authority Overrides",2,"configuration",
                "Security","Certificate Authority Overrides","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JTA (testWebserviceSecurities-1)
    // Delete testWebserviceSecurities-1
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testCertAuthOverrides-1 ',
        async function () {
        file = "testWebserviceSecurities-1.png";
        try {
            await admin.createNewMBeanObject(driver, "testWebserviceSecurities-1", 2, "configuration", "Security",
                "Webservice Securities");
            await admin.deleteMBeanObject(driver,"testWebserviceSecurities-1","Webservice Securities",2,"configuration",
                "Security","Webservice Securities","","","",1);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})


