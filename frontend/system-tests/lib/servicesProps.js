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
        modifyJMSServerGeneralTab: async function (driver, jmsServerName, tabName, persistentStoreDL,
                                                   pagingFileLockingEnabledCB, pagingDirectoryTF,
                                                   messageBufferSizeTF, hostingTemporaryDestinationsCB,
                                                   moduleContainingTemporaryTemplateTF, temporaryTemplateNameTF,
                                                   expirationScanIntervalTF) {
            await admin.goToNavTreeLevelThreeLink(driver, "configuration", "Services", "JMS Servers",
                jmsServerName, tabName);
            await admin.goToFirstTabFromNavTree(driver, 2, 1, jmsServerName, "configuration",
                "Services", "JMS Servers", "", "");
            await driver.sleep(300);
            await admin.enableOjSwitchCheckBox(driver, pagingFileLockingEnabledCB, "3");
            //Advanced Fields Test
            //await admin.enableCheckBox(driver,'show-advanced-fields');
            await admin.discardChanges(driver);
        },

        //
        // Create a new JDBC System Resources
        //
        createJDBCSystemResource: async function (driver, jdbcSysResName, jndiName, targetName, datasourceType,
                                                  databaseType, databaseDriver, databaseName, hostName, port,
                                                  databaseUsername, password) {
            let oracleDriver = "GENERIC_*Oracle\'s Driver (Thin XA) for Application Continuity; Versions";
            await admin.goToLandingPanelSubTreeCard(driver, "Edit Tree", "ServicesChevron", "Data Sources");
            await driver.sleep(6400);
            element = await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img"));
            await driver.sleep(900);
            console.log("Click Data Sources New button");
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
            element = driver.findElement(By.xpath("//oj-button[@id=\'addAllToChosen\']/button/div"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.click();
            await driver.sleep(300);

            console.log("Select Datasource type = " + datasourceType);
            await admin.selectDropDownValue(driver,"JDBCResource_DatasourceType","Generic Data Source");
            await driver.sleep(2000);
            console.log("Select Database type = " + databaseType);
            console.log("Select Database driver = " + oracleDriver);
            console.log("Enter database name = " + databaseName);

            element = driver.findElement(By.xpath("//div[9]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(databaseName);
            await driver.sleep(300);

            console.log("Enter database machine name = " + hostName);
            element = driver.findElement(By.xpath("//div[10]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(hostName);
            await driver.sleep(300);

            console.log("Enter database machine port = " + port);
            element = driver.findElement(By.xpath("//div[11]/div/div[2]/div/oj-input-text/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(port);
            await driver.sleep(300);

            console.log("Enter database username = " + databaseUsername);
            element = driver.findElement(By.xpath("//div[12]/div/div[2]/div/oj-input-text/div/div/input"));
            //element = driver.findElement(By.id(oracleDriver + ":Any_DbmsUsername|input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(databaseUsername);
            await driver.sleep(300);

            console.log("Enter database user password = " + password);
            element = driver.findElement(By.xpath("//div[13]/div/div[2]/div/oj-input-password/div/div/input"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await element.clear();
            await element.sendKeys(password);
            await driver.sleep(1600);
        },

        //
        // Modify JDBC Store General Tab, assign a datasource value
        //
        modifyJDBCStoreGeneralTab: async function (driver, jdbcStoreName, tabName, showAdvanceField, dataSourceName) {
            await admin.goToNavTreeLevelThreeLink(driver, "configuration", "Services", "JDBC Stores",
                jdbcStoreName, tabName);
            await driver.sleep(1200);
            await admin.goToTabName(driver, tabName);
            await driver.sleep(1200);
            await admin.selectDropDownValue(driver, "DataSource", dataSourceName);
            await driver.sleep(1200);
            await admin.saveToShoppingCart(driver);
        },

        //
        // Modify JMS System Resources Target tab - Assign a target
        //
        modifyJMSSysResTargetsTab: async function (driver, jmsSysResName, tabName, targetName) {
            await admin.goToNavTreeLevelThreeLink(driver, "configuration", "Services", "JMS System Resources",
                jmsSysResName, tabName);
            await driver.sleep(1200);
            await admin.goToTabName(driver, tabName);
            await driver.sleep(1200);
            console.log("Select Targets = " + targetName);
            if (targetName == "All") {
                element = driver.findElement(By.xpath("//oj-button[@id=\'addAllToChosen\']/button/div"));
                driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                await element.click();
            }
            await driver.sleep(800);
            await admin.saveToShoppingCart(driver);
        },

        //
        // Create a FileStore from JMSServer Eclipse... menu
        //
        createFileStoreFromJMSServerEclipseMenu: async function (driver, jmsServer, fileStoreName) {
            await admin.goToNavTreeLevelThreeLink(driver, "configuration", "Services", "JMS Servers",
                jmsServer);
            await driver.sleep(4800);
            element = driver.findElement(By.xpath("//a[@id=\'moreIcon_PersistentStore\']/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(4800);
            await element.click();
            element = driver.findElement(By.xpath("//span[contains(.,\'Create New File Store...\')]"));
            await element.click();
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            console.log("Enter FileStore name: " + fileStoreName);
            await driver.findElement(By.id("Name|input")).sendKeys(fileStoreName);
            await driver.sleep(2400);

            console.log("Click create button to create " + fileStoreName);
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.save.id]]\']/button"));
            await driver.sleep(4800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            await admin.commitChanges(driver);
        },

        //
        // Create a JDBCStore from JMSServer Eclipse... menu
        //
        createJDBCStoreFromJMSServerEclipseMenu: async function (driver, jmsServer, jdbcStoreName) {
            await admin.goToNavTreeLevelThreeLink(driver, "configuration", "Services", "JMS Servers",
                jmsServer);
            await driver.sleep(4800);
            element = driver.findElement(By.xpath("//a[@id=\'moreIcon_PersistentStore\']/img"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(4800);
            await element.click();
            element = driver.findElement(By.xpath("//span[contains(.,\'Create New JDBC Store...\')]"));
            await element.click();
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            console.log("Enter JDBCStore name: " + jdbcStoreName);
            await driver.findElement(By.id("Name|input")).sendKeys(jdbcStoreName);
            await driver.sleep(4800);

            console.log("Click create button to create " + jdbcStoreName);
            element = await driver.findElement(
                By.xpath("//oj-button[@id=\'[[i18n.buttons.save.id]]\']/button"));
            await driver.sleep(4800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(4800);
            await admin.commitChanges(driver);
        },
    };
}
