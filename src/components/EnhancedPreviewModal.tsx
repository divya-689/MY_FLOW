import React, { useState, useEffect } from 'react';
import { X, Smartphone, Tablet, Monitor, Maximize2, RotateCw, Code, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { RenderComponent } from './RenderComponent';

interface EnhancedPreviewModalProps {
  onClose: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

const deviceSizes = {
  mobile: { width: 375, height: 667, name: 'iPhone SE' },
  tablet: { width: 768, height: 1024, name: 'iPad' },
  desktop: { width: 1440, height: 900, name: 'Desktop' },
  fullscreen: { width: 0, height: 0, name: 'Full Screen' }
};

export const EnhancedPreviewModal: React.FC<EnhancedPreviewModalProps> = ({ onClose }) => {
  const { components, pages, currentPageId, settings } = useAppStore();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isLandscape, setIsLandscape] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentPage = pages.find(p => p.id === currentPageId);
  const { width, height } = deviceSizes[device];
  const displayWidth = isLandscape && device !== 'fullscreen' ? height : width;
  const displayHeight = isLandscape && device !== 'fullscreen' ? width : height;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage?.name || 'page'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentPage?.seo?.title || currentPage?.name || 'Page'}</title>
    <meta name="description" content="${currentPage?.seo?.description || ''}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: ${settings.theme.fonts.primary};
            background-color: ${settings.theme.colors.background};
            color: ${settings.theme.colors.text};
            position: relative;
            min-height: 100vh;
        }
        .component {
            position: absolute;
        }
    </style>
</head>
<body>
    ${components.map(comp => `
    <div class="component" style="left: ${comp.x}px; top: ${comp.y}px; width: ${comp.width}px; height: ${comp.height}px;">
        <!-- ${comp.type} component -->
    </div>`).join('')}
</body>
</html>`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl w-full h-full max-w-[98vw] max-h-[98vh] overflow-hidden shadow-2xl flex flex-col animate-slideUp">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-700 shadow-lg">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Preview Mode
            </h2>
            <span className="text-sm text-gray-400">
              {currentPage?.name || 'Untitled Page'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-700 rounded-lg p-1 gap-1">
              {(['mobile', 'tablet', 'desktop', 'fullscreen'] as DeviceType[]).map((d) => {
                const Icon = d === 'mobile' ? Smartphone : d === 'tablet' ? Tablet : d === 'desktop' ? Monitor : Maximize2;
                return (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`p-2 rounded transition-all ${
                      device === d
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                    title={deviceSizes[d].name}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="w-px h-6 bg-gray-600"></div>

            {device !== 'fullscreen' && (
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className={`p-2 rounded transition-all ${
                  isLandscape
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-600'
                }`}
                title="Toggle Orientation"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-all"
              title="Refresh Preview"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowCode(!showCode)}
              className={`p-2 rounded transition-all ${
                showCode
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              title="View Code"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              onClick={handleExport}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-all"
              title="Export HTML"
            >
              <Download className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-600"></div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-red-600 rounded transition-all"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!showCode ? (
          <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 overflow-auto p-8 flex items-center justify-center">
            {device === 'fullscreen' ? (
              <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-auto relative">
                <div key={refreshKey} className="relative w-full h-full">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="absolute transition-all duration-200"
                      style={{
                        left: component.x,
                        top: component.y,
                        width: component.width,
                        height: component.height,
                      }}
                    >
                      <RenderComponent component={component} isPreview={true} />
                    </div>
                  ))}

                  {components.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📱</div>
                        <p className="text-lg font-medium">No components to preview</p>
                        <p className="text-sm mt-2">Add components to your canvas first</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-800 relative transition-all duration-300 transform hover:scale-[1.02]"
                style={{
                  width: displayWidth,
                  height: displayHeight,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 flex items-center justify-center gap-2">
                  <div className="w-16 h-4 bg-gray-900 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                </div>

                <div className="absolute inset-0 top-8 overflow-auto">
                  <div key={refreshKey} className="relative w-full h-full">
                    {components.map((component) => (
                      <div
                        key={component.id}
                        className="absolute transition-all duration-200"
                        style={{
                          left: component.x,
                          top: component.y,
                          width: component.width,
                          height: component.height,
                        }}
                      >
                        <RenderComponent component={component} isPreview={true} />
                      </div>
                    ))}

                    {components.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center p-8">
                          <div className="text-4xl mb-4">📱</div>
                          <p className="text-base font-medium">No components</p>
                          <p className="text-xs mt-2">Add some to get started</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800"></div>
              </div>
            )}

            <div className="absolute bottom-8 left-8 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
              {device !== 'fullscreen'
                ? `${deviceSizes[device].name} - ${displayWidth}×${displayHeight}px ${isLandscape ? '(Landscape)' : '(Portrait)'}`
                : 'Full Screen Mode'}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gray-900 overflow-auto p-6">
            <pre className="text-green-400 text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {generateHTML()}
            </pre>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
