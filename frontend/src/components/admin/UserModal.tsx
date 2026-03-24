'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { adminUsersService } from '@/services/adminUsers.service';
import toast from 'react-hot-toast';

import { Camera } from 'lucide-react';

const userSchema = z.object({
  firstName: z.string().min(2, 'El nombre es obligatorio'),
  lastName: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('El formato del correo es inválido'),
  photoUrl: z.string().optional(),
  documentNumber: z.string().optional(),
  phone: z.string().min(8, 'Teléfono muy corto').optional().or(z.literal('')),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser: any | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, editingUser }: UserModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!editingUser;

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      photoUrl: '',
      documentNumber: '',
      phone: '',
      password: '',
    }
  });

  useEffect(() => {
    if (editingUser) {
      setAvatarPreview(editingUser.photoUrl || null);
      reset({
        firstName: editingUser.firstName || '',
        lastName: editingUser.lastName || '',
        email: editingUser.email || '',
        photoUrl: editingUser.photoUrl || '',
        documentNumber: editingUser.documentNumber || '',
        phone: editingUser.phone || '',
        password: '',
      });
    } else {
      setAvatarPreview(null);
      reset();
    }
  }, [editingUser, reset]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setValue('photoUrl', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setSubmitting(true);
      
      const payload: any = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        photoUrl: data.photoUrl || undefined,
        documentNumber: data.documentNumber || undefined,
        phone: data.phone || undefined,
      };

      if (data.password) {
        if (data.password.length < 6) {
          toast.error('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        payload.password = data.password;
      }

      if (isEditing) {
        await adminUsersService.update(editingUser.id, payload);
        toast.success('Administrador actualizado exitosamente');
      } else {
        if (!data.password) {
          toast.error('La contraseña es obligatoria para nuevos administradores');
          return;
        }
        await adminUsersService.create(payload);
        toast.success('Administrador creado exitosamente');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ocurrió un error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    toast.error('Revisa los errores en el formulario');
    console.error('Validation Error:', formErrors);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" onClick={onClose}></div>

        <div className="relative z-10 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2 mb-4">
                    {isEditing ? 'Editar Administrador' : 'Nuevo Administrador Global'}
                  </h3>
                  
                  <div className="space-y-5">
                    
                    {/* Sección Foto de Perfil */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-24 h-24 rounded-full bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center overflow-hidden group">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="text-blue-300" size={32} />
                        )}
                        <label className="absolute inset-0 cursor-pointer bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-semibold text-white">Cambiar</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Avatar de Perfil</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Ej. Juan"
                        />
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Ej. Pérez"
                        />
                        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Correo Electrónico *</label>
                      <input
                        type="email"
                        {...register('email')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="admin@meys.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <PhoneInput
                              country={'co'}
                              value={value || ''}
                              onChange={(phone) => onChange(phone ? `+${phone}` : '')}
                              inputClass="!w-full !border-gray-300 !rounded-md !shadow-sm focus:!ring-blue-500 focus:!border-blue-500 !py-2 !h-auto !text-sm"
                              containerClass="mt-1"
                              buttonClass="!border-gray-300 !rounded-l-md !bg-gray-50 hover:!bg-gray-100"
                              placeholder="+57 300 123 4567"
                              enableSearch={true}
                              searchPlaceholder="Buscar país..."
                            />
                          )}
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nro. Documento</label>
                        <input
                          type="text"
                          {...register('documentNumber')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contraseña {isEditing ? '(Dejar en blanco para mantener actual)' : '*'}
                      </label>
                      <input
                        type="password"
                        {...register('password')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="********"
                      />
                      {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : 'Guardar Administrador'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
