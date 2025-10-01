import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { EnhancedCanvas } from './EnhancedCanvas';
import { ApiBuilder } from './ApiBuilder';
import { SqlEditor } from './SqlEditor';
import { DatasourceManager } from './DatasourceManager';
import { MonacoCodeEditor } from './editors/MonacoCodeEditor';

export const MainContent: React.FC = () => {
  const { activeTab } = useAppStore();

  return (
    <div className="flex-1 bg-gray-850 overflow-hidden">
      {activeTab === 'canvas' && <EnhancedCanvas />}
      {activeTab === 'api' && <ApiBuilder />}
      {activeTab === 'sql' && <SqlEditor />}
      {activeTab === 'datasources' && <DatasourceManager />}
      {activeTab === 'code' && <MonacoCodeEditor />}
    </div>
  );
};