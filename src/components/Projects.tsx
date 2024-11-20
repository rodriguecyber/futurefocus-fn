import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types";

interface ProjectProps {
  projects: Project[];
  isLoading?: boolean;
}

const OurProjects: React.FC<ProjectProps> = ({
  projects,
  isLoading = false,
}) => {
  const [randomProjects, setRandomProject] = useState<Project[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (projects.length > 0) {
      // Create a copy and shuffle the videos array
      const shuffled = [...projects];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRandomProject(shuffled);
    }
  }, [projects]);

  const nextSlide = () => {
    if (startIndex + 3 < randomProjects.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  if (isLoading || projects.length === 0) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse" />;
  }

  const visibleProjects= randomProjects.slice(startIndex, startIndex + 3);

  return (
    <div className="w-full mx-auto  px-10 py-4">
      <div className="relative">
        {/* Navigation Buttons */}
        {startIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2   -translate-y-1/2 -translate-x-4 z-10 bg-yellow-500 rounded-full p-2 shadow-lg hover:bg-yellow-300 transition-colors duration-200"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {startIndex + 3 < randomProjects.length && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-yellow-500 rounded-full p-2 shadow-lg hover:bg-yellow-300 transition-colors duration-200"
            aria-label="Next videos"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  transition-all duration-300 ease-in-out">
          {visibleProjects.map((project, index) => {
            return (
              <div
                key={`${project.title}-${index}`}
                className="flex flex-col transition-transform duration-300 border-solid border-[#c4b9b9] border-[0.0000001px] rounded-md "
              >
                <img
                  height={10}
                  className="h-2/3 mx-auto"
                  src={project.image}
                  alt={project.title}
                />
                <div
                  className=" relative
                from-gray-900 via-gray-800 to-transparent px-4 h-72 overflow-auto"
                >
                  <h2 className="text-lg font-bold">{project.title}</h2>
                  <p className="text-sm text-gray-400 ">{project.desc}</p>
                  <button className="bottom-0 text-green-700 hover:text-green-900 font-extrabold left-2 ">
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        {randomProjects.length > 3 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.ceil(randomProjects.length / 3) }).map(
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

export default OurProjects;
