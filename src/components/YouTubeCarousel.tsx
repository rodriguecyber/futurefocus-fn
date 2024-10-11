import { Video } from "@/types";
import React, { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";

interface VideoGalleryProps {
  videos: Video[];
  isLoading?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  isLoading = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    if (videos.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }
  }, [videos.length]);

  const prevSlide = useCallback(() => {
    if (videos.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
      );
    }
  }, [videos.length]);

  useEffect(() => {
    if (!isLoading && videos.length > 0 && isPlaying) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [nextSlide, isLoading, videos.length, isPlaying]);

  const getVideoContent = (video: Video, index: number) => {
    const isCurrent = index === currentIndex;
    const isPrev = index === (currentIndex - 1 + videos.length) % videos.length;
    const isNext = index === (currentIndex + 1) % videos.length;

    if (!isCurrent && !isPrev && !isNext) return null;

    const videoId = new URL(video.url).searchParams.get("v");
    const slideClasses = `
      absolute top-0 transition-all duration-500 ease-in-out
      ${
        isCurrent
          ? "lg:left-1/3 w-full lg:w-1/3 z-20 lg:ml-10"
          : "lg:w-1/3 z-10 hidden lg:block"
      }
    `;

    return (
      <div key={index} className={slideClasses}>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Video ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  };

  if (isLoading || videos.length === 0) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse"></div>;
  }

  return (
    <div className="relative w-full mx-auto h-[300px] md:h-[400px] overflow-hidden px-3">
      <div className="relative w-full h-[520px]   ">
        {videos.map((video, index) => getVideoContent(video, index))}
      </div>

      <div className="flex items-center justify-around w-full lg:w-1/2 mx-10 absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronLeft />
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-black" : "bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default VideoGallery;
