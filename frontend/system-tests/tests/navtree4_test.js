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
describe.only('Test Suite: navtree4_test for Navtree Test-Suite', function () {
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
            //Create AdminJMSServer,MySAFAgent-1,MyAdminJmsModule-1,PathService-1,MyMessagingBridge-1,FileStore-123,
            await admin.createNewMBeanObject(driver,"TestAdminJMSServer-1",2,"configuration","Services","JMS Servers");
            await admin.createNewMBeanObject(driver,"TestMySAFAgent-1",2,"configuration","Services","SAF Agents");
            await admin.createNewMBeanObject(driver,"TestMyAdminJmsModule-1",2,"configuration","Services","JMS System Resources");
            await admin.createNewMBeanObject(driver,"TestPathService-1",2,"configuration","Services","Path Services");
            await admin.createNewMBeanObject(driver,"TestMyMessagingBridge-1",2,"configuration","Services","Messaging Bridges");
            await admin.createNewMBeanObject(driver,"TestFileStore-123",2,"configuration","Services","File Stores");
            await admin.createNewMBeanObject(driver,"TestJBossForeignJNDIProvider-1",2,"configuration","Services",
                "Foreign JNDI Providers");
            await admin.createNewMBeanObject(driver,"TestJMSBridgeDestination-1",2,"configuration","Services",
                "JMS Bridge Destinations");
            //await admin.createNewMBeanObject(driver,"JTestDBCSystemResource-1",2,"configuration","Services",
            //    "JDBC System Resources","","","searchselect","oj-searchselect-filter-DatasourceType|input",
            //    "DatasourceType","Multi Data Source");
            //await admin.createNewMBeanObject(driver,"TestXMLReg-1",2,"configuration","Services","XML Registries");
            //await admin.createNewMBeanObject(driver,"TestXMLEntity-1",2,"configuration","Services","XML Entity Caches");
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
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","File Stores","TestFileStore-123");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services",
                                                 "Foreign JNDI Providers","TestJBossForeignJNDIProvider-1");
            //await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","XML Registries","TestXMLReg-1");
            //await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","XML Entity Caches","TestXMLEntity-1");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","Mail Sessions","TestMyMailSession-1");
            //await admin.goToNavTreeLevelTwoLink(driver,"configuration","Services","Osgi Frameworks");

            //Delete AdminJMSServer-2,MySAFAgent-1,MyAdminJmsModule-1,PathService-1,MyMessagingBridge-1,TestFileStore-123,
            await admin.deleteMBeanObject(driver,"TestAdminJMSServer-1","JMSServers",2,"configuration",
                "Services","JMS Servers","","","",4);
            await admin.deleteMBeanObject(driver,"TestMySAFAgent-1","SAFAgents",2,"configuration",
                "Services","SAF Agents","","","",2);
            await admin.deleteMBeanObject(driver,"TestMyAdminJmsModule-1","JMSSystemResources",2,"configuration",
                "Services","JMS System Resources","","","",3);
            await admin.deleteMBeanObject(driver,"TestPathService-1","PathServices",2,"configuration",
                "Services","Path Services","","","",2);
            await admin.deleteMBeanObject(driver,"TestMyMessagingBridge-1","MessagingBridges",2,"configuration",
                "Services","Messaging Bridges","","","",2);
            await admin.deleteMBeanObject(driver,"TestFileStore-123","FileStores",2,"configuration",
                "Services","File Stores","","","",3);
            await admin.deleteMBeanObject(driver,"TestJBossForeignJNDIProvider-1","ForeignJNDIProviders",2,"configuration",
                "Services","Foreign JNDI Providers","","","",2);
            await admin.deleteMBeanObject(driver,"TestJMSBridgeDestination-1","JMSBridgeDestinations",2,"configuration",
                "Services","JMS Bridge Destinations","","","",3);
            /* await admin.deleteMBeanObject(driver,"TestXMLReg-1","XMLRegistries",2,"configuration",
                "Services","XML Registries","","","",2);
            await admin.deleteMBeanObject(driver,"TestXMLEntity-1","XMLEntityCaches",2,"configuration",
                "Services","XML Entity Caches","","","",2); */
            await admin.deleteMBeanObject(driver,"TestMyMailSession-1","MailSessions",2,"configuration",
                "Services","Mail Sessions","","","",3);

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
