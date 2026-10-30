import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useLogin() {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((previous) => !previous);

  const handleLogin = () => {
    if (!trainerId || !password) {
      setErrorMessage('Complete your Trainer ID and Secret Code.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    router.replace('/(protected)/dashboard');
    setIsLoading(false);
  };

  return { trainerId, password, setTrainerId, setPassword, isLoading, errorMessage, isPasswordVisible, togglePasswordVisibility, handleLogin };
}
