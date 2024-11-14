export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface Video {
  url: string;
  title: string;
  type: string;
}
export interface Feature {
  _id: string;
  feature: string;
  web: string;
 
}

export interface Permission {
  _id: string;
  feature: Feature;
  permission: string;
}

export interface Role {
  _id: string;
  role: string;
  permission: Permission[];

}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: Role;
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
export interface TeamMember {
  _id: string;
  name: string;
  image: string;
  role: string;
  position: string;
  email: string;
  phone:string
  instagram: string;
  isAdmin:boolean
}