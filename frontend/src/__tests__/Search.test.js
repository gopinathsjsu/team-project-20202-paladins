import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Search from '../components/Search';

// Mock dayjs
jest.mock('dayjs', () => {
  const actual = jest.requireActual('dayjs');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn(() => ({
      format: jest.fn((format) => {
        if (format === 'YYYY-MM-DD') return '2024-03-20';
        if (format === 'HH:mm:ss') return '12:00:00';
        return '';
      }),
      isValid: () => true
    }))
  };
});

describe('Search Component', () => {
  const mockOnSearch = jest.fn();

  const renderComponent = () => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Search onSearch={mockOnSearch}/>
      </LocalizationProvider>
    );
  };

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders all search fields', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Restaurant Name (Optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('When')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
  });

  test('renders party size selector with correct options', () => {
    renderComponent();

    const partySizeField = screen.getByRole('button', {name: /2 People/i});
    fireEvent.mouseDown(partySizeField);

    expect(screen.getByText('1 Person')).toBeInTheDocument();
    expect(screen.getByText('2 People')).toBeInTheDocument();
    expect(screen.getByText('20 People')).toBeInTheDocument();
  });

  test('updates restaurant name input', () => {
    renderComponent();

    const restaurantInput = screen.getByPlaceholderText('Restaurant Name (Optional)');
    fireEvent.change(restaurantInput, {target: {value: 'Test Restaurant'}});

    expect(restaurantInput.value).toBe('Test Restaurant');
  });

  test('calls onSearch with correct parameters when search button is clicked', () => {
    renderComponent();

    const searchButton = screen.getByRole('button', {name: /search/i});
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      date: '2024-03-20',
      startTime: '12:00:00',
      partySize: 2
    });
  });

  test('includes restaurant name in search parameters when provided', () => {
    renderComponent();

    const restaurantInput = screen.getByPlaceholderText('Restaurant Name (Optional)');
    fireEvent.change(restaurantInput, {target: {value: 'Test Restaurant'}});

    const searchButton = screen.getByRole('button', {name: /search/i});
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      restaurant: 'Test Restaurant',
      date: '2024-03-20',
      startTime: '12:00:00',
      partySize: 2
    });
  });

  test('updates party size when selected', () => {
    renderComponent();

    const partySizeField = screen.getByRole('button', {name: /2 People/i});
    fireEvent.mouseDown(partySizeField);

    const option = screen.getByText('4 People');
    fireEvent.click(option);

    expect(screen.getByRole('button', {name: /4 People/i})).toBeInTheDocument();
  });

  test('handles date and time selection', () => {
    renderComponent();

    const dateTimePicker = screen.getByLabelText('When');
    fireEvent.change(dateTimePicker, {target: {value: '2024-03-21T14:00:00'}});

    const searchButton = screen.getByRole('button', {name: /search/i});
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith({
      date: '2024-03-20',
      startTime: '12:00:00',
      partySize: 2
    });
  });
}); 