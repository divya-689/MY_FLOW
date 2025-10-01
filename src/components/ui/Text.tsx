import React from 'react';
import { ComponentData, TextProps } from '../../types';

interface TextComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const Text: React.FC<TextComponentProps> = ({ component, isPreview = false }) => {
  const props = component.props as TextProps;
  
  const baseStyle = {
    width: '100%',
    height: '100%',
    fontSize: props.fontSize || '16px',
    fontWeight: props.fontWeight || 'normal',
    color: props.color || '#1F2937',
    textAlign: props.textAlign || 'left',
    lineHeight: props.lineHeight || '1.5',
    letterSpacing: props.letterSpacing || 'normal',
    textDecoration: props.textDecoration || 'none',
    textTransform: props.textTransform || 'none',
    ...component.style,
  };

  if (!props.visible) return null;

  const renderContent = () => {
    if (props.richText) {
      return (
        <div 
          style={baseStyle}
          className="flex items-center rich-text-content"
          dangerouslySetInnerHTML={{ __html: props.content || 'Rich text content' }}
        />
      );
    }

    return (
      <div 
        style={baseStyle}
        className="flex items-center whitespace-pre-wrap break-words"
      >
        {props.content || 'Text content'}
      </div>
    );
  };

  return renderContent();
};