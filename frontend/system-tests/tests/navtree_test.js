// NavTree Element Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get navtreeServer properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// NavTree Test Suite
describe.only('Test Suite: navtree_test for Navtree Test-Suite', function () {
    let driver;
    let file = "snapStripTree.png";
    let element;
    var sec = 1000;
    this.timeout(6000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test NavStrip Image Menu Links:
    //   Toggle Visibility, Configuration, Monitoring, Control
    it.skip('1. Test Category: GAT/Risk1\n \t Test Scenario: NavStrip Menu Elements Test', async function () {
        file = "navStrip.png";
        try {
            await admin.goToNavStripImageMenuLink(driver,"configuration");
            await admin.goToNavStripImageMenuLink(driver,"monitoring");
            //await admin.goToNavStripImageMenuLink(driver,"control");
            console.log("TEST PASS ");
        }
        catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test NavTree Configuration Menu Elements for
    //   Environment, Scheduling, Developments, Services, Security
    //   Interoperability, Diagnostics
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Main Menu Elements Test', async function () {
        file = "navTree.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Environment");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Scheduling");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Deployments");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Services");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Security");
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Interoperability");
            //await admin.goToNavTreeLevelOneLink(driver,"configuration","Diagnostics");
            console.log("TEST PASS ");
        }
        catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    // NavTree Configuration -> Environments Menu Elements:
    //    Domain, Servers, Clusters, ServerTemplates, Machines, MigrationTargets,
    //    VirtualHosts, SingletonServices, StartupClasses, ShutdownClasses,
    //    CoherenceClusterSystemResources, CoherenceServers
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration Environment Main Menu Elements Test', async function () {
        file = "navConfigEnv.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Domain");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Servers");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Clusters");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Server Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Machines");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Migratable Targets");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Virtual Hosts");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Singleton Services");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Startup Classes");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Shutdown Classes");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Coherence Cluster System Resources");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    // NavTree: Configuration -> Environments Sub-Menu Elements which go to Pages:
    //    Domain, Servers, Clusters, ServerTemplates, Machines, MigrationTargets,
    //    VirtualHosts, SingletonServices, StartupClasses, ShutdownClasses,
    //    CoherenceClusterSystemResources, CoherenceServers
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Environment Sub-Menu Elements (Pages) Test', async function () {
        try {
            file = "navTreeConfigEnvSubMenuPage.png";
            //Create TestServer-1, TestServerTemplate-1, TestCluster-1, TestVituralHost-1, TestSingleton-1,
            // TestCoherenceCluster-1
            await admin.createNewMBeanObject(driver,"TestServer-1",2,"configuration","Environment","Servers")
            await admin.createNewMBeanObject(driver,"TestServerTemplate-1",2,"configuration","Environment","Server Templates");
            //await admin.createNewMBeanObject(driver,"Machine-1",2,"configuration","Environment","Machines");
            await admin.createNewMBeanObject(driver,"TestCluster-1",2,"configuration","Environment","Clusters");
            await admin.createNewMBeanObject(driver,"TestVirtualHost-1",2,"configuration","Environment","Virtual Hosts");
            await admin.createNewMBeanObject(driver,"TestSingleton-1",2,"configuration","Environment","Singleton Services");
            await admin.createNewMBeanObject(driver,"TestCoherenceCluster-1",2,"configuration","Environment","Coherence Cluster System Resources");

            //Server sub-menu pages
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers","AdminServer");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers","TestServer-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Servers","TestServer-1","Channels");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Servers","TestServer-1","Server Failure Trigger");
            //Cluster sub-menu
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Clusters","TestCluster-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Clusters","TestCluster-1","Server Failure Trigger");
            //ServerTemplate sub-menu Pages
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Server Templates","TestServerTemplate-1","Channels");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Server Templates","TestServerTemplate-1","Web Services Logical Stores");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Server Templates","TestServerTemplate-1","JTA Migratable Target");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Server Templates","TestServerTemplate-1","Server Failure Trigger");
            //FIXME - add create Machine MBeanObject function (Bug?)
            //await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Machines","Machine-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Virtual Hosts","TestVirtualHost-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Singleton Services","TestSingleton-1");
            //Coherence Cluster System Resources sub-menu Pages
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Coherence Cluster System Resources","TestCoherenceCluster-1","Coherence Address Providers");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Coherence Cluster System Resources","TestCoherenceCluster-1","Coherence Caches");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Coherence Cluster System Resources","TestCoherenceCluster-1","Coherence Cache Configs");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Coherence Cluster System Resources","TestCoherenceCluster-1","Coherence Cluster Well Known Addresses");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Environment","Coherence Cluster System Resources","TestCoherenceCluster-1","Coherence Services");

            //Delete TestServer-1, TestServerTemplate-1, TestCluster-1, TestVituralHost-1, TestSingleton-1,
            // TestCoherenceCluster-1
            await admin.deleteMBeanObject(driver,"TestServerTemplate-1","ServerTemplates",2,"configuration",
                "Environment","Server Templates");
            await admin.deleteMBeanObject(driver,"TestServer-1","Servers",2,"configuration",
                "Environment","Servers");
            //await admin.deleteMBeanObject(driver,"Machine-1","Machines",2,"configuration",
            //    "Environment","Machines");
            await admin.deleteMBeanObject(driver,"TestCluster-1","Clusters",2,"configuration",
                "Environment","Clusters");
            await admin.deleteMBeanObject(driver,"TestVirtualHost-1","VirtualHosts",2,"configuration",
                "Environment","Virtual Hosts");
            await admin.deleteMBeanObject(driver,"TestSingleton-1","SingletonServices",2,"configuration",
                "Environment","Singleton Services");
            await admin.deleteMBeanObject(driver,"TestCoherenceCluster-1","CoherenceClusterSystemResources",2,
                "configuration","Environment","Coherence Cluster System Resources");

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //  NavTree: Configuration -> Scheduling sub-Menu Elements:
    //      WorkManagers, Capacities, ContextRequestClasses, FairShareRequestClasses, MaxThreadsConstraints,
    //      MinThreadsConstraints, SchedulingResponseTimeRequestClasses, ManagedExecutorServiceTemplates,
    //      ManagedScheduledExecutorServiceTemplates, ManagedThreadFactoryTemplates
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Scheduling Sub-Menu Elements Test', async function () {
        file = "navTreeScheduling.png";
        try {
            //Create WorkManager-1,WorkManager-1,FairShareRequestClass-1,MaxThreadsConstraint-1,MinThreadsConstraint-1,
            //       ContextRequestClass-1,ResponseTimeRequestClass-1,ManagedExecutorServiceTemplate-1,
            await admin.createNewMBeanObject(driver,"TestWorkManager-1",2,"configuration","Scheduling","Work Managers");
            await admin.createNewMBeanObject(driver,"TestCapacity-1",2,"configuration","Scheduling","Capacities");
            await admin.createNewMBeanObject(driver,"TestFairShareRequestClass-1",2,"configuration","Scheduling","Fair Share Request Classes");
            await admin.createNewMBeanObject(driver,"TestContextRequestClass-1",2,"configuration","Scheduling","Context Request Classes");
            await admin.createNewMBeanObject(driver,"TestContextCase-1",4,"configuration","Scheduling",
                "Context Request Classes","TestContextRequestClass-1","Context Cases");
            await admin.createNewMBeanObject(driver,"TestMaxThreadsConstraint-1",2,"configuration","Scheduling","Max Threads Constraints");
            await admin.createNewMBeanObject(driver,"TestMinThreadsConstraint-1",2,"configuration","Scheduling","Min Threads Constraints");
            //TODO BUG?
            //await admin.createNewMBeanObject(driver,"TestResponseTimeRequestClass-1",2,"configuration","Scheduling",
            //    "Response Time Request Classes");
            await admin.createNewMBeanObject(driver,"TestManagedExecutorServiceTemplate-1",2,"configuration","Scheduling",
                "Managed Executor Service Templates");
            await admin.createNewMBeanObject(driver,"TestManagedScheduledExecutorServiceTemplates-1",2,"configuration",
                "Scheduling","Managed Scheduled Executor Service Templates");
            await admin.createNewMBeanObject(driver,"TestManagedThreadFactoryTemplates-1",2,"configuration",
                "Scheduling","Managed Thread Factory Templates");

            //Test to access to the form page
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Work Managers","TestWorkManager-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Scheduling","Work Managers","Capacities","TestCapacity-1");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Scheduling","Work Managers","TestWorkManager-1",
                "Work Manager Shutdown Trigger");
            await admin.goToNavTreeLevelFiveLink(driver,"configuration","Scheduling","Context Request Classes",
                "TestContextRequestClass-1","Context Cases","TestContextCase-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Fair Share Request Classes",
                "TestFairShareRequestClass-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Max Threads Constraints",
                "TestMaxThreadsConstraint-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Min Threads Constraints",
                "TestMinThreadsConstraint-1");
            //await admin.goToNavTreeLevelThreeLink(driver,"configuration","Scheduling","Response Time Request Classes",
            //    "ResponseTimeRequestClass-1");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Executor Service Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Scheduled Executor Service Templates");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Scheduling","Managed Thread Factory Templates");

            //Delete WorkManager-2,FairShareRequestClass-1,MaxThreadsConstraint-1,MinThreadsConstraint-1,
            //       ContextRequestClass-1,ResponseTimeRequestClass-1,ManagedExecutorServiceTemplate-1,
            await admin.deleteMBeanObject(driver,"TestWorkManager-1","WorkManagers",2,"configuration",
                "Scheduling","Work Managers");
            await admin.deleteMBeanObject(driver,"TestCapacity-1","Capacities",2,"configuration",
                "Scheduling","Capacities");
            await admin.deleteMBeanObject(driver,"TestFairShareRequestClass-1","FairShareRequestClasses",2,"configuration",
                "Scheduling","Fair Share Request Classes");
            await admin.deleteMBeanObject(driver,"TestContextCase-1","ContextRequestClasses",4,"configuration",
                "Scheduling","Context Request Classes","TestContextRequestClass-1","Context Cases","ContextCases");
            await admin.deleteMBeanObject(driver,"TestContextRequestClass-1","ContextRequestClasses",2,"configuration",
                "Scheduling","Context Request Classes");
            await admin.deleteMBeanObject(driver,"TestMaxThreadsConstraint-1","MaxThreadsConstraints",2,"configuration",
                "Scheduling","Max Threads Constraints");
            await admin.deleteMBeanObject(driver,"TestMinThreadsConstraint-1","MinThreadsConstraints",2,"configuration",
                "Scheduling","Min Threads Constraints");
            //await admin.deleteMBeanObject(driver,"ResponseTimeRequestClass-1","ResponseTimeRequestClasses",2,
            //    "configuration","Scheduling","Response Time Request Classes");
            await admin.deleteMBeanObject(driver,"TestManagedExecutorServiceTemplate-1","ManagedExecutorServiceTemplates",2,
                "configuration","Scheduling","Managed Executor Service Templates");
            await admin.deleteMBeanObject(driver,"TestManagedScheduledExecutorServiceTemplates-1","ManagedScheduledExecutorServiceTemplates",2,
                "configuration","Scheduling","Managed Scheduled Executor Service Templates");
            await admin.deleteMBeanObject(driver,"TestManagedThreadFactoryTemplates-1","ManagedThreadFactoryTemplates",2,
                "configuration","Scheduling","Managed Thread Factory Templates");

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test Case Name for NavTree:
    //  Configuration -> Deployments Menu Elements:
    //      AppDeployments, Libraries
    //
    it.skip('6. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->App Deployment Sub-Menu Elements Test', async function () {
        file = "navTreeConfigAppDeploy.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","App Deployments",
                "com.oracle.webservices.wls.ws-testclient-app-wls_12.1.4");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","App Deployments",
                "jms-local-adp");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","App Deployments",
                "physician");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","App Deployments",
                "jms-xa-adp");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","App Deployments",
                "medrec");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments","Libraries",
                "pwdgen");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Services Sub-Menu Elements Test', async function () {
        file = "navTreeConfigServiceSubMenu.png";
        try {
            //Create AdminJMSServer,MySAFAgent-1,MyAdminJmsModule-1,PathService-1,MyMessagingBridge-1,FileStore-1,
            await admin.createNewMBeanObject(driver,"TestAdminJMSServer-1",2,"configuration","Services","JMS Servers");
            await admin.createNewMBeanObject(driver,"TestMySAFAgent-1",2,"configuration","Services","SAF Agents");
            await admin.createNewMBeanObject(driver,"TestMyAdminJmsModule-1",2,"configuration","Services","JMS System Resources");
            await admin.createNewMBeanObject(driver,"TestPathService-1",2,"configuration","Services","Path Services");
            await admin.createNewMBeanObject(driver,"TestMyMessagingBridge-1",2,"configuration","Services","Messaging Bridges");
            await admin.createNewMBeanObject(driver,"TestFileStore-1",2,"configuration","Services","File Stores");
            await admin.createNewMBeanObject(driver,"TestJBossForeignJNDIProvider-1",2,"configuration","Services",
                "Foreign JNDI Providers");
            await admin.createNewMBeanObject(driver,"TestJMSBridgeDestination-1",2,"configuration","Services",
                "JMS Bridge Destinations");
            //await admin.createNewMBeanObject(driver,"JTestDBCSystemResource-1",2,"configuration","Services",
            //    "JDBC System Resources","","","searchselect","oj-searchselect-filter-DatasourceType|input",
            //    "DatasourceType","Multi Data Source");
            await admin.createNewMBeanObject(driver,"TestXMLReg-1",2,"configuration","Services","XML Registries");
            await admin.createNewMBeanObject(driver,"TestXMLEntity-1",2,"configuration","Services","XML Entity Caches");
            await admin.createNewMBeanObject(driver,"TestMyMailSession-1",2,"configuration","Services",
                "Mail Sessions","","","input","JNDIName|input","TestMyJndiName-1","");

            //Test cases to travel element links
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","JMS Servers","TestAdminJMSServer-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","SAF Agents","TestMySAFAgent-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","JMS System Resources","TestMyAdminJmsModule-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","Path Services","TestPathService-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","Messaging Bridges","TestMyMessagingBridge-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services",
                                                  "JMS Bridge Destinations","TestJMSBridgeDestination-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","File Stores","TestFileStore-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services",
                                                 "Foreign JNDI Providers","TestJBossForeignJNDIProvider-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","XML Registries","TestXMLReg-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","XML Entity Caches","TestXMLEntity-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","Mail Sessions","TestMyMailSession-1");
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Services","Osgi Frameworks");

            //Delete AdminJMSServer-2,MySAFAgent-1,MyAdminJmsModule-1,PathService-1,MyMessagingBridge-1,FileStore-1,
            await admin.deleteMBeanObject(driver,"TestAdminJMSServer-1","JMSServers",2,"configuration",
                "Services","JMS Servers");
            await admin.deleteMBeanObject(driver,"TestMySAFAgent-1","SAFAgents",2,"configuration",
                "Services","SAF Agents");
            await admin.deleteMBeanObject(driver,"TestMyAdminJmsModule-1","JMSSystemResources",2,"configuration",
                "Services","JMS System Resources");
            await admin.deleteMBeanObject(driver,"TestPathService-1","PathServices",2,"configuration",
                "Services","Path Services");
            await admin.deleteMBeanObject(driver,"TestMyMessagingBridge-1","MessagingBridges",2,"configuration",
                "Services","Messaging Bridges");
            await admin.deleteMBeanObject(driver,"TestFileStore-1","FileStores",2,"configuration",
                "Services","File Stores");
            await admin.deleteMBeanObject(driver,"TestJBossForeignJNDIProvider-1","ForeignJNDIProviders",2,"configuration",
                "Services","Foreign JNDI Providers");
            await admin.deleteMBeanObject(driver,"TestJMSBridgeDestination-1","JMSBridgeDestinations",2,"configuration",
                "Services","JMS Bridge Destinations");
            await admin.deleteMBeanObject(driver,"TestXMLReg-1","XMLRegistries",2,"configuration",
                "Services","XML Registries");
            await admin.deleteMBeanObject(driver,"TestXMLEntity-1","XMLEntityCaches",2,"configuration",
                "Services","XML Entity Caches");
            await admin.deleteMBeanObject(driver,"TestMyMailSession-1","MailSessions",2,"configuration",
                "Services","Mail Sessions");
            //await admin.deleteMBeanObject(driver,"TestJDBCSystemResource-1","JDBCSystemResources",2,"configuration",
              //  "Services","JDBC System Resources");

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Security Sub-Menu Elements Test', async function () {
        file = "navTreeConfigSecuritySubMenu.png";
        try {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms","myrealm");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Security","Realms",
                "myrealm","RDBMS Security Store");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Security","Realms",
                "myrealm","Adjudicator");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Security","Realms",
                "myrealm","Auditors");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"DefaultAuthenticator","configuration",
                "Security","Realms","myrealm","Authentication Providers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"DefaultIdentityAsserter","configuration",
                "Security","Realms","myrealm","Authentication Providers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"XACMLAuthorizer","configuration",
                "Security","Realms","myrealm","Authorizers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"WebLogicCertPathProvider","configuration",
                "Security","Realms","myrealm","Cert Path Providers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"DefaultCredentialMapper","configuration",
                "Security","Realms","myrealm","Credential Mappers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"DefaultCredentialMapper","configuration",
                "Security","Realms","myrealm","Credential Mappers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"SystemPasswordValidator","configuration",
                "Security","Realms","myrealm","Password Validators");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"XACMLRoleMapper","configuration",
                "Security","Realms","myrealm","Role Mappers");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Interoperability Sub-Menu Elements Test', async function () {
        file = "navTreeConfigInterOpSubMenu.png";
        try {
            //Create WTCServer-1,MySAFAgent-1,MyAdminJmsModule-1,PathService-1,MyMessagingBridge-1,FileStore-1,
            await admin.createNewMBeanObject(driver,"TestWTCServer",2,"configuration","Interoperability","WTC Servers");
            await admin.createNewMBeanObject(driver,"TestRedirect",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Redirections");
            await admin.createNewMBeanObject(driver,"TestMyLAP",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Local APs");
            await admin.createNewMBeanObject(driver,"TestMyRAP",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Remote APs");
            await admin.createNewMBeanObject(driver,"TestMyExport",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Exported");
            await admin.createNewMBeanObject(driver,"TestMyImport",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Imported");
            await admin.createNewMBeanObject(driver,"TestMyWTCPassword",4,"configuration","Interoperability",
                "WTC Servers","TestWTCServer","Passwords");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Interoperability","WTC Servers","TestWTCServer");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Interoperability","WTC Servers",
                "TestWTCServer","Local APs");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"DefaultAuthenticator","configuration",
                "Security","Realms","myrealm","Authentication Providers");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"myLAP","configuration",
                "Interoperability","WTC Servers","TestWTCServer","Local APs");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"myRAP","configuration",
                "Interoperability","WTC Servers","TestWTCServer","Remote APs");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"myExport","configuration",
                "Interoperability","WTC Servers","TestWTCServer","Exported");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"myImport","configuration",
                "Interoperability","WTC Servers","TestWTCServer","Imported");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyWTCPassword","configuration",
                "Interoperability","WTC Servers","TestWTCServer","Passwords");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Interoperability","WTC Servers",
                "TestWTCServer","Resources");
            await admin.goToNavTreeLevelFourLink(driver,"configuration","Interoperability","WTC Servers",
                "TestWTCServer","Queuing Bridge");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"Redirect","configuration",
                "Interoperability","WTC Servers", "TestWTCServer","Redirections");

            //Delete WTCServer-1,MyWldfModule
            await admin.deleteMBeanObject(driver,"TestWTCServer","WTCServers",2,"configuration",
                "Interoperability","WTC Servers");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //
    it.skip('10. Test Category: GAT/Risk1\n \t Test Scenario: NavTree Configuration->Diagnostics Sub-Menu ' +
        'Elements Test', async function () {
        file = "navTreeConfigDiagnosticsSubMenu.png";
        try {
            await admin.createNewMBeanObject(driver,"TestMyWldfModule",2,"configuration","Diagnostics",
                "WLDF System Resources");
            await admin.createNewMBeanObject(driver,"TestMyThreadDumpAction",4,"configuration","Diagnostics",
                "WLDF System Resources","TestMyWldfModule","Thread Dump Actions");
            await admin.createNewMBeanObject(driver,"TestMyImageNotification",4,"configuration","Diagnostics",
                "WLDF System Resources","TestMyWldfModule","Image Notifications");
            await admin.createNewMBeanObject(driver,"TestMyJmsAction",4,"configuration","Diagnostics",
                "WLDF System Resources","TestMyWldfModule","JMS Notifications","input",
                "DestinationJNDIName|input","TestMyJmsDestinationJndi","");
            await admin.createNewMBeanObject(driver,"TestMyJmxAction",4,"configuration","Diagnostics",
                "WLDF System Resources","TestMyWldfModule","JMX Notifications");
            /* FIXME
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyThreadDumpAction","configuration",
                "Diagnostics","WLDF System Resources", "TestMyWldfModule","Thread Dump Actions");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyImageNotification","configuration",
                "Diagnostics","WLDF System Resources", "TestMyWldfModule","Image Notifications");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyJmsAction","configuration",
                "Diagnostics","WLDF System Resources", "TestMyWldfModule","JMS Notifications");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyJmxAction","configuration",
                "Diagnostics","WLDF System Resources", "TestMyWldfModule","JMX Notifications");
            await admin.goToFirstTabFromNavTree(driver, 4, 1,"TestMyThreadDumpAction","configuration",
                "Diagnostics","WLDF System Resources", "TestMyWldfModule","Thread Dump Actions");
            */
           await admin.deleteMBeanObject(driver,"TestMyWldfModule","WLDFSystemResources",2,"configuration",
                 "Diagnostics","WLDF System Resources");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
