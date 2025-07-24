import React, { useState } from 'react';
import { AuthForm } from '../components/Auth/AuthForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return <AuthForm mode={mode} onModeChange={setMode} />;
};