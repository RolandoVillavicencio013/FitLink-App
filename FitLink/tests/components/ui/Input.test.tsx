import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../../src/components/ui/Input';

describe('Input', () => {
  it('should render with placeholder', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" value="" onChange={() => {}} />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = render(
      <Input label="Email" placeholder="Enter email" value="" onChange={() => {}} />
    );
    
    expect(getByText('Email')).toBeTruthy();
  });

  it('should display the value', () => {
    const { getByDisplayValue } = render(
      <Input placeholder="Enter text" value="test value" onChange={() => {}} />
    );
    
    expect(getByDisplayValue('test value')).toBeTruthy();
  });

  it('should call onChange when text changes', () => {
    const onChangeMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" value="" onChange={onChangeMock} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'new text');
    expect(onChangeMock).toHaveBeenCalledWith('new text');
  });

  it('should display error message', () => {
    const { getByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        error="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should validate with rules and show internal error', () => {
    const requiredRule = (value: string) => value ? '' : 'Required field';
    const { getByPlaceholderText, getByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        rules={[requiredRule]}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), '');
    expect(getByText('Required field')).toBeTruthy();
  });

  it('should clear internal error when valid input is provided', () => {
    const requiredRule = (value: string) => value ? '' : 'Required field';
    const { getByPlaceholderText, queryByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        rules={[requiredRule]}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, '');
    expect(queryByText('Required field')).toBeTruthy();
    
    fireEvent.changeText(input, 'valid text');
    expect(queryByText('Required field')).toBeFalsy();
  });

  it('should validate with multiple rules', () => {
    const requiredRule = (value: string) => value ? '' : 'Required';
    const minLengthRule = (value: string) => value.length >= 3 ? '' : 'Min 3 chars';
    
    const { getByPlaceholderText, getByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        rules={[requiredRule, minLengthRule]}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'ab');
    expect(getByText('Min 3 chars')).toBeTruthy();
  });

  it('should prioritize external error over internal error', () => {
    const requiredRule = (value: string) => value ? '' : 'Internal error';
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        rules={[requiredRule]}
        error="External error"
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), '');
    expect(getByText('External error')).toBeTruthy();
    expect(queryByText('Internal error')).toBeFalsy();
  });

  it('should support secureTextEntry prop', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Password" 
        value="" 
        onChange={() => {}} 
        secureTextEntry
      />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should support keyboardType prop', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Email" 
        value="" 
        onChange={() => {}} 
        keyboardType="email-address"
      />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should support autoCapitalize prop', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Email" 
        value="" 
        onChange={() => {}} 
        autoCapitalize="none"
      />
    );
    
    const input = getByPlaceholderText('Email');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should stop at first validation error', () => {
    const rule1 = (value: string) => value ? '' : 'Error 1';
    const rule2 = () => 'Error 2';
    
    const { getByPlaceholderText, getByText, queryByText } = render(
      <Input 
        placeholder="Enter text" 
        value="" 
        onChange={() => {}} 
        rules={[rule1, rule2]}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), '');
    expect(getByText('Error 1')).toBeTruthy();
    expect(queryByText('Error 2')).toBeFalsy();
  });
});
