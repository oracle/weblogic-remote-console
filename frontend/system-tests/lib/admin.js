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

        //login information from Login dialog
        login: async function (driver) {
            await driver.sleep(600);
            element = driver.findElement(By.id("username-field|input"));
            console.log("Enter userName: " + userName);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(userName);
            }
            console.log("Remote Console run in StandAlone mode. ");
            console.log("Login remote AdminServer ");
            await driver.sleep(600);
            element = driver.findElement(By.id("password-field|input"));
            console.log("Enter Password: " + password);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(password);
            }
            await driver.sleep(600);
            element = driver.findElement(By.id("url-field|input"));
            console.log("Enter adminUrl: " + remoteAdminUrl);
            if (element.isEnabled()) {
                await element.clear();
                await element.sendKeys(remoteAdminUrl);
            }
            await driver.sleep(600);
            element =  driver.findElement(By.id("connection-dialog-button-label"));
            await driver.sleep(600);
            if (element.isEnabled()) {
                await element.click();
                console.log("Connect to remote AdminServer " + remoteAdminUrl + " successful");
            }
        },

        goToHomePageUrl: async function (driver) {
            await driver.manage().setTimeouts( { implicit: 7200 } )
            console.log("Launch remote console page. ");
            await driver.get(adminUrl);
            await driver.sleep(4800);
            try {
                await this.login(driver);
            }
            catch (e) {
                console.log("Remote Console either run in credential mode, or already login - skip to login");
            }
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
            element = driver.findElement(By.css(".site-panel > #"+navImageMenuLink+" > img"));
            if (element.isEnabled()) {
                await element.click();
            }

        },

        goToNavTreeLevelOneLink: async function(driver,navImageMenuLink,levelOneLink) {
            await driver.manage().setTimeouts( { implicit: 900000 } )
            await this.goToNavStripImageMenuLink(driver,navImageMenuLink);
            await driver.sleep(3600);
            console.log("Click "+navImageMenuLink+"->"+levelOneLink+" NavTree link.");
            element = driver.findElement(By.xpath("//span[contains(.,\'"+levelOneLink+"\')]"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            if (element.isEnabled()) {
                await element.click();
            }
        },

        goToNavTreeLevelTwoLink: async function(driver,navImageMenuLink,levelOneLink,levelTwoLink) {
            await this.goToNavTreeLevelOneLink(driver,navImageMenuLink,levelOneLink);
            await driver.sleep(9600);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            await driver.sleep(2400);
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
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/img"));
            await driver.sleep(900);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(900);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(900);
            console.log("Enter object name: " + objectMBeanName);
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
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/img"));
            await driver.sleep(4800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            console.log("Enter object name: " + objectMBeanName);
            await driver.findElement(By.id("Name|input")).sendKeys(objectMBeanName);
            await driver.sleep(900);
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
        },

        deleteMBeanObject: async function(driver,objectMBeanName,scrumName,navTreeLevel,navImageMenuLink,levelOneLink,
                                          levelTwoLink,levelThreeLink,levelFourLink,scrumName2) {
            //scrumName: name of element tree structure on the breadcrumbs Tab
            await driver.sleep(1200);
            switch(navTreeLevel.toString()) {
                case '2':
                    await this.goToNavTreeLevelTwoLink(driver,navImageMenuLink,levelOneLink,levelTwoLink);
                    await driver.sleep(1400);
                    console.log("Click " +navImageMenuLink+"->"+levelOneLink+"->"+levelTwoLink+
                                " Delete row button");
                    element = driver.findElement(By.xpath("//oj-button[@id=\'Domain/"+scrumName+"/"+objectMBeanName+
                              "\']/button/div/span"));
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
                    element = driver.findElement(By.xpath("//oj-button[@id=\'Domain/"+scrumName+"/"
                        +levelThreeLink+"/"+objectMBeanName+"\']/button/div/span"));
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
                    element = driver.findElement(By.xpath("//oj-button[@id=\'Domain/"+scrumName+"/"+levelThreeLink+
                        "/"+scrumName2+"/"+objectMBeanName+"\']/button/div/span"));
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
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/img")).click();
            await driver.findElement(By.id("Name|input")).click();
            console.log("Enter MBean name = " + objName);
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
                By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/img")).click();
            await driver.sleep(2400);
            await driver.findElement(By.id("Name|input")).click();
            console.log("Enter MBean name = " + mBeanName);
            await driver.findElement(By.id("Name|input")).sendKeys(mBeanName);

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


        deleteMBeanFromLandingPage: async function(driver,scrumName,objName) {
            console.log("Click to delete "+objName+ " from "+scrumName+" list");
            await driver.sleep(1400);
            element = driver.findElement(
                By.xpath("//oj-button[@id=\'Domain/"+scrumName+"/"+objName+"\']/button/div/span"));
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
            await driver.sleep(300);
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(300);
            }
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
                                                          headerContainerName,panelCard,arrowIndex)
        {
            await this.goToLandingPanelHeader(driver,landingImageName,headerContainerName,arrowIndex);
            await driver.sleep(4800);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+" link.");
            if (landingImageName == "Monitoring") {
                if (panelCard == "Domain Information") {
                    element = driver.findElement(By.xpath("//td[contains(.,\'"+panelCard+"\')]"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                }
            }
            else {
                element = driver.findElement(By.id(panelCard));
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
            await driver.sleep(300);
            console.log("Click " +landingImageName+"->"+headerContainerName+"->"+panelCard+"->"+tabNameId+" index tab.");
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

        //Click oj-conveyor-belt arrow-> (index=5 for right and index=3 for left arrow
        clickConveyorArrow: async function(driver,arrowIndex) {
            element = driver.findElement(By.xpath("//div["+arrowIndex+"]/div/span"));
            await element.click();
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
            await driver.sleep(5400);
            if (element.isEnabled()) {
                await element.click();
                await driver.sleep(900);
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
module.exports.browserName = browserName;
// FortifyIssueSuppression Password Management: Password in Comment
// This is not a password, but just a parameter
module.exports.credential = {
    userName: userName,
    password: password
};
