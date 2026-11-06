import React, { useState, useMemo } from 'react';
import { Package, Search, Calendar, ChevronRight, CheckCircle2, Clock, Truck, Ban, RotateCcw, FileText, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

export const OrderHistoryView: React.FC = () => {
  const { orders, currentUser, setActiveView, cancelOrder, reorderItems } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Filter orders for current user (or show all customer orders if logged in as Alex or test user)
  const userOrders = useMemo(() => {
    let list = orders;
    if (currentUser && currentUser.role === 'customer') {
      list = orders.filter(
        (o) => o.userId === currentUser.id || o.customerEmail === currentUser.email
      );
    }

    return list.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, currentUser, searchQuery, statusFilter]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/80">
            <Clock className="w-3.5 h-3.5" /> Placed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/80">
            <Ban className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
                <span>Account Management</span>
                <span aria-hidden="true">·</span>
                <span>TC07 Verification</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Order History & Invoices
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track status, review purchased hardware items, and download receipts for {currentUser?.name || 'Customer'}.
              </p>
            </div>

            <button
              onClick={() => setActiveView('store')}
              className="self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Back to Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search & Status Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID (e.g. ORD-2026) or product..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="font-semibold text-slate-400 uppercase tracking-wider mr-1 text-[11px]">
              Status:
            </span>
            {(['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders Listing */}
        <div className="mt-6 space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No matching orders found</h3>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery || statusFilter !== 'All'
                  ? 'Try clearing your search or status filter.'
                  : "You haven't placed any orders yet. Visit our catalogue to get started!"}
              </p>
              <button
                onClick={() => setActiveView('store')}
                className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            userOrders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const canCancel = order.status === 'Placed';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono">ORDER ID</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono">DATE PLACED</span>
                        <span className="font-medium text-slate-700">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-mono">TOTAL AMOUNT</span>
                        <span className="font-bold text-slate-950 font-mono text-sm tabular-nums">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(order.status)}

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-2.5 py-1 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 rounded-md font-semibold text-xs flex items-center gap-1 border border-slate-200 transition-colors cursor-pointer"
                        title="View printable invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Breakdown */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${item.productId}-${idx}`}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                              <p className="text-[11px] text-slate-500 font-mono">
                                Category: {item.category} · Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-bold text-slate-900 font-mono tabular-nums shrink-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Action Strip */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-slate-500 text-[11px] space-y-0.5">
                        <p>
                          <span className="font-semibold text-slate-700">Ship to:</span>{' '}
                          {order.shippingAddress.fullName} · {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">Payment:</span> {order.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {canCancel && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => reorderItems(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

const InvoiceModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Invoice Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">AURA</span>
              <p className="text-[11px] text-slate-500 font-mono">Precision Hardware & Living</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase">INVOICE RECEIPT</span>
              <p className="text-xs font-mono text-slate-600">{order.orderNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Billed & Shipped To:</span>
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.street}</p>
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-slate-500 font-mono mt-0.5">{order.shippingAddress.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Order Details:</span>
              <p className="text-slate-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-slate-700">Payment: {order.paymentMethod}</p>
              <p className="text-slate-700 font-semibold text-emerald-700">Status: {order.status}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="py-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="text-slate-800">
                  <td className="py-2.5 font-medium">{item.name}</td>
                  <td className="py-2.5 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums">${item.price.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-mono font-bold tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Calculations */}
        <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-mono tabular-nums font-semibold">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Promotional Discount:</span>
              <span className="font-mono tabular-nums">-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping ({order.shippingMethod}):</span>
            <span className="font-mono tabular-nums font-semibold">
              {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Estimated Sales Tax:</span>
            <span className="font-mono tabular-nums font-semibold">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-950 font-bold text-sm pt-2 border-t border-slate-200">
            <span>Total Paid:</span>
            <span className="font-mono tabular-nums">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Authorized Official Receipt</span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
