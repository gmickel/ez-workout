import { Layout } from '@/app/components/Layout';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Layout', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <div data-testid="test-child">Test Children</div>
      </Layout>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('renders the navigation bar', () => {
    render(<Layout>Content</Layout>);

    expect(screen.getByText('Workout Tracker')).toBeInTheDocument();
  });

  it('wraps content in ThemeProvider', () => {
    render(<Layout>Content</Layout>);

    // Check for the presence of ThemeProvider's attribute
    expect(document.documentElement).toHaveAttribute('class');
  });
});
