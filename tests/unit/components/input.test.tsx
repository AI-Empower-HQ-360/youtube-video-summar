/**
 * @label Unit Tests - Input Component
 * @description Tests for Input UI component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should display value prop', () => {
    render(<Input value="test value" readOnly />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    expect(input.value).toBe('test value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should apply different types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    const input = document.querySelector('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should handle required attribute', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should support custom className', () => {
    render(<Input className="custom-input" />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveClass('custom-input');
  });

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} />);
    const input = screen.getByRole('textbox');
    
    expect(input).toHaveAttribute('maxLength', '10');
  });
});
