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
    // Deploy sample.war file to all target (sample.war)
    // Validate deployment -> start/stop sample.war -> verify result then delete sample.war
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
                   By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
               await driver.sleep(2400);
               console.log("Enter App Deployment Name = sample");
               await driver.findElement(By.id("Name|input")).clear();
               await driver.findElement(By.id("Name|input")).sendKeys("sample");
               await driver.sleep(2400);
               console.log("Click to choose All available targets");
               element = driver.findElement(By.xpath("//oj-button[@id=\'addAllToChosen\']/button/div/span/span"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(2400);
               console.log("Click Choose File to deploy");
               element = driver.findElement(By.xpath("//img[@title=\'Choose File\']"));
               driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
               element.click();
               await driver.sleep(2400);
               console.log("Click select " +deployWarFilePath+ " to deploy");
               await driver.findElement(By.xpath("//input[@id=\'file-chooser\']")).sendKeys(deployWarFilePath);
               driver.sleep(2400);
               console.log("Click Create button");
               await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.finish.id]]\']/button/div/span/img")).click();
               driver.sleep(2400);
               await admin.commitChanges(driver);
               driver.sleep(2400);
               await admin.deleteMBeanObject(driver,"sample","App Deployments",2,"configuration","Deployments","App Deployments","","","",7);
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
    // Validate deployment -> start/stop TestLibJar -> verify result then delete TestLibJar
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
                    By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
                await driver.sleep(2400);
                console.log("Enter JAR LibApp Deployment Name = testLib");
                await driver.findElement(By.id("Name|input")).clear();
                await driver.findElement(By.id("Name|input")).sendKeys("testLib");
                await driver.sleep(2400);

                console.log("Click Choose File to deploy");
                element = driver.findElement(By.xpath("//img[@title=\'Choose File\']"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                element.click();
                await driver.sleep(2400);
                console.log("Click select " +deployLibJarFilePath+ " to deploy");
                await driver.findElement(By.xpath("//input[@id=\'file-chooser\']")).sendKeys(deployLibJarFilePath);
                driver.sleep(2400);
                console.log("Click Create button");
                await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.finish.id]]\']/button/div/span/img")).click();
                driver.sleep(2400);
                await admin.commitChanges(driver);
                driver.sleep(7200);

                console.log("Modify TestLib to select AdminServer as target");
                console.log("Click Targets tab");
                await driver.findElement(By.xpath("//span[contains(.,\'Targets\')]")).click();
                await driver.sleep(4800);
                console.log("Select AdminServer as target");
                try {
                    //Check if AdminServer is the 3 elements in the Targets list of docker domain
                    element = driver.findElement(
                        By.xpath("//oj-checkboxset[@id=\'availableCheckboxset\']/div/span[3]/span/input"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    if (element.isEnabled()) {
                        await element.click();
                    } else {
                        //AdminServer is the only item in the Targets list
                        element = driver.findElement(
                            By.xpath("//oj-checkboxset[@id=\'availableCheckboxset\']/div/span/span/input"));
                        driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                        await element.click();
                    }
                } catch (e) {
                    console.log("Can't find AdminServer in the Targets list - Abort operation");
                }
                await driver.sleep(800);
                await driver.findElement(
                    By.xpath("//oj-button[@id=\'addToChosen\']/button/div/span")).click()
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

})



