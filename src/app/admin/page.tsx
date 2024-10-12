"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import withAdminAuth from "@/components/withAdminAuth";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { toast } from "react-toastify";
import { fetchUser, getLoggedUserData } from "@/context/adminAuth";
import { IUser } from "@/types";
import { hasPermission } from "@/config/hasPermission";

export interface MediaItem {
  _id: string;
  type: "image" | "video";
  url: string;
  content: string;
  videoUrl?: string;
}
interface YotubeV{
  _id:string,
  url:string,
  type:string
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
  const [userData, setUserData] = useState<IUser | null>(null);
  const [url,setUrl] = useState('')
  const [type,setType] = useState('video')
  const [videos,setVideos] = useState<YotubeV[]>([])
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
 const handledelateYoutube = async (id:string) => {
   try {
    setDeletingItemId(id);
    await  axios.delete(`${API_BASE_URL}/media/youtube/${id}`)

     toast.success('deleted succfully')
     fetchYoutube()
   } catch (error) {
    toast.error('error deleting youtube')
   }finally{
      setDeletingItemId(null);
   }
 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mediaResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/media`),
          fetchUser(),
        ]);
        setMediaItems(mediaResponse.data);
        setUserData(getLoggedUserData()); 
      } catch (error) {
      }
    };
    fetchData();
    fetchYoutube()
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
const handleAdd=async()=>{
try {
  const response = await axios.post(`${API_BASE_URL}/media/youtube`,{
    type,url
  });
  toast.success(response.data.message)
} catch (error) {
  toast.error('failed try again')
}
}

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
      
        //@ts-expect-error rr
        setMediaItems();
        resetForm();
      } else {
       
      }
    } catch (error) {
 
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
      //@ts-expect-error rr
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
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Post youtube video</h1>
        <div className="space-y-4">
          <input
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            type="text"
            placeholder="youtube link"
          />
          <select
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            name="type"
            id=""
          >
            <option value="vieo">video</option>
            <option value="beat">beat</option>
          </select>
          <button
            className={`inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              !hasPermission(userData as IUser, "media", "create")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => handleAdd()}
          >
            Post
          </button>
        </div>
      </div>
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
                isSubmitting ||
                !hasPermission(userData as IUser, "media", "create")
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={
                isSubmitting ||
                !hasPermission(userData as IUser, "media", "create")
              }
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
                  className={`px-3 py-1 text-sm text-white ${
                    !hasPermission(userData as IUser, "media", "update")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 rounded-md hover:bg-blue-600"
                  } focus:outline-none`}
                  disabled={
                    editingItemId === item._id ||
                    deletingItemId === item._id ||
                    !hasPermission(userData as IUser, "media", "update")
                  }
                >
                  {editingItemId === item._id ? "Editing..." : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className={`px-3 py-1 text-sm text-white ${
                    deletingItemId === item._id
                      ? "bg-red-400 cursor-not-allowed"
                      : !hasPermission(userData as IUser, "media", "delete")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md focus:outline-none`}
                  disabled={
                    deletingItemId === item._id ||
                    !hasPermission(userData as IUser, "media", "delete")
                  }
                >
                  {deletingItemId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
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
                  src={`https://www.youtube.com/embed/${new URL(item.url).searchParams.get("v")}`} 
                  title={item.type} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
              <div className="text-right space-x-2">
                <button
                  onClick={() => handledelateYoutube(item._id)}
                  className={`px-3 py-1 text-sm text-white ${
                    deletingItemId === item._id
                      ? "bg-red-400 cursor-not-allowed"
                      : !hasPermission(userData as IUser, "media", "delete")
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } rounded-md focus:outline-none`}
                  disabled={
                    deletingItemId === item._id ||
                    !hasPermission(userData as IUser, "media", "delete")
                  }
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
