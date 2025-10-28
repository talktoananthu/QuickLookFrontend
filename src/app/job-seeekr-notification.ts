export interface JobSeekerNotification {

      jobSeekerId: string;
  jobPostId: string;
  message: string;      // e.g., "Dishwasher role: Accepted."
  status: string;       // "accepted" | "rejected"
  read: boolean;        // false by default
  createdAt: Date;
}
