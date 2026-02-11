import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home bg-white">
      <section className="min-h-[calc(100vh-72px)] flex items-center relative overflow-hidden py-12">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 z-10">
            <h1 className="font-display font-black text-7xl md:text-8xl italic leading-[1.1] text-primary">
              AniVerse<br />Collectibles
            </h1>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-lg">
              Explore our exclusive collection of anime figurines, cosplay costumes,<br />
              and more. Immerse yourself in the vibrant world of anime with our<br />
              carefully curated selection of high-quality collectibles.
            </p>
            <div className="pt-4">
              <Link
                to="/products"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative z-10 flex justify-center md:justify-end">
            <img
              src="/.legacy/image/pic_front.png"
              alt="AniVerse Hero"
              className="max-w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
