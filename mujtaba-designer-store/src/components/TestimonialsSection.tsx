import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      text: "Loved the fabric quality! The stitching and design were exactly as shown. Will definitely order again from Mujtaba Designer. Highly recommended for formal wear.",
      rating: 5,
    },
    {
      text: "Great service and fast delivery. The kurta I ordered fit perfectly and looked amazing. Very happy with the overall experience.",
      rating: 5,
    },
    {
      text: "I ordered a 3-piece suit and it was beautiful. The colors were vibrant and fabric felt premium. Mujtaba Fabrics never disappoints!",
      rating: 5,
    },
  ];

  return (
    <section className="bg-yellow-600 py-16 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider mb-2">
            Our Happy Customers!
          </h3>
          <p className="text-lg text-white italic font-medium">Building Unshakable Trust</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed text-sm">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
