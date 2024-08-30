import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OurCourses from '@/components/OurCourses';
import React from 'react'

const page = () => {
  return (
    <div>
      <Header/>
      <div className="py-20 w-full text-center  text-white bg-[#297B66] mb-10">
        <h1 className="text-5xl mb-4">Contact </h1>
        <p className="text-xl">Home / Contact</p>
      </div>
      <OurCourses/>
      <Footer/>
    </div>
  );
}

export default page
