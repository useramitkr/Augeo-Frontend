'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { clientAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';

export default function LotsManagementPage() {
  const params = useParams();
  const auctionId = params.id as string;
  const [lots, setLots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lotForm, setLotForm] = useState({
    title: '', description: '', lotNumber: 0, startingBid: 0, reservePrice: 0,
    estimateLow: 0, estimateHigh: 0, bidIncrement: 10, artist: '', origin: '',
    materials: '', dimensions: '', yearCreated: '', conditionReport: '', conditionRating: 'good',
  });

  const fetchLots = () => {
    setIsLoading(true);
    clientAPI.getLots(auctionId).then(res => setLots(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
  };

  useEffect(fetchLots, [auctionId]);

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await clientAPI.createLot(auctionId, { ...lotForm, lotNumber: lotForm.lotNumber || lots.length + 1 });
      toast.success('Lot created!');
      setShowForm(false);
      setLotForm({ title: '', description: '', lotNumber: 0, startingBid: 0, reservePrice: 0, estimateLow: 0, estimateHigh: 0, bidIncrement: 10, artist: '', origin: '', materials: '', dimensions: '', yearCreated: '', conditionReport: '', conditionRating: 'good' });
      fetchLots();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed'); } finally { setSaving(false); }
  };

  const handleDeleteLot = async (lotId: string) => {
    if (!confirm('Delete this lot?')) return;
    try { await clientAPI.deleteLot(lotId); toast.success('Deleted'); fetchLots(); } catch (error: any) { toast.error(error.response?.data?.error || 'Cannot delete'); }
  };

  const u = (field: string, value: any) => setLotForm(prev => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-dark">Lot Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm !py-2.5 gap-2">{showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Lot</>}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateLot} className="card p-6 mb-6 space-y-4">
          <h3 className="font-heading font-semibold text-dark">New Lot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><input required value={lotForm.title} onChange={e => u('title', e.target.value)} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Lot Number</label><input type="number" value={lotForm.lotNumber || ''} onChange={e => u('lotNumber', parseInt(e.target.value) || 0)} className="input-field text-sm" placeholder="Auto" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Description *</label><textarea required rows={3} value={lotForm.description} onChange={e => u('description', e.target.value)} className="input-field text-sm" /></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Starting Bid *</label><input type="number" required min={0} value={lotForm.startingBid || ''} onChange={e => u('startingBid', parseFloat(e.target.value))} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Reserve Price</label><input type="number" min={0} value={lotForm.reservePrice || ''} onChange={e => u('reservePrice', parseFloat(e.target.value))} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Estimate Low</label><input type="number" min={0} value={lotForm.estimateLow || ''} onChange={e => u('estimateLow', parseFloat(e.target.value))} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Estimate High</label><input type="number" min={0} value={lotForm.estimateHigh || ''} onChange={e => u('estimateHigh', parseFloat(e.target.value))} className="input-field text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Bid Increment</label><input type="number" min={1} value={lotForm.bidIncrement} onChange={e => u('bidIncrement', parseFloat(e.target.value))} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Artist</label><input value={lotForm.artist} onChange={e => u('artist', e.target.value)} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Origin</label><input value={lotForm.origin} onChange={e => u('origin', e.target.value)} className="input-field text-sm" /></div>
            <div><label className="text-sm font-medium mb-1 block">Year</label><input value={lotForm.yearCreated} onChange={e => u('yearCreated', e.target.value)} className="input-field text-sm" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Condition Report</label><textarea rows={2} value={lotForm.conditionReport} onChange={e => u('conditionReport', e.target.value)} className="input-field text-sm" /></div>
          <button type="submit" disabled={saving} className="btn-primary text-sm !py-2.5 gap-2 disabled:opacity-50"><Save className="h-4 w-4" /> {saving ? 'Creating...' : 'Create Lot'}</button>
        </form>
      )}

      {isLoading ? <PageLoader /> : lots.length === 0 ? (
        <div className="text-center py-16 card"><p className="text-gray-500">No lots yet. Add your first lot.</p></div>
      ) : (
        <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="table-header"><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Starting</th><th className="px-4 py-3">Current</th><th className="px-4 py-3">Bids</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>
          {lots.map(lot => (
            <tr key={lot._id} className="border-t border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{lot.lotNumber}</td>
              <td className="px-4 py-3 text-sm">{lot.title}</td>
              <td className="px-4 py-3 text-sm">{formatCurrency(lot.startingBid)}</td>
              <td className="px-4 py-3 text-sm font-bold">{lot.currentBid > 0 ? formatCurrency(lot.currentBid) : '-'}</td>
              <td className="px-4 py-3 text-sm">{lot.totalBids}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${lot.status === 'active' ? 'bg-green-100 text-green-700' : lot.status === 'sold' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{lot.status}</span></td>
              <td className="px-4 py-3"><button onClick={() => handleDeleteLot(lot._id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button></td>
            </tr>
          ))}
        </tbody></table></div></div>
      )}
    </div>
  );
}