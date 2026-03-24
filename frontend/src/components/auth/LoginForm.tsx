'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'Debes ingresar al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', data);
      const { access_token, user } = response.data;
      
      login(access_token, user);

      // Redireccion al dash principal (Tarea 5)
      router.push('/super-admin/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error de red. Asegúrate de que el backend esté conectado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Meys</h1>
        <p className="text-sm text-gray-500 mt-2">Mantenimiento de Equipos Electrónicos y Sistemas</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
          <div className="mt-1.5">
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="admin@meys.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-medium mt-1.5">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
          <div className="mt-1.5">
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-medium mt-1.5">{errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex justify-center items-center px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-semibold rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>
    </div>
  );
}
