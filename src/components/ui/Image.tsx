import React, { useState } from 'react';
import { ComponentData, ImageProps } from '../../types';

interface ImageComponentProps {
  component: ComponentData;
  isPreview?: boolean;
}

export const Image: React.FC<ImageComponentProps> = ({ component, isPreview = false }) => {
  const props = component.props as ImageProps;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const baseStyle = {
    width: '100%',
    height: '100%',
    borderRadius: props.borderRadius || '0px',
    opacity: props.opacity || 1,
    filter: `
      ${props.grayscale ? 'grayscale(100%)' : 'grayscale(0%)'}
      ${props.blur ? `blur(${props.blur}px)` : 'blur(0px)'}
    `,
    ...component.style,
  };

  const getObjectFit = () => {
    switch (props.fit) {
      case 'cover':
        return 'object-cover';
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      case 'scale-down':
        return 'object-scale-down';
      case 'none':
        return 'object-none';
      default:
        return 'object-cover';
    }
  };

  const handleClick = () => {
    if (!isPreview || !props.clickAction) return;

    switch (props.clickAction.type) {
      case 'navigate':
        if (props.clickAction.target) {
          window.open(props.clickAction.target, '_blank');
        }
        break;
      case 'modal':
        // Handle modal opening
        console.log('Open modal:', props.clickAction.target);
        break;
      case 'js':
        if (props.clickAction.target) {
          try {
            new Function(props.clickAction.target)();
          } catch (error) {
            console.error('Error executing custom JS:', error);
          }
        }
        break;
      case 'alert':
        alert(props.clickAction.params?.message || 'Image clicked!');
        break;
      case 'copy':
        if (props.clickAction.params?.text) {
          navigator.clipboard.writeText(props.clickAction.params.text);
        }
        break;
      case 'download':
        if (props.src) {
          const link = document.createElement('a');
          link.href = props.src;
          link.download = props.alt || 'image';
          link.click();
        }
        break;
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!props.visible) return null;

  const hasClickAction = props.clickAction && props.clickAction.type !== 'none';

  return (
    <div style={baseStyle} className="relative overflow-hidden">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {props.src && !imageError ? (
        <img
          src={props.src}
          alt={props.alt || 'Image'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            w-full h-full ${getObjectFit()}
            ${hasClickAction && isPreview ? 'cursor-pointer hover:opacity-90' : ''}
            transition-opacity duration-200
            ${imageLoading ? 'opacity-0' : 'opacity-100'}
          `}
          onClick={handleClick}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm border-2 border-dashed border-gray-300">
          {imageError ? 'Failed to load image' : 'No image selected'}
        </div>
      )}
      
      {hasClickAction && isPreview && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
          Click to {props.clickAction.type}
        </div>
      )}
    </div>
  );
};