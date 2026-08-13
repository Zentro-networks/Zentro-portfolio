import React from 'react';
import Hero from '../components/sections/Hero';
/*import About from '../components/sections/About';*/
import Services from '../components/sections/Services';
import Testimonials from '../components/sections/Testimonials';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      {/*<About />*/}
      <Services />
      <Testimonials />
      <Contact />
    </div>
  );
}

