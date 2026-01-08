import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    let clicked = false
    const handleClick = () => { clicked = true }
    
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button')
    await userEvent.click(button)
    
    expect(clicked).toBe(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('destructive')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('outline')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button.className).toContain('h-8')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button.className).toContain('h-10')
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })
})
