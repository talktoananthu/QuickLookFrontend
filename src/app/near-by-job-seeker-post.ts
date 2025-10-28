import { JobLocation } from "./job-location"
export interface NearByJobSeekerPost {
      jobPostId: string;
  jobTitle: string;
  businessName: string;
  jobCategory: string;
  jobType: string;
  location: JobLocation;
  description: string;
  image?: File | string;  // Accepts File when sending, string (URL) when receiving
  resumeNeed?: string;
  availabilty?: string;
  incomeType: string;
  amount: string;
  workingDays: string;
  startTime: string;
  endTime: string;
  applicantsRequired: number | string;
  hired: number | string;
  responsibilities: string[];
  requirements: string[];
  postedDay: Date | string;
  lastDay: Date | string;
  distance:number;
  applied?: boolean;
   locationCoordinates: {
    type: string; // 'Point'
    coordinates: [number, number]; // [lng, lat]
  };
}

