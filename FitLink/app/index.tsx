// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login'); // Redirige a la pantalla de login
  }, [router]);

  return null; // No renderiza nada
}
