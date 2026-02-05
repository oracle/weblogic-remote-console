"use strict";
//TODO: JET-71076 -> With this we move this to a general place each wd test adapter could use
Object.defineProperty(exports, "__esModule", { value: true });
exports.doContextMenuGroupAction = exports.doContextMenuAction = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
//TODO: Once it's possible to use preact test adapters here will remove this
/**
 * doContextMenuAction - Triggers contextmenu and click a menu item
 * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item.
 * @param webElement WebElement that represents the element where the context click is done.
 * @param parentWebElement The component WebElement where the context menu config is set.
 * @returns Promise<void>
 */
const doContextMenuAction = async (path, webElement, parentWebElement) => {
    return doContextMenuActionClick(path, webElement, parentWebElement);
};
exports.doContextMenuAction = doContextMenuAction;
/**
 * doContextMenuGroupAction - Triggers contextmenu and click a menu item
 * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item. If key is specified it also include item value of the select menu item that is going to be clicked.
 * @param webElement WebElement that represents the element where the context click is done.
 * @param parentWebElement The component WebElement where the context menu config is set.
 * @returns Promise<void>
 */
const doContextMenuGroupAction = async (path, webElement, parentWebElement) => {
    return doContextMenuActionClick(path, webElement, parentWebElement);
};
exports.doContextMenuGroupAction = doContextMenuGroupAction;
/**
 * doContextMenuActionClick - Coordinates clicking of menu item based on path type.
 */
const doContextMenuActionClick = async (path, webElement, parentWebElement) => {
    // Perform the context menu gesture to open the menu
    await parentWebElement.getDriver().actions().contextClick(webElement).perform();
    const pathIdentifier = path.label ? 'label' : 'key';
    const specificPath = path[pathIdentifier];
    // We convert path into an array so we handle it in one way for strings and arrays
    const arraySpecificPath = Array.isArray(specificPath) ? specificPath : [specificPath];
    for (const [index, identifier] of Object.entries(arraySpecificPath)) {
        // Have to check if there are no pending menu animations so we can click
        await parentWebElement.getDriver().wait(async () => {
            const animatedDropdowns = await parentWebElement
                .getDriver()
                .findElements(selenium_webdriver_1.By.css(`[data-oj-layer]:has([role=menu]) [oj-animation-pending=true]`));
            return !animatedDropdowns.length;
        });
        const indexNumber = Number(index);
        const menuSearchElement = (await getMenuElements(parentWebElement))[indexNumber];
        if (path.itemValue && indexNumber === arraySpecificPath.length - 1) {
            await clickSelectMenuItemByKey(identifier, menuSearchElement, path.itemValue);
        }
        else {
            await clickActionMenuItem({ [pathIdentifier]: identifier }, menuSearchElement);
        }
    }
};
/**
 * getMenuElements - Returns list of menus available.
 */
const getMenuElements = async (webElement) => {
    return webElement.getDriver().findElements(selenium_webdriver_1.By.css(`[data-oj-layer] [role=menu]`));
};
/**
 * clickActionMenuItem - Click menu item by label or key
 */
const clickActionMenuItem = async (path, searchElement) => {
    const pathType = path.label ? 'label' : 'key';
    return clickingMenuItem(`a[data-oj-${pathType}=${JSON.stringify(path[pathType])}]`, searchElement, `The ${pathType} ${path[pathType]} is invalid or does not exist`);
};
/**
 * clickSelectMenuItemByKey - Click a select menu item by group key and value inside an specific menu container. It includes clicking on SelectMenuItem
 */
const clickSelectMenuItemByKey = async (groupKey, searchElement, itemValue) => {
    return clickingMenuItem(`a[data-oj-key=${groupKey}-${itemValue}]`, searchElement, `The group key ${groupKey} or itemValue ${itemValue} is invalid or does not exist`);
};
/**
 * clickingMenuItem - Click menu item based on a query. It also handle errors.
 */
const clickingMenuItem = async (query, searchElement, errMessage) => {
    try {
        const item = await searchElement.findElement(selenium_webdriver_1.By.css(query));
        return item?.click();
    }
    catch {
        throw new Error(errMessage);
    }
};
//# sourceMappingURL=contextMenuUtils.js.map