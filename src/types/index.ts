export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
}
