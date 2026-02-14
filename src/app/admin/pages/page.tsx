'use client';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X, Eye, FileText } from 'lucide-react';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', isPublished: true });
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPages();
      setPages(res.data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminAPI.updatePage(editing._id, form);
        toast.success('Page updated');
      } else {
        await adminAPI.createPage(form);
        toast.success('Page created');
      }
      resetForm();
      fetchPages();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    try {
      await adminAPI.deletePage(id);
      toast.success('Page deleted');
      fetchPages();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const startEdit = (page: any) => {
    setEditing(page);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      isPublished: page.isPublished !== false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', isPublished: true });
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-dark">Pages / CMS</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary !py-2 flex items-center gap-2"><Plus className="h-4 w-4" /> New Page</button>
      </div>

      {showForm && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">{editing ? 'Edit Page' : 'New Page'}</h3>
            <button onClick={resetForm}><X className="h-5 w-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Slug *</label>
                <input type="text" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="e.g. about-us" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Content (HTML) *</label>
              <textarea rows={12} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-field font-mono text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Title</label>
                <input type="text" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Meta Description</label>
                <input type="text" value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-gold" />
              <label htmlFor="isPublished" className="text-sm">Published</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary !py-2 flex items-center gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Updated</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pages.map(page => (
                  <tr key={page._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /> {page.title}</td>
                    <td className="px-4 py-3 text-gray-500">/{page.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${page.isPublished !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{page.isPublished !== false ? 'Published' : 'Draft'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(page.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a href={`/pages/${page.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded" title="Preview"><Eye className="h-4 w-4" /></a>
                        <button onClick={() => startEdit(page)} className="p-1.5 hover:bg-gray-100 rounded" title="Edit"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(page._id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pages.length === 0 && <p className="text-center py-8 text-gray-500">No pages found</p>}
          </div>
        )}
      </div>
    </div>
  );
}