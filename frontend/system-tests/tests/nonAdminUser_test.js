// NonAdmin Users Roles and Privileges test cases
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

// Create users
const NonAdminUser = require('../lib/nonAdminUser');

// NavTree Form, Table, Create, Shopping Cart Test Suite
describe.only('Test Suite: nonAdminUser_test for Roles and Privileges', function () {
    let driver;
    let file = "nonAdminUser.png";
    let element;
    var sec = 1000;
    this.timeout(600 * sec);

    before(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        nonAdminUser = new NonAdminUser(driver, file);
    })
    after(async function () {
        await driver.quit();
    })

    //Test Create user Deployers
    it.skip('1. Test Category: GAT/Risk1\n \t Test Scenario: create nonAdmin Users ', async function () {
        file = "createNonAdminUser.png";
        try {
            await nonAdminUser.loginWLSConsole(driver);
            await nonAdminUser.createUser(driver,"deployerUser");
            await nonAdminUser.createUser(driver,"monitorUser");
            await nonAdminUser.createUser(driver,"operatorUser");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test non-Admin users Privileges and Roles
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: NonAdmin Users Privilege and Roles with Edit Tree',
        async function () {
        file = "nonAdminUserPrivilegeRole.png";
        try {
            await nonAdminUser.testUserPrivilegeRole(driver,"monitoruser", "Edit Tree");
            await nonAdminUser.testUserPrivilegeRole(driver,"operatoruser", "Edit Tree");
            await nonAdminUser.testUserPrivilegeRole(driver,"deployeruser", "Edit Tree");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Deployer users Privileges and Roles
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Deployer User Privilege and Roles', async function () {
        file = "deployerUserPrivilegeRole.png";
        try {
            await nonAdminUser.deployApplication(driver,"deployeruser");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test non-Admin users Privileges and Roles
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: NonAdmin Users Privilege and Roles with Monitoring Tree',
        async function () {
        file = "nonAdminUserPrivilegeRole.png";
        try {
            await nonAdminUser.testUserPrivilegeRole(driver,"monitoruser", "monitoring");
            await nonAdminUser.testUserPrivilegeRole(driver,"operatoruser", "monitoring");
            await nonAdminUser.testUserPrivilegeRole(driver,"deployeruser", "monitoring");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
