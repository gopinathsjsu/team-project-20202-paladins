import React from 'react';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const mockStore = configureStore([]);

describe('ProtectedRoute Component', () => {
  const renderComponent = (store) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );
  };

  test('redirects to login when no token is present', () => {
    const store = mockStore({
      auth: {
        token: null,
        role: null
      }
    });

    renderComponent(store);

    // Since we're using BrowserRouter, we can't directly test the redirect
    // Instead, we can verify that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to home when user role is not allowed', () => {
    const store = mockStore({
      auth: {
        token: 'valid-token',
        role: 'RESTAURANT_MANAGER'
      }
    });

    renderComponent(store);

    // Verify that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders protected content when user has valid token and allowed role', () => {
    const store = mockStore({
      auth: {
        token: 'valid-token',
        role: 'ADMIN'
      }
    });

    renderComponent(store);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('allows access with USER role', () => {
    const store = mockStore({
      auth: {
        token: 'valid-token',
        role: 'USER'
      }
    });

    renderComponent(store);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('handles empty allowedRoles array', () => {
    const store = mockStore({
      auth: {
        token: 'valid-token',
        role: 'ADMIN'
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute allowedRoles={[]}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    // Should redirect since no roles are allowed
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
}); 