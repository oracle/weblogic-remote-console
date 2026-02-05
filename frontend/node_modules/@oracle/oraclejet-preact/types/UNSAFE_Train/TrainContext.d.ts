export interface TrainContextType {
    onSelect: (event: Event, stepId: string) => void;
    selectedStep: string;
    numberOfSteps: number;
    selectedStepIndex: number;
    index: number;
    isCurrent: boolean;
}
export declare const Context: import("preact").Context<any>;
