"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageVideoSlider, { SlideItem } from "@/components/ImageSlider";
import OurCourses from "@/components/OurCourses";
import OurServices from "@/components/OurServices";
import WhyUs from "@/components/whyUs";
import AuthContextAPI from "@/context/AuthContext";

export default function Home() {
  const slides: SlideItem[] = [
    {
      type: "image",
      src: "https://futurefocus.co.rw/img/art.png",
      content: "Content for image 1",
      link: "/content/image1",
    },
    {
      type: "video",
      src: "https://futurefocus.co.rw/img/mobile-app-development.jpg",
      content: "Content for YouTube video 1",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      type: "video",
      src: "https://futurefocus.co.rw/img/music.jpg",
      content: "Content for YouTube video 2",
      videoUrl: "https://youtu.be/jNQXAC9IVRw",
    },
    {
      type: "image",
      src: "https://futurefocus.co.rw/img/WEB%20POSTAL/PHOTOGRAPH.jpg",
      content: "Content for image 2",
      link: "/content/image2",
    },
   
  ];

  return (
    
    <div
      
    >
      <Header/>
      <ImageVideoSlider slides={slides} />
      <OurServices />
      <WhyUs />
      <OurCourses />
      <Footer/>
    </div>
  );
}
