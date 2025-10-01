const STORAGE_KEY = 'appsmith_builder_data';

export interface StorageData {
  pages: any[];
  currentPageId: string;
  components: any[];
  apis: any[];
  sqlQueries: any[];
  datasources: any[];
  settings: any;
  lastSaved: string;
}

export const saveToLocalStorage = (data: Partial<StorageData>) => {
  try {
    const existing = getFromLocalStorage();
    const updated = {
      ...existing,
      ...data,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (): StorageData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

export const exportProject = () => {
  const data = getFromLocalStorage();
  if (!data) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `appsmith-project-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importProject = (file: File): Promise<StorageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
