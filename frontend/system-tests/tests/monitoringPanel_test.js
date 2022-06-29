//
// Monitoring -> Runtime Menu Elements Test Suite:
//    Domain Runtime, Server Runtimes, Migration Data Runtimes, Node Manager Runtimes
//    SystemComponentLifeCycleRuntimes, App Deployment Runtimes, Deployment Progress Objects
//    Lib Deployment Runtimes, Edit Session Configurations, Scaling Tasks, Active Workflows
//    All Workflows, Complete Workflows, Inactive Workflows, Stopped Workflows, SNMP Agent Runtime
//
//
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get browser and domain properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// NavTree Test Suite
describe.only('Test Suite: monitoringPanel_test for runtime and control ', function () {
    let driver;
    let file = "config.png";
    let element;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //
    // Monitoring -> Runtime Menu Elements:
    //    Server Status Summary, Server Metrics, Domain Information, Node Manager Runtimes
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(Landing Page) -> Runtime Menu Elements Menu Test', async function () {
        file = "monitoringRuntimeMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Domain");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Servers");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "JVM Runtime");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Node Manager Runtimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Clustering");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Migration");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "ZDT");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Server Channel Runtimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Edit Session Configurations");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "System Component Life Cycle Runtimes");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})