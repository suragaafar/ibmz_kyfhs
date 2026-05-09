import { Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import HomePage from '@/features/emissions/pages/HomePage';
import { AppRoutes } from '@/routes/appRoutes';
import Layout from '@/shared/components/layout/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={AppRoutes.home} element={<HomePage />} />
        <Route path={AppRoutes.login} element={<LoginPage />} />
        <Route path={AppRoutes.register} element={<RegisterPage />} />
        <Route path={AppRoutes.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={AppRoutes.resetPassword} element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}
