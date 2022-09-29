// This file provide function to access security
//    Realms, Certificate Authority Overrides, JASPICAuth Config Providers and Webservice Securities
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
        // Create a new Realm
        //
        createRealm: async function (driver,realmName)
        {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","SecurityChevron","Realms",0);
            await driver.sleep(2400);

            element = await driver.findElement(By.xpath("//oj-button[@id=\'[[i18n.buttons.new.id]]\']/button/div/span/img"));
            await driver.sleep(4800);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Enter object name: " + realmName);
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).click();
            await driver.sleep(4800);
            await driver.findElement(By.id("Name|input")).clear();
            await driver.findElement(By.id("Name|input")).sendKeys(realmName);
            await driver.sleep(900);
            await admin.saveToShoppingCart(driver);
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Authentication Providers","testAuthenticatorProvider-1",
            "searchselect","oj-searchselect-filter-Type|input","Type|input","Default Authenticator");
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Authentication Providers","testDefaultIdentityAsserter-1",
            "searchselect","oj-searchselect-filter-Type|input","Type|input","Default Identity Asserter");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Authorizers","testAuthorizer-1");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Cert Path Providers","testCertPathProvider-1");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Credential Mappers","testCredentialMapper-1");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Password Validators","testPasswordValidator-1");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.createMBeanFromMenuDropDown(driver,"Role Mappers","testRoleMapper-1");

            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",realmName);
            await driver.sleep(3600);
            await admin.goToTabName(driver,"Cert Path Builder");
            console.log("Click Cert Path Builder drop down menu");
            await admin.selectDropDownList(driver,"CertPathBuilder",
                "oj-searchselect-filter-CertPathBuilder|input","ProvidertestCertPathProvider-1")
            await driver.sleep(2400);

            //await admin.saveAndCommitChanges(driver);
            await admin.saveToShoppingCart(driver);
            await driver.sleep(8400);
            await admin.commitChanges(driver);
        },

        ///
        // Modify Realms->General tab properties
        //
        modifyRealmsGeneralTab: async function (driver,realmName,tabName,showAdvCB,
                                                securityModelDefaultDB,combinedRoleMappingEnabledCB)
        {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Security","Realms",
                        realmName,tabName);
            await driver.sleep(300);
            if (showAdvCB == true)
                await admin.enableCheckBox(driver,'show-advanced-fields');
            await driver.sleep(1200);
            await admin.selectDropDownValue(driver,"SecurityDDModel",securityModelDefaultDB);
            await admin.enableCheckBox(driver,combinedRoleMappingEnabledCB);
            await admin.saveAndCommitChanges(driver);
        },



    };
}