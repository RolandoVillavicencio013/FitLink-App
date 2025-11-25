export const required = (message = 'Este campo es obligatorio') => (value: string): string => {
  return value.trim() ? '' : message;
};

export const email = (message = 'Correo electrónico inválido') => (value: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? '' : message;
};

export const minLength = (min: number, message?: string) => (value: string): string => {
  const defaultMessage = `Debe tener al menos ${min} caracteres`;
  return value.length >= min ? '' : (message || defaultMessage);
};

export const maxLength = (max: number, message?: string) => (value: string): string => {
  const defaultMessage = `No puede exceder ${max} caracteres`;
  return value.length <= max ? '' : (message || defaultMessage);
};