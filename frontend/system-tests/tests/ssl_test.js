const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer and SSLDomain Provider properties
const Admin = require('../lib/admin');
const adminUrl = require('../lib/admin').adminUrl;
const browser = require('../lib/admin').browserName;
const user = require('../lib/admin').credential.userName;
const password = require('../lib/admin').credential.password;
const domSSLProductDomain = require('../lib/admin').domSSLProductDomain;
const remoteSSLAdminUrl = require('../lib/admin').remoteSSLAdminUrl;

// Create users
const NonAdminUser = require('../lib/nonAdminUser');

//const path = require("path");
const fs = require("fs");
const path = require("path");

// Test SSL Production Server for:
//    Security Warning Message, create/delete, start/stop managed server
//    Deploy/delete sample.war file
describe.only('Test Suite: ssl_test: Add WLS Domain Connection', function () {
    let driver;
    let file = "sanityTest.png";
    let element;
    var sec = 1000;
    this.timeout(600 * sec);

    before(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        nonAdminUser = new NonAdminUser(driver, file);
    })
    after(async function () {
        await driver.quit();
    })

    //   Test Basic: SSL Production AdminServer Security Warnings Detected Messages Validation
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: SSL Production AdminServer Security Warnings ' +
        'Detected Messages Validation ', async function () {
        file = "SSL-AdminServerSecurityWarningMessage.png";
        try {
            const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;
            await admin.importProject(driver,prjFile);
            await driver.sleep(2400);
            await admin.selectTree(driver,domSSLProductDomain);
            await driver.sleep(1200);
            console.log("Enter user name: " + user);
            element = driver.findElement(By.xpath("//input[@id='username-field|input']"));
            await element.clear();
            await element.sendKeys(user);
            await driver.sleep(1200);
            console.log("Enter password name: " + password);
            element = driver.findElement(By.xpath("//input[@id='password-field|input']"));
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(password);
            }
            await driver.sleep(1200);
            console.log("Enter Remote SSL Product AdminServer URL");
            element = driver.findElement(By.xpath("//input[@id='url-field|input']"));
            await element.clear();
            await element.sendKeys(remoteSSLAdminUrl);
            await driver.sleep(1200);
            console.log("Enable 'Make Insecure Connection' option");
            element = driver.findElement(By.xpath("//input[@id='insecure-checkbox']"));
            if (!element.isSelected()) {
                console.log("'Insecure Connection' option is disable - update it to enable.");
                await element.click();
            }
            await driver.sleep(2400);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn11')]")).click();
            await driver.sleep(2400);
            console.log("Verify if Security Message appears and click at it");
            element = driver.findElement(By.xpath("//span[text()='View/Refresh Report']"));
            if (element.isEnabled()) {
                await element.click();
                console.log("Security Message link appears");
                console.log("TEST PASS ");
            }
            else {
                console.log("Security Message doesn't appear");
                console.log("TEST FAIL ");
            }
            await driver.sleep(2400);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //   Test SSL Production AdminServer Basic sample.war file Deployment
    //
    it.skip('2. Test Category: GAT/Risk1\n \t Test Scenario: Test SSL Production AdminServer Basic sample.war ' +
        'file Deployment ', async function () {
        file = "SSL-AdminServerDeployment.png";
        const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
        const path = require('path');
        const prjFile = process.env.OLDPWD + path.sep + projFile;

        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deployWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;

        if (fs.existsSync(deployWarFilePath) && fs.existsSync(deployWarPlanFilePath))  {
        try {
            await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                domSSLProductDomain,user,password);
            await driver.sleep(2400);
            console.log("Click Edit Tree panel card header image link.");
            await driver.findElement(By.xpath("//img[@alt='Edit Tree']")).click();
            await driver.sleep(2400);
            console.log("Click Deployment container landing image link.");
            await driver.findElement(By.xpath("//div[@id='Deployments']")).click();
            await driver.sleep(2400);
            console.log("Click App Deployments link.");
            await  driver.findElement(By.xpath("//span[contains(.,'App Deployments')]")).click();
            console.log("Click New button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
            await driver.sleep(2400);
            console.log("Enter App Deployment Name = sample.war file with SamplePlan.xml file");
            await driver.findElement(By.id("Name|input")).clear();
            await driver.findElement(By.id("Name|input")).sendKeys("sampleAppWarFileWithPlan");
            await driver.sleep(1200);
            console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
            driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
            await driver.sleep(1200);
            console.log("Click to select Add > button");
            element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(1200);
            console.log("Click Choose File image");
            element = driver.findElement(
                By.xpath("//oj-form-layout[@id='wlsform']/div/div[6]/div/div[2]/div/a[1]/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(1200);
            console.log("Enter " +deployWarFilePath+ " to deploy");
            await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
            driver.sleep(9600);
            console.log("Click Choose Plan Image");
            element = driver.findElement(
                By.xpath("//oj-form-layout[@id='wlsform']/div/div[7]/div/div[2]/div/a[1]/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(7200);
            console.log("Enter " +deployWarPlanFilePath+ " to deploy");
            await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployWarPlanFilePath);
            await driver.sleep(9600);
            console.log("Click Create button");
            element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            driver.sleep(7200);
            await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                domSSLProductDomain);
            await driver.sleep(2400);
            console.log("Click Edit Tree panel card header image link.");
            await driver.findElement(By.xpath("//img[@alt='Edit Tree']")).click();
            console.log("Click Deployment container landing image link.");
            await driver.findElement(By.xpath("//div[@id='Deployments']")).click();
            await driver.sleep(2400);
            console.log("Click App Deployments link.");
            await  driver.findElement(By.xpath("//span[contains(.,'App Deployments')]")).click();
            console.log("Click Shopping Cart Image to expand its menu option....");
            element = driver.findElement((By.xpath("//img[@id='shoppingCartImage']")));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Click Commit Changes menu");
            await driver.findElement(By.xpath("//span[contains(.,'Commit Changes')]")).click();
            await driver.sleep(3600);
            console.log("Verify if sampleAppWarFileWithPlan exit, then delete it");
            console.log("Select object at 1st row to delete from Object table");
            element =  driver.findElement(By.xpath("//tr[1]/td/oj-selector/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(1200);
            console.log("Click Delete button");
            await driver.findElement(By.xpath("//oj-button[@id='delete']")).click();
            await driver.sleep(1200);
            await admin.saveAndCommitChanges(driver);
            console.log("TEST PASS ");
            await driver.sleep(1200);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })

    //   Test SSL: Server life cycle.
    //     Create testServer-321, use NM start testServer-321 server from Remote Console with SSL port
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: Create and Start a managed server ' +
        'with SSL Production AdminServer ', async function () {
        file = "SSL-CreateAndStartManagedServer.png";
        const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
        const path = require('path');
        const prjFile = process.env.OLDPWD + path.sep + projFile;
        try {
            await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                domSSLProductDomain,user,password);
            await driver.sleep(2400);
            console.log("Click Edit Tree panel card header image link.");
            await driver.findElement(By.xpath("//img[@alt='Edit Tree']")).click();
            await driver.sleep(2400);
            console.log("Click Environment navTree");
            await driver.findElement(
                By.xpath("//span[text()='Environment' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(2400);
            console.log("Click Servers Navtree");
            await driver.findElement(
                By.xpath("//span[text()='Servers' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(2400);
            console.log("Click New  button at Servers page");
            element = driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']"));
            await driver.sleep(900);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Enter testServer-123 name");
            await driver.findElement(By.xpath("//input[@id='Name|input']")).clear();
            await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys("testServer-321");
            await driver.sleep(1200);
            await admin.saveToShoppingCart(driver);
            console.log("Click Machine pop down menu");
            element = driver.findElement(By.xpath("//*[@id='Machine']/div[2]/span/a"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Select localhost");
            await driver.findElement(By.xpath("//li[2]/div")).click();
            await driver.sleep(7200);
            console.log("Click to enable SSL Listener Port");
            element = driver.findElement(By.xpath("//oj-switch[@id='SSL_Enabled']/div[1]/div/div"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isSelected()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Enter listener port = 5001");
            await driver.findElement(By.xpath("//input[@id='ListenPort|input']")).clear();
            await driver.findElement(By.xpath("//oj-input-text[@id='ListenPort']/div/div/input")).sendKeys("5001");
            await driver.sleep(1200);
            console.log("Enter SSL listener port = 5552");
            await driver.findElement(By.xpath("//input[@id='SSL_ListenPort|input']")).clear();
            await driver.findElement(By.xpath("//input[@id='SSL_ListenPort|input']")).sendKeys("5552");
            await driver.sleep(1200);
            await admin.saveAndCommitChanges(driver);
            await driver.sleep(1200);
            console.log("Click Server breadcrumb-crosslink");
            await driver.findElement(By.xpath("//a[text()='Servers']")).click();
            await driver.sleep(1200);
            console.log("Click Server oj-button-menu-dropdown-icon");
            await driver.findElement(
                By.xpath("//div[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(1200);
            console.log("Click to select Servers Runtime Data - Monitoring Tree page");
            await driver.findElement(
                By.xpath("//span[text()='Runtime Data - Monitoring Tree']")).click();
            await driver.sleep(1200);
            console.log("Select object at 3rd row to start from Object table");
            element =  driver.findElement(By.xpath("//tr[3]/td/oj-selector/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(2400);
            console.log("Click Start button to start testServer-123");
            await driver.findElement(By.xpath("//oj-button[@id='start']/button/div/span[1]/img")).click();
            await driver.sleep(9800);
            console.log("Click to stop Sync Icon");
            element =  driver.findElement(By.xpath("//img[@id='sync-icon']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(9800);
            await element.click();
            //Verify if testServer-123 started successfully
            element = driver.findElement(By.xpath("//tbody/tr[3]/td[3]"));
            console.log("Verify if testServer-123 started successfully")
            await driver.sleep(1200);
            let result = await element.getText();
            if (result.includes('Running')) {
                console.log("testServer-123 was successfully created and started.")
                console.log("TEST PASS ");
            }
            else {
                console.log("testServer-123 is NOT running");
                console.log("TEST FAIL ");
            }
            await driver.sleep(9800);

        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }

    })

    //   Test SSL: Server life cycle.
    //     Stop and delete testServer-321 server from Remote Console with SSL port
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: Stop a managed server and delete it ' +
        'with SSL Production AdminServer ', async function () {
        file = "SSL-StopAndDeleteManagedServer.png";
        const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
        const path = require('path');
        const prjFile = process.env.OLDPWD + path.sep + projFile;
        try {
            await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                domSSLProductDomain,user,password);
            await driver.sleep(2400);
            console.log("Click Monitoring Tree panel card header image link.");
            await driver.findElement(By.xpath("//img[@alt='Monitoring Tree']")).click();
            await driver.sleep(2400);
            console.log("Click Environment navTree");
            await driver.findElement(
                By.xpath("//span[text()='Environment' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(2400);
            console.log("Click Servers Navtree");
            await driver.findElement(By.xpath("//span[text()='Servers']")).click();
            await driver.sleep(2400);
            console.log("Select object at 3rd row to shutdown from Object table");
            element =  driver.findElement(By.xpath("//tr[3]/td/oj-selector/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(2400);
            console.log("Click shutdown button to stop testServer-123");
            element = driver.findElement(By.xpath("//oj-button[@id='shutdownActionsMenuLauncher']"));
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Click Force shutdown now");
            await driver.findElement(By.xpath("//span[text()='Force shutdown now']")).click();
            await driver.sleep(9800);
            await driver.sleep(9800);
            console.log("Click to stop Sync Icon");
            element =  driver.findElement(By.xpath("//img[@id='sync-icon']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(9800);
            await element.click();
            await driver.sleep(9800);
            console.log("Click Server oj-button-menu-dropdown-icon");
            await driver.findElement(
                By.xpath("//div[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(9800);
            console.log("Click to select Server Configurations - Edit Tree page");
            await driver.findElement(
                By.xpath("//span[text()='Server Configurations - Edit Tree']")).click();
            await driver.sleep(6400);
            console.log("Select object at 3rd row to shutdown from Object table");
            element =  driver.findElement(By.xpath("//tr[3]/td/oj-selector/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(6400);
            console.log("Click Delete button");
            element = driver.findElement(By.xpath("//span[starts-with(@id, 'delete')]"));
            await driver.sleep(6400);
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(1200);
                console.log("testServer-321 was successfully stopped and deleted.");
                console.log("TEST PASS ");
            }
            await driver.sleep(1200);
            await admin.commitChanges(driver);
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }

    })

    //
    //Create users (deployerUser, monitorUser, operatorUser)
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: create deployerUser, monitorUser, operatorUser ',
        async function () {
        file = "createNonAdminUser.png";
        try {
            const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
            const path = require('path');
            const prjFile = process.env.OLDPWD + path.sep + projFile;

            console.log("Go to Security Data Tree Panel, click at it");
            await admin.goToNavTreeLevelFiveLink(
                driver,"security","Realms","myrealm",
                "Authentication Providers","DefaultAuthenticator","Users",nonSSL=false);
            await driver.sleep(6400);
            await nonAdminUser.createUser(driver,"deployerUser");
            await admin.goToNavTreeLevelFiveLink(
                driver,"security","Realms","myrealm",
                "Authentication Providers","DefaultAuthenticator","Users",nonSSL=false);
            await driver.sleep(6400);
            await nonAdminUser.createUser(driver,"monitorUser");
            await admin.goToNavTreeLevelFiveLink(
                driver,"security","Realms","myrealm",
                "Authentication Providers","DefaultAuthenticator","Users",nonSSL=false);
            await driver.sleep(6400);
            await nonAdminUser.createUser(driver,"operatorUser");
            await driver.sleep(800);
            console.log("deployeruser, monitorUser and operatorUser were created successful");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //Test non-Admin users deployeruser, monitorUser and operatorUser Privileges Roles with SSL Production Server
    //
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: NonAdmin Users Privilege and Roles with Edit Tree',
        async function () {
        file = "nonAdminUserPrivilegeRole.png";
        try {
            console.log("Starting to validate monitorUser Privileges in SSL Environment.......");
            console.log("----------------------------------------------");
            await nonAdminUser.testUserPrivilegeRole(driver,"monitorUser", "Edit Tree",nonSSL=false);
            console.log("Starting to validate operatorUser Privileges in SSL Environment.......");
            console.log("----------------------------------------------");
            await nonAdminUser.testUserPrivilegeRole(driver,"operatorUser", "Edit Tree",nonSSL=false);
            console.log("Starting to validate deployerUser Privileges in SSL Environment.......");
            console.log("----------------------------------------------");
            await nonAdminUser.testUserPrivilegeRole(driver,"deployerUser", "Edit Tree",nonSSL=false);
            await driver.sleep(1200);
            console.log("deployeruser, monitorUser and operatorUser PrivilegeRole were validated successful");
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //
    //Delete users (deployerUser, monitorUser, operatorUser)
    //
    it('7. Test Category: GAT/Risk1\n \t Test Scenario: delete deployerUser, monitorUser, operatorUser ',
        async function () {
            file = "deleteNonAdminUser.png";
            try {
                const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
                const path = require('path');
                const prjFile = process.env.OLDPWD + path.sep + projFile;

                console.log("Go to Security Data Tree Panel, click at it");
                await admin.goToNavTreeLevelFiveLink(
                    driver,"security","Realms","myrealm",
                    "Authentication Providers","DefaultAuthenticator","Users",nonSSL=false);
                await driver.sleep(6400);
                await nonAdminUser.deleteUser(driver,"deployerUser");
                await nonAdminUser.deleteUser(driver,"monitorUser");
                await nonAdminUser.deleteUser(driver,"operatorUser");
                console.log("deployeruser, monitorUser and operatorUser were deleted successful");
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
        })


    //Test Case:
    // Create a Generic Oracle JDBC System Resource (testJDBCSysRes-1), save than delete it.
    // with SSL Production mode.
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: create->save->delete a new testJDBCSysRes-1 ', async function() {
        file = "SSL-CreateJDBCDataSource.png";
        const projFile = "frontend/system-tests/lib/wdtDomainProject.json";
        const path = require('path');
        const prjFile = process.env.OLDPWD + path.sep + projFile;

        let dbSourceType = "Generic Data Source";
        let dbType = "Oracle";
        let dbDriver = "GENERIC_Oracle_DatabaseDriver";
        let dbName = "pdb1.vcn2racregional.devweblogic2phx.oraclevcn.com";
        let dbHost = "wlsqa.vcn2racregional.devweblogic2phx.oraclevcn.com";
        let dbPort = "1521";
        let dbUser = "admin";
        let dbPassword = "welcome1";

        try {
            let oracleDriver = "GENERIC_*Oracle\'s Driver (Thin XA) for Application Continuity; Versions";
            let targetName = "All";
            let jdbcSysResName = "testJDBCSysRes-1";
            let jndiName = "testJdbcJNDIName-1";

            await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                domSSLProductDomain,user,password);
            await driver.sleep(2400);
            console.log("Click Edit Tree panel card header image link.");
            await driver.findElement(By.xpath("//img[@alt='Edit Tree']")).click();
            await driver.sleep(2400);
            console.log("Click Services navTree");
            await driver.findElement(
                By.xpath("//span[text()='Services' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(2400);
            console.log("Click Data Sources Navtree");
            await driver.findElement(
                By.xpath("//span[text()='Data Sources' and @class='oj-navigationlist-item-label']")).click();
            await driver.sleep(2400);
            console.log("Click New  button at Data Sources page");
            element = driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']"));
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            console.log("Enter JDBC System Resource Name = " + jdbcSysResName);
            await driver.findElement(By.id("Name|input")).click();
            await driver.findElement(By.id("Name|input")).sendKeys(jdbcSysResName);
            await driver.sleep(4800);
            console.log("Enter JNDI Name = " + jndiName);
            await driver.findElement(By.id("JDBCResource_JDBCDataSourceParams_JNDINames|input")).click();
            await driver.findElement(By.id("JDBCResource_JDBCDataSourceParams_JNDINames|input")).sendKeys(jndiName);

            await driver.sleep(4800);
            console.log("Select Targets = " + targetName);
            element = driver.findElement(By.xpath("//oj-button[@id='addAllToChosen']/button/div"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(300);

            console.log("Select Datasource type = " + dbSourceType);
            await admin.selectDropDownValue(driver,"JDBCResource_DatasourceType","Generic Data Source");
            await driver.sleep(2000);
            console.log("Select Database type = " + dbSourceType);
            console.log("Select Database driver = " + oracleDriver);
            console.log("Enter database name = " + dbName);

            element = driver.findElement(By.xpath("//div[9]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(dbName);
            await driver.sleep(300);

            console.log("Enter database machine name = " + dbHost);
            element = driver.findElement(By.xpath("//div[10]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(dbHost);
            await driver.sleep(300);

            console.log("Enter database machine port = " + dbPort);
            element = driver.findElement(By.xpath("//div[11]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(dbPort);
            await driver.sleep(300);

            console.log("Enter database username = " + dbUser);
            element = driver.findElement(By.xpath("//div[12]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(dbUser);
            await driver.sleep(300);

            console.log("Enter database user password = " + dbPassword);
            element = driver.findElement(By.xpath("//div[13]/div/div[2]/div/oj-input-password/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(dbPassword);
            await driver.sleep(1600);
            await admin.saveToShoppingCart(driver,"finish");

            console.log("Go to Edit Tree -> Services -> Data Sources Page");
            await admin.goToNavTreeLevelTwoLink(driver,
                "configuration","Services","Data Sources",nonSSL=false);
            await driver.sleep(1200);
            await admin.discardChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

})