export type FileOptions = {
    accept?: Array<string>;
    capture?: 'user' | 'environment' | 'implementation' | 'none';
    selectionMode?: 'single' | 'multiple';
};
export declare function pickFiles(callback: (files: FileList) => void, { accept, capture, selectionMode }: FileOptions): void;
