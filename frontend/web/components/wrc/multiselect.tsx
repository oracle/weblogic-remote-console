/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import "oj-c/button";
import "ojs/ojcheckboxset";
import "oj-c/checkboxset"
import "css!wrc/multiselect.css";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";


import { StateUpdater, useEffect, useRef, useState } from 'preact/hooks';
import { ojCheckboxset } from 'ojs/ojcheckboxset';
import { CCheckboxsetElement } from 'oj-c/checkboxset';
import { CheckboxsetArrayDataItem } from 'oj-c/checkboxset/checkboxset';
import { CButtonElement } from 'oj-c/button';
import { Reference } from './shared/typedefs/rdj';

// type representing an option for a checkboxset
export type SelectOption = { label: string, key?: string | Reference };

// oj-c-checkboxset uses key to identify a selection, but the valueChanged event
// uses value. To work around this, use an internal type that has both key and value..
// value will be assigned the same as key when useState is initialized
type _Option = { label: string, value?: string, key?: string | Reference };

export type ChangeEvent = {
    available: SelectOption[],
    chosen: SelectOption[],
};

type Props = {
    available: SelectOption[],
    chosen: SelectOption[],
    changeHandler: (event: ChangeEvent) => void,
    readonly?: boolean
};

enum CHECKBOXSET_TYPE { Available = 'available', Chosen = 'chosen' };

const MultiSelect = ({ available, chosen, changeHandler, readonly = false }: Props) => {


    function stringifyKey(a: SelectOption): string {
        if (typeof a.key === 'string') {
            return a.key;
        } else {
            return a.key?.resourceData || '';
        }
    }


    
    // setup data map to track the state of the Available and Chosen checkboxsets
    const [checkboxState, setCheckboxState] = useState((() => {

        return {
            [CHECKBOXSET_TYPE.Available]: {
                options: available.map(a => { return { ...a, value: stringifyKey(a) } }),
                checked: [] as _Option[]
            },
            [CHECKBOXSET_TYPE.Chosen]: {
                options: chosen.map(a => { return { ...a, value: stringifyKey(a) } }),
                checked: [] as _Option[]
            }
        };
    })());

    useEffect(() => {
        checkboxState[CHECKBOXSET_TYPE.Available].options = (available.map(a => { return { ...a, value: stringifyKey(a) } }));
        checkboxState[CHECKBOXSET_TYPE.Chosen].options = (chosen.map(a => { return { ...a,  value: stringifyKey(a) } }));

        // checkboxState[CHECKBOXSET_TYPE.Available].checked = [];
        // checkboxState[CHECKBOXSET_TYPE.Chosen].checked = [];

        setCheckboxState({ ...checkboxState });
    }, [available, chosen]);

    useEffect(() => {
        const newChosen = asSelectOptions(checkboxState[CHECKBOXSET_TYPE.Chosen].options);
        const newAvailable = asSelectOptions(checkboxState[CHECKBOXSET_TYPE.Available].options);

        changeHandler({ chosen: newChosen, available: newAvailable });
    }, [checkboxState]);


    // Need to convert the options back into SelectOptions from _SelectOptions
    // i.e. get rid of the value field that was added..
    const asSelectOptions = (options: CheckboxsetArrayDataItem<string>[]) => {
        return options.map(o => { return { key: o.value, label: o.label } });
    }

    const _deepCopyCheckboxState = (checkboxState: any) => {
        const clonedState = Object.create(Object.getPrototypeOf(checkboxState));
        Object.assign(clonedState, checkboxState);
        return clonedState;
    }
    
    /**
     * update the checked state when an option in a checkboxset is toggled
    */
    const handleChecked = (
        event: CCheckboxsetElement.valueChanged<string, SelectOption>
    ) => {

        const target = event.target as CCheckboxsetElement<string, SelectOption>;

        const checkboxType = target.getAttribute('data-type') as CHECKBOXSET_TYPE;

        if (checkboxType) {
            const newChecked: SelectOption[] = [];

            event.detail.value?.forEach(element => {
                const selection = checkboxState[checkboxType].options.find(a => a.value === element);

                if (selection) {
                    newChecked.push(selection);
                }
            });
            checkboxState[checkboxType].checked = newChecked;

            setCheckboxState(_deepCopyCheckboxState(checkboxState));
            // Setting AvailableState to force the buttons to rerender since the
            // disable status may need toggling
            // data[checkboxType].setOptions([...data[checkboxType].options]);
        }
    };

    /**
     * when an add button is pressed -
     * 1. for each checked option in the source box:
     *   - remove it from the source box 
     *   - add it to the destination box
     *   - check the new option in the destination box
     * 2. uncheck all options in the source box
     * 3. call the changeHandler with the new arrays
     */
    const handleMoveButton = (e: CButtonElement.ojAction) => {

        const target = (e.target as CButtonElement);
        const source = target.getAttribute('data-source') as CHECKBOXSET_TYPE;
        const destination = target.getAttribute('data-destination') as CHECKBOXSET_TYPE;

        // iterate over checked options in the source box moving them to the destination box
        checkboxState[source].checked.forEach(checked => {
            const idx = checkboxState[source].options.findIndex(c => c.key === checked.key);

            if (idx > -1) {
                const item = checkboxState[source].options.splice(idx, 1);
                checkboxState[destination].options.push(item[0]);
                checkboxState[destination].checked.push(item[0]);
            }
        });

        checkboxState[source].checked = [];

        setCheckboxState({ ...checkboxState });
        //  data[source].setOptions([...data[source].options]);
        //  data[destination].setOptions([...data[destination].options]);


        // Need to convert the options back into SelectOptions from _SelectOptions
        // i.e. get rid of the value field that was added..
        const asSelectOptions = (options: CheckboxsetArrayDataItem<string>[]) => {
            return options.map(o => { return { key: o.value, label: o.label } });
        }
    }

    /**
     * when an add all  button is pressed -
     * - remove all from source box 
     * - add all from source box to the destination box
     * - check all of the new options in the destination box (this enables easy undo)
     * - uncheck everything in source box since they're no longer there...
     */
    const handleMoveAllButton = (e: CButtonElement.ojAction) => {
        const target = (e.target as CButtonElement);
        const source = target.getAttribute('data-source') as CHECKBOXSET_TYPE;
        const destination = target.getAttribute('data-destination') as CHECKBOXSET_TYPE;

        //   data[destination].options.push(...data[source].options);
        //   data[destination].checked.push(...data[source].options);

        checkboxState[destination].checked.push(...checkboxState[source].options);
        checkboxState[destination].options.push(...checkboxState[source].options);
        checkboxState[source].options = [];
        checkboxState[source].checked = [];

        setCheckboxState({ ...checkboxState });
    }

    if (readonly) {
        return (
            <div class='wrc-multiselect-readonly'>
                <oj-label>{t["wrc-pdj-fields"]?.["cfe-multi-select"]?.labels.chosen}</oj-label>
                <ul>
                    {chosen.map(item => <li key={stringifyKey(item)}>{item.label}</li>)}
                </ul>
            </div>
        );
    }

    // TODO: the wrc depends on the id attributes of these div's. once the css is fixed the id's
    // should be removed...
    return (
        <div id='available-chosen-container' class='wrc-multiselect'>
            <div id='available-container'>
                <oj-label>{t["wrc-pdj-fields"]?.["cfe-multi-select"]?.labels.available}</oj-label>
                <div>
                    <oj-c-checkboxset data-testid='available' data-type={CHECKBOXSET_TYPE.Available} onvalueChanged={handleChecked} options={checkboxState[CHECKBOXSET_TYPE.Available].options} value={checkboxState[CHECKBOXSET_TYPE.Available].checked?.map(s => s.value)} />
                </div>
            </div>
            <div id='available-chosen-buttonset'>
                <div class="oj-flex oj-sm-justify-content-center oj-sm-margin-2x">
                    <oj-c-button data-testid='add button' data-source={CHECKBOXSET_TYPE.Available}
                        data-destination={CHECKBOXSET_TYPE.Chosen}
                        disabled={checkboxState[CHECKBOXSET_TYPE.Available].checked.length === 0} class="oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x" onojAction={handleMoveButton} aria-label={t["wrc-pdj-fields"]?.["cfe-multi-select"]?.buttons?.add?.tooltip}><span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-caret-e"></span></oj-c-button>
                </div>
                <div class="oj-flex oj-sm-justify-content-center oj-sm-margin-2x">
                    <oj-c-button data-testid='add all button' data-source={CHECKBOXSET_TYPE.Available}
                        data-destination={CHECKBOXSET_TYPE.Chosen}
                        disabled={checkboxState[CHECKBOXSET_TYPE.Available].options.length === 0} class="oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x" onojAction={handleMoveAllButton} aria-label={t["wrc-pdj-fields"]?.["cfe-multi-select"]?.buttons?.addAll?.tooltip}><span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-caret02end-e"></span></oj-c-button>
                </div>
                <div class="oj-flex oj-sm-justify-content-center oj-sm-margin-2x">
                    <oj-c-button data-testid='remove button' data-source={CHECKBOXSET_TYPE.Chosen}
                        data-destination={CHECKBOXSET_TYPE.Available}
                        disabled={checkboxState[CHECKBOXSET_TYPE.Chosen].checked.length === 0} class="oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x" onojAction={handleMoveButton} aria-label={t["wrc-pdj-fields"]?.["cfe-multi-select"]?.buttons?.remove?.tooltip}><span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-caret-w"></span></oj-c-button>
                </div>
                <div class="oj-flex oj-sm-justify-content-center oj-sm-margin-2x">
                    <oj-c-button data-testid='remove all button' data-source={CHECKBOXSET_TYPE.Chosen}
                        data-destination={CHECKBOXSET_TYPE.Available}
                        disabled={checkboxState[CHECKBOXSET_TYPE.Chosen].options.length === 0} class="oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x" onojAction={handleMoveAllButton} aria-label={t["wrc-pdj-fields"]?.["cfe-multi-select"]?.buttons?.removeAll?.tooltip}><span slot="startIcon" class="oj-fwk-icon oj-fwk-icon-caret02end-w"></span></oj-c-button>
                </div>
            </div>
            <div id='chosen-container' class='wrc-chosen-container'>
                <oj-label>{t["wrc-pdj-fields"]?.["cfe-multi-select"]?.labels.chosen}</oj-label>
                <div>
                    <oj-c-checkboxset data-testid='chosen' data-type={CHECKBOXSET_TYPE.Chosen} onvalueChanged={handleChecked} options={checkboxState[CHECKBOXSET_TYPE.Chosen].options} value={checkboxState[CHECKBOXSET_TYPE.Chosen].checked?.map(s => s.value)} />
                </div>
            </div>
        </div>

    );
}

export default MultiSelect;
