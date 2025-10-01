import React from 'react';
import { ComponentData, ButtonProps } from '../../types';

interface ButtonComponentProps {
  component: ComponentData;
  isPreview?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonComponentProps> = ({ 
  component, 
  isPreview = false, 
  onClick 
}) => {
  const props = component.props as ButtonProps;
  
  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style,
  };

  const getVariantStyles = () => {
    switch (props.variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600';
      case 'info':
        return 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
    }
  };

  const getSizeStyles = () => {
    switch (props.size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'xl':
        return 'px-8 py-4 text-xl';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const handleClick = () => {
    if (!isPreview || props.disabled || props.loading) return;
    
    // Execute action based on configuration
    if (props.actions?.onClick) {
      switch (props.actions.onClick.type) {
        case 'alert':
          alert(props.actions.onClick.params?.message || 'Button clicked!');
          break;
        case 'js':
          if (props.actions.onClick.target) {
            try {
              // Execute custom JavaScript
              new Function(props.actions.onClick.target)();
            } catch (error) {
              console.error('Error executing custom JS:', error);
            }
          }
          break;
        case 'navigate':
          if (props.actions.onClick.target) {
            window.open(props.actions.onClick.target, '_blank');
          }
          break;
        case 'copy':
          if (props.actions.onClick.params?.text) {
            navigator.clipboard.writeText(props.actions.onClick.params.text);
          }
          break;
        default:
          onClick?.();
      }
    } else {
      onClick?.();
    }
  };

  if (!props.visible) return null;

  return (
    <button 
      style={baseStyle}
      className={`
        transition-all duration-200 rounded-md font-medium border
        flex items-center justify-center gap-2
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${props.loading ? 'opacity-75' : ''}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
      disabled={!isPreview || props.disabled || props.loading}
      onClick={handleClick}
      title={props.tooltip}
    >
      {props.loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {props.label || 'Button'}
    </button>
  );
};