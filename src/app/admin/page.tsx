"use client";

import React, { useState } from "react";
import Layout from "./Layout";
import withAdminAuth from "@/components/withAdminAuth";

export interface SlideItem {
  type: "image" | "video";
  src: string;
  content: string;
  videoUrl?: string;
  link?: string;
}

const MediaPostForm: React.FC = () => {
  const [formData, setFormData] = useState<SlideItem>({
    type: "image",
    src: "",
    content: "",
    videoUrl: "",
    link: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const src = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        src,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Submit logic goes here, e.g., API call to save the media post
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Post Media
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Media
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Describe the media content"
            />
          </div>
          {formData.type === "video" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video URL
              </label>
              <input
                type="text"
                name="videoUrl"
                value={formData.videoUrl || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter video URL (optional)"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link
            </label>
            <input
              type="text"
              name="link"
              value={formData.link || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter link (optional)"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
          {formData.src && (
            <div className="mt-4">
              <p>Preview:</p>
              {formData.type === "image" ? (
                <img
                  src={formData.src}
                  alt="Preview"
                  className="mt-2 w-full h-auto object-cover"
                />
              ) : (
                <video
                  src={formData.src}
                  controls
                  className="mt-2 w-full h-auto"
                />
              )}
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default withAdminAuth(MediaPostForm);
