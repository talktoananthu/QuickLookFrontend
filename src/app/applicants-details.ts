import { ApplicantsLocation } from "./applicants-location";
import { Schedule } from "./schedule";

export interface ApplicantsDetails {
    applicantId:string,
    jobId:string,
    jobTitle:string,
    applicantName:string,
    applicantEmail:string,
    appliedDate:string,
    payment:string,
    imgProfile:string,
    contactNumber:string,
    applicationStatus:'pending' | 'accepted' | 'rejected',
    applicantDOB:string,
    applicantAddressLoc:ApplicantsLocation,
    applicantsPreferJObTypes?:string ,
     applicantSkills?:string 
     applicantsShiftStartTime:string,
      applicantsShiftEndTime:string,
      applicantJobType:string,
        schedules?: Schedule[];
}
