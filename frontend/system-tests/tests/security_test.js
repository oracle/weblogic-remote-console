// Create, modify and verify:
// Configuration -> Security
//     Realms, JASPIC:AuthConfigProvider, Certificate Authority Overrides, Webservices Security
//
'use strict';

const {Builder, By, Key, until} = require('selenium-webdriver')
const assert = require('assert')

// Initialize type of browser driver
const getDriver = require('../lib/browser');

// Get AdminServer properties
const Admin = require('../lib/admin');
const browser = require('../lib/admin').browserName;

// Get Services functions
const Security = require('../lib/securityProps');

// Services Configuration Test Suite
describe.only('Test Suite: security_test for Realms, Certificate Authority Overrides, Webservices Security',
    function () {
    let driver;
    let file = "security.png";
    let element;
    let admin;
    let security;
    var sec = 1000;
    this.timeout(8000 * sec);

    beforeEach(async function () {
        // Get Browser driver
        driver = getDriver(browser);
        await driver.manage().window().maximize();
        admin = new Admin(driver, file);
        security = new Security(driver,file);
    })
    afterEach(async function () {
        await driver.quit();
    })

    //Test Case:
    // Create Realm (testRealm-1)
    //
    //
    it('1. Test Category: GAT/Risk1\n \t Test Scenario: create and save testRealm-1 ',
        async function () {
        file = "testRealm-1.png";
        try {
            await security.createRealm(driver,"testRealm-1");
            await driver.sleep(3600);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Modify realm (testRealm-1) for Security Model Default and Combined Role Mapping Enabled options.
    //
    it('2. Test Category: GAT/Risk1\n \t Test Scenario: modify and delete Realms: testRealm-1 ',
        async function () {
        file = "testMyRealm-1.png";
        try {
            await security.modifyRealmsGeneralTab(driver,"testRealm-1","general",true,"Advanced",
                "CombinedRoleMappingEnabled");
            await driver.sleep(6400);
            await admin.deleteMBeanObject(driver,"testRealm-1","Realms",2,"configuration",
                "Security","Realms","","","",3);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JASPIC (testAuthConfigProvider-1)
    // Delete testAuthConfigProvider-1
    //
    it.skip('3. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testAuthConfigProvider-1 ',
        async function () {
        file = "testAuthConfigProvider-1.png";
        try {
            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","SecurityChevron","Domain/JASPIC",5);
            await driver.sleep(6400);
            await admin.createMBeanFromMenuDropDown(driver,"Auth Config Providers","testAuthConfigProvider-1");
            await admin.commitChanges(driver);

            await admin.goToLandingPanelSubTreeCard(driver,"Configuration","SecurityChevron","Domain/JASPIC",5);
            await driver.sleep(6400);
            await driver.findElement(By.css(".oj-end")).click();
            await driver.findElement(By.xpath("//span[contains(.,\'Auth Config Providers\')]")).click();
            await driver.sleep(6400);
            await admin.deleteMBeanFromLandingPage(driver,"JASPIC/AuthConfigProviders","testAuthConfigProvider-1");
            await driver.sleep(6400);
            await admin.commitChanges(driver);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JTA (testCertAuthOverrides-1)
    // Delete testCertAuthOverrides-1
    //
    it('4. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testCertAuthOverrides-1 ',
        async function () {
        file = "testCertAuthOverrides-1.png";
        try {
            await admin.createNewMBeanObject(driver,"testCertAuthOverrides-1", 2, "configuration", "Security",
                "Certificate Authority Overrides");
            await admin.deleteMBeanObject(driver,"testCertAuthOverrides-1","Certificate Authority Overrides",2,"configuration",
                "Security","Certificate Authority Overrides","","","",2);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

    //Test Case:
    // Create JTA (testWebserviceSecurities-1)
    // Delete testWebserviceSecurities-1
    //
    it('5. Test Category: GAT/Risk1\n \t Test Scenario: create/save/delete testCertAuthOverrides-1 ',
        async function () {
        file = "testWebserviceSecurities-1.png";
        try {
            await admin.createNewMBeanObject(driver, "testWebserviceSecurities-1", 2, "configuration", "Security",
                "Webservice Securities");
            await admin.deleteMBeanObject(driver,"testWebserviceSecurities-1","Webservice Securities",2,"configuration",
                "Security","Webservice Securities","","","",1);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

     //Test Case:
    // Create -> select to negate/remove/save and delete Edit Policy for ManagedServer1)
    //
    it('6. Test Category: GAT/Risk1\n \t Test Scenario: Create -> select to negate/remove/save ' +
        'and delete Edit Policy for ManagedServer1',
        async function () {
        file = "testBasicPolicyEditorForManagedServer1.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer1");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Role, 1st element in the list");
            await driver.findElement(By.xpath("//li[1]")).click();
            await driver.sleep(800);
            console.log("Enter Role Argument Name = role1");
            await driver.findElement(By.xpath("//*[@id='Role Argument Name|input']")).sendKeys("role1");
            console.log("Click Ok button");
            element = driver.findElement(By.xpath("//*[@id='dlgOkBtn23']/button"));
            await driver.sleep(800);
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Select Role1 policy checkbox");
            await driver.findElement(
                By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
            console.log("Select negate button");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//oj-button[@id='negate']/button/div/span[2]")).click();
            console.log("Select reset button");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//oj-button[@id='reset']/button/div/span[2]")).click();
            await driver.executeScript("window.scrollTo(0,0)")
            console.log("Select remove button");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })

        //Test Case:
        // Select group, role, user Policy for ManagedServer2
        //
        it('7. Test Category: GAT/Risk1\n \t Test Scenario: Select Group, Role, User Policy for ManagedServer2',
            async function () {
                file = "testUserGroupRolePolicyManagedServer2.png";
                try {
                    await admin.goToNavTreeLevelSevenLink(driver,"security","Realms","myrealm", "Authorizers",
                        "XACMLAuthorizer","Servers","ManagedServer2","lock");
                    await driver.sleep(8400);
                    console.log("Click Add Policy Condition");
                    element = driver.findElement(By.xpath("//*[@id='addConditionLauncher']/img"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Click Predicate Policy List");
                    await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
                    await driver.sleep(800);
                    console.log("Select User, 3rd element in the list");
                    await driver.findElement(By.xpath("//li[3]")).click();
                    await driver.sleep(800);
                    console.log("Enter Role Argument Name = user1");
                    element = driver.findElement(By.xpath("//input[@id='User Argument Name|input']"));
                    await element.click();
                    await element.sendKeys("user1");
                    await driver.sleep(800);
                    console.log("Enter <RETURN> key");
                    await element.sendKeys(Key.ENTER);
                    await driver.sleep(800);
                    console.log("Click OK button");
                    await driver.findElement(By.xpath("//span[starts-with(@id,'dlgOkBtn23')]")).click();
                    await driver.sleep(1200);
                    console.log("Click Save button");
                    element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Select user1 policy checkbox");
                    await driver.findElement(
                        By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
                    await driver.sleep(1200);
                    console.log("Click Add Policy Condition");
                    element = driver.findElement(By.xpath("//*[@id='addConditionLauncher']/img"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Select to Add Above Checked Condition");
                    await driver.findElement(By.xpath("//span[contains(.,'Add Above Checked Condition...')]")).click();
                    await driver.sleep(1200);
                    console.log("Click Predicate Policy List");
                    await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
                    await driver.sleep(800);
                    console.log("Select Group, 2nd element in the list");
                    await driver.findElement(By.xpath("//li[2]")).click();
                    await driver.sleep(800);
                    console.log("Enter Role Argument Name = group1");
                    await driver.findElement(By.xpath("//*[@id='Group Argument Name|input']")).sendKeys("group1");
                    console.log("Click Cancel button");
                    element = driver.findElement(By.xpath("//*[@id='dlgOkBtn23']/button"));
                    await driver.sleep(8800);
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    await driver.sleep(800);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Click Save button");
                    element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Select group1 policy checkbox");
                    await driver.findElement(By.xpath("//*[@id='policy-conditions-table']/div[1]/table/tbody/tr[1]/td[1]")).click();
                    await driver.sleep(1200);
                    console.log("Click Add Policy Condition");
                    element = driver.findElement(By.xpath("//*[@id='addConditionLauncher']/img"));
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Select to Add Below Checked Condition");
                    await driver.findElement(By.xpath("//span[contains(.,'Add Below Checked Condition...')]")).click();
                    await driver.sleep(1200);
                    console.log("Click Predicate Policy List");
                    await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
                    await driver.sleep(800);
                    console.log("Select Role, 1st element in the list");
                    await driver.findElement(By.xpath("//li[1]")).click();
                    await driver.sleep(800);
                    console.log("Enter Role Argument Name = role1");
                    await driver.findElement(By.xpath("//*[@id='Role Argument Name|input']")).sendKeys("role1");
                    console.log("Click Ok button");
                    element = driver.findElement(By.xpath("//*[@id='dlgOkBtn23']/button"));
                    await driver.sleep(8800);
                    driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
                    await driver.sleep(800);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("Click Save button");
                    element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    let i = 0;
                    while (i <3) {
                        console.log("Select checkbox");
                        await driver.findElement(By.xpath("//*[@id='policy-conditions-table']/div[1]/table/tbody/tr[1]/td[1]")).click();
                        await driver.sleep(1200);
                        console.log("Select remove button "+i+" Policy name");
                        await driver.sleep(800);
                        await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
                        await driver.sleep(1200);
                        i++;
                    }
                    await driver.sleep(1200);
                    console.log("Click Save button");
                    element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
                    await driver.sleep(2400);
                    if (element.isEnabled()) {
                        await element.click();
                    }
                    await driver.sleep(1200);
                    console.log("TEST PASS ");
                } catch (e) {
                    await admin.takeScreenshot(driver, file);
                    console.log(e.toString() + " TEST FAIL");
                }
            })

    //Test case:
    // Create -> Test Group Name Argument Policy for ManagedServer1)
    //
    it('8. Test Category: GAT/Risk1\n \t Test Scenario:  Test Group Name Argument Policy for ManagedServer3 ',
        async function () {
        file = "testGroupPolicyManagedServer3.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer3");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Group has the same Identity Domain as the Resource Identity Domain, 4th element in the list");
            await driver.findElement(By.xpath("//li[4]")).click();
            await driver.sleep(800);
            console.log("Enter Group Name Argument = group-resource-identity-1");
            await driver.findElement(By.xpath("//*[@id='Group Name Argument|input']")).sendKeys("group-resource-identity-1");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='Group Name Argument|input']")).sendKeys(Key.ENTER);
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(800);
            console.log("Select group policy checkbox");
            await driver.findElement(
                By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
            await driver.sleep(800);
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("Select to Add Above Checked Condition");
            await driver.findElement(By.xpath("//span[contains(.,'Add Above Checked Condition...')]")).click();
            await driver.sleep(1200);
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Group has the same Identity Domain as the specified Identity Domain, 4th element in the list");
            await driver.findElement(By.xpath("//li[5]")).click();
            await driver.sleep(800);
            console.log("Enter Group Name Argument = GroupName-1");
            await driver.findElement(By.xpath("//*[@id='Group Name Argument|input']")).sendKeys("GroupName-1");
            console.log("Enter Identity Domain Argument = IdentityDomain-1");
            await driver.findElement(By.xpath("//*[@id='Identity Domain Argument|input']")).sendKeys("IdentityDomain-1");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='Group Name Argument|input']")).sendKeys(Key.ENTER);
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(800);
            let j = 0;
            while (j <2) {
                console.log("Select checkbox");
                await driver.findElement(By.xpath("//*[@id='policy-conditions-table']/div[1]/table/tbody/tr[1]/td[1]")).click();
                await driver.sleep(1200);
                console.log("Select remove button "+j+" Policy name");
                await driver.sleep(800);
                await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
                await driver.sleep(1200);
                j++;
            }
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


     //Test Case:
    // Create -> select Access occurs before for ManagedServer1)
    //
    it('9. Test Category: GAT/Risk1\n \t Test Scenario: Create -> select Access occurs before ' +
        'for ManagedServer1',
        async function () {
        file = "testBasicPolicyEditorManagedServer1.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer1");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Access occurs before, 7th element in the list");
            await driver.findElement(By.xpath("//li[7]")).click();
            await driver.sleep(800);
            console.log("Enter Date|input = 2023-07-12 01:02:03");
            await driver.findElement(By.xpath("//*[@id='Date|input']")).sendKeys("2023-07-12 01:02:03");
            await driver.sleep(800);
            console.log("Enter GMT offset|input = GMT+5:00");
            await driver.findElement(By.xpath("//*[@id='GMT offset|input']")).sendKeys("GMT+5:00");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='GMT offset|input']")).sendKeys(Key.ENTER);
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(2400);
            console.log("Select policy checkbox");
            await driver.findElement(
                By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
            console.log("Select remove button");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


     //Test Case:
    // Create -> select Access occurs before for ManagedServer1)
    //
    it('10. Test Category: GAT/Risk1\n \t Test Scenario: Create -> select Allow access to everyone ' +
        'for ManagedServer2',
        async function () {
        file = "testAllowAccessPolicyManagedServer2.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer2");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Allow access to everyone, 9th element in the list");
            await driver.findElement(By.xpath("//li[9]")).click();
            await driver.sleep(800);
            console.log("Click Ok button");
            element = driver.findElement(By.xpath("//*[@id='dlgOkBtn23']/button"));
            await driver.sleep(800);
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(8800);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Server is in development mode, 10th element in the list");
            await driver.findElement(By.xpath("//li[10]")).click();
            await driver.sleep(800);
            console.log("Click Ok button");
            element = driver.findElement(By.xpath("//*[@id='dlgOkBtn23']/button"));
            await driver.sleep(800);
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(800);
            if (element.isEnabled()) {
                await element.click();
            }
            let j = 0;
            while (j <2) {
                console.log("Select checkbox");
                await driver.findElement(By.xpath("//*[@id='policy-conditions-table']/div[1]/table/tbody/tr[1]/td[1]")).click();
                await driver.sleep(1200);
                console.log("Select remove button "+j+" Policy name");
                await driver.sleep(800);
                await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
                await driver.sleep(1200);
                j++;
            }
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


     //Test Case:
    // Create -> select Context element's value equals a string constant for ManagedServer1)
    //
    it('11. Test Category: GAT/Risk1\n \t Test Scenario: Select Context element value equals a string constant ' +
        'for ManagedServer1',
        async function () {
        file = "testContextElementStringManagedServer1.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer1");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Context element's value equals a string constant, 12th element in the list");
            await driver.findElement(By.xpath("//li[12]")).click();
            await driver.sleep(800);
            console.log("Enter Context element name|input = ctxName-1");
            await driver.findElement(By.xpath("//*[@id='Context element name|input']")).sendKeys("ctxName-1");
            await driver.sleep(800);
            console.log("Enter String value|input = testValue");
            await driver.findElement(By.xpath("//*[@id='String value|input']")).sendKeys("testValue");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='String value|input']")).sendKeys(Key.ENTER);
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(2400);
            console.log("Select policy checkbox");
            await driver.findElement(
                By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
            console.log("Select remove button");
            await driver.sleep(8800);
            await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


     //Test Case:
    // Create -> select Context element's value equals a numeric constant for ManagedServer1)
    //
    it('12. Test Category: GAT/Risk1\n \t Test Scenario: Select Context element value equals a string constant ' +
        'for ManagedServer2',
        async function () {
        file = "testContextElementValueManagedServer2.png";
        try {
            await admin.goToNavTreeLevelSixLink(driver,"security","Realms","myrealm",
                "Authorizers","XACMLAuthorizer","Servers","ManagedServer2");
            console.log("Click Add Policy Condition");
            element = driver.findElement(By.xpath("//a[@id='addConditionLauncher']/span"));
            driver.executeScript("arguments[0].scrollIntoView({block:'center'})", element);
            await driver.sleep(1200);
            if (element.isEnabled()) {
                await element.click();
            }
            console.log("Click Predicate Policy List");
            await driver.findElement(By.xpath("//oj-input-text[@id='oj-searchselect-filter-predicate']/div/span/a")).click();
            await driver.sleep(800);
            console.log("Select Context element's value equals a numeric constant, 28th element in the list");
            await driver.findElement(By.xpath("//*[@id='oj-searchselect-filter-predicate|input']"))
                .sendKeys("Context element's value is less than a numeric constant");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='oj-searchselect-filter-predicate|input']")).sendKeys(Key.ENTER);
            await driver.sleep(800);
            console.log("Enter Context element name|input = ctxName-2");
            await driver.findElement(By.xpath("//*[@id='Context element name|input']")).sendKeys("ctxName-12");
            await driver.sleep(800);
            console.log("Enter String value|input = 123456");
            await driver.findElement(By.xpath("//*[@id='Numeric value|input']")).sendKeys("123456");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//*[@id='Numeric value|input']")).sendKeys(Key.ENTER);
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(800);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(2400);
            console.log("Select policy checkbox");
            await driver.findElement(
                By.xpath("//input[@type='checkbox' and @class='oj-selectorbox']")).click();
            console.log("Select remove button");
            await driver.sleep(800);
            await driver.findElement(By.xpath("//oj-button[@id='remove']/button/div/span[2]")).click()
            await driver.sleep(1200);
            console.log("Click Save button");
            element = driver.findElement(By.xpath("//*[@id='[[i18n.buttons.save.id]]']"));
            await driver.sleep(2400);
            if (element.isEnabled()) {
                await element.click();
            }
            await driver.sleep(1200);
            console.log("TEST PASS ");
        } catch (e) {
            await admin.takeScreenshot(driver, file);
            console.log(e.toString() + " TEST FAIL");
        }
    })


})


