import { useState } from 'react';
import { useRouter } from 'expo-router';
import { registerUser } from '../services/authService';

interface RegisterFormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
}

export const useRegisterContainer = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await registerUser(
        formData.email,
        formData.password,
        formData.username,
        formData.fullName
      );
      router.replace('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setErrors({ email: 'Error en registro: ' + message });
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  return {
    formData,
    errors,
    loading,
    updateField,
    handleRegister,
    navigateToLogin,
  };
};