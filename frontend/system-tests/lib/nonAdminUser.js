// This file provides function for deploy, monitor, operator users
// To access their Roles and Privileges
'use strict';

const {By, until, webdriver} = require("selenium-webdriver");

const Admin = require('./admin');
const assert = require('assert');
const adminUrl = require('../lib/admin').adminUrl;
const remoteUrl = require('../lib/admin').remoteUrl;
const user = require('../lib/admin').credential.userName;
const password = require('../lib/admin').credential.password;
const domSSLProductDomain = require('../lib/admin').domSSLProductDomain;
const fs = require('fs')

module.exports = function (driver, file) {
    this.driver = driver;
    let element;
    let admin;
    admin = new Admin(driver, file);
    let groupId;
    let remoteConsoleUrl = remoteUrl + '/console';

    return {
        // Login OLD WLS console
        //
        loginWLSConsole: async function (driver) {
            console.log("Launch WLS Console Page");
            await driver.get(remoteConsoleUrl);
            await driver.sleep(8400);
            console.log("Enter User Name = " + user);
            await driver.findElement(By.id("j_username")).sendKeys(user);
            await driver.sleep(1200);
            console.log("Enter Password = " + password);
            await driver.findElement(By.id("j_password")).sendKeys(password);
            await driver.sleep(1200);
            console.log("Click OK button");
            await driver.findElement(By.css(".formButton")).click();
            await driver.sleep(4800);
        },

        //Create users+group role from OLD Admin console page
        createUser: async function (driver, user) {
            let groupName = "AdminChannelUsers"; //Administrator Users Group
            switch (user) {
                case 'deployerUser':
                    groupName = "Deployers";
                    break;
                case 'monitorUser':
                    groupName = "Monitors";
                    break;
                case 'operatorUser':
                    groupName = "Operators";
                    break;
                default:
                    console.log("Problem: user doesn't belong to the group [Deployers, Operators or Monitors] Users!");
                    break;
            }
            console.log("Click New button");
            await driver.findElement(By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span[1]/img")).click();
            await driver.sleep(1200);
            console.log("Enter name = " + user);
            await driver.findElement(By.xpath("//input[@id='Name|input']")).clear();
            await driver.findElement(By.xpath("//input[@id='Name|input']")).sendKeys(user);
            await driver.sleep(1200);
            console.log("Enter Description for " + user + " User");
            await driver.findElement(By.xpath("//input[@id='Description|input']")).clear();
            await driver.findElement(By.xpath("//input[@id='Description|input']")).sendKeys("Test User: "+user);
            await driver.sleep(1200);
            console.log("Enter password = " + password);
            await driver.findElement(By.xpath("//input[@id='Password|input']")).clear();
            await driver.findElement(By.xpath("//input[@id='Password|input']")).sendKeys(password);
            await driver.sleep(1200);
            console.log("Click Create button");
            await driver.findElement(
                By.xpath("//oj-button[@id='[[i18n.buttons.save.id]]']/button/div/span[1]/img")).click();
            await driver.sleep(1200);
            console.log("Click Membership tab ");
            await driver.findElement(By.xpath("//span[text()='Membership']")).click();
            await driver.sleep(1200);
            console.log("Check Deployers parent group option ");
            element = driver.findElement(By.xpath("//oj-option[text()=\'"+groupName+"\']"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Check Add Chosen button ");
            await driver.findElement(
                By.xpath("//oj-button[@id='addToChosen']/button/div/span[1]/span")).click();
            await driver.sleep(1200);
            console.log("Click Save button ");
            await driver.findElement(
                By.xpath("//span[text()='Save' and @class='button-label']")).click();
            await driver.sleep(4800);
        },

        deleteUser: async function(driver, user) {
            console.log("Click to select Column 1, Row 3 for "+user+" in the oj-table-body");
            element = driver.findElement(By.xpath("//tbody/tr[3]/td[1]/oj-selector/span/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Click Delete button ");
            await driver.findElement(By.xpath("//oj-button[@id='delete']")).click();
            await driver.sleep(1200);
        },

        createConnectionProvider: async function(driver, userName) {
            console.log("Launch remote new console page. ");
            await driver.get(adminUrl);
            await driver.sleep(4800);
            await admin.startupDialogTask(driver);
            await admin.addDomainConnection(driver);
            await admin.login(driver, userName, userName, password, remoteUrl);
            await driver.sleep(1200);
        },

        goToServerPage: async function (driver) {
            console.log("Click Home Image link");
            await driver.sleep(2400);
            await driver.findElement(By.xpath("//*[starts-with(@id,'home')]")).click();
            await driver.sleep(800);
            console.log("Click Config View Tree");
            await driver.findElement(By.xpath("//div[@id='view-gallery-panel-card']")).click();
            await driver.sleep(2400);
            console.log("Click Environment Navtree link");
            await driver.findElement(By.xpath("//span[contains(.,'Environment')]")).click();
            await driver.sleep(2400);
            console.log("Click Servers Navtree link");
            await driver.findElement(
                By.xpath("//span[@class='oj-navigationlist-item-label' and text()='Servers']")).click();
            await driver.sleep(1200);
        },

        goToAppDeploymentPage: async function(driver, landingImageName) {
            console.log("Click Home Image link");
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//span[@class='cfe-toolbar-button-label' and text()='Home']")).click();
            console.log("Click Config View Tree");
            await driver.findElement(By.xpath("//img[@alt=\'"+landingImageName+"\']")).click();
            await driver.sleep(1200);
            console.log("Click Deployments Navtree link");
            await driver.findElement(By.xpath("//span[contains(.,\'Deployments\')]")).click();
            await driver.sleep(1200);
            console.log("Click Click App Deployments Navtree link");
            await driver.findElement(By.xpath("//span[contains(.,\'App Deployments\')]")).click();
            await driver.sleep(1200);
        },

        testUserPrivilegeRole: async function (driver, userName, navImageMenuLink,nonSSL=true) {
            await driver.manage().setTimeouts({implicit: 72000})
            if (nonSSL) {
                console.log("Test testUserPrivilegeRole run with Development Server");
                await this.createConnectionProvider(driver,userName);
            }
            else {
                console.log("Test testUserPrivilegeRole run with SSL Production Server");
                await admin.connectSSLAdminServer(driver,"wdtDomainProject.json",
                    domSSLProductDomain,userName,password);
            }
            await driver.sleep(1200);
            switch (userName.toString()) {
                case 'monitoruser':
                case 'monitorUser':
                    //Validate: Monitor user won't see Edit Tree
                    console.log("Click " +navImageMenuLink+ " .");
                    driver.findElements(By.xpath("//img[@alt=\'" + navImageMenuLink + "\']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: " + userName + " see " + navImageMenuLink + " - Validation FAIL");
                        } else {
                            console.log("User: " + userName + " doesn't see " + navImageMenuLink + " - Validation SUCCEED");
                            return true;
                        }
                    });
                    //Validate: Monitor user won't see action buttons to start and stop applications
                    await this.goToAppDeploymentPage(driver,"Configuration View Tree");
                    console.log("Click App Deployments drop down menu");
                    await driver.findElement(By.xpath("//oj-menu-button/button/div/span[2]")).click();
                    await driver.sleep(1200);
                    console.log("Select Application Runtime Data - Monitoring Tree");
                    await driver.findElement(
                        By.xpath("//span[contains(.,'Application Runtime Data - Monitoring Tree')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt='start']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: "+ userName+ " must not see SSL restart server button - Validation FAIL");
                        } else {
                            console.log("User: " +userName+ " doesn't see SSL restart server button - Validation SUCCEED");
                            return true;
                        }
                    });
                    //Validate Monitor users won't see any action buttons to start/stop Servers
                    await this.goToServerPage(driver);
                    console.log("Click Servers drop down menu");
                    await driver.findElement(By.xpath("//oj-menu-button/button/div/span[2]")).click();
                    await driver.sleep(1200);
                    console.log("Select Server States Dashboard - Monitoring Tree");
                    await driver.findElement(
                        By.xpath("//span[contains(.,'Server States Dashboard - Monitoring Tree')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt='Start']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: " +userName+ " must not see start/stop server button - Validation FAIL");
                        } else {
                            console.log("User: " +userName+ " doesn't see start/stop server button - Validation SUCCEED");
                            return true;
                        }
                    });
                    break;
                case 'operatoruser':
                case 'operatorUser':
                    //Validate: Operator user won't see Edit Tree
                    driver.findElements(By.xpath("//img[@alt=\'" + navImageMenuLink + "\']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: " + userName + " see " + navImageMenuLink + " - Validation FAIL");
                        } else {
                            console.log("User: " + userName + " doesn't see " + navImageMenuLink + " - Validation SUCCEED");
                            return true;
                        }
                    });
                    //Validate Operators user won't see action buttons to restart ssl on a server
                    await this.goToServerPage(driver);
                    console.log("Click Servers drop down menu");
                    await driver.findElement(By.xpath("//oj-menu-button/button/div/span[2]")).click();
                    await driver.sleep(1200);
                    console.log("Select Status Monitoring Tree");
                    await driver.findElement(By.xpath("//span[contains(.,\'Runtime Data - Monitoring Tree\')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt=\'restartSSL\']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: "+userName+" must not see SSL restart server button - Validation FAIL");
                        } else {
                            console.log("User: "+userName+" doesn't see SSL restart server button - Validation SUCCEED");
                            return true;
                        }
                    });
                    break;
                case 'deployeruser':
                case 'deployerUser':
                    //Validate Deployer users won't see any action buttons to start/stop Servers
                    await this.goToServerPage(driver);
                    console.log("Click Servers dop down menu");
                    await driver.findElement(By.xpath("//oj-menu-button/button/div/span[2]")).click();
                    await driver.sleep(1200);
                    console.log("Select Status Monitoring Tree");
                    await driver.findElement(By.xpath("//span[contains(.,\'Runtime Data - Monitoring Tree\')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt=\'Start\']")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: "+userName+" see start/stop Servers button - Validation FAIL");
                        } else {
                            console.log("User: "+userName+" doesn't see start/stop server button - Validation SUCCEED");
                            return true;
                        }
                    });
                    //Validate Deployer user won't see New button at Servers/Cluster/Machine pages
                    await this.goToServerPage(driver);
                    driver.findElements(By.xpath("//*[@id=\"[[i18n.buttons.new.id]]\"]/button/div/span[1]/img")).then((elements) => {
                        if (elements.length > 0) {
                            console.log("Test FAIL");
                            throw new Error("User: "+userName+ " see New button from Server Page - Validation FAIL");
                        } else {
                            console.log("User: "+userName+" doesn't see New button from Server Page - Validation SUCCEED");
                            return true;
                        }
                    });
                    break;
                default:
                    console.log('Wrong User name was entered!');
                    break;
            }
        },

        deployApplication: async function(driver,userName) {
            let file = "sampleWAR-2.png";
            let sampleWarFile = "frontend/system-tests/lib/sample.war";
            let path = require('path');
            let deployWarFilePath = process.env.OLDPWD + path.sep + sampleWarFile;

            if (fs.existsSync(deployWarFilePath) ) {
                try {
                    await this.createConnectionProvider(driver,userName);
                    await this.goToAppDeploymentPage(driver, "Edit Tree");
                    await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree", "DeploymentsChevron",
                        "App Deployments");
                    driver.sleep(2400);
                    console.log("Click New button");
                    await driver.findElement(
                        By.xpath("//oj-button[@id='[[i18n.buttons.new.id]]']/button/div/span/img")).click();
                    await driver.sleep(2400);
                    console.log("Enter App Deployment Name = sample-2");
                    await driver.findElement(By.id("Name|input")).clear();
                    await driver.findElement(By.id("Name|input")).sendKeys("sample-2");
                    await driver.sleep(2400);
                    console.log("Click to choose All available targets");
                    element = driver.findElement(By.xpath("//oj-button[@id='addAllToChosen']/button/div/span/span"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    element.click();
                    await driver.sleep(2400);
                    console.log("Click Choose File to deploy");
                    element = driver.findElement(By.xpath("//img[@title='Choose File']"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    element.click();
                    await driver.sleep(2400);
                    console.log("Click select " +deployWarFilePath+ " to deploy");
                    await driver.findElement(By.xpath("//input[@id='file-chooser-form']")).sendKeys(deployWarFilePath);
                    driver.sleep(9600);
                    console.log("Click Create/Finish button");
                    await driver.findElement(
                        By.xpath("//oj-button[@id='[[i18n.buttons.finish.id]]']/button/div/span[1]/img")).click();
                    driver.sleep(2400);
                    console.log("Click Save button");
                    await driver.findElement(
                        By.xpath("//span[@class='button-label' and text()='Save']")).click();
                    await admin.discardChanges(driver);
                    driver.sleep(2400);
                    console.log("User: "+userName+" was able to deploy and start Application - Validation SUCCEED ");
                } catch (e) {
                    await admin.takeScreenshot(driver, file);
                    console.log(e.toString() + " Validation FAIL ");
                }
            } else {
                console.log("Deployed file path doesn't exit");
                this.skip();
            }
        },
    };
}