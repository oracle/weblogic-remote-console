//
// Monitoring Navtree Test Suite for:
//    Environment
//
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
    // Monitoring(NavTree) -> Environment
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring -> Environment -> Servers -> AdminServer', async function () {
        file = "monitoringNavTreeServerAdminTaskMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"monitoring","Environment",
                "Servers","AdminServer");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Environment", "Clustering", "Scaling Tasks");
            await admin.goToNavTreeLevelFourLink(driver, "monitoring",
                "Environment", "System Component Life Cycle Runtimes",
                "SystemComponent-1", "Tasks");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    // Monitoring(NavTree)->Scheduling
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Monitoring(NavTree) -> Scheduling', async function () {
        file = "monitoringNavTreeSchedulingMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Execute Queue Runtimes", "weblogic.socket.Muxer");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Min Threads Constraint Runtimes", "MinThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Max Threads Constraint Runtimes", "MaxThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Request Class Runtimes", "FairShareRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Request Class Runtimes", "ResponseTimeRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "BEJmsDispatcher");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "CdsAsyncRegistration");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "DataRetirementWorkManager");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "FEJmsDispatcher");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "ImageWorkManager");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "JTACoordinatorWM");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "JmsAsyncQueue");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Scheduling", "Work Manager Runtimes", "OneWayJTACoordinatorWM");
            await admin.goToNavTreeLevelTwoLink(driver, "monitoring",
                "Scheduling", "Managed Executor Service Runtime");
            await admin.goToNavTreeLevelTwoLink(driver, "monitoring",
                "Scheduling", "Managed Scheduled Executor Service Runtimes");
            await admin.goToNavTreeLevelTwoLink(driver, "monitoring",
                "Scheduling", "Managed Thread Factory Runtimes");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Deployments
    //
    it('3. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
                'AdminServer -> Deployments ', async function () {
        file = "monitoringNavTreeServerMetricsAdminDeploymentMenu.png";
        try {
            await admin.goToNavTreeLevelFiveLink(driver,"monitoring","Deployments",
                "Application Runtimes","MyAdminJmsModule","Component Runtimes","MyAdminJmsModule");
            await admin.goToNavTreeLevelFiveLink(driver,"monitoring", "Deployments",
                "Application Runtimes","MyAdminJmsModule","Managed Executor Service Runtimes","DefaultManagedExecutorService");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "App Deployment Runtimes", "jms-local-adp");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Library Runtimes", "pwdgen");
            await driver.sleep(600);
            console.log("Click pwdgen pop down menu");
            await driver.findElement(By.css(".oj-end")).click();
            await driver.sleep(600);
            console.log("Select Library Configuration - Edit Tree");
            await driver.findElement(By.xpath("//oj-option[@id=\'Library Configuration - Edit Tree\']/a")).click();
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Deployments", "Web Services", "Wsee Wsrm Runtime");
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Deployments",
                "Resource Adapters","Active RAs", "jms-internal-notran-adp",
                "Connection Pools","eis/jms/internal/WLSConnectionFactoryJNDINoTX","Connections");
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Deployments",
                "Resource Adapters","RAs", "jms-internal-notran-adp",
                "Connection Pools", "eis/jms/internal/WLSConnectionFactoryJNDINoTX","Connections");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Services
    //
    it('4. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
           'AdminServer->Services', async function () {
        file = "monitoringNavTreeServerMetricsAdminServicesMenu.png";
        try {
            await admin.goToNavTreeLevelSevenLink(driver, "monitoring", "Services",
                "Messaging","JMS Runtime", "JMS Servers",
                "AdminJMSServer","Destinations","MyAdminJmsModule!AdminJMSServer@MyAdminUniformDistributedQueue");
            await admin.goToNavTreeLevelNineLink(driver, "monitoring", "Services",
                "Messaging","JMS Runtime", "Connections",
                "connection15","Sessions","session41",
                "Consumers","consumer43");
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Services",
                "Data Sources","JDBC Data Source Runtime MBeans");
            await driver.sleep(600);
            console.log("Click JDBC Data Source Runtime MBeans pop down menu");
            await driver.findElement(By.css(".oj-end")).click();
            await driver.sleep(600);
            console.log("Select JDBC Data Sources - Configuration View Tree");
            await driver.findElement(By.xpath("//oj-option[@id=\'JDBC Datasources - Configuration View Tree\']/a")).click();
            await admin.goToNavTreeLevelFourLink(driver, "monitoring", "Services",
                "Persistence","Data Access Runtimes","JMSMessageLog/AdminJMSServer");
            console.log("TEST PASS ");
         } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
         } 
     })

    // Monitoring(NavTree)->Security
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring AdminServer->Security', async function () {
        file = "monitoringNavTreeServerMetricsAdminSecurityMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring",
                "Security","Realm Runtimes","myrealm");
            await driver.sleep(600);
            console.log("Click myrealm pop down menu");
            await driver.findElement(By.css(".oj-end")).click();
            await driver.sleep(600);
            console.log("Select Authenticator Runtimes - myrealm menu");
            await driver.findElement(By.xpath("//oj-option[@id=\'Authenticator Runtimes - myrealm\']/a")).click();
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Monitoring(NavTree)->Running Servers->AdminServer->Interoperability
    //
    it.skip('6. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring(NavTree) for Running Servers -> ' +
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

    // Monitoring(NavTree)->Diagnostics
    //
    it('7. Test Category: GAT/Risk3\n \t Test Scenario: Monitoring -> Diagnostics', async function () {
        file = "monitoringNavTreeServerMetricsAdminDiagnosticsMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Diagnostics",
                "WLDF Archive Runtimes","JMSMessageLog/AdminJMSServer");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
