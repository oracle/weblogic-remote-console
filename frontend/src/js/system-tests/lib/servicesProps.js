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

    };
}
