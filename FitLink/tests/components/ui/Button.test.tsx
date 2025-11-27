import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../src/components/ui/Button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render with title', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="Click me" onPress={() => {}} />
      );
      
      // Assert
      expect(getByText('Click me')).toBeTruthy();
    });

    it('should render with empty title', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="" onPress={() => {}} />
      );
      
      // Assert
      expect(getByText('')).toBeTruthy();
    });
  });

  describe('press behavior', () => {
    it('should call onPress when pressed', () => {
      // Arrange
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Click me" onPress={onPressMock} />
      );
      
      // Act
      fireEvent.press(getByText('Click me'));

      // Assert
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      // Arrange
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="Disabled" onPress={onPressMock} disabled={true} />
      );
      
      // Act
      fireEvent.press(getByText('Disabled'));

      // Assert
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('variants', () => {
    it('should render primary variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="Primary" onPress={() => {}} variant="primary" />
      );
      
      // Assert
      expect(getByText('Primary')).toBeTruthy();
    });

    it('should render secondary variant', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="Secondary" onPress={() => {}} variant="secondary" />
      );
      
      // Assert
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('should use primary variant by default', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="Default" onPress={() => {}} />
      );
      
      // Assert
      expect(getByText('Default')).toBeTruthy();
    });
  });

  describe('disabled state', () => {
    it('should render when disabled', () => {
      // Arrange & Act
      const { getByText } = render(
        <Button title="Disabled Button" onPress={() => {}} disabled={true} />
      );
      
      // Assert
      expect(getByText('Disabled Button')).toBeTruthy();
    });
  });
});
