//
// Monitoring Navtree Test Suite for:
//    Server States
//    Running Servers
//    Domain Information
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
describe.only('Test Suite: monitoring_test for Navtree Monitoring functionality', function () {
    let driver;
    let file = "monitoring.png";
    let serverName = "AdminServer";
    let element;
    var sec = 1000;
    this.timeout(6000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await
        driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await
        driver.quit();
    })

    //
    // Monitoring(NavTree) -> Server Status Summary Elements from NavTree:
    //    Server States, AdminServer, Tasks
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring NavTree for Server Status States -> AdminServer -> ' +
        'Tasks Menu', async function () {
        file = "monitoringNavTreeServerStatusAdminTaskMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Server States",
                serverName, "Tasks");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Environment
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> AdminServer -> ' +
        'Environment', async function () {
        file = "monitoringNavTreeServerMetricsAdminEnvironmentMenu.png";
        try {
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Environment", "Clustering");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Environment", "System Resource Controls");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Scheduling
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
        'AdminServer -> Scheduling', async function () {
        file = "monitoringNavTreeServerMetricsAdminSchedulingMenu.png";
        try {
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Execute Queue Runtimes", "weblogic.socket.Muxer");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Min Threads Constraint Runtimes");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Max Threads Constraint Runtimes");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Request Class Runtimes");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "BEJmsDispatcher");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "CdsAsyncRegistration");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "DataRetirementWorkManager");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "FEJmsDispatcher");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "ImageWorkManager");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "JTACoordinatorWM");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "JmsAsyncQueue");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "OneWayJTACoordinatorWM");
            //await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
              //  "Running Servers", serverName, "Scheduling", "Work Manager Runtimes", "direct");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Managed Executor Service Runtimes");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Managed Scheduled Executor Service Runtimes");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Scheduling", "Managed Thread Factory Runtimes");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Deployments
    //
    it('4. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
                'AdminServer -> Deployments ', async function () {
        file = "monitoringNavTreeServerMetricsAdminDeploymentMenu.png";
        try {
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Deployments","Web Services");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName, "Deployments", "Resource Adapters");

            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers",serverName,"Deployments","Web Services","Wsee Cluster Front End Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers",serverName,"Deployments","Web Services","Entity Cache Cumulative Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers",serverName,"Deployments","Resource Adapters","Inactive RAs");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers",serverName,"Deployments","Resource Adapters","RAs");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Services
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
           'AdminServer->Services', async function () {
        file = "monitoringNavTreeServerMetricsAdminServicesMenu.png";
        try {
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
               "Running Servers", serverName,"Services","Messaging","JMS Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Messaging","SAF Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Messaging","Path Service Runtimes");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Messaging","Messaging Bridge Runtimes");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Datasource","JDBC Data Source Runtime MBeans");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Datasource","JDBC Multi Data Source Runtime MBeans");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Transactions","JTA Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Persistence","Persistent Store Runtimes");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Services","Persistence"," Data Access Runtimes");
            console.log("TEST PASS ");
         } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
         } 
     })

    // Monitoring(NavTree)->Running Servers->AdminServer->Security
    //
    it('6. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
        'AdminServer->Security', async function () {
        file = "monitoringNavTreeServerMetricsAdminSecurityMenu.png";
        try {
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName, "Security","Realm Runtimes","myrealm");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Interoperability
    //
    it('7. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
        'AdminServer->Interoperability', async function () {
        file = "monitoringNavTreeServerMetricsAdminInteroperabilityMenu.png";
        try {
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName,"Interoperability","Jolt Runtime");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Diagnostics
    //
    it('8. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
        'AdminServer->Diagnostics', async function () {
        file = "monitoringNavTreeServerMetricsAdminDiagnosticsMenu.png";
        try {
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName,"Diagnostics","SNMP Agent Runtime");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Diagnostics","WLDF Archive Runtimes","DataSourceLog");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName,"Diagnostics","WLDF Instrumentation Runtimes");
            await admin.goToNavTreeLevelFiveLink(driver, "monitoring",
                "Running Servers", serverName,"Diagnostics","WLDF Data Access Runtimes","DataSourceLog");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Running Servers", serverName,"Diagnostics","Debug Patch Tasks");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    // Monitoring(NavTree) -> Domain Information
    //
    it('9. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Domain Information menu ',
        async function () {
        file = "monitoringNavTreeDomainInformationMenu.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Domain Runtime");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Migration Data Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Node Manager Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","System Component Life Cycle Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","App Deployment Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Deployment Progress Objects");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Lib Deployment Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Service Migration Data Runtimes");
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Domain Information","Edit Session Configurations","default");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Scaling Tasks");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","All Workflows");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Inactive Workflows");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","Stopped Workflows");
            await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Domain Information","SNMP Agent Runtime");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
