import React, { FC } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
}) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.colors.textSecondary,
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    width: '100%',
  },
});