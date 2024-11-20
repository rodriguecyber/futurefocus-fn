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
import { Project, Video } from "@/types";
import VideoGallery from "@/components/YouTubeCarousel";
import OurProjects from "@/components/Projects";
import PartnerLogos from "@/components/Partners";

export default function Home() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [beat, setBeat] = useState<Video[]>([]);
const projects: Project[] = [
  {
    image: "/as-promo.png",
    title: "Artist Summer Promotion",
    desc: " AS PROMO (Artist Summer Promotion) Is an international annual talent competition that aims to detect, highlight and promote the talents of various emerging artists. Every year, the artist summer promotion competition (ASPROMO) highlights different talents in different categories including singing, dancing, poetry...",
  },
  {
    image: "/ff-academy.png",
    title: "Future Focus Academy",
    desc: "Future Focus Academy (FFA) is an African IT & Entertainment academy, one of the pillars of Future Focus Group. xFuture Focus Academy (FFA) offers scholarship in various fields such as Video Production & Filmmaking, Proffessional Photography, Graphic Design, Music & Audio Production, Software development, Mobile app development, Web development, Computer system... We also provide Internship in Multimedia, SOD...",
  },
  {
    image: "/techup-logo1.png",
    title: "TechUp program",
    desc: "Are you a university ned to equip you with in-demand skills through hands-on training, real-world projects, and mentorship from industry experts. You’ll also learn how to teach software development, opening doors to career opportunities in both development and education.Don’t miss this chance to enhance your skills, boost your resume, and become part of a vibrant, supportive tech community",
  },
];

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
      <h1 className="text-teal-500 text-xl text-center">OUR VIDEOS</h1>
      <VideoGallery videos={videos} />
      <h1 className="text-teal-500 text-xl text-center"> OUR AUDIOS</h1>
      <VideoGallery videos={beat} />
      <h1 className="text-teal-500 text-xl text-center"> OUR PROJECTS</h1>
      <OurProjects projects={projects} />
      <PartnerLogos/>
      <Footer />
    </div>
  );
}
