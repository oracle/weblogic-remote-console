/**
 * Options for instantiating the HistoryManager class
 */
type HistoryManagerOptions = {
    /**
     * Maximum allowed states in the history. If a new state is pushed
     * when the manager is at the limit, the oldest state is removed from
     * the history.
     */
    maxHistory?: number;
};
/**
 * This class creates an instance that can be used to manage history.
 * One can use the push method to store any history state and can call
 * undo/redo method to get a previous/next state in the history.
 * @template State The type of the state stored in the history
 */
export declare class HistoryManager<State = any> {
    private currentIndex;
    private maxHistory;
    private states;
    constructor({ maxHistory }: HistoryManagerOptions);
    get currentState(): State;
    get isEmpty(): boolean;
    get hasUndo(): boolean;
    get hasRedo(): boolean;
    /**
     * Pushes a state to the history
     * @param state the state to be pushed into the history
     */
    push(state: State): void;
    /**
     * Retrieves the state from the history after walking the provided steps.
     * @param steps number of steps to travel in the history
     * @returns the state after walking the steps in the history
     */
    go(steps: number): State;
    /**
     * Go back in history by 1 step
     * @returns The previous state
     */
    undo(): State;
    /**
     * Go forward in history by 1 step
     * @returns The previous state
     */
    redo(): State;
    /**
     * Clears the history
     */
    clear(): void;
}
export {};
