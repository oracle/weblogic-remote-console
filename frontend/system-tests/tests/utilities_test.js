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
    // Validate Addition and Modification items in Shopping Cart of (Server, ServerTemplate and Cluster) Objects
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Validate Addition and Modification items in Shopping Cart of (Server, ServerTemplate and Cluster) ' +
        'Objects', async function() {
        file = "TestShoppingCart-1.png";
        try {
            await admin.createMBeanObjectFromLandingPage(driver,"TestCluster-1","Edit Tree","EnvironmentChevron",
                "Clusters",1);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(1200);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServer-1","Edit Tree","EnvironmentChevron",
                "Servers",1);
            await driver.sleep(1200);
            await admin.saveToShoppingCart(driver);
            await admin.createMBeanObjectFromLandingPage(driver,"TestServerTemplate-1","Edit Tree","EnvironmentChevron",
                "Server Templates",1);
            await driver.sleep(1200);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(1200);
            await admin.viewChanges(driver);
            await driver.sleep(1200);
            console.log("Click Additions header text pool link");
            await driver.sleep(2400);
            console.log("Click Domain/Server Templates/TestServerTemplate-1 link, 3rd row in the Addition section");
            await driver.findElement(By.xpath("//table[@id='additions-table']/tr[3]/td/a")).click();
            await driver.sleep(1200);
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers");
            await driver.sleep(2400);
            console.log("Click TestServer-1");
            await driver.findElement(By.xpath("//td[contains(.,'TestServer-1')]")).click();
            await driver.sleep(2400);
            console.log("Click Cluster");
            await driver.findElement(By.id("Cluster")).click();
            await driver.sleep(2400);
            console.log("Click TestCluster-1");
            await driver.findElement(By.xpath("//span[contains(.,'TestCluster-1')]")).click();
            await driver.sleep(2400);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(2400);
            await admin.viewChanges(driver);
            console.log("Click Domain/Servers/TestServer-1 link - 4th row in the Addition section");
            await driver.findElement(By.xpath("//table[@id='additions-table']/tr[4]/td/a")).click();
            await driver.sleep(2400);
            console.log("Click Discard Changes Icon Menu");
            await driver.findElement(By.xpath("//span[@id='discard-tab-button']")).click();
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
            await driver.sleep(1200);
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Servers",0);
            await driver.sleep(2400);
            await admin.deleteMBeanFromLandingPage(driver,"Servers","TestServer-1",5);
            await driver.sleep(900);
            await admin.viewChanges(driver);
            await driver.sleep(900);
            console.log("Verify if TestCluster-1 and TestServer-1 objects appear in Removals section");
            if (await driver.findElement(
                By.xpath("//span[@id='removals-count' and text()='Removals (2)']")));
            console.log("Found " +object_count+ " objects (TestCluster-1 and TestServer-1) in Shopping Cart Removal menu");
            await driver.sleep(900);
            console.log("Click commit changes in shopping cart to validate removal of TestCluster-1 and TestServer-1 objects");
            console.log("Click Commit Changes Icon Image");
            //await driver.findElement(By.xpath("//img[@id='commit-tab-button']")).click();
            await driver.findElement(By.xpath("//span[@id='commit-tab-button']")).click();
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
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Validate Toggle Visibility of History Icon and its functionality for ' +
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
            await driver.sleep(8800);
            console.log("Click Toggle History link");
            await driver.findElement(By.xpath("//img[@title='Toggle visibility of history']")).click();
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
            console.log("Click Server Templates | TestServerTemplate-2 Link");
            await driver.findElement(By.xpath("//*[text()='Server Templates | TestServerTemplate-2']")).click();
            console.log("Click Drop down button menu");
            await driver.findElement(By.css(".oj-combobox-arrow")).click();
            console.log("Click toggle history input bar");
            await driver.sleep(900);
            element = driver.findElement(By.xpath("//input[@id='beanpath-history-entries|input']"));
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
            let reloadValue = 5;
            console.log("Click Home Landing Page Icon");
            await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","EnvironmentChevron",
                "Servers");
            console.log("Click AdminServer");
            await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
            await driver.sleep(3600);
            console.log("Click Set Auto-reload Interval Icon");
            await driver.sleep(3600);
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
                await driver.findElement(By.xpath("//span[contains(.,'OK')]")).click();
            }
            await driver.sleep(2400);
            console.log("Click Stop Reload Interval Icon");
            element = driver.findElement(By.id("sync-icon"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isSelected()) {
                await element.click();
            }
            await driver.sleep(900);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create->modify(Cluster Customize menu)-> Test Available Columns, Selected Columns
    // removeRight, removeLeft, addAllRight and addAllLeft arrow, Apply and Reset buttons.
    //
    it('5. Test Category: GAT/Risk3\n \t Test Scenario: Customize menu of Cluster ', async function() {
        file = "customizeCluster-1.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Clusters");
            await driver.sleep(1200);
            console.log("Click Customizer Toggler");
            await driver.findElement(By.id("table-customizer-toggler")).click();
            await driver.sleep(1200);

            console.log("Click Multicast Address");
            await driver.findElement(By.xpath("//oj-selector[@id='unselected_checkboxsetMulticastAddress']")).click();
            await driver.sleep(600);
            console.log("Click Add To Right Arrow");
            await driver.findElement(By.xpath("//oj-button[@id='addToRight']")).click();
            await driver.sleep(600);
            console.log("Click Cancel Button");
            await driver.findElement(By.xpath("//oj-button[3]/button/div/span/span")).click();
            await driver.sleep(600);

            console.log("Verify if user can click to select Multicast Address again after click Cancel button");
            console.log("Click Multicast Address");
            await driver.findElement(By.xpath("//oj-selector[@id='unselected_checkboxsetMulticastAddress']")).click();
            await driver.sleep(600);
            console.log("Click Multicast Port");
            await driver.findElement(By.xpath("//oj-selector[@id='unselected_checkboxsetMulticastPort']")).click();
            await driver.sleep(600);
            console.log("Click Service Age Threshold");
            await driver.findElement(By.xpath("//oj-selector[@id='unselected_checkboxsetServiceAgeThresholdSeconds']")).click();
            await driver.sleep(600);
            console.log("Click Left Arrow");
            await driver.findElement(By.xpath("//oj-button[@id='removeRight']")).click();
            await driver.sleep(600);
            console.log("Click Apply Button");
            element = driver.findElement(By.xpath("//oj-button[2]/button/div/span/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(600);
            await element.click();
            await driver.sleep(600);
            console.log("Click Reset Button");
            await driver.findElement(By.xpath("//oj-button[1]/button/div/span/span")).click();
            console.log("Click Middle Container");
            await driver.findElement(By.xpath("//div[@id='middle-container']")).click();
            await driver.sleep(600);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Search Utility
    // From Edit Tree -> Environment -> Servers page -> enter to search Admin keyword
    // The search will yield 3 elements (AdminJMSServer, AdminServer, MyAdminJMWModule)
    // Click at AdminServer 2nd row -> validate if AdminServer edit page shows up
    it('6. Test Category: GAT/Risk3\n \t Test Scenario: Search Utility for Admin key word ', async function() {
        file = "searchUtilityAdminKeyWord.png";
        try {
            await admin.goToNavTreeLevelOneLink(driver,"configuration","Environment");
            await driver.sleep(1200);
            console.log("Enter Element Search for AdminServer");
            element = driver.findElement(By.xpath("//input[@type='text']"));
            await element.sendKeys("Admin");
            await element.sendKeys(Key.ENTER);
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//oj-table[@id='table']/div/table/tbody/tr[2]/td")).click();
            await driver.executeScript("window.scrollTo(0,0)")
            await driver.sleep(2400);
            var server_name;
            element = driver.findElement(By.xpath("//oj-input-text[@id='Name']/div/div/div/div"));
            await driver.sleep(300);
            var promise = element.getText();
            promise.then(function (text) {
                server_name = text;
            });
            if (element.isEnabled()) {
                await element.click();
                console.log("Server Name is: " + server_name);
                await driver.findElement(By.xpath("//input[@id='show-advanced-fields|cb']")).click();
                console.log("TEST PASS ");
            }
            else {
                console.log("Element Search has no AdminServer page! ");
                console.log("TEST FAIL ");
            }
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Search Utility
    // From Edit Tree -> enter to search Server keyword
    // The search will yield 3 elements (AdminJMSServer, AdminServer, JMSServer1, JMSServer1Subdeploy,....)
    // Click AdminJMSServer 1st row -> Switch to Configuration View Tree Search breadcrumbs
    // Click Reset -> Add All Left -> Cancel button
    // Click select breadcrumbs-container menu to switch back to Edit Tree view
    // Click to look for AdminJMSServer name in test page for confirm if operation successful
    it('7. Test Category: GAT/Risk3\n \t Test Scenario: Search Utility for Server key word ' +
        'Test out breadcrumbs-container menu, Reset, Cancel, Arrow button....', async function() {
        file = "searchUtilityWithServerKeyWord.png";
        try {
            await admin.goToNavStripImageMenuLink(driver,"configuration");
            await driver.sleep(1200);
            console.log("Enter Element Search for Server");
            element = driver.findElement(By.xpath("//input[@type='text']"));
            await element.sendKeys("Server");
            await element.sendKeys(Key.ENTER);
            await driver.sleep(8400);
            console.log("Click at Recent Search breadcrumbs-container");
            await driver.findElement(
                By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(8400);
            console.log("Click to select Recent Searches - Server");
            await driver.findElement(By.xpath("//span")).click();

            await driver.sleep(8600);
            await driver.executeScript("window.scrollTo(0,0)");
            console.log("Click Customizer Table");
            await driver.findElement(By.xpath("//span[@id='table-customizer-toggler']")).click();
            await driver.sleep(8400);
            console.log("Click Reset button");
            element = driver.findElement(By.xpath("//oj-button[@id='reset']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            await driver.executeScript("window.scrollTo(0,0)");
            console.log("Click Add All Left button");
            await driver.sleep(900);
            await driver.findElement(By.xpath("//oj-button[@id='removeAll']")).click();
            await driver.sleep(900);
            console.log("Click Cancel button");
            await driver.findElement(By.xpath("//oj-button[@id='cancel']")).click();
            await driver.sleep(900);
            await driver.executeScript("window.scrollTo(0,0)");
            console.log("Click Customizer Table");
            await driver.findElement(By.xpath("//a[@id='customize']/span")).click();
            await driver.sleep(2400);
            console.log("Select 1st row of element in the Customizer Table");
            await driver.findElement(By.xpath("//oj-table[@id='table']/div/table/tbody/tr/td")).click();
            await driver.sleep(900);
            console.log("Click select breadcrumbs-container menu");
            await driver.findElement(
                By.xpath("//div[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button")).click();
            await driver.sleep(8400);
            console.log("Click to switch to AdminJMSServer - Configuration Tree");
            await driver.findElement(By.xpath("//span[contains(.,'AdminJMSServer - Configuration View Tree')]")).click();
            await driver.sleep(8400);
            var server_name;
            element = driver.findElement(By.xpath("//oj-input-text[@id='Name']"));
            await driver.sleep(2400);
            var promise = element.getText();
            promise.then(function (text) {
                server_name = text;
            });
            if (element.isEnabled()) {
                await element.click();
                if (server_name == 'AdminJMSServer') {
                    console.log("Server Name is: " + server_name);
                    console.log("TEST PASS ");
                }
            }
            else {
                console.log("Server Name is not equal to AdminJMSServer ");
                console.log("TEST FAIL ");
            }
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test Case:
    // Search Utility with WDT Provider
    // From WDT Edit Tree -> create testServer-1, testCluster-1, testMachine-1, testJMSServer-1
    // Enter 'test' at Search utility
    // Go to Recently Search box and check if 'test' keyword appears in Search box
    // Click at 'test' search keyword
    // Verify search will yield 4 elements (testServer-1, testCluster-1, testMachine-1, testJMSServer-1,....)
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: Search Utility with WDT Provider, ' +
        'test search keyword will yield 4 elements (testServer-1, testCluster-1, testMachine-1, testJMSServer-1)',
        async function () {
        file = "searchWithTestKeyWordForWDTProvider.png";
        try {
            const projFile = "frontend/system-tests/lib/domainProject.json";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;
            await admin.importProject(driver,prjFile);
            await driver.sleep(4800);
            await admin.createNewWDTModelFile(driver,"testWDTProviderName","testWDTFile");
            await driver.sleep(2400);
            await admin.selectTree(driver,"testWDTProviderName");
            await driver.sleep(4800);

            console.log("Click WDT Model Tree");
            await driver.findElement(By.xpath("//*[@id='modeling']/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Environment");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Server");
            await driver.findElement(By.xpath("//span[contains(.,'Servers')]")).click();
            await driver.sleep(4800)
            console.log("Click Servers New button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter testServer-1 name");
            await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testServer-1");
            await driver.sleep(2400);
            console.log("Click Create button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span[1]/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Cluster");
            await driver.findElement(By.xpath("//span[contains(.,'Clusters')]")).click()
            await driver.sleep(2400);
            console.log("Click Cluster New button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter testCLuster-1 name");
            await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testCluster-1");
            await driver.sleep(2400);
            console.log("Click Create button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span[1]/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Machines");
            await driver.findElement(By.xpath("//span[contains(.,'Machines')]")).click();
            await driver.sleep(2400);
            console.log("Click Machine New button");
            element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            console.log("Enter testMachine-1 name");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//oj-input-text[@id='Name']/div/div/input")).sendKeys("testMachine-1");
            await driver.sleep(2400);
            console.log("Click Create button");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Click Home Image");
            await driver.findElement(By.xpath("//span[starts-with(@id, 'home')]")).click();
            await driver.sleep(4800);
            console.log("Click WDT Model Tree");
            await driver.findElement(By.xpath("//*[@id='modeling']/img")).click();
            await driver.sleep(4800);
            console.log("Click Services Landing Page");
            element = await driver.findElement(By.id("Services"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(4800);
            console.log("Click Landing Page Services -> JMS Servers");
            element = await driver.findElement(By.xpath("//span[contains(.,'JMS Servers')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(2400);
            console.log("Click JMSServer New button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter testJMSServer-1 name");
            await driver.findElement(By.xpath("//input[@id='Name|input']")).click();
            await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testJMSServer-1");
            await driver.sleep(2400);
            console.log("Click Save button");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter 'test' at Search Input Container");
            element = driver.findElement(By.xpath("//*[@id='searchInputContainer_cfe-simple-search']/div/input"));
            await element.clear();
            await element.sendKeys("test");
            await element.sendKeys(Key.ENTER);
            await driver.sleep(4800);
            console.log("Click Recent Searches Node");
            element = await driver.findElement(By.xpath("//span[contains(.,'Recent Searches')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(2400);
            console.log("Click at 'test' Searches Node");
            await driver.findElement(
                By.xpath("//span[text()='test']")).click();
            await driver.sleep(2400);
            driver.findElements(By.xpath("//td[text()='testJMSServer-1']")).then((elements) => {
                if (elements.length > 0) {
                    console.log("Element testJMSServer-1 exit");
                    console.log("Test PASS");
                } else {
                    console.log("Element testJMSServer-1 doesn't exit");
                    console.log("Test FAIL");
                }
            });
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
