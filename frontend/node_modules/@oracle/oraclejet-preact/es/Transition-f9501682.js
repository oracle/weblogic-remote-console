/* @oracle/oraclejet-preact: undefined */
import { Component } from 'preact';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @classdesc
 * The component that acts as a layer for handing transitions.
 *
 * @ignore
 */
class Transition extends Component {
    ////////////////////////////////////////////////////////////////////////
    // Handler functions are created as members to have them 'this' bound //
    ////////////////////////////////////////////////////////////////////////
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
        let appearStatus;
        if (props.in) {
            appearStatus = 'entering';
        }
        else {
            appearStatus = null;
        }
        this._appearStatus = appearStatus;
        this.state = { status: 'exited' };
        this._nextCallback = null;
    }
    //////////////////////////////////////
    // Component Life Cycle Hooks Start //
    //////////////////////////////////////
    /**
     * Lifecycle hook that gets called when the component is mounted to the DOM
     */
    componentDidMount() {
        this._updateStatus(this._appearStatus);
    }
    /**
     * Lifecycle hook that gets called after each update to the component
     *
     * @param prevProps The props of the component before last update
     */
    componentDidUpdate(prevProps) {
        let nextStatus = null;
        if (prevProps !== this.props) {
            const { status } = this.state;
            if (this.props.in) {
                if (status !== 'entering' && status !== 'entered') {
                    // The component is just entering, so set the next status as Entering
                    nextStatus = 'entering';
                }
            }
            else {
                if (status === 'entering' || status === 'entered') {
                    // The component is not in the data anymore, so we need to do exit animation
                    // So, set the next status as Exiting
                    nextStatus = 'exiting';
                }
            }
        }
        this._updateStatus(nextStatus);
    }
    /**
     * Lifecycle hook that gets called right before the component unmounts
     */
    componentWillUnmount() {
        this._cancelNextCallback();
    }
    ////////////////////////////////////
    // Component Life Cycle Hooks End //
    ////////////////////////////////////
    /**
     * Renders the Transition component
     *
     * @param props The current props
     * @returns The rendered component child
     */
    render(props) {
        return props?.children;
    }
    ////////////////////////////
    // Private helper methods //
    ////////////////////////////
    /**
     * Creates a wrapper callback function, which can be cancelled.
     *
     * @param callback The current callback function
     * @returns The created cancellable callback
     */
    _setNextCallback(callback) {
        let active = true;
        this._nextCallback = (...args) => {
            if (active) {
                active = false;
                this._nextCallback = null;
                callback(...args);
            }
        };
        this._nextCallback.cancel = () => {
            active = false;
        };
        return this._nextCallback;
    }
    /**
     * Cancels the scheduled next callback
     */
    _cancelNextCallback() {
        this._nextCallback?.cancel?.();
        this._nextCallback = null;
    }
    /**
     * Updates the status of the component. Performs corresponding Transitions.
     */
    _updateStatus(nextStatus) {
        if (nextStatus != null) {
            this._cancelNextCallback();
            if (nextStatus === 'entering') {
                this._performEnter(this.base); // In our component, base is always Element
            }
            else {
                this._performExit(this.base); // In our component, base is always Element
            }
        }
    }
    /**
     * Perform Entering transitions
     *
     * @param node The root DOM element of this component
     */
    _performEnter(node) {
        this.props.onEnter?.(node, this.props.metadata);
        this.setState({ status: 'entering' }, () => {
            this.props.onEntering?.(node, this._setNextCallback(() => {
                this.setState({ status: 'entered' }, () => {
                    this.props.onEntered?.(node, this.props.metadata);
                });
            }), this.props.metadata);
        });
    }
    /**
     * Perform Exiting transitions
     *
     * @param node The root DOM element of this component
     */
    _performExit(node) {
        this.props.onExit?.(node, this.props.metadata);
        this.setState({ status: 'exiting' }, () => {
            this.props.onExiting?.(node, this._setNextCallback(() => {
                this.setState({ status: 'exited' }, () => {
                    this.props.onExited?.(node, this.props.metadata);
                });
            }), this.props.metadata);
        });
    }
}

export { Transition as T };
//# sourceMappingURL=Transition-f9501682.js.map
