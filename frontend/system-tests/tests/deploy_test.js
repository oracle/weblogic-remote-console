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
describe.only('Test Suite: deploy_test , Redeploy and undeploy for Application and Library',
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
    //Deploy sample.war -> start/stop sample.war -> verify result
    //Scenario:
      //Start sample app: 'Servicing all requests',
      //Stop sample app: 'When work completes'
      //Validate sample app Intended State:as Active after started then Prepared
        //Deployed: Prepared
        //Started: Active
        //Stopped: Prepare
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: testDeployWarModule: deploy sample.war (State:Prepared),' +
        ' started (State:Active), stoped (State:Prepared) ', async function () {
        file = "testDeployWarModule.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

        console.log("-----Start to run testDeployWarModule test case....");
        console.log("---------------------------------------------------");
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
               element = driver.findElement(By.xpath("//*[@title='Choose File']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(9600);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
               await driver.sleep(9600);
               console.log("Click Create/Finish button");
               await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
               await driver.sleep(2400);
               await admin.commitChanges(driver);
               await driver.sleep(2400);

               console.log("Click Domain/AppDeployments tab");
               await driver.findElement(By.xpath("//*[contains(@id,'AppDeployments')]")).click();
               await driver.sleep(2400);
               console.log("Click 'breadcrumbs-container' down arrow");
               await driver.findElement(
                   By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
               await driver.sleep(2400);
               console.log("Select 'Application Management - Monitoring Tree' menu");
               await driver.findElement(
                   By.xpath("//*[@id='Application Management - Monitoring Tree']")).click();
               await driver.sleep(2400);
               console.log("Select sample module (row 7, column 1) from the deployed table");
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();

               //Verify if sample after deploy Intended State is Prepared
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample after deploy Intended State = Prepared")
               if (await element.getText() == 'Prepared') {
                   console.log("sample app after deployed Intended State = Prepared");
               }
               else {
                   console.log("sample app after deployed Intended State != Prepared");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }

               await driver.sleep(2400);
               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(3600);
               console.log("Select 'Servicing all requests' to start");
               await driver.findElement(By.xpath("//oj-option[@id='start']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Started and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(3600);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Active
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample after started Intended State = Active")
               if (await element.getText() == 'Active') {
                   console.log("sample after started Intended State = Active");
                   console.log("sample app is successfully started");
               }
               else {
                   console.log("sample app Intended State != Active");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
               await driver.sleep(6800);
               console.log("Click Stop button to select menu to stop deploy sample app");
               await driver.findElement(By.xpath("//*[starts-with(@id,'stopActionsMenuLauncher')]")).click();
               await driver.sleep(4800);
               console.log("Select 'When work completes' to stop");
               await  driver.findElement(By.xpath("//*[text()='When work completes']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Stopped and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Prepared
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample after stop Intended State != Prepared")
               if (await element.getText() == 'Prepared') {
                   console.log("sample app after stoped Intended State = Prepared");
                   console.log("sample app is successfully stop");
               }
               else {
                   console.log("sample app Intended State != Prepared");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
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
    //Deploy sample.war -> start/stop sample.war -> verify result
    //Scenario:
      //Start sample app: 'Servicing only administration requests',
      //Stop sample app: 'Force stop now'
      //Validate sample app Intended State:as Active after started then Prepared
        //Deployed: Prepared
        //Started: Admin
        //Stopped: Prepare
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: testWarModuleLifeCycle-1: deploy sample.war (State:Prepared),' +
        ' started (State:Active), stopped (State:Prepared) ', async function () {
        file = "testWarModuleLifeCycle-1.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

        console.log("-----Start to run testWarModuleLifeCycle-1 test case....");
        console.log("---------------------------------------------------------");
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
               element = driver.findElement(By.xpath("//*[@title='Choose File']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(9600);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
               await driver.sleep(9600);
               console.log("Click Create/Finish button");
               await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
               await driver.sleep(2400);
               await admin.commitChanges(driver);
               await driver.sleep(2400);

               console.log("Click Domain/AppDeployments tab");
               await driver.findElement(By.xpath("//*[contains(@id,'AppDeployments')]")).click();
               await driver.sleep(2400);
               console.log("Click 'breadcrumbs-container' down arrow");
               await driver.findElement(
                   By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
               await driver.sleep(2400);
               console.log("Select 'Application Management - Monitoring Tree' menu");
               await driver.findElement(
                   By.xpath("//*[@id='Application Management - Monitoring Tree']")).click();
               await driver.sleep(2400);
               console.log("Select sample module (row 7, column 1) from the deployed table");
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(4800);
               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing only administration requests' to start");
               await driver.findElement(By.xpath("//*[@id='startInAdminMode']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Started and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Active
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Active")
               if (await element.getText() == 'Admin') {
                   console.log("sample after started Intended State = Admin");
                   console.log("sample app is successfully started");
               }
               else {
                   console.log("sample app Intended State != Admin");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
               await driver.sleep(9800);
               console.log("Click Stop button to stop deploy sample app");
               await driver.findElement(By.xpath("//*[starts-with(@id,'stopActionsMenuLauncher')]")).click();
               await driver.sleep(4800);
               console.log("Select 'Force stop now' to stop");
               await  driver.findElement(By.xpath("//*[text()='Force stop now']")).click();
               await driver.sleep(9800);

               console.log("Click to close 'Stopped and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Prepared
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Prepared")
               if (await element.getText() == 'Prepared') {
                   console.log("sample app Intended State = Prepared");
                   console.log("sample app is successfully stop");
               }
               else {
                   console.log("sample app Intended State != Prepared");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
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
    //Deploy sample.war -> start/stop sample.war -> verify result
    //Scenario:
      //Start sample app: 'Servicing only administration requests',
      //Stop sample app: 'Servicing non-administration requests'
      //Validate sample app Intended State:as Active after started then Prepared
        //Deployed: Prepared
        //Started: Admin
        //Stopped: Admin
    //
    it('3. Test Category: GAT/Risk1\n \t Test Scenario: testWarModuleLifeCycle-2: deploy sample.war (State:Prepared),' +
        ' started (State:Active), stopped (State:Prepared) ', async function () {
        file = "testWarModuleLifeCycle-2.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

        console.log("-----Start to run testWarModuleLifeCycle-2 test case....");
        console.log("--------------------------------------------------------");
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
               element = driver.findElement(By.xpath("//*[@title='Choose File']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(9600);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
               await driver.sleep(9600);
               console.log("Click Create/Finish button");
               await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
               await driver.sleep(2400);
               await admin.commitChanges(driver);
               await driver.sleep(2400);

               console.log("Click Domain/AppDeployments tab");
               await driver.findElement(By.xpath("//*[contains(@id,'AppDeployments')]")).click();
               await driver.sleep(2400);
               console.log("Click 'breadcrumbs-container' down arrow");
               await driver.findElement(
                   By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
               await driver.sleep(2400);
               console.log("Select 'Application Management - Monitoring Tree' menu");
               await driver.findElement(
                   By.xpath("//*[@id='Application Management - Monitoring Tree']")).click();
               await driver.sleep(2400);
               console.log("Select sample module (row 7, column 1) from the deployed table");
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(4800);
               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing only administration requests' to start");
               await driver.findElement(By.xpath("//*[@id='startInAdminMode']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Started and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Active
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Admin")
               if (await element.getText() == 'Admin') {
                   console.log("sample after started Intended State = Admin");
                   console.log("sample app is successfully started");
               }
               else {
                   console.log("sample app Intended State != Admin");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
               await driver.sleep(9800);
               console.log("Click Stop button to stop deploy sample app");
               await driver.findElement(By.xpath("//*[starts-with(@id,'stopActionsMenuLauncher')]")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing non-administration requests' to stop");
               await  driver.findElement(By.xpath("//*[text()='Servicing non-administration requests']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Stopped and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Admin
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Prepared")
               if (await element.getText() == 'Admin') {
                   console.log("sample app Intended State = Admin");
                   console.log("sample app is successfully stop");
               }
               else {
                   console.log("sample app Intended State != Admin");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
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
    //Deploy sample.war -> start/stop sample.war -> verify result
    //Scenario:
      //Start sample app: 'Servicing all requests',
      //Stop sample app: 'Servicing non-administration requests'
      //Validate sample app Intended State:as Active after started then Prepared
        //Deployed: Prepared
        //Started: Active
        //Stopped: Admin
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: testWarModuleLifeCycle-3: deploy sample.war (State:Prepared),' +
        ' started (State:Active), stopped (State:Prepared) ', async function () {
        file = "testWarModuleLifeCycle-3.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

        console.log("-----Start to run testWarModuleLifeCycle-3 test case....");
        console.log("--------------------------------------------------------");
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
               element = driver.findElement(By.xpath("//*[@title='Choose File']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(9600);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
               await driver.sleep(9600);
               console.log("Click Create/Finish button");
               await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
               await driver.sleep(2400);
               await admin.commitChanges(driver);
               await driver.sleep(2400);

               console.log("Click Domain/AppDeployments tab");
               await driver.findElement(By.xpath("//*[contains(@id,'AppDeployments')]")).click();
               await driver.sleep(2400);
               console.log("Click 'breadcrumbs-container' down arrow");
               await driver.findElement(
                   By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
               await driver.sleep(2400);
               console.log("Select 'Application Management - Monitoring Tree' menu");
               await driver.findElement(
                   By.xpath("//*[@id='Application Management - Monitoring Tree']")).click();
               await driver.sleep(2400);
               console.log("Select sample module (row 7, column 1) from the deployed table");
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[1]/oj-selector"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(4800);
               console.log("Click Start button to select menu to start deploy sample app");
               await driver.findElement(By.xpath("//oj-button[@id='startActionsMenuLauncher']")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing all requests' to start");
               await  driver.findElement(By.xpath("//*[text()='Servicing all requests']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Started and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(4800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Active
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Active")
               if (await element.getText() == 'Active') {
                   console.log("sample after started Intended State = Active");
                   console.log("sample app is successfully started");
               }
               else {
                   console.log("sample app Intended State != Active");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
               await driver.sleep(9800);
               console.log("Click Stop button to stop deploy sample app");
               await driver.findElement(By.xpath("//*[starts-with(@id,'stopActionsMenuLauncher')]")).click();
               await driver.sleep(4800);
               console.log("Select 'Servicing non-administration requests' to stop");
               await  driver.findElement(By.xpath("//*[text()='Servicing non-administration requests']")).click();
               await driver.sleep(9800);
               console.log("Click to close 'Stopped and created task for application sample' dialog");
               driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
               await driver.sleep(6800);
               console.log("Move the lower deployment window section to location (550,450) pixel");
               await driver.executeScript("window.scrollBy(550,450)");
               //Verify if sample Intended State is Admin
               //sample Intended State is at colum:7, row:3
               element = driver.findElement(By.xpath("//table/tbody/tr[7]/td[3]"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               console.log("Verify if sample Intended State != Prepared")
               if (await element.getText() == 'Admin') {
                   console.log("sample app Intended State = Admin");
                   console.log("sample app is successfully stop");
               }
               else {
                   console.log("sample app Intended State != Admin");
                   console.log("Debug "+await element.getText());
                   console.log("TEST FAIL ");
               }
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
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: testDeployLibJarModule: deploy Library file: lib.jar',
        async function () {
            file = "TtestDeployLibJarModulepng";
            let libJarFile = "frontend/system-tests/lib/lib.jar";
            let path = require('path');
            let deployLibJarFilePath = process.env.OLDPWD + path.sep + libJarFile;

            console.log("-----Start to run testDeployLibJarModule test case....");
            console.log("------------------------------------------------------");
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
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: testDeployWarModuleWithPlan-1: deploy sample.war and samplePlan.xml files ' +
        'with Upload option',
    async function () {
        file = "testDeployWarModuleWithPlan-1.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deployWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;

        console.log("-----Start to run testDeployWarModuleWithPlan-1 test case....");
        console.log("-------------------------------------------------------------");
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
           element = await driver.findElement(By.xpath("//img[@title='Choose File']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deployWarFilePath+ " to deploy");
           await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
           driver.sleep(9600);
           console.log("Click Choose Plan Image");
           element = await driver.findElement(
               By.xpath("//oj-form-layout[@id='wlsform']/div/div[5]/div/div[2]/div/a/img"));
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
    it.skip('7. Test Category: GAT/Risk1\n \t Test Scenario: testDeployWarModuleWithPlan-2: deploy sample.war and samplePlan.xml files',
    async function () {
        file = "testDeployWarModuleWithPlan-2.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let path = require('path');
        let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deployWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;

        console.log("-----Start to run testDeployWarModuleWithPlan-2 test case....");
        console.log("-------------------------------------------------------------");
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

    //Test Case: Plan File and Plan Editor
    //Scenario:
       //From Monitoring Tree -> Application Management -> jms-xa-adp -> click "Create Plan"
       //Validate deployment jms-local-adpPlan.xml plan file is created successfully.
       //Edit jms-local-adpPlan.xml plan with Plan Editor by adding 'test123' property to the file
       //Verify 'test123' was added to jms-local-adpPlan.xml file successfully
    //Test when run with docker domain has to use PlanFile without path specified.
    it('8. Test Category: GAT/Risk1\n \t Test Scenario: testPlanAndPlanEditor-1: create jms-xa-adp-file Plan xml file, validate ' +
        'Plan Editor with WLDFHarvester_Enabled property',
    async function () {
        file = "testPlanAndPlanEditor-1.png";
        let jms_xa_adpPlanFile = "jms-local-adpPlan.xml";
        let jms_xa_adpPlanFilePath = process.env.OLDPWD + path.sep + "frontend/system-tests/lib/"+jms_xa_adpPlanFile;

        console.log("-----Start to run testPlanAndPlanEditor-1 test case....");
        console.log("--------------------------------------------------------");
        try {
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Application Management", "jms-local-adp");
            console.log("Click 'Create Plan' oj-button");
            await driver.sleep(7200);
            await driver.findElement(By.xpath("//span[starts-with(@id,'createPlan')]")).click();
            console.log("Enter ./" +jms_xa_adpPlanFile+ " Plan file at Create Plan dialog");
            await driver.sleep(7200);
            await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).sendKeys("./"+jms_xa_adpPlanFile);
            await driver.sleep(7200);
            console.log("Click Done button at Create Plan dialog");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
            await driver.sleep(9600);
            console.log("Click to close 'Created deployment plan and task to redeploy application jms-local-adp' dialog");
            driver.findElement(By.xpath("//oj-button[@title='Close'] ")).click();
            await driver.sleep(2400);
            await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Application Management", "jms-local-adp");
            await driver.sleep(7200);
            console.log("Click at Deployment Plan (Advanced) navTree node");
            element = driver.findElement(
                By.xpath("//*[text()='Deployment Plan (Advanced)']"));
            await driver.wait(until.elementIsVisible(element),888);
            await element.click();
            await driver.sleep(3600);
            console.log("Click at Variable Assignments tab");
            await driver.findElement(
                By.xpath("//*[text()='Variable Assignments']")).click();
            await driver.sleep(3600);
            console.log("Select (1,1) element - META-INF/weblogic-diagnostics.xml/jms-local-adp ");
            await driver.sleep(9400);
            await driver.findElement(
                By.xpath(" //table/tbody/tr[1]/td[1]/oj-selector")).click();
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

    //Test Case: Overwrite a local machine Plan file with newly deployed Application
    //Scenario:
        //Deploy EarWar.ear files to AdminServer target by upload path
        //From Monitoring -> Application Management  -> WarEar module page, select 'Create Plan' button
        //Validate WarEarPlan.xml created successful from viewing WarEarPlan editor
        // Deleting WarEar mode.
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: testCreatePlanAndPlanEditor-2: deploy WarEar.ear then create WarEarPlan.xml files' +
        ' validate Deployment Plan',
    async function () {
        file = "testCreatePlanAndPlanEditor-2.png";
        let deployWarEarFile = "WarEar.ear";
        let path = require('path');
        let deployWarEarFilePath = process.env.OLDPWD + path.sep + "frontend/system-tests/lib/"+deployWarEarFile;
        let WarEarPlanFile = "WarEarPlan.xml";

        console.log("-----Start to run testCreatePlanAndPlanEditor-2 test case....");
        console.log("-------------------------------------------------------------");
        if (fs.existsSync(deployWarEarFilePath))  {
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
           console.log("Click Choose File to deploy");
           element = driver.findElement(By.xpath("//*[@title='Choose File']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(9600);
           console.log("Click select " +deployWarEarFilePath+ " to deploy");
           await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployWarEarFilePath);
           await driver.sleep(9600);
           console.log("Click Create/Finish button");
           await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
           await driver.sleep(2400);
           await admin.commitChanges(driver);
           await driver.sleep(8400);
           console.log("Click breadcrumbs-container at WarEar");
           await driver.findElement(
           By.xpath("//*[@id='breadcrumbs-container']/ul/li[2]/oj-menu-button/button/div/span[2]")).click();
           await driver.sleep(3600);
           console.log("Click select 'Application Management - Monitoring Tree' menu");
           await driver.findElement(
               By.xpath("//*[@id='Application Management - Monitoring Tree']")).click();
           await driver.sleep(7200);
           console.log("Click 'Create Plan oj-button image");
           await driver.findElement(
               By.xpath("//oj-button[@id='createPlan']")).click();
           await driver.sleep(3600);
           console.log("Enter "+WarEarPlanFile+" at the PlanPath|Input text field");
           await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).clear();
           await driver.findElement(By.xpath("//input[@id='PlanPath|input']")).sendKeys(WarEarPlanFile);
           await driver.sleep(3600);
           console.log("Click Done button at Create Plan dialog");
           await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(8400);
           await admin.goToNavTreeLevelThreeLink(driver, "monitoring", "Deployments",
                "Application Management", "WarEar");
           await driver.sleep(7200);
           console.log("Click at Deployment Plan (Advanced) navTree node");
           element = driver.findElement(
                By.xpath("//*[text()='Deployment Plan (Advanced)']"));
           await driver.wait(until.elementIsVisible(element),8880);
           await element.click();
           await driver.sleep(3600);
           console.log("Click Deployment Plan tab");
           await driver.findElement(
               By.xpath("//*[@class='oj-tabbar-item-label' and text()='Deployment Plan']")).click();
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
               By.xpath("//*[text()='Application Management']")).click();
           await driver.sleep(3600);
           console.log("Click Application Management oj-button");
           await driver.findElement(
               By.xpath("//*[text()='Application Management' and @class='oj-button-text']")).click();
           await driver.sleep(3600);
           console.log("Select Application Configurations - Edit Tree");
           await driver.findElement(
               By.xpath("//*[text()='Application Configurations - Edit Tree']")).click();
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

    //Test Case: Redeployed with Deploy Source and Plan on Server (Upload local path)
    //Scenario:
      //Deploy sample.war and samplePlan.xml files to AdminServer target by direct path
      //Go to Monitoring -> Deployments -> Application Management
      //Select sampleWarFileWithPlan app from the Main (right) Deploy page app list
      //Select Update/Redeploy tab -> Redeployed -> Deploy Source and Plan on Server (direct path)
      //Enter Source: simple.war and Plan: simplePlan.xml files from $adminServerSampleUploadDir
      //Go back to Deployment Plan tab of sampleWarFileWithPlan app to validate if application-module is
      //'sample.war'  on the Redeploy Plan
    //

    it('10. Test Category: GAT/Risk1\n \t Test Scenario: testUpdateRedeploy-1: Redeployed with Deploy Source and Plan on Server (direct path) ' +
        'deploy sample.war and samplePlan.xml files and then Redeploy with simple.war and simplePlan.xml files',
    async function () {
        file = "testUpdateRedeploy-1.png";
        let testLibDir = "frontend/system-tests/lib/";
        let adminServerSampleUploadDir = "/domain.run/servers/AdminServer/upload/sampleWarFileWithPlan/";
        let sampleWarFile = "sample.war";
        let sampleWarPlanFile = "samplePlan.xml";
        let path = require('path');
        let deploySampleWarFilePath = process.env.OLDPWD +path.sep+ testLibDir + sampleWarFile;
        let deploySampleWarPlanFilePath = process.env.OLDPWD +path.sep+ testLibDir + sampleWarPlanFile;

        let redeploySampleUploadWarFilePath = adminServerSampleUploadDir + "app/" +sampleWarFile;
        let redeploySampleUploadWarPlanFilePath = adminServerSampleUploadDir + "plan/" +sampleWarPlanFile;

        console.log("-----Start to run testUpdateRedeploy-1 test case....");
        console.log("----------------------------------------------------");
        if (fs.existsSync(deploySampleWarFilePath) && fs.existsSync(deploySampleWarPlanFilePath))  {
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

           console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
           driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
           await driver.sleep(1200);
           console.log("Click to select Add > button");
           element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +sampleWarFile+ " to deploy");
           console.log("Click Choose File image");
           element = driver.findElement(By.xpath("//*[@title='Choose File']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deploySampleWarFilePath+ " to deploy");
           await driver.findElement(
               By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarFilePath);
           driver.sleep(9600);
           console.log("Click Choose Plan Image");
           element = await driver.findElement(
                By.xpath("//oj-form-layout[@id='wlsform']/div/div[5]/div/div[2]/div/a/img"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(7200);
           console.log("Enter " +deploySampleWarPlanFilePath+ " to deploy");
           await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarPlanFilePath);
           await driver.sleep(9600);
           console.log("Click Finish button");
           element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(9600);
           await admin.commitChanges(driver);
           await driver.sleep(6400);
           console.log("Click App Deployment from 'Table Header'");
           await driver.findElement(By.xpath("//a[text()='App Deployments']")).click();
           await driver.sleep(1200);
           console.log("Click Application Management oj-button");
           await driver.findElement(
               By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
           await driver.sleep(3600);
           console.log("Select 'Application Management - Monitoring Tree' ");
           await driver.findElement(By.xpath("//oj-option[@id='Application Management - Monitoring Tree']")).click();
           await driver.sleep(7200);

           console.log("Move the lower deployment window section to location (550,425) pixel");
           await driver.executeScript("window.scrollBy(550,450)");
           console.log("Click to select sampleWarFileWithPlan at 7th row and 1st column in the deployed app table list");
           element = await driver.findElement(
                By.xpath("//tr[7]/td[starts-with(@id,'table:')]/oj-selector/span/input"));
           await driver.sleep(7200);
           await element.click();
           await driver.sleep(3600);
           console.log("Select 'updateRedeployActionsMenuLauncher' menu");
           await driver.findElement(
               By.xpath("//oj-button[@id='updateRedeployActionsMenuLauncher']")).click();
           await driver.sleep(3600);
           console.log("Select 'ReDeploy Source and Plan on Server' menu");
           await driver.findElement(
               By.xpath("//oj-option[@id='redeploy']")).click();
           await driver.sleep(3600);
           console.log("Enter Redeploy App "+redeploySampleUploadWarFilePath+" .....");
           await driver.sleep(3600);
           element = driver.findElement(
               By.xpath("//input[@id='SourcePath|input']"));
           await element.clear();
           await element.sendKeys(redeploySampleUploadWarFilePath);
           await driver.sleep(3600);
           console.log("Enter Redeploy App Plan "+redeploySampleUploadWarPlanFilePath+" ....");
           element = driver.findElement(
               By.xpath("//input[@id='PlanPath|input']"));
           await element.clear();
           await element.sendKeys(redeploySampleUploadWarPlanFilePath);
           await driver.sleep(3600);
           console.log("Click 'Done' button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(8400);

           console.log("Click Reload Interval Icon");
           await driver.findElement(By.xpath("//img[@id='sync-icon']")).click();
           await driver.sleep(9600);
           console.log("Click sampleWarFileWithPlan Node");
           element = driver.findElement(
               By.xpath("//span[text()='sampleWarFileWithPlan' and @class='oj-navigationlist-item-label']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(7200);
           console.log("Click at Deployment Plan (Advanced) navTree node");
           element = driver.findElement(
               By.xpath("//*[text()='Deployment Plan (Advanced)']"));
           await driver.wait(until.elementIsVisible(element),8880);
           await element.click();
           await driver.sleep(7200);
           console.log("Click Deployment Plan Tab");
           await driver.findElement(
               By.xpath("//span[text()='Deployment Plan' and @class='oj-tabbar-item-label']")).click();
           await driver.sleep(7200);

           console.log("Check if Property <module-name>sample.war</module-name>");
           element = driver.findElement(By.xpath("//*[@id='DeploymentPlan']"));
           let deployPlanResult = await element.getAttribute("value");
           console.log("Deploy Plan xml file content = "+deployPlanResult);
           if (deployPlanResult.toLowerCase().includes('<module-name>sample.war</module-name>')) {
               console.log("Found module-name is sample.war");
               console.log("TEST PASS");
           }
           else {
               console.log("Property <module-name> is NOT sample.war");
               console.log("TEST FAIL");
           }
           await driver.sleep(3600);
           console.log("Verify if sampleWarFileWithPlan exit, then delete it");
           await admin.deleteMBeanObject(driver,"sampleWarFileWithPlan","App Deployments",2,"configuration",
		   "Deployments","App Deployments","","","",7);
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Required Deployed files do NOT exit");
            this.skip();
        }
    })

   //Test Case: Redeployed -> Deploy Source and Plan by Upload files from Local Machine
   //Scenario:
      //Deploy sample.war and samplePlan.xml files to AdminServer target by Upload Source and Plan files
      //Go to Monitoring -> Deployments -> Application Management
      //Select sampleWarFileWithPlan app from the Main (right) Deploy page app list
      //Select Update/Redeploy tab -> Redeployed -> Deploy Source and Plan by Upload files from Local Machine
      //Enter Source: simple.war and Plan: simplePlan.xml files
      //Go back to Deployment Plan tab of sampleWarFileWithPlan app to validate if 'test123' appeared on the Redeploy Plan
    //Test run with docker domain
    it('11. Test Category: GAT/Risk1\n \t Test Scenario: testUpdateRedeploy-2: Deploy Source and Plan by Upload files from Local Machine ' +
        'with deploy sample.war and samplePlan.xml files and then Redeploy with simple.war and simplePlan.xml files ' +
        'with upload method (local redeploy)',
    async function () {
        file = "testUpdateRedeploy-2.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let simpleWarFile = "frontend/system-tests/lib/simple.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let simpleWarPlanFile = "frontend/system-tests/lib/simplePlan.xml";
        let path = require('path');
        let deploySampleWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deploySimpleWarFilePath = process.env.OLDPWD + path.sep + simpleWarFile;
        let deploySampleWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;
        let deploySimpleWarPlanFilePath = process.env.OLDPWD + path.sep + simpleWarPlanFile;

        console.log("-----Start to run testUpdateRedeploy-2 test case....");
        console.log("----------------------------------------------------");
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

           console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
           driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
           await driver.sleep(1200);
           console.log("Click to select Add > button");
           element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +sampleWarFile+ " to deploy");
           console.log("Click Choose File image");
           element = driver.findElement(By.xpath("//*[@title='Choose File']"));
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deploySampleWarFilePath+ " to deploy");
           await driver.findElement(
               By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarFilePath);
           driver.sleep(9600);
           console.log("Click Choose Plan Image");
           element = driver.findElement(
               By.xpath("//oj-form-layout[@id='wlsform']/div/div[5]/div/div[2]/div/a[1]/img"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(7200);
           console.log("Enter " +deploySampleWarPlanFilePath+ " to deploy");
           await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarPlanFilePath);
           await driver.sleep(9600);
           console.log("Click Finish button");
           element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(9600);

           await admin.commitChanges(driver);
           await driver.sleep(6400);
           console.log("Click App Deployment from 'Table Header'");
           await driver.findElement(By.xpath("//*[text()='App Deployments']")).click();
           await driver.sleep(1200);
           console.log("Click Application Management oj-button");
           await driver.findElement(
               By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
           await driver.sleep(3600);
           console.log("Select 'Application Management - Monitoring Tree' ");
           await driver.findElement(By.xpath("//oj-option[@id='Application Management - Monitoring Tree']")).click();
           await driver.sleep(7200);

           console.log("Move the lower deployment window section to location (550,425) pixel");
           await driver.executeScript("window.scrollBy(550,450)");
           console.log("Click to select sampleWarFileWithPlan at 7th row and 1st column in the deployed app table list");
           element = await driver.findElement(
                By.xpath("//tr[7]/td[starts-with(@id,'table:')]/oj-selector/span/input"));
           await driver.sleep(7200);
           await element.click();
           await driver.sleep(3600);
           console.log("Select 'updateRedeployActionsMenuLauncher' menu");
           await driver.findElement(
               By.xpath("//oj-button[@id='updateRedeployActionsMenuLauncher']")).click();
           await driver.sleep(3600);
           console.log("Select 'Deploy Source and Plan on Server on Local Machine' menu");
           await driver.findElement(
               By.xpath("//oj-option[@id='uploadAndRedeploy']")).click();
           await driver.sleep(3600);
           console.log("Click Choose File Source Upload Menu");
           element = driver.findElement(By.xpath("//img[@title='Choose File']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(1200);
           console.log("Enter " +deploySimpleWarFilePath+ " to deploy");
           await driver.findElement(
               By.xpath("//input[@id='file-chooser-overlay-form-dialog']")).sendKeys(deploySimpleWarFilePath);
           driver.sleep(9600);
           console.log("Click Choose Plan File Upload Menu");
           element = driver.findElement(By.xpath("(//img[@title='Choose File'])[2]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(7200);
           console.log("Enter " +deploySimpleWarPlanFilePath+ " to deploy");
           await driver.findElement(By.xpath("//div[@id='overlay-container']/input")).sendKeys(deploySimpleWarPlanFilePath);
           await driver.sleep(9600);
           console.log("Click 'Done' button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(8400);
           console.log("Click Reload Interval Icon");
           await driver.findElement(By.xpath("//img[@id='sync-icon']")).click();
           await driver.sleep(9600);
           console.log("Click sampleWarFileWithPlan Node");
           element = driver.findElement(
               By.xpath("//span[text()='sampleWarFileWithPlan' and @class='oj-navigationlist-item-label']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await element.click();
           await driver.sleep(7200);
           console.log("Click at Deployment Plan (Advanced) navTree node");
           element = driver.findElement(
               By.xpath("//*[text()='Deployment Plan (Advanced)']"));
           await driver.wait(until.elementIsVisible(element),8880);
           await element.click();
           await driver.sleep(7200);
           console.log("Click Deployment Plan Tab");
           await driver.findElement(
               By.xpath("//span[text()='Deployment Plan' and @class='oj-tabbar-item-label']")).click();
           await driver.sleep(7200);
           console.log("Check if Property <module-name>simple.war</module-name>");
           element = driver.findElement(By.xpath("//*[@id='DeploymentPlan']"));
           let deployPlanResult = await element.getAttribute("value");
           console.log("Deploy simplePlan.xml file content = "+deployPlanResult);
           if (deployPlanResult.toLowerCase().includes('<module-name>simple.war</module-name>')) {
               console.log("Found module-name is simple.war");
               console.log("TEST PASS");
           }
           else {
               console.log("Property <module-name> is NOT simple.war");
               console.log("TEST FAIL");
           }
           console.log("Verify if sampleWarFileWithPlan exit, then delete it");
           await admin.deleteMBeanObject(driver,"sampleWarFileWithPlan","App Deployments",2,"configuration",
		   "Deployments","App Deployments","","","",7);
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Required Deployed files do NOT exit");
            this.skip();
        }
    })

   //Test Case: (Update with New Deployment Plan on Server)
   //Scenario:
    // Deploy sample.war and samplePlan.xml files to AdminServer target by Upload Source and Plan files
    // Go to Monitoring -> Deployments -> Application Management
    // Select sampleWarFileWithPlan app from the Main (right) Deploy page app list
    // Select Update/Redeploy tab -> Update with New Deployment Plan -> Deployment Plan on Server
    // Click Done button to accept defaultPathPlan
    // Go back to Deployment Plan tab of sampleWarFileWithPlan app to validate
    // if 'sample.war' is the module-name
    //Test can run with docker domain
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: testUpdateRedeploy-3: Update Deployment App with New Deployment Plan on Server',
    async function () {
        file = "testUpdateRedeploy-3.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let simpleWarPlanFile = "frontend/system-tests/lib/simplePlan.xml";
        let path = require('path');
        let deploySampleWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deploySampleWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;
        let deploySimpleWarPlanFilePath = process.env.OLDPWD + path.sep + simpleWarPlanFile;

        let defaultPathPlan = "/domain.run/servers/AdminServer/upload/sampleWarFileWithPlan/plan/samplePlan.xml"

        console.log("-----Start to run testUpdateRedeploy-3 test case....");
        console.log("----------------------------------------------------");
        if (fs.existsSync(deploySampleWarFilePath) && fs.existsSync(deploySampleWarPlanFilePath) &&
            fs.existsSync(deploySimpleWarPlanFilePath) )  {
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

            console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
            driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
            await driver.sleep(1200);
            console.log("Click to select Add > button");
            element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(1200);
            console.log("Enter " +sampleWarFile+ " to deploy");
            console.log("Click Choose File image");
            element = driver.findElement(By.xpath("//*[@title='Choose File']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(1200);
            console.log("Enter " +deploySampleWarFilePath+ " to deploy");
            await driver.findElement(
                By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarFilePath);
            driver.sleep(9600);
            console.log("Click Choose Plan Image");
            element = driver.findElement(
                By.xpath("//oj-form-layout[@id='wlsform']/div/div[5]/div/div[2]/div/a[1]/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(7200);
            console.log("Enter " +deploySampleWarPlanFilePath+ " to deploy");
            await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarPlanFilePath);
            await driver.sleep(9600);
            console.log("Click Finish button");
            element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(6400);
            await admin.commitChanges(driver);
            await driver.sleep(6400);
            console.log("Click App Deployment from 'Table Header'");
            await driver.findElement(By.xpath("//*[text()='App Deployments']")).click();
            await driver.sleep(1200);
            console.log("Click Application Management oj-button");
            await driver.findElement(
                By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
            await driver.sleep(3600);
            console.log("Select 'Application Management - Monitoring Tree' ");
            await driver.findElement(By.xpath("//oj-option[@id='Application Management - Monitoring Tree']")).click();
            await driver.sleep(7200);

            console.log("Move the lower deployment window section to location (550,425) pixel");
            await driver.executeScript("window.scrollBy(550,450)");
            console.log("Click to select sampleWarFileWithPlan at 7th row and 1st column in the deployed app table list");
            element = await driver.findElement(
                By.xpath("//tr[7]/td[starts-with(@id,'table:')]/oj-selector/span/input"));
            await driver.sleep(7200);
            await element.click();
            await driver.sleep(3600);

           console.log("Select 'updateRedeployActionsMenuLauncher' menu");
           await driver.findElement(
               By.xpath("//oj-button[@id='updateRedeployActionsMenuLauncher']")).click();
           await driver.sleep(3600);
           console.log("Select 'Update Deployment Plan on Server' menu");
           await driver.findElement(
               By.xpath("//oj-option[@id='update']")).click();
           await driver.sleep(3600);
           console.log("Click Done button to accept "+defaultPathPlan);
           await driver.findElement(
               By.xpath("//*[@id='[[i18n.buttons.save.id]]']")).click();
           await driver.sleep(3600);
           console.log("Click Reload Interval Icon");
           await driver.findElement(By.xpath("//img[@id='sync-icon']")).click();
           await driver.sleep(9600);
           console.log("Click sampleWarFileWithPlan Node");
           element = driver.findElement(
                By.xpath("//span[text()='sampleWarFileWithPlan' and @class='oj-navigationlist-item-label']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(7200);

            console.log("Click at Deployment Plan (Advanced) navTree node");
            element = driver.findElement(
                By.xpath("//*[text()='Deployment Plan (Advanced)']"));
            await driver.wait(until.elementIsVisible(element),8880);
            await element.click();
            await driver.sleep(7200);
            console.log("Click Deployment Plan Tab");
            await driver.findElement(
                By.xpath("//span[text()='Deployment Plan' and @class='oj-tabbar-item-label']")).click();
            await driver.sleep(7200);
            console.log("Check if Property <module-name>sample.war</module-name>");
            element = driver.findElement(By.xpath("//*[@id='DeploymentPlan']"));
            let deployPlanResult = await element.getAttribute("value");
            console.log("Deploy samplePlan.xml file content = "+deployPlanResult);
            if (deployPlanResult.toLowerCase().includes('<module-name>sample.war</module-name>')) {
                console.log("Found module-name is sample.war");
                console.log("TEST PASS");
            }
            else {
                console.log("Property <module-name> is NOT sample.war");
                console.log("TEST FAIL");
            }

           await driver.sleep(3600);
           console.log("Verify if sampleWarFileWithPlan exit, then delete it");
           await admin.deleteMBeanObject(driver,"sampleWarFileWithPlan","App Deployments",2,"configuration",
		   "Deployments","App Deployments","","","",7);
        } catch (e) {
           await admin.takeScreenshot(driver, file);
           console.log(e.toString() + " TEST FAIL");
        }
        } else {
            console.log("Required Deployed files do NOT exit");
            this.skip();
        }
    })

    //Test Case: (Update with New Deployment Plan on local machine)
    //Scenario:
        //Deploy sample.war and samplePlan.xml files to AdminServer target by upload Source and Plan files
        //Go to Monitoring -> Deployments -> Application Management
        //Select sampleWarFileWithPlan app from the Main (right) Deploy page app list
        //Select Update/Redeploy tab -> Update with New Deployment Plan -> Deployment Plan on Server
        //Select to upload local simplePlan.xml path
        //Go back to Deployment Plan tab of sampleWarFileWithPlan app to validate
        //if 'simple.war' is the current module-name
    //Test can run with docker domain
    it('14. Test Category: GAT/Risk1\n \t Test Scenario: testUpdateRedeploy-4: Update New Deployment Plan on local machine',
        async function () {
        file = "testUpdateRedeploy-4.png";
        let sampleWarFile = "frontend/system-tests/lib/sample.war";
        let sampleWarPlanFile = "frontend/system-tests/lib/samplePlan.xml";
        let simpleWarPlanFile = "frontend/system-tests/lib/simplePlan.xml";
        let path = require('path');
        let deploySampleWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;
        let deploySampleWarPlanFilePath = process.env.OLDPWD + path.sep + sampleWarPlanFile;
        let deploySimpleWarPlanFilePath = process.env.OLDPWD + path.sep + simpleWarPlanFile;

        console.log("-----Start to run testUpdateRedeploy-4 test case....");
        console.log("----------------------------------------------------");
        if (fs.existsSync(deploySampleWarFilePath) && fs.existsSync(deploySampleWarPlanFilePath) &&
            fs.existsSync(deploySimpleWarPlanFilePath) )  {
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

                console.log("Click to select AdminServer as target (3rd row in the oj-checkboxset list)");
                driver.findElement(By.xpath("//oj-checkboxset[@id='availableCheckboxset']/div[1]/span[3]")).click();
                await driver.sleep(1200);
                console.log("Click to select Add > button");
                element = driver.findElement(By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(1200);
                console.log("Enter " +sampleWarFile+ " to deploy");
                console.log("Click Choose File image");
                element = driver.findElement(By.xpath("//*[@title='Choose File']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(1200);
                console.log("Enter " +deploySampleWarFilePath+ " to deploy");
                await driver.findElement(
                    By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarFilePath);
                driver.sleep(9600);
                console.log("Click Choose Plan Image");
                element = driver.findElement(
                    By.xpath("//oj-form-layout[@id='wlsform']/div/div[5]/div/div[2]/div/a[1]/img"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(7200);
                console.log("Enter " +deploySampleWarPlanFilePath+ " to deploy");
                await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deploySampleWarPlanFilePath);
                await driver.sleep(9600);

                console.log("Click Finish button");
                element = driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(6400);
                await admin.commitChanges(driver);
                await driver.sleep(6400);
                console.log("Click App Deployment from 'Table Header'");
                await driver.findElement(By.xpath("//*[text()='App Deployments']")).click();
                await driver.sleep(4800);
                console.log("Click Application Management oj-button");
                await driver.findElement(
                    By.xpath("//*[@id='breadcrumbs-container']/ul/li/oj-menu-button/button/div/span[2]")).click();
                await driver.sleep(6400);
                console.log("Select 'Application Management - Monitoring Tree' ");
                await driver.findElement(By.xpath("//oj-option[@id='Application Management - Monitoring Tree']")).click();
                await driver.sleep(8400);
                console.log("Move the lower deployment window section to location (550,450) pixel");
                await driver.executeScript("window.scrollBy(550,450)");
                console.log("Click to select sampleWarFileWithPlan at 7th row and 1st column in the deployed app table list");
                element = await driver.findElement(
                    By.xpath("//tr[7]/td[starts-with(@id,'table:')]/oj-selector/span/input"));
                await driver.sleep(7200);
                await element.click();
                await driver.sleep(3600);
                console.log("Select 'updateRedeployActionsMenuLauncher' menu");
                await driver.findElement(
                    By.xpath("//oj-button[@id='updateRedeployActionsMenuLauncher']")).click();
                await driver.sleep(3600);
                console.log("Select 'Uppdate Deployment Plan on Local Machine' menu");
                await driver.findElement(
                    By.xpath("//oj-option[@id='uploadAndUpdate']")).click();
                await driver.sleep(3600);
                console.log("Click Choose Plan File Upload Menu");
                element = driver.findElement(By.xpath("(//img[@title='Choose File'])"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(7200);
                console.log("Enter " +deploySimpleWarPlanFilePath+ " to deploy");
                await driver.findElement(By.xpath("//div[@id='overlay-container']/input")).sendKeys(deploySimpleWarPlanFilePath);
                await driver.sleep(4800);
                console.log("Click 'Done' button");
                await driver.findElement(
                    By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']")).click();
                await driver.sleep(9600);

                console.log("Click sampleWarFileWithPlan Node");
                element = driver.findElement(
                    By.xpath("//span[text()='sampleWarFileWithPlan' and @class='oj-navigationlist-item-label']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
                await driver.sleep(7200);

                console.log("Click at Deployment Plan (Advanced) navTree node");
                element = driver.findElement(
                    By.xpath("//*[text()='Deployment Plan (Advanced)']"));
                await driver.wait(until.elementIsVisible(element),8880);
                await element.click();
                await driver.sleep(7200);
                console.log("Click Deployment Plan Tab");
                await driver.findElement(
                    By.xpath("//span[text()='Deployment Plan' and @class='oj-tabbar-item-label']")).click();
                await driver.sleep(7200);
                console.log("Check if Property <module-name>simple.war</module-name>");
                element = driver.findElement(By.xpath("//*[@id='DeploymentPlan']"));
                let deployPlanResult = await element.getAttribute("value");
                console.log("Deploy simplePlan.xml file content = "+deployPlanResult);
                if (deployPlanResult.toLowerCase().includes('<module-name>simple.war</module-name>')) {
                    console.log("Found module-name is sample.war");
                    console.log("TEST PASS");
                }
                else {
                    console.log("Property <module-name> is NOT simple.war");
                    console.log("TEST FAIL");
                }

                await driver.sleep(3600);
                console.log("Verify if sampleWarFileWithPlan exit, then delete it");
                await admin.deleteMBeanObject(driver,"sampleWarFileWithPlan","App Deployments",2,"configuration",
                    "Deployments","App Deployments","","","",7);
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
    it('15. Test Category: GAT/Risk1\n \t Test Scenario: testDeployDatabaseClient: Deploy Database Client Data Directories (ASDS1-jdbc.xml) file ' +
        ' to AdminServer',
    async function () {
        file = "testDeployDatabaseClient.png";
        let deployDBClientFile = "frontend/system-tests/lib/ASDS1-jdbc.xml";
        let path = require('path');
        let deployDBClientFilePath = process.env.OLDPWD + path.sep + deployDBClientFile;

        console.log("-----Start to run testDeployDatabaseClient test case....");
        console.log("--------------------------------------------------------");
        if (fs.existsSync(deployDBClientFilePath))  {
        try {
           await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
                "Database Client Data Directories");
           console.log("Click New button");
           await driver.findElement(
               By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
           await driver.sleep(2400);
           console.log("Enter Database Client Deployment Name = ASDS1-jdbc");
           await driver.findElement(By.id("Name|input")).clear();
           await driver.findElement(By.id("Name|input")).sendKeys("ASDS1-jdbc");
           await driver.sleep(1200);
           console.log("Enter Database Client " +deployDBClientFilePath+ " to deploy");
           console.log("Click Choose File to deploy");
           element = driver.findElement(By.xpath("//*[@title='Choose File']"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           element.click();
           await driver.sleep(9600);
           console.log("Click select " +deployDBClientFilePath+ " to deploy");
           await driver.findElement(By.xpath("//*[@id='file-chooser-form']")).sendKeys(deployDBClientFilePath);
           await driver.sleep(9600);
           console.log("Click Create/Finish button");
           await driver.findElement(By.xpath("//*[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
           await driver.sleep(8400);
           await admin.commitChanges(driver);
           await driver.sleep(8400);
           await admin.goToNavTreeLevelTwoLink(driver,"configuration","Deployments",
               "Database Client Data Directories");
           driver.sleep(2400);
           console.log("Delete Database Client - ASDS1-jdbc");
           element = driver.findElement(By.xpath("//*[starts-with(@id, 'table:-')]"));
           driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
           await driver.sleep(2400);
           if (element.isEnabled()) {
               await element.click();
           }
           driver.sleep(8400);
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
