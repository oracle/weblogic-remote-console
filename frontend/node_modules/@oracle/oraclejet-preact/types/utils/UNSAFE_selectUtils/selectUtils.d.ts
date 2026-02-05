/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Item } from '../UNSAFE_dataProvider';
export type ItemTextFunctionType<K, D> = (itemContext: Item<K, D>) => string;
export type ItemTextType<K, D> = keyof D | ItemTextFunctionType<K, D>;
