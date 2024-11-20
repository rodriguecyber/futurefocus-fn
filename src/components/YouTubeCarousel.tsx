import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Video } from "@/types";

interface VideoGalleryProps {
  videos: Video[];
  isLoading?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  isLoading = false,
}) => {
  const [randomVideos, setRandomVideos] = useState<Video[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (videos.length > 0) {
      // Create a copy and shuffle the videos array
      const shuffled = [...videos];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRandomVideos(shuffled);
    }
  }, [videos]);

  const nextSlide = () => {
    if (startIndex + 3 < randomVideos.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  if (isLoading || videos.length === 0) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse" />;
  }

  const visibleVideos = randomVideos.slice(startIndex, startIndex + 3);

  return (
    <div className="w-full mx-auto  px-10 py-4">
      <div className="relative">
        {/* Navigation Buttons */}
        {startIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {startIndex + 3 < randomVideos.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Next videos"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ease-in-out">
          {visibleVideos.map((video, index) => {
            const videoId = new URL(video.url).searchParams.get("v");
            return (
              <div
                key={`${videoId}-${index}`}
                className="w-full aspect-video transition-transform duration-300"
              >
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Video ${startIndex + index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        {randomVideos.length > 3 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.ceil(randomVideos.length / 3) }).map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStartIndex(idx * 3)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    Math.floor(startIndex / 3) === idx
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* <a
        href="https://www.youtube.com/@kigalifamemedia"
        className="block w-fit bg-blue-600 hover:bg-blue-800 text-white rounded cursor-pointer mx-auto px-6 py-2 mt-6 transition-colors duration-200"
      >
        View More
      </a> */}
    </div>
  );
};

export default VideoGallery;
