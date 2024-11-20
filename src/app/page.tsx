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
import { Video } from "@/types";
import VideoGallery from "@/components/YouTubeCarousel";

export default function Home() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [beat, setBeat] = useState<Video[]>([]);


  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/media`);
        setSlides(response.data);
       
      } catch (error) {
        console.error("Error fetching slide data:", error);
       
      }
    };
    const handleFetchyYoutube = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/media/youtube`);
        setVideos(response.data.video);
        setBeat(response.data.beat);
        console.log(response.data)
       
      } catch (error) {
        console.error("Error fetching slide data:", error);
       
      }
    };
    handleFetchyYoutube()
    handleFetch();
  }, []);
  return (
    <div>
      <Header />
      <ImageVideoSlider slides={slides} />
      <OurServices />
      <OurCourses />
     <div className="px-10 my-4">
      <img src="/study-abroad.gif" alt="sytudy abroad" />
     </div>
      <h1 className="text-teal-500 text-xl text-center">
       OUR VIDEOS
      </h1>
      <VideoGallery videos={videos} />
      <h1 className="text-teal-500 text-xl text-center">
        {" "}
        OUR AUDIOS
      </h1>
      <VideoGallery videos={beat} />
      <Footer />
    </div>
  );
}
