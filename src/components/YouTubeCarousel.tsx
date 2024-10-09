import { Video } from "@/types";
import React from "react";
import Slider from "react-slick";

interface VideoGalleryProps {
  videos: Video[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const renderVideos = () => {
    return videos.map((video) => {
      const videoId = new URL(video.url).searchParams.get("v"); // Extract video ID from URL
      return (
        <div  key={video.url} className="video-item">
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Video ${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    });
  };

  return (
    <div className="w-full mx-auto px-32 py-10 ">
      {videos.length > 3 ? (
        <Slider {...settings}>{renderVideos()}</Slider>
      ) : (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderVideos()}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
