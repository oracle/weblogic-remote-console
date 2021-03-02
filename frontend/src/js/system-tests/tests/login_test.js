// Login Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;
const adminUrl = require('../lib/admin').adminUrl;
const remoteAdminUrl = require('../lib/admin').remoteAdminUrl;
const user = require('../lib/admin').credential.userName;
const password = require('../lib/admin').credential.password;

// Test Suite Name
describe.only('Test Suite: login_test for Connect/Disconnect utilities', function () {
    let driver;
    let file = "Login.png";
    let element;
    this.timeout(30000);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case Name
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Login - Connect-Disconnect Utilities ', async function () {
        try {
            await driver.get(adminUrl);
            await driver.sleep(6400);
            element = driver.findElement(By.id("username-field|input"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(user);
                console.log("Enter userName: " + user);
            }
            await driver.sleep(400);
            element = driver.findElement(By.id("password-field|input"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(password);
                console.log("Enter Password: " + password);
            }
            await driver.sleep(400);
            element = driver.findElement(By.id("url-field|input"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(remoteAdminUrl);
                console.log("Enter adminUrl: " + remoteAdminUrl);
            }
            await driver.sleep(400);
            element =  driver.findElement(By.id("connection-dialog-button-label"));
            if (element.isEnabled()) {
                await element.click();
                console.log("Connect to remote AdminServer " + remoteAdminUrl + " successful");
            }
            await driver.sleep(6400);
            element = driver.findElement(By.id("connect-disconnect-image"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
                console.log("Click Disconnect Image link.");
            }
            await driver.sleep(600);
            element = driver.findElement(By.id("connect-disconnect-image"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
                console.log("Click Connect Image link.");
            }
            await driver.sleep(3000);
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
                await element.sendKeys(remoteAdminUrl);
                console.log("Enter adminUrl: " + remoteAdminUrl);
            }
            await driver.sleep(600);
            element =  driver.findElement(By.id("connection-dialog-button-label"));
            await driver.sleep(600);
            if (element.isEnabled()) {
                await element.click();
                console.log("Connect to remote AdminServer " + remoteAdminUrl + " successful");
            }
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
