import { Schedule } from "./schedule";

export interface JobseekerScheduleRow {

       schedules: Schedule[];          // Work details
  jobId: string;
  jobTitle: string;
  jobImage?: string;
  employerName: string;
  employerPhoneNumber: string;
  employerImgUrl?: string;
  businessName?: string;

}
