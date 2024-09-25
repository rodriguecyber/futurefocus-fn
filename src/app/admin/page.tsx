"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import withAdminAuth from "@/components/withAdminAuth";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { toast } from "react-toastify";

export interface MediaItem {
  _id: string;
  type: "image" | "video";
  url: string; // Image URL or Video Thumbnail URL
  content: string;
  videoUrl?: string;
}

const MediaPostForm: React.FC = () => {
  const [formData, setFormData] = useState<MediaItem>({
    _id: "",
    type: "image",
    url: "",
    content: "",
    videoUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  useEffect(() => {
    if (editingItemId) {
      const itemToEdit = mediaItems.find((item) => item._id === editingItemId);
      if (itemToEdit) {
        setFormData(itemToEdit);
      }
    } else {
      resetForm();
    }
  }, [editingItemId, mediaItems]);

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
        url: src,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("type", formData.type);
    data.append("content", formData.content);

  
    if (formData.type === "video" && formData.videoUrl) {
      data.append("videoUrl", formData.videoUrl);
    }

    const fileInput = fileInputRef.current;
    if (fileInput?.files?.[0]) {
      data.append("file", fileInput.files[0]);
    }

    try {
      let response;
      if (editingItemId) {
        response = await axios.put(
          `${API_BASE_URL}/media/${formData._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/media`, data, {
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
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred while uploading the file.");
      }
    } finally {
      setIsSubmitting(false);
      setEditingItemId(null);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItemId(item._id);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingItemId(id);
      await axios.delete(`${API_BASE_URL}/media/${id}`);
      fetchMediaItems();
    } catch (error) {
      console.error("Error deleting media item:", error);
    } finally {
      setDeletingItemId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      type: "image",
      url: "",
      content: "",
      videoUrl: "",
    });
    setEditingItemId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {editingItemId ? "Edit Media" : "Post Media"}
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
              Upload {formData.type === "image" ? "Image" : "Thumbnail"}
            </label>
            <input
              type="file"
              accept={formData.type === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="mt-1 block w-full"
              disabled={isSubmitting}
              ref={fileInputRef}
            />
          </div>
          {formData.type === "video" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                YouTube Video URL
              </label>
              <input
                type="text"
                name="videoUrl"
                value={formData.videoUrl || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isSubmitting}
                placeholder="https://www.youtube.com/watch?v=example"
              />
            </div>
          )}
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
              {isSubmitting
                ? "Submitting..."
                : editingItemId
                ? "Update"
                : "Submit"}
            </button>
            {editingItemId && (
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
      </div>

      <div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Media Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item._id}
              className="border border-gray-300 p-4 rounded-lg shadow-sm"
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.content}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
              ) : (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={item.url}
                    alt={item.content}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                </a>
              )}
              <p className="text-sm text-gray-700 mb-2">{item.content}</p>
              <div className="text-right space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  disabled={
                    editingItemId === item._id || deletingItemId === item._id
                  }
                >
                  {editingItemId === item._id ? "Editing..." : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className={`px-3 py-1 text-sm text-white ${
                    deletingItemId === item._id
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md focus:outline-none`}
                  disabled={deletingItemId === item._id}
                >
                  {deletingItemId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default withAdminAuth(MediaPostForm);
