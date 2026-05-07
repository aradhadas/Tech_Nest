import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { demoUsers } from '@/data';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';

export default function AdminVendors() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [vendors, setVendors] = useState(demoUsers.filter(u => u.role === 'vendor'));

  const pendingVendors = vendors.filter(v => v.approvalStatus === 'pending');
  const allVendors = vendors;

  const handleApprove = (vendorId: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        addToast(`Vendor ${v.storeName} approved`, 'success');
        return { ...v, approvalStatus: 'approved' as const };
      }
      return v;
    }));
  };

  const handleReject = (vendorId: string) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        addToast(`Vendor ${v.storeName} rejected`, 'error');
        return { ...v, approvalStatus: 'rejected' as const };
      }
      return v;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="admin" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          Vendor Management
        </h1>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-[#E4E6ED]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'pending' ? 'text-[#E8321C]' : 'text-[#6B7280] hover:text-[#111318]'
            }`}
          >
            Pending ({pendingVendors.length})
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8321C]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'all' ? 'text-[#E8321C]' : 'text-[#6B7280] hover:text-[#111318]'
            }`}
          >
            All Vendors
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8321C]" />
            )}
          </button>
        </div>

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingVendors.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl">
                <Clock size={48} className="mx-auto text-[#B0B7C3] mb-3" />
                <p className="text-lg font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  No pending approvals
                </p>
                <p className="text-sm text-[#6B7280] mt-1">All vendors have been reviewed</p>
              </div>
            )}
            {pendingVendors.map(vendor => (
              <div key={vendor.id} className="bg-white border border-[#E4E6ED] rounded-xl p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {vendor.storeName}
                      </h3>
                      <span className="text-xs text-[#B0B7C3]">Applied recently</span>
                    </div>
                    <p className="text-sm text-[#6B7280] mt-1">
                      {vendor.email} · {vendor.phone}
                    </p>
                    <p className="text-sm text-[#6B7280] mt-2">{vendor.storeDescription}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(vendor.id)}
                      className="flex items-center gap-1 px-4 py-2 border border-[#E4E6ED] rounded-lg text-sm font-medium text-[#111318] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className="flex items-center gap-1 px-4 py-2 bg-[#E8321C] rounded-lg text-sm font-medium text-white hover:bg-[#C5290F] transition-colors"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Vendors Tab */}
        {activeTab === 'all' && (
          <div className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
              <div className="col-span-3">Store Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-3">Actions</div>
            </div>
            {allVendors.map(vendor => (
              <div key={vendor.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] last:border-0 items-center">
                <div className="col-span-3 text-sm font-bold text-[#111318]">{vendor.storeName}</div>
                <div className="col-span-2 text-sm text-[#6B7280]">{vendor.name}</div>
                <div className="col-span-2">
                  <StatusChip status={vendor.approvalStatus || 'pending'} />
                </div>
                <div className="col-span-2 text-sm font-mono text-[#6B7280]">{vendor.joinedDate}</div>
                <div className="col-span-3 flex gap-2">
                  {vendor.status === 'active' ? (
                    <button
                      onClick={() => {
                        vendor.status = 'suspended';
                        addToast('Vendor suspended', 'info');
                      }}
                      className="text-xs px-3 py-1.5 border border-[#E4E6ED] rounded-lg hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        vendor.status = 'active';
                        addToast('Vendor reactivated', 'success');
                      }}
                      className="text-xs px-3 py-1.5 bg-[#E8321C] text-white rounded-lg hover:bg-[#C5290F] transition-colors"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
