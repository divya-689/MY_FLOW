import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useAppStore } from '../store/useAppStore';
import { ComponentData } from '../types';
import { DraggableComponent } from './canvas/DraggableComponent';
import { nanoid } from 'nanoid';
import { ZoomIn, ZoomOut, Maximize2, Grid3x3, Move, Lock, Unlock } from 'lucide-react';

export const EnhancedCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  const {
    components,
    addComponent,
    selectComponent,
    selectedComponent,
    canvasScale,
    setCanvasScale,
    snapToGrid,
    gridSize,
    updateComponent,
    updateAppSettings
  } = useAppStore();

  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'existing-component'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = canvasRef.current?.getBoundingClientRect();

      if (offset && canvasRect) {
        let x = Math.max(0, (offset.x - canvasRect.left - panOffset.x) / canvasScale - 60);
        let y = Math.max(0, (offset.y - canvasRect.top - panOffset.y) / canvasScale - 20);

        if (snapToGrid) {
          x = Math.round(x / gridSize) * gridSize;
          y = Math.round(y / gridSize) * gridSize;
        }

        if (item.type === 'existing-component') {
          updateComponent(item.id, { x, y });
        } else {
          const newComponent: ComponentData = {
            id: nanoid(),
            type: item.componentType,
            x,
            y,
            width: item.definition.defaultSize.width,
            height: item.definition.defaultSize.height,
            props: { ...item.definition.defaultProps },
            style: { ...item.definition.defaultStyle }
          };

          addComponent(newComponent);
          selectComponent(newComponent);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      selectComponent(null);
    }
  };

  const handleZoomIn = () => {
    setCanvasScale(Math.min(canvasScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setCanvasScale(Math.max(canvasScale - 0.1, 0.25));
  };

  const handleResetZoom = () => {
    setCanvasScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleToggleGrid = () => {
    updateAppSettings({ snapToGrid: !snapToGrid });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.spaceKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setCanvasScale(Math.max(0.25, Math.min(2, canvasScale + delta)));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        setIsPanning(true);
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">
            Canvas
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">{components.length} components</span>
            <span className="bg-gray-100 px-2 py-1 rounded">{Math.round(canvasScale * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded transition-all text-gray-600 hover:text-gray-900 hover:shadow-sm"
              title="Zoom Out (Ctrl + Scroll)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1.5 hover:bg-white rounded transition-all text-xs font-medium text-gray-600 hover:text-gray-900 hover:shadow-sm"
              title="Reset Zoom"
            >
              {Math.round(canvasScale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded transition-all text-gray-600 hover:text-gray-900 hover:shadow-sm"
              title="Zoom In (Ctrl + Scroll)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={handleToggleGrid}
            className={`p-1.5 rounded transition-all ${
              snapToGrid
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            title={`Grid Snap ${snapToGrid ? 'On' : 'Off'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`p-1.5 rounded transition-all ${
              isLocked
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            title={`Canvas ${isLocked ? 'Locked' : 'Unlocked'}`}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full transition-all ${
              components.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
            }`}></div>
            <span>{components.length > 0 ? 'Active' : 'Empty'}</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? 'grabbing' : 'default'
        }}
      >
        <div
          ref={(node) => {
            canvasRef.current = node;
            drop(node);
          }}
          className={`absolute inset-0 transition-all duration-200 ${
            isOver ? 'bg-blue-50' : 'bg-white'
          }`}
          onClick={handleCanvasClick}
          style={{
            transform: `scale(${canvasScale}) translate(${panOffset.x / canvasScale}px, ${panOffset.y / canvasScale}px)`,
            transformOrigin: '0 0',
            backgroundImage: snapToGrid
              ? `
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `
              : 'none',
            backgroundSize: `${gridSize}px ${gridSize}px`,
            minHeight: '2000px',
            minWidth: '2000px',
            width: '100%',
            height: '100%'
          }}
        >
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={() => selectComponent(component)}
              isLocked={isLocked}
            />
          ))}

          {isOver && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                <Move className="w-5 h-5" />
                <span className="font-medium">Drop component here</span>
              </div>
            </div>
          )}

          {components.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-4xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Start Building</h3>
                <p className="text-sm text-gray-500 mb-4">Drag components from the library to get started</p>
                <div className="flex items-center gap-4 justify-center text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd> + Drag to pan
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd> + Scroll to zoom
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
