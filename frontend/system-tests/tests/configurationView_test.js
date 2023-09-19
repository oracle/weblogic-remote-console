//
// Configuration View Navtree Test Suite for:
//    Environment, Deployment, Services, Security and Diagnostics
//

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get browser and domain properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;
// Get Services functions
const Services = require('../lib/servicesProps');

// NavTree Test Suite
describe.only('Test Suite: configurationView_test for functionality', function () {
    let driver;
    let file = "configurationView.png";
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
    // Configuration(NavTree) -> Environment
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Configuration View Tree-> ' +
        'Environment -> Servers -> AdminServer -> Edit Tree', async function () {
        file = "ConfigurationViewTreeServerAdminMenu.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"view","Environment");
            await driver.sleep(1200);
            console.log('Click to expand Server navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'Servers')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click AdminServer node');
            await driver.findElement(By.xpath("//span[contains(.,'AdminServer')]")).click();
            await driver.sleep(1200);
            console.log('Click to expand AdminServer menu');
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log('Select AdminServer - Edit Tree menu');
            await driver.findElement(By.xpath("//span[text()='AdminServer - Edit Tree']")).click();
            await driver.sleep(2400);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    // Configuration(NavTree)->Deployment ->
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Configuration(NavTree) -> Deployments ' +
        '-> App Deployments -> jms-local-adp -> Select Status - Monitoring Tree', async function () {
        file = "configurationDeploymentsMenu.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"view","Deployments");
            await driver.sleep(1200);
            console.log('Click to expand App Deployments navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'App Deployments')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click jms-local-adp Application');
            await driver.findElement(By.xpath("//span[contains(.,'jms-local-adp')]")).click();
            await driver.sleep(1200);
            console.log('Click jms-local-adp pop down menu menu');
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log('Select Status - Monitoring Tree');
            await driver.findElement(By.xpath("//span[text()='Status - Monitoring Tree']")).click();
            await driver.sleep(2400);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Configuration(NavTree)->Services -> JMS Bridge Local Destination
    //
    it('3. Test Category: GAT/Risk3\n \t Test Scenario: Configuration(NavTree) -> Services -> ' +
                'JMS Bridge Destinations -> JMS Bridge Local Destination - Edit Tree ', async function () {
        file = "configurationNavTreeServicesJMSBridgeLocalDestinationMenu.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"view","Services");
            await driver.sleep(1200);
            console.log('Click to expand JMS Bridge Destinations navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'JMS Bridge Destinations')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click JMS Bridge Local Destination');
            await driver.findElement(By.xpath("//span[contains(.,'JMS Bridge Local Destination')]")).click();
            await driver.sleep(1200);
            console.log('Click JMS Bridge Local Destination pop down menu menu');
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log('Select JMS Bridge Local Destination - Edit Tree');
            await driver.findElement(By.xpath("//span[text()='JMS Bridge Local Destination - Edit Tree']")).click();
            await driver.sleep(2400);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    // Configuration(NavTree)-> Security -> Realms -> AllProvidersRealm ->
    // Authorizers -> XACMLAuthorizer -> XACML Authorizer Security Data - Security Data Tree
    //
    it('4. Test Category: GAT/Risk3\n \t Test Scenario: Configuration(NavTree)-> Security -> ' +
        'Realms -> AllProvidersRealm -> Authorizers -> XACMLAuthorizer', async function () {
        file = "configurationSecurityAuthorizersXACMLAuthorizerMenu.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"view","Security");
            await driver.sleep(1200);
            console.log('Click Realms navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'Realms')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click AllProvidersRealm navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'AllProvidersRealm')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click Authorizers navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'Authorizers')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click XACMLAuthorizer navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'XACMLAuthorizer')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click XACMLAuthorizer pop down menu menu');
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[4]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log('Select XACML Authorizer Security Data - Security Data Tree');
            await driver.findElement(By.xpath("//span[text()='XACML Authorizer Security Data - Security Data Tree']")).click();
            await driver.sleep(2400);
            console.log("TEST PASS ");
         } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
         } 
     })

    // Configuration(NavTree)-> Diagnostics -> WLDF System Resources -> MyWldfModule ->
    // Policies -> MyCalendarPolicy
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Configuration(NavTree)-> Diagnostics ->' +
        ' WLDF System Resources -> MyWldfModule -> Policies -> MyCalendarPolicy', async function () {
        file = "configurationDialognosticsWLDFMyWldfModulePoliciesMyCalendarMenu.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"view","Diagnostics");
            await driver.sleep(1200);
            console.log('Click WLDF System Resources navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'WLDF System Resources')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click MyWldfModule navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'MyWldfModule')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click Policies navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'Policies')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click MyCalendarPolicy navTree node');
            await driver.findElement(By.xpath("//span[contains(.,'MyCalendarPolicy')] [@class='oj-navigationlist-item-label']")).click();
            await driver.sleep(1200);
            console.log('Click MyCalendarPolicy pop down menu menu');
            await driver.findElement(By.xpath("//*[@id='breadcrumbs-container']/ul/li[4]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log('Select MyCalendarPolicy - Edit Tree');
            await driver.findElement(By.xpath("//span[text()='MyCalendarPolicy - Edit Tree']")).click();
            await driver.sleep(2400);

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
    
})
