import { useState } from 'react';
import { useRouter } from 'expo-router';
import { loginUser } from '../services/authService';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const useLoginContainer = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await loginUser(formData.email, formData.password);
      router.replace('/(tabs)/home');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Invalid login credentials')) {
        setErrors({ email: 'Credenciales inválidas' });
      } else {
        setErrors({ email: 'Error en login' });
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return {
    formData,
    errors,
    loading,
    updateField,
    handleLogin,
    navigateToRegister,
  };
};