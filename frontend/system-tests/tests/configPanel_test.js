//
// Configuration Elements Menu Test Suite for
//    Environment, Scheduling, Developments, Services, Security
//    Interoperabilities, Diagnostics
//

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get browser and domain properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// Configuration Panel Test Suite
describe.only('Test Suite: configPanel_test for Configuration Landing Menu', function () {
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

    //Test Case Name for:
    // Configuration -> Environments Menu Elements:
    //    Domain, Servers, Clusters, ServerTemplates, Machines, MigrationTargets,
    //    VirtualHosts, SingletonServices, StartupClasses, ShutdownClasses,
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Environment Configuration Elements Menu Test',
        async function () {
        file = "configEnvContainerMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","EnvironmentChevron","Domain");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/Servers");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/Clusters");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/ServerTemplates");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/Machines");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/MigratableTargets");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/VirtualHosts");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/SingletonServices");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/StartupClasses");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/ShutdownClasses");
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain/CoherenceClusterSystemResources");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Scheduling Menu Elements:
    //      WorkManagers, Capacities, ContextRequestClasses, FairShareRequestClasses, MaxThreadsConstraints,
    //      MinThreadsConstraints, SchedulingResponseTimeRequestClasses, ManagedExecutorServiceTemplates,
    //      ManagedScheduledExecutorServiceTemplates, ManagedThreadFactoryTemplates
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Scheduling Configuration Elements Menu', async function () {
        file = "configSchedulingMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/WorkManagers");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/Capacities");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/ContextRequestClasses");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/FairShareRequestClasses");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/MaxThreadsConstraints");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/MinThreadsConstraints");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/ResponseTimeRequestClasses");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/ManagedExecutorServiceTemplates");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/ManagedScheduledExecutorServiceTemplates");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SchedulingChevron","Domain/ManagedThreadFactoryTemplates");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Deployments Menu Elements:
    //      AppDeployments, Libraries
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Deployments Configuration Elements Menu', async function () {
        file = "ConfigDeployMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","DeploymentsChevron","Domain/AppDeployments");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","DeploymentsChevron","Domain/Libraries");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Services Menu Elements:
    //     JMS Servers, SAF Agents, JMS System Resources, Path Services, Messaging Bridges,
    //     JMS Bridge Destinations, JDBC System Resources, File Stores, JDBC Stores,
    //     Foreign JNDI Providers
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: Services Configuration Elements Menu', async function () {
        file = "ConfigServicesMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/JMSServers");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/SAFAgents");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/JMSSystemResources");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/PathServices");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/MessagingBridges");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/JMSBridgeDestinations");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/JDBCSystemResources");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/JDBCStores");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/ForeignJNDIProviders");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/XMLRegistries");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/XMLEntityCaches");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/MailSessions");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","ServicesChevron","Domain/OsgiFrameworks");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Security Menu Elements:
    //     Realms, Authentication Configuration Providers,
    //     Certificate Authority Overrides, Webservice Securities
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Security Configuration Elements Menu', async function () {
        file = "ConfigSecurityMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SecurityChevron","Domain/Realms");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SecurityChevron","Domain/JASPIC");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SecurityChevron","Domain/CertificateAuthorityOverrides");
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","SecurityChevron","Domain/WebserviceSecurities");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Interoperability Menu Elements:
    //     WTC Servers, Jolt Connection Pools
    //
    //
    it('6. Test Category: GAT/Risk3\n \t Test Scenario: Interoperability Configuration Elements Menu', async function () {
        file = "ConfigInteroperabilityMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","InteroperabilityChevron","Domain/WTCServers",5);
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","InteroperabilityChevron","Domain/JoltConnectionPools",5);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case Name for:
    //  Configuration -> Diagnostics Menu Elements:
    //     WLDF System Resources, SNMP Agent Deployments, SNMP Attribute Changes
    //     SNMP Log Filters, SNMP Proxies, SNMP Trap Destinations, Log Filters
    //
    //
    it.skip('7. Test Category: GAT/Risk3\n \t Test Scenario: Diagnostic Configuration Elements Menu', async function () {
        //arrowIndex = 5 for right arrow
        file = "ConfigDiagnosticMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","DiagnosticsChevron","Domain/WLDFSystemResources",5);
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","DiagnosticsChevron","Domain/SNMPAgentDeployments",5);
            await admin.goToLandingPanelSubTreeCard(driver, "Configuration","DiagnosticsChevron","Domain/DomainSNMPAgent",5);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
