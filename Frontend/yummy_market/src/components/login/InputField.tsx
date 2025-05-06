// src/components/common/InputField.tsx
import React from 'react';
import { InputFieldProps } from '../../types/auth';

const InputField: React.FC<InputFieldProps> = ({
                                                 id,
                                                 name,
                                                 type,
                                                 value,
                                                 onChange,
                                                 placeholder,
                                                 icon,
                                                 label,
                                                 required = false,
                                                 autoComplete,
                                                 rightIcon,
                                                 onRightIconClick
                                               }) => {
  return (
      <div>
        <label htmlFor={id} className="gmarket-medium fc-888">
          {label}
        </label>
        <div className="relative input_wrap row-flex-center between mt-1">
          <div className="absolute flex m-align-center pl-3">
            {icon}
          </div>
          <input
              id={id}
              name={name}
              type={type}
              autoComplete={autoComplete}
              required={required}
              value={value}
              onChange={onChange}
              className="block pl-15 pr-3 prt-regular fs-18"
              placeholder={placeholder}
          />
          {rightIcon && (
              <button
                  type="button"
                  className="absolute flex align-center pr-3 pl-3 eye_icon"
                  onClick={onRightIconClick}
              >
                {rightIcon}
              </button>
          )}
        </div>
      </div>
  );
};

export default InputField;