import React from 'react';
import {render, screen} from '@testing-library/react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import StyledTooltip from '../components/common/StyledTooltip';

describe('StyledTooltip Component', () => {
  const theme = createTheme();

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <StyledTooltip title="Test Tooltip" {...props}>
          <button>Hover me</button>
        </StyledTooltip>
      </ThemeProvider>
    );
  };

  test('renders children correctly', () => {
    renderComponent();
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  test('applies custom placement prop', () => {
    renderComponent({placement: 'top'});
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-popper-placement', 'top');
  });

  test('applies custom title', () => {
    renderComponent({title: 'Custom Tooltip'});
    expect(screen.getByText('Custom Tooltip')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    renderComponent({className: 'custom-class'});
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass('custom-class');
  });

  test('renders with arrow', () => {
    renderComponent();
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-arrow', 'true');
  });

  test('applies theme styles', () => {
    renderComponent();
    const tooltip = screen.getByRole('tooltip');

    // Check if the tooltip has the correct background color
    expect(tooltip).toHaveStyle({
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontSize: '13px',
      fontWeight: 400,
      borderRadius: '6px',
      padding: theme.spacing(1),
      boxShadow: theme.shadows[2],
      border: `1px solid ${theme.palette.divider}`
    });
  });
}); 