// Online and inline Help Links Test Suite
const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get Navtree elements and Cluster table/form properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;
const user = require('../lib/admin').credential.userName;
const password = require('../lib/admin').credential.password;

// Online and inline Help Links Test Suite
describe.only('Test Suite: helpLink_test: From Server ' +
    'and Services JDBC System Resource Pages', function () {
    let driver;
    let file = "helpLinkTest.png";
    let element;
    var sec = 1000;
    this.timeout(600 * sec);

    before(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    after(async function () {
        await driver.quit();
    })

    //Test Help links from Admin Server Page
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Help Links from Edit Tree Server, ' +
        ' Click to validate  ', async function () {
        file = "serverPageHelpLinkTest.png";
        try {
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Environment","Servers");
            await driver.sleep(4800);
            console.log("Click Help Page Link Icon");
            element = driver.findElement(By.xpath("//div[@id=\'page-help-toolbar-icon\']/a/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(4800);
            console.log("Click ServerMBean.Name link");
            await driver.findElement(By.linkText("ServerMBean.Name")).click();
            await driver.sleep(4800);

            console.log("Get All Window Tab Names");
            return await driver.getAllWindowHandles().then(async function (handles) {
                console.log("Check if there are "+handles.length+" window tabs on the browser");
                var isHandleCount2 = (handles.length == 2);
                let expectedTitle = "ServerMBean";
                console.log("Switch to window 2")
                driver.switchTo().window(handles[handles.length - 1]);
                var title = await driver.getTitle();
                console.log("Verify if this window title is "+title);
                assert.equal(title,expectedTitle);
                console.log("TEST PASS ");
            });
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Help links from JDBC System Resource Page
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Help Links from JDBC System Resource page, ' +
        ' Click to validate  ', async function () {
        file = "JDBCSysResPageHelpLinkTest.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree", "ServicesChevron", "Data Sources");
            await driver.sleep(4800);
            console.log("Click Help Page Link Icon");
            element = driver.findElement(By.xpath("//div[@id=\'page-help-toolbar-icon\']/a/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(4800);
            console.log("Click JDBC Datasource Help Link");
            await driver.findElement(By.linkText("Configuring JDBC Data Sources")).click();
            await driver.sleep(4800);
            console.log("Get All Window Tab Names");
            return await driver.getAllWindowHandles().then(async function (handles) {
                console.log("Check if there is 3 window tabs on the browser");
                var isHandleCount2 = (handles.length == 3);
                let expectedTitle = "Configure Database Connectivity";
                console.log("Switch to window 2")
                driver.switchTo().window(handles[handles.length - 1]);
                var title = await driver.getTitle();
                console.log("Verify if this window title is "+title);
                assert.equal(title,expectedTitle);
                expectedTitle = "WebLogic Remote Console - JDBCSystemResources";
                console.log("Switch to window 3")
                driver.switchTo().window(handles[handles.length - 2]);
                var title = await driver.getTitle();
                console.log("Verify if this window title is "+title);
                assert.equal(title,expectedTitle);
                console.log("TEST PASS ");
            });
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
