import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('RestaurantCard Component', () => {
  const mockRestaurant = {
    id: 1,
    name: 'Test Restaurant',
    imageUrl: 'https://test-image.com',
    averageRating: 4.5,
    reviewCount: 100,
    cost: '$$$',
    approved: true
  };

  const defaultProps = {
    restaurant: mockRestaurant,
    userRole: 'USER',
    tableSlots: [],
    noOfTimesBookedToday: 5,
    date: '2024-03-20',
    partySize: 2,
    isAdmin: false
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <RestaurantCard {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders restaurant card with basic information', () => {
    renderComponent();

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('Cost: $$$')).toBeInTheDocument();
    expect(screen.getByText('Booked Today: 5 times')).toBeInTheDocument();
  });

  test('renders default image when imageUrl is not provided', () => {
    renderComponent({
      restaurant: {...mockRestaurant, imageUrl: null}
    });

    const image = screen.getByAltText('Test Restaurant');
    expect(image.src).toContain('placekitten.com');
  });

  test('navigates to restaurant details when card is clicked', () => {
    renderComponent();

    const card = screen.getByText('Test Restaurant').closest('div[role="button"]');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/restaurants/1');
  });

  test('shows admin controls when user is admin', () => {
    renderComponent({
      isAdmin: true
    });

    expect(screen.getByText('Delete Restaurant')).toBeInTheDocument();
  });

  test('shows approval buttons for unapproved restaurant when user is admin', () => {
    renderComponent({
      userRole: 'ADMIN',
      restaurant: {...mockRestaurant, approved: false}
    });

    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
  });

  test('shows edit button for restaurant manager', () => {
    const mockOnEdit = jest.fn();
    renderComponent({
      userRole: 'RESTAURANT_MANAGER',
      onEdit: mockOnEdit
    });

    const editButton = screen.getByText('Edit Restaurant');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockRestaurant);
  });

  test('shows available time slots when provided', () => {
    const mockTableSlots = [
      {
        tableId: 1,
        slot: ['12:00:00', '13:00:00']
      }
    ];

    renderComponent({
      tableSlots: mockTableSlots
    });

    expect(screen.getByText('Available Time Slots:')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  test('shows "No tables available" when no slots are available', () => {
    renderComponent({
      tableSlots: []
    });

    expect(screen.getByText('No tables available')).toBeInTheDocument();
  });

  test('shows "Book a Table" button when no slots are provided', () => {
    renderComponent({
      tableSlots: null
    });

    expect(screen.getByText('Book a Table')).toBeInTheDocument();
  });
}); 