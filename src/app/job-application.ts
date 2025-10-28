import { Schedule } from "./schedule";

export interface JobApplication {
                 // MongoDB document id (optional on frontend)
  jobPostId: string;       // reference to job post
  jobSeekerId: string;     // reference to job seeker (user)
  appliedDate: string;     // ISO date string when applied
  status: 'pending' | 'accepted' | 'rejected';  // default = "pending"
  schedules: Schedule[]; 
  amount:string
}
