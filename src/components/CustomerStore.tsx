import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Plus, Star, Check, AlertCircle, Eye, ArrowUpDown, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const CustomerStore: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    addToCart,
    setSelectedProductModal,
    cart,
  } = useApp();

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
    return cats;
  }, [products]);

  // Real-time filtered and sorted catalogue (TC02)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search matching (case-insensitive on name or category or description)
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category matching
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      // In-stock filtering
      const matchesStock = !inStockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first, then stock
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, inStockOnly, sortBy]);

  // Calculate items in cart map for quantity badge
  const cartItemCounts = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((i) => map.set(i.product.id, i.quantity));
    return map;
  }, [cart]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Editorial Storefront Hero (§2.A of E-commerce Reference) */}
      <section className="bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-radial from-slate-800/60 to-slate-950 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono flex items-center gap-2">
                <span>Precision Hardware & Workspace Collection</span>
                <span aria-hidden="true">·</span>
                <span>Autumn 2026 Edition</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans text-balance">
                Architectural tools designed for uncompromising focus.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Experience tactile mechanical keyboards, active acoustic isolation, and machined titanium wearables. Tested for longevity and engineered for peak daily performance.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalogue"
                  className="px-5 py-2.5 bg-white text-slate-900 font-semibold text-xs tracking-wide rounded-lg hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>Explore Full Catalogue</span>
                  <span className="font-mono text-slate-500">({products.length} items)</span>
                </a>
                <span className="text-xs text-slate-400 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Free carbon-neutral shipping on orders over $150
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-800/40 shadow-2xl group aspect-4/3">
                <img
                  src="/src/assets/images/prod_wireless_headphones_1793980097462.jpg"
                  alt="AURA Nova ANC Wireless Headphones Hero Showcase"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-left">
                    <p className="text-xs text-slate-300 font-mono">Spotlight Feature</p>
                    <p className="text-base font-bold text-white">AURA Nova ANC Headphones</p>
                    <p className="text-xs text-slate-300 font-mono tabular-nums">$249.00 USD · 42h Battery Life</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalogue Filter & Search Bar Toolbar */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/90 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Real-time Search Input (TC02) */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, specs, or category..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/80 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Sort & In Stock Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer select-none hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Interactive Category Filter Tabs (Zero-Pill: functional buttons with segmented active states) */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat} <span className="opacity-70 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Results Counter & Search Indicator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-200/80">
          <div>
            Showing <span className="font-semibold text-slate-900 tabular-nums">{filteredProducts.length}</span> of{' '}
            <span className="tabular-nums">{products.length}</span> items
            {searchQuery && (
              <span className="ml-2 text-slate-600">
                matching "<span className="font-medium text-slate-900">{searchQuery}</span>"
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="ml-2 text-slate-600">
                in <span className="font-medium text-slate-900">{selectedCategory}</span>
              </span>
            )}
          </div>
          {(searchQuery || selectedCategory !== 'All' || inStockOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setInStockOnly(false);
              }}
              className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </section>

      {/* Product Catalogue Grid (TC02 & TC03) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No matching products found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or removing the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inCartQty = cartItemCounts.get(product.id) || 0;
              const isLowStock = product.stock > 0 && product.stock <= 4;
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCardId(product.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top Image Canvas Container */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setSelectedProductModal(product)}
                    />

                    {/* Stock Status Visual Indicator */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                      {isOutOfStock ? (
                        <span className="bg-rose-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                          Low Stock: {product.stock} left
                        </span>
                      ) : null}
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setSelectedProductModal(product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-lg shadow-sm backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Quick Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Product Details Section */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quiet Unboxed Metadata (Zero-Pill Rule §1.A) */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="uppercase tracking-wider text-[11px]">{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating.toFixed(1)}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400 font-mono text-[11px]">({product.reviewsCount})</span>
                      </div>

                      {/* Product Name */}
                      <h3
                        onClick={() => setSelectedProductModal(product)}
                        className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-slate-700 transition-colors cursor-pointer line-clamp-1"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Snippet Description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing, Stock & Add to Cart Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {isOutOfStock ? (
                            <span className="text-rose-600 font-medium">Sold Out</span>
                          ) : (
                            <span>{product.stock} in stock</span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button (TC03) */}
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={isOutOfStock}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-xs'
                        }`}
                        title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                        {inCartQty > 0 && (
                          <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-white text-[10px] rounded-full font-mono">
                            {inCartQty}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal />
    </div>
  );
};

const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart, cart } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);

  if (!selectedProductModal) return null;

  const currentCartQty =
    cart.find((i) => i.product.id === selectedProductModal.id)?.quantity || 0;
  const availableToBuy = Math.max(0, selectedProductModal.stock - currentCartQty);

  const handleAddToCart = () => {
    if (selectedQty <= 0 || availableToBuy <= 0) return;
    addToCart(selectedProductModal, selectedQty);
    setSelectedProductModal(null);
    setSelectedQty(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedProductModal(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white flex items-center justify-center cursor-pointer shadow-xs"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image Canvas */}
          <div className="relative aspect-4/3 md:aspect-auto md:h-full bg-slate-100">
            <img
              src={selectedProductModal.image}
              alt={selectedProductModal.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Purchase Module */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="uppercase tracking-wider font-semibold">{selectedProductModal.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedProductModal.rating.toFixed(1)}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedProductModal.reviewsCount} verified reviews</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedProductModal.name}
              </h2>

              <div className="text-2xl font-bold text-slate-950 font-mono tabular-nums">
                ${selectedProductModal.price.toFixed(2)}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                {selectedProductModal.description}
              </p>

              <div className="pt-2 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Inventory Status:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedProductModal.stock > 0
                      ? `${selectedProductModal.stock} units available`
                      : 'Out of Stock'}
                  </span>
                </div>
                {currentCartQty > 0 && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Already in your cart:</span>
                    <span className="font-mono font-medium">{currentCartQty} units</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {selectedProductModal.stock > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Select Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                        disabled={selectedQty <= 1}
                        className="px-3 py-1 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold font-mono text-slate-900 min-w-[32px] text-center">
                        {selectedQty}
                      </span>
                      <button
                        onClick={() => setSelectedQty((prev) => Math.min(availableToBuy, prev + 1))}
                        disabled={selectedQty >= availableToBuy}
                        className="px-3 py-1 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={availableToBuy <= 0}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      Add to Cart · ${(selectedProductModal.price * selectedQty).toFixed(2)}
                    </span>
                  </button>
                </>
              ) : (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg text-center">
                  This item is currently sold out. Check back soon!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
