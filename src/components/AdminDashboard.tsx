import React, { useState, useMemo } from 'react';
import {
  Shield,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Eye,
  Store,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    updateOrderStatus,
    resetToDemoData,
    setActiveView,
    setActiveRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'settings'>('inventory');
  const [productSearch, setProductSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Derive Overview Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 4).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStockUnits,
    };
  }, [orders, products]);

  // Filtered Products for Inventory table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 4;
      if (stockFilter === 'out') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, productSearch, categoryFilter, stockFilter]);

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Operations Console</span>
                <span aria-hidden="true">·</span>
                <span>Role: Administrator</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                Store Inventory & Order Management
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time catalogue control, stock adjustments, order fulfillment tracking, and system health.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveRole('customer');
                  setActiveView('store');
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>Switch to Customer View</span>
              </button>

              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Overview Metrics Strip (Zero-Pill Discipline) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
                ${metrics.totalRevenue.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                From {metrics.totalOrders} total recorded orders
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Orders Placed</span>
                <ShoppingCart className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
                {metrics.totalOrders}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Active customer order history
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Catalogue Items</span>
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
                {metrics.totalProducts}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {metrics.totalStockUnits} total units in stock
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Low / Out-of-Stock</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-2">
                {metrics.lowStockCount + metrics.outOfStockCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {metrics.lowStockCount} low stock · {metrics.outOfStockCount} sold out
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Section with Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-px">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Demo Data & Testing</span>
          </button>
        </div>

        {/* Tab 1: Product Inventory Management */}
        {activeTab === 'inventory' && (
          <div className="mt-6 space-y-4">
            {/* Table Search & Filter Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter inventory by name or category..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category select */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="font-semibold text-slate-500 text-[11px] uppercase">Category:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock status filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setStockFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      stockFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setStockFilter('low')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      stockFilter === 'low' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Low Stock ({metrics.lowStockCount})
                  </button>
                  <button
                    onClick={() => setStockFilter('out')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      stockFilter === 'out' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Out of Stock ({metrics.outOfStockCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-center">Stock Level</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-400">
                          No products match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const isLow = product.stock > 0 && product.stock <= 4;
                        const isOut = product.stock === 0;

                        return (
                          <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                            {/* Product Info */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                                />
                                <div className="max-w-xs">
                                  <p className="font-bold text-slate-900 truncate" title={product.name}>
                                    {product.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate" title={product.description}>
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 font-medium text-slate-600">
                              {product.category}
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                              ${product.price.toFixed(2)}
                            </td>

                            {/* Stock Level with Stepper */}
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <button
                                  onClick={() => adjustStock(product.id, -1)}
                                  disabled={product.stock <= 0}
                                  className="px-2 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-30 cursor-pointer font-bold"
                                  title="Decrease stock"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-1 font-mono font-bold text-slate-900 min-w-[32px] text-center">
                                  {product.stock}
                                </span>
                                <button
                                  onClick={() => adjustStock(product.id, 1)}
                                  className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
                                  title="Increase stock"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 text-center">
                              {isOut ? (
                                <span className="inline-flex text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="inline-flex text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Low ({product.stock})
                                </span>
                              ) : (
                                <span className="inline-flex text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  In Stock
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                  title="Edit Product Details"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingProductId(product.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Orders Management */}
        {activeTab === 'orders' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">All Customer Orders ({orders.length})</h3>
                  <p className="text-[11px] text-slate-500">
                    Update fulfillment status, inspect line items, and audit customer transactions.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4">Change Status</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-900">{order.orderNumber}</p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-900">{order.customerName}</p>
                          <p className="text-[11px] text-slate-500">{order.customerEmail}</p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="text-slate-800 font-medium">
                            {order.items.length} item(s)
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          ${order.total.toFixed(2)}
                        </td>

                        <td className="py-3 px-4">
                          {/* Live Status Selector for Admin */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-semibold px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
                            title="Inspect Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Demo & Testing Settings */}
        {activeTab === 'settings' && (
          <div className="mt-6 max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Testing & Reset Utilities</h3>
              <p className="text-xs text-slate-500 mt-1">
                Helpful controls to verify test cases (TC01 to TC07) or restore the initial catalog.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Reset to Initial Demo State</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Resets the 8 pre-populated products, default stock counts, and sample customer order history.
                  </p>
                </div>
                <button
                  onClick={resetToDemoData}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Reset All Data
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Test Case Coverage Quick Reference:</h4>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li><span className="font-semibold text-slate-800">TC01:</span> User registration, login, and localStorage session retention.</li>
                <li><span className="font-semibold text-slate-800">TC02:</span> Visual product catalogue with instant real-time search and category filtering.</li>
                <li><span className="font-semibold text-slate-800">TC03:</span> Add to Cart with real-time notifications and badge counter.</li>
                <li><span className="font-semibold text-slate-800">TC04:</span> Quantity increment / decrement stepper directly inside shopping cart.</li>
                <li><span className="font-semibold text-slate-800">TC05:</span> Item removal and cart emptying with dynamic tax & shipping updates.</li>
                <li><span className="font-semibold text-slate-800">TC06:</span> Multi-step checkout with address, payment simulation, and order ID generation.</li>
                <li><span className="font-semibold text-slate-800">TC07:</span> Order History section with receipt invoice and fulfillment status tracking.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <ProductFormModal
          title="Add New Product to Store"
          onClose={() => setIsAddProductModalOpen(false)}
          onSubmit={(data) => {
            addProduct(data);
            setIsAddProductModalOpen(false);
          }}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductFormModal
          title={`Edit Product: ${editingProduct.name}`}
          initialData={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={(data) => {
            updateProduct(editingProduct.id, data);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Delete Product?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to remove this item from the active store? This action will remove it from all catalogues.
            </p>
            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deletingProductId);
                  setDeletingProductId(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setInspectingOrder(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              Order Details: {inspectingOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(inspectingOrder.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Customer:</span>
                <p className="font-bold text-slate-900">{inspectingOrder.customerName}</p>
                <p className="text-slate-500">{inspectingOrder.customerEmail}</p>
                <p className="text-slate-600 mt-1">
                  {inspectingOrder.shippingAddress.street}, {inspectingOrder.shippingAddress.city},{' '}
                  {inspectingOrder.shippingAddress.state} {inspectingOrder.shippingAddress.zipCode}
                </p>
                <p className="text-slate-500 font-mono">{inspectingOrder.shippingAddress.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Purchased Items:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {inspectingOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-mono font-bold">${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono">${inspectingOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Add / Edit Product Form Modal
const ProductFormModal: React.FC<{
  title: string;
  initialData?: Product;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
}> = ({ title, initialData, onClose, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Audio');
  const [price, setPrice] = useState(initialData?.price.toString() || '99.00');
  const [stock, setStock] = useState(initialData?.stock.toString() || '15');
  const [image, setImage] = useState(
    initialData?.image || '/src/assets/images/prod_wireless_headphones_1793980097462.jpg'
  );
  const [description, setDescription] = useState(
    initialData?.description || 'Engineered with premium materials for maximum durability and performance.'
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid positive price');
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      setError('Please enter a valid stock count (0 or higher)');
      return;
    }

    onSubmit({
      name: name.trim(),
      category: category.trim(),
      price: numPrice,
      stock: numStock,
      image: image.trim(),
      description: description.trim(),
      featured,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in product details for the store inventory.
        </p>

        {error && (
          <div className="p-2.5 mt-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Studio Headphones"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="Audio">Audio</option>
                <option value="Wearables">Wearables</option>
                <option value="Workspace">Workspace</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Featured Item</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-slate-900"
                />
                <span className="text-slate-700">Display prominently</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Image URL / Path</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/src/assets/images/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
