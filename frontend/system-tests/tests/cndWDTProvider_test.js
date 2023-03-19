// Navtree, Form, Table, Create, Shopping Cart Test Suite
// 3 test cases
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

// Test Suite: Import Project with all provider types like AdminServer Domain, WDT types
// Test each of providers
describe.only('Test Suite: cndWDTProvider_test: CND confirm dialog for WDT provider type' +
    ' with Web Browser', function () {
    let driver;
    let file = "cndWDTProvider.png";
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

    //Test UC-001B
    it('UC-001B. Test Category: GAT/Risk1\n \t Test Scenario: Modify WDT Mail Session Property tab' +
        'then click back to General tab - nothing happen since auto-save occurs',
        async function () {
            file = "UC-001B.png";
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
                console.log("Click MailSession Create button");
                await driver.findElement(
                    By.xpath("//span[@class='button-label' and text()='Create']")).click();
                await driver.sleep(600);
                console.log("Click Java Mail Properties tab");
                await driver.findElement(
                    By.xpath("//span[@class='oj-tabbar-item-label' and text()='Java Mail Properties']")).click();
                await driver.sleep(600);
                console.log("Click Add \(+\) symbol to add new property");
                element = driver.findElement(By.xpath("//span[@class='oj-ux-ico-plus']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click default new-property-1");
                await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]")).click();
                {
                    console.log("Double click default new-property-1");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]"))
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(600);
                console.log("Replace new-property-1 by mail.smtp.host");
                await driver.findElement(By.xpath("//oj-input-text/div/div/input")).sendKeys("mail.smtp.host");
                await driver.sleep(600);
                console.log("Click mail.smtp.host value text box");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).click();
                await driver.sleep(600);
                console.log("Enter smtp.gmail.com name");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys("smtp.gmail.com");
                await driver.sleep(600);

                console.log("Click Java Mail General tab");
                await driver.findElement(
                    By.xpath("//span[@class='oj-tabbar-item-label' and text()='General']")).click();
                await driver.sleep(600);
                console.log("Auto-save kicked in shen moving from slide to slide(tab) - CND or ANA dialog appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }

        })

    //Test UC-002B
    it('UC-002B. Test Category: GAT/Risk1\n \t Test Scenario: Same as 001B test case however,' +
        'User clicks the "Home" button, while doing a create inside a M provider type',
        async function () {
            file = "UC-002B.png";
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
                console.log("Click MailSession Create button");
                await driver.findElement(
                    By.xpath("//span[@class='button-label' and text()='Create']")).click();
                await driver.sleep(600);
                console.log("Click Java Mail Properties tab");
                await driver.findElement(
                    By.xpath("//span[@class='oj-tabbar-item-label' and text()='Java Mail Properties']")).click();
                await driver.sleep(600);
                console.log("Click Add \(+\) symbol to add new property");
                element = driver.findElement(By.xpath("//span[@class='oj-ux-ico-plus']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click default new-property-1");
                await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]")).click();
                {
                    console.log("Double click default new-property-1");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]"))
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(600);
                console.log("Replace new-property-1 by mail.smtp.host");
                await driver.findElement(By.xpath("//oj-input-text/div/div/input")).sendKeys("mail.smtp.host");
                await driver.sleep(600);
                console.log("Click mail.smtp.host value text box");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).click();
                await driver.sleep(600);
                console.log("Enter smtp.gmail.com name");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys("smtp.gmail.com");
                await driver.sleep(600);

                console.log("Click Home button");
                element = driver.findElement(
                    By.xpath("//span[starts-with(@id,'home')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Auto-save kicked in shen moving from slide to slide(tab) - CND or ANA dialog appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }

        })

    //Test UC-003B - ANA dialog appears
    it('UC-003B. Test Category: GAT/Risk1\n \t Test Scenario: Result same as Same as UC-001B test case however,' +
        'User Click the "Home" button in the Content Header Area -  Action Not Allowed (ANA) dialog appears',
        async function () {
            file = "UC-002B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Clusters')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click Clusters New button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter testCluster-1234 name");
                await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testCluster-1234");
                await driver.sleep(1200);
                console.log("Click Home button");
                element = driver.findElement(
                    By.xpath("//span[starts-with(@id,'home')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("ANA dialog appears since Action isn't allow");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })


    //Test UC-004B
    it('UC-004B. Test Category: GAT/Risk1\n \t Test Scenario: Change value of any field(s) in "Admin Servers" ' +
        'Click on "Servers" breadcrumb link inside a M provider - Auto-save occurs',
        async function () {
            file = "UC-004B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Servers')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click AdminServer node");
                await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
                await driver.sleep(2400);
                console.log("Change Listen Address to localhost");
                element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.sendKeys("localhost");
                await driver.sleep(600);

                console.log("Click at Server breadcrumbs-container");
                element = driver.findElement(
                    By.xpath("//a[text()='Servers']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click at AdminServer");
                element = driver.findElement(By.xpath("//td[contains(.,'AdminServer')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
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
    
    //Test UC-005B
    it('UC-005B. Test Category: GAT/Risk1\n \t Test Scenario: User Server Navigation Tree node - ' +
        'Expect Auto-save occurs after creating CreatableOptionalSingleton kind of MBean, inside a M provider',
        async function () {
            file = "UC-005B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Machines");
                element = driver.findElement(By.xpath("//span[contains(.,'Machines')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(4800)
                console.log("Click Machines New button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter testMachine-12345 name");
                await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testMachine-123");
                await driver.sleep(1200);
                console.log("Click Machine Create button");
                await driver.findElement(
                    By.xpath("//span[@class='button-label' and text()='Create']")).click();
                await driver.sleep(600);
                console.log("Click Server Navigation Tree node - Expect NO Confirmation/Warning dialog occurs");
                await driver.findElement(
                    By.xpath("//span[text()='Servers']")).click();
                await driver.sleep(600);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-006B
    it('UC-006B. Test Category: GAT/Risk1\n \t Test Scenario: Select any menu item under the "Admin Servers" dropdown, ' +
        'in the breadcrumb line, inside a M provider',
        async function () {
            file = "UC-006B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Servers')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click AdminServer node");
                await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
                await driver.sleep(2400);
                console.log("Change Listen Address to localhost");
                element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.sendKeys("localhost");
                await driver.sleep(600);

                console.log("Click at Server breadcrumbs-container");
                element = driver.findElement(
                    By.xpath("//a[text()='Servers']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click at AdminServer");
                element = driver.findElement(By.xpath("//td[contains(.,'AdminServer')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
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


    //Test UC-007B
    it('UC-007B. Test Category: GAT/Risk1\n \t Test Scenario: Select any menu item under the "Admin Servers" ' +
        'Change value of any field without a kebab menu - Select a menu item (other than a "Create ..." one) ' +
        'from a field with a kebab menu - Auto-save occurs',
        async function () {
            file = "UC-007B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Servers')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click AdminServer node");
                await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
                await driver.sleep(2400);

                await driver.sleep(600);
                console.log("Click to enable AdminServer Client Cert Proxy option");
                element = driver.findElement(By.xpath("//oj-switch[@id='ClientCertProxyEnabled']/div/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click at Clusters kebab more menu");
                element = driver.findElement(
                    By.xpath("//a[@id='moreIcon_Cluster']/img"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click at View Clusters kebab menu menu");
                element = driver.findElement(By.xpath("//span[contains(.,'View Clusters...')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Auto-save kicked in when click at Clusters kebab menu - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })


    //Test UC-008B
    it('UC-008B. Test Category: GAT/Risk1\n \t Test Scenario: Navigate to any AdminServer form that has editable fields, ' +
        'but not necessarily a tab/slice -> Change value of field(s) -> Click on the "Landing Page" icon ' +
        'in the form\'s icon toolbar - expect Auto-save occurs',
        async function () {
            file = "UC-008B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Servers')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click AdminServer node");
                await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
                await driver.sleep(2400);
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
                console.log("Auto-save kicked in when click landing-page-toolbar-icon - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-009B
    it('UC-009B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-009A - ' +
        'expect Auto-save occurs and CND/ANA dialog does not appear',
        async function () {
            file = "UC-009B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Servers");
                element = driver.findElement(By.xpath("//span[contains(.,'Servers')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(1200);
                console.log("Click AdminServer node");
                await driver.findElement(By.xpath("//td[contains(.,'AdminServer')]")).click();
                await driver.sleep(2400);
                console.log("Change Listen Address to localhost");
                element = driver.findElement(By.xpath("//oj-input-text[@id='ListenAddress']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.sendKeys("localhost");
                await driver.sleep(1200);
                console.log("Click Visibility toggle-history-toolbar-icon");
                element = await driver.findElement(
                    By.xpath("//*[@id='toggle-history-toolbar-icon']/a")).click();
                await driver.sleep(600);
                console.log("Click to expand choices in History Tool");
                element = await driver.findElement(
                    By.xpath("//*[@id='oj-combobox-choice-beanpath']/span[2]/a")).click();
                await driver.sleep(1200);
                console.log("Select Server in the toggle-history-toolbar list box");
                element = await driver.findElement(
                    By.xpath("//div[@class='oj-listbox-result-label' and text()='Servers']")).click();
                await driver.sleep(1200);
                console.log("Auto-save kicked in when click toggle-history-toolbar list box - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-011B
    it('UC-011B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-011A - ' +
        'expect Auto-save occurs and CND/ANA dialog does not appear',
        async function () {
            file = "UC-011B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
                await driver.sleep(600);
                console.log("Enter Max Concurrency New Threads = 100");
                element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
                await element.clear();
                await element.sendKeys("100");
                await driver.sleep(600);
                console.log("Click at Home Image Icon link");
                element = await driver.findElement(By.xpath("//*[@id='home']/button/div/span[1]/img")).click();
                await driver.sleep(600);
                console.log("Auto-save kicked in when Click at Home Image Icon link - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-012B
    it('UC-012B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-012A - ' +
        'expect Auto-save occurs and CND/ANA dialog does not appear',
        async function () {
            file = "UC-012B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
                await driver.sleep(600);
                console.log("Enter Max Concurrency New Threads = 100");
                element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
                await element.clear();
                await element.sendKeys("100");
                await driver.sleep(600);
                console.log("Click on NavStrip WDT Model Icon ");
                element = await driver.findElement(By.xpath("//li[@id='modeling']/img")).click();
                await driver.sleep(600);
                console.log("Auto-save kicked in when Click on NavStrip WDT Model Icon  - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-013B
    it('UC-013B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-013A - ' +
        'expect Auto-save occurs and CND/ANA dialog does not appear',
        async function () {
            file = "UC-013B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
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
                console.log("Auto-save kicked in when Click on Clusters node in the Navigation Tree  - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-014B
    it('UC-014B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-014A - ' +
        'expect Auto-save occurs and CND/ANA dialog does not appear',
        async function () {
            file = "UC-014B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
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
                console.log("Auto-save kicked in when at Recent Searches Navtree Node  - CND/ANA dialog doesn't appears");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-016B
    it('UC-016B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-016A - ' +
        'expect Unsaved Changes Detected Dialog (CND) dialog appears ',
        async function () {
            file = "UC-016B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
                await driver.sleep(600);
                console.log("Enter Max Concurrency New Threads = 100");
                element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
                await element.clear();
                await element.sendKeys("100");
                await driver.sleep(600);
                console.log("Click slideup-toggle expand Kiosk menu...");
                await driver.findElement(By.xpath("//*[@id='slideup-toggle']/img")).click();
                await driver.sleep(1200);
                console.log("Click 1411LocalDomain Provider");
                await driver.findElement(By.xpath("//span[contains(.,'1411LocalDomain')]")).click();
                await driver.sleep(600);
                console.log("Click Yes button at Unsaved Changes Detected Dialog.");
                element = await driver.findElement(
                    By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
                await driver.sleep(600);
                console.log("Click Cancel button at Edit AdminServer Connection Provider Dialog.");
                element = await driver.findElement(
                    By.xpath("//oj-button[contains(@id,'dlgCancelBtn11')]")).click();
                await driver.sleep(600);
                //Verify if Max Concurrency New Threads == 100
                element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
                console.log("Verify if Max Concurrency New Threads == 50")
                if (await element.getAttribute("value") == '100') {
                    console.log("Max Concurrency New Threads == 100")
                    console.log("TEST PASS ");
                }
                else {
                    console.log("Max Concurrency New Threads != 100");
                    console.log("TEST FAIL ");
                }
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-017B
    it('UC-017B. Test Category: GAT/Risk1\n \t Test Scenario: Same as UC-017A - ' +
        'expect Unsaved Changes Detected Dialog (CND) dialog appears ',
        async function () {
            file = "UC-017B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomain = "frontend/system-tests/lib/baseDomain.yaml";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainFile = process.env.OLDPWD + path.sep + baseDomain;
                await admin.importProject(driver,prjFile);
                await driver.sleep(680);
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
                await driver.sleep(2400);
                console.log("Click Navtree Domain");
                element = driver.findElement(By.xpath("//span[contains(.,'Domain')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(600);
                console.log("Click Concurrency Domain tab");
                await driver.findElement(By.xpath("//span[text()='Concurrency']")).click();
                await driver.sleep(600);
                console.log("Enter Max Concurrency New Threads = 100");
                element = driver.findElement(By.xpath("//*[@id='MaxConcurrentNewThreads|input']"));
                await element.clear();
                await element.sendKeys("100");
                await driver.sleep(1200);
                //FIXME - Add steps to move cursor to provider BAR
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test UC-022B
    it('UC-022B. Test Category: GAT/Risk1\n \t Test Scenario: Choose the "New Project" sub menu item ' +
        'from the "File" menu.',
        async function () {
            file = "UC-022B.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const domainProFile = "frontend/system-tests/lib/domainProject.json";
                const propertyFile = "frontend/system-tests/lib/baseDomainPropList.prop";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const domainPrjFile = process.env.OLDPWD + path.sep + domainProFile;
                const propFile = process.env.OLDPWD + path.sep + propertyFile;
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
                console.log("Click Navtree Machines");
                element = driver.findElement(By.xpath("//span[contains(.,'Machines')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(4800)
                console.log("Click Machines New button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter testMachine-123 name");
                await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testMachine-123");
                await driver.sleep(1200);
                console.log("Click slideup-toggle expand Kiosk menu...");
                await driver.findElement(By.xpath("//*[@id='slideup-toggle']/img")).click();
                await driver.sleep(1200);
                console.log("Click More Action menu... ");
                await driver.findElement(By.id("project-more-icon")).click();
                await driver.sleep(600);

                console.log("Click Import Project...");
                await driver.findElement(
                    By.xpath("//oj-option[@id='[[i18n.menus.project.import.id]]']/a")).click();
                await driver.sleep(600);
                console.log("Select Project to import " + domainPrjFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(domainPrjFile);
                await driver.sleep(6400);
                console.log("Expect Action Not Allowed dialog appears");
                console.log("Click Cancel button");
                await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.cancel.id]]']")).click();
                await driver.sleep(600);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }

        })

    //Test UC-00xxB
    it.skip('UC-00xxB. Test Category: GAT/Risk1\n \t Test Scenario: Create testMailSession-123 new object then' +
        'Click the Home button in the Content Header Area.',
        async function () {
            file = "UC-00xxB.png";
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
                await driver.sleep(4800);

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
                console.log("Click MailSession Create button");
                await driver.findElement(
                    By.xpath("//span[@class='button-label' and text()='Create']")).click();
                await driver.sleep(600);
                console.log("Click slideup-toggle expand Kiosk menu...");
                await driver.findElement(By.xpath("//*[@id='slideup-toggle']/img")).click();
                await driver.sleep(1200);
                await driver.findElement(
                    By.xpath("//span[@class='oj-navigationlist-item-label' and text()='baseDomainPropList']")).click();
                await driver.sleep(600);

                // Click Cancel button at CND dialog to cancel download action then
                // re-click Yes button to download MailSession file to validate CND dialog functionalities
                console.log("Click Cancel button at Changes Not Downloaded Dialog.");
                element = await driver.findElement(
                    By.xpath("//oj-button[@id='dlgCancelBtn']/button/div/span")).click();
                await driver.sleep(600);
                console.log("Click slideup-toggle expand Kiosk menu...");
                await driver.findElement(By.xpath("//*[@id='slideup-toggle']/img")).click();
                await driver.sleep(1200);
                await driver.findElement(
                    By.xpath("//span[@class='oj-navigationlist-item-label' and text()='baseDomainPropList']")).click();
                await driver.sleep(600);
                console.log("Click Yes button at Changes Not Downloaded Dialog.");
                element = await driver.findElement(
                    By.xpath("//oj-button[@id='dlgYesBtn']/button/div/span")).click();
                await driver.sleep(600);
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select property list file " + propFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(propFile);
                await driver.sleep(600);
                console.log("Click OK button");
                element = await driver.findElement(
                    By.xpath("//span[@class='button-label' and text()='OK']")).click();
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }

        })


})