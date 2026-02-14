'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, UserCheck, UserX, Eye } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleSuspend = async (id: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    try {
      await adminAPI.suspendUser(id);
      toast.success('User suspended');
      fetchUsers();
      setSelectedUser(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleActivate = async (id: string) => {
    try {
      await adminAPI.activateUser(id);
      toast.success('User activated');
      fetchUsers();
      setSelectedUser(null);
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-dark">User Management</h1>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-primary !py-2">Search</button>
          </form>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input-field w-40">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">KYC</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                        user.role === 'admin' ? 'bg-orange-100 text-orange-700' :
                        user.role === 'client' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.kyc?.status === 'verified' ? 'bg-green-100 text-green-700' : user.kyc?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{user.kyc?.status || 'none'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedUser(user)} className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye className="h-4 w-4" /></button>
                        {user.status === 'active' ? (
                          <button onClick={() => handleSuspend(user._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Suspend"><UserX className="h-4 w-4" /></button>
                        ) : (
                          <button onClick={() => handleActivate(user._id)} className="p-1.5 hover:bg-green-50 rounded text-green-500" title="Activate"><UserCheck className="h-4 w-4" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-heading font-bold mb-4">User Details</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Name:</span><p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p></div>
                <div><span className="text-gray-500">Email:</span><p className="font-medium">{selectedUser.email}</p></div>
                <div><span className="text-gray-500">Phone:</span><p className="font-medium">{selectedUser.phone || 'N/A'}</p></div>
                <div><span className="text-gray-500">Role:</span><p className="font-medium">{selectedUser.role}</p></div>
                <div><span className="text-gray-500">Status:</span><p className="font-medium">{selectedUser.status}</p></div>
                <div><span className="text-gray-500">Verified:</span><p className="font-medium">{selectedUser.isEmailVerified ? 'Yes' : 'No'}</p></div>
                <div><span className="text-gray-500">Joined:</span><p className="font-medium">{formatDate(selectedUser.createdAt)}</p></div>
                <div><span className="text-gray-500">KYC:</span><p className="font-medium">{selectedUser.kyc?.status || 'None'}</p></div>
              </div>
              {selectedUser.role === 'client' && selectedUser.companyName && (
                <div className="pt-3 border-t">
                  <span className="text-gray-500">Company:</span>
                  <p className="font-medium">{selectedUser.companyName}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              {selectedUser.status === 'active' ? (
                <button onClick={() => handleSuspend(selectedUser._id)} className="btn-primary !bg-red-500 !py-2 text-sm">Suspend User</button>
              ) : (
                <button onClick={() => handleActivate(selectedUser._id)} className="btn-primary !bg-green-500 !py-2 text-sm">Activate User</button>
              )}
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}