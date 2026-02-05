import "oj-c/button";
type Props = Readonly<{
    showHelp: boolean;
    onHelpClick: () => void;
    syncEnabled: boolean;
    onSyncClick: () => void;
    actionPolling?: boolean;
    pageContext?: string;
}>;
declare const ToolbarIcons: ({ showHelp, onHelpClick, syncEnabled, onSyncClick, actionPolling, pageContext }: Props) => import("preact").JSX.Element;
export default ToolbarIcons;
