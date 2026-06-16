
export interface ElectronAPI {
  getOpenFile:(file: {filepath: string}) => Promise<{filePath: string, succeeded?: boolean}>;
  getSaveAs:(file: {filepath: string, fileContents?: string}) => Promise<{filePath: string, succeeded?: boolean}>;
  getFilePath: (file: File) => Promise<string>;
}
