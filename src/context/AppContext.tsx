import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Order, OrderStatus, ShippingAddress, Toast, UserRole } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from '../data/initialData';

interface AppContextType {
  // Products & Catalogue
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Active view & navigation
  activeView: 'store' | 'orders' | 'admin';
  setActiveView: (view: 'store' | 'orders' | 'admin') => void;
  selectedProductModal: Product | null;
  setSelectedProductModal: (prod: Product | null) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  placeOrder: (
    shippingAddress: ShippingAddress,
    shippingMethod: 'standard' | 'express',
    paymentMethod: string
  ) => Order | null;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Auth & Roles
  currentUser: User | null;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  quickLogin: (role: UserRole) => void;
  logout: () => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  reorderItems: (order: Order) => void;

  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  resetToDemoData: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], title?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'aura_store_products_v1',
  CART: 'aura_store_cart_v1',
  ORDERS: 'aura_store_orders_v1',
  USER: 'aura_store_user_v1',
  ROLE: 'aura_store_role_v1',
  USERS_LIST: 'aura_store_registered_users_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Start logged in as Alex Morgan for easy evaluation
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved as UserRole) || 'customer';
    } catch {
      return 'customer';
    }
  });

  // UI States
  const [activeView, setActiveView] = useState<'store' | 'orders' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, activeRole);
  }, [activeRole]);

  // Toast helpers
  const addToast = (message: string, type: Toast['type'] = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: Toast = { id, message, type, title };
    setToasts((prev) => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role switching
  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    if (role === 'admin') {
      setActiveView('admin');
      // If current user is not admin, switch to admin demo account
      if (currentUser?.role !== 'admin') {
        const adminUser = registeredUsers.find((u) => u.role === 'admin') || INITIAL_USERS[1];
        setCurrentUser(adminUser);
      }
      addToast('Switched to Admin Dashboard', 'info', 'Role Switcher');
    } else {
      setActiveView('store');
      // If current user is admin, switch back to customer
      if (currentUser?.role === 'admin') {
        const custUser = registeredUsers.find((u) => u.role === 'customer') || INITIAL_USERS[0];
        setCurrentUser(custUser);
      }
      addToast('Switched to Customer Storefront', 'info', 'Role Switcher');
    }
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1): boolean => {
    // Check available stock
    const currentStock = product.stock;
    if (currentStock <= 0) {
      addToast(`${product.name} is out of stock`, 'warning');
      return false;
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const existingQuantity = existingIndex > -1 ? cart[existingIndex].quantity : 0;

    if (existingQuantity + quantity > currentStock) {
      addToast(`Only ${currentStock} units available in stock`, 'warning');
      return false;
    }

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      setCart((prev) => [...prev, { product, quantity }]);
    }

    addToast(`Added "${product.name}" to cart`, 'success');
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      addToast(`Maximum available stock reached (${product.stock})`, 'warning');
      quantity = product.stock;
    }

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      addToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA10') {
      const discountVal = 10; // 10%
      setCouponCode('AURA10');
      setCouponDiscount(discountVal);
      addToast('Coupon AURA10 applied! 10% off', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'WELCOME20') {
      const discountVal = 20; // 20%
      setCouponCode('WELCOME20');
      setCouponDiscount(discountVal);
      addToast('Coupon WELCOME20 applied! 20% off', 'success');
      return { success: true, message: '20% discount applied!' };
    } else {
      addToast('Invalid coupon code. Try AURA10 or WELCOME20', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    addToast('Coupon removed', 'info');
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDiscount = couponDiscount > 0 ? (cartSubtotal * couponDiscount) / 100 : 0;
  const cartShipping = cartSubtotal > 150 || cart.length === 0 ? 0 : 12.00;
  const cartTax = (cartSubtotal - cartDiscount) * 0.08;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout & Order Placement (TC06)
  const placeOrder = (
    shippingAddress: ShippingAddress,
    shippingMethod: 'standard' | 'express',
    paymentMethod: string
  ): Order | null => {
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return null;
    }

    // Verify stock for all items
    for (const item of cart) {
      const p = products.find((prod) => prod.id === item.product.id);
      if (!p || p.stock < item.quantity) {
        addToast(`Insufficient stock for "${item.product.name}"`, 'error');
        return null;
      }
    }

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const shippingCost = shippingMethod === 'express' ? 18.00 : cartShipping;
    const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost + cartTax);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id || 'guest',
      customerName: shippingAddress.fullName || currentUser?.name || 'Customer',
      customerEmail: currentUser?.email || 'guest@example.com',
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
        category: i.product.category,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      shippingFee: shippingCost,
      discount: cartDiscount,
      total: finalTotal,
      status: 'Placed',
      createdAt: new Date().toISOString(),
      shippingAddress,
      shippingMethod,
      paymentMethod,
    };

    // Deduct stock in products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((i) => i.product.id === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity),
          };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Save user address if logged in
    if (currentUser) {
      const updatedUser = { ...currentUser, address: shippingAddress };
      setCurrentUser(updatedUser);
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
      );
    }

    // Clear cart
    clearCart();
    setLastPlacedOrder(newOrder);

    addToast(`Order ${orderNumber} placed successfully!`, 'success', 'Order Confirmed');
    return newOrder;
  };

  // Order status management
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order #${orderId} status changed to ${status}`, 'info');
  };

  const cancelOrder = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.status !== 'Placed') {
      addToast('Only orders with "Placed" status can be cancelled', 'warning');
      return;
    }

    // Restore stock
    setProducts((prev) =>
      prev.map((prod) => {
        const item = targetOrder.items.find((i) => i.productId === prod.id);
        if (item) {
          return { ...prod, stock: prod.stock + item.quantity };
        }
        return prod;
      })
    );

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus } : o))
    );
    addToast(`Order ${targetOrder.orderNumber} cancelled. Items restored to stock.`, 'info');
  };

  const reorderItems = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item) => {
      const currentProd = products.find((p) => p.id === item.productId);
      if (currentProd && currentProd.stock >= item.quantity) {
        addToCart(currentProd, item.quantity);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setIsCartOpen(true);
      addToast(`Re-added ${addedCount} item(s) from ${order.orderNumber} to cart`, 'success');
    } else {
      addToast('Items from this order are currently out of stock', 'warning');
    }
  };

  // Auth actions
  const login = (email: string, _pass: string): boolean => {
    const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setActiveRole(user.role);
      setIsAuthModalOpen(false);
      addToast(`Welcome back, ${user.name}!`, 'success');
      return true;
    } else {
      addToast('No account found with this email. Please register or quick-login.', 'error');
      return false;
    }
  };

  const register = (name: string, email: string, _pass: string): boolean => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      addToast('An account with this email already exists', 'error');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      address: {
        fullName: name,
        street: '123 Market Street',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94105',
        phone: '+1 (555) 302-8822',
      },
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setActiveRole('customer');
    setIsAuthModalOpen(false);
    addToast(`Account created! Welcome to AURA, ${name}!`, 'success');
    return true;
  };

  const quickLogin = (role: UserRole) => {
    const target = registeredUsers.find((u) => u.role === role) || (role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0]);
    setCurrentUser(target);
    setActiveRole(role);
    setIsAuthModalOpen(false);
    addToast(`Logged in as ${target.name} (${role})`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveRole('customer');
    setActiveView('store');
    addToast('Logged out successfully', 'info');
  };

  // Admin Product Actions
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Added new product "${newProduct.name}"`, 'success');
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    addToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    addToast(`Deleted product "${prod?.name || id}"`, 'info');
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setRegisteredUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setActiveRole('customer');
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
    localStorage.clear();
    addToast('Store reset to initial demo data & products', 'info', 'Demo Reset');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        activeView,
        setActiveView,
        selectedProductModal,
        setSelectedProductModal,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartShipping,
        cartTax,
        cartTotal,
        cartCount,
        isCheckoutOpen,
        setIsCheckoutOpen,
        placeOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        currentUser,
        activeRole,
        setActiveRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        quickLogin,
        logout,
        orders,
        updateOrderStatus,
        cancelOrder,
        reorderItems,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        resetToDemoData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
