import { ScrollReveal } from '../components/ScrollReveal';
import { Particles } from '../components/Particles';
import { Award, Users, Target, Heart } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <Particles />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
            alt="Luxury showroom"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-apex-black via-apex-black/80 to-apex-black" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Our Story</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white">
              BUILT FOR <span className="text-gradient">LEGENDS</span>
            </h1>
            <p className="text-apex-white-dim mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
              For over 15 years, KingAutos has been the world's most trusted name in premium performance vehicles. 
              We don't just sell cars — we curate automotive masterpieces for those who demand excellence.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-apex-black-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden border border-apex-gray/30">
                <img
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
                  alt="Premium car"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="space-y-6">
                <p className="text-apex-orange text-xs font-bold uppercase tracking-widest">The Beginning</p>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                  FROM PASSION TO <span className="text-gradient">EMPIRE</span>
                </h2>
                <p className="text-apex-white-dim leading-relaxed">
                  Founded in 2009 by automotive enthusiasts with a vision to redefine the luxury car buying experience, 
                  KingAutos has grown from a single showroom to a global presence spanning over 50 countries.
                </p>
                <p className="text-apex-white-dim leading-relaxed">
                  Every vehicle in our collection is hand-selected, meticulously inspected, and prepared to 
                  the highest standards. We believe that acquiring a premium vehicle should be as extraordinary 
                  as the car itself.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div>
                    <p className="font-display text-3xl font-black text-apex-orange">200+</p>
                    <p className="text-apex-white-dim text-sm mt-1">Vehicles Sold</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-black text-apex-orange">50+</p>
                    <p className="text-apex-white-dim text-sm mt-1">Countries Served</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-black text-apex-orange">99%</p>
                    <p className="text-apex-white-dim text-sm mt-1">Client Satisfaction</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-black text-apex-orange">15+</p>
                    <p className="text-apex-white-dim text-sm mt-1">Years of Excellence</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-apex-orange text-xs font-bold uppercase tracking-widest mb-3">Our Values</p>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
                WHAT DRIVES <span className="text-gradient">US</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Excellence', desc: 'We never compromise on quality. Every vehicle meets our exacting standards.' },
              { icon: Users, title: 'Trust', desc: 'Transparent dealings, honest assessments, and a commitment to integrity.' },
              { icon: Target, title: 'Precision', desc: 'Every detail matters. From inspection to delivery, precision defines us.' },
              { icon: Heart, title: 'Passion', desc: 'Our love for automobiles drives everything we do. It\'s not just business.' },
            ].map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="card-premium bg-apex-black-light rounded-2xl p-8 border border-apex-gray/30 hover:border-apex-orange/50 text-center group h-full">
                  <div className="w-14 h-14 rounded-xl bg-apex-orange/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-apex-orange/20 transition-colors">
                    <v.icon className="w-7 h-7 text-apex-orange" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-apex-white-dim text-sm leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
