import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import StatusChip from '@/components/StatusChip';
import { useToast } from '@/contexts/ToastContext';

export default function VendorOrders() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { orders, loading, error, updateOrderStatus } = useOrders(undefined, user?.id);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus as any);
    if (result.error) {
      addToast(result.error, 'error');
      return;
    }
    addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar role="vendor" />

      <main className="lg:ml-[240px] p-6 pt-20 lg:p-8 lg:pt-8">
        <h1 className="text-[22px] font-bold text-[#111318] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
          Orders
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8321C] mx-auto mb-4"></div>
              <p className="text-[#6B7280]">Loading orders...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E4E6ED] p-12 text-center">
            <div className="text-[#B0B7C3] mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#111318] mb-2">No orders yet</h3>
            <p className="text-[#6B7280] text-sm">Orders from customers will appear here.</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#F0F1F5] text-xs font-mono font-bold text-[#6B7280]">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-3">Product(s)</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Update</div>
          </div>

          {orders.map(order => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id}>
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E4E6ED] items-center hover:bg-[#F7F8FA] transition-colors">
                  <div className="col-span-2 text-sm font-mono text-[#E8321C]">#{order.id}</div>
                  <div className="col-span-2 text-sm text-[#111318]">{order.customerName}</div>
                  <div className="col-span-3 text-sm text-[#6B7280] truncate">
                    {order.items.map(i => i.product.name).join(', ')}
                  </div>
                  <div className="col-span-2 text-sm font-mono font-bold">৳{order.total}</div>
                  <div className="col-span-1">
                    <StatusChip status={order.status} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="w-full text-sm border border-[#E4E6ED] rounded-lg px-3 py-2 focus:outline-none focus:border-[#E8321C] focus:ring-1 focus:ring-[#E8321C] bg-white appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#6B7280]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="p-2 text-[#6B7280] hover:text-[#E8321C] hover:bg-[#F7F8FA] rounded-lg transition-colors"
                      title={isExpanded ? 'Hide details' : 'View details'}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details for Desktop */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-[#F7F8FA] border-b border-[#E4E6ED]">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="col-span-2">
                        <h4 className="text-xs font-bold text-[#6B7280] mb-3">ORDER ITEMS</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#111318]">{item.product.name}</p>
                                <p className="text-xs text-[#6B7280]">
                                  {item.product.brand} • Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-mono font-bold text-[#E8321C]">
                                  ৳{item.product.price} × {item.quantity}
                                </p>
                                <p className="text-xs text-[#6B7280]">
                                  Subtotal: ৳{item.product.price * item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Order Info */}
                      <div className="space-y-4">
                        {/* Delivery Information */}
                        {order.deliveryAddress && (
                          <div>
                            <h4 className="text-xs font-bold text-[#6B7280] mb-2">DELIVERY INFO</h4>
                            <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                              <p className="text-[#111318]">{order.deliveryAddress}</p>
                              {order.deliveryPhone && (
                                <p className="text-[#6B7280]">Phone: {order.deliveryPhone}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Date */}
                        <div>
                          <h4 className="text-xs font-bold text-[#6B7280] mb-2">ORDER DATE</h4>
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-sm text-[#111318]">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Order Total */}
                        <div>
                          <h4 className="text-xs font-bold text-[#6B7280] mb-2">ORDER TOTAL</h4>
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-lg font-mono font-bold text-[#E8321C]">৳{order.total}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-3">
          {orders.map(order => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-[#E4E6ED] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-mono font-bold text-[#E8321C]">#{order.id}</span>
                    <StatusChip status={order.status} />
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Customer:</span>
                      <span className="text-[#111318]">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Products:</span>
                      <span className="text-[#111318] text-right truncate w-32">
                        {order.items.map(i => i.product.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Total:</span>
                      <span className="font-mono font-bold text-[#E8321C]">৳{order.total}</span>
                    </div>
                  </div>
                  <div className="relative mb-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="w-full text-sm border border-[#E4E6ED] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E8321C] focus:ring-1 focus:ring-[#E8321C] bg-white appearance-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6B7280]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-[#6B7280] hover:text-[#E8321C] transition-colors py-2 border-t border-[#E4E6ED]"
                  >
                    {isExpanded ? (
                      <>
                        <span>Hide Details</span>
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        <span>View Details</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#E4E6ED] bg-[#F7F8FA] p-4 space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-xs font-bold text-[#6B7280] mb-2">ORDER ITEMS</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#111318]">{item.product.name}</p>
                              <p className="text-xs text-[#6B7280]">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono font-bold text-[#E8321C]">
                                ৳{item.product.price}
                              </p>
                              <p className="text-xs text-[#6B7280]">
                                Total: ৳{item.product.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Information */}
                    {order.deliveryAddress && (
                      <div>
                        <h4 className="text-xs font-bold text-[#6B7280] mb-2">DELIVERY INFO</h4>
                        <div className="bg-white rounded-lg p-3 space-y-1 text-sm">
                          <p className="text-[#111318]">{order.deliveryAddress}</p>
                          {order.deliveryPhone && (
                            <p className="text-[#6B7280]">Phone: {order.deliveryPhone}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Order Date */}
                    <div>
                      <h4 className="text-xs font-bold text-[#6B7280] mb-2">ORDER DATE</h4>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-[#111318]">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>
        )}
      </main>
    </div>
  );
}
