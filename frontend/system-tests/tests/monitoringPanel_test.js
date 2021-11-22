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
    it.only('1. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(Landing Page) -> Runtime Menu Elements Menu Test', async function () {
        file = "monitoringRuntimeMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Server States",
                "AdminServer");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Running Servers",
                "AdminServer");

            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/Domain Runtime");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/MigrationDataRuntimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/NodeManagerRuntimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/SystemComponentLifeCycleRuntimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/AppDeploymentRuntimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/DeploymentProgressObjects");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/LibDeploymentRuntimes");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/ServiceMigrationDataRuntimes")
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/EditSessionConfigurations");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/ScalingTasks");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/AllWorkflows");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/InactiveWorkflows");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/StoppedWorkflows");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring","Domain Information",
                "DomainRuntime/SNMPAgentRuntime");

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})