declare global {
  interface Window {
    electronAPI: {
      saveOperation: (operation: {
        expression: string;
        result: string;
      }) => Promise<void>;
      getHistory: () => Promise<any[]>;
    };
  }
}

export {};
