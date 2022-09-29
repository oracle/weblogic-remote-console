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
            switch (user) {
                case 'deployerUser':
                    groupId = "SecurityUsersUserConfigGroupsPortletavailablegroups4";
                    break;
                case 'monitorUser':
                    groupId = "SecurityUsersUserConfigGroupsPortletavailablegroups5";
                    break;
                case 'operatorUser':
                    groupId = "SecurityUsersUserConfigGroupsPortletavailablegroups6";
                    break;
                default:
                    console.log("Problem: user doesn't belong to the group [Deployer, Operator or Monitor] Users!");
                    break;
            }
            console.log("Click Security Realm Link");
            await driver.findElement(By.xpath("//a[@id=\'linkSecurityRealmRealmTablePage\']")).click()
            await driver.sleep(1200);
            console.log("Click at myrealm");
            await driver.findElement(By.linkText("myrealm")).click();
            await driver.sleep(1200);
            console.log("Click Users and Groups tab");
            await driver.findElement(By.xpath("//*[@id=\'SecurityRealmGeneralBook\']/div/div/ul/li[2]/a/span/span")).click()
            await driver.sleep(1200);
            console.log("Click New button");
            await driver.findElement(By.name("New")).click();
            await driver.sleep(1200);
            console.log("Enter name = " + user);
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.name")).click();
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.name")).sendKeys(user);
            await driver.sleep(1200);
            console.log("Enter Description for " + user + " User");
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.description")).click()
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.description")).sendKeys("User: "+user);
            await driver.sleep(1200);
            console.log("Enter password = " + password);
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.password")).click();
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.password")).sendKeys(password);
            await driver.sleep(1200);
            console.log("Enter confirm password = " + password);
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.confirmPassword")).click()
            await driver.findElement(By.id("SecurityUsersCreateUserPortletuserTable.confirmPassword")).sendKeys(password);

            console.log("Click Ok button");
            await driver.findElement(By.css(".lowerButtonBar .formButton:nth-child(1)")).click();
            await driver.sleep(1200);
            console.log("Click at " + user);
            await driver.findElement(By.linkText(user)).click();
            await driver.sleep(1200);
            console.log("Click at Group tab");
            await driver.findElement(By.xpath("//div[@id=\'SecurityUsersUserConfigBook\']/div/div/ul/li[4]/a/span/span")).click();
            await driver.sleep(1200);
            console.log("Select user Group to add ");
            await driver.findElement(By.id(groupId)).click();
            await driver.sleep(1200);
            console.log("Click at > symbol ");
            await driver.findElement(By.id("SecurityUsersUserConfigGroupsPortletuserGeneralFormgroupsAdd")).click()
            await driver.sleep(1200);
            console.log("Click Save button");
            await driver.findElement(By.xpath("(//button[@name=\'Save\'])[2]")).click();
            await driver.sleep(4800);
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
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//span[@class='cfe-toolbar-button-label' and text()='Home']")).click();
            console.log("Click Config View Tree");
            await driver.findElement(By.xpath("//div[@id=\'view\']/img")).click();
            await driver.sleep(1200);
            console.log("Click Environment Navtree link");
            await driver.findElement(By.xpath("//span[contains(.,\'Environment\')]")).click();
            await driver.sleep(1200);
            console.log("Click Servers Navtree link");
            await driver.findElement(By.xpath("//span[contains(.,\'Servers\')]")).click();
            await driver.sleep(1200);
        },

        goToAppDeploymentPage: async function(driver, landingImageName) {
            console.log("Click Home Image link");
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//span[@class='cfe-toolbar-button-label' and text()='Home']")).click();
            //await driver.findElement(By.xpath("//span[@id=\'home_oj50|text\']/span")).click();
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

        testUserPrivilegeRole: async function (driver, userName, navImageMenuLink) {
            await driver.manage().setTimeouts({implicit: 7200})
            await this.createConnectionProvider(driver,userName);
            switch (userName.toString()) {
                case 'monitoruser':
                    //Validate: Monitor user won't see Edit Tree
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
                    console.log("Select Status Monitoring Tree");
                    await driver.findElement(By.xpath("//span[contains(.,\'Runtime Data - Monitoring Tree\')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt=\'start\']")).then((elements) => {
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
                    console.log("Select Status Monitoring Tree");
                    await driver.findElement(By.xpath("//span[contains(.,\'Runtime Data - Monitoring Tree\')]")).click();
                    await driver.sleep(1200);
                    driver.findElements(By.xpath("//img[@alt=\'Start\']")).then((elements) => {
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
                    console.log("Click New button");
                    await driver.findElement(
                        By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
                    await driver.sleep(2400);
                    console.log("Enter App Deployment Name = sample-2");
                    await driver.findElement(By.id("Name|input")).clear();
                    await driver.findElement(By.id("Name|input")).sendKeys("sample-2");
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