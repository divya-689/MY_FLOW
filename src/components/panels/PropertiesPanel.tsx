import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Settings, Code, Palette, Eye, EyeOff } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedComponent, updateComponent } = useAppStore();
  const [activeTab, setActiveTab] = useState<'properties' | 'style' | 'actions' | 'code'>('properties');

  if (!selectedComponent) {
    return (
      <div className="p-4 h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [property]: value
      }
    });
  };

  const handleStyleChange = (property: string, value: any) => {
    updateComponent(selectedComponent.id, {
      style: {
        ...selectedComponent.style,
        [property]: value
      }
    });
  };

  const handleCustomCodeChange = (type: 'customCSS' | 'customJS' | 'customHTML', value: string) => {
    updateComponent(selectedComponent.id, {
      [type]: value
    });
  };

  const renderPropertyEditor = (key: string, label: string, type: string, value: any, options?: string[]) => {
    switch (type) {
      case 'text':
      case 'url':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 resize-none"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handlePropertyChange(key, Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        );
      
      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handlePropertyChange(key, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{label}</span>
          </label>
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        );
    }
  };

  const renderComponentProperties = () => {
    const { type, props } = selectedComponent;

    switch (type) {
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              {renderPropertyEditor('label', 'Label', 'text', props.label)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip</label>
              {renderPropertyEditor('tooltip', 'Tooltip', 'text', props.tooltip)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
              {renderPropertyEditor('variant', 'Variant', 'select', props.variant, ['primary', 'secondary', 'danger', 'success', 'warning', 'info'])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              {renderPropertyEditor('size', 'Size', 'select', props.size, ['xs', 'sm', 'md', 'lg', 'xl'])}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('disabled', 'Disabled', 'boolean', props.disabled)}</div>
            </div>
            <div>{renderPropertyEditor('loading', 'Loading', 'boolean', props.loading)}</div>
          </div>
        );

      case 'input':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              {renderPropertyEditor('label', 'Label', 'text', props.label)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              {renderPropertyEditor('placeholder', 'Placeholder', 'text', props.placeholder)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              {renderPropertyEditor('type', 'Type', 'select', props.type, ['text', 'email', 'password', 'number', 'tel', 'url', 'search'])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
              {renderPropertyEditor('maxLength', 'Max Length', 'number', props.maxLength)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('disabled', 'Disabled', 'boolean', props.disabled)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('required', 'Required', 'boolean', props.required)}</div>
              <div>{renderPropertyEditor('readonly', 'Read Only', 'boolean', props.readonly)}</div>
            </div>
            <div>{renderPropertyEditor('showCharacterCount', 'Show Character Count', 'boolean', props.showCharacterCount)}</div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              {renderPropertyEditor('content', 'Content', 'textarea', props.content)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
              {renderPropertyEditor('fontSize', 'Font Size', 'text', props.fontSize)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
              {renderPropertyEditor('fontWeight', 'Font Weight', 'select', props.fontWeight, ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              {renderPropertyEditor('color', 'Color', 'color', props.color)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
              {renderPropertyEditor('textAlign', 'Text Align', 'select', props.textAlign, ['left', 'center', 'right', 'justify'])}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('richText', 'Rich Text', 'boolean', props.richText)}</div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
              {renderPropertyEditor('src', 'Source URL', 'url', props.src)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              {renderPropertyEditor('alt', 'Alt Text', 'text', props.alt)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fit Mode</label>
              {renderPropertyEditor('fit', 'Fit Mode', 'select', props.fit, ['cover', 'contain', 'fill', 'scale-down', 'none'])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
              {renderPropertyEditor('borderRadius', 'Border Radius', 'text', props.borderRadius)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
              {renderPropertyEditor('opacity', 'Opacity', 'number', props.opacity)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('grayscale', 'Grayscale', 'boolean', props.grayscale)}</div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('compact', 'Compact', 'boolean', props.compact)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('striped', 'Striped', 'boolean', props.striped)}</div>
              <div>{renderPropertyEditor('bordered', 'Bordered', 'boolean', props.bordered)}</div>
            </div>
            <div>{renderPropertyEditor('hoverable', 'Hoverable', 'boolean', props.hoverable)}</div>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              {renderPropertyEditor('label', 'Label', 'text', props.label)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              {renderPropertyEditor('placeholder', 'Placeholder', 'text', props.placeholder)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('disabled', 'Disabled', 'boolean', props.disabled)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('multiple', 'Multiple', 'boolean', props.multiple)}</div>
              <div>{renderPropertyEditor('searchable', 'Searchable', 'boolean', props.searchable)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('clearable', 'Clearable', 'boolean', props.clearable)}</div>
              <div>{renderPropertyEditor('required', 'Required', 'boolean', props.required)}</div>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              {renderPropertyEditor('label', 'Label', 'text', props.label)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              {renderPropertyEditor('size', 'Size', 'select', props.size, ['sm', 'md', 'lg'])}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              {renderPropertyEditor('color', 'Color', 'color', props.color)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
              <div>{renderPropertyEditor('disabled', 'Disabled', 'boolean', props.disabled)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{renderPropertyEditor('checked', 'Checked', 'boolean', props.checked)}</div>
              <div>{renderPropertyEditor('required', 'Required', 'boolean', props.required)}</div>
            </div>
            <div>{renderPropertyEditor('indeterminate', 'Indeterminate', 'boolean', props.indeterminate)}</div>
          </div>
        );

      case 'customfunction':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
              {renderPropertyEditor('height', 'Height', 'number', props.height)}
            </div>
            <div>{renderPropertyEditor('visible', 'Visible', 'boolean', props.visible)}</div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No properties available for this component type</p>
          </div>
        );
    }
  };

  const renderStyleEditor = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input
            type="number"
            value={selectedComponent.width}
            onChange={(e) => updateComponent(selectedComponent.id, { width: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input
            type="number"
            value={selectedComponent.height}
            onChange={(e) => updateComponent(selectedComponent.id, { height: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">X Position</label>
          <input
            type="number"
            value={selectedComponent.x}
            onChange={(e) => updateComponent(selectedComponent.id, { x: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Y Position</label>
          <input
            type="number"
            value={selectedComponent.y}
            onChange={(e) => updateComponent(selectedComponent.id, { y: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        {renderPropertyEditor('backgroundColor', 'Background Color', 'color', selectedComponent.style?.backgroundColor)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border</label>
        <input
          type="text"
          value={selectedComponent.style?.border || ''}
          onChange={(e) => handleStyleChange('border', e.target.value)}
          placeholder="1px solid #ccc"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
        <input
          type="text"
          value={selectedComponent.style?.borderRadius || ''}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          placeholder="4px"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
        <input
          type="text"
          value={selectedComponent.style?.padding || ''}
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          placeholder="8px"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
        <input
          type="text"
          value={selectedComponent.style?.margin || ''}
          onChange={(e) => handleStyleChange('margin', e.target.value)}
          placeholder="0px"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderCodeEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
        <textarea
          value={selectedComponent.customCSS || ''}
          onChange={(e) => handleCustomCodeChange('customCSS', e.target.value)}
          rows={6}
          placeholder="/* Custom CSS for this component */"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Custom JavaScript</label>
        <textarea
          value={selectedComponent.customJS || ''}
          onChange={(e) => handleCustomCodeChange('customJS', e.target.value)}
          rows={6}
          placeholder="// Custom JavaScript for this component"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      {selectedComponent.type === 'customfunction' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HTML</label>
            <textarea
              value={selectedComponent.props.html || ''}
              onChange={(e) => handlePropertyChange('html', e.target.value)}
              rows={6}
              placeholder="<div>Your HTML content here</div>"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CSS</label>
            <textarea
              value={selectedComponent.props.css || ''}
              onChange={(e) => handlePropertyChange('css', e.target.value)}
              rows={6}
              placeholder="/* Your CSS styles here */"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">JavaScript</label>
            <textarea
              value={selectedComponent.props.javascript || ''}
              onChange={(e) => handlePropertyChange('javascript', e.target.value)}
              rows={6}
              placeholder="// Your JavaScript code here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {selectedComponent.type}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { id: 'properties', label: 'Properties', icon: Settings },
          { id: 'style', label: 'Style', icon: Palette },
          { id: 'code', label: 'Code', icon: Code }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'properties' && renderComponentProperties()}
        {activeTab === 'style' && renderStyleEditor()}
        {activeTab === 'code' && renderCodeEditor()}
      </div>
    </div>
  );
};