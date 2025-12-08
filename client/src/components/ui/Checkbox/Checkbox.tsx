import type { InputHTMLAttributes, ReactNode } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  children?: ReactNode;
}

function Checkbox({
  label,
  children,
  className = '',
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`checkbox-group ${className}`.trim()}>
      <input
        type="checkbox"
        id={checkboxId}
        className="checkbox-input"
        {...props}
      />
      <label htmlFor={checkboxId} className="checkbox-label">
        <span className="checkbox-custom" />
        {(label || children) && (
          <span className="checkbox-text">{label || children}</span>
        )}
      </label>
    </div>
  );
}

export default Checkbox;

