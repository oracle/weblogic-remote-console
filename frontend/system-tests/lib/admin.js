// This file provide AdminServer properties and function to access to
// NavStrip menu elements: Toggle, Configuration, Monitoring and Control
'use strict';

const {By, Key, until, wait, webdriver} = require("selenium-webdriver");

//Browser type, Hostname and AdminServer Port
//const browserName = process.env.browser='chrome';
const browserName = process.env.browser='chrome-headless';
const hostName = process.env.hostname || 'localhost';
const adminPort = process.env.adminPort || '8012';
const remoteAdminPort =  process.env.consolePort || '7001';
const adminUrl = 'http://' + hostName + ':' + adminPort;
const remoteUrl = 'http://'+hostName+':'+remoteAdminPort;
const domConName = "1411LocalDomain";

if (process.argv.length < 8) {
    console.log("Incorrect syntax, missing parameters");
    console.log("Correct Syntax: 'mocha -g <suiteName_test> userName password remoteAdminUrl system/index.js' ")
    process.exit(1)
}

const userName = process.argv[4].split('=').pop() || 'weblogic';
const password = process.argv[5].split('=').pop() || process.env.CONSOLE_TEST_PASSWORD;
const remoteAdminUrl = process.argv[6].split('=').pop() || 'http://'+hostName+':'+remoteAdminPort;

module.exports = function (driver, file) {
    this.driver = driver;
    let element;
    const pageobjects = {
        linkselenium: By.id('header-container')
    };
    return {
        takeScreenshot: async function (driver, file) {
            const path = require('path');
            const snapFile = process.env.CONSOLE_WORK_DIR + path.sep + file;
            const util = require('util');
            const fs = require('fs');
            const writeFile = util.promisify(fs.writeFile);
            let image = driver.takeScreenshot().then(function (image, err) {
                writeFile(snapFile, image, 'base64')
            });
            console.log("Screenshot file is written to location: " + snapFile);
        },

        startupDialogTask: async function (driver,taskOption=1,action="Cancel") {
            let startUpDialogXPath = "//oj-dialog[@id=\'startupTaskChooserDialog\']/div";
            let chooseBtnXPath = "//oj-button[@id=\'dlgOkBtn16\']/button/div";
            let cancelBtnXPath = "//oj-button[@id=\'dlgCancelBtn16\']/button/div";
            let taskOptionXPath = "//oj-radioset[@id=\'startup-task-chooser-radioset\']/div/span["+taskOption+"]/span/input";
            element = driver.findElement(By.xpath(startUpDialogXPath));
            if (element.isEnabled()) {
                console.log("Click at Startup Task Dialog");
                await element.click();
                await driver.sleep(300);
            }

            if (action.toString() == "Cancel")  {
                console.log("Click Startup Task dialog Cancel button");
                await driver.findElement(By.xpath(cancelBtnXPath)).click();
                await driver.sleep(600);
            }
            else {
                switch(taskOption) {
                    case 1:
                        console.log("Select Add Admin Server Connection Provider... task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 2:
                        console.log("Select Add WDT Model File Provider... task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 3:
                        console.log("Select Add WDT Composite Model File Provider... task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 4:
                        console.log("Select Add Property List Provider... task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 5:
                        console.log("Select Create Provider for New WDT Model File... task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 6:
                        console.log("Create Provider for New Property List");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    case 7:
                        console.log("Select Import Project task");
                        await driver.findElement(By.xpath(taskOptionXPath)).click();
                        break;
                    default:
                        console.log("Click Startup Task dialog Cancel button");
                        await driver.findElement(By.xpath(cancelBtnXPath)).click();
                        await driver.sleep(600);
                        break;
                }
                await driver.sleep(600);
                console.log("Select Choose Button");
                await driver.findElement(By.xpath(chooseBtnXPath)).click();
                await driver.sleep(600);
            }
        },

        //login information from Login dialog
        login: async function (driver,domConName,userName,password,remoteAdminUrl) {
            await driver.sleep(300);
            element = driver.findElement(By.id("connection-name-field|input"));
            console.log("Enter Domain Connection Name = " + domConName);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(domConName);
            }
            await driver.sleep(300);
            element = driver.findElement(By.id("username-field|input"));
            console.log("Enter userName: " + userName);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(userName);
            }
            await driver.sleep(300);
            element = driver.findElement(By.id("password-field|input"));
            console.log("Enter Password: " + password);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(password);
            }
            await driver.sleep(300);
            element = driver.findElement(By.id("url-field|input"));
            console.log("Enter remoteAdminUrl: " + remoteAdminUrl);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(remoteAdminUrl);
            }
            await driver.sleep(300);
            console.log("Click show/hide password button");
            await driver.findElement(By.xpath("//*[@id=\'password-field\']/div[1]/span/a/span")).click();
            //Make sure OK button is enable
            await driver.sleep(300);
            console.log("Click OK button");
            element = driver.findElement(By.xpath("//span[@id=\'dlgOkBtn11_oj36|text\']/span"));
            await driver.sleep(300);
            if (element.isEnabled()) {
                console.log("Click Domain connection OK button");
                console.log("User: "+userName+" connect to local/remote AdminServer " + remoteAdminUrl + " successful");
                console.log("Remote Console run in StandAlone mode. ");
                await element.click();
                await driver.sleep(300);
            }
            if (userName == 'weblogic') //For AdminUser only
                await driver.findElement(By.xpath("//img[@title=\'Collapse\']")).click();
        },

        goToHomePageUrl: async function (driver,taskOption,action) {
            await driver.manage().setTimeouts( { implicit: 7200 } )
            console.log("Launch remote console page. ");
            await driver.get(adminUrl);
            await driver.sleep(4800);
            await this.startupDialogTask(driver,taskOption,action);
            // 1 for Create Provider for Admin Server Connection, 2 for Create Provider for Existing WDT Model File
            // 3 for and 4 for.....
            // Default option is to Cancel the Startup Dialog.
            //await this.addDomainConnection(driver);
            try {
                console.log("Create Domain Connection");
                await this.addDomainConnection(driver);
                await this.login(driver,domConName,userName,password,remoteAdminUrl);
            }
            catch (e) {
                console.log("Remote Console either run in credential mode, or already login - skip to login");
            }
        },

        goToDefaultDomain: async function (driver) {
            let projectName = "domainProject";
            const file = "frontend/system-tests/lib/domainProject.json";
            const path = require('path');
            const fileName = process.env.OLDPWD + path.sep + file;
            await this.importProject(driver,projectFileName);
            await this.selectDomainConnection(driver,domConName);
            try {
                console.log("Create Domain Connection");
                await this.login(driver,domConName,userName,password,remoteAdminUrl);
            }
            catch (e) {
                console.log("Remote Console either run in credential mode, or already login - skip to login");
            }
        },

        addDomainConnection: async function (driver) {
            await driver.manage().setTimeouts( { implicit: 9800 } )
            console.log("Click expand Kiosk menu... ");
            console.log("Click Connection/Modules");
            await driver.sleep(2400);
            await driver.findElement(By.id("project-more-icon")).click();
            await driver.sleep(2400);
            console.log("Click Add Admin Server Connection");
            await driver.findElement(By.xpath("//span[contains(.,\'Add Admin Server Connection Provider...\')]")).click();
            await driver.sleep(2400);
        },

        createNewWDTModelFile: async function(driver,wdtProviverName,wdtFileName) {
            console.log("Click expand Kiosk menu...");
            await driver.findElement(By.id("project-more-icon")).click();
            await driver.sleep(4800);
            console.log("Click Create Provider for New WDT Model File...");
            await driver.findElement(By.xpath("//span[contains(.,\'Create Provider for New WDT Model File...\')]")).click();
            await driver.sleep(4800);
            console.log("Enter Provider Name = "+wdtProviverName);
            await driver.findElement(By.xpath("//input[@id=\'model-name-field|input\']")).sendKeys(wdtProviverName);
            await driver.sleep(2400);
            console.log("Enter File Name = "+wdtFileName);
            await driver.findElement(By.xpath("//input[@id=\'model-file-field|input\']")).sendKeys(wdtFileName);
            await driver.sleep(2400);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//oj-button[@id=\'dlgOkBtn12\']/button/div")).click();
        },

        addWDTModelExistingFile: async function (driver,modelName,wdtModelFile) {
            await driver.manage().setTimeouts( { implicit: 9800 } )
            console.log("Launch remote console page. ");
            await driver.get(adminUrl);
            await driver.sleep(4800);
            await this.startupDialogTask(driver,2,"Choose");
            await driver.sleep(600);
            try {
                console.log("Click More Action for Connection/Modules");
                element = driver.findElement(By.xpath("//img[@title=\'More Actions\']"));
                if (element.isEnabled()) {
                    await element.click();
                    await driver.sleep(2400);
                    await driver.findElement(By.xpath("//span[contains(.,\'Add WDT Model File Provider...\')]")).click();
                }
            }
            catch (e) {
                console.log("Do not see startup dialog");
            }
            await driver.sleep(2400);
            console.log("Click Add WDT Model File");
            await driver.findElement(By.xpath("//input[@id=\'model-name-field|input\']")).sendKeys(modelName);
            await driver.sleep(2400);
            console.log("Click to chose WDT Model File path");
            await driver.findElement(By.xpath("//img[@title=\'Choose File\']")).click();
            await driver.sleep(2400);
            console.log("Enter WDT Model File Path = " + wdtModelFile);
            await driver.findElement(By.xpath("//input[@id=\'file-chooser\']")).sendKeys(wdtModelFile);
            await driver.sleep(2400);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//span[@id=\'dlgOkBtn12_oj34|text\']")).click();
            await driver.sleep(2400);
        },

        createNewPropertyList: async function(driver,propertyListName,propertyFileName) {
            console.log("Enter Provider Name = "+propertyListName);
            await driver.findElement(By.xpath("//input[@id=\'model-name-field|input\']")).sendKeys(propertyListName);
            await driver.sleep(1200);
            console.log("Enter File Name = "+propertyFileName);
            await driver.findElement(By.xpath("//input[@id=\'model-file-field|input\']")).sendKeys(propertyFileName);
            await driver.sleep(1200);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//*[@id=\'dlgOkBtn12_oj34|text\']/span")).click();
            await driver.sleep(1200);
        },

        importProject: async function(driver,projectFileName) {
            await driver.manage().setTimeouts( { implicit: 9800 } )
            console.log("Launch remote console page. ");
            await driver.get(adminUrl);
            await driver.sleep(4800);
            await this.startupDialogTask(driver,7,"Choose");
            console.log("Click Import Project...");
            await driver.findElement(By.xpath("//img[@title=\'Choose File\']")).click();
            await driver.sleep(1400);
            console.log("Select to Import Project " + projectFileName);
            await driver.findElement(By.id("file-chooser")).sendKeys(projectFileName);
            await driver.sleep(1400);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//oj-button[@id=\'dlgOkBtn14\']/button/div")).click();
            await driver.sleep(1400);
        },

        selectDomainConnection: async function (driver,domainConnection) {
            await driver.manage().setTimeouts( { implicit: 4800 } )
            console.log("Click select " + domainConnection + " Connection");
            await driver.findElement(By.xpath("//span[contains(.,\'"+domainConnection+"\')]")).click();
            await driver.sleep(2400);
        },

        selectTree: async function (driver, treeType, filePath) {
            console.log("Click Provider Name: " +treeType);
            await driver.findElement(By.xpath("//span[contains(.,\'"+treeType+"\')]")).click();
            await driver.sleep(4800);

            if (filePath != null) {
                console.log("Click Choose File...");
                await driver.findElement(By.xpath("//img[@title=\'Choose File\']")).click();
                await driver.sleep(1400);
                console.log("Select to enter file path " + filePath);
                await driver.findElement(By.id("file-chooser")).sendKeys(filePath);
                await driver.sleep(1400);
                console.log("Click OK button");
                if (treeType == "wdtTemplateModel" || treeType == "baseDomainModel"
                    || treeType == "testPropertyListProvider" || treeType == "baseDomainPropList")
                    await driver.findElement(By.xpath("//oj-button[@id='dlgOkBtn12']")).click();
                else
                    await driver.findElement(By.xpath("//span[@id=\'dlgOkBtn12_oj34|text\']")).click();
                await driver.sleep(1400);
            }
        },

        exportProviderAsProject: async function (driver,projectName,fileName) {
            await driver.manage().setTimeouts( { implicit: 9800 } )
            console.log("Click More Action menu... ");
            await driver.findElement(By.id("project-more-icon")).click();
            await driver.sleep(600);
            console.log("Click Export Providers as Project");
            await driver.findElement(By.xpath("//oj-option[@id=\'[[i18n.menus.project.export.id]]\']/a")).click();
            await driver.sleep(600);
            console.log("Enter export project = "+projectName);
            await driver.findElement(By.id("project-name-field|input")).sendKeys(projectName);
            await driver.sleep(600);
            console.log("Click project-file-field|input field");
            await driver.findElement(By.id("project-file-field|input")).click();
            await driver.sleep(600);
            console.log("Enter export project file path = "+fileName);
            await driver.findElement(By.id("project-file-field|input")).sendKeys(fileName);
            console.log("Click OK button");
            await driver.findElement(By.xpath("//oj-button[@id=\'dlgOkBtn13\']/button/div")).click();
        },

        /////////////
        //
        // NavStrip Mnu Elements:
        //    Toggle, Configuration, Monitoring, Deployment, Control
        //
        goToNavStripToggle: async function (driver) {
            console.log("Click NavStrip Toggle link.");
            element = driver.findElement(By.css("#navtreeToggle img"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavStripImageMenuLink: async function(driver,navImageMenuLink) {
            await driver.manage().setTimeouts( { implicit: 6400 } )
            await this.goToHomePageUrl(driver);
            await driver.sleep(6400);
            console.log("Click NavStrip "+navImageMenuLink+" link.");
            element = driver.findElement(By.css("#"+navImageMenuLink+" > .navstrip-icon"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelOneLink: async function(driver,navImageMenuLink,levelOneLink) {
            await driver.manage().setTimeouts( { implicit: 900000 } )
            await this.goToNavStripImageMenuLink(driver,navImageMenuLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelOneLink+"\')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelTwoLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink) {
            await this.goToNavTreeLevelOneLink(driver,navImageMenuLink,levelOneLink);
            await driver.sleep(8400);
            console.log("Click " + navImageMenuLink + "->" + levelOneLink + "->" + levelTwoLink + " NavTree link.");
            if (levelTwoLink.toString() == "Domain") {
                await driver.findElement(By.xpath("//li/a/span[2]")).click();
            }
            else {
                element = driver.findElement(By.xpath("//span[contains(.,\'" + levelTwoLink + "\')]"));
                if (element.isEnabled()) {
                    await element.click();
                }
            }
        },

        goToNavTreeLevelThreeLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink,levelThreeLink) {
            await this.goToNavTreeLevelTwoLink(driver,navImageMenuLink,levelOneLink,levelTwoLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"+levelThreeLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelThreeLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelFourLink: async function(driver,navImageMenuLink,levelOneLink,
                                                 levelTwoLink,levelThreeLink,levelFourLink)
        {
            await this.goToNavTreeLevelThreeLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,levelThreeLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"
                                    +levelThreeLink+"->"+levelFourLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelFourLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelFiveLink: async function(driver,navImageMenuLink,levelOneLink,
                                                 levelTwoLink,levelThreeLink,levelFourLink,levelFiveLink)
        {
            await this.goToNavTreeLevelFourLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,levelThreeLink,levelFourLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"
                                +levelThreeLink+"->"+levelFourLink+"->"+levelFiveLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelFiveLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelSixLink: async function(driver,navImageMenuLink,levelOneLink,
                                                levelTwoLink,levelThreeLink,levelFourLink,levelFiveLink,levelSixLink)
        {
            await this.goToNavTreeLevelFiveLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
            levelThreeLink,levelFourLink,levelFiveLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"
                +levelThreeLink+"->"+levelFourLink+"->"+levelFiveLink+"->"+levelSixLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelSixLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelSevenLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                                                  levelThreeLink,levelFourLink,levelFiveLink,levelSixLink,levelSevenLink)
        {
            await this.goToNavTreeLevelSixLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                levelThreeLink,levelFourLink,levelFiveLink,levelSixLink);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"+levelThreeLink+"->"
                +levelFourLink+"->"+levelFiveLink+"->"+levelSixLink+"->"+levelSevenLink+" NavTree link.");
            await driver.sleep(8400);
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelSevenLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelEightLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                                                  levelThreeLink,levelFourLink,levelFiveLink,levelSixLink,levelSevenLink,
                                                  levelEightLink)
        {
            await this.goToNavTreeLevelSevenLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
            levelThreeLink,levelFourLink,levelFiveLink,levelSixLink,levelSevenLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"+levelThreeLink+"->"
                +levelFourLink+"->"+levelFiveLink+"->"+levelSixLink+"->"+levelSevenLink+"->"+levelEightLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelEightLink+"\')]"));
            if (element.isEnabled())
                await element.click();
        },

        goToNavTreeLevelNineLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                                                 levelThreeLink,levelFourLink,levelFiveLink,levelSixLink,levelSevenLink,
                                                 levelEightLink,levelNineLink)
        {
            await this.goToNavTreeLevelEightLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
            levelThreeLink,levelFourLink,levelFiveLink,levelSixLink,levelSevenLink,levelEightLink);
            await driver.sleep(8400);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"+levelThreeLink+"->"
                +levelFourLink+"->"+levelFiveLink+"->"+levelSixLink+"->"+levelSevenLink+"->"
                +levelEightLink+"->"+levelNineLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelNineLink+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        ////////////////////////////
        /////////////
        createNewMBeanObject: async function(driver,objectMBeanName,navTreeLevel,navImageMenuLink,
                                             levelOneLink,levelTwoLink,levelThreeLink,levelFourLink,
                                             extraField,itemList,fieldTwo,fieldThree) {
            //fieldThree=Item needs to search in the pop down list (eg, AdminServer)
            //itemList=oj-searchselect-filter-Target|input element
            switch(navTreeLevel.toString()) {
                case '2':
                    await this.goToNavTreeLevelTwoLink(driver,navImageMenuLink,levelOneLink,levelTwoLink);
                    console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+" New button");
                    break;
                case '3':
                    await this.goToNavTreeLevelThreeLink(driver,navImageMenuLink,levelOneLink,
                        levelTwoLink,levelThreeLink);
                        console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                        "->"+levelThreeLink+" New button");
                    break;
                case '4':
                    await this.goToNavTreeLevelFourLink(driver,navImageMenuLink,levelOneLink,
                        levelTwoLink,levelThreeLink,levelFourLink);
                        console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                        "->"+levelThreeLink+"->"+levelFourLink+" New button");
                    break;
            }
            await driver.sleep(2400);
            console.log("Click new button to create " + objectMBeanName);
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button"));
            await driver.sleep(900);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(900);
            console.log("Enter object name: " + objectMBeanName);
            await driver.findElement(By.id("Name|input")).clear();
            await driver.findElement(By.id("Name|input")).sendKeys(objectMBeanName);
            await driver.sleep(6400);
            if (extraField == "searchselect") {
                await this.selectDropDownList(driver,fieldTwo,itemList,fieldThree);
                await driver.sleep(300);
            }
            if (extraField == "input") {
                await driver.sleep(1200);
                console.log("Enter second field Name : " + fieldTwo);
                element = driver.findElement(By.id(itemList));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                if (element.isEnabled()) {
                    await element.clear();
                    await element.sendKeys(fieldTwo);
                }
            }
            await this.saveAndCommitChanges(driver);
            await driver.sleep(1200);
        },


        //
        // Create new MBean Object from Container Landing page
        // createMBeanObjectFromLandingPage method does not save newly created object to shopping cart
        //
        createMBeanObjectFromLandingPage: async function(driver,objectMBeanName,landingImageName,headerContainerName,
                                                         panelCard,arrowIndex,extraField,itemList,fieldTwo,fieldThree)
        {
            //5 for right and 3 for left arrow direction
            await this.goToLandingPanelSubTreeCard(driver,landingImageName,headerContainerName,panelCard,arrowIndex);
            await driver.sleep(2400);
            console.log("Click new button to create " + objectMBeanName);
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img"));
            await driver.sleep(4800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            console.log("Enter object name: " + objectMBeanName);
            await driver.findElement(By.id("Name|input")).clear();
            await driver.findElement(By.id("Name|input")).sendKeys(objectMBeanName);
            await driver.sleep(900);
            if (extraField == "searchselect") {
                //await this.selectDropDownList(driver,fieldTwo,itemList,fieldThree);
                await this.selectDropDownValue(driver,fieldTwo,itemList);
                await driver.sleep(900);
            }
            if (extraField == "input") {
                await driver.sleep(900);
                console.log("Enter second field Name : " + fieldTwo);
                element = driver.findElement(By.id(itemList));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                if (element.isEnabled()) {
                    await element.clear();
                    await element.sendKeys(fieldTwo);
                }
            }
        },

        deleteMBeanObject: async function(driver,objectMBeanName,scrumName,navTreeLevel,navImageMenuLink,levelOneLink,
                                          levelTwoLink,levelThreeLink,levelFourLink,scrumName2,objLocation) {
            //scrumName: name of element tree structure on the breadcrumbs Tab
            await driver.sleep(1200);
            switch(navTreeLevel.toString()) {
                case '2':
                    await this.goToNavTreeLevelTwoLink(driver,navImageMenuLink,levelOneLink,levelTwoLink);
                    await driver.sleep(1400);
                    console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                                " Delete row button to delete " + objectMBeanName + " object.");
                    element = driver.findElement(By.xpath("//tr["+objLocation+"]/td/oj-button/button/div/span/span"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    await driver.sleep(900);
                    await element.click();
                    break;
                case '3':
                    await this.goToNavTreeLevelThreeLink(driver,navImageMenuLink,levelOneLink,
                        levelTwoLink,levelThreeLink);
                    await driver.sleep(1400);
                    console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                        "->"+levelThreeLink+" Delete row button");
                    element = driver.findElement(By.xpath("//tr["+objLocation+"]/td/oj-button/button/div/span/span"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    await driver.sleep(900);
                    await element.click();
                    break;
                case '4':
                    await this.goToNavTreeLevelFourLink(driver,navImageMenuLink,levelOneLink,
                        levelTwoLink,levelThreeLink,levelFourLink);
                    await driver.sleep(1400);
                    console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                        "->"+levelThreeLink+"->"+levelFourLink+" Delete row button");
                    element = driver.findElement(By.xpath("//tr["+objLocation+"]/td/oj-button/button/div/span/span"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    await driver.sleep(900);
                    await element.click();
                    break;
            }
            await driver.sleep(1200);
            await this.commitChanges(driver);
            await driver.sleep(1200);
        },

        //
        // Create new MBean Object from container landing page
        createNewMBeanFromLandingPage: async function(driver,objName)
        {
            console.log("Click create/new button");
            await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
            await driver.sleep(400);
            console.log("Enter MBean name = " + objName);
            await driver.findElement(By.id("Name|input")).click();
            await driver.findElement(By.id("Name|input")).clear();
            await driver.findElement(By.id("Name|input")).sendKeys(objName);
        },

        //
        // Create new MBean Object from button-menu-dropdown-icon
        createMBeanFromMenuDropDown: async function(driver,dropDownMenuElem,mBeanName,
                                                    extraField,itemList,fieldTwo,fieldThree)
        {
            //fieldThree=Item needs to search in the pop down list (eg, AdminServer)
            //itemList=oj-searchselect-filter-Target|input element
            console.log("Click drop down menu");
            await driver.findElement(By.css(".oj-button-menu-dropdown-icon")).click();
            await driver.sleep(2400);
            console.log("Select down menu: " + dropDownMenuElem);
            await driver.findElement(By.xpath("//span[contains(.,\'"+dropDownMenuElem+"\')]")).click();
            await driver.sleep(6400);

            console.log("Click create/new button");
            await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img")).click();
            await driver.sleep(2400);

            if (mBeanName != null) {
                await driver.findElement(By.id("Name|input")).click();
                console.log("Enter MBean name = " + mBeanName);
                await driver.findElement(By.id("Name|input")).sendKeys(mBeanName);
            }

            if (extraField == "searchselect") {
                await this.selectDropDownList(driver,fieldTwo,itemList,fieldThree);
                await driver.sleep(900);
            }
            if (extraField == "input") {
                await driver.sleep(900);
                console.log("Enter second field Name : " + fieldTwo);
                element = driver.findElement(By.id(itemList));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                if (element.isEnabled()) {
                    await element.clear();
                    await element.sendKeys(fieldTwo);
                }
            }

            await driver.sleep(3600);
            await this.saveToShoppingCart(driver);
        },


        deleteMBeanFromLandingPage: async function(driver,scrumName,objName,objLocation) {
            console.log("Click to delete "+objName+ " from "+scrumName+" list");
            //Different syntax to delete an object - utilities test case 2
            await driver.sleep(1400);
            element = driver.findElement(By.xpath("//tr["+objLocation+"]/td/oj-button/button/div/span/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(900);
        },


        ////////////
        ///////
        goToFirstTabFromNavTree: async function(driver,navTreeLevel,arrowIndex,tabNameId,navImageMenuLink,
                                                levelOneLink,levelTwoLink,levelThreeLink,levelFourLink)
        {
            if (navTreeLevel == '2') {
                await this.goToNavTreeLevelTwoLink(driver,navImageMenuLink,levelOneLink,levelTwoLink);
                await driver.sleep(2400);
                console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                                "->"+tabNameId+" tab.");
                element = driver.findElement(By.xpath("//td[contains(.,\'"+tabNameId+"\')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(300);
                if (element.isEnabled()) {
                    await element.click();
                    await driver.sleep(300);
                }
            }
            if (navTreeLevel == '3') {
                await this.goToNavTreeLevelThreeLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                    levelThreeLink);
                await driver.sleep(2400);
                console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"
                                    +levelThreeLink+"->"+tabNameId+" tab.");
                element = driver.findElement(By.xpath("//td[contains(.,\'"+tabNameId+"\')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(300);
                if (element.isEnabled()) {
                    await element.click();
                    await driver.sleep(300);
                }
            }
            if (navTreeLevel == '4') {
                await this.goToNavTreeLevelFourLink(driver,navImageMenuLink,levelOneLink,levelTwoLink,
                    levelThreeLink,levelFourLink);
                await driver.sleep(1200);
                console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+"->"
                                +levelThreeLink+"->"+levelFourLink+"->"+tabNameId+" tab.");
                element = driver.findElement(By.xpath("//td[contains(.,\'"+tabNameId+"\')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(300);
                if (element.isEnabled()) {
                    await element.click();
                    await driver.sleep(300);
                }
            }
        },

        goToTabName: async function(driver, tabNameId) {
            console.log("Click " +tabNameId+" tab.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+tabNameId+"\')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            element.click();
            await driver.sleep(900);
        },

        //
        // This function to select AdminServer, managedServer or Cluster in the targets list
        selectTarget: async function(driver,targetName) {
            console.log("Click Targets tab");
            await driver.findElement(By.xpath("//span[contains(.,\'Target\')]")).click();
            await driver.sleep(4800);
            if (targetName == 'AdminServer') {
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
                    By.xpath("//oj-button[@id=\'addToChosen\']/button/div/span")).click();
                await driver.sleep(800);
            }
            await this.saveAndCommitChanges(driver);
            await driver.sleep(3600);
        },


        //////////////////////////////////////////////////
        //
        // Main Landing (Image) Menu links:
        //   Configuration, Monitoring and Control List Group
        //
        goToLandingImage: async function (driver,landingImageName,arrowIndex) {
            await this.goToHomePageUrl(driver);
            await driver.manage().setTimeouts( { implicit: 96000 } )
            console.log("Click "+landingImageName+" panel card header image link.");
            element = driver.findElement(By.xpath("//img[@alt=\'"+landingImageName+"\']"));
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(2400);
            }
        },

        goToLandingPanelHeader: async function (driver,landingImageName,headerContainerName,arrowIndex) {
            await this.goToLandingImage(driver,landingImageName,arrowIndex);
            await driver.sleep(1200);
            if (arrowIndex == 5 || arrowIndex == 3) {
                await this.clickConveyorArrow(driver,arrowIndex);
                //5 for right and 3 for left arrow direction
            }
            if (landingImageName == "Monitoring") {
                console.log("Click Monitoring->" +headerContainerName+ " container landing image link.");
                element = driver.findElement(By.id(headerContainerName));
                await driver.sleep(900);
                if (element.isEnabled()) {
                    await element.click();
                }
            }
            else {
                console.log("Click Configuration->" + headerContainerName + " container landing image link.");
                element = driver.findElement(By.xpath("//span[@id=\'" + headerContainerName + "\']"));
                await driver.sleep(900);
                if (element.isEnabled()) {
                    await element.click();
                }
            }
        },

        /////
        //GoTo specific page
        goToLandingPanelSubTreeCard: async function(driver,landingImageName,
                                                          headerContainerName,panelCard,arrowIndex) {
            await this.goToLandingPanelHeader(driver, landingImageName, headerContainerName, arrowIndex);
            await driver.sleep(4800);
            console.log("Click " + landingImageName + "->" + headerContainerName + "->" + panelCard + " link.");
            if (landingImageName == "Monitoring") {
                if (panelCard == "Domain Information") {
                    element = driver.findElement(By.xpath("//td[contains(.,\'" + panelCard + "\')]"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                }
            } else {
                console.log("Click " + panelCard + " link.");
                if (panelCard.toString() == "Domain")
                    element = driver.findElement(By.xpath("//div[@id='landing-page-panel-subtree']/div/a/span"));
                else
                    element = driver.findElement(By.xpath("//span[contains(.,\'" + panelCard + "\')]"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await driver.sleep(2400);
                if (element.isEnabled()) {
                    await element.click();
                }
            }
        },

        selectItemInContainerTable: async function(driver,landingImageName,
                                                    headerContainerName, panelCard,arrowIndex,compName)
        {
            //arrowIndex: 5 for right and 3 for left arrow
            await this.goToLandingPanelSubTreeCard(driver,landingImageName, headerContainerName,
                                                  panelCard,arrowIndex);
            await driver.sleep(2400);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"+compName+" Item.");
            element = driver.findElement(By.xpath("//td[contains(.,\'"+compName+"\')]"));
            await driver.sleep(900);
            if (element.isEnabled()) {
                await element.click();
            }

        },

        //////////////////////////////////////////
        //////////
        goToFirstTab: async function (driver,landingImageName, headerContainerName,
                                      panelCard,arrowIndex,tabNameId)
        {
            //arrowIndex: 5 for right and 3 for left arrow (1 doesn't need arrow)
            //tabNameId: 1(General), 3(Security), 5(Concurrency), 7(Web Application), 9(Logging), 11(Batch)
            await this.goToLandingPanelSubTreeCard(driver,landingImageName, headerContainerName,
                                                         panelCard,arrowIndex);
            await driver.sleep(1200);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"+tabNameId+" index tab.");
            if (tabNameId == 1)
                element = driver.findElement(By.xpath("//span[contains(.,\'General\')]"));
            else if (tabNameId == 7)
                element = driver.findElement(By.xpath("//span[contains(.,\'Web Application\')]"));
            else if (tabNameId == 11)
                element = driver.findElement(By.xpath("//span[contains(.,\'Batch\')]"));
            else
                element = driver.findElement(By.xpath("//li["+tabNameId+"]/a/span"));
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToSecondTab: async function (driver,landingImageName, headerContainerName,
                                       panelCard,arrowIndex,firstTabNameId,secondTabIndex)
        {
            //firstTabNameId: 1(General), 3(Security), 5(Concurrency), 7(Web Application), 9(Logging), 11(Batch)
            //secondTabName: (eg, Domain Security) - 1(General), 3(Filter), 5(Embedded LDAP), 7(SSL,....)
            await this.goToFirstTab(driver,landingImageName,headerContainerName,panelCard,arrowIndex,firstTabNameId);
            await driver.sleep(300);
            let domainTabPath = "//div[2]/oj-conveyor-belt/div[4]/div/oj-tab-bar/div/div/ul/li";
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"
                                +firstTabNameId+"->"+secondTabIndex+" index tab.");
            if (panelCard == "Domain") {
                element = driver.findElement(By.xpath(domainTabPath + "["+secondTabIndex+"]/a/span"));
            }
            else {
                console.log("Need to add tab path for other panel properties");
            }
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToThirdTab: async function (driver,landingImageName,headerContainerName,
                                      panelCard,arrowIndex,firstTabNameId,secondTabIndex,thirdTabIndex)
        {
            await this.goToSecondTab(driver,landingImageName,headerContainerName,panelCard,arrowIndex,
                                        firstTabNameId,secondTabIndex);
            let domainTabPath = "//div[3]/oj-conveyor-belt/div[4]/div/oj-tab-bar/div/div/ul/li";
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"
                                +firstTabNameId+"->"+secondTabIndex+"->"+thirdTabIndex+" index tab.");
            if (panelCard == "Domain") {
                element = driver.findElement(By.xpath(domainTabPath + "["+thirdTabIndex+"]/a/span"));
            }
            else {
                console.log("Need to add tab path for other panel properties");
            }
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
            }
        },


        /////////////////////////////////////
        ////////////////////////////////////
        goToFirstCompTab: async function (driver,landingImageName,headerContainerName,panelCard,
                                          arrowIndex,compName,tabNameId)
        {
            await this.selectItemInContainerTable(driver,landingImageName,headerContainerName,
                                                  panelCard,arrowIndex,compName);
            await driver.sleep(600);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+
                                "->"+compName+"->"+tabNameId+" tab.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+tabNameId+"\')]"));
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToSecondCompTab: async function (driver,landingImageName,headerContainerName,panelCard,
                                           arrowIndex,compName,firstTabNameId,secondTabName)
        {
            await this.goToFirstCompTab(driver,landingImageName,headerContainerName,panelCard,
                                        arrowIndex,compName,firstTabNameId);
            await driver.sleep(300);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"+firstTabNameId+"->"
                                +secondTabName+" tab.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+secondTabName+"\')]"));
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
            }
        },


        /////////////////////////////////////////////////////////
        //
        // TODO - utility functions
        //
        /////////////////////////////////////////////////////////

        //Click oj-conveyor-belt arrow-> (index=5 right arrow, index=3 left arrow, index=0 (default: no click)
        clickConveyorArrow: async function(driver,arrowIndex) {
            if (arrowIndex == 5) {
                console.log("Click right oj-conveyor-belt arrow");
                element = driver.findElement(By.xpath("//div["+arrowIndex+"]/div/span"));
                await element.click();
            }
            else if (arrowIndex == 3) {
                console.log("Click left oj-conveyor-belt arrow")
                element = driver.findElement(By.xpath("//div["+arrowIndex+"]/div/span"));
                await element.click();
            }
            else {
                console.log("No oj-conveyor-belt arrow appears");
            }
        },

        enableCheckBox: async function (driver,idName) {
            console.log("Click enable " + idName + " check box.");
            element = await driver.findElement(By.id(idName));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(300);
            if (element.isSelected()) {
                await element.click();
                await driver.sleep(800);
            }
        },

        disableCheckBox: async function (driver,idName) {
            console.log("Click disable " + idName + " check box.");
            element = await driver.findElement(By.id(idName));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(300);
            if (!element.isSelected()) {
                await element.click();
                await driver.sleep(800);
            }
        },

        enableOjSwitchCheckBox: async function(driver,idName,divLevel) {
            console.log("Click enable  " + idName + " check box.");
            if (divLevel.toString() == "") {
                element = await driver.findElement(By.xpath("//oj-switch[@id=\'"+idName+"\']/div/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            }
            if (divLevel.toString() == "3") {
                element = await driver.findElement(By.xpath("//oj-switch[@id=\'"+idName+"\']/div/div/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            }
            await driver.sleep(300);
            if (!element.enabled) {
                await element.click();
                await driver.sleep(600);
            }
        },

        disableOjSwitchCheckBox: async function(driver,idName,divLevel) {
            console.log("Click disable  " + idName + " check box.");
            if (divLevel.toString() == "") {
                element = await driver.findElement(By.xpath("//oj-switch[@id=\'"+idName+"\']/div/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            }
            if (divLevel.toString() == "3") {
                element = await driver.findElement(By.xpath("//oj-switch[@id=\'"+idName+"\']/div/div/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            }
            await driver.sleep(300);
            if (!element.enabled) {
                await element.click();
                await driver.sleep(600);
            }
        },

        // Set a new value to a Text Field
        setFieldValue: async function (driver,idName,newValue) {
            console.log("Set value for " + idName + " = " + newValue);
            element = await driver.findElement(By.id(idName));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(newValue);
                await driver.sleep(2000);
            }
        },
        // Select an item from Drop Down List
        selectDropDownValue: async function (driver,idName,selectValue,chIndex) {
            //(eg, idName="CertPathBuilder|input", selectValue="testCertPathProvider-1")
            console.log("Select " + selectValue + " from " + idName + " list.");
            element = await driver.findElement(By.id(idName));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(300);
            await element.click();
            await driver.sleep(300);
            element = driver.findElement(By.xpath("//span[contains(.,\'"+selectValue+"\')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(300);
        },

        // Another way to select an item from Drop Down List with using KEYBOARD
        selectDropDownList: async function (driver,idName,idSearchList,searchItem) {
            console.log("Select " +searchItem+ " from " +idName+ " in " +idSearchList+ " list.");
            element = await driver.findElement(By.id(idName));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})",element);
            await driver.sleep(300);
            await element.click();
            await driver.sleep(300);
            element = await driver.findElement(By.id(idSearchList));
            await driver.sleep(300);
            await element.sendKeys(Key.DOWN);
            await driver.sleep(900);
            //Clear current element in the oj-search-select-list
            var i;
            for (i = 0; i < 60; i++) {
                await element.sendKeys(Key.ARROW_LEFT);
                await element.sendKeys(Key.DELETE);
            }
            await element.sendKeys(Key.CLEAR);
            await element.sendKeys(searchItem);
            await driver.sleep(900);
            await element.sendKeys(Key.DOWN);
            await element.sendKeys(Key.ENTER);
            await element.sendKeys(Key.TAB);
        },

        // Save modified elements to Shopping Cart
        saveToShoppingCart: async function(driver,buttonId) {
            console.log("Click create/save to shopping cart");
            if (buttonId == "finish")
                element = driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons."+buttonId+".id]]\']/button/div/span"));
            else
                element = driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.save.id]]\']/button/div/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(4800);
            }
        },

        saveToShoppingCartImage: async function(driver) {
            console.log("Click create/save to shopping cart");
            element = driver.findElement(By.id("saveToShoppingCartImage"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(600);
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(900);
            }
        },

        // View changes in Shopping Cart
        viewChanges: async function(driver) {
            console.log("Click view changes link from shopping cart");
            await driver.sleep(1200);
            element = driver.findElement(By.id("shoppingCartImage"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            await driver.findElement(By.linkText("View Changes")).click();
            await driver.sleep(1200);
        },

        // Discard changes in Shopping Cart
        discardChanges: async function(driver) {
            console.log("Click discard changes from shopping cart");
            element = driver.findElement(By.id("shoppingCartImage"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//a[@id=\'shoppingCartMenuLauncher\']/img")).click();
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//span[contains(.,\'Discard Changes\')]")).click();
            await driver.sleep(1200);
        },
        // Commit changes in Shopping Cart
        commitChanges: async function(driver) {
            console.log("Click commit changes");
            element = driver.findElement(By.id("shoppingCartImage"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//a[@id=\'shoppingCartMenuLauncher\']/img")).click();
            await driver.sleep(1200);
            await driver.findElement(By.xpath("//span[contains(.,\'Commit Changes\')]")).click();
            await driver.sleep(1200);
        },

        // Save modified elements then commit changes
        saveAndCommitChanges: async function(driver,buttonId) {
            await driver.sleep(1200);
            await this.saveToShoppingCart(driver,buttonId);
            await driver.sleep(1200);
            await this.commitChanges(driver);
            await driver.sleep(4800);
        },


        //////////////////////////////////////////////////
        goToHelpPage: async function (driver) {
            await driver.get(adminUrl);
            await driver.sleep(1200);
            element = driver.findElement(By.xpath("//li[@id=\'help\']/img"))
            if (element.isEnabled())
                await element.click();
            else element = driver.findElement(By.xpath("//img[@alt=\'help\']"))
            return element.click();
        },
        assertLinkPresent: async function () {
            await driver.findElement(pageobjects.linkselenium).toString();
        },
        assertElementPresent: async function (driver, element) {
            await driver.findElement(By.id(element));
        }
    };
}

module.exports.adminUrl = adminUrl;
module.exports.remoteAdminUrl = remoteAdminUrl;
module.exports.remoteUrl = remoteUrl;
module.exports.browserName = browserName;
module.exports.domConName = domConName;
// FortifyIssueSuppression Password Management: Password in Comment
// This is not a password, but just a parameter
module.exports.credential = {
    userName: userName,
    password: password
};
