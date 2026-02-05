
export interface ElectronAPI {
  getSaveAs:(file: {filepath: string}) => Promise<{filePath: string}>;
  getFilePath: (file: File) => Promise<string>;
}
