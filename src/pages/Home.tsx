import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Trophy, Wrench, ChevronRight } from 'lucide-react';
import { Particles } from '../components/Particles';
import { ScrollReveal } from '../components/ScrollReveal';
import { CarCard } from '../components/CarCard';
import { db, type Car } from '../lib/database';

export function Home() {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
    db.cars.getAll().then(cars => {
      setFeaturedCars(cars.filter(c => c.featured).slice(0, 3));
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Particles />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80"
            alt="Premium sports car"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-apex-black via-apex-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-apex-black via-transparent to-apex-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-apex-orange/10 border border-apex-orange/30 mb-8 transition-all duration-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-apex-orange animate-pulse" />
              <span className="text-apex-orange text-xs font-bold uppercase tracking-widest">
                2024 Collection Available
              </span>
            </div>

            {/* Main Title */}
            <h1 className="space-y-2">
              <span
                className={`block font-display text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white transition-all duration-1000 delay-200 ${
                  heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              >
                UNLEASH THE
              </span>
              <span
                className={`block font-display text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-gradient transition-all duration-1000 delay-500 ${
                  heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                }`}
              >
                BEAST WITHIN
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-6 text-lg sm:text-xl text-apex-white-dim max-w-xl leading-relaxed transition-all duration-1000 delay-700 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Experience the pinnacle of automotive excellence. Hand-crafted performance machines 
              built for those who refuse to settle for ordinary.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mt-10 transition-all duration-1000 delay-1000 ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link
                to="/inventory"
                className="btn-premium bg-gradient-premium text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-premium bg-transparent border-2 border-apex-orange/50 text-apex-orange px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-apex-orange/10"
              >
                Contact Us
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 sm:gap-12 mt-16 transition-all duration-1000 delay-[1200ms] ${
                heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {[
                { value: '200+', label: 'Cars Sold' },
                { value: '50+', label: 'Countries' },
                { value: '15+', label: 'Years' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl sm:text-3xl font-black text-apex-orange">{stat.value}</p>
                  <p className="text-apex-white-dim text-xs uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-apex-orange/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-apex-orange animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Our Collection</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white">
                FEATURED <span className="text-gradient">MACHINES</span>
              </h2>
              <p className="text-apex-white-dim mt-4 max-w-2xl mx-auto">
                Discover our hand-picked selection of the world's most extraordinary performance vehicles.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car, i) => (
              <ScrollReveal key={car.id} delay={i * 150}>
                <CarCard car={car} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link
                to="/inventory"
                className="btn-premium inline-flex items-center gap-2 bg-gradient-premium text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider"
              >
                View All Inventory
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-28 bg-apex-black-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Why KingAutos</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white">
                THE KING AUTOS <span className="text-gradient">DIFFERENCE</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Authenticated',
                desc: 'Every vehicle undergoes 200+ point inspection and comes with full provenance documentation.',
              },
              {
                icon: Globe,
                title: 'Global Delivery',
                desc: 'We deliver anywhere in the world. Secure, insured transport to your doorstep.',
              },
              {
                icon: Trophy,
                title: 'Premium Selection',
                desc: 'Only the finest machines make it to our showroom. We accept less than 5% of submissions.',
              },
              {
                icon: Wrench,
                title: 'Full Service',
                desc: 'From purchase to maintenance, our concierge team handles everything for you.',
              },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 100}>
                <div className="card-premium bg-apex-black-light rounded-2xl p-8 border border-apex-gray/30 hover:border-apex-orange/50 text-center group">
                  <div className="w-14 h-14 rounded-xl bg-apex-orange/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-apex-orange/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-apex-orange" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-apex-white-dim text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
            alt="Sports car"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-apex-black via-apex-black/90 to-apex-black" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              READY TO <span className="text-gradient">DOMINATE</span>?
            </h2>
            <p className="text-apex-white-dim text-lg max-w-2xl mx-auto mb-10">
              Schedule a private viewing or test drive today. Our team of experts 
              is ready to help you find your perfect machine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/inventory"
                className="btn-premium bg-gradient-premium text-white px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wider"
              >
                Browse Inventory
              </Link>
              <Link
                to="/contact"
                className="btn-premium border-2 border-apex-orange/50 text-apex-orange px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-apex-orange/10"
              >
                Schedule Test Drive
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
