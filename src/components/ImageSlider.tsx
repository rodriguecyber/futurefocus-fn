import React, { useState } from "react";
import Link from "next/link";
import YouTube from "react-youtube";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";

export interface SlideItem {
  type: "image" | "video";
  src: string;
  content: string;
  videoUrl?: string;
  link?: string;
}

interface ImageVideoSliderProps {
  slides: SlideItem[];
}

const ImageVideoSlider: React.FC<ImageVideoSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getSlideContent = (index: number) => {
    const adjustedIndex = (index + slides.length) % slides.length;
    const slide = slides[adjustedIndex];

    return (
      <div
        className={`transition-all duration-300 ease-in-out ${
          index === 1 ? "w-[36%] mx-[2%]" : "w-[30%] mx-[1%]"
        }`}
      >
        {slide.type === "image" ? (
          <Link href={slide.link || "#"}>
            <img
              src={slide.src}
              alt={`Slide ${adjustedIndex}`}
              className="w-full h-full object-cover"
              style={{ width: "400px", height: "300px" }}
            />
          </Link>
        ) : (
          <div
            className="relative cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            style={{ width: "400px", height: "300px" }}
          >
            <img
              src={slide.src}
              alt={`Video thumbnail ${adjustedIndex}`}
              className="w-full h-full object-cover"
              style={{ width: "400px", height: "300px" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
    
      className="pt-1 w-screen bg-cover bg-center  relative "
      style={{
        backgroundImage: "url('https://futurefocus.co.rw/img/coder.jpg')",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${slides[currentIndex].src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
        }}
      />
      <div className="relative z-10">
        <div className="flex justify-center items-center overflow-hidden">
          {getSlideContent(currentIndex - 1)}
          {getSlideContent(currentIndex)}
          {getSlideContent(currentIndex + 1)}
        </div>
        <div className="text-center mt-5">
          <p>{slides[currentIndex].content}</p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={prevSlide}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FaLessThan />
          </button>
          <button
            onClick={nextSlide}
            className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FaGreaterThan />
          </button>
        </div>
      </div>
      {isModalOpen &&
        slides[currentIndex].type === "video" &&
        slides[currentIndex].videoUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white p-4 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <YouTube
                videoId={
                  extractYouTubeId(slides[currentIndex].videoUrl!) || undefined
                }
                opts={{ width: "640", height: "360" }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default ImageVideoSlider;
