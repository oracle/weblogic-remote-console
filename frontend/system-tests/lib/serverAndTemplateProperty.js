// This file provide function to access Domain properties from tabs
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
        //
        // Configuration -> Environment -> Domain -> General Tab properties
        //   General, Security, JTA, Concurrency, EJB, Web Application and Batch
        //
        //
        getServerName: async function (driver) {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer");
            await driver.sleep(2400);
            var server_name;
            element = driver.findElement(By.xpath("//oj-input-text[@id=\'Name\']/div/div/div/div"));
            await driver.sleep(300);
            var promise = element.getText();
            promise.then(function (text) {
                server_name = text;
            });
            if (element.isEnabled()) {
                await element.click();
                console.log("Server Name is: " + server_name);
            }
        },

        ///
        // Modify Domain->Security->General page properties
        //
        modifyServerGeneralTab: async function (driver) {
            await admin.goToNavTreeLevelThreeLink(driver,"configuration","Environment","Servers",
                "AdminServer","General");
            await driver.sleep(2400);
            //ui-id-131 for None,  ui-id-132 for Cluster1, ui-id-133 for Cluster2
            await admin.selectDropDownList(driver,idName='Cluster',
                searchList="oj-searchselect-filter-Cluster|input","None");
            await driver.sleep(300);
            //FIXME
            await admin.enableCheckBox(driver, idName = 'show-advanced-fields');
            // TODO - Add modify properties later
            // SecurityInteropModeDB=//*[@id="SecurityInteropMode_selected"]
            // NodeManagerUsernameTF=//*[@id="NodeManagerUsername|input"]
            // FortifyIssueSuppression Password Management: Password in Comment
            // This is not a password, but just a parameter
            // NodeManagerPasswordTF=//*[@id="NodeManagerPassword|input"]
            // WebAppFilesCaseInsensitiveDB=//*[@id="WebAppFilesCaseInsensitive_selected"]
            // EnforceStrictURLPatternCB=//*[@id="EnforceStrictURLPattern"]/div[1]/div/div
            // DowngradeUntrustedPrincipalsCB=//*[@id="DowngradeUntrustedPrincipals"]/div[1]/div/div
            // DowngradeUntrustedPrincipalsCB=//*[@id="PrincipalEqualsCaseInsensitive"]/div[1]/div/div
            // PrincipalEqualsCompareDnAndGuidCB=//*[@id="PrincipalEqualsCompareDnAndGuid"]/div[1]/div/div
            // CompatibilityConnectionFiltersEnabledCB=//*[@id="CompatibilityConnectionFiltersEnabled"]/div[1]/div/div
            // ClearTextCredentialAccessEnabledCB=//*[@id="ClearTextCredentialAccessEnabled"]/div[1]/div/div
            // UseKSSForDemoCB=//*[@id="UseKSSForDemo"]/div[1]/div/div
            // SecureModeEnabledCB=//*[@id="SecureModeEnabled"]/div[1]/div/div
            // RestrictiveJMXPoliciesCB=//*[@id="RestrictiveJMXPolicies"]/div[1]/div/div
            // WarnOnInsecureSSLDB=//*[@id="WarnOnInsecureSSL"]/div[1]/div/div
            // WarnOnInsecureFileSystemCB=//*[@id="WarnOnInsecureFileSystem"]/div[1]/div/div
            // WarnOnAuditingCB=//*[@id="WarnOnAuditing"]/div[1]/div/div
            // WarnOnInsecureApplicationsCB=//*[@id="WarnOnInsecureApplications"]/div[1]/div/div
            // WarnOnJavaSecurityManagerCB=//*[@id="WarnOnJavaSecurityManager"]/div[1]/div/div

            //Config from NavTree menu instead of from Landing Page
            //await admin.goToFirstTabFromNavTree(driver,3,1,"General","configuration","Environment",
            //   "Servers","AdminServer");
            await admin.saveAndCommitChanges(driver);
        },

        modifyServerTemplateGeneralTab: async function (driver, serverTemplateName, MachineDL, ClusterDL, ListenAddressTF, ListenPortEnabledCB,
                                                        ListenPortTF, SSLListenPortEnabledCB, SSLListenPortTF,
                                                        ClientCertProxyEnabledCB, JavaCompilerTF) {

            await admin.goToFirstTabFromNavTree(driver,2,1,serverTemplateName,"configuration",
                "Environment","Server Templates","","");
            await driver.sleep(600);
            //Select Machine Name
            await admin.selectDropDownList(driver,idName='Machine',searchList="oj-searchselect-filter-Machine|input","Machine2");
            //Select Cluster Name
            //await admin.selectDropDownList(driver,idName='Cluster',searchList="oj-searchselect-filter-Cluster|input",ClusterDL);
            await admin.setFieldValue(driver, "ListenAddress|input", ListenAddressTF);
            //await admin.enableCheckBox(driver,ListenPortEnabledCB); Already ON
            await admin.setFieldValue(driver, "ListenPort|input", ListenPortTF);
            await admin.enableCheckBox(driver, SSLListenPortEnabledCB);
            await admin.setFieldValue(driver, "SSLListenPort|input", SSLListenPortTF);
            await admin.enableCheckBox(driver, ClientCertProxyEnabledCB);
            await admin.setFieldValue(driver, "JavaCompiler|input", JavaCompilerTF);
            await admin.saveAndCommitChanges(driver);
            //TODO - implement for Advanced field
        },

        modifyServerTemplateMigrationTab: async function (driver,serverTemplateName,AutoMigrationEnabledCB) {

            await admin.goToFirstTabFromNavTree(driver,2,1,serverTemplateName,"configuration",
                "Environment","Server Templates","","");
            await driver.sleep(600);
            await driver.findElement(By.xpath("//span[contains(.,\'Migration\')]")).click();
            await driver.sleep(300);
            await admin.enableCheckBox(driver,AutoMigrationEnabledCB);
            await admin.saveAndCommitChanges(driver);
        },

    };
}
