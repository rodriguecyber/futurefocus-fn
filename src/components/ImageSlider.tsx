import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";

export interface SlideItem {
  type: "image" | "video";
  url: string;
  content: string;
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
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    }
  }, [slides.length]);

  useEffect(() => {
    if (!isLoading && slides.length > 0 && isPlaying) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [nextSlide, isLoading, slides.length, isPlaying]);

  const getSlideContent = (slide: SlideItem, index: number) => {
    const isCurrent = index === currentIndex;
    const isPrev = index === (currentIndex - 1 + slides.length) % slides.length;
    const isNext = index === (currentIndex + 1) % slides.length;

    if (!isCurrent && !isPrev && !isNext) {
      return null;
    }

    const slideClasses = ` 
      absolute top-0 transition-all duration-500 ease-in-out  
      ${isCurrent ? "lg:left-1/4 w-full lg:w-2/5 lg:h-full z-20  ml-10 " : "lg:w-1/4 h-full z-10 hidden lg:block"}
      ${isPrev ? "left-3 " : isNext ? "right-3" : ""}
    `;

    return (
      <div key={index} className={slideClasses}>
        {slide.type === "image" ? (
          <img
            src={slide.url}
            alt={slide.content}
            className="w-full h-full object-cover "
          />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center ">
            <FaPlay className="text-white text-6xl" />
          </div>
        )}
      </div>
    );
  };

  if (isLoading || slides.length === 0) {
    return <div className="w-full h-[400px] bg-gray-200 animate-pulse"></div>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[400px] bg-black overflow-hidden">
      <div className="relative w-full h-[300px]  ">
        {slides.map((slide, index) => getSlideContent(slide, index))}
      </div>

      <div className="h-[50px] flex items-center justify-center bg-black bg-opacity-75">
        <p className="text-white text-lg">{currentSlide.content}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
        <div className="flex items-center justify-around w-full lg:w-1/2 mx-auto">
          <button
            onClick={prevSlide}
            className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <FaChevronLeft />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                ></button>
              ))}
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          <button
            onClick={nextSlide}
            className="text-white p-2 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageVideoSlider;
