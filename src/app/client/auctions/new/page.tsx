'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientAPI, categoryAPI } from '@/lib/api';
import { Category } from '@/types';
import toast from 'react-hot-toast';
import { Save, Eye } from 'lucide-react';

export default function CreateAuctionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', category: '', startTime: '', endTime: '',
    buyersPremium: 15, auctionType: 'timed', coverImage: '',
    location: { address: '', city: '', state: '', country: '' },
    termsAndConditions: '', shippingTerms: '',
  });

  useEffect(() => { categoryAPI.getAll().then(res => setCategories(res.data.data || [])).catch(() => {}); }, []);

  const update = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));
  const updateLocation = (field: string, value: string) => setForm(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { ...form, isPublished: publish, status: publish ? 'scheduled' : 'draft' };
      const res = await clientAPI.createAuction(data);
      toast.success(publish ? 'Auction published!' : 'Draft saved!');
      router.push(`/client/auctions/${res.data.data._id}/lots`);
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-6">Create New Auction</h1>
      <form onSubmit={e => handleSubmit(e, false)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-dark">Basic Information</h3>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label><input type="text" required value={form.title} onChange={e => update('title', e.target.value)} className="input-field" placeholder="e.g., Fine Art Evening Sale" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Short Description</label><input type="text" maxLength={500} value={form.shortDescription} onChange={e => update('shortDescription', e.target.value)} className="input-field" placeholder="Brief summary" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label><textarea required rows={5} value={form.description} onChange={e => update('description', e.target.value)} className="input-field" placeholder="Full auction description..." /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="input-field"><option value="">Select category</option>{categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Buyer&apos;s Premium (%)</label><input type="number" min={0} max={50} value={form.buyersPremium} onChange={e => update('buyersPremium', parseInt(e.target.value))} className="input-field" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Cover Image URL</label><input type="text" value={form.coverImage} onChange={e => update('coverImage', e.target.value)} className="input-field" placeholder="https://..." /></div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-dark">Schedule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Start Time *</label><input type="datetime-local" required value={form.startTime} onChange={e => update('startTime', e.target.value)} className="input-field" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">End Time *</label><input type="datetime-local" required value={form.endTime} onChange={e => update('endTime', e.target.value)} className="input-field" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-dark">Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><input placeholder="City" value={form.location.city} onChange={e => updateLocation('city', e.target.value)} className="input-field" /></div>
            <div><input placeholder="State" value={form.location.state} onChange={e => updateLocation('state', e.target.value)} className="input-field" /></div>
            <div className="sm:col-span-2"><input placeholder="Country" value={form.location.country} onChange={e => updateLocation('country', e.target.value)} className="input-field" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-heading font-semibold text-dark">Terms</h3>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Terms & Conditions</label><textarea rows={4} value={form.termsAndConditions} onChange={e => update('termsAndConditions', e.target.value)} className="input-field" /></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Terms</label><textarea rows={3} value={form.shippingTerms} onChange={e => update('shippingTerms', e.target.value)} className="input-field" /></div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-secondary gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> Save as Draft</button>
          <button type="button" onClick={e => handleSubmit(e as any, true)} disabled={saving} className="btn-primary gap-2 disabled:opacity-50"><Eye className="h-4 w-4" /> Save & Publish</button>
        </div>
      </form>
    </div>
  );
}