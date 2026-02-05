"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWebElement = void 0;
const TableWebElementBase_1 = require("./TableWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const oj_module_proxy_1 = require("@oracle/oraclejet-webdriver/lib/oj-module-proxy");
/**
 * The component WebElement for [oj-c-table](../../jsdocs/oj-c.Table.html).
 * Do not instantiate this class directly, instead, use
 * [findTable](../functions/findTable.html).
 */
class TableWebElement extends TableWebElementBase_1.TableWebElementBase {
    // Put overrides here
    /**
     * Sets the value of "selected" property.
     * If row/column are both unspecified selected for both will be empty.
     * If no object is set on row/column, selected for that axis will be empty.
     * If 'all' is unset for row/column object only 'keys' will be considered, if no 'keys' are specified selected for that axis will be empty.
     * See the Help documentation for more information.
     * @param selected The value to set for "selected"
     * @typeparam K Type of keys
     */
    async changeSelected(selected) {
        await this.whenReady();
        return (0, oj_module_proxy_1.executeWithModules)(this.getDriver(), ['KeySet'], [this, selected], ({ KeySetImpl, AllKeySetImpl }, ele, selected) => {
            ele.selected = {
                row: selected.row?.all
                    ? new AllKeySetImpl().delete(selected.row.deletedKeys)
                    : new KeySetImpl(selected.row?.keys),
                column: selected.column?.all
                    ? new AllKeySetImpl().delete(selected.column.deletedKeys)
                    : new KeySetImpl(selected.column?.keys)
            };
        });
    }
    /**
     * Gets the value of "selected" property.
     * @typeparam K Type of keys
     * @return The value of "selected" property.
     */
    async getSelected() {
        await this.whenReady();
        const selected = await this.getDriver().executeScript((ele) => {
            const row = ele.selected.row.keys.all
                ? { all: true, deletedKeys: Array.from(ele.selected.row.keys.deletedKeys) }
                : { all: false, keys: Array.from(ele.selected.row.keys.keys) };
            const column = ele.selected.column.keys.all
                ? { all: true, deletedKeys: Array.from(ele.selected.column.keys.deletedKeys) }
                : { all: false, keys: Array.from(ele.selected.column.keys.keys) };
            return { row, column };
        }, this);
        return selected;
    }
    /**
     * Set a given row active. Triggers a ojRowAction Event.
     * @param itemLocator.rowKey The rowKey associated with the row.
     */
    async doRowAction(itemLocator) {
        await this.whenReady();
        try {
            const row = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${itemLocator.rowKey}"]`));
            await row?.click();
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError(`Row with specified key cannot be found`);
        }
    }
    /**
     * Retrieve a SlotProxy which represents a cell.
     * Cell content is only retrievable if there is a cell template for the cell.
     * Throws if there is no matching cell or if there is not cell template for the cell.
     *
     * @param itemLocator.rowKey The rowKey associated with the cell
     * @param itemLocator.columnKey The columnKey associated with the cell
     */
    async findCell(itemLocator) {
        await this.whenReady();
        const el = await this.getDriver().executeScript((element, columnKey, rowKey) => {
            const column = element.columns[columnKey];
            const hasDefaultCellTemplate = element.firstElementChild.getAttribute('data-oj-ct');
            if (column['template'] == null && !hasDefaultCellTemplate) {
                return null;
            }
            const row = element.querySelector(`[data-oj-key="${rowKey}"]`);
            if (row) {
                return row.querySelector(`[data-oj-column-key="${columnKey}"]`);
            }
            return null;
        }, this, itemLocator.columnKey, itemLocator.rowKey);
        if (el) {
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        else {
            throw Error(`No corresponding item found for the itemLocator`);
        }
    }
    /**
     * Retrieve a SlotProxy which represents a header cell.
     * Header content is only retrievable if there is a header template for the cell.
     * Throws if there is no matching header or if there is not header template for the cell.
     *
     * @param itemLocator.columnKey The columnKey associated with the header cell
     */
    async findHeader(itemLocator) {
        await this.whenReady();
        const el = await this.getDriver().executeScript((element, columnKey) => {
            const column = element.columns[columnKey];
            const hasDefaultHeaderTemplate = element.firstElementChild.getAttribute('data-oj-ht');
            if (column['headerTemplate'] == null && !hasDefaultHeaderTemplate) {
                return null;
            }
            return element.querySelector(`[data-oj-cell-type="header"][data-oj-column-key="${columnKey}"]`);
        }, this, itemLocator.columnKey);
        if (el) {
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        else {
            throw Error(`No corresponding item found for the itemLocator`);
        }
    }
    /**
     * Retrieve a SlotProxy which represents a footer cell.
     * Footer content is only retrievable if there is a footer template for the cell.
     * Throws if there is no matching footer or if there is not footer template for the cell.
     *
     * @param itemLocator.columnKey The columnKey associated with the footer cell
     */
    async findFooter(itemLocator) {
        await this.whenReady();
        const el = await this.getDriver().executeScript((element, columnKey) => {
            const column = element.columns[columnKey];
            const hasDefaultFooterTemplate = element.firstElementChild.getAttribute('data-oj-ft');
            if (column['footerTemplate'] == null && !hasDefaultFooterTemplate) {
                return null;
            }
            return element.querySelector(`[data-oj-cell-type="footer"][data-oj-column-key="${columnKey}"]`);
        }, this, itemLocator.columnKey);
        if (el) {
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        else {
            throw Error(`No corresponding item found for the itemLocator`);
        }
    }
    /**
     * Retrieve a SlotProxy which represents no data content.
     */
    async findNoData() {
        await this.whenReady();
        const el = await this.getDriver().executeScript((element) => {
            if (!element.firstElementChild.getAttribute('data-oj-ndt')) {
                return null;
            }
            return element.querySelector('[data-oj-cell-type="noData"]');
        }, this);
        if (el) {
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        else {
            throw Error(`No corresponding item found for the itemLocator`);
        }
    }
}
exports.TableWebElement = TableWebElement;
//# sourceMappingURL=TableWebElement.js.map