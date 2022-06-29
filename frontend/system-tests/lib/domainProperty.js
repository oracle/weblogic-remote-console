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
        getDomainConfigurationProp: async function (driver) {
            await admin.goToConfigLandingPanelSubTreeCard(driver,"Configuration","EnvironmentChevron","Domain");
            await driver.sleep(800);
            var domain_name;
            element = driver.findElement(By.xpath("//oj-input-text[@id=\'Name\']/div/div/div/div"));
            await driver.sleep(300);
            var promise = element.getText();
            promise.then(function (text) {
                domain_name = text;
            });
            if (element.isEnabled()) {
                await element.click();
                console.log("Domain Name is: " + domain_name);
            }
        },

        /////////////////
        // Modify Domain->General page properties
        //
        modifyDomainGeneralTab: async function (driver, showAdvFieldsCB, enableAdminPortCB, adminPortTF,
                                                      productionModeCB, enableExalogicOptimizationsCB, enableClusterConstraintsCB,
                                                      enableOnDemandDeployCB, consoleEnabledCB, consoleContextPathTF,
                                                      consoleCookieNameTF, protectConsoleCookieCB, consoleSessionTimeoutTF,
                                                      minThreadsConsoleTF, consoleSSOLogoutUrlTF, consoleExtensionDirTF,
                                                      enableWSTestPageCB, adminProtocolTF, configAuditTypeDB,
                                                      configArchiveEnabledCB, archiveConfigCountTF, compatMBServerEnabledCB,
                                                      serverLogFormatEnabledCB, platformMBServerEnabledCB, platformMBServerUsedCB,
                                                      diagCtextCompatModeCB, enableCompliantClassloadingCB, enableImplicitBeanDisCB,
                                                      lifecycleManServAvaiDB, lifecycleManNotiEnabledCB, invocationTimeoutSecondsTF)
        {
            //await admin.goToFirstTab(driver, "Configuration", "EnvironmentChevron", "Domain", 1, "General");
            //1 is for no right/left arrow and the other 1 is for General Tab
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron", "Domain", 1, 1);
            await driver.sleep(600);
            await admin.enableCheckBox(driver, idName = 'show-advanced-fields');

            await admin.enableCheckBox(driver, idName = 'AdministrationPortEnabled');
            //await admin.setFieldValue(driver, idName = 'AdministrationPort|input', newValue=adminPortTF);
            await admin.enableCheckBox(driver, idName = 'ProductionModeEnabled');
            await admin.enableCheckBox(driver, idName = 'ExalogicOptimizationsEnabled');
            await admin.enableCheckBox(driver, idName = 'ClusterConstraintsEnabled');
            await admin.disableCheckBox(driver, idName = 'InternalAppsDeployOnDemandEnabled');
            await admin.enableCheckBox(driver, idName = 'ConsoleEnabled');
            await admin.setFieldValue(driver, idName = 'ConsoleContextPath|input', newValue=consoleContextPathTF);
            await admin.setFieldValue(driver, idName = 'AdminConsole_CookieName|input', newValue=consoleCookieNameTF);
            await admin.setFieldValue(driver, idName = 'AdminConsole_SessionTimeout|input', newValue=consoleSessionTimeoutTF);
            await admin.disableCheckBox(driver, idName = 'AdminConsole_ProtectedCookieEnabled');
            await admin.setFieldValue(driver, idName = 'AdminConsole_MinThreads|input', newValue = minThreadsConsoleTF);
            await admin.setFieldValue(driver, idName = 'AdminConsole_SSOLogoutURL|input', newValue=consoleSSOLogoutUrlTF);
            await admin.setFieldValue(driver, idName = 'ConsoleExtensionDirectory|input', newValue=consoleExtensionDirTF);
            //await admin.enableCheckBox(driver, idName = 'WebserviceTestpage_Enabled');
            await admin.setFieldValue(driver, idName = 'AdministrationProtocol|input', newValue=adminProtocolTF);
            await admin.enableCheckBox(driver, idName = 'CdiContainer_ImplicitBeanDiscoveryEnabled');
            //await admin.disableCheckBox(driver, idName = 'ConfigBackupEnabled');
            //await admin.selectDropDownValue(driver,idName="oj-searchselect-filter-ConfigurationAuditType|input","Audit");
            await admin.disableCheckBox(driver, idName = 'JMX_CompatibilityMBeanServerEnabled');
            await admin.enableCheckBox(driver, idName = 'LogFormatCompatibilityEnabled');
            await admin.enableCheckBox(driver, idName = 'JMX_PlatformMBeanServerEnabled');
            //await admin.disableCheckBox(driver, idName = 'PlatformMBeanServerUsed');
            await admin.enableCheckBox(driver, idName = 'DiagnosticContextCompatibilityModeEnabled');
            await admin.disableCheckBox(driver, idName = 'EnableEECompliantClassloadingForEmbeddedAdapters');
            await admin.setFieldValue(driver, idName = 'JMX_InvocationTimeoutSeconds|input', newValue=invocationTimeoutSecondsTF);
            //await admin.selectDropDownValue(driver,idName='DeploymentType',"Admin");

            await admin.saveAndCommitChanges(driver);
        },

        //
        /// Verify Domain->General page properties
        //
        verifyDomainGeneralTab: async function(driver)
        {
            //await admin.goToFirstTab(driver, "Configuration", "EnvironmentChevron", "Domain", 1, "General");
            //1 is for no right/left arrow and the other 1 is for General Tab
            await admin.goToFirstTab(driver, "Edit Tree", "EnvironmentChevron", "Domain", 1, 1);
            await driver.sleep(600);
            await admin.enableCheckBox(driver, idName='show-advanced-fields');

            console.log("Verify if AdministrationPortEnabled is enabled");
            assert.equal(true, await driver.findElement(By.id("AdministrationPortEnabled")).isEnabled());
            //console.log("Verify if AdminPort-SSL = 9002");
            //assert.equal("9002", await driver.findElement(By.id("AdministrationPort|input")).getAttribute('value'),"AdminPort-SSL")
            console.log("Verify if ProductionMode is enabled");
            assert.equal(true, await driver.findElement(By.id("ProductionModeEnabled")).isEnabled(),"ProductionMode");
            console.log("Verify if ExalogicOptimizationsEnabled is enabled");
            assert.equal(true, await driver.findElement(By.id("ExalogicOptimizationsEnabled")).isEnabled());
            console.log("Verify if ClusterConstraintsEnabled is enabled");
            assert.equal(true, await driver.findElement(By.id("ClusterConstraintsEnabled")).isEnabled(),"ClusterConstraintsEnabled");
            console.log("Verify if InternalAppsDeployOnDemandEnabled is enabled");
            assert.equal(true, await driver.findElement(By.id("InternalAppsDeployOnDemandEnabled")).isEnabled());
            console.log("Verify if InternalAppsDeployOnDemandEnabled is NOT enabled");
            assert.equal(false, await driver.findElement(By.id("ConsoleEnabled")).isSelected(),"ConsoleEnabled'");
            console.log("Verify if ProtectedCookieEnabled is enabled");
            assert.equal(true, await driver.findElement(By.id("AdminConsole_ProtectedCookieEnabled")).isEnabled(),"'ProtectedCookieEnabled'");
            console.log("Verify if ConsoleContextPath = console-1");
            assert.equal("console-1", await driver.findElement(By.id("ConsoleContextPath|input")).getAttribute('value'),"ConsoleContextPath|input");
        },

        ///
        // Modify Domain->Security->General page properties
        //
        modifyDomainSecurityGeneralTab: async function (driver,NodeManagerUsernameTF,NodeManagerPasswordTF,
                                                        WebAppFilesCaseInsensitiveDB,EnforceStrictURLPatternCB,
                                                        DowngradeUntrustedPrincipalsCB,PrincipalEqualsCaseInsensitiveDB,
                                                        PrincipalEqualsCompareDnAndGuidCB,CompatibilityConnectionFiltersEnabledCB,
                                                        ClearTextCredentialAccessEnabledCB,UseKSSForDemoCB,SecureModeEnabledCB,
                                                        RestrictiveJMXPoliciesCB,WarnOnInsecureSSLDB,WarnOnInsecureFileSystemCB,
                                                        WarnOnAuditingCB,WarnOnInsecureApplicationsCB,WarnOnJavaSecurityManagerCB,

                                                        DefaultRealmDB,AdministrativeIdentityDomainTF,
                                                        IdentityDomainAwareProvidersRequiredCB,ExcludedDomainNamesTF,
                                                        SecurityInteropModeDB,
                                                         )


        {
            //1 is for no right/left arrow and 3 is for Security Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3);
            await driver.sleep(600);
            await admin.enableCheckBox(driver,idName='show-advanced-fields');
            await driver.sleep(300);
            await admin.setFieldValue(driver,idName='SecurityConfiguration_NodeManagerUsername|input',newValue=NodeManagerUsernameTF);
            await admin.setFieldValue(driver,idName='SecurityConfiguration_NodeManagerPassword|input',newValue=NodeManagerPasswordTF);
            //await admin.selectDropDownValue(driver,idName="SecurityConfiguration_WebAppFilesCaseInsensitive",WebAppFilesCaseInsensitiveDB);
            await admin.selectDropDownList(driver,"SecurityConfiguration_WebAppFilesCaseInsensitive",
                "oj-searchselect-filter-SecurityConfiguration_WebAppFilesCaseInsensitive|input",WebAppFilesCaseInsensitiveDB)
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_EnforceStrictURLPattern');
            await admin.enableCheckBox(driver,idName='SecurityConfiguration_DowngradeUntrustedPrincipals');
            await admin.enableCheckBox(driver,idName='SecurityConfiguration_PrincipalEqualsCaseInsensitive');
            await admin.enableCheckBox(driver,idName='SecurityConfiguration_PrincipalEqualsCompareDnAndGuid');
            await admin.enableCheckBox(driver,idName='SecurityConfiguration_CompatibilityConnectionFiltersEnabled');
            await admin.enableCheckBox(driver,idName='SecurityConfiguration_ClearTextCredentialAccessEnabled');
            //await admin.enableCheckBox(driver,idName='UseKSSForDemo');
            //await admin.enableCheckBox(driver,idName='SecureModeEnabled');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_RestrictiveJMXPolicies');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_WarnOnInsecureSSL');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_WarnOnInsecureFileSystem');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_WarnOnAuditing');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_WarnOnInsecureApplications');
            await admin.disableCheckBox(driver,idName='SecurityConfiguration_SecureMode_WarnOnJavaSecurityManager');
            /*
            //await admin.selectDropDownValue(driver,idName='DefaultRealm_selected',selectValue=DefaultRealmDB,'N');
            await admin.setFieldValue(driver,idName='AdministrativeIdentityDomain|input',newValue=AdministrativeIdentityDomainTF);
            await admin.enableCheckBox(driver, idName='IdentityDomainAwareProvidersRequired');
            await admin.setFieldValue(driver,idName='ExcludedDomainNames|input',newValue=ExcludedDomainNamesTF);
            await driver.sleep(300);
            */
            await admin.saveAndCommitChanges(driver);
        },

        //
        /// Verify Domain->Security->General page properties
        //
        verifyDomainSecurityGeneralTab: async function(driver)
        {
            //1 is for no right/left arrow and 3 is for Security Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3);
            await driver.sleep(600);
            //*[@id="SecurityConfiguration_AdministrativeIdentityDomain|input"]
            assert.equal("", await driver.findElement(By.id("SecurityConfiguration_AdministrativeIdentityDomain|input")).getAttribute('value'),"SecurityConfiguration_AdministrativeIdentityDomain")
            assert.equal(true, await driver.findElement(By.id("SecurityConfiguration_IdentityDomainAwareProvidersRequired")).isEnabled(),"SecurityConfiguration_IdentityDomainAwareProvidersRequired");
            //assert.equal("myDomain.com'", await driver.findElement(By.id("ExcludedDomainNames|input")).getAttribute('value'),"ExcludedDomainNames");
        },

        ///
        // Modify Domain->Security->Filter page properties
        //
        modifyDomainSecurityFilterTab: async function (driver,ConnectionLoggerEnabledDB,ConnectionFilterTF,ConnectionFilterRuleTF)
        {
            //1(No left/right arrow), 3(Security), 5(Embedded LPAD)
            await admin.goToSecondTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3,3);
            await driver.sleep(300);
            await admin.enableCheckBox(driver, idName='SecurityConfiguration_ConnectionLoggerEnabled');
            await admin.setFieldValue(driver,idName='SecurityConfiguration_ConnectionFilter|input',newValue=ConnectionFilterTF);
            await admin.setFieldValue(driver,idName='SecurityConfiguration_ConnectionFilterRules|input',newValue=ConnectionFilterRuleTF);
            await admin.saveAndCommitChanges(driver);
        },

        ///
        // Modify Domain->Security->Embedded LDAP Page Properties
        //
        modifyDomainSecurityEmbeddedLDAPTab: async function (driver,EmbeddedLDAPCredentialTF,BackupHourTF,BackupMinuteTF,
                                                             BackupCopiesTF,CacheEnabledCB,CacheSizeTF,CacheTTLTF,
                                                             RefreshReplicaAtStartupCB,MasterFirstCB,TimeoutTF,
                                                             AnonymousBindAllowedCB)
        {
            //1 is for no right/left arrow and 3(Security), 5(Embedded LPAD)
            await admin.goToSecondTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3,5);
            await driver.sleep(300);
            await admin.setFieldValue(driver,"EmbeddedLDAP_Credential|input",EmbeddedLDAPCredentialTF);
            await admin.setFieldValue(driver,"EmbeddedLDAP_BackupHour|input",BackupHourTF);
            await admin.setFieldValue(driver,"EmbeddedLDAP_BackupMinute|input",BackupMinuteTF);
            await admin.setFieldValue(driver,"EmbeddedLDAP_BackupCopies|input",BackupCopiesTF);
            await admin.disableCheckBox(driver,idName='EmbeddedLDAP_CacheEnabled');
            await admin.setFieldValue(driver,"EmbeddedLDAP_CacheSize|input",CacheSizeTF);
            await admin.setFieldValue(driver,"EmbeddedLDAP_CacheTTL|input",CacheTTLTF);
            await admin.enableOjSwitchCheckBox(driver,idName='EmbeddedLDAP_RefreshReplicaAtStartup','3');
            await admin.enableOjSwitchCheckBox(driver,idName='EmbeddedLDAP_MasterFirst','3');
            await admin.setFieldValue(driver,"EmbeddedLDAP_Timeout|input",TimeoutTF);
            await admin.enableOjSwitchCheckBox(driver,idName='EmbeddedLDAP_AnonymousBindAllowed','3');

            await admin.saveAndCommitChanges(driver);
        },

        ///
        // Modify Domain->Security->SSL Certificate Revocation->General Tab page properties
        //
        modifyDomainSecuritySSLGeneralTab: async function (driver,CheckingEnabledCB,
                                                               MethodOrderDB,FailOnUnknownRevocStatusCB)
        {
            //1 is for no right/left arrow and 3(Security), 7(SSL Certificate Revocation Checking)
            await admin.goToSecondTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3,7);
            await driver.sleep(300);
            await admin.enableOjSwitchCheckBox(driver,idName='SecurityConfiguration_CertRevoc_CheckingEnabled','3');
            //await admin.selectDropDownValue(driver,idName="MethodOrder",MethodOrderDB);
            // Another way to select element from drop down list
            /* await admin.selectDropDownList(driver,idName="MethodOrder",idSearchList="oj-searchselect-filter-MethodOrder|input",
                                           searchItem=MethodOrderDB); */
            await admin.enableOjSwitchCheckBox(driver,idName='SecurityConfiguration_CertRevoc_FailOnUnknownRevocStatus','3');
            await admin.saveAndCommitChanges(driver);
        },

        ///
        // Modify Configuration>Environment->Domain->Security->SSL->OCSP Properties
        //
        modifyDomainSecuritySSLOCSPTab: async function (driver,OcspNonceEnabledCB,OcspResponseCacheEnabledCB)
        {
            //1 is for no right/left arrow and 3(Security), 7(SSL), 3(OCSP)
            await admin.goToThirdTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3,7,3);
            await driver.sleep(300);
            await admin.enableCheckBox(driver,'show-advanced-fields');
            await admin.enableCheckBox(driver,OcspNonceEnabledCB);
            await admin.disableOjSwitchCheckBox(driver,idName=OcspResponseCacheEnabledCB,'3');
            await admin.saveAndCommitChanges(driver);
        },


        /////////////////
        // Modify Configuration>Environment->Domain->Security->SSL->CRL Page Properties
        //
        modifyDomainSecuritySSLCRLTab: async function (driver,CrlDpEnabledCB,CrlCacheRefreshTF,CrlDpDownloadTimeoutTF)
        {
            //1 is for no right/left arrow and 3(Security), 7(SSL), 5(CRL)
            await admin.goToThirdTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,3,7,5);
            await driver.sleep(300);
            await admin.enableCheckBox(driver,'show-advanced-fields');
            await admin.enableCheckBox(driver,CrlDpEnabledCB);
            await admin.setFieldValue(driver,'SecurityConfiguration_CertRevoc_CrlCacheRefreshPeriodPercent|input',CrlCacheRefreshTF);
            await admin.setFieldValue(driver,'SecurityConfiguration_CertRevoc_CrlDpDownloadTimeout|input',CrlDpDownloadTimeoutTF);
            await driver.sleep(300);
            await admin.saveAndCommitChanges(driver);
        },

        /////////////////
        // Modify Domain -> Concurrency Page Properties
        //
        modifyDomainConcurrencyTab: async function (driver,MaxConcurrentNewThreadsTF,MaxConcurrentLongRunningRequestsTF)
        {
            //1 is for no right/left arrow and 5 is for Concurrency Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,5);
            await driver.sleep(300);
            await admin.setFieldValue(driver,'MaxConcurrentNewThreads|input',MaxConcurrentNewThreadsTF);
            await admin.setFieldValue(driver,'MaxConcurrentLongRunningRequests|input',MaxConcurrentLongRunningRequestsTF);
            await admin.saveToShoppingCart(driver);
        },

        /////////////////
        // Modify Domain -> WebApplication Page Properties
        //
        modifyDomainWebApplicationTab: async function (driver,ReloginEnabledCB,AllowAllRolesCB,FilterDispatchedRequestsEnabledCB,
                                                       OverloadProtectionEnabledCB,XPoweredByHeaderLevelDB,MimeMappingFileTF,
                                                       OptimisticSerializationCB,RtexprvalueJspParamNameCB,ClientCertProxyEnabledCB,
                                                       HttpTraceSupportEnabledCB,WeblogicPluginEnabledCB,AuthCookieEnabledCB,
                                                       ChangeSessionIDOnAuthenticationCB,WAPEnabledCB,PostTimeoutSecsTF,
                                                       MaxPostTimeSecsTF,MaxPostSizeTF,WorkContextPropagationEnabledCB,
                                                       P3PHeaderValueTF,JSPCompilerBackwardsCompatibleCB,
                                                       ShowArchivedRealPathEnabledCB,GzipCompressionEnabledCB,
                                                       GzipCompressionMinContentLengthTF,GzipCompressionContentTypeTF,
                                                       HeaderTableSizeTF,MaxConcurrentStreamsTF,InitialWindowSizeTF,
                                                       MaxFrameSizeTF,MaxHeaderListSizeTF)
        {
            //1 is for no right/left arrow and 7 is for WebApplication Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,7);
            await driver.sleep(300);

            await admin.enableOjSwitchCheckBox(driver,idName=ReloginEnabledCB,'3');
            await admin.enableOjSwitchCheckBox(driver,idName=AllowAllRolesCB,'3');
            await admin.enableCheckBox(driver,FilterDispatchedRequestsEnabledCB);
            await admin.enableCheckBox(driver,OverloadProtectionEnabledCB);
            await admin.selectDropDownList(driver,idName="WebAppContainer_XPoweredByHeaderLevel",
                                                  idSearchList="oj-searchselect-filter-WebAppContainer_XPoweredByHeaderLevel|input",
                                                  searchItem=XPoweredByHeaderLevelDB);
            //Another way to select element in a drop down List
            //await admin.selectDropDownValue(driver,idName="XPoweredByHeaderLevel",XPoweredByHeaderLevelDB);
            await admin.setFieldValue(driver,'WebAppContainer_MimeMappingFile|input',MimeMappingFileTF);
            await admin.enableCheckBox(driver,OptimisticSerializationCB);
            await admin.enableCheckBox(driver,RtexprvalueJspParamNameCB);
            await admin.enableCheckBox(driver,ClientCertProxyEnabledCB);
            await admin.enableCheckBox(driver,HttpTraceSupportEnabledCB);
            await admin.enableCheckBox(driver,WeblogicPluginEnabledCB);
            await admin.disableOjSwitchCheckBox(driver,idName=AuthCookieEnabledCB,'3')
            await admin.enableCheckBox(driver,ChangeSessionIDOnAuthenticationCB);
            await admin.disableOjSwitchCheckBox(driver,idName=WAPEnabledCB,'3')
            await admin.setFieldValue(driver,'WebAppContainer_PostTimeoutSecs|input',PostTimeoutSecsTF);
            await admin.setFieldValue(driver,'WebAppContainer_MaxPostTimeSecs|input',MaxPostTimeSecsTF);
            await admin.setFieldValue(driver,'WebAppContainer_MaxPostSize|input',MaxPostSizeTF);
            await admin.disableOjSwitchCheckBox(driver,idName=WorkContextPropagationEnabledCB,'3')
            await admin.setFieldValue(driver,'WebAppContainer_P3PHeaderValue|input',P3PHeaderValueTF);
            await admin.enableCheckBox(driver,JSPCompilerBackwardsCompatibleCB);
            await admin.enableCheckBox(driver,ShowArchivedRealPathEnabledCB);
            await admin.enableCheckBox(driver,GzipCompressionEnabledCB);
            await admin.setFieldValue(driver,'WebAppContainer_GzipCompression_GzipCompressionMinContentLength|input',GzipCompressionMinContentLengthTF);
            await admin.setFieldValue(driver,'WebAppContainer_GzipCompression_GzipCompressionContentType|input',GzipCompressionContentTypeTF);
            await admin.setFieldValue(driver,'WebAppContainer_P3PHeaderValue|input',HeaderTableSizeTF);
            await admin.setFieldValue(driver,'WebAppContainer_Http2Config_MaxConcurrentStreams|input',MaxConcurrentStreamsTF);
            await admin.setFieldValue(driver,'WebAppContainer_Http2Config_InitialWindowSize|input',InitialWindowSizeTF);
            await admin.setFieldValue(driver,'WebAppContainer_Http2Config_MaxFrameSize|input',MaxFrameSizeTF);
            await admin.setFieldValue(driver,'WebAppContainer_Http2Config_MaxHeaderListSize|input',MaxHeaderListSizeTF);

            await admin.saveAndCommitChanges(driver);
        },

        /////////////////
        // Modify Domain -> Logging Page Properties
        //
        modifyDomainLoggingTab: async function(driver,FileNameTF,RotationTypeCB,FileMinSizeTF,RotationTimeTF,
                                               FileTimeSpanTF,NumberOfFilesLimitedCB,FileCountTF,LogFileRotationDirTF,
                                               RotateLogOnStartupCB,DateFormatPatternTF,BufferSizeKBTF)
        {
            //1 is for no right/left arrow and 11 is for Batch Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,9);
            await driver.sleep(300);
            await admin.enableCheckBox(driver,'show-advanced-fields');
            await admin.setFieldValue(driver,'Log_FileName|input',FileNameTF);
            //await admin.selectDropDownValue(driver,idName="RotationType",RotationTypeCB);
            await admin.selectDropDownList(driver,idName="Log_RotationType",
                idSearchList="oj-searchselect-filter-Log_RotationType|input",
                searchItem=RotationTypeCB);
            //await admin.setFieldValue(driver,'Log_FileMinSize|input',FileMinSizeTF);
            //await admin.setFieldValue(driver,'Log_RotationTime|input',RotationTimeTF);
            //await admin.setFieldValue(driver,'Log_FileTimeSpan|input',FileTimeSpanTF);
            await admin.enableCheckBox(driver,NumberOfFilesLimitedCB);
            await admin.setFieldValue(driver,'Log_FileCount|input',FileCountTF);
            await admin.setFieldValue(driver,'Log_LogFileRotationDir|input',LogFileRotationDirTF);
            await admin.enableCheckBox(driver,RotateLogOnStartupCB);
            await admin.setFieldValue(driver,'Log_DateFormatPattern|input',DateFormatPatternTF);
            await admin.setFieldValue(driver,'Log_BufferSizeKB|input',BufferSizeKBTF);

            await admin.saveAndCommitChanges(driver);
        },


        /////////////////
        // Modify Domain -> Batch Page Properties
        //
        modifyDomainBatchTab: async function(driver,BatchJobsDataSourceJndiNameTF,SchemaNameFT,BatchJobsExecutorServiceNameTF)
        {
            //1 is for no right/left arrow and 11 is for Batch Tab
            await admin.goToFirstTab(driver,"Edit Tree","EnvironmentChevron","Domain",1,11);
            await driver.sleep(300);
            await admin.setFieldValue(driver,'BatchJobsDataSourceJndiName|input',BatchJobsDataSourceJndiNameTF);
            await admin.setFieldValue(driver,'BatchConfig_SchemaName|input',SchemaNameFT);
            await admin.setFieldValue(driver,'BatchJobsExecutorServiceName|input',BatchJobsExecutorServiceNameTF);
            await admin.saveAndCommitChanges(driver);
        },

    };
}
