// This file provide function to access services
//    JMS Servers, SAF Agents, JMS System Resources, ...
//    TODO tasks will be implemented later
'use strict';

const {By, until, webdriver} = require("selenium-webdriver");

const Admin = require('./admin');
const assert = require('assert');

module.exports = function (driver, file) {
    this.driver = driver;
    let element;
    let admin;
    admin = new Admin(driver, file);

    return {
        ///
        // Modify JMSServer->General tab properties
        //
        modifyJMSServerGeneralTab: async function (driver,jmsServerName,tabName,persistentStoreDL,
                                                   pagingFileLockingEnabledCB,pagingDirectoryTF,
                                                   messageBufferSizeTF,hostingTemporaryDestinationsCB,
                                                   moduleContainingTemporaryTemplateTF,temporaryTemplateNameTF,
                                                   expirationScanIntervalTF)
        {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","JMS Servers",
                jmsServerName,tabName);
            await admin.goToFirstTabFromNavTree(driver,2,1,jmsServerName,"configuration",
                "Services","JMS Servers","","");
            await driver.sleep(300);
            await admin.enableOjSwitchCheckBox(driver,pagingFileLockingEnabledCB,"3");
            //Advanced Fields Test
            //await admin.enableCheckBox(driver,'show-advanced-fields');
            await admin.discardChanges(driver);
        },

        //
        // Create a new JDBC System Resources
        //
        createJDBCSystemResource: async function (driver,jdbcSysResName,jndiName,targetName,datasourceType,
                                                  databaseType,databaseDriver,databaseName,hostName,port,
                                                  databaseUsername,password)
        {
            let oracleDriver = "GENERIC_*Oracle\'s Driver (Thin XA) for Application Continuity; Versions";
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","ServicesChevron","Domain/JDBCSystemResources");
            await driver.sleep(6400);
            element = await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/img"));
            await driver.sleep(900);
            console.log("Click JDBC System Resources New button");
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            console.log("Enter JDBC System Resource Name = "+jdbcSysResName);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            console.log("Enter JNDI Name = "+jndiName);
            await driver.findElement(By.id("Name|input")).sendKeys(jdbcSysResName);
            await driver.findElement(By.id("JNDINames|input")).click();
            await driver.findElement(By.id("JNDINames|input")).sendKeys(jndiName);
            await driver.sleep(4800);
            console.log("Select Targets = "+targetName);
            element = driver.findElement(By.css(".oj-fwk-icon-caret02end-e"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(800);

            console.log("Select Datasource type = "+datasourceType);
            console.log("Select Database type = "+databaseType);
            console.log("Select Database driver = "+oracleDriver);
            console.log("Enter database name = "+databaseName);
            element = driver.findElement(By.id(oracleDriver+":Any_DbmsName|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(databaseName);
            await driver.sleep(200);

            console.log("Enter database machine name = "+hostName);
            element = driver.findElement(By.id(oracleDriver+":Any_DbmsHost|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(hostName);
            await driver.sleep(200);

            console.log("Enter database machine port = "+port);
            element = driver.findElement(By.id(oracleDriver+":Any_DbmsPort|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(port);
            await driver.sleep(200);

            console.log("Enter database username = "+databaseUsername);
            element = driver.findElement(By.id(oracleDriver+":Any_DbmsUsername|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(databaseUsername);
            await driver.sleep(200);

            console.log("Enter database user password = "+password);
            element = driver.findElement(By.id(oracleDriver+":Any_DbmsPassword|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(password);
            await driver.sleep(800);
        },

        //
        // Modify JDBC Store General Tab, assign a datasource value
        //
        modifyJDBCStoreGeneralTab: async function (driver,jdbcStoreName,tabName,showAdvanceField,dataSourceName)
        {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","JDBC Stores",
                jdbcStoreName,tabName);
            await driver.sleep(1200);
            await admin.goToTabName(driver,tabName);
            await driver.sleep(1200);
            await admin.selectDropDownValue(driver,"DataSource",dataSourceName);
            await driver.sleep(1200);
            await admin.saveToShoppingCart(driver);
        },

        //
        // Modify JMS System Resources Target tab - Assign a target
        //
        modifyJMSSysResTargetsTab: async function (driver,jmsSysResName,tabName,targetName)
        {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Services","JMS System Resources",
                jmsSysResName,tabName);
            await driver.sleep(1200);
            await admin.goToTabName(driver,tabName);
            await driver.sleep(1200);
            console.log("Select Targets = "+targetName);
            if (targetName == "All") {
                element = driver.findElement(By.css(".oj-fwk-icon-caret02end-e"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
            }
            await driver.sleep(800);
            await admin.saveToShoppingCart(driver);
        },

    };
}
