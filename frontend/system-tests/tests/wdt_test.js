// Navtree, Form, Table, Create, Shopping Cart Test Suite
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

// Get Cluster and Machines functions
const Cluster = require('../lib/machineAndClusterProps');

// NavTree Form, Table, Create, Shopping Cart Test Suite
describe.only('Test Suite: wdt_test: Import base_domain Project and create provider for new WDT Model file' +
    'Create AdminServer, testCluster-1, testMachine-1 and testJMSServer-1', function () {
    let driver;
    let file = "projectWDTModel.png";
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

    //Test Import testProject
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: Import domainProject.json file from startup Dialog, ' +
        'Create provider for new WDT Model file -> from WDT Model tree, view AdminServer, create testCLuster-1, testJMSServer-1',
        async function () {
        file = "projectWDTModelWithEnvAndService.png";
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
            await driver.findElement(By.xpath("//*[@id=\"modeling\"]/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Environment");
            await driver.findElement(By.xpath("//span[contains(.,\'Environment\')]")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Server");
            await driver.findElement(By.xpath("//span[contains(.,\'Servers\')]")).click();
            await driver.sleep(4800)
            console.log("Click Navtree AdminServer");
            await driver.findElement(By.xpath("//span[contains(.,\'AdminServer\')]")).click();
            await driver.sleep(4800);

            console.log("Click Navtree Cluster");
            await driver.findElement(By.xpath("//span[contains(.,\'Clusters\')]")).click()
            await driver.sleep(2400);
            console.log("Click Cluster New button");
            await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter testCLuster-1 name");
            await driver.findElement(By.xpath("//input[@id=\'Name|input\']")).sendKeys("testCluster-1");
            await driver.sleep(4800);

            console.log("Click Navtree Machines");
            await driver.findElement(By.xpath("//span[contains(.,\'Machines\')]")).click();
            await driver.sleep(2400);
            console.log("Click Machine New button");
            element = driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            console.log("Enter testMachine-1 name");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//oj-input-text[@id=\'Name\']/div/div/input")).sendKeys("testMachine-1");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.save.id]]\']/button/div/span/img")).click();
            await driver.sleep(4800);

            console.log("Click expand Kiosk menu...");
            await driver.findElement(By.xpath("//*[@id=\'slideup-toggle\']/img")).click()
            await driver.sleep(4800);
            await driver.findElement(By.xpath("//div/ul/li[3]/a/span[2]")).click();
            await driver.sleep(4800);

            console.log("Click Landing Page Services");
            await driver.findElement(
                By.xpath("//section[@id=\'landing-page-cards\']/div/oj-conveyor-belt/div[4]/div/div[6]/a")).click();
            await driver.sleep(4800);
            console.log("Click Landing Page Services -> JMS Servers");
            await driver.findElement(By.xpath("//span[contains(.,\'JMS Servers\')]")).click();
            await driver.sleep(2400);
            console.log("Click JMSServer New button");
            await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter testJMSServer-1 name");
            await driver.findElement(By.xpath("//input[@id=\'Name|input\']")).click();
            await driver.findElement(By.xpath("//input[@id=\'Name|input\']")).sendKeys("testJMSServer-1");
            await driver.sleep(4800);

            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})
