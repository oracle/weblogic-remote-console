// Description:
// Test suite for Unsaved Changed Detected Dialog with AdminServer Provider
// Test cases is written based on use cases from wiki page below
//     https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
// Test scenario will be named as UC-001A, UC-002A, ....
// Example: for wait(until) syntax at test case #6
//
'use strict'

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Domain functions
const Domain = require('../lib/domainProperty');

//Unsaved Changes Detected Dialog for AdminServer Provider
describe.only('Test Suite: ucdAsProvider_test: (Unsaved Changes Detected Dialog) for AdminServer Provider', function () {
    let driver;
    let file = "ucdDialogAsProvider.png";
    let element;
    let domain;
    let admin;
    var sec = 1000;
    this.timeout(600*sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        domain = new Domain(driver, file);
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test case UC-001A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: UC-001A: ' +
        'User clicks a different tab/slice than the current one that has changed field values, ' +
        'while doing an edit inside an AS provider type', async function () {
        file = "UC-001A.png";
        try {
            //Go to Domain General Tab
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Domain");
            await driver.sleep(3600);
            console.log("Click at Domain Web Application tab");
            element = driver.findElement(
                By.xpath("//span[text()='Web Application' and @class='oj-tabbar-item-label']"));
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Click at WebAppContainer_AllowAllRoles");
            element = driver.findElement(
                By.xpath(" //oj-switch[@id='WebAppContainer_AllowAllRoles']/div[1]/div/div"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.wait(until.elementIsVisible(element),800);
            await element.click();
            await driver.sleep(1200);
            console.log("Click at Domain General tab");
            element = driver.findElement(
                By.xpath("//span[text()='General' and @class='oj-tabbar-item-label']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Web Application tab");
            element = driver.findElement(
                By.xpath("//span[text()='Web Application' and @class='oj-tabbar-item-label']"));
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            //Verify if WebAppContainer_AllowAllRoles enable at Domain WebContainer tab
            console.log("Verify if WebAppContainer_AllowAllRoles enable at Domain WebContainer tab tab")
            element = driver.findElement(
                By.xpath(" //oj-switch[@id='WebAppContainer_AllowAllRoles']/div[1]/div/div"));
            await driver.wait(until.elementIsVisible(element),8880);
            if (element.isEnabled()) {
                console.log("WebAppContainer_AllowAllRoles is enable");
                console.log("TEST PASS ");
                await driver.sleep(600);
            }
            else {
                console.log("WebAppContainer_AllowAllRolesis disable");
                console.log("TEST FAIL ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-004A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: UC-004A', async function () {
        file = "UC-004A.png";
        try {
            //Go to AdminServer
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            console.log("Change Listen Address to localhost");
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.sendKeys("localhost");
            await driver.sleep(600);
            console.log("Click at AdminServer Logging tab");
            element = await driver.findElement(By.xpath("//span[contains(.,'Logging')]")).click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("Click at Server breadcrumbs-container");
            element = driver.findElement(By.xpath("//div[@id='breadcrumbs-container']/ul/li/a"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
            await driver.sleep(600);
            //Verify if ListenAddress != localhost
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            console.log("Verify if ListenAddress != localhost")
            if (element.toString() == 'localhost') {
                console.log("ListenAddress = localhost");
                console.log("TEST FAIL ");
            }
            else {
                console.log("ListenAddress not equal to localhost");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-006A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: UC-006A', async function () {
        file = "UC-006A.png";
        try {
            //Go to AdminServer
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            console.log("Change Listen Address to localhost");
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.sendKeys("localhost");
            await driver.sleep(600);
            console.log("Click at Server breadcrumbs-container");
            element = driver.findElement(
                By.xpath("//div[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Select Runtime Data - Monitoring Tree menu");
            element = driver.findElement(By.xpath("//span[contains(.,'Runtime Data - Monitoring Tree')]"));
            await element.click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(600);
            //Verify if ListenAddress != localhost
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            console.log("Verify if ListenAddress != localhost")
            if (element.toString() == 'localhost') {
                console.log("ListenAddress = localhost");
                console.log("TEST FAIL ");
            }
            else {
                console.log("ListenAddress not equal to localhost");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-007A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: UC-007A', async function () {
        file = "UC-007A.png";
        try {
            //Go to AdminServer
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            await driver.sleep(7200);
            console.log("Click to enable AdminServer Client Cert Proxy option");
            element = driver.findElement(By.xpath("//*[@id='ClientCertProxyEnabled']/div/div"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click at Clusters kebab more menu");
            element = driver.findElement(
                By.xpath("//a[@id='moreIcon_Cluster']/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click at View Clusters... menu");
            element = driver.findElement(By.xpath("//span[contains(.,'View Clusters...')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(1200);
            console.log("Click at AdminServer");
            element = driver.findElement(By.xpath("//span[contains(.,'AdminServer')]"));
            await element.click();
            await driver.sleep(1200);
            //Verify if ListenAddress != localhost
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            console.log("Verify if ListenAddress != localhost")
            if (element.toString() == 'localhost') {
                console.log("ListenAddress = localhost");
                console.log("TEST FAIL ");
            }
            else {
                console.log("ListenAddress not equal to localhost");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-008A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: UC-008A: ', async function () {
        file = "UC-008A.png";
        try {
            //Go to AdminServer
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            console.log("Change Listen Address to localhost");
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.sendKeys("localhost");
            await driver.sleep(1200);
            console.log("Click at Landing Page Icon");
            element = driver.findElement(
                By.xpath("//div[@id='landing-page-toolbar-icon']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(1200);
            console.log("Click at Environment link");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(600);
            console.log("Click at Servers link");
            await driver.findElement(By.xpath("//span[contains(.,'Servers')]")).click();
            await driver.sleep(600);
            console.log("Click at AdminServer");
            element = driver.findElement(By.xpath("//span[contains(.,'AdminServer')]"));
            await element.click();
            await driver.sleep(1200);
            //Verify if ListenAddress != localhost
            console.log("Verify if ListenAddress != localhost")
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            if (element.toString() == 'localhost') {
                console.log("ListenAddress = localhost");
                console.log("TEST FAIL ");
            }
            else {
                console.log("ListenAddress not equal to localhost");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-009A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: UC-009A: ', async function () {
        file = "UC-009A.png";
        try {
            //Go to AdminServer
            //Example: for wait(until
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            await driver.sleep(3600);
            console.log("Change Listen Address to localhost");
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.wait(until.elementIsVisible(element),500);
            await element.click();
            await element.sendKeys("localhost");
            await driver.sleep(3600);
            console.log("Click Visibility toggle-history-toolbar-icon");
            element = await driver.findElement(By.xpath("//img[@title='Toggle visibility of history']"));
            await driver.wait(until.elementIsVisible(element),500);
            await element.click();
            await driver.sleep(7200);
            console.log("Click to expand choices in History Tool");
            element = await driver.findElement(
                By.xpath("//*[@id='oj-combobox-choice-beanpath-history-entries']/span[2]"));
            await driver.wait(until.elementIsVisible(element),500);
            await element.click();
            await driver.sleep(7200);
            console.log("Select Server in the toggle-history-toolbar list box");
            element = await driver.findElement(
                By.xpath("//div[@class='oj-listbox-result-label' and text()='Servers']"));
            await driver.wait(until.elementIsVisible(element),500);
            await element.click();
            await driver.sleep(7200);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span"));
            await driver.wait(until.elementIsVisible(element),500);
            await element.click();
            await driver.sleep(7200);
            console.log("Click at AdminServer");
            element = driver.findElement(By.xpath("//span[contains(.,'AdminServer')]"));
            await element.click();
            await driver.sleep(7200);
            //Verify if ListenAddress != localhost
            element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
            console.log("Verify if ListenAddress != localhost")
            if (await element.getAttribute("value") == 'localhost') {
                console.log("ListenAddress = localhost");
                console.log("TEST FAIL ");
            }
            else {
                console.log("ListenAddress not equal to localhost");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-011A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: UC-011A: ', async function () {
        file = "UC-011A.png";
        try {
            //Go to Domain Concurrency Tab(5)
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(1200);
            console.log("Click at Home Image Icon link");
            element = await driver.findElement(By.xpath("//*[starts-with(@id, 'home')]")).click();
            await driver.sleep(1200);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(2400);
            console.log("Click at Edit Tree Image");
            element = await driver.findElement(By.xpath("//*[@id='gallery-container']/div/div[1]/a/span")).click();
            await driver.sleep(6400);
            console.log("Click at Domain Link");
            element = await driver.findElement(By.xpath("//span[text()='Domain']")).click();
            await driver.sleep(4800);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads is still 50")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST FAIL ");
            }
            else {
                console.log("Max Concurrency New Threads = 50");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-012A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: UC-012A: ', async function () {
        file = "UC-012A.png";
        try {
            //Go to Domain Concurrency Tab(5)
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(600);
            console.log("Click on Configuration View NavStrip Image ");
            element = await driver.findElement(By.xpath("//*[@id='view']/img")).click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("Click at Environment link");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Link");
            element = await driver.findElement(By.xpath("//a[contains(.,'Domain')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 100")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST FAIL ");
            }
            else {
                console.log("Max Concurrency New Threads != 100");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-013A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: UC-013A: ', async function () {
        file = "UC-013A.png";
        try {
            //Go to Domain Concurrency Tab(5)
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(600);
            console.log("Click on Environment Clusters Navigation Node");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Clusters']")).click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("Click at Environment Domain Navigation Node");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Domain']")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 100")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST FAIL ");
            }
            else {
                console.log("Max Concurrency New Threads != 100");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-014A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: UC-014A: ', async function () {
        file = "UC-014A.png";
        try {
            //Go to Domain Concurrency Tab(5)
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(600);
            console.log("Click at Recent Searches Navtree Node");
            element = driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Recent Searches']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(4800);
            console.log("Click at Environment Domain Navigation Node");
            element = driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Domain']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 100")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST FAIL ");
            }
            else {
                console.log("Max Concurrency New Threads != 100");
                console.log("TEST PASS ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-016A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('11. Test Category: GAT/Risk1\n \t Test Scenario: UC-016A: ', async function () {
        file = "UC-016A.png";
        try {
            //Go to Domain Concurrency Tab(5)
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(600);

            console.log("Click Provider Management Image link");
            await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
            await driver.sleep(4800);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("Click Close Management Providers menu (x)");
            element = await driver.findElement(
                By.xpath("//*[@id='provider-management-dialog']/div[1]/div/div/div/div[1]/div[2]/a")).click();
            await driver.sleep(2400);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 100")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST PASS ");
            }
            else {
                console.log("Max Concurrency New Threads 50");
                console.log("TEST FAIL ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //   FIXME Issue: WC-1391
    //
    it.skip('12. Test Category: GAT/Risk1\n \t Test Scenario: UC-017A: ', async function () {
        file = "UC-017A.png";
        try {
            const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;
            await admin.importProject(driver,prjFile);
            await driver.sleep(4800);
            await admin.selectDomainConnection(driver,"14120LocalDomain");
            await driver.sleep(600);
            await driver.findElement(By.id("password-field|input")).click();
            await driver.findElement(By.id("password-field|input")).sendKeys("welcome1");
            await driver.sleep(600);
            console.log("Click Ok button");
            await driver.findElement(By.xpath("//oj-button[starts-with(@id,'dlgOkBtn11')]")).click();
            await driver.sleep(600);
            console.log("Click at Edit Tree Image");
            element = await driver.findElement(By.xpath("//span[contains(.,'Edit Tree')]")).click();
            await driver.sleep(600);
            console.log("Click at Environment link");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Link");
            element = await driver.findElement(By.xpath("//a[contains(.,'Domain')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(1200);
            console.log("Click at 1412LocalDomain Provider Image");
            element = driver.findElement(By.xpath("//a[@id='data-provider-get-info']/i")).click();
            await driver.sleep(9600);
            console.log("Click to deactivate 1412LocalDomain Provider ");
            element = driver.findElement(By.xpath("//a[@data-item-action='deactivate']")).click();
            await driver.sleep(1200);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(1200);
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron",
                "Domain", 1, 5);
            //Verify if Max Concurrency New Threads == 100
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 50")
            if (await element.getAttribute("value") == '50') {
                console.log("Max Concurrency New Threads == 50")
                console.log("TEST PASS ");
            }
            else {
                console.log("Max Concurrency New Threads 100");
                console.log("TEST FAIL ");
            }
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //BUG: FIXME: Test case UC-018A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it.skip('13. Test Category: GAT/Risk1\n \t Test Scenario: UC-018A: ', async function () {
        file = "UC-018A.png";
        try {
            const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;
            await admin.importProject(driver,prjFile);
            await driver.sleep(4800);
            await admin.selectDomainConnection(driver,"1411LocalDomain");
            await driver.sleep(600);
            await driver.findElement(By.id("password-field|input")).click();
            await driver.findElement(By.id("password-field|input")).sendKeys("welcome1");
            await driver.sleep(600);
            await driver.findElement(By.xpath("//span[@class='button-label' and text()='OK']")).click();

            //Go to Domain Concurrency Tab(5)
            await driver.sleep(600);
            console.log("Click at Edit Tree Image");
            element = await driver.findElement(By.xpath("//span[contains(.,'Edit Tree')]")).click();
            await driver.sleep(600);
            console.log("Click at Environment link");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Link");
            element = await driver.findElement(By.xpath("//a[contains(.,'Domain')]")).click();
            await driver.sleep(1200);
            console.log("Click at Domain Concurrency tab");
            element = await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Concurrency']")).click();
            await driver.sleep(600);
            console.log("Enter Max Concurrency New Threads = 100");
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            await element.clear();
            await element.sendKeys("100");
            await driver.sleep(600);
            console.log("Click slideup-toggle expand Kiosk menu...");
            await driver.findElement(By.xpath("//*[@id='slideup-toggle']/img")).click();
            await driver.sleep(7200);
            console.log("Click Deactivate 1411LocalDomain Provider");
            element = driver.findElement(
                By.xpath("//img[@class='cfe-project-provider-iconbar-icon' and @title='Deactivate']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(4800);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            /* Click No button cause BUG
            console.log("Click Cancel button at Edit WDT Model File Provider Dialog.");
            element = await driver.findElement(
                By.xpath("//*[@id='dlgCancelBtn12']/button/div")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 50
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 50")
            if (await element.getAttribute("value") == '50') {
                console.log("Max Concurrency New Threads == 50")
                console.log("TEST FAIL ");
            }
            else {
                console.log("Max Concurrency New Threads != 50");
                console.log("TEST PASS ");
            }
             */
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test case UC-022A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    // Action Not Allow dialog comes up
    //
    it('14. Test Category: GAT/Risk1\n \t Test Scenario: UC-022A: ', async function () {
        file = "UC-022A.png";
        try {
            await admin.createMBeanObjectFromLandingPage(driver,"TestMachine-UC022A","Edit Tree","EnvironmentChevron",
                "Machines",1);
            console.log("Click Provider Management Image link");
            await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
            await driver.sleep(9600);
            console.log("Click Cancel button since ActionNotAllowed dialog appears");
            await driver.findElement(By.xpath("//span[@class='button-label' and text()='Cancel']")).click();
            await driver.sleep(600);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
