"use client";

import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import withAdminAuth from "@/components/withAdminAuth";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";

export interface MediaItem {
  _id: string;
  type: "image" | "video";
  url: string;
  content: string;
  videoUrl?: string;
  link?: string;
}

const MediaPostForm: React.FC = () => {
  const [formData, setFormData] = useState<MediaItem>({
    _id: "",
    type: "image",
    url: "",
    content: "",
    videoUrl: "",
    link: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/media`);
      setMediaItems(response.data);
    } catch (error) {
      console.error("Error fetching media items:", error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("type", formData.type);
    data.append("content", formData.content);
    if (formData.videoUrl) data.append("videoUrl", formData.videoUrl);
    if (formData.link) data.append("link", formData.link);

    const fileInput =
      e.currentTarget.querySelector<HTMLInputElement>("input[type='file']");
    if (fileInput?.files?.[0]) {
      data.append("file", fileInput.files[0]);
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${API_BASE_URL}/media/${formData._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/media/upload`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        console.log("File uploaded/updated successfully:", response.data);
        fetchMediaItems();
        resetForm();
      } else {
        console.error("File upload/update failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading/updating file:", error);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/media/${id}`);
      fetchMediaItems();
    } catch (error) {
      console.error("Error deleting media item:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      type: "image",
      url: "",
      content: "",
      videoUrl: "",
      link: "",
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {isEditing ? "Edit Media" : "Post Media"}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video URL (for video type)
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Link
            </label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="text-center space-x-2">
            <button
              type="submit"
              className={`inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Posted Media</h3>
          <div className="space-y-4">
            {mediaItems.map((item) => (
              <div key={item._id} className="border p-4 rounded-md">
                <p>
                  <strong>Type:</strong> {item.type}
                </p>
                <p>
                  <strong>Content:</strong> {item.content}
                </p>
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.content}
                    className="mt-2 max-w-full h-auto"
                  />
                ) : (
                  <video
                    src={item.videoUrl}
                    controls
                    className="mt-2 max-w-full h-auto"
                  />
                )}
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAdminAuth(MediaPostForm);
