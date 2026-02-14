'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { clientAPI, categoryAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Save } from 'lucide-react';

export default function EditAuctionPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      clientAPI.getAuction(params.id as string),
      categoryAPI.getAll(),
    ]).then(([aRes, cRes]) => {
      const a = aRes.data.data;
      setForm({
        title: a.title, description: a.description, shortDescription: a.shortDescription || '',
        category: a.category?._id || a.category || '', buyersPremium: a.buyersPremium,
        startTime: a.startTime?.slice(0, 16) || '', endTime: a.endTime?.slice(0, 16) || '',
        location: a.location || { city: '', state: '', country: '' },
        termsAndConditions: a.termsAndConditions || '', shippingTerms: a.shippingTerms || '', coverImage: a.coverImage || '',
      });
      setCategories(cRes.data.data || []);
    }).catch(() => toast.error('Failed to load')).finally(() => setIsLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await clientAPI.updateAuction(params.id as string, form); toast.success('Updated!'); router.push('/client/auctions'); } catch (error: any) { toast.error(error.response?.data?.error || 'Failed'); } finally { setSaving(false); }
  };

  if (isLoading || !form) return <PageLoader />;
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Edit Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Short Description</label><input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label><textarea required rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Category</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field"><option value="">Select</option>{categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Buyer&apos;s Premium (%)</label><input type="number" value={form.buyersPremium} onChange={e => setForm({ ...form, buyersPremium: parseInt(e.target.value) })} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Start Time</label><input type="datetime-local" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">End Time</label><input type="datetime-local" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="input-field" /></div>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}