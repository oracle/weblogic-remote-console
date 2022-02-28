// Create, modify and verify:
// Configuration -> Interoperability for
//     WTC Servers and Jolt Connection Pools
//
'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Interoperability functions

// Services Configuration Test Suite
describe.only('Test Suite: interop_test for WTC Servers and Jolt Connection Pools',
    function () {
    let driver;
    let file = "interoperability.png";
    let element;
    let admin;
    var sec = 1000;
    this.timeout(800 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case:
    // Create WTC Server (testWTCServer-1)
    // Modify -> Save changes -> verify result then delete testWTCServer-1
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create/modify/delete testWTCServer-1',
        async function () {
        file = "testWTCServer-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","InteroperabilityChevron","WTC Servers",0);
            await driver.sleep(3600);
            await admin.createNewMBeanFromLandingPage(driver,"testWTCServer-1");
            await driver.sleep(3600);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(3600);

            console.log("Modify testWTCServer-1 to select AdminServer as target");
            console.log("Click Targets tab");
            await driver.findElement(By.xpath("//span[contains(.,\'Targets\')]")).click();
            await driver.sleep(4800);
            console.log("Select AdminServer as target");
            element = driver.findElement(
                By.xpath("//oj-checkboxset[@id=\'availableCheckboxset\']/div/span/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(800);
            await element.click();
            await driver.sleep(800);
            await driver.findElement(
                By.xpath("//oj-button[@id=\'addToChosen\']/button/div/span")).click()
            await driver.sleep(800);
            await admin.saveAndCommitChanges(driver);
            await driver.sleep(3600);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","InteroperabilityChevron","WTC Servers",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"WTC Servers","testWTCServer-1",3);
            await driver.sleep(2400);
            await admin.commitChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create Jolt Connection Pools (testJoltConnectionPools-1)
    // Save changes -> Modify for User and Target tab -> verify result then delete testJoltConnectionPools-1
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: create/modify/delete testJoltConnectionPools-1',
        async function () {
        file = "testJoltConnectionPools-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","InteroperabilityChevron","Jolt Connection Pools",0);
            await driver.sleep(3600);
            await admin.createNewMBeanFromLandingPage(driver,"testJoltConnectionPools-1");
            await driver.sleep(3600);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(3600);

            console.log("Modify testJoltConnectionPools-1 User account based on cookie credential");
            console.log("Click User tab");
            await driver.findElement(By.xpath("//span[contains(.,\'User\')]")).click();
            await driver.sleep(4800);
            await admin.saveToShoppingCart(driver);

            console.log("Modify testJoltConnectionPools-1 to select AdminServer as target");
            console.log("Click Targets tab");
            await driver.findElement(By.xpath("//span[contains(.,\'Targets\')]")).click();
            await driver.sleep(4800);
            console.log("Select Cluster1 as target");
            element = driver.findElement(
                By.xpath("//oj-checkboxset[@id=\'availableCheckboxset\']/div/span/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(800);
            await element.click();
            await driver.sleep(800);
            await driver.findElement(
                By.xpath("//oj-button[@id=\'addToChosen\']/button/div/span")).click()
            await driver.sleep(800);
            await admin.saveAndCommitChanges(driver);
            await driver.sleep(3600);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","InteroperabilityChevron","Jolt Connection Pools",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Jolt Connection Pools","testJoltConnectionPools-1",2);
            await driver.sleep(2400);
            await admin.commitChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
