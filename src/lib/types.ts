import type { PlaceHolderImages } from "./placeholder-images";

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: "Requester" | "Helper";
};

export type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  budget: number;
  workers: number;
  requester: User;
  applicants: User[];
  image: (typeof PlaceHolderImages)[number]['id'];
  urgency: 'Emergency' | 'Same Day' | 'Flexible';
  distance: number;
};
