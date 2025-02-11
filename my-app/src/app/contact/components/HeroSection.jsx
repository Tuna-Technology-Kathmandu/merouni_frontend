export default function ContactHeroSection() {
  return (
    <section className="relative bg-[#e8f1f4] py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a472f] mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
      </div>
      {/* Decorative arrows */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="inline-block mr-2 text-4xl text-gray-400">
            &gt;
          </span>
        ))}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="inline-block ml-2 text-4xl text-gray-400">
            &gt;
          </span>
        ))}
      </div>
    </section>
  );
}
