// This file provide function to access Machine and Cluster properties from tabs
//    to pages: General, Security, JTA, Concurency, EJB, Web Application and Batch
//    TODO task will be iplemented later

const {By, until, webdriver} = require("selenium-webdriver");

const Admin = require('./admin');
const assert = require('assert');

module.exports = function (driver, file) {
    this.driver = driver;
    let element;
    admin = new Admin(driver, file);

    return {
        ///
        // Modify Cluster->General tab properties
        //
        modifyClusterGeneralTab: async function (driver,clusterName,tabName,loadAlgorithmDL,
                                                 clusterAddressTF,numberServersInClusterTF,
                                                 txnAffinityEnabledCB,concurrentSingletonActivationEnabledCB,
                                                 weblogicPluginEnabledCB,serviceAgeThresholdSecondTF,
                                                 serviceActivationRequestResponseTimeoutTF,memberWarmupTimeoutSecondTF)
        {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Clusters");
            await driver.sleep(2400);
            console.log("Click " +clusterName+" NavTree link.");
            element = driver.findElement(By.xpath("//td[contains(.,\'"+clusterName+"\')]"));
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            await admin.enableCheckBox(driver,idName='show-advanced-fields');
            await driver.sleep(900);
            //await admin.selectDropDownValue(driver,"oj-searchselect-filter-DefaultLoadAlgorithm|input",loadAlgorithmDL);
            await admin.selectDropDownList(driver,"DefaultLoadAlgorithm",
                "oj-searchselect-filter-DefaultLoadAlgorithm|input",loadAlgorithmDL);
            await admin.setFieldValue(driver, "ClusterAddress|input",clusterAddressTF);
            await admin.setFieldValue(driver, "NumberOfServersInClusterAddress|input",numberServersInClusterTF);
            await admin.enableOjSwitchCheckBox(driver,txnAffinityEnabledCB,"3");
            await admin.enableOjSwitchCheckBox(driver,concurrentSingletonActivationEnabledCB,"3");

            //Advanced Fields Test
            await admin.enableOjSwitchCheckBox(driver,weblogicPluginEnabledCB,"3");
            await driver.sleep(300);
            await admin.setFieldValue(driver,"ServiceAgeThresholdSeconds|input",serviceAgeThresholdSecondTF);
            await admin.setFieldValue(driver,"ServiceActivationRequestResponseTimeout|input",serviceActivationRequestResponseTimeoutTF);
            await admin.setFieldValue(driver,"MemberWarmupTimeoutSeconds|input",memberWarmupTimeoutSecondTF);

            await admin.saveToShoppingCart(driver);
            await driver.sleep(4800);
            await admin.discardChanges(driver);
        },

        modifyMachineNodeManagerTab: async function (driver,machineName,tabName,NMTypeDL,listenAddressTF,listenPortTF,
                                                     nodeManagerHomeTF,shellCommandTF,debugEnabledCB)
        {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Machines",
                machineName,tabName);
            await driver.sleep(1200);
            console.log("Click Node Manager tab");
            await driver.findElement(By.xpath("//div/ul/li[3]/a/span")).click();

            await admin.selectDropDownValue(driver,"NMType|input",NMTypeDL);
            await admin.setFieldValue(driver, "ListenAddress|input",listenAddressTF);
            await admin.setFieldValue(driver, "ListenPort|input",listenPortTF);
            await admin.setFieldValue(driver, "NodeManagerHome|input",nodeManagerHomeTF);
            await admin.setFieldValue(driver, "ShellCommand|input",shellCommandTF);
            await admin.enableOjSwitchCheckBox(driver,debugEnabledCB,"3");
            await admin.saveAndCommitChanges(driver);
        },

        deleteCluster: async function(driver,clusterName) 
        {
            await admin.goToLandingPanelSubTreeCard(driver,"Edit Tree","EnvironmentChevron","Clusters");
            await driver.sleep(1200);
            console.log("Click Configuration-> Environment-> Clusters-> "+clusterName+" delete row button");
            // 3 in the row = <clusterName>
            await driver.findElement(By.xpath("//tr[3]/td/oj-button/button/div/span/span")).click();
            await driver.sleep(1200);
            await admin.commitChanges(driver);
            await driver.sleep(1200);
        }

    };
}
