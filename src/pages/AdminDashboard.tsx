import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Car, ShoppingCart, Calendar, MessageSquare, Plus, LogOut, Edit, Trash2, Eye, Check, X, Package, Clock, Upload } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { db, type Car as CarType, type Order, type TestDrive, type ContactMessage } from '../lib/database';
import { v4 as uuid } from 'uuid';

type Tab = 'overview' | 'inventory' | 'orders' | 'testdrives' | 'messages';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [cars, setCars] = useState<CarType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [_mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    const [c, o, t, m] = await Promise.all([
      db.cars.getAll(),
      db.orders.getAll(),
      db.testDrives.getAll(),
      db.messages.getAll(),
    ]);
    setCars(c);
    setOrders(o);
    setTestDrives(t);
    setMessages(m);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate, loadData]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Car form state
  type CarFormType = {
    name: string; brand: string; year: number; price: number; mileage: string;
    engine: string; horsepower: string; transmission: string; topSpeed: string; acceleration: string;
    fuelType: string; color: string; description: string; status: CarType['status'];
    images: string[]; featured: boolean;
  };
  const emptyCarForm: CarFormType = {
    name: '', brand: 'APEX', year: 2024, price: 0, mileage: '0 mi',
    engine: '', horsepower: '', transmission: '', topSpeed: '', acceleration: '',
    fuelType: 'Premium', color: '', description: '', status: 'in-stock',
    images: [''], featured: false,
  };
  const [carForm, setCarForm] = useState<CarFormType>(emptyCarForm);

  const openAddCar = () => {
    setEditingCar(null);
    setCarForm(emptyCarForm);
    setShowCarForm(true);
  };

  const openEditCar = (car: CarType) => {
    setEditingCar(car);
    setCarForm({
      name: car.name, brand: car.brand, year: car.year, price: car.price,
      mileage: car.mileage, engine: car.engine, horsepower: car.horsepower,
      transmission: car.transmission, topSpeed: car.topSpeed, acceleration: car.acceleration,
      fuelType: car.fuelType, color: car.color, description: car.description,
      status: car.status, images: [...car.images], featured: car.featured,
    });
    setShowCarForm(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const carData: CarType = {
      id: editingCar ? editingCar.id : uuid(),
      ...carForm,
      images: carForm.images.filter(i => i.trim() !== ''),
      createdAt: editingCar ? editingCar.createdAt : new Date().toISOString(),
    };
    if (carData.images.length === 0) {
      carData.images = ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'];
    }
    await db.cars.create(carData);
    setShowCarForm(false);
    loadData();
  };

  const handleDeleteCar = async (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      await db.cars.delete(id);
      loadData();
    }
  };

  const handleOrderStatus = async (order: Order, status: Order['status']) => {
    await db.orders.update({ ...order, status });
    loadData();
  };

  const handleTestDriveStatus = async (td: TestDrive, status: TestDrive['status']) => {
    await db.testDrives.update({ ...td, status });
    loadData();
  };

  const handleMarkRead = async (msg: ContactMessage) => {
    await db.messages.update({ ...msg, read: true });
    loadData();
  };

  const handleDeleteMessage = async (id: string) => {
    await db.messages.delete(id);
    loadData();
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Delete this order?')) {
      await db.orders.delete(id);
      loadData();
    }
  };

  const handleDeleteTestDrive = async (id: string) => {
    if (confirm('Delete this test drive request?')) {
      await db.testDrives.delete(id);
      loadData();
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Car; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'inventory', label: 'Inventory', icon: Car, count: cars.length },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, count: orders.filter(o => o.status === 'pending').length },
    { id: 'testdrives', label: 'Test Drives', icon: Calendar, count: testDrives.filter(t => t.status === 'pending').length },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => !m.read).length },
  ];

  const inputClasses = "w-full bg-apex-black border border-apex-gray/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-apex-white-dim/50";

  return (
    <div className="min-h-screen bg-apex-black">
      {/* Top Bar */}
      <header className="bg-apex-black-light border-b border-apex-gray/30 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-sm font-bold tracking-wider">
              <span className="text-apex-orange">KING</span> ADMIN
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-apex-white-dim text-xs hover:text-apex-orange transition-colors hidden sm:block">
              View Site →
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-apex-white-dim hover:text-red-400 transition-colors text-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-60 bg-apex-black-light border-r border-apex-gray/30 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-apex-orange/10 text-apex-orange border border-apex-orange/30'
                    : 'text-apex-white-dim hover:bg-apex-gray/20 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-apex-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-apex-black-light border-t border-apex-gray/30">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-colors relative ${
                  activeTab === tab.id ? 'text-apex-orange' : 'text-apex-white-dim'
                }`}
              >
                <tab.icon className="w-5 h-5 mb-1" />
                <span className="truncate">{tab.label.length > 6 ? tab.label.slice(0, 6) + '.' : tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute top-1 right-1/4 bg-apex-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 min-h-[calc(100vh-4rem)]">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h2 className="font-display text-2xl font-bold text-white">Dashboard Overview</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Vehicles', value: cars.length, icon: Car, color: 'text-blue-400 bg-blue-500/10' },
                  { label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, icon: Package, color: 'text-apex-orange bg-apex-orange/10' },
                  { label: 'Test Drive Requests', value: testDrives.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-yellow-400 bg-yellow-500/10' },
                  { label: 'Unread Messages', value: messages.filter(m => !m.read).length, icon: MessageSquare, color: 'text-green-400 bg-green-500/10' },
                ].map(stat => (
                  <div key={stat.label} className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-5">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-apex-white-dim text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue */}
              <div className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Revenue Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-apex-white-dim text-xs uppercase tracking-wider">Total Revenue (Confirmed)</p>
                    <p className="font-display text-2xl font-bold text-gradient mt-1">
                      ${orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-apex-white-dim text-xs uppercase tracking-wider">Pending Revenue</p>
                    <p className="font-display text-2xl font-bold text-yellow-400 mt-1">
                      ${orders.filter(o => o.status === 'pending').reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-apex-white-dim text-xs uppercase tracking-wider">In Stock</p>
                    <p className="font-display text-2xl font-bold text-green-400 mt-1">
                      {cars.filter(c => c.status === 'in-stock').length} vehicles
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-apex-white-dim text-sm">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(-5).reverse().map(order => (
                      <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-apex-black rounded-lg border border-apex-gray/20">
                        <div>
                          <p className="text-white font-semibold text-sm">{order.customerName}</p>
                          <p className="text-apex-white-dim text-xs">{order.carName} · ${order.totalPrice.toLocaleString()}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto ${
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inventory Management */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-display text-2xl font-bold text-white">Inventory Management</h2>
                <button onClick={openAddCar} className="btn-premium bg-gradient-premium text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-2 self-start">
                  <Plus className="w-4 h-4" /> Add Vehicle
                </button>
              </div>

              {cars.length === 0 ? (
                <div className="text-center py-20 bg-apex-black-light rounded-xl border border-apex-gray/30">
                  <Car className="w-12 h-12 text-apex-white-dim mx-auto mb-4" />
                  <p className="text-apex-white-dim">No vehicles in inventory.</p>
                  <button onClick={openAddCar} className="mt-4 text-apex-orange font-semibold text-sm hover:underline">Add your first vehicle</button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cars.map(car => (
                    <div key={car.id} className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-4 flex flex-col sm:flex-row gap-4">
                      <img src={car.images[0]} alt={car.name} className="w-full sm:w-32 h-24 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-white font-bold">{car.brand} {car.name}</h3>
                            <p className="text-apex-white-dim text-sm">{car.year} · {car.engine} · {car.horsepower}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                            car.status === 'in-stock' ? 'bg-green-500/20 text-green-400' :
                            car.status === 'sold-out' ? 'bg-red-500/20 text-red-400' :
                            'bg-apex-orange/20 text-apex-orange'
                          }`}>
                            {car.status === 'in-stock' ? 'In Stock' : car.status === 'sold-out' ? 'Sold' : 'Coming Soon'}
                          </span>
                        </div>
                        <p className="text-gradient font-display font-bold text-lg mt-1">${car.price.toLocaleString()}</p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => openEditCar(car)} className="text-xs bg-apex-gray/30 text-apex-white-dim px-3 py-1.5 rounded-lg hover:bg-apex-orange/20 hover:text-apex-orange transition-colors flex items-center gap-1">
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button onClick={() => handleDeleteCar(car.id)} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">Orders Management</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-20 bg-apex-black-light rounded-xl border border-apex-gray/30">
                  <ShoppingCart className="w-12 h-12 text-apex-white-dim mx-auto mb-4" />
                  <p className="text-apex-white-dim">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...orders].reverse().map(order => (
                    <div key={order.id} className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-3 flex-wrap">
                            <h3 className="text-white font-bold text-lg">{order.customerName}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-apex-orange font-semibold">{order.carName}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-apex-white-dim">
                            <p>📧 {order.email}</p>
                            <p>📱 {order.phone}</p>
                            <p>🌍 {order.country}</p>
                            <p>💰 ${order.totalPrice.toLocaleString()}</p>
                          </div>
                          <p className="text-sm text-apex-white-dim">📍 {order.address}</p>
                          {order.notes && <p className="text-sm text-apex-white-dim">📝 {order.notes}</p>}
                          <p className="text-xs text-apex-white-dim/50">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {order.status !== 'confirmed' && (
                            <button onClick={() => handleOrderStatus(order, 'confirmed')} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/20">Confirm</button>
                          )}
                          {order.status !== 'delivered' && (
                            <button onClick={() => handleOrderStatus(order, 'delivered')} className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20">Delivered</button>
                          )}
                          {order.status !== 'cancelled' && (
                            <button onClick={() => handleOrderStatus(order, 'cancelled')} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20">Cancel</button>
                          )}
                          <button onClick={() => handleDeleteOrder(order.id)} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Test Drives */}
          {activeTab === 'testdrives' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">Test Drive Requests</h2>
              
              {testDrives.length === 0 ? (
                <div className="text-center py-20 bg-apex-black-light rounded-xl border border-apex-gray/30">
                  <Calendar className="w-12 h-12 text-apex-white-dim mx-auto mb-4" />
                  <p className="text-apex-white-dim">No test drive requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...testDrives].reverse().map(td => (
                    <div key={td.id} className="bg-apex-black-light rounded-xl border border-apex-gray/30 p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-3 flex-wrap">
                            <h3 className="text-white font-bold text-lg">{td.customerName}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              td.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              td.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {td.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-apex-orange font-semibold">{td.carName}</p>
                          <div className="text-sm text-apex-white-dim space-y-1">
                            <p>📧 {td.email} · 📱 {td.phone}</p>
                            <p>📅 {td.date} at {td.time}</p>
                            <p>📍 {td.location}</p>
                          </div>
                          <p className="text-xs text-apex-white-dim/50">{new Date(td.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {td.status === 'pending' && (
                            <>
                              <button onClick={() => handleTestDriveStatus(td, 'approved')} className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button onClick={() => handleTestDriveStatus(td, 'rejected')} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20 flex items-center gap-1">
                                <X className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          <button onClick={() => handleDeleteTestDrive(td.id)} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold text-white">Messages</h2>
              
              {messages.length === 0 ? (
                <div className="text-center py-20 bg-apex-black-light rounded-xl border border-apex-gray/30">
                  <MessageSquare className="w-12 h-12 text-apex-white-dim mx-auto mb-4" />
                  <p className="text-apex-white-dim">No messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {[...messages].reverse().map(msg => (
                    <div key={msg.id} className={`bg-apex-black-light rounded-xl border p-5 ${msg.read ? 'border-apex-gray/30' : 'border-apex-orange/50'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-white font-bold">{msg.name}</h3>
                            {!msg.read && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-apex-orange/20 text-apex-orange">NEW</span>
                            )}
                          </div>
                          <p className="text-apex-orange font-semibold text-sm">{msg.subject}</p>
                          <p className="text-apex-white-dim text-sm">{msg.message}</p>
                          <div className="text-xs text-apex-white-dim/50 space-y-0.5">
                            <p>📧 {msg.email} {msg.phone && `· 📱 ${msg.phone}`}</p>
                            <p>{new Date(msg.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!msg.read && (
                            <button onClick={() => handleMarkRead(msg)} className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg hover:bg-green-500/20">
                              Mark Read
                            </button>
                          )}
                          <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/20">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Car Form Modal */}
      {showCarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={() => setShowCarForm(false)}>
          <div className="bg-apex-black-light rounded-2xl border border-apex-gray/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 my-8" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-xl font-bold text-white mb-6">
              {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h3>
            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Brand *</label>
                  <input required value={carForm.brand} onChange={e => setCarForm(f => ({...f, brand: e.target.value}))} className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Name *</label>
                  <input required value={carForm.name} onChange={e => setCarForm(f => ({...f, name: e.target.value}))} className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Year *</label>
                  <input required type="number" value={carForm.year} onChange={e => setCarForm(f => ({...f, year: parseInt(e.target.value)}))} className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Price ($) *</label>
                  <input required type="number" value={carForm.price} onChange={e => setCarForm(f => ({...f, price: parseInt(e.target.value)}))} className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Status *</label>
                  <select value={carForm.status} onChange={e => setCarForm(f => ({...f, status: e.target.value as CarType['status']}))} className={inputClasses}>
                    <option value="in-stock">In Stock</option>
                    <option value="sold-out">Sold Out</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Engine *</label>
                  <input required value={carForm.engine} onChange={e => setCarForm(f => ({...f, engine: e.target.value}))} placeholder="e.g. 5.2L V10" className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Horsepower *</label>
                  <input required value={carForm.horsepower} onChange={e => setCarForm(f => ({...f, horsepower: e.target.value}))} placeholder="e.g. 640 HP" className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Transmission *</label>
                  <input required value={carForm.transmission} onChange={e => setCarForm(f => ({...f, transmission: e.target.value}))} className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Top Speed *</label>
                  <input required value={carForm.topSpeed} onChange={e => setCarForm(f => ({...f, topSpeed: e.target.value}))} placeholder="e.g. 212 mph" className={inputClasses} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">0-60 *</label>
                  <input required value={carForm.acceleration} onChange={e => setCarForm(f => ({...f, acceleration: e.target.value}))} placeholder="e.g. 2.9s" className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Fuel Type *</label>
                  <input required value={carForm.fuelType} onChange={e => setCarForm(f => ({...f, fuelType: e.target.value}))} className={inputClasses} />
                </div>
                <div>
                  <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Color *</label>
                  <input required value={carForm.color} onChange={e => setCarForm(f => ({...f, color: e.target.value}))} className={inputClasses} />
                </div>
              </div>

              <div>
                <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Mileage</label>
                <input value={carForm.mileage} onChange={e => setCarForm(f => ({...f, mileage: e.target.value}))} className={inputClasses} />
              </div>

              <div>
                <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-1">Description *</label>
                <textarea required rows={3} value={carForm.description} onChange={e => setCarForm(f => ({...f, description: e.target.value}))} className={inputClasses} />
              </div>

              <div>
                <label className="text-apex-white-dim text-xs font-semibold uppercase tracking-wider block mb-2">Vehicle Images</label>
                
                {/* Upload Button */}
                <div className="mb-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-apex-gray/50 rounded-lg hover:border-apex-orange/50 hover:bg-apex-orange/5 transition-colors">
                    <Upload className="w-5 h-5 text-apex-orange" />
                    <span className="text-apex-white-dim text-sm font-medium">Click to upload images</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files) {
                          const files = Array.from(e.target.files);
                          const promises = files.map(file => {
                            return new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = () => resolve(reader.result as string);
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            });
                          });

                          Promise.all(promises).then(base64Images => {
                            setCarForm(f => ({
                              ...f,
                              images: [...f.images.filter(img => img.trim() !== ''), ...base64Images]
                            }));
                          });
                        }
                      }}
                      className="hidden" 
                    />
                  </label>
                </div>

                {/* Image List */}
                <div className="space-y-3">
                  {carForm.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-3 bg-apex-black border border-apex-gray/30 p-2 rounded-lg">
                      <div className="w-16 h-12 rounded bg-apex-gray/20 overflow-hidden flex-shrink-0">
                        {img ? (
                          <img src={img} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-apex-white-dim/20 text-xs">No Img</div>
                        )}
                      </div>
                      <input
                        value={img}
                        onChange={e => {
                          const newImages = [...carForm.images];
                          newImages[i] = e.target.value;
                          setCarForm(f => ({...f, images: newImages}));
                        }}
                        placeholder="Image URL or Base64..."
                        className="bg-transparent text-sm text-apex-white-dim flex-1 outline-none border-none p-0 placeholder:text-apex-white-dim/30 truncate"
                      />
                      <button 
                        type="button" 
                        onClick={() => setCarForm(f => ({...f, images: f.images.filter((_, idx) => idx !== i)}))} 
                        className="p-1.5 text-apex-white-dim hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {carForm.images.length === 0 && (
                    <p className="text-apex-white-dim/50 text-xs text-center py-2">No images added yet.</p>
                  )}
                  
                  <button 
                    type="button" 
                    onClick={() => setCarForm(f => ({...f, images: [...f.images, '']}))} 
                    className="text-apex-white-dim hover:text-apex-orange text-xs font-semibold flex items-center gap-1 mt-2 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Image URL Manually
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={carForm.featured}
                  onChange={e => setCarForm(f => ({...f, featured: e.target.checked}))}
                  className="w-4 h-4 accent-apex-orange"
                />
                <label htmlFor="featured" className="text-apex-white-dim text-sm">Featured vehicle (shown on homepage)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-premium bg-gradient-premium text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex-1">
                  {editingCar ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
                <button type="button" onClick={() => setShowCarForm(false)} className="px-6 py-3 rounded-lg border border-apex-gray/30 text-apex-white-dim text-sm font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
