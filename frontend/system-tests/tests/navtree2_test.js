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
describe.only('Test Suite: navtree2_test for Navtree Test-Suite', function () {
    let driver;
    let file = "snapStripTree.png";
    let element;
    var sec = 1000;
    this.timeout(7000 * sec);

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
            await admin.createNewMBeanObject(driver,"TestMachine-1",2,"configuration","Environment","Machines");
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

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Servers","TestServer-1",5);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Server Templates",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Server Templates","TestServerTemplate-1",2);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Machines",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Machines","TestMachine-1",3);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Clusters",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Clusters","TestCluster-1",3);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Virtual Hosts",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Virtual Hosts","TestVirtualHost-1",1);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Singleton Services",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Singleton Services","TestSingleton-1",2);

            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Coherence Cluster System Resources",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Coherence Cluster System Resources","TestCoherenceCluster-1",1);

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
