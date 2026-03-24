'use client';

import { useState, useEffect } from 'react';
import { adminUsersService } from '@/services/adminUsers.service';
import UsersTable from '@/components/admin/UsersTable';
import UserModal from '@/components/admin/UserModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { Users, UserX } from 'lucide-react';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = activeTab === 'active' 
        ? await adminUsersService.getAll() 
        : await adminUsersService.getDeleted();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    // Actualización optimista del UI
    setUsers(currentUsers => 
      currentUsers.map(user => user.id === id ? { ...user, isActive: !user.isActive } : user)
    );
    try {
      await adminUsersService.toggleStatus(id);
      toast.success('Estado de sesión actualizado');
    } catch (error) {
      toast.error('No se pudo actualizar el estado');
      fetchUsers(); // Rollback en caso de error
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await adminUsersService.remove(userToDelete);
      toast.success('Administrador trasladado a la papelera');
      fetchUsers();
    } catch (error) {
      toast.error('No se pudo eliminar el usuario');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await adminUsersService.restore(id);
      toast.success('Usuario restaurado exitosamente');
      fetchUsers();
    } catch (error) {
      toast.error('No se pudo restaurar el usuario');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 border-b pb-2 inline-block">Gestión de Usuarios Super Admin</h1>
          <p className="text-sm text-gray-500 mt-2">Administra los dueños globales y auditores del sistema (MEYS).</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors font-medium flex items-center space-x-2"
        >
          <span>+ Nuevo Admin</span>
        </button>
      </div>

      <div className="flex space-x-6 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
            activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users size={18} />
          <span>Activos</span>
        </button>
        <button
          onClick={() => setActiveTab('deleted')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
            activeTab === 'deleted' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <UserX size={18} />
          <span>Eliminados ({activeTab === 'deleted' ? users.length : '...'})</span>
        </button>
      </div>

      <UsersTable
        users={users}
        loading={loading}
        isDeletedView={activeTab === 'deleted'}
        onEdit={handleEdit}
        onToggle={handleToggle}
        onDelete={handleDeleteClick}
        onRestore={handleRestore}
      />

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchUsers();
          }}
          editingUser={editingUser}
        />
      )}

      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Revocar Acceso de Administrador"
        message="¿Estás seguro de que deseas eliminar a este administrador? Su acceso al sistema será bloqueado y su cuenta pasará a la lista de eliminados, aunque podrás restaurarlo más tarde."
        confirmLabel="Sí, eliminar administrador"
        isLoading={isDeleting}
      />
    </div>
  );
}
