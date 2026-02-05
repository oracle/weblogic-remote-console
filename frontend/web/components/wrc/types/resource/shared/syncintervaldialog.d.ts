import "oj-c/button";
type Props = Readonly<{
    syncEnabled: boolean;
    onSyncIntervalSet: (intervalSeconds: number) => void;
}>;
declare const SyncIntervalDialog: ({ syncEnabled, onSyncIntervalSet }: Props) => import("preact").JSX.Element;
export default SyncIntervalDialog;
