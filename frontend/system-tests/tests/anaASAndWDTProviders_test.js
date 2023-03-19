// Description:
// Test suite for Action Not Allowed and Unsaved Changed Detected Dialogs with WDT Model File Provider
// Test cases is written based on use cases from wiki page below
//     https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
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
describe.only('Test Suite: anaASAndWDTProviders_test: (Action Not Allowed Dialog) ' +
    'for AdminServer and WDT Model File Provider', function () {
    let driver;
    let file = "anaAsAndWDTProviders.png";
    let element;
    let domain;
    let admin;
    var sec = 1000;
    this.timeout(600 * sec);

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

    //Test case UC-004A on the wiki page below:
    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: UC-005A', async function () {
        file = "UC-0045.png";
        try {
            //Go to App Deployments navTree node
            await admin.goToNavTreeLevelTwoLink(driver, "configuration",
                "Deployments", "App Deployments");
            console.log("Click New button");
            element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(600);
            console.log("Enter Deployment Application name = testApp ");
            await driver.findElement(
                By.xpath("//input[@id='Name|input']")).sendKeys("testApp");
            await driver.sleep(600);
            console.log("Click Services navTree node");
            await driver.findElement(By.xpath("//span[contains(.,'Services')]")).click();
            await driver.sleep(600);
            console.log("Click Data Sources node");
            await driver.findElement(By.xpath("//span[contains(.,'Data Sources')]")).click();
            await driver.sleep(7200);
            //Verify ANA (Action Not Allowed) dialog comes up and the current page is Deployment Application
            console.log("Verify if Application Deploy is = testApp")
            element = driver.findElement(By.xpath("//input[@id='Name|input']"));
            if (await element.getAttribute("value") == 'testApp') {
                console.log("Application Deployment = testApp ")
                console.log("TEST PASS ");
            }
            else {
                console.log("Application Deployment != testApp");
                console.log("TEST FAIL ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


    //Test UC-008B
    it('2. UC-008B Test Category: GAT/Risk1\n \t Test Scenario: Modify WDT Mail Session Property tab' +
        'then click Property baseDomainPropertyList provider - ANA (Action Not Allowed) dialog appears',
        async function () {
            file = "UC-008B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const propertyFile = "frontend/system-tests/lib/baseDomainPropList.prop";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const propFile = process.env.OLDPWD + path.sep + propertyFile;
                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await admin.createNewWDTModelFile(driver,"testWDTProviderName","testWDTFile");
                await driver.sleep(2400);
                await admin.selectTree(driver,"testWDTProviderName");
                await driver.sleep(2400);
                console.log("Click WDT Model Tree");
                await driver.findElement(By.xpath("//*[@id='modeling']/img")).click();
                await driver.sleep(2400);
                console.log("Click Navtree Services");
                await driver.findElement(By.xpath("//span[contains(.,'Services')]")).click();
                await driver.sleep(2400);
                console.log("Click Navtree Mail Sessions");
                element = driver.findElement(By.xpath("//span[contains(.,'Mail Sessions')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(4800)
                console.log("Click Mail Session New button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter testMailSession-123 name");
                await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testMailSession-123");
                await driver.sleep(1200);
                console.log("Enter JNDI name");
                await driver.findElement(By.xpath("//input[@id='JNDIName|input']")).sendKeys("testJNDIName-123");
                await driver.sleep(1200);
                element = driver.findElement(By.xpath("//div[@id='slideup-toggle']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                await admin.selectDomainConnection(driver,"1411LocalDomain");
                await driver.sleep(7400);
                console.log("TEST PASS ");
                //Verify ANA (Action Not Allowed) dialog comes up and the current page is Mail Session
                console.log("Verify if Mail Session is = testMailSession-123")
                element = driver.findElement(By.xpath("//input[@id='Name|input']"));
                if (await element.getAttribute("value") == 'testMailSession-123') {
                    console.log("Mail Session  = testMailSession-123 ")
                    console.log("TEST PASS ");
                }
                else {
                    console.log("Mail Session  != testMailSession-123");
                    console.log("TEST FAIL ");
                }

            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
    })

    //   https://confluence.oraclecorp.com/confluence/pages/viewpage.action?pageId=4763969598
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: UC-017B: ', async function () {
        file = "UC-017B.png";
        try {
            const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
            const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;
            const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
            await admin.importProject(driver,prjFile);
            await driver.sleep(4800);
            await admin.selectTree(driver,"baseDomainModel");
            await driver.sleep(680);
            console.log("Click to choose a file");
            await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
            await driver.sleep(680);
            console.log("Provide "+baseDomainFile+ " file name to the input class cfe-file-chooser");
            await driver.findElement(By.xpath("//input[@id='file-chooser']")).sendKeys(baseDomainFile);
            await driver.sleep(600);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//span[contains(@id,'dlgOkBtn12')]")).click();
            await driver.sleep(2400);
            console.log("Click WDT Model Tree");
            await driver.findElement(By.xpath("//*[@id='modeling']/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Environment");
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
            await driver.sleep(2400);
            console.log("Click baseDomainPropList");
            await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
            await driver.sleep(600);
            console.log("Click Yes button at Unsaved Changes Detected Dialog.");
            element = await driver.findElement(
                By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
            await driver.sleep(600);
            console.log("Click Cancel button at Edit WDT Model File Provider Dialog.");
            element = await driver.findElement(
                By.xpath("//*[@id='dlgCancelBtn12']/button/div")).click();
            await driver.sleep(600);
            //Verify if Max Concurrency New Threads == 50
            element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
            console.log("Verify if Max Concurrency New Threads == 100")
            if (await element.getAttribute("value") == '100') {
                console.log("Max Concurrency New Threads == 100")
                console.log("TEST PASS ");
            }
            else {
                console.log("Max Concurrency New Threads != 50");
                console.log("TEST FAIL ");
            }
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })
})
