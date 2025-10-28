export interface NotificationForEmployer {
      jobSeekerId: string;
employerId: string;
  message: string;      // e.g., "Dishwasher role: Accepted."
  status: string;       // "accepted" | "rejected"
  read: boolean;        // false by default
  createdAt: Date;
}
