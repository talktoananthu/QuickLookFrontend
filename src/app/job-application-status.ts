export interface JobApplicationStatus {

     jobId: string;
  jobTitle: string;
  jobImage?: string;
  employerName: string;
  employerPhoneNumber: string;
  employerImgUrl?: string;
  businessName?: string;
  AppliedDate:string
  StatusApplied: 'pending' | 'accepted' | 'rejected';
}
