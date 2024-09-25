export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IUser extends Document {
  _id:string
  email: string;
  password: string;
  isSuperAdmin: Boolean;
  name: string;
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
export interface IFeature {
  _id: string;
  feature: string;
  web: "website" | "academic-portal";
  createdAt: string;
  updatedAt: string;
}

export interface IPermission {
  _id: string;
  feature: IFeature;
  permission: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  role: string;
  permission: IPermission[];
  createdAt: string;
  updatedAt: string;
}
