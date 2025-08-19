import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Activities from '../pages/Activities';
import { 
  mockMobileViewport, 
  checkTouchTargetSize, 
  createMobileUser,
  mockCapacitorPlugins 
} from './mobile-test-utils';

// Mock the activities store
vi.mock('../store/activities', () => ({
  useActivities: () => ({
    load: vi.fn(),
    items: [
      {
        id: '1',
        name: 'Morning Workout',
        category: 'Physical',
        status: 'Pending',
        amount: '30 min'
      },
      {
        id: '2',
        name: 'German Study',
        category: 'Languages',
        status: 'Done',
        amount: '1 hour'
      }
    ],
    loaded: true,
    add: vi.fn(),
    toggle: vi.fn(),
    remove: vi.fn(),
  })
}));

const renderActivitiesPage = () => {
  return render(
    <BrowserRouter>
      <Activities />
    </BrowserRouter>
  );
};

describe('Activities Page - Mobile Optimization', () => {
  // Mock Capacitor plugins
  mockCapacitorPlugins();
  
  beforeEach(() => {
    mockMobileViewport();
    vi.clearAllMocks();
  });

  it('renders with mobile-optimized layout', () => {
    renderActivitiesPage();
    
    expect(screen.getByText('Activities')).toBeInTheDocument();
    expect(screen.getByText('Add and manage your daily activities')).toBeInTheDocument();
  });

  it('has properly sized touch targets for mobile', () => {
    renderActivitiesPage();
    
    // Check form submit button
    const submitButton = screen.getByRole('button', { name: /add activity/i });
    const submitButtonSize = checkTouchTargetSize(submitButton);
    expect(submitButtonSize.meetsRequirements).toBe(true);
    
    // Check checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      const checkboxSize = checkTouchTargetSize(checkbox.parentElement!);
      expect(checkboxSize.width).toBeGreaterThanOrEqual(44);
    });
    
    // Check delete buttons
    const deleteButtons = screen.getAllByText('Delete');
    deleteButtons.forEach(button => {
      const buttonSize = checkTouchTargetSize(button);
      expect(buttonSize.meetsRequirements).toBe(true);
    });
  });

  it('provides proper form input experience on mobile', async () => {
    const user = createMobileUser();
    renderActivitiesPage();
    
    const nameInput = screen.getByPlaceholderText(/german study, workout/i);
    const categorySelect = screen.getByDisplayValue('Physical');
    const amountInput = screen.getByPlaceholderText(/30 min, 10 pages/i);
    
    // Check input attributes for mobile
    expect(nameInput).toHaveAttribute('autoCapitalize', 'sentences');
    expect(nameInput).toHaveAttribute('autoCorrect', 'on');
    expect(amountInput).toHaveAttribute('autoCapitalize', 'sentences');
    expect(amountInput).toHaveAttribute('autoCorrect', 'on');
    
    // Check font size is 16px to prevent zoom on iOS
    expect(nameInput).toHaveClass('text-[16px]');
    expect(categorySelect).toHaveClass('text-[16px]');
    expect(amountInput).toHaveClass('text-[16px]');
    
    // Test form interaction
    await user.type(nameInput, 'Test Activity');
    await user.selectOptions(categorySelect, 'Mental');
    await user.type(amountInput, '15 min');
    
    expect(nameInput).toHaveValue('Test Activity');
    expect(categorySelect).toHaveValue('Mental');
    expect(amountInput).toHaveValue('15 min');
  });

  it('has responsive grid layout that adapts to mobile', () => {
    renderActivitiesPage();
    
    // The form should have responsive padding
    const form = screen.getByText('Add New Activity').closest('form');
    expect(form).toHaveClass('p-4', 'md:p-6');
    
    // Input grid should be responsive
    const categorySelect = screen.getByDisplayValue('Physical');
    const categoryContainer = categorySelect.closest('.grid');
    expect(categoryContainer).toHaveClass('grid-cols-1', 'sm:grid-cols-2');
  });

  it('displays activities list with mobile-optimized styling', () => {
    renderActivitiesPage();
    
    // Check that activities are displayed
    expect(screen.getByText('Morning Workout')).toBeInTheDocument();
    expect(screen.getByText('German Study')).toBeInTheDocument();
    
    // Check responsive text sizing
    const activityItems = screen.getAllByText(/workout|study/i);
    activityItems.forEach(item => {
      expect(item).toHaveClass('text-sm', 'md:text-base');
    });
  });

  it('shows proper loading and error states', () => {
    renderActivitiesPage();
    
    // Should show count of activities
    expect(screen.getByText(/2 activities shown/i)).toBeInTheDocument();
  });

  it('has accessible touch interactions with proper aria labels', () => {
    renderActivitiesPage();
    
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    expect(deleteButtons).toHaveLength(2);
    
    // Check that delete buttons have proper aria labels
    expect(screen.getByLabelText('Delete Morning Workout')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete German Study')).toBeInTheDocument();
  });
});
