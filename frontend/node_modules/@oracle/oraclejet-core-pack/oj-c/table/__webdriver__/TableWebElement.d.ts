import { TableWebElementBase } from './TableWebElementBase';
import { SlotProxy } from '@oracle/oraclejet-webdriver';
/**
 * The component WebElement for [oj-c-table](../../jsdocs/oj-c.Table.html).
 * Do not instantiate this class directly, instead, use
 * [findTable](../functions/findTable.html).
 */
export declare class TableWebElement extends TableWebElementBase {
    /**
     * Sets the value of "selected" property.
     * If row/column are both unspecified selected for both will be empty.
     * If no object is set on row/column, selected for that axis will be empty.
     * If 'all' is unset for row/column object only 'keys' will be considered, if no 'keys' are specified selected for that axis will be empty.
     * See the Help documentation for more information.
     * @param selected The value to set for "selected"
     * @typeparam K Type of keys
     */
    changeSelected<K, C>(selected: {
        row: {
            all: true;
            keys?: never;
            deletedKeys: Array<K>;
        } | {
            all: false;
            keys: Array<K>;
            deletedKeys?: never;
        };
        column: {
            all: true;
            keys?: never;
            deletedKeys: Array<C>;
        } | {
            all: false;
            keys: Array<C>;
            deletedKeys?: never;
        };
    }): Promise<void>;
    /**
     * Gets the value of "selected" property.
     * @typeparam K Type of keys
     * @return The value of "selected" property.
     */
    getSelected<K, C>(): Promise<{
        row: {
            all: true;
            keys?: never;
            deletedKeys: Array<K>;
        } | {
            all: false;
            keys: Array<K>;
            deletedKeys?: never;
        };
        column: {
            all: true;
            keys?: never;
            deletedKeys: Array<C>;
        } | {
            all: false;
            keys: Array<C>;
            deletedKeys?: never;
        };
    }>;
    /**
     * Set a given row active. Triggers a ojRowAction Event.
     * @param itemLocator.rowKey The rowKey associated with the row.
     */
    doRowAction<K>(itemLocator: {
        rowKey: K;
    }): Promise<void>;
    /**
     * Retrieve a SlotProxy which represents a cell.
     * Cell content is only retrievable if there is a cell template for the cell.
     * Throws if there is no matching cell or if there is not cell template for the cell.
     *
     * @param itemLocator.rowKey The rowKey associated with the cell
     * @param itemLocator.columnKey The columnKey associated with the cell
     */
    findCell<K, C>(itemLocator: {
        rowKey: K;
        columnKey: C;
    }): Promise<SlotProxy>;
    /**
     * Retrieve a SlotProxy which represents a header cell.
     * Header content is only retrievable if there is a header template for the cell.
     * Throws if there is no matching header or if there is not header template for the cell.
     *
     * @param itemLocator.columnKey The columnKey associated with the header cell
     */
    findHeader<C>(itemLocator: {
        columnKey: C;
    }): Promise<SlotProxy>;
    /**
     * Retrieve a SlotProxy which represents a footer cell.
     * Footer content is only retrievable if there is a footer template for the cell.
     * Throws if there is no matching footer or if there is not footer template for the cell.
     *
     * @param itemLocator.columnKey The columnKey associated with the footer cell
     */
    findFooter<C>(itemLocator: {
        columnKey: C;
    }): Promise<SlotProxy>;
    /**
     * Retrieve a SlotProxy which represents no data content.
     */
    findNoData(): Promise<SlotProxy>;
}
