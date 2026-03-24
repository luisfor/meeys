'use client';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';

interface UsersTableProps {
  users: any[];
  loading: boolean;
  isDeletedView?: boolean;
  onEdit: (user: any) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
}

export default function UsersTable({ users, loading, isDeletedView = false, onEdit, onToggle, onDelete, onRestore }: UsersTableProps) {
  if (loading) {
    return <div className="animate-pulse flex flex-col space-y-4 items-center justify-center p-12"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div><p className="text-gray-500 font-medium">Cargando administradores...</p></div>;
  }

  if (users.length === 0) {
    return <div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-500">No se encontraron administradores globales en el sistema.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="px-6 py-4">Administrador</th>
              <th className="px-6 py-4">Contacto de Seguridad</th>
              <th className="px-6 py-4">Estado de Sesión</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName ? `${user.firstName} ${user.lastName}` : 'Sin nombre asignado'}</p>
                      <p className="text-xs text-blue-600 font-mono mt-0.5">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Telf: {user.phone || 'N/A'}</p>
                  <p className="text-xs text-gray-400">Doc: {user.documentNumber || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                  {isDeletedView ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 shadow-sm">
                      Eliminado
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onToggle(user.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          user.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            user.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`ml-2 text-xs font-semibold align-text-bottom ${user.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {user.isActive ? 'Autorizado' : 'Suspendido'}
                      </span>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {isDeletedView ? (
                      <button onClick={() => onRestore && onRestore(user.id)} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors border border-transparent hover:border-green-200" title="Restaurar Usuario">
                        <RefreshCw size={18} />
                      </button>
                    ) : (
                      <>
                        <button onClick={() => onEdit(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => onDelete(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Borrar (Soft Delete)">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
