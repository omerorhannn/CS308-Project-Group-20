import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Banners from '../components/Banners';
import Newsletter from '../components/Newsletter';

export default function HomePage({ searchQuery }) {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Products searchQuery={searchQuery} />
      <Banners />
      <Newsletter />
    </>
  );
}
