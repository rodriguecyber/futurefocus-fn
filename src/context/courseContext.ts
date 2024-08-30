// services/CourseService.ts
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";

export interface Course {
  _id?: string;
  title: string;
  image: string;
  rating: number;
}

export const getCourses = async () => {
  return await axios.get<Course[]>(`${API_BASE_URL}/course/`);
};

export const addCourse = async (course: Course) => {
  return await axios.post<Course>(`${API_BASE_URL}/course/new`, course);
};

export const updateCourse = async (id: string, course: Course) => {
  return await axios.put<Course>(
    `${API_BASE_URL}/course/update/${id}`,
    course
  );
};

export const deleteCourse = async (id: string) => {
  return await axios.delete(`${API_BASE_URL}/course/delete/${id}`);
};
