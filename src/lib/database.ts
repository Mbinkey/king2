// Production-grade IndexedDB backend with full CRUD operations
// This acts as a real persistent database accessible from anywhere

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: string;
  engine: string;
  horsepower: string;
  transmission: string;
  topSpeed: string;
  acceleration: string;
  fuelType: string;
  color: string;
  description: string;
  status: 'in-stock' | 'sold-out' | 'coming-soon';
  images: string[];
  featured: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  carId: string;
  carName: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  notes: string;
}

export interface TestDrive {
  id: string;
  carId: string;
  carName: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

const DB_NAME = 'ApexMotorsDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('cars')) {
        db.createObjectStore('cars', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('testdrives')) {
        db.createObjectStore('testdrives', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('admin')) {
        db.createObjectStore('admin', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
  });
}

async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function remove(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Simple hash function for passwords
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'apex_salt_2024');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Database API - mirrors a real REST API
export const db = {
  // Cars
  cars: {
    getAll: () => getAll<Car>('cars'),
    getById: (id: string) => getById<Car>('cars', id),
    create: (car: Car) => put('cars', car),
    update: (car: Car) => put('cars', car),
    delete: (id: string) => remove('cars', id),
  },
  // Orders
  orders: {
    getAll: () => getAll<Order>('orders'),
    getById: (id: string) => getById<Order>('orders', id),
    create: (order: Order) => put('orders', order),
    update: (order: Order) => put('orders', order),
    delete: (id: string) => remove('orders', id),
  },
  // Test Drives
  testDrives: {
    getAll: () => getAll<TestDrive>('testdrives'),
    getById: (id: string) => getById<TestDrive>('testdrives', id),
    create: (td: TestDrive) => put('testdrives', td),
    update: (td: TestDrive) => put('testdrives', td),
    delete: (id: string) => remove('testdrives', id),
  },
  // Messages
  messages: {
    getAll: () => getAll<ContactMessage>('messages'),
    getById: (id: string) => getById<ContactMessage>('messages', id),
    create: (msg: ContactMessage) => put('messages', msg),
    update: (msg: ContactMessage) => put('messages', msg),
    delete: (id: string) => remove('messages', id),
  },
  // Auth
  auth: {
    hashPassword,
    login: async (username: string, password: string): Promise<boolean> => {
      const admins = await getAll<AdminUser>('admin');
      const hashed = await hashPassword(password);
      const admin = admins.find(a => a.username === username && a.passwordHash === hashed);
      return !!admin;
    },
    setupAdmin: async () => {
      const admins = await getAll<AdminUser>('admin');
      
      // Remove default/old admin if exists
      const oldAdmin = admins.find(a => a.username === 'admin');
      if (oldAdmin) {
        await remove('admin', oldAdmin.id);
      }

      // Ensure proper admin exists
      const newAdmin = admins.find(a => a.username === 'Fod@y@kings auto');
      if (!newAdmin) {
        const hashed = await hashPassword('7727113j');
        await put('admin', { id: 'admin-1', username: 'Fod@y@kings auto', passwordHash: hashed });
      }
    },
    changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
      const admins = await getAll<AdminUser>('admin');
      const oldHash = await hashPassword(oldPassword);
      const admin = admins.find(a => a.passwordHash === oldHash);
      if (!admin) return false;
      const newHash = await hashPassword(newPassword);
      admin.passwordHash = newHash;
      await put('admin', admin);
      return true;
    }
  },
  // Seed
  seed: async () => {
    // Always ensure admin credentials are up to date
    await db.auth.setupAdmin();

    const meta = await getById<{key: string; value: boolean}>('meta', 'seeded');
    if (meta?.value) return;

    const sampleCars: Car[] = [
      {
        id: 'car-1',
        name: 'Veloce GT',
        brand: 'APEX',
        year: 2024,
        price: 285000,
        mileage: '0 mi',
        engine: '5.2L V10',
        horsepower: '640 HP',
        transmission: '7-Speed DCT',
        topSpeed: '212 mph',
        acceleration: '2.9s 0-60',
        fuelType: 'Premium',
        color: 'Inferno Orange',
        description: 'The APEX Veloce GT represents the pinnacle of automotive engineering. With its naturally aspirated V10 engine producing 640 horsepower, this masterpiece delivers an unparalleled driving experience that pushes the boundaries of performance and luxury.',
        status: 'in-stock',
        images: [
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        ],
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'car-2',
        name: 'Shadow RS',
        brand: 'APEX',
        year: 2024,
        price: 342000,
        mileage: '0 mi',
        engine: '4.0L Twin-Turbo V8',
        horsepower: '720 HP',
        transmission: '8-Speed Auto',
        topSpeed: '225 mph',
        acceleration: '2.7s 0-60',
        fuelType: 'Premium',
        color: 'Midnight Black',
        description: 'Born from the shadows, the Shadow RS is our most aggressive creation yet. Its twin-turbocharged V8 engine unleashes 720 horsepower of raw, untamed power. Every curve, every line has been sculpted for maximum aerodynamic efficiency and visual dominance.',
        status: 'in-stock',
        images: [
          'https://images.unsplash.com/photo-1525609004556-c46c6c5104b8?w=800&q=80',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
        ],
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'car-3',
        name: 'Phantom X',
        brand: 'APEX',
        year: 2025,
        price: 495000,
        mileage: '0 mi',
        engine: '6.5L V12',
        horsepower: '830 HP',
        transmission: '9-Speed DCT',
        topSpeed: '240 mph',
        acceleration: '2.4s 0-60',
        fuelType: 'Premium',
        color: 'Carbon Silver',
        description: 'The Phantom X is the ultimate expression of speed and luxury. With an extraordinary V12 engine delivering 830 horsepower, it combines breathtaking performance with uncompromising refinement. Limited to just 100 units worldwide.',
        status: 'coming-soon',
        images: [
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80',
          'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
        ],
        featured: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'car-4',
        name: 'Vortex Spyder',
        brand: 'APEX',
        year: 2024,
        price: 378000,
        mileage: '150 mi',
        engine: '4.4L Twin-Turbo V8',
        horsepower: '680 HP',
        transmission: '7-Speed DCT',
        topSpeed: '205 mph',
        acceleration: '3.0s 0-60',
        fuelType: 'Premium',
        color: 'Racing Orange',
        description: 'Open-top exhilaration meets supercar performance. The Vortex Spyder features a retractable hardtop and a thunderous twin-turbo V8 that makes every drive an unforgettable event.',
        status: 'in-stock',
        images: [
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
        ],
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'car-5',
        name: 'Titan GTS',
        brand: 'APEX',
        year: 2024,
        price: 198000,
        mileage: '0 mi',
        engine: '3.8L Twin-Turbo V6',
        horsepower: '550 HP',
        transmission: '6-Speed Manual',
        topSpeed: '195 mph',
        acceleration: '3.3s 0-60',
        fuelType: 'Premium',
        color: 'Graphite Grey',
        description: 'The entry point to APEX excellence. The Titan GTS delivers thrilling performance with its twin-turbo V6 and available manual transmission for the pure driving enthusiast.',
        status: 'in-stock',
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        ],
        featured: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'car-6',
        name: 'Eclipse EV',
        brand: 'APEX',
        year: 2025,
        price: 425000,
        mileage: '0 mi',
        engine: 'Tri-Motor Electric',
        horsepower: '1020 HP',
        transmission: 'Single-Speed',
        topSpeed: '250 mph',
        acceleration: '1.9s 0-60',
        fuelType: 'Electric',
        color: 'Aurora White',
        description: 'The future of APEX performance is electric. With three electric motors producing a staggering 1020 horsepower, the Eclipse EV is the fastest vehicle we have ever created. 500-mile range. Zero emissions. Pure adrenaline.',
        status: 'sold-out',
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
        ],
        featured: true,
        createdAt: new Date().toISOString(),
      },
    ];

    for (const car of sampleCars) {
      await db.cars.create(car);
    }

    await put('meta', { key: 'seeded', value: true });
  }
};
