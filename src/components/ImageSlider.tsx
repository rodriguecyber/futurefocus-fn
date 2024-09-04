import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import YouTube from "react-youtube";
import { FaGreaterThan, FaLessThan, FaPlay } from "react-icons/fa";

export interface SlideItem {
  type: "image" | "video";
  url: string;
  content: string;
  videoUrl?: string;
  link?: string;
}

interface ImageVideoSliderProps {
  slides: SlideItem[];
  isLoading?: boolean;
}

const ImageVideoSlider: React.FC<ImageVideoSliderProps> = ({
  slides,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }
  }, [slides.length]);

  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [nextSlide, isLoading, slides.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prevSlide = () => {
    if (slides.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getSlideContent = (index: number) => {
    if (slides.length === 0) return null;
    const adjustedIndex = (index + slides.length) % slides.length;
    const slide = slides[adjustedIndex];

    if (!slide) return null;

    return (
      <div
        className={`transition-all duration-300 ease-in-out w-full ${
          slidesToShow === 2 ? "md:w-1/2" : ""
        } px-2`}
        key={adjustedIndex}
      >
        {slide.type === "image" ? (
          <Link href={slide.link || "#"}>
            <img
              src={slide.url}
              alt={`Slide ${adjustedIndex}`}
              className="w-full h-full object-cover rounded-md"
              style={{ aspectRatio: "3/2" }}
            />
          </Link>
        ) : (
          <div
            className="relative cursor-pointer group"
            onClick={() => setIsModalOpen(true)}
            style={{ aspectRatio: "3/2" }}
          >
            <img
              src={slide.url}
              alt={`Video thumbnail ${adjustedIndex}`}
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-4 transition-all duration-300 group-hover:bg-opacity-75">
                <FaPlay className="text-white text-3xl" />
              </div>
            </div>
          </div>
        )}
        <p className="text-center mt-2 text-sm md:text-lg lg:text-xl">
          {slide.content}
        </p>
      </div>
    );
  };

  const getSkeletonContent = () => {
    return (
      <div
        className={`transition-all duration-300 ease-in-out w-full ${
          slidesToShow === 2 ? "md:w-1/2" : ""
        } px-2`}
      >
        <div
          className="bg-gray-200 rounded-md animate-pulse"
          style={{ aspectRatio: "3/2" }}
        ></div>
      </div>
    );
  };

  const renderSkeletonSlider = () => (
    <div className="pt-1 w-screen bg-cover bg-center relative">
      <div className="relative z-10">
        <div className="flex justify-center items-center overflow-hidden">
          {Array.from({ length: slidesToShow }).map((_, index) => (
            <React.Fragment key={index}>{getSkeletonContent()}</React.Fragment>
          ))}
        </div>
        <div className="text-center mt-5 px-4">
          <div className="h-6 bg-gray-200 rounded-md animate-pulse w-3/4 mx-auto"></div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="mx-2 px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded animate-pulse w-10 h-10"></div>
          <div className="mx-2 px-2 py-1 md:px-4 md:py-2 bg-gray-200 rounded animate-pulse w-10 h-10"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading || slides.length === 0) {
    return renderSkeletonSlider();
  }

  return (
    <div
      className="pt-1 w-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://barkleypd.com/wp-content/uploads/2023/01/AdobeStock_34360454-scaled.jpeg')",
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${slides[currentIndex].url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
        }}
      />
      <div className="relative z-10">
        <div className="flex justify-center items-center overflow-hidden">
          {Array.from({ length: slidesToShow }).map((_, offset) =>
            getSlideContent(currentIndex + offset)
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={prevSlide}
            className="mx-2 px-2 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded"
          >
            <FaLessThan />
          </button>
          <button
            onClick={nextSlide}
            className="mx-2 px-2 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded"
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
                opts={{ width: "100%", height: "360px" }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default ImageVideoSlider;
