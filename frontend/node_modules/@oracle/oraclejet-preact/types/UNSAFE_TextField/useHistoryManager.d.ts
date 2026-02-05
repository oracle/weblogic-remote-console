import { HistoryManager } from './HistoryManager';
type Props<T> = {
    /**
     * The state that needs to be pushed to the history.
     */
    state: T;
    /**
     * Compares two states
     * @param a State A
     * @param b State B
     * @returns equality of the two states
     */
    comparator: (a?: T, b?: T) => boolean;
    /**
     * Whether history management is disabled. When it is disabled
     * the states will not be pushed to the history. Additionally, when it
     * changes from enabled to disabled, the history will be cleared.
     */
    isDisabled: boolean;
    /**
     * Maximum states that need to be stored in the history. This can only be set
     * during the initialization. Changing the value after the initialization will
     * not have any effect.
     */
    maxHistory?: number;
};
export type HistoryController<T> = Pick<HistoryManager<T>, 'hasRedo' | 'hasUndo' | 'redo' | 'undo'> & {
    /**
     * A method that can be called to toggle the history manager to
     * save or ignore states.
     * This is different from `isDisabled`; ignoring will not clear the history
     * while disabling clears the history.
     * @param doIgnore flag to indicate if this should ignore state updates
     */
    ignore: (doIgnore?: boolean) => void;
};
/**
 * A custom hook that provides history management. Using this hook, one can push
 * consecutive states to the stack. Then they can go to any point in the history
 * by performing undo/redo operations.
 * @param param0 The hook's props
 * @returns The history manager controller that can be used to manage the history.
 *
 * @template State A Generic representing the shape of the state.
 *
 * @example
 * function MyComponent(props) {
 *   const historyManager = useHistoryManager<MyValue>({
 *     state: props.value,
 *     comparator: (value1, value2) => value1 === value2
 *   });
 *
 *   return (
 *     <SomeComponent
 *       value={props.value}
 *       onValueChange={props.onValueChange}
 *       onUndo={() => {
 *         const undoValue = historyManager.undo();
 *         props.onValueChange(historyManager.undo());
 *       }}
 *       onRedo={() => {
 *         const redoValue = historyManager.redo();
 *         props.onValueChange(redoValue);
 *       }}  />
 *   );
 * }
 */
export declare function useHistoryManager<State>({ state, comparator, isDisabled, maxHistory }: Props<State>): HistoryController<State>;
export {};
