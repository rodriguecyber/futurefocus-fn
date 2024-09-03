"use client";
import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageVideoSlider, { SlideItem } from "@/components/ImageSlider";
import OurCourses from "@/components/OurCourses";
import OurServices from "@/components/OurServices";
import WhyUs from "@/components/whyUs";
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";

export default function Home() {
  const [slides, setSlides] = useState<SlideItem[]>([]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/media`);
        setSlides(response.data);
        console.log(response.data)
       
      } catch (error) {
        console.error("Error fetching slide data:", error);
       
      }
    };
    handleFetch();
  }, []);
  return (
    <div>
      <Header />
      <ImageVideoSlider slides={slides} />
      <OurServices />
      <WhyUs />
      <OurCourses />
      <Footer />
    </div>
  );
}
