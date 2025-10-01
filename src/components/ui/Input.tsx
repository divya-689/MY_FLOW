import React, { useState, useEffect } from 'react';
import { ComponentData, InputProps } from '../../types';

interface InputComponentProps {
  component: ComponentData;
  isPreview?: boolean;
  onChange?: (value: string) => void;
}

export const Input: React.FC<InputComponentProps> = ({ 
  component, 
  isPreview = false, 
  onChange 
}) => {
  const props = component.props as InputProps;
  const [value, setValue] = useState(props.value || '');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const baseStyle = {
    width: '100%',
    height: '100%',
    ...component.style,
  };

  useEffect(() => {
    validateInput(value);
    setCharacterCount(value.length);
  }, [value, props.validation]);

  const validateInput = (inputValue: string) => {
    let valid = true;
    let message = '';

    // Required validation
    if (props.required && !inputValue.trim()) {
      valid = false;
      message = 'This field is required';
    }

    // Length validation
    if (valid && props.validation.minLength && inputValue.length < props.validation.minLength) {
      valid = false;
      message = `Minimum length is ${props.validation.minLength} characters`;
    }

    if (valid && props.validation.maxLength && inputValue.length > props.validation.maxLength) {
      valid = false;
      message = `Maximum length is ${props.validation.maxLength} characters`;
    }

    // Max length validation
    if (valid && props.maxLength && inputValue.length > props.maxLength) {
      valid = false;
      message = `Maximum length is ${props.maxLength} characters`;
    }

    // Regex validation
    if (valid && props.validation.regex && inputValue) {
      try {
        const regex = new RegExp(props.validation.regex);
        if (!regex.test(inputValue)) {
          valid = false;
          message = props.validation.errorMessage || 'Invalid format';
        }
      } catch (error) {
        console.error('Invalid regex pattern:', error);
      }
    }

    // Email validation for email type
    if (valid && props.type === 'email' && inputValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        valid = false;
        message = 'Please enter a valid email address';
      }
    }

    // URL validation for url type
    if (valid && props.type === 'url' && inputValue) {
      try {
        new URL(inputValue);
      } catch {
        valid = false;
        message = 'Please enter a valid URL';
      }
    }

    // Custom function validation
    if (valid && props.validation.customFunction && inputValue) {
      try {
        const customValidation = new Function('value', props.validation.customFunction);
        const result = customValidation(inputValue);
        if (result !== true) {
          valid = false;
          message = typeof result === 'string' ? result : 'Validation failed';
        }
      } catch (error) {
        console.error('Error in custom validation:', error);
      }
    }

    setIsValid(valid);
    setErrorMessage(message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Enforce max length
    if (props.maxLength && newValue.length > props.maxLength) {
      return;
    }
    
    setValue(newValue);
    onChange?.(newValue);
  };

  if (!props.visible) return null;

  return (
    <div style={baseStyle} className="flex flex-col">
      {props.label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {props.prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{props.prefix}</span>
          </div>
        )}
        
        <input
          type={props.type || 'text'}
          value={value}
          onChange={handleChange}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readonly}
          maxLength={props.maxLength}
          className={`
            flex-1 px-3 py-2 border rounded-md text-sm
            transition-colors duration-200
            ${props.prefix ? 'pl-8' : ''}
            ${props.suffix ? 'pr-8' : ''}
            ${isValid 
              ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
              : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${props.readonly ? 'bg-gray-50' : ''}
            outline-none
          `}
        />
        
        {props.suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">{props.suffix}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div>
          {!isValid && errorMessage && (
            <span className="text-xs text-red-500">{errorMessage}</span>
          )}
        </div>
        
        {props.showCharacterCount && props.maxLength && (
          <span className={`text-xs ${characterCount > props.maxLength * 0.8 ? 'text-orange-500' : 'text-gray-400'}`}>
            {characterCount}/{props.maxLength}
          </span>
        )}
      </div>
    </div>
  );
};