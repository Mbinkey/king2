import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { CarCard } from '../components/CarCard';
import { db, type Car } from '../lib/database';

export function Inventory() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filtered, setFiltered] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.cars.getAll().then(data => {
      setCars(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...cars];

    // Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.brand.toLowerCase().includes(s) ||
        c.color.toLowerCase().includes(s) ||
        c.engine.toLowerCase().includes(s)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    setFiltered(result);
  }, [search, statusFilter, sortBy, cars]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-apex-black-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Our Fleet</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white">
              FULL <span className="text-gradient">INVENTORY</span>
            </h1>
            <p className="text-apex-white-dim mt-4 max-w-2xl">
              Browse our complete collection of premium performance vehicles. Each car has been meticulously inspected and prepared.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-apex-black border-b border-apex-gray/30 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apex-white-dim" />
              <input
                type="text"
                placeholder="Search cars..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-apex-black-light border border-apex-gray/30 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-apex-white-dim/50"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-apex-white-dim" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 text-sm text-apex-white-dim border border-apex-gray/30 px-4 py-2.5 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              <div className={`${showFilters ? 'flex' : 'hidden'} md:flex items-center gap-3 w-full md:w-auto flex-wrap`}>
                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-apex-black-light border border-apex-gray/30 rounded-lg px-4 py-2.5 text-sm text-white appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="sold-out">Sold Out</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-apex-black-light border border-apex-gray/30 rounded-lg px-4 py-2.5 text-sm text-white appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <span className="text-apex-white-dim text-sm ml-auto md:ml-0">
                {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Car Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-apex-black-light rounded-2xl h-96 animate-pulse border border-apex-gray/30" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-apex-white-dim text-lg">No vehicles found matching your criteria.</p>
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); }}
                className="mt-4 text-apex-orange text-sm font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((car, i) => (
                <ScrollReveal key={car.id} delay={i * 100}>
                  <CarCard car={car} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
