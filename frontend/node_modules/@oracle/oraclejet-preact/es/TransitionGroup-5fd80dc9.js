/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { cloneElement, Component } from 'preact';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @classdesc
 * A utility class consisting of helper functions for handling transitions
 * related operations.
 */
class TransitionUtils {
    /**
     * Creates a map of the children array with the calculated in prop
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @returns the newly created child mapping
     */
    static getChildMapping(children, prevChildMapping = new Map(), onExited = () => { }) {
        // A symbol to store trailing children
        const TRAILING = Symbol();
        let mappedDeletions = {};
        if (prevChildMapping.size !== 0) {
            // If previous children exists, get the mapped deleted children
            mappedDeletions = TransitionUtils._getMappedDeletions(children, prevChildMapping, TRAILING);
        }
        // Create a new Map with the new children along with the deletions inserted in their
        // respective positions
        const mergedChildrenMap = children.reduce((accumulator, currentChild) => {
            if (mappedDeletions[currentChild.key]) {
                // There are keys from prev that are deleted before the current
                // next key, so add them first
                const deletedChildren = mappedDeletions[currentChild.key];
                for (const key of deletedChildren) {
                    const previousChild = prevChildMapping.get(key);
                    // Set the in property to false, as this is children is removed
                    accumulator.set(key, cloneElement(previousChild, { in: false }));
                }
                // Then add the current key. Do not change the 'in' or 'onExited' properties as this is a
                // retained child.
                const previousChild = prevChildMapping.get(currentChild.key);
                accumulator.set(currentChild.key, cloneElement(currentChild, {
                    onExited: previousChild.props.onExited,
                    in: previousChild.props.in
                }));
            }
            else {
                // This is a new children. Set the in property to true
                const newChild = cloneElement(currentChild, {
                    // bind the original child so that the original callbacks can be
                    // called in the onExited callback from the argument.
                    onExited: onExited.bind(null, currentChild),
                    in: true
                });
                accumulator.set(currentChild.key, newChild);
            }
            return accumulator;
        }, new Map());
        // Finally add any trailing deleted children present in the mappedDeletions[TRAILING]
        for (const key of mappedDeletions[TRAILING] || []) {
            const previousChild = prevChildMapping.get(key);
            // Set the in property to false, as this is children is removed
            mergedChildrenMap.set(key, cloneElement(previousChild, { in: false }));
        }
        // Finally return the merged children map
        return mergedChildrenMap;
    }
    ////////////////////////////
    // Private helper methods //
    ////////////////////////////
    /**
     * Creates a map of deleted children wrt to the keys in the new data.
     *
     * @param children The newly received children
     * @param prevChildMapping The previous child mapping
     * @param TRAILING A unique symbol to be used for storing the trailing children
     * @returns A map containing deleted children
     */
    static _getMappedDeletions(children, prevChildMapping, TRAILING) {
        // Create a set with keys of next children
        const nextChildrenKeys = new Set(children.map((children) => children.key));
        return [...prevChildMapping.keys()].reduce((accumulator, currentKey) => {
            if (nextChildrenKeys.has(currentKey)) {
                // We have reached a point where the closest prevKey that
                // is in the next, so if there are any pending keys add them
                // to this key in mappedDeletions so that the pending keys will
                // be added before the current next key
                accumulator[currentKey] = accumulator[TRAILING];
                delete accumulator[TRAILING];
            }
            else {
                // If key is not found in next, then add it to the trailing keys.
                const trailingChildren = accumulator[TRAILING]
                    ? [...accumulator[TRAILING], currentKey]
                    : [currentKey];
                accumulator[TRAILING] = trailingChildren;
            }
            return accumulator;
        }, {});
    }
}

/**
 * @classdesc
 * The <TransitionGroup> component manages a set of components that involves animations.
 * This component does not handle any animation, rather just a state machine that manages
 * the mounting and unmounting of the components over the time. The actual animation needs
 * to be handled by the content component.
 *
 * Consider the example below:
 * <TransitionGroup>
 *   {
 *      messages.map(message => {
 *        <Transition key={message.key}>
 *          <Message
 *            type={type}
 *            index={index}
 *            item={data.message}
 *            onOjClose={onOjClose}
 *          />
 *        </Transition>
 *      });
 *   }
 * </TransitionGroup>
 * As the messages are added/removed, the TransitionGroup Component automatically
 * toggles the 'in' prop of the Transition Component.
 *
 * @ignore
 */
class TransitionGroup extends Component {
    /**
     * Derives state from the current props
     *
     * @param props The current Props that will be used to get the new state
     * @param state The current state
     *
     * @returns The new state
     */
    static getDerivedStateFromProps(props, state) {
        const { childMapping, handleExited } = state;
        return {
            childMapping: TransitionUtils.getChildMapping(props.children, childMapping, handleExited)
        };
    }
    ///////////////////////////
    // Handler functions end //
    ///////////////////////////
    /**
     * Instantiates Component
     *
     * @param props The component properties
     */
    constructor(props) {
        super(props);
        ////////////////////////////////////////////////////////////////////////
        // Handler functions are created as members to have them 'this' bound //
        ////////////////////////////////////////////////////////////////////////
        /**
         * Handles when a transition component exits
         *
         * @param child The child instance that exited
         * @param node The corresponding transition element
         * @param metadata The metadata of the corresponding transition component
         */
        this._handleExited = (child, node, metadata) => {
            const { children } = this.props;
            // get the child mapping for the current children
            const currentChildMapping = TransitionUtils.getChildMapping(children);
            // if the exited child is added again, do nothing here
            if (currentChildMapping.has(child.key))
                return;
            // The child component has exited, call the original onExited callback
            child.props.onExited?.(node, metadata);
            // Check if this component is still mounted, if so update the state
            if (this._mounted) {
                this.setState((state) => {
                    const childMapping = new Map(state.childMapping);
                    // delete the exited child
                    childMapping.delete(child.key);
                    return { childMapping };
                });
            }
        };
        this.state = {
            childMapping: undefined,
            handleExited: this._handleExited
        };
        this._mounted = false;
    }
    //////////////////////////////////////
    // Component Life Cycle Hooks Start //
    //////////////////////////////////////
    /**
     * Life cycle hook that gets called when the component is mounted on to
     * the DOM
     */
    componentDidMount() {
        this._mounted = true;
    }
    /**
     * Life cycle hook that gets called when the component is unmounted from
     * the DOM
     */
    componentWillUnmount() {
        this._mounted = false;
    }
    ////////////////////////////////////
    // Component Life Cycle Hooks End //
    ////////////////////////////////////
    /**
     * Renders the transition components
     */
    render() {
        const WrapperComponent = this.props.elementType;
        const { childMapping } = this.state;
        const children = [...childMapping.values()];
        return jsx(WrapperComponent, { children: children });
    }
}
TransitionGroup.defaultProps = {
    elementType: 'div'
};

export { TransitionGroup as T };
//# sourceMappingURL=TransitionGroup-5fd80dc9.js.map
