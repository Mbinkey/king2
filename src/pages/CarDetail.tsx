import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Gauge, Zap, Clock, Fuel, Settings, Palette, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { db, type Car } from '../lib/database';
import { v4 as uuid } from 'uuid';

export function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);

  // Order form
  const [orderForm, setOrderForm] = useState({
    customerName: '', email: '', phone: '', country: '', address: '', notes: '',
  });

  // Test drive form
  const [tdForm, setTdForm] = useState({
    customerName: '', email: '', phone: '', date: '', time: '', location: '',
  });

  useEffect(() => {
    if (id) {
      db.cars.getById(id).then(data => {
        setCar(data || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    await db.orders.create({
      id: uuid(),
      carId: car.id,
      carName: `${car.brand} ${car.name}`,
      customerName: orderForm.customerName,
      email: orderForm.email,
      phone: orderForm.phone,
      country: orderForm.country,
      address: orderForm.address,
      status: 'pending',
      totalPrice: car.price,
      createdAt: new Date().toISOString(),
      notes: orderForm.notes,
    });
    setOrderSubmitted(true);
  };

  const handleTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    await db.testDrives.create({
      id: uuid(),
      carId: car.id,
      carName: `${car.brand} ${car.name}`,
      customerName: tdForm.customerName,
      email: tdForm.email,
      phone: tdForm.phone,
      date: tdForm.date,
      time: tdForm.time,
      location: tdForm.location,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setTestDriveSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-apex-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
        <p className="text-apex-white-dim text-lg">Vehicle not found.</p>
        <Link to="/inventory" className="text-apex-orange font-semibold hover:underline">← Back to Inventory</Link>
      </div>
    );
  }

  const specs = [
    { icon: Zap, label: 'Horsepower', value: car.horsepower },
    { icon: Settings, label: 'Engine', value: car.engine },
    { icon: Gauge, label: 'Top Speed', value: car.topSpeed },
    { icon: Clock, label: '0-60 mph', value: car.acceleration },
    { icon: Fuel, label: 'Fuel', value: car.fuelType },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    { icon: Palette, label: 'Color', value: car.color },
    { icon: Calendar, label: 'Year', value: car.year.toString() },
  ];

  const statusColors: Record<string, string> = {
    'in-stock': 'bg-green-500/20 text-green-400 border-green-500/30',
    'sold-out': 'bg-red-500/20 text-red-400 border-red-500/30',
    'coming-soon': 'bg-apex-orange/20 text-apex-orange border-apex-orange/30',
  };

  const statusLabels: Record<string, string> = {
    'in-stock': 'In Stock',
    'sold-out': 'Sold Out',
    'coming-soon': 'Coming Soon',
  };

  const inputClasses = "w-full bg-apex-black border border-apex-gray/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-apex-white-dim/50";

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/inventory" className="inline-flex items-center gap-2 text-apex-white-dim hover:text-apex-orange transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-apex-black-light border border-apex-gray/30 aspect-[4/3]">
                <img
                  src={car.images[activeImage]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(i => (i === 0 ? car.images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-apex-black/70 flex items-center justify-center text-white hover:bg-apex-orange transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage(i => (i === car.images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-apex-black/70 flex items-center justify-center text-white hover:bg-apex-orange transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[car.status]}`}>
                  {statusLabels[car.status]}
                </div>
              </div>
              
              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="flex gap-3">
                  {car.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-apex-orange' : 'border-apex-gray/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Details */}
          <ScrollReveal delay={200}>
            <div className="space-y-6">
              <div>
                <p className="text-apex-orange text-xs font-bold uppercase tracking-widest">{car.brand}</p>
                <h1 className="font-display text-3xl sm:text-4xl font-black text-white mt-2">{car.name}</h1>
                <p className="text-apex-white-dim mt-2">{car.year} · {car.mileage}</p>
              </div>

              <p className="font-display text-3xl sm:text-4xl font-black text-gradient">
                ${car.price.toLocaleString()}
              </p>

              <p className="text-apex-white-dim leading-relaxed">{car.description}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-apex-black-light rounded-xl p-4 border border-apex-gray/30">
                    <div className="flex items-center gap-2 mb-1">
                      <spec.icon className="w-4 h-4 text-apex-orange" />
                      <span className="text-apex-white-dim text-xs uppercase tracking-wider">{spec.label}</span>
                    </div>
                    <p className="text-white font-semibold text-sm">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {car.status === 'in-stock' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => { setShowOrder(true); setShowTestDrive(false); }}
                    className="btn-premium bg-gradient-premium text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex-1 text-center"
                  >
                    Place Order
                  </button>
                  <button
                    onClick={() => { setShowTestDrive(true); setShowOrder(false); }}
                    className="btn-premium border-2 border-apex-orange/50 text-apex-orange px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex-1 text-center hover:bg-apex-orange/10"
                  >
                    Schedule Test Drive
                  </button>
                </div>
              )}

              {car.status === 'sold-out' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400 font-bold">This vehicle has been sold</p>
                  <Link to="/inventory" className="text-apex-orange text-sm mt-2 inline-block hover:underline">Browse available vehicles →</Link>
                </div>
              )}

              {car.status === 'coming-soon' && (
                <div className="bg-apex-orange/10 border border-apex-orange/30 rounded-xl p-4 text-center">
                  <p className="text-apex-orange font-bold">Coming Soon</p>
                  <Link to="/contact" className="text-apex-white-dim text-sm mt-2 inline-block hover:underline">Contact us for pre-order →</Link>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Order Modal */}
        {showOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowOrder(false)}>
            <div className="bg-apex-black-light rounded-2xl border border-apex-gray/30 w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              {orderSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Order Placed!</h3>
                  <p className="text-apex-white-dim">Your order has been submitted. We'll contact you shortly to confirm.</p>
                  <button onClick={() => { setShowOrder(false); setOrderSubmitted(false); }} className="mt-6 text-apex-orange font-semibold hover:underline">Close</button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">Place Order</h3>
                  <p className="text-apex-white-dim text-sm mb-6">{car.brand} {car.name} · ${car.price.toLocaleString()}</p>
                  <form onSubmit={handleOrder} className="space-y-4">
                    <input required placeholder="Full Name *" value={orderForm.customerName} onChange={e => setOrderForm(f => ({...f, customerName: e.target.value}))} className={inputClasses} />
                    <input required type="email" placeholder="Email Address *" value={orderForm.email} onChange={e => setOrderForm(f => ({...f, email: e.target.value}))} className={inputClasses} />
                    <input required placeholder="Phone Number *" value={orderForm.phone} onChange={e => setOrderForm(f => ({...f, phone: e.target.value}))} className={inputClasses} />
                    <input required placeholder="Country *" value={orderForm.country} onChange={e => setOrderForm(f => ({...f, country: e.target.value}))} className={inputClasses} />
                    <textarea required placeholder="Delivery Address *" rows={3} value={orderForm.address} onChange={e => setOrderForm(f => ({...f, address: e.target.value}))} className={inputClasses} />
                    <textarea placeholder="Additional Notes" rows={2} value={orderForm.notes} onChange={e => setOrderForm(f => ({...f, notes: e.target.value}))} className={inputClasses} />
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="btn-premium bg-gradient-premium text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex-1">Submit Order</button>
                      <button type="button" onClick={() => setShowOrder(false)} className="px-6 py-3 rounded-lg border border-apex-gray/30 text-apex-white-dim text-sm font-semibold">Cancel</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Test Drive Modal */}
        {showTestDrive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowTestDrive(false)}>
            <div className="bg-apex-black-light rounded-2xl border border-apex-gray/30 w-full max-w-lg max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              {testDriveSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Request Submitted!</h3>
                  <p className="text-apex-white-dim">We'll review your test drive request and get back to you soon.</p>
                  <button onClick={() => { setShowTestDrive(false); setTestDriveSubmitted(false); }} className="mt-6 text-apex-orange font-semibold hover:underline">Close</button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">Schedule Test Drive</h3>
                  <p className="text-apex-white-dim text-sm mb-6">{car.brand} {car.name}</p>
                  <form onSubmit={handleTestDrive} className="space-y-4">
                    <input required placeholder="Full Name *" value={tdForm.customerName} onChange={e => setTdForm(f => ({...f, customerName: e.target.value}))} className={inputClasses} />
                    <input required type="email" placeholder="Email Address *" value={tdForm.email} onChange={e => setTdForm(f => ({...f, email: e.target.value}))} className={inputClasses} />
                    <input required placeholder="Phone Number *" value={tdForm.phone} onChange={e => setTdForm(f => ({...f, phone: e.target.value}))} className={inputClasses} />
                    <input required type="date" value={tdForm.date} onChange={e => setTdForm(f => ({...f, date: e.target.value}))} className={inputClasses} />
                    <input required type="time" value={tdForm.time} onChange={e => setTdForm(f => ({...f, time: e.target.value}))} className={inputClasses} />
                    <input required placeholder="Preferred Location *" value={tdForm.location} onChange={e => setTdForm(f => ({...f, location: e.target.value}))} className={inputClasses} />
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="btn-premium bg-gradient-premium text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider flex-1">Submit Request</button>
                      <button type="button" onClick={() => setShowTestDrive(false)} className="px-6 py-3 rounded-lg border border-apex-gray/30 text-apex-white-dim text-sm font-semibold">Cancel</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
