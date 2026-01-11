/**
 * @label Unit Tests - Card Component
 * @description Tests for Card UI component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Component', () => {
  it('should render basic card', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should render card with description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>This is a description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          Card Content
        </CardContent>
        <CardFooter>
          Card Footer
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('should support custom className on card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild;
    
    expect(card).toHaveClass('custom-card');
  });

  it('should support custom className on card header', () => {
    const { container } = render(
      <Card>
        <CardHeader className="custom-header">Header</CardHeader>
      </Card>
    );
    
    const header = container.querySelector('.custom-header');
    expect(header).toBeInTheDocument();
  });

  it('should render nested content correctly', () => {
    render(
      <Card>
        <CardContent>
          <div>Nested div</div>
          <p>Nested paragraph</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Nested div')).toBeInTheDocument();
    expect(screen.getByText('Nested paragraph')).toBeInTheDocument();
  });
});
