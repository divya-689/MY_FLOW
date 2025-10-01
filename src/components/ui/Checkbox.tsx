import React from 'react';
import { ComponentData, CheckboxProps } from '../../types';
import { Check, Minus } from 'lucide-react';

interface CheckboxComponentProps {
  component: ComponentData;
  isPreview?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxComponentProps> = ({ 
  component, 
  isPreview = false, 
  onChange 
}) => {
  const props = component.props as CheckboxProps;
  
  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style,
  };

  const getSizeStyles = () => {
    switch (props.size) {
      case 'sm':
        return { checkbox: 'w-4 h-4', text: 'text-sm' };
      case 'lg':
        return { checkbox: 'w-6 h-6', text: 'text-lg' };
      default:
        return { checkbox: 'w-5 h-5', text: 'text-base' };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPreview || props.disabled) return;
    onChange?.(e.target.checked);
  };

  if (!props.visible) return null;

  const sizeStyles = getSizeStyles();

  return (
    <div style={baseStyle} className="flex items-center">
      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={props.checked}
            onChange={handleChange}
            disabled={!isPreview || props.disabled}
            className="sr-only"
          />
          
          <div
            className={`
              ${sizeStyles.checkbox} border-2 rounded flex items-center justify-center
              transition-all duration-200
              ${props.checked || props.indeterminate
                ? `bg-${props.color || 'blue'}-600 border-${props.color || 'blue'}-600`
                : 'bg-white border-gray-300 hover:border-gray-400'
              }
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              backgroundColor: (props.checked || props.indeterminate) ? (props.color || '#3B82F6') : undefined,
              borderColor: (props.checked || props.indeterminate) ? (props.color || '#3B82F6') : undefined,
            }}
          >
            {props.indeterminate ? (
              <Minus className="w-3 h-3 text-white" />
            ) : props.checked ? (
              <Check className="w-3 h-3 text-white" />
            ) : null}
          </div>
        </div>
        
        {props.label && (
          <span className={`${sizeStyles.text} ${props.disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {props.label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </label>
    </div>
  );
};