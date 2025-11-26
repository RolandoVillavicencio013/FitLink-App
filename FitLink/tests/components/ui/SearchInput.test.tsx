jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      border: '#cccccc',
      textSecondary: '#666666',
    },
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchInput } from '../../../src/components/ui/SearchInput';

describe('SearchInput', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(
      <SearchInput value="" onChangeText={mockOnChangeText} />
    )).not.toThrow();
  });

  it('should display placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={mockOnChangeText} placeholder="Search here..." />
    );
    expect(getByPlaceholderText('Search here...')).toBeTruthy();
  });

  it('should display default placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={mockOnChangeText} />
    );
    expect(getByPlaceholderText('Buscar...')).toBeTruthy();
  });

  it('should display value', () => {
    const { getByDisplayValue } = render(
      <SearchInput value="test search" onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue('test search')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={mockOnChangeText} />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar...'), 'new text');
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('should call onChangeText exactly once', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={mockOnChangeText} />
    );
    fireEvent.changeText(getByPlaceholderText('Buscar...'), 'test');
    expect(mockOnChangeText).toHaveBeenCalledTimes(1);
  });

  it('should update with new value', () => {
    const { getByDisplayValue, rerender } = render(
      <SearchInput value="initial" onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue('initial')).toBeTruthy();
    
    rerender(<SearchInput value="updated" onChangeText={mockOnChangeText} />);
    expect(getByDisplayValue('updated')).toBeTruthy();
  });

  it('should handle empty string value', () => {
    const { getByPlaceholderText } = render(
      <SearchInput value="" onChangeText={mockOnChangeText} />
    );
    expect(getByPlaceholderText('Buscar...')).toBeTruthy();
  });

  it('should handle long text value', () => {
    const longText = 'This is a very long search query with many characters';
    const { getByDisplayValue } = render(
      <SearchInput value={longText} onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue(longText)).toBeTruthy();
  });
});
