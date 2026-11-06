import { Product, User, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AURA Nova ANC Wireless Headphones',
    category: 'Audio',
    price: 249.00,
    stock: 18,
    image: '/src/assets/images/prod_wireless_headphones_1793980097462.jpg',
    description: 'Custom 40mm beryllium drivers, active hybrid noise cancellation, 42-hour battery life with USB-C fast charging, and memory foam acoustic earcups.',
    rating: 4.9,
    reviewsCount: 128,
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Horizon Chrono Titanium Smartwatch',
    category: 'Wearables',
    price: 329.00,
    stock: 12,
    image: '/src/assets/images/prod_minimal_smartwatch_1793980097374.jpg',
    description: 'Grade 5 aerospace titanium case, sapphire crystal touchscreen, heart rate & ECG tracking, GPS, 7-day battery life, and 50m water resistance.',
    rating: 4.8,
    reviewsCount: 94,
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Tactile-75 Custom Mechanical Keyboard',
    category: 'Workspace',
    price: 189.00,
    stock: 8,
    image: '/src/assets/images/prod_mechanical_keyboard_1793980098556.jpg',
    description: 'Gasket-mounted CNC aluminum chassis, pre-lubed silent tactile switches, dye-sublimated PBT keycaps, hot-swappable PCB, and rotary volume encoder.',
    rating: 4.9,
    reviewsCount: 76,
    featured: true
  },
  {
    id: 'prod-4',
    name: 'Heritage Leather Laptop Folio Sleeve',
    category: 'Accessories',
    price: 95.00,
    stock: 22,
    image: '/src/assets/images/prod_leather_sleeve_1793980097899.jpg',
    description: 'Full-grain vegetable tanned Italian leather, micro-suede protective interior, YKK antique brass zipper, fits up to 15-inch laptops and documents.',
    rating: 4.7,
    reviewsCount: 62,
    featured: false
  },
  {
    id: 'prod-5',
    name: 'Lumix Precision 4K IPS Ergonomic Monitor',
    category: 'Workspace',
    price: 549.00,
    stock: 4,
    image: '/src/assets/images/prod_studio_monitor_1793980180612.jpg',
    description: '27-inch 4K UHD 144Hz panel with 99% DCI-P3 color reproduction, 90W USB-C single cable connectivity, zero-bezel chassis, and counterbalanced arm.',
    rating: 4.9,
    reviewsCount: 45,
    featured: true
  },
  {
    id: 'prod-6',
    name: 'AeroPulse Ergonomic Wireless Mouse',
    category: 'Workspace',
    price: 79.00,
    stock: 3,
    image: '/src/assets/images/prod_ergonomic_mouse_1793980181170.jpg',
    description: 'Sculpted natural palm contour with thumb rest, dual wireless modes (2.4GHz & Bluetooth 5.2), silent optical switches, and hyper-fast metal scroll wheel.',
    rating: 4.6,
    reviewsCount: 88,
    featured: false
  },
  {
    id: 'prod-7',
    name: 'Solace Minimalist Smart Desk Lamp',
    category: 'Home & Living',
    price: 119.00,
    stock: 15,
    image: '/src/assets/images/prod_desk_lamp_1793980181494.jpg',
    description: 'Warm circadian rhythm auto-dimming LED bar with 95+ CRI, wireless fast-charging base, touch slider brightness control, and anodized matte finish.',
    rating: 4.8,
    reviewsCount: 51,
    featured: false
  },
  {
    id: 'prod-8',
    name: 'Aura Thermal Hydro Bottle 750ml',
    category: 'Accessories',
    price: 38.00,
    stock: 25,
    image: '/src/assets/images/prod_water_bottle_1793980181730.jpg',
    description: 'Double-walled vacuum insulated 18/8 food-grade stainless steel. Keeps drinks cold for 24 hours or steaming hot for 12 hours. Sweat-free powder coating.',
    rating: 4.7,
    reviewsCount: 110,
    featured: false
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-customer-1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    role: 'customer',
    phone: '+1 (555) 234-8901',
    address: {
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      phone: '+1 (555) 234-8901'
    }
  },
  {
    id: 'user-admin-1',
    name: 'Jordan Lee (Administrator)',
    email: 'admin@aura.io',
    role: 'admin',
    phone: '+1 (555) 901-4455'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-2026-8812',
    userId: 'user-customer-1',
    customerName: 'Alex Morgan',
    customerEmail: 'alex@example.com',
    items: [
      {
        productId: 'prod-1',
        name: 'AURA Nova ANC Wireless Headphones',
        price: 249.00,
        quantity: 1,
        image: '/src/assets/images/prod_wireless_headphones_1793980097462.jpg',
        category: 'Audio'
      },
      {
        productId: 'prod-4',
        name: 'Heritage Leather Laptop Folio Sleeve',
        price: 95.00,
        quantity: 1,
        image: '/src/assets/images/prod_leather_sleeve_1793980097899.jpg',
        category: 'Accessories'
      }
    ],
    subtotal: 344.00,
    tax: 27.52,
    shippingFee: 0,
    discount: 25.00,
    total: 346.52,
    status: 'Delivered',
    createdAt: '2026-10-28T14:32:00.000Z',
    shippingAddress: {
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      phone: '+1 (555) 234-8901'
    },
    shippingMethod: 'standard',
    paymentMethod: 'Credit Card (ending in •••• 4242)'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-2026-9041',
    userId: 'user-customer-1',
    customerName: 'Alex Morgan',
    customerEmail: 'alex@example.com',
    items: [
      {
        productId: 'prod-3',
        name: 'Tactile-75 Custom Mechanical Keyboard',
        price: 189.00,
        quantity: 1,
        image: '/src/assets/images/prod_mechanical_keyboard_1793980098556.jpg',
        category: 'Workspace'
      }
    ],
    subtotal: 189.00,
    tax: 15.12,
    shippingFee: 15.00,
    discount: 0,
    total: 219.12,
    status: 'Processing',
    createdAt: '2026-11-04T09:15:00.000Z',
    shippingAddress: {
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Portland',
      state: 'Oregon',
      zipCode: '97201',
      phone: '+1 (555) 234-8901'
    },
    shippingMethod: 'express',
    paymentMethod: 'Credit Card (ending in •••• 4242)'
  }
];
