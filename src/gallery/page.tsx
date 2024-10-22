import Footer from '@/components/Footer';
import Header from '@/components/Header';
import API_BASE_URL from '@/config/baseURL';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
interface YotubeV{
  _id:string,
  url:string,
  type:string
}

const Gallery = () => {
  const [videos, setVideos] = useState<YotubeV[]>([]);

     useEffect(()=>{
        const fetchYoutube = async () => {
          try {
            const [mediaResponse] = await Promise.all([
              axios.get(`${API_BASE_URL}/media/youtube`),
            ]);
            const combinedMedia = [
              ...mediaResponse.data.video,
              ...mediaResponse.data.beat,
            ];
            setVideos(combinedMedia);
          } catch (error) {}
        };
        fetchYoutube()
     },[])
  return (
    <><Header /><div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
              YouTube Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((item) => (
                  <div
                      key={item._id}
                      className="border border-gray-300 p-4 rounded-lg shadow-sm"
                  >
                      <p className="text-sm text-gray-700 mb-2">{item.type}</p>

                      <div className="aspect-w-16 aspect-h-9 mb-4">
                          <iframe
                              // width="560"
                              // height="315"
                              src={`https://www.youtube.com/embed/${new URL(
                                  item.url
                              ).searchParams.get("v")}`}
                              title={item.type}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-md"
                          ></iframe>
                      </div>
                      <div className="text-right space-x-2">

                      </div>
                  </div>
              ))}
          </div>
      </div><Footer /></>
  );
}

export default Gallery
