import { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';

export default function AdminVendors() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const { users, updateApprovalStatus, updateUserStatus } = useUsers();
  
  const vendors = users.filter(u => u.role === 'vendor');
  const pendingVendors = vendors.filter(v => v.approvalStatus === 'pending');
  const allVendors = vendors;

  const handleApprove = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const result = await updateApprovalStatus(vendorId, 'approved');
    if (result.success) {
      addToast(`Vendor ${vendor.storeName} approved`, 'success');
    } else {
      addToast(result.error || 'Failed to approve vendor', 'error');
    }
  };

  const handleReject = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const result = await updateApprovalStatus(vendorId, 'rejected');
    if (result.success) {
      addToast(`Vendor ${vendor.storeName} rejected`, 'error');
    } else {
      addToast(result.error || 'Failed to reject vendor', 'error');
    }
  };

  const handleToggleStatus = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const newStatus = vendor.status === 'active' ? 'suspended' : 'active';
    const result = await updateUserStatus(vendorId, newStatus);
    
    if (result.success) {
      addToast(`Vendor ${newStatus === 'active' ? 'reactivated' : 'suspended'}`, newStatus === 'active' ? 'success' : 'info');
    } else {
      addToast(result.error || 'Failed to update vendor status', 'error');
    }
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
              <div key={vendor.id} className="bg-white border border-[#E4E6ED] rounded-xl p-4 lg:p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-0">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-[#111318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {vendor.storeName}
                      </h3>
                      <span className="text-[11px] bg-[#F0F1F5] text-[#6B7280] px-2 py-0.5 rounded-full">Applied recently</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">
                      {vendor.email} <span className="hidden sm:inline">·</span> <br className="sm:hidden" /> {vendor.phone}
                    </p>
                    <p className="text-[13px] text-[#6B7280] mt-2 line-clamp-2">{vendor.storeDescription}</p>
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => handleReject(vendor.id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 border border-[#E4E6ED] rounded-lg text-sm font-medium text-[#111318] hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E8321C] rounded-lg text-sm font-medium text-white hover:bg-[#C5290F] transition-colors"
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
          <div className="space-y-4 lg:space-y-0">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280] rounded-t-xl border border-[#E4E6ED] border-b-0">
              <div className="col-span-3">Store Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-3">Actions</div>
            </div>
            
            {/* Table Body / Mobile Cards */}
            <div className="lg:bg-white lg:border lg:border-[#E4E6ED] lg:rounded-b-xl lg:overflow-hidden space-y-4 lg:space-y-0">
              {allVendors.map(vendor => (
                <div key={vendor.id} className="bg-white border border-[#E4E6ED] rounded-lg lg:rounded-none lg:border-x-0 lg:border-t-0 p-4 lg:p-6 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                  
                  <div className="flex justify-between items-start lg:block lg:col-span-3 mb-2 lg:mb-0">
                    <div>
                      <span className="lg:hidden text-[10px] uppercase font-bold text-[#8B93A6] block mb-1">Store Name</span>
                      <div className="text-sm font-bold text-[#111318]">{vendor.storeName}</div>
                    </div>
                    <div className="lg:hidden">
                      <StatusChip status={vendor.approvalStatus || 'pending'} />
                    </div>
                  </div>

                  <div className="lg:col-span-2 mb-2 lg:mb-0">
                    <span className="lg:hidden text-[10px] uppercase font-bold text-[#8B93A6] block mb-0.5">Owner</span>
                    <div className="text-sm text-[#6B7280]">{vendor.name}</div>
                  </div>
                  
                  <div className="hidden lg:block lg:col-span-2">
                    <StatusChip status={vendor.approvalStatus || 'pending'} />
                  </div>
                  
                  <div className="lg:col-span-2 flex justify-between items-center lg:block mt-3 lg:mt-0 pt-3 lg:pt-0 border-t border-[#E4E6ED]/60 lg:border-t-0">
                    <span className="lg:hidden text-[10px] uppercase font-bold text-[#8B93A6]">Joined Date</span>
                    <div className="text-sm font-mono text-[#6B7280]">{vendor.joinedDate}</div>
                  </div>
                  
                  <div className="lg:col-span-3 mt-3 lg:mt-0">
                    {vendor.status === 'active' ? (
                      <button
                        onClick={() => handleToggleStatus(vendor.id)}
                        className="w-full lg:w-auto text-xs font-semibold px-4 py-2 border border-[#E4E6ED] rounded-lg hover:border-[#E8321C] hover:text-[#E8321C] transition-colors"
                      >
                        Suspend Vendor
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(vendor.id)}
                        className="w-full lg:w-auto text-xs font-semibold px-4 py-2 bg-[#E8321C] text-white rounded-lg hover:bg-[#C5290F] transition-colors"
                      >
                        Reactivate Vendor
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
