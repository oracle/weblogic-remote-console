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
describe.only('Test Suite: wdt_test: Import base_domain Project and create provider for new WDT Model, ' +
    'new Property List, new AdminServer Connection and exiting Providers in the project', function () {
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
            await driver.findElement(By.xpath("//*[@id='modeling']/img")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Environment");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(2400);
            console.log("Click Navtree Server");
            await driver.findElement(By.xpath("//span[contains(.,'Servers')]")).click();
            await driver.sleep(4800)
            console.log("Click Navtree AdminServer");
            await driver.findElement(By.xpath("//span[contains(.,'AdminServer')]")).click();
            await driver.sleep(4800);

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
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span/img")).click();
            await driver.sleep(4800);

            console.log("Click Home Image");
            await driver.findElement(By.xpath("//*[starts-with(@id, 'home')]")).click();
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
            await driver.sleep(4800);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test WDT Composite Model File
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: Import domainProject.json file from startup Dialog, ' +
        'Update baseDomainModel and wdtTemplateModel for its ModelFile Path -> select WDT Composite Model Tree -> ' +
        'select Environment -> Servers -> testServer-2 to validate composite element successful merged.',
        async function () {
            file = "wdtCompositeModelWithBaseDomainAndWDTTemplateModle.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const wdtTemplateModelFile = "frontend/system-tests/lib/wdtTemplateModelFile.yml";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const wdtTempModelFile = process.env.OLDPWD + path.sep + wdtTemplateModelFile;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await admin.selectTree(driver,"baseDomainModel", baseDomModelFile);
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();

                await driver.sleep(4800);
                await admin.selectTree(driver,"wdtTemplateModel", wdtTempModelFile);
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
                await driver.sleep(4800);
                console.log("Select wdtCompositeModelOfBaseAndTemplateModels");
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'wdtCompositeModelOfBaseAndTemplateModels')]")).click();
                console.log("Click WDT Composite Model Tree");
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//img[@alt='WDT Composite Model']")).click();

                console.log("Click Landing Page");
                await driver.findElement(By.xpath("//*[@id='landing-page-cards']/div/oj-conveyor-belt/div[4]/div/div[3]/a")).click();
                console.log("Click Navtree Environment");
                await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
                await driver.sleep(2400);
                console.log("Click Navtree Server");
                await driver.findElement(By.xpath("//span[contains(.,'Servers')]")).click();
                await driver.sleep(4800);
                console.log("Click testServer-2");
                await driver.findElement(By.xpath("//td[contains(.,'testServer-2')]")).click();
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test Export Project Model after sorted by the provider type
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: export the current wdtDomainProject.json file from Kiosk menu'
        + 'after sorting out by the provider type',
        async function () {
            file = "exportProjectMode.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const expProjName = "myExportProjectName";
                const expProjFileNamePath = process.env.OLDPWD + path.sep + "frontend/system-tests/lib/"
                    + expProjName +".json";
                await admin.importProject(driver,prjFile);
                await driver.sleep(800);
                console.log("Click More Action...");
                await driver.findElement(By.xpath("//img[@id='project-more-icon']")).click();
                await driver.sleep(800);
                console.log("Click Sort by Provider Type");
                await driver.findElement(By.xpath("//span[contains(.,'Sort by Provider Type')]")).click();
                await driver.sleep(800);
                await admin.exportProviderAsProject(driver, expProjName,expProjFileNamePath);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test create Provider for New Property List
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: create Provider for New Property List',
        async function () {
            file = "newPropertyList.png";
            try {
                console.log("Launch remote console page. ");
                await driver.get(adminUrl);
                await driver.sleep(4800);
                await admin.startupDialogTask(driver,6,"Choose");
                await driver.sleep(1200);
                await admin.createNewPropertyList(driver,"testPropertyListProvider",
                    "testPropertyListProviderFile");
                await driver.sleep(600);
                await admin.selectTree(driver,"testPropertyListProvider");
                await driver.sleep(600);
                console.log("Click Property List Editor Image");
                await driver.findElement(By.xpath("//img[@alt='Property List Editor']")).click();
                await driver.sleep(600);
                console.log("Click Property Image");
                await driver.findElement(By.xpath("//div[@id='Properties']")).click();
                await driver.sleep(600);
                console.log("Click Add \(+\) symbol to add new property");
                await driver.findElement(
                    By.xpath("//*[starts-with(@id,'properties-table')]/oj-button/button/div/span[2]/span")).click();
                await driver.sleep(600);
                try {
                    element = driver.findElement(By.xpath("//oj-button[@id='dlgNoBtn']"));
                    await driver.sleep(600);
                    if (element.isDisplayed() && element.isEnabled()) {
                        console.log("Click No button");
                        await element.click();
                        await driver.sleep(600);
                    }
                }
                catch (e) {
                    console.log("Changed Not Download dialog doesn't come up");
                }
                console.log("Click default new-property-1");
                await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]")).click();
                {
                    console.log("Double click default new-property-1");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]"))
                    //oj-table[@id='properties-table']/div/table/tbody/tr/td
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(880);
                console.log("Replace new-property-1 (1st row, 1st column) by AdminUserName");
                await driver.findElement(
                    By.xpath("//oj-input-text[starts-with(@id,'ui-id-')]/div/div/input")).sendKeys("AdminUserName");
                await driver.sleep(800);
                console.log("Click AdminUserName value text box");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).click();
                await driver.sleep(600);
                console.log("Enter "+user+" name");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys(user);
                await driver.sleep(600);
                console.log("Click Add \(+\) symbol to add new property");
                await driver.findElement(
                    By.xpath("//*[starts-with(@id,'properties-table')]/oj-button/button/div/span[2]/span")).click();
                await driver.sleep(600);
                try {
                    element = driver.findElement(By.xpath("//oj-button[@id='dlgNoBtn']"));
                    await driver.sleep(600);
                    if (element.isDisplayed() && element.isEnabled()) {
                        console.log("Click No button");
                        await element.click();
                        await driver.sleep(600);
                    }
                }
                catch (e) {
                    console.log("Changed Not Download dialog doesn't come up");
                }
                console.log("Click default new-property-1");
                await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]")).click();
                {
                    console.log("Double click default new-property-1");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]"))
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(600);
                console.log("Replace new-property-1 by AdminPassword");
                await driver.findElement(
                    By.xpath("//oj-input-text[starts-with(@id,'ui-id-')]/div/div/input")).sendKeys("AdminPassword");
                await driver.sleep(600);
                console.log("Click AdminPassword value text box");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).click();
                await driver.sleep(600);
                console.log("Enter "+password+" password");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys(password);
                await driver.sleep(600);
                console.log("Click Add \(+\) symbol to add new property");
                await driver.findElement(
                    By.xpath("//*[starts-with(@id,'properties-table')]/oj-button/button/div/span[2]/span")).click();
                await driver.sleep(600);
                try {
                    element = driver.findElement(By.xpath("//oj-button[@id='dlgNoBtn']"));
                    await driver.sleep(600);
                    if (element.isDisplayed() && element.isEnabled()) {
                        console.log("Click No button");
                        await element.click();
                        await driver.sleep(600);
                    }
                }
                catch (e) {
                    console.log("Changed Not Download dialog doesn't come up");
                }
                console.log("Click default new-property-1");
                await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]")).click();
                {
                    console.log("Double click default new-property-1");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'new-property-1')]"))
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(600);
                console.log("Replace new-property-1 by NodeManagerPasswordEncrypted");
                await driver.findElement(
                    By.xpath("//oj-input-text[starts-with(@id,'ui-id-')]/div/div/input")).sendKeys("NodeManagerPasswordEncrypted");
                await driver.sleep(600);
                console.log("Click NodeManagerPasswordEncrypted value text box");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).click();
                await driver.sleep(600);
                console.log("Enter "+password+" for NodeManagerPasswordEncrypted password");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys(password);
                await driver.sleep(1200);
                console.log("Click Save Now \(Electron\), or Download File \(Web page\) button");
                await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.write.id]]']/button/div/span[1]/img")).click();
                await driver.sleep(600);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test Add Property List Provider
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: Import baseDomainProject then Add Property List Provider',
        async function () {
            file = "propertyListProvider.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(2400);
                await admin.selectTree(driver,"baseDomainPropList", baseDomainPropertyFile);
                await driver.sleep(600);

                console.log("Click Property List Editor Image");
                await driver.findElement(By.xpath("//img[@alt='Property List Editor']")).click();
                await driver.sleep(600);
                console.log("Click Property Image");
                await driver.findElement(By.xpath("//div[@id='Properties']")).click();
                await driver.sleep(600);
                console.log("Click AdminPassword property text box");
                await driver.findElement(By.xpath("//td[contains(.,'AdminPassword')]")).click();
                {
                    console.log("Double click AdminPassword property field");
                    const element = await driver.findElement(By.xpath("//td[contains(.,'AdminPassword')]"))
                    await driver.actions({ bridge: true}).doubleClick(element).perform()
                }
                await driver.sleep(600);
                console.log("Enter "+password+" for AdminServer password");
                await driver.findElement(By.xpath("//td[2]/oj-input-text/div/div/input")).sendKeys(password);
                await driver.sleep(1200);
                console.log("Click Save Now \(Electron\), or Download File \(Web page\) button");
                await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.write.id]]']/button/div/span[1]/img")).click();
                await driver.sleep(600);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })
    //Test New Model file for WDT Domain Genneral Property Tab Configuration
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: Test Domain General Tab Configuration with Project, ' +
        'Property and WDT files',
        async function () {
            file = "WDTModelPropertyFileForDomainGeneralProperties.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
                await driver.sleep(4800);
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomainPropertyFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomainPropertyFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(8400);
                console.log("Click Provider Management Image link");
                element = driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(300);
                if (element.isEnabled()) {
                    await element.click();
                    await driver.sleep(300);
                }
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainModel')]")).click();
                await driver.sleep(9600);
                await admin.selectDropDownList(driver,"model-proplist-selection-field",
                    "oj-searchselect-filter-model-proplist-selection-field|input","baseDomainPropList");
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomModelFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomModelFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
               console.log("Click WDT Model Tree");
               await driver.findElement(By.xpath("//div[@id='modeling-gallery-panel-card']/img")).click();
               await driver.sleep(2400);
               console.log("Click Navtree Environment");
               await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
               await driver.sleep(2400);
               console.log("Click Domain");
               await driver.findElement(By.xpath("//span[contains(.,'Domain')]")).click();
               await driver.sleep(4800)
               console.log("Click Show Advanced Fields");
               element = driver.findElement(By.xpath("//input[@id='show-advanced-fields|cb']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(4800);
               await element.click();
               await driver.sleep(4800);
               console.log("Click Domain Name WDT Setting option");
               await driver.findElement(By.xpath("//*[@id='wdtOptions_Name']/img")).click();
               await driver.sleep(2400);
               console.log("Clear Domain Edit text field");
               await driver.findElement(By.xpath("//input[@id='text_Name|input']")).clear();
               await driver.sleep(2400);
               console.log("Enter domain name = base_domain at Edit Domain text dialog");
               await driver.findElement(By.id("text_Name|input")).sendKeys("test_domain");
               await driver.sleep(2400);
               console.log("Click Ok button");
               await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]")).click();
               await driver.sleep(2400);
               console.log("Click Administration Port Enable switch");
               element = driver.findElement(By.xpath("//oj-switch[@id='AdministrationPortEnabled']/div[1]/div/div"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(2400);
               await element.click();
               await driver.sleep(2400);
               console.log("Click Production Mode Enable switch");
               await driver.findElement(By.xpath("//oj-switch[@id='ProductionModeEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               await admin.enableCheckBox(driver,"SecurityConfiguration_SecureMode_SecureModeEnabled",3);
               await driver.sleep(2400);
               console.log("Click Administration Port WDT Setting option");
               await driver.findElement(By.xpath("//*[@id='wdtOptions_AdministrationPort']/img")).click();
               await driver.sleep(2400);
               console.log("Click Domain Edit text field");
               await driver.findElement(By.xpath("//*[@id='text_AdministrationPort|input']")).click();
               await driver.sleep(2400);
               console.log("Enter AdminPort Token Key");
               await driver.findElement(By.xpath("//*[@id='radio_AdministrationPort']/div[1]/span[2]/label/span")).click();
               await driver.findElement(By.xpath("//*[@id='text_AdministrationPort|input']")).sendKeys("@@PROP:ADMINPORT@@");
               await driver.sleep(2400);
               console.log("Click Ok button");
               await driver.findElement(By.xpath("//span[contains(.,'OK')]")).click();
               await driver.sleep(2400);
               console.log("Click Exalogic Optimizations Enabled switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='ExalogicOptimizationsEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click Cluster Constraints Enabled switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='ClusterConstraintsEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click Internal Apps DeployOnDemand Enabled switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='InternalAppsDeployOnDemandEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click Remote Console Helper Enabled switch option");
               await driver.findElement(By.xpath("//*[@id='RemoteConsoleHelperEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click radio ConsoleContextPath WDT Setting option");
               element = driver.findElement(By.xpath("//*[@id='RemoteConsoleHelper_ContextPath|input']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(4800);
               await element.click();
               await driver.sleep(4800);
               console.log("Click RemoteConsoleHelper ProtectedCookieEnabled Radio button");
               await driver.findElement(By.xpath("//*[@id='RemoteConsoleHelper_ProtectedCookieEnabled']")).click();
               await driver.sleep(2400);
               console.log("Enter Console Context Path Token Key");
               await driver.findElement(By.xpath("//*[@id='wdtOptions_RemoteConsoleHelper_ContextPath']/img")).click();
               await driver.sleep(600);
               await driver.findElement(By.xpath("//*[@id='text_RemoteConsoleHelper_ContextPath|input']")).clear();
               await driver.findElement(By.xpath("//*[@id='text_RemoteConsoleHelper_ContextPath|input']")).sendKeys("@@PROP:CONTEXT_PATH@@");
               await driver.sleep(2400);
               console.log("Click Ok button");
               await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]")).click();
               await driver.sleep(2400);
               console.log("Click AdminConsole Protected Cookie Enabled switch");
               await driver.findElement(By.xpath("//*[@id='RemoteConsoleHelper_ProtectedCookieEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click wdtOptions Configuration AuditType Setting option");
               element = driver.findElement(By.xpath("//*[@id='oj-combobox-choice-ConfigurationAuditType']/span[2]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(2400);
               await element.click();
               await driver.sleep(4800);
               console.log("Select 'logaudit' type from 'Configuration Audit Type' down load box");
               await driver.findElement(By.xpath("//*[@id='ConfigurationAuditType|input']")).sendKeys("logaudit");
               await driver.sleep(2400);
               await driver.findElement(By.xpath("//*[@id='ConfigurationAuditType|input']")).sendKeys(Key.ENTER);
               await driver.sleep(4800);
               console.log("Click Config Backup Enabled switch option");
               element = driver.findElement(By.xpath("//*[@id='ConfigBackupEnabled']/div[1]/div"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(2400);
               await element.click();
               await driver.sleep(2400);
               console.log("Click JMX_Compatibility MBeanServer Enabled switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='JMX_CompatibilityMBeanServerEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click LogFormat Compatibility Enabled switch option");
               await driver.findElement(By.xpath("//*[@id='LogFormatCompatibilityEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click JMX_Platform MBeanServer Enabled switch option");
               await driver.findElement(By.xpath("//*[@id='JMX_PlatformMBeanServerEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click Diagnostic Context Compatibility Mode Enabled switch option");
               element = driver.findElement(By.xpath("//*[@id='DiagnosticContextCompatibilityModeEnabled']/div[1]/div/div"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(4800);
               await element.click();
               await driver.sleep(2400);
               console.log("Click Enable EECompliant Classloading For EmbeddedAdapters switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='EnableEECompliantClassloadingForEmbeddedAdapters']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click CdiContainer ImplicitBean Discovery Enabled switch option");
               await driver.findElement(By.xpath("//oj-switch[@id='CdiContainer_ImplicitBeanDiscoveryEnabled']/div[1]/div/div")).click();
               await driver.sleep(2400);
               console.log("Click SiteName text edit area");
               await driver.sleep(600);
               await driver.findElement(By.xpath("//input[@id='SiteName|input']")).click();
               await driver.sleep(600);
               await driver.findElement(By.xpath("//input[@id='SiteName|input']")).sendKeys("localhost");
               await driver.sleep(600);
               console.log("Click wdtOptions JMX_Invocation Timeout Seconds switch option");
               element = driver.findElement(By.xpath("//a[@id='wdtOptions_JMX_InvocationTimeoutSeconds']/img"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               await driver.sleep(4800);
               await element.click();
               await driver.sleep(600);
               console.log("Click Create Model Token Variable option");
               await driver.findElement(By.xpath("//oj-radioset[@id='radio_JMX_InvocationTimeoutSeconds']/div/span[4]/span/input")).click();
               await driver.sleep(600);
               console.log("Click Variable Name option");
               await driver.findElement(By.xpath("//oj-label[@id='textarea_JMX_InvocationTimeoutSeconds-labelled-by']")).click();
               await driver.sleep(600);
               console.log("Enter Invocation Timeout Variable Name = INVOCATION_TIMEOUT");
               await driver.findElement(By.xpath("//oj-input-text[@id='textarea_JMX_InvocationTimeoutSeconds']/div/div/input")).sendKeys("INVOCATION_TIMEOUT");
               await driver.sleep(1200);
               {
                   console.log("Double click at Invocation Timeout Variable Value");
                   const element = await driver.findElement(By.xpath("(//oj-input-text[@id='textarea_JMX_InvocationTimeoutSeconds']/div/div/input)[2]"))
                   await driver.actions({ bridge: true}).doubleClick(element).perform()
               }
               await driver.sleep(1200);
                console.log("Enter Invocation Timeout Variable Value = 30");
                await driver.findElement(By.xpath("(//oj-input-text[@id='textarea_JMX_InvocationTimeoutSeconds']/div/div/input)[2]")).sendKeys("30");
                await driver.sleep(1200);
                console.log("Click OK button to save Invocation Timeout Variable");
                element = driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(4800);
                await element.click();
                console.log("Click Download (Save) File");
                driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.write.id]]']/button/div/span")).click();
                await driver.sleep(4800);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })


    //Test New Model file for WDT Domain Security Property Tab Configuration
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: Test Domain Security Tab Configuration with Project, ' +
        'Property and WDT files',
        async function () {
            file = "WDTModelPropertyFileForDomainSecurityProperties.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
                await driver.sleep(4800);
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//*[@id='model-form-layout']/div/div[2]/div/div[2]/div/a")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomainPropertyFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomainPropertyFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
                await driver.sleep(2400);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainModel')]")).click();
                await driver.sleep(4800);
                await admin.selectDropDownList(driver,"model-proplist-selection-field",
                    "oj-searchselect-filter-model-proplist-selection-field|input","baseDomainPropList");
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomModelFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomModelFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);

                console.log("Click WDT Model Tree");
                await driver.findElement(By.xpath("//div[@id='modeling-gallery-panel-card']/img")).click();
                await driver.sleep(2800);
                console.log("Click Navtree Environment");
                await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
                await driver.sleep(2800);
                console.log("Click Domain");
                await driver.findElement(By.xpath("//span[contains(.,'Domain')]")).click();
                await driver.sleep(4800)
                console.log("Click Security Tab");
                await driver.findElement(
                    By.xpath("//span[text()='Security' and @class='oj-tabbar-item-label']")).click();
                await driver.sleep(2400);
                console.log("Click Show Advanced Fields");
                element = driver.findElement(By.xpath("//input[@id='show-advanced-fields|cb']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(4800);
                await element.click();
                await driver.sleep(2400);
                console.log("Click More Action at Default Realm");
                await driver.findElement(By.xpath("//a[@id='moreIcon_SecurityConfiguration_DefaultRealm']/img")).click();
                await driver.sleep(2800);
                console.log("Click Create New Realm");
                await driver.findElement(By.xpath("//oj-option[2]/a/span")).click();
                await driver.sleep(2800);
                console.log("Enter Realm name = testRealm-3");
                await driver.findElement(By.id("Name|input")).click();
                await driver.sleep(600);
                await driver.findElement(By.id("Name|input")).sendKeys("testRealm-3");
                await driver.sleep(2400);
                console.log("Click Create button");
                await driver.findElement(By.xpath("//span[text()='Create']")).click();
                await driver.sleep(2400);
                console.log("Enter SecurityConfiguration_AdministrativeIdentityDomain = welcome1");
                element =  driver.findElement(By.id("SecurityConfiguration_AdministrativeIdentityDomain|input"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.sendKeys("welcome1");
                await admin.enableOjSwitchCheckBox(driver,"SecurityConfiguration_DowngradeUntrustedPrincipals",3);
                await driver.sleep(2400);
                await admin.enableOjSwitchCheckBox(driver,"SecurityConfiguration_PrincipalEqualsCompareDnAndGuid",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_ClearTextCredentialAccessEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_UseKSSForDemo",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_ClearTextCredentialAccessEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_CompatibilityConnectionFiltersEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_PrincipalEqualsCompareDnAndGuid",3);
                await driver.sleep(2400);
                console.log("Click Download (Save) File");
                driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.write.id]]']/button/div/span")).click();
                await driver.sleep(4800);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test New Model file for WDT Domain Security Filter, Embedded LDAP, Property, SSL Certificate Revocation Tabs
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: Test Domain Security Filter, Embedded LDAP, ' +
        'SSL Certificate Revocation Checking Tab Configuration with Project, Property and WDT files',
        async function () {
            file = "WDTModelPropertyFileForDomainSecurityFilterSSLProperties.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
                await driver.sleep(4800);
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//*[@id='model-form-layout']/div/div[2]/div/div[2]/div/a")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomainPropertyFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomainPropertyFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
                await driver.sleep(2400);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainModel')]")).click();
                await driver.sleep(4800);
                await admin.selectDropDownList(driver,"model-proplist-selection-field",
                    "oj-searchselect-filter-model-proplist-selection-field|input","baseDomainPropList");
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomModelFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomModelFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);

                console.log("Click WDT Model Tree");
                await driver.findElement(By.xpath("//div[@id='modeling-gallery-panel-card']/img")).click();
                await driver.sleep(2800);
                console.log("Click Navtree Environment");
                await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
                await driver.sleep(2800);
                console.log("Click Domain");
                await driver.findElement(By.xpath("//span[contains(.,'Domain')]")).click();
                await driver.sleep(4800);
                console.log("Click Security Tab");
                await driver.findElement(
                    By.xpath("//span[text()='Security' and @class='oj-tabbar-item-label']")).click();
                await driver.sleep(4800);
                console.log("Click Filter Tab");
                await driver.findElement(By.xpath("//span[text()='Filter']")).click();
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_ConnectionLoggerEnabled",3);
                await driver.sleep(2400);

                console.log("Click SecurityConfiguration_ConnectionFilter Field");
                await driver.findElement(By.xpath(" //*[@id='SecurityConfiguration_ConnectionFilter|input']")).click();
                await driver.sleep(2800);
		        console.log("Enter SecurityConfiguration_ConnectionFilter Field value = test1,test2,test3");
                await driver.findElement(By.xpath(" //*[@id='SecurityConfiguration_ConnectionFilter|input']")).sendKeys("test1,test2,test3");
                await driver.sleep(2800);
                console.log("Click Security EmbeddedLDAP Tab");
		        await driver.findElement(By.xpath("//span[text()='Embedded LDAP']")).click();
                await driver.sleep(2400);
                console.log("Enter EmbeddedLDAP = Welcome1");
                await driver.findElement(By.id("EmbeddedLDAP_Credential|input")).sendKeys("Welcome1");
                await driver.sleep(2800);
                console.log("Click Security SSL Certificate Revocation Checking Tab");
		        await driver.findElement(By.xpath("//span[text()='SSL Certificate Revocation Checking']")).click();
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"SecurityConfiguration_CertRevoc_CheckingEnabled",3);
                await driver.sleep(2400);

                console.log("Click Download (Save) File");
                driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.write.id]]']/button/div/span")).click();
                await driver.sleep(4800);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test New Model file for WDT Domain Security Concurrency, Web Application, Logging tabs
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: Test Domain Concurrency, Web App, Logging',
        async function () {
            file = "WDTModelPropertyFileForDomainWebAppLoggingProperties.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
                await driver.sleep(4800);
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//*[@id='model-form-layout']/div/div[2]/div/div[2]/div/a")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomainPropertyFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomainPropertyFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainModel')]")).click();
                await driver.sleep(4800);
                await admin.selectDropDownList(driver,"model-proplist-selection-field",
                    "oj-searchselect-filter-model-proplist-selection-field|input","baseDomainPropList");
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomModelFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomModelFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click WDT Model Tree");
                await driver.findElement(By.xpath("//div[@id='modeling-gallery-panel-card']/img")).click();
                await driver.sleep(2800);
                console.log("Click Navtree Environment");
                await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
                await driver.sleep(2800);
                console.log("Click Domain");
                await driver.findElement(By.xpath("//span[contains(.,'Domain')]")).click();
                await driver.sleep(4800);

                console.log("Click Domain Concurrency Tab");
                await driver.findElement(By.xpath("//div/ul/li[5]/a/span")).click();
                await driver.sleep(2800);
                console.log("Enter MaxConcurrentNewThreads = 100");
                await driver.findElement(By.id("MaxConcurrentNewThreads|input")).clear();
                await driver.sleep(3600);
                await driver.findElement(By.id("MaxConcurrentNewThreads|input")).sendKeys(Key.BACK_SPACE);
                await driver.sleep(3600);
                await driver.findElement(By.id("MaxConcurrentNewThreads|input")).sendKeys("100");
                await driver.sleep(2800);
                console.log("Enter MaxConcurrentLongRunningRequests = 120");
                await driver.findElement(By.id("MaxConcurrentLongRunningRequests|input")).clear();
                await driver.sleep(2800);
                await driver.findElement(By.id("MaxConcurrentLongRunningRequests|input")).sendKeys(Key.BACK_SPACE);
                await driver.sleep(2800);
                await driver.findElement(By.id("MaxConcurrentLongRunningRequests|input")).sendKeys("120");
                await driver.sleep(2800);
                console.log("Click Domain Web Application Tab");
                await driver.findElement(By.xpath("//div/ul/li[7]/a/span")).click();
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_ReloginEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_AllowAllRoles",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_FilterDispatchedRequestsEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_OverloadProtectionEnabled",3);
                await driver.sleep(4800);
                await admin.enableCheckBox(driver,"WebAppContainer_RtexprvalueJspParamName",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_ClientCertProxyEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_HttpTraceSupportEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_WeblogicPluginEnabled",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_AuthCookieEnabled",3);
                await driver.sleep(2400);
                await admin.disableCheckBox(driver,"WebAppContainer_ChangeSessionIDOnAuthentication",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_WAPEnabled",3);
                await driver.sleep(2400);
                console.log("Enter WebAppContainer_PostTimeoutSecs = 30");
                element = await driver.findElement(By.id("WebAppContainer_PostTimeoutSecs|input"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.clear();
                await element.sendKeys(Key.BACK_SPACE);
                await element.sendKeys("30");
                await driver.sleep(4800);
                await admin.enableCheckBox(driver,"WebAppContainer_WorkContextPropagationEnabled",3);
                await driver.sleep(2400);
                console.log("Enter WebAppContainer_P3PHeaderValue = POST /dir/file.html?P1=V1&P2=V2 HTTP/1.1");
                await driver.findElement(By.id("WebAppContainer_P3PHeaderValue|input")).clear();
                await driver.findElement(By.id("WebAppContainer_P3PHeaderValue|input")).sendKeys("POST /dir/file.html?P1=V1&P2=V2 HTTP/1.1");
                await driver.sleep(2800);
                await admin.enableCheckBox(driver,"WebAppContainer_JSPCompilerBackwardsCompatible",3);
                await driver.sleep(2400);
                await admin.enableCheckBox(driver,"WebAppContainer_ShowArchivedRealPathEnabled",3);
                await driver.sleep(2400);
                await driver.sleep(2400);
                console.log("Enter WebAppContainer_GzipCompression_GzipCompressionMinContentLength = text/html,text/xml,text/plain,text/txt");
                await driver.sleep(300);
                await driver.findElement(By.id("WebAppContainer_GzipCompression_GzipCompressionContentType|input")).clear();
                await driver.findElement(By.id("WebAppContainer_GzipCompression_GzipCompressionContentType|input")).sendKeys(Key.BACK_SPACE);
                await driver.findElement(By.id("WebAppContainer_GzipCompression_GzipCompressionContentType|input"))
                    .sendKeys("text/html text/xml text/plain text/txt");
                await driver.sleep(2800);
                console.log("Click Download (Save) File");
                driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.write.id]]']/button/div/span")).click();
                await driver.sleep(4800);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })

    //Test Unresolved References (machine, serverTemplate, cluster) for a server
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: Test (testMachine-1, exiting testCluster-1 ' +
        'and testServerTemplate-1) unresolved references for testServer-1',
        async function () {
            file = "UnresolvedReferencesForServer.png";
            try {
                const path = require('path');
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const baseDomainModelFile = "frontend/system-tests/lib/baseDomainModelFile.yml";
                const baseDomainPropertyList = "frontend/system-tests/lib/baseDomainPropList.prop";
                const prjFile = process.env.OLDPWD + path.sep + projFile;
                const baseDomModelFile = process.env.OLDPWD + path.sep + baseDomainModelFile;
                const baseDomainPropertyFile = process.env.OLDPWD + path.sep + baseDomainPropertyList;

                await admin.importProject(driver,prjFile);
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainPropList')]")).click();
                await driver.sleep(4800);
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//*[@id='model-form-layout']/div/div[2]/div/div[2]/div/a")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomainPropertyFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomainPropertyFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click Provider Management Image link");
                await driver.findElement(By.xpath("//a[@id='provider-management-iconbar-icon']/span/img")).click();
                await driver.sleep(4800);
                await driver.findElement(By.xpath("//span[contains(.,'baseDomainModel')]")).click();
                await driver.sleep(4800);
                await admin.selectDropDownList(driver,"model-proplist-selection-field",
                    "oj-searchselect-filter-model-proplist-selection-field|input","baseDomainPropList");
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title='Choose File']")).click();
                await driver.sleep(1400);
                console.log("Select to enter base_domain file path " + baseDomModelFile);
                await driver.findElement(By.id("file-chooser")).sendKeys(baseDomModelFile);
                await driver.sleep(1400);
                console.log("Click OK button");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn12')]")).click();
                await driver.sleep(4800);
                console.log("Click WDT Model Tree");
                await driver.findElement(By.xpath("//div[@id='modeling-gallery-panel-card']/img")).click();
                await driver.sleep(2800);
                console.log("Click Environment");
                await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
                await driver.sleep(2800);
                console.log("Click Servers");
                await driver.findElement(By.xpath("//span[contains(.,'Servers')]")).click();
                await driver.sleep(2400);
                console.log("Select testServer-1");
                await driver.findElement(By.xpath("//span[contains(.,'testServer-1')]")).click();
                await driver.sleep(4800);
                console.log("Click WDT option at Cluster");
                await driver.findElement(By.xpath("//*[@id='wdtOptions_Cluster']/img")).click();
                await driver.sleep(2400);
                console.log("Select Cluster Unresolved Reference Radio button");
                await driver.findElement(By.xpath("//input[@type='radio'] [@value='fromUnresolvedReference']")).click();
                await driver.sleep(2400);
                console.log("Enter testCluster-1 as Unresolved Reference");
                await driver.findElement(By.xpath("//input[@id='text_Cluster|input']")).sendKeys("testCluster-1");
                await driver.sleep(2400);
                console.log("Click Ok button at Cluster Unresolved Reference page");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]")).click();
                await driver.sleep(2400);
                console.log("Click WDT option at Machine");
                await driver.findElement(By.xpath("//*[@id='wdtOptions_Machine']/img")).click();
                await driver.sleep(2400);
                console.log("Select Machine Unresolved Reference Radio button");
                await driver.findElement(By.xpath("//input[@type='radio'] [@value='fromUnresolvedReference']")).click();
                await driver.sleep(2400);
                console.log("Enter testMachine-1 as Unresolved Reference");
                await driver.findElement(By.xpath("//input[@id='text_Machine|input']")).sendKeys("testMachine-1");
                await driver.sleep(2400);
                console.log("Click Ok button at Machine Unresolved Reference page");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]")).click();
                await driver.sleep(2400);
                console.log("Click Show Advanced Fields");
                element = driver.findElement(By.xpath("//input[@id='show-advanced-fields|cb']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(4800);
                await element.click();
                await driver.sleep(2400);
                console.log("Click WDT option at ServerTemplate");
                element = await driver.findElement(By.xpath("//*[@id='wdtOptions_ServerTemplate']/img"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(2400);
                console.log("Select ServerTemplate Unresolved Reference Radio button");
                await driver.findElement(By.xpath("//input[@type='radio'] [@value='fromUnresolvedReference']")).click();
                await driver.sleep(2400);
                console.log("Enter testServerTemplate-1 as Unresolved Reference");
                await driver.findElement(By.xpath("//input[@id='text_ServerTemplate|input']")).sendKeys("testServerTemplate-1");
                await driver.sleep(2400);
                console.log("Click Ok button at ServerTemplate Unresolved Reference page");
                await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn22')]")).click();
                await driver.sleep(2400);
                console.log("Click Download File button at Server page");
                await driver.findElement(By.xpath("//span[text()='Download File']")).click();
                await driver.sleep(2400);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })
})
