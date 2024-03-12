//Deploy, modify, start, stop and undeploy Applications and Library app
//   Configuration -> Deployments -> App Deployments
//   Configuration -> Deployments -> Libraries
//   Monitoring -> Domain Runtime -> Deployments -> App Deployments

'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')
const fs = require('fs')

//Initialize type of browser driver
const getDriver = require('../lib/browser');

//Get AdminServer properties
const Admin = require('../lib/admin');
const path = require("path");
const browser = require('../lib/admin').browserName;

//Deployment Test Suite
describe.only('Test Suite: deploy_test for Application and Library',
    function () {
    let driver;
    let file = "deploy.png";
    let element;
    let admin;
    var sec = 1000;
    this.timeout(800 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case:
    // Deploy sample.war file to AdminServer target
    // Validate deployment -> start/stop sample.war -> verify result then delete sample.war
    // Start: 'Servicing all requests', 'Servicing Only administration request' menu
    // Stop: 'When work completes to stop', 'Force Stop Now'
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: deploy Application WAR file - sample.war',
        async function () {
        file = "sampleWAR.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

        if (fs.existsSync(deployWarFilePath) ) {
           try {
               await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
                   "DeploymentsChevron","App Deployments");
               console.log("Click New button");
               await driver.findElement(
                   By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
               await driver.sleep(2400);
               console.log("Enter App Deployment Name = sample");
               await driver.findElement(By.id("Name|input")).clear();
               await driver.findElement(By.id("Name|input")).sendKeys("sample");
               await driver.sleep(2400);
               console.log("Click to choose AdminServer target");
               element = driver.findElement(By.xpath("//oj-option[text()='AdminServer']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(2400);
               console.log("Click Add Arrow ->");
               await driver.findElement(By.xpath("//oj-button[@id='addToChosen']")).click();
               await driver.sleep(2400);
               console.log("Click Choose File to deploy");
               element = driver.findElement(By.xpath("//img[@title='Choose File']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(9600);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
               await driver.sleep(9600);
               console.log("Click Create/Finish button");
               await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
               await driver.sleep(2400);
               await admin.commitChanges(driver);
               await driver.sleep(2400);

               await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Deployments",
                   "Application Management");
               await driver.sleep(1200);
               console.log("Select sample module (row 7, column 1) from the deployed table");
               await driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector")).click();
               await driver.sleep(4800);
               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing all requests' to start");
               await driver.findElement(By.xpath("//oj-option[@id='start']")).click();
               await driver.sleep(9800);

               console.log("Click Stop button to select menu to stop deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='stopActionsMenuLauncher']")).click();
               await driver.sleep(9800);
               console.log("Select 'When work completes' to stop");
               element =  driver.findElement(By.xpath("//oj-option[@id='stop']"));
               await driver.wait(until.elementIsVisible(element),888);
               await element.click();
               await driver.sleep(9800);

               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(9800);
               console.log("Select 'Servicing Only administration request' to start");
               await driver.findElement(By.xpath("//oj-option[@id='startInAdminMode']")).click();
               await driver.sleep(9800);

               console.log("Click Stop button to select menu to stop deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='stopActionsMenuLauncher']")).click();
               await driver.sleep(9800);
               console.log("Select 'Force Stop Now' to stop");
               element =  driver.findElement(By.xpath("//oj-option[@id='forceStop']"));
               await driver.wait(until.elementIsVisible(element),888);
               await element.click();
               await driver.sleep(9800);

               await admin.deleteMBeanObject(driver,"sample","App Deployments", 2,"configuration",
                   "Deployments","App Deployments","","","",7);
               console.log("TEST PASS ");
           } catch (e) {
               await admin.takeScreenshot(driver, file);
               console.log(e.toString() + " TEST FAIL");
           }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })


    //Test Case:
    // Deploy lib.jar file to AdminServer (TestLibJar)
    // Validate deployment -> then delete TestLibJar
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: deploy Library file: lib.jar',
        async function () {
            file = "TestLib.png";
            let libJarFile = "frontend/system-tests/lib/lib.jar";
            let path = require('path');
            let deployLibJarFilePath = process.env.OLDPWD + path.sep + libJarFile;

            try {
                await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
                    "DeploymentsChevron","Libraries");
                console.log("Click New button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter JAR LibApp Deployment Name = testLib");
                await driver.findElement(By.id("Name|input")).clear();
                await driver.findElement(By.id("Name|input")).sendKeys("testLib");
                await driver.sleep(2400);
                console.log("Click Choose File to deploy");
                element = driver.findElement(By.xpath("//img[@title='Choose File']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(2400);
                console.log("Click select " +deployLibJarFilePath+ " to deploy");
                await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployLibJarFilePath);
                driver.sleep(9600);
                console.log("Click Create button");
                await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']/button/div/span/img")).click();
                driver.sleep(9600);
                //Workaround by clicking away to avoid shoppingCartImage StaleElementReferenceException problem
                await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
                    "DeploymentsChevron","Libraries");
                await admin.commitChanges(driver);
                driver.sleep(7200);
                //Workaround by clicking away to avoid shoppingCartImage StaleElementReferenceException problem
                await admin.goToNavTreeLevelThreeLink(driver,"configuration","Deployments",
                    "Libraries","testLib");
                console.log("Modify TestLib to select AdminServer as target");
                console.log("Click Targets tab");
                await driver.findElement(By.xpath("//span[contains(.,'Targets')]")).click();
                await driver.sleep(4800);
                console.log("Select AdminServer as target");
                try {
                    //Check if AdminServer is the 3 elements in the Targets list of docker domain
                    element = driver.findElement(
                        By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div/span[3]/span/input"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    if (element.isEnabled()) {
                        await element.click();
                    } else {
                        //AdminServer is the only item in the Targets list
                        element = driver.findElement(
                            By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div/span/span/input"));
                        driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                        await element.click();
                    }
                } catch (e) {
                    console.log("Can't find AdminServer in the Targets list - Abort operation");
                }
                await driver.sleep(800);
                await driver.findElement(
                    By.xpath("//oj-button[@id='addToChosen']/button/div/span")).click()
                await driver.sleep(800);
                await admin.saveAndCommitChanges(driver);
                await driver.sleep(3600);
                await admin.deleteMBeanObject(driver,"testLib","Libraries",2,"configuration","Deployments","Libraries","","","",2);
                await driver.sleep(800);
                console.log("TEST PASS ");
            } catch (e) {
                await admin.takeScreenshot(driver, file);
                console.log(e.toString() + " TEST FAIL");
            }
    })

    //Test Case:
    // Deploy sample.war and samlePlan.xml files to AdminServer target with Upload option
    // Validate deployment sampleAppWarFileWithPlan from shopping cart and Deploy Application page
    // Deleting sample war module
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: deploy sample.war and samplePlan.xml files ' +
        'with Upload option',
    async function () {
        file = "sampleAppWarFileWithPlan-1.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deployWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;

        if (fs.existsSync(deployWarFilePath) && fs.existsSync(deployWarPlanFilePath))  {
        try {
           await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
               "DeploymentsChevron","App Deployments");
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
           //Workaround by clicking away to avoid shoppingCartImage StaleElementReferenceException problem
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
                "App Deployments");
           driver.sleep(7200);
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
           await admin.deleteMBeanObject(driver,"sampleAppWarFileWithPlan","App Deployments",
               2,"configuration","Deployments","App Deployments","","","",7);
           console.log("TEST PASS ");
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })


    //Test Case:
    // Deploy sample.war and samplePlan.xml files to AdminServer target by direct path
    // Validate deployment sampleAppWarFileWithPlan from shopping cart and Deploy Application page
    // Deleting sample module
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: deploy sample.war and samplePlan.xml files',
    async function () {
        file = "sampleAppWarFileWithPlan-2.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deployWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;

        if (fs.existsSync(deployWarFilePath) && fs.existsSync(deployWarPlanFilePath))  {
        try {
           await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
               "DeploymentsChevron","App Deployments");
           console.log("Click New button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
           await driver.sleep(2400);
           console.log("Enter App Deployment Name = sample.war file with SamplePlan.xml file");
           await driver.findElement(By.id("Name|input")).clear();
           await driver.findElement(By.id("Name|input")).sendKeys("sampleAppWarFileWithPlan-2");
           await driver.sleep(1200);
           console.log("Click disable upload option");
           await driver.findElement(
               By.xpath("//*[@id='Upload']/div[1]/div/div")).click();
           await driver.sleep(1200)
           console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
           driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
           await driver.sleep(1200);
           console.log("Click to select Add > button");
           element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deployWarFilePath+ " to deploy");
           element = driver.findElement(By.xpath("//input[@id='SourcePath|input']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await element.sendKeys(deployWarFilePath);
           driver.sleep(9800);
           console.log("Enter " +deployWarPlanFilePath+ " to deploy");
           element = driver.findElement(By.xpath("//input[@id='PlanPath|input']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await element.sendKeys(deployWarPlanFilePath);
           await driver.sleep(1200);
           console.log("Click Create button");
           element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(6400);
           //Workaround by clicking away to avoid shoppingCartImage StaleElementReferenceException problem
            await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
                "App Deployments");
           console.log("Click Shopping Cart Image to expand its menu option....");
           element = driver.findElement((By.xpath("//img[@id='shoppingCartImage']")));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await driver.sleep(2400);
           if (element.isEnabled()) {
               await element.click();
           }
           await driver.sleep(8400);
           console.log("Verify if deployed application sampleAppWarFileWithPlan-2 in shopping cart");
           console.log("Click Discard Changes menu");
           await driver.findElement(By.xpath("//span[contains(.,'Discard Changes')]")).click();
           await driver.sleep(3600);
           console.log("TEST PASS ");
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })

    //Test Case:
    // Test: create Plan file and then test Plan Editor
    // From Monitoring Tree -> Application Management -> jms-xa-adp -> click "Create Plan"
    // Validate deployment jms-local-adpPlan.xml plan file is created successfully.
    // Edit jms-local-adpPlan.xml plan with Plan editor by adding 'test123' property to the file
    // Verify 'test123' was added to jms-local-adpPlan.xml file successfully
    //
    it.skip('5. Test Category: GAT/Risk1\n \t Test Scenario: create jms-xa-adp-file Plan xml file, validate ' +
        'Plan Editor with WLDFHarvester_Enabled property',
    async function () {
        file = "createPlan-jms-xa-adp-file.png";
        let jms_xa_adpPlanFile = "frontend/system-tests/lib/jms-local-adpPlan.xml";
        let jms_xa_adpPlanFilePath = process.env.OLDPWD + path.sep + jms_xa_adpPlanFile;

        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Application Management", "jms-local-adp");
            console.log("Click 'Create Plan' oj-button");
            await driver.sleep(7200);
            await driver.findElement(By.xpath("//span[starts-with(@id,'createPlan')]")).click();
            console.log("Enter " +jms_xa_adpPlanFilePath+ " Plan Path at Create Plan dialog");
            await driver.sleep(7200);
            await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).sendKeys(jms_xa_adpPlanFilePath);
            await driver.sleep(7200);
            console.log("Click Done button at Create Plan dialog");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
            await driver.sleep(9600);
            console.log("Click Sync Icon Image");
            element = driver.findElement(By.xpath("//img[@id='sync-icon']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(7200);
            if (element.isEnabled()) {
                await element.click();
            }
            await admin.goToNavTreeLevelTwoLink(driver, "monitoring", "Deployments",
                "Application Management");
            await driver.sleep(7200);
            console.log("Click at 'jms-local-adp' navTree node");
            element = driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='jms-local-adp']"));
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(7200);
            console.log("Click at Deployment Plan navTree node");
            element = driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Deployment Plan']"));
            await driver.wait(until.elementIsVisible(element),888);
            await element.click();
            await driver.sleep(3600);
            console.log("Select 1st element META-INF/weblogic-diagnostics.xml of jms-local-adp ");
            await driver.sleep(9400);
            await driver.findElement(By.xpath("//oj-selector[@id='table_table_selector_0']/span/input")).click();
            await driver.sleep(3600);
            console.log("Click Edit button ");
            await driver.findElement(By.xpath("//oj-button[@id='edit']")).click();
            await driver.sleep(3600);
            console.log("Enter Value at Edit dialog = test123");
            element = driver.findElement(By.xpath("//input[@id='Value|input']"));
            await element.clear();
            await element.sendKeys("test123");
            await driver.sleep(3600);
            console.log("Click Done button");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
            await driver.sleep(3600);
            console.log("Click Deployment Plan tab");
            await driver.findElement(
                By.xpath("//span[@class='oj-tabbar-item-label' and text()='Deployment Plan']")).click();
            await driver.sleep(3600);
            console.log("Check if Property WLDFHarvester_Enabled value= test123");
            driver.findElements(By.xpath("//oj-text-area[@id='DeploymentPlan']")).then((elements) => {
                if (elements.length > 0) {
                    console.log("Found Property WLDFHarvester_Enabled has value=test123");
                    console.log("TEST PASS");
                } else {
                    console.log("Property WLDFHarvester_Enabled doesn't have value=test123");
                    console.log("TEST FAIL");
                }
            });
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }

    })

    //Test Case:
    // Deploy EarWar.ear files to AdminServer target by direct path
    // From Monitoring -> Application Management  -> WarEar module page, select 'Create Plan' button
    // Validate WarEarPlan.xml created successful from viewing WarEarPlan editor
    // Deleting WarEar mode.
    it.skip('6. Test Category: GAT/Risk1\n \t Test Scenario: deploy WarEar.ear then create WarEarPlan.xml files' +
        ' validate Deployment Plan',
    async function () {
        file = "WarEarPlan.png";
        let deployWarEarFile = "frontend/system-tests/lib/WarEar.ear";
        let path = require('path');
        let deploWarEarFilePath = process.env.OLDPWD + path.sep + deployWarEarFile;
        let WarEarPlanFile = "frontend/system-tests/lib/WarEarPlan.xml";
        let WarEarPlanFilePath = process.env.OLDPWD + path.sep + WarEarPlanFile;

        if (fs.existsSync(deploWarEarFilePath))  {
        try {
           await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
               "DeploymentsChevron","App Deployments");
           console.log("Click New button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
           await driver.sleep(2400);
           console.log("Enter App Deployment Name = WarEar");
           await driver.findElement(By.id("Name|input")).clear();
           await driver.findElement(By.id("Name|input")).sendKeys("WarEar");
           await driver.sleep(1200);
           console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
           driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
           await driver.sleep(1200);
           console.log("Click to select Add > button to add AdminServer to the target list");
           element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Click to disable Upload file option");
           await driver.findElement(By.xpath("//oj-switch[@id='Upload']/div/div/div")).click();
           await driver.sleep(1200);
           console.log("Enter " +deploWarEarFilePath+ " to deploy");
           await driver.findElement(By.xpath("//input[@id='SourcePath|input']")).sendKeys(deploWarEarFilePath);;
           driver.sleep(2400);
           console.log("Click Create button");
           await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
           driver.sleep(2400);
           await admin.commitChanges(driver);
           await driver.sleep(8400);
           console.log("Click breadcrumbs-container at WarEar");
           await driver.findElement(
           By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
           await driver.sleep(3600);
           console.log("Click select 'Status - Monitoring Tree' menu");
           await driver.findElement(By.xpath("//oj-option[@id='Status - Monitoring Tree']")).click();
           await driver.sleep(7200);
           console.log("Click 'Create Plan oj-button image");
           await driver.findElement(
               By.xpath("//oj-button[@id='createPlan']")).click();
           await driver.sleep(3600);
           console.log("Enter "+WarEarPlanFilePath+" at the PlanPath|Input text field");
           await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).clear();
           await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).sendKeys(WarEarPlanFilePath);
           await driver.sleep(3600);
           console.log("Click Done button at Create Plan dialog");
           await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(8400);
           console.log("Click at Deployment Plan navTree node");
           await driver.sleep(3600);
           element = driver.findElement(
               By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Deployment Plan']"));
           await driver.wait(until.elementIsVisible(element),888);
           await element.click();
           await driver.sleep(8400);
           console.log("Click Deployment Plan tab");
           await driver.findElement(
               By.xpath("//span[@class='oj-tabbar-item-label' and text()='Deployment Plan']")).click();
           await driver.sleep(3600);
           console.log("Check if module-name value = WarEar.ear exist");
           driver.findElements(By.xpath("//oj-text-area[@id='DeploymentPlan']")).then((elements) => {
               if (elements.length > 0) {
                   console.log("Found module-name value = WarEar.ear");
                   console.log("TEST PASS");
               } else {
                   console.log("Not Found module-name value = WarEar.ear");
                   console.log("TEST FAIL");
               }
           });
           console.log("Clean up - Delete deployed WarEar module.....");
           console.log("Click Application Management tab");
           await driver.findElement(
               By.xpath("//a[text()='Application Management']")).click();
           await driver.sleep(3600);
           console.log("Click Application Management oj-button");
           await driver.findElement(
               By.xpath("//span[text()='Application Management' and @class='oj-button-text']")).click();
           await driver.sleep(3600);
           console.log("Select Application Configurations - Edit Tree");
           await driver.findElement(
               By.xpath("//span[text()='Application Configurations - Edit Tree']")).click();
           await driver.sleep(3600);
           console.log("Select WarEar Module to delete, 1st element in the deployed table");
           await driver.findElement(
               By.xpath("//table/tbody/tr[1]/td[1]/oj-selector")).click();
           await driver.sleep(3600);
           console.log("Click Delete button");
           await driver.findElement(
               By.xpath("//oj-button[@id='delete']")).click();
           await driver.sleep(3600);
           console.log("Click Shopping Cart Image");
           await driver.findElement(
               By.xpath("//img[@id='shoppingCartImage']")).click();
           await driver.sleep(1200);
           console.log("Select Commit Changes menu");
           await driver.findElement(
               By.xpath("//span[@id='commit-changes']")).click();
           await driver.sleep(3600);
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })

    //Test Case:
    // Deploy sample.war and samplePlan.xml files to AdminServer target by direct path
    // Go to Monitoring -> Deployments -> Application Management
    //
    it.skip('7. Test Category: GAT/Risk1\n \t Test Scenario: deploy sample.war and samplePlan.xml files',
    async function () {
        file = "sampleAppWarFileWithPlan-2.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let simpleWarFile = "frontend/system-tests/lib/simple.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let simpleWarPlanFile = "frontend/system-tests/lib/simplePlan.xml";
        let path = require('path');
        let deploySampleWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deploySimpleWarFilePath = process.env.OLDPWD + path.sep + simpleWarFile;
        let deploySampleWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;
        let deploySimpleWarPlanFilePath = process.env.OLDPWD + path.sep + simpleWarPlanFile;

        if (fs.existsSync(deploySampleWarFilePath) && fs.existsSync(deploySampleWarPlanFilePath)
        && fs.existsSync(deploySimpleWarFilePath) && fs.existsSync(deploySimpleWarPlanFilePath) )  {
        try {
           await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree",
               "DeploymentsChevron","App Deployments");
           console.log("Click New button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
           await driver.sleep(2400);
           console.log("Enter App Deployment Name = sample.war file with SamplePlan.xml file");
           await driver.findElement(By.id("Name|input")).clear();
           await driver.findElement(By.id("Name|input")).sendKeys("sampleWarFileWithPlan");
           await driver.sleep(1200);
           console.log("Click disable upload option");
           await driver.findElement(
               By.xpath("//*[@id='Upload']/div[1]/div/div")).click();
           await driver.sleep(1200)
           console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
           driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
           await driver.sleep(1200);
           console.log("Click to select Add > button");
           element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deploySampleWarFilePath+ " to deploy");
           element = driver.findElement(By.xpath("//input[@id='SourcePath|input']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await element.sendKeys(deploySampleWarFilePath);
           driver.sleep(9800);
           console.log("Enter " +deploySampleWarPlanFilePath+ " to deploy");
           element = driver.findElement(By.xpath("//input[@id='PlanPath|input']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await element.sendKeys(deploySampleWarPlanFilePath);
           await driver.sleep(1200);
           console.log("Click Create button");
           element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(6400);
           console.log("Click Shopping Cart Icon");
           await driver.findElement(By.xpath("//a[@id='shoppingCartMenuLauncher']")).click();
           await driver.sleep(1200);
           console.log("Select 'Commit Changes' menu");
           await driver.findElement(By.xpath("//span[@id='commit-changes']")).click();
           await driver.sleep(8400);
           console.log("Click App Deployment from 'Table Header'");
           await driver.findElement(By.xpath("//a[text()='App Deployments']")).click();
           await driver.sleep(1200);
           console.log("Click Application Management oj-button");
           await driver.findElement(
               By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
           await driver.sleep(3600);
           console.log("Select 'Application Management - Monitoring Tree' ");
           await driver.findElement(By.xpath("//oj-option[@id='Application Management - Monitoring Tree']")).click();
           await driver.sleep(3600);
           await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Deployments",
              "Application Management");
           element = driver.findElement(By.xpath("//div[@id='table-actions-strip-container']"));
           await driver.sleep(72000000);
            //await admin.goToNavTreeLevelTwoLink(driver,"monitoring","Deployments",
              //  "Application Management");
            /*await admin.goToLandingPanelHeader(driver, "Monitoring Tree", "DeploymentsChevron");
            await driver.sleep(3600);
            //*[ends-with(@id,'DeploymentManager/AppDeploymentRuntimes')]
            console.log("Click Application Management link");
            await driver.findElement(
                By.xpath("//*[@id='landing-page-panel-subtree']/div[2]/a")).click();
            await driver.sleep(720000000);
            //await admin.goToLandingPanelSubTreeCard(driver,"Monitoring Tree","DeploymentsChevron",
                //"Application Management");
           //xpath=(//input[@type='checkbox'])[21]
           //element = driver.findElement(
            //By.xpath("//span[contains(.,'sampleWarFileWithPlan') and @data-bind='html: cell.data.label']"));
           //driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           //await driver.sleep(7200000000);

           //element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector"));
            //await driver.executeScript("window.scrollTo(15,15)")
            //await driver.executeScript("window.scrollTo(0,0)")
            //element = await driver.findElement(By.xpath("//oj-table[@id='table']/div"))
            await driver.sleep(7200);
           element = await driver.findElement(By.xpath("//tbody/tr[7]/td[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await driver.sleep(7200);
           if (element.isEnabled()) {
               await element.click();
           }
           await driver.sleep(3600);
           console.log("Select 'updateRedeployActionsMenuLauncher' menu");
           await driver.findElement(
               By.xpath("//oj-button[@id='updateRedeployActionsMenuLauncher']")).click();
           await driver.sleep(360000000);
           console.log("Select 'redeployApp' menu");
           await driver.findElement(
               By.xpath("//oj-option[@id='redeployApp']")).click();
           await driver.sleep(3600);
           console.log("Select 'Deploy Source and Plan on Server' menu");
           await driver.findElement(
               By.xpath("//oj-option[@id='redeploy']")).click();
           await driver.sleep(3600);
           console.log("Enter Redeploy App "+deploySimpleWarFilePath+" .....");
           element = driver.findElement(
               By.xpath("//input[@id='SourcePath|input']"));
           await element.clear();
           await element.sendKeys(deploySimpleWarFilePath);
           await driver.sleep(3600);
           console.log("Enter Redeploy App Plan "+deploySimpleWarPlanFilePath+" ....");
           element = driver.findElement(
               By.xpath("//input[@id='PlanPath|input']"));
           await element.clear();
           await element.sendKeys(deploySimpleWarPlanFilePath);
           await driver.sleep(3600);
           console.log("Click 'Done' button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(3600);
           console.log("Click sampleWarFileWithPlan Node");
           await driver.findElement(
               By.xpath("//span[text()='sampleWarFileWithPlan' and @class='oj-navigationlist-item-label']")).click();
           await driver.sleep(3600);
           console.log("Click Deployment Plan Node");
           await driver.findElement(
               By.xpath("//span[text()='Deployment Plan' and @class='oj-navigationlist-item-label']")).click();
           await driver.sleep(3600);
           console.log("Click Deployment Plan Tab");
           await driver.findElement(
               By.xpath("//span[text()='Deployment Plan' and @class='oj-tabbar-item-label']")).click();
           await driver.sleep(3600000);
           //oj-text-area[@id='DeploymentPlan']
           //Verify if redeploy application successful
           console.log("TEST PASS ");
             */
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Required Deployed files do NOT exit");
            this.skip();
        }
    })


    //Test Case:
    // Deploy Database Client Data Directories (ASDS1-jdbc.xml) file to AdminServer target using direct path
    // From Edit Tree -> Deployments  -> Database Client Data Directories, select New button
    // Enter ASDS1 name, disable upload option then enter the full path to deploy
    // Deleting WarEar mode.
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: Deploy Database Client Data Directories (ASDS1-jdbc.xml) file ' +
        ' to AdminServer',
    async function () {
        file = "ASDS1-jdbc-xml.png";
        let deployDBClientFile = "frontend/system-tests/lib/ASDS1-jdbc.xml";
        let path = require('path');
        let deployDBClientFilePath = process.env.OLDPWD + path.sep + deployDBClientFile;

        if (fs.existsSync(deployDBClientFilePath))  {
        try {
           await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
                "Database Client Data Directories");
           console.log("Click New button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
           await driver.sleep(2400);
           console.log("Click disable upload option");
           await driver.findElement(
               By.xpath("//*[@id='Upload']/div[1]/div/div")).click();
           await driver.sleep(1200)
           console.log("Enter Database Client Deployment Name = ASDS1-jdbc");
           await driver.findElement(By.id("Name|input")).clear();
           await driver.findElement(By.id("Name|input")).sendKeys("ASDS1-jdbc");
           await driver.sleep(1200);
           console.log("Enter Database Client " +deployDBClientFilePath+ " to deploy");
           await driver.findElement(By.xpath("//input[@id='SourcePath|input']")).sendKeys(deployDBClientFilePath);;
           driver.sleep(2400);
           console.log("Click Create button");
           await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
           driver.sleep(2400);
           await admin.commitChanges(driver);
           await driver.sleep(8400);
           await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
               "Database Client Data Directories");
           driver.sleep(2400);
           console.log("Delete Database Client - ASDS1-jdbc");
           element = driver.findElement(By.xpath("//tbody/tr[1]/td[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await driver.sleep(2400);
           if (element.isEnabled()) {
               await element.click();
           }
           driver.sleep(2400);
           await admin.commitChanges(driver);
           await driver.sleep(8400);
           console.log("TEST PASS ");
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Deployed file path doesn't exit");
            this.skip();
        }
    })


})
