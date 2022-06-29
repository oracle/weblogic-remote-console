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
        file = "editTreeEnvContainerMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Domain");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Clusters");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Server Templates");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Machines");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Migratable Targets");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Virtual Hosts");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Singleton Services");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Startup Classes");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Shutdown Classes");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Coherence Cluster System Resources");
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
        file = "editTreeSchedulingMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Work Managers");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Capacities");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Context Request Classes");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Fair Share Request Classes");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Max Threads Constraints");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Min Threads Constraints");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Response Time Request Classes");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Managed Executor Service Templates");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Managed Scheduled Executor Service Templates");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SchedulingChevron","Managed Thread Factory Templates");
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
        file = "editTreeDeployMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","DeploymentsChevron","App Deployments");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","DeploymentsChevron","Libraries");
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
        file = "editTreeServicesMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Data Sources");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","JMS Servers");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","SAF Agents");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","JMS System Resources");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Path Services");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Messaging Bridges");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","JMS Bridge Destinations");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","JTA");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","File Stores");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","JDBC Stores");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Foreign JNDI Providers");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","XML Registries");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","XML Entity Caches");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Mail Sessions");
            //await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","ServicesChevron","Osgi Frameworks");
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
        file = "EditTreeSecurityMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SecurityChevron","Realms");
            //await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SecurityChevron","JASPIC");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SecurityChevron","Certificate Authority Overrides");
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","SecurityChevron","Webservice Securities");
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
        file = "EditTreeInteroperabilityMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","InteroperabilityChevron","WTC Servers",0);
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","InteroperabilityChevron","Jolt Connection Pools",0);
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
        file = "EditTreeDiagnosticMenu.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","DiagnosticsChevron","WLDF System Resources",5);
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","DiagnosticsChevron","SNMP Agent Deployments",5);
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree","DiagnosticsChevron","Domain SNMP Agent",5);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
