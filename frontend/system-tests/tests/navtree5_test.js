
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
describe.only('Test Suite: navtree5_test for Navtree Test-Suite', function () {
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
                "Interoperability","WTC Servers","","","",2);
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
