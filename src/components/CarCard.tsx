import { Link } from 'react-router-dom';
import { Gauge, Zap, Clock, Fuel } from 'lucide-react';
import type { Car } from '../lib/database';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const statusColors = {
    'in-stock': 'bg-green-500/20 text-green-400 border-green-500/30',
    'sold-out': 'bg-red-500/20 text-red-400 border-red-500/30',
    'coming-soon': 'bg-apex-orange/20 text-apex-orange border-apex-orange/30',
  };

  const statusLabels = {
    'in-stock': 'In Stock',
    'sold-out': 'Sold Out',
    'coming-soon': 'Coming Soon',
  };

  return (
    <Link to={`/car/${car.id}`} className="block group">
      <div className="card-premium bg-apex-black-light rounded-2xl overflow-hidden border border-apex-gray/30 hover:border-apex-orange/50">
        {/* Image */}
        <div className="relative h-52 sm:h-60 overflow-hidden">
          <img
            src={car.images[0]}
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-apex-black via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[car.status]}`}>
            {statusLabels[car.status]}
          </div>

          {car.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-apex-orange/20 text-apex-orange border border-apex-orange/30">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <p className="text-apex-orange text-xs font-bold uppercase tracking-wider">{car.brand}</p>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-apex-orange transition-colors">
              {car.name}
            </h3>
            <p className="text-apex-white-dim text-sm mt-1">{car.year} · {car.color}</p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-apex-white-dim text-xs">
              <Zap className="w-3.5 h-3.5 text-apex-orange" />
              {car.horsepower}
            </div>
            <div className="flex items-center gap-2 text-apex-white-dim text-xs">
              <Gauge className="w-3.5 h-3.5 text-apex-orange" />
              {car.topSpeed}
            </div>
            <div className="flex items-center gap-2 text-apex-white-dim text-xs">
              <Clock className="w-3.5 h-3.5 text-apex-orange" />
              {car.acceleration}
            </div>
            <div className="flex items-center gap-2 text-apex-white-dim text-xs">
              <Fuel className="w-3.5 h-3.5 text-apex-orange" />
              {car.fuelType}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-apex-gray/30">
            <span className="text-2xl font-bold text-gradient font-display">
              ${car.price.toLocaleString()}
            </span>
            <span className="text-apex-orange text-xs font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
