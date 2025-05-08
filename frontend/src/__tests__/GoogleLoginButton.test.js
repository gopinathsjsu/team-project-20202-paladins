import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

describe('GoogleLoginButton Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = {href: ''};
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test('renders with default label', () => {
    render(<GoogleLoginButton/>);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  test('renders with custom label', () => {
    render(<GoogleLoginButton label="Sign in with Google"/>);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  test('redirects to Google OAuth URL when clicked', () => {
    const backendUrl = process.env.REACT_APP_API_BASE_URL || '';
    render(<GoogleLoginButton/>);

    const button = screen.getByText('Continue with Google');
    fireEvent.click(button);

    expect(window.location.href).toBe(`${backendUrl}/oauth2/authorization/google`);
  });

  test('has correct styling', () => {
    render(<GoogleLoginButton/>);

    const button = screen.getByText('Continue with Google');
    expect(button).toHaveStyle({
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#444',
      borderColor: '#ccc',
      backgroundColor: '#fff'
    });
  });

  test('renders Google icon', () => {
    render(<GoogleLoginButton/>);

    const icon = screen.getByTestId('GoogleIcon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({color: '#4285F4'});
  });
}); 