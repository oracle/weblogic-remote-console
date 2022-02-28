// Shopping Cart and other Tool Icon Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get Navtree elements and Cluster table/form properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;

// Get Cluster and Machines functions
const Cluster = require('../lib/machineAndClusterProps');
const Server = require('../lib/serverAndTemplateProperty');

// NavTree Form, Table, Create, Shopping Cart Test Suite
describe.only('Test Suite: utilities_test for Additions/Modification/Deletion/ViewChange Shopping Cart menu and its toggle icon', function () {
    let driver;
    let file = "shoppingCart.png";
    let element;
    var sec = 1000;
    this.timeout(600 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        cluster = new Cluster(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //
    //  Create testCluster-1, testServer-1 and testServerTemplate-1
    //  Save to shopping cart
    //  Go to shopping cart -> click at Addition Objects -> click at testServerTemplate-1
    //  Select AdminServer from Configuration->Environment-Servers menu
    //  Assign TestCluster-1 to AdminServer
    //

    //Test Case:
    // Validate Addition and Modification items in Shopping Cart (Server, ServerTemplate and Cluster) Objects
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Validate Addition and Modification items in Shopping Cart for (Server, ServerTemplate and Cluster) ' +
        'Objects', async function() {
        file = "TestShoppingCart-1.png";
        try {

            await admin.createMBeanObjectFromLandingPage(driver,"TestCluster-1","Edit Tree","EnvironmentChevron",
                "Clusters",1);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(2400);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServer-1","Edit Tree","EnvironmentChevron",
                "Servers",1);
            await driver.sleep(2400);
            await admin.saveToShoppingCart(driver);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServerTemplate-1","Edit Tree","EnvironmentChevron",
                "Server Templates",1);
            await driver.sleep(2400);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(900);

            await admin.viewChanges(driver);
            await driver.sleep(2400);
            console.log("Click Additions header text pool link");
            await driver.findElement(By.xpath("//span[@id=\'oj-collapsible-additions-header\']/a")).click();
            await driver.sleep(2400);
            console.log("Click Domain/Server Templates/TestServerTemplate-1 link");
            await driver.findElement(By.linkText("/Domain/Server Templates/TestServerTemplate-1")).click();
            await driver.sleep(2400);
            /* FIXME
            await admin.viewChanges(driver);
            console.log("Click Additions header text pool link");
            await driver.findElement(By.xpath("//span[@id=\'oj-collapsible-additions-header\']/a")).click();
            await driver.sleep(9400);
            console.log("Click Domain/Clusters/TestCluster-1 link");
            await driver.findElement(By.linkText("/Domain/Clusters/TestCluster-1")).click();
            await driver.sleep(2400);
            await admin.enableCheckBox(driver,'show-advanced-fields');
            console.log("Set AdminServer ClusterAddress to localhost");
            await driver.findElement(By.id("ClusterAddress|input")).click();
            await driver.findElement(By.id("ClusterAddress|input")).sendKeys("localhost");
            await driver.sleep(2400);
            */
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer","General");
            await admin.selectDropDownList(driver,idName='Cluster',
                searchList="oj-searchselect-filter-Cluster|input","TestCluster-1");
            await admin.saveToShoppingCart(driver);
            await driver.sleep(2400);

            await admin.viewChanges(driver);
            console.log("Click Modifications header text pool link");
            await driver.findElement(By.xpath("//span[@id=\'oj-collapsible-modifications-header\']/a")).click();
            console.log("Click Domain/Servers/AdminServer link");
            await driver.findElement(By.linkText("/Domain/Servers/AdminServer")).click();
            await driver.sleep(2400);
            await admin.discardChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Validate Deletion items in Shopping Cart (Server, ServerTemplate and Cluster) Objects
    // Validate toggle icon to collapse and expand Shopping Cart Menu section
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Validate Removal items in Shopping Cart for (Server and Cluster) Objects and toggle ' +
        'icon to collapse/expand Shopping Cart Menu section', async function() {
        file = "TestShoppingCart-2.png";
        try {
           let object_count = 2;
            await admin.createMBeanObjectFromLandingPage(driver,"TestCluster-1","Edit Tree","EnvironmentChevron",
                "Clusters",1);
            await admin.saveAndCommitChanges(driver);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServer-1","Edit Tree","EnvironmentChevron",
                "Servers",1);
            await admin.saveAndCommitChanges(driver);
            await driver.sleep(900);
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Clusters",0);
            await driver.sleep(1200);
            await admin.deleteMBeanFromLandingPage(driver,"Clusters","TestCluster-1",3);
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Servers","TestServer-1",5);
            await driver.sleep(900);
            await admin.viewChanges(driver);

            console.log("Click Removal header text pool link");
            await driver.findElement(By.xpath("//span[@id=\'oj-collapsible-removals-header\']/a")).click();
            await driver.sleep(900);
            if (await driver.findElement(
                By.xpath("//div[@id=\'shoppingcart-tab-container-toolbar\']/div/div/a["+object_count+"]/img")));
                console.log("Found " +object_count+ " objects (TestCluster-1 and TestServer-1) in Shopping Cart Removal menu");
            await driver.sleep(900);
            console.log("Click Toggle icon to collapse Shopping Cart menu section");
            await driver.findElement(By.xpath("//div[@id=\'slideup-toggle\']/img")).click();
            await driver.sleep(900);

            console.log("Click commit changes in shopping cart to validate removal of TestCluster-1 and TestServer-1 objects");
            element = driver.findElement(By.id("shoppingCartImage"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            await driver.findElement(By.xpath("//a[@id=\'shoppingCartMenuLauncher\']/img")).click();
            await driver.sleep(300);
            await driver.findElement(By.xpath("//span[contains(.,\'Commit Changes\')]")).click();
            await driver.sleep(900)
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Validate Toggle Visibility of History Icon and its functionality for (Server, ServerTemplate and Cluster) Objects
    // Validate History of MBean Tree View Action Bar
    //
    it.skip('3. Test Category: GAT/Risk1\n \t Test Scenario: Validate Toggle Visibility of History Icon and its functionality for ' +
        '(Server, ServerTemplate and Cluster) Objects, And History of MBean Tree View Action Bar', async function() {
        file = "TestUtilities_Icon-1.png";
        try {
            let object_count = 3;
            await admin.createMBeanObjectFromLandingPage(driver,"TestCluster-2","Edit Tree","EnvironmentChevron",
                "Clusters",1);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(900);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServer-2","Edit Tree","EnvironmentChevron",
                "Servers",1);
            await driver.sleep(900);
            await admin.saveToShoppingCart(driver);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServerTemplate-2","Edit Tree","EnvironmentChevron",
                "Server Templates",1);
            await driver.sleep(900);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(900);
            console.log("Click Toggle History link");
            await driver.findElement(By.id("toggle-history")).click();
            await driver.sleep(900);
            console.log("Click MenuLauncher button");
            element = driver.findElement(By.css("#moreMenuLauncher > .button-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            console.log("Click Drop down button menu");
            await driver.findElement(By.css(".oj-combobox-arrow")).click();
            await driver.sleep(900);
            console.log("Click Domain/Server Templates/TestServerTemplate-2 Link");
            await driver.findElement(By.id("oj-listbox-result-label-2")).click();
            console.log("Click Drop down button menu");
            await driver.findElement(By.css(".oj-combobox-arrow")).click();
            console.log("Click toggle history input bar");
            await driver.sleep(900);
            element = driver.findElement(By.id("beanpath|input"));
            if (element.isSelected()) {
                await element.click();
                console.log("Enter Domain | ServerTemplates");
                await element.sendKeys("Domain | ServerTemplates");
                await driver.sleep(9900);
                await element.sendKeys(Key.ENTER);
            }
            await driver.sleep(9900);
            await admin.discardChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test Case:
    // Validate Auto-reload Interval and Stop Reload Interval functionality for Server Object
    // Validate Home Landing-Page icon
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: Validate Auto-reload Interval and Stop Reload Interval functionality ' +
        'for Server Object. Validate Home Landing-Page icon', async function() {
        file = "TestUtilities_Icon-2.png";
        try {
            let object_count = 1;
            let reloadValue = 15;

            await admin.createMBeanObjectFromLandingPage(driver,"TestServer-3","Edit Tree","EnvironmentChevron",
                "Servers",1);
            await driver.sleep(900);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(900);
            console.log("Click Home Landing Page Icon");
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers");
            console.log("Click Set Auto-reload Interval Icon");
            await driver.sleep(900);
            element = driver.findElement(By.id("sync-interval-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            element = driver.findElement(By.id("interval-field|input"));
            if (element.isSelected()) {
                console.log("Enter reload interval value = " + reloadValue);
                await element.clear();
                await element.sendKeys(reloadValue);
                await driver.sleep(900);
                console.log("Click OK button at Reload Interval Dialog");
                await driver.findElement(By.xpath("//span[contains(.,\'OK\')]")).click();
            }
            await driver.sleep(2400);
            console.log("Click Stop Reload Interval Icon");
            element = driver.findElement(By.id("sync-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isSelected()) {
                await element.click();
            }
            await driver.sleep(900);
            await admin.discardChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
