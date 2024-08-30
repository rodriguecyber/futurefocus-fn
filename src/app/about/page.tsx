import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OurServices from '@/components/OurServices';
import OurTeam from '@/components/OurTeam';
import WhyUs from '@/components/whyUs';
import React from 'react'

const About = () => {
  return ( 
    <div>
      <Header/>
      <div className="py-20 w-full text-center  text-white bg-[#297B66] mb-10">
        <h1 className='text-5xl mb-4'>About Us</h1>
        <p className='text-xl'>Home / About</p>
      </div>
      <OurServices/>
      <WhyUs/>
      <OurTeam/>
      <Footer/>
    </div>
  );
}

export default About
