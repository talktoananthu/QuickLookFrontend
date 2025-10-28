import { HttpClient } from '@angular/common/http';
import { Injectable ,} from '@angular/core';
import { JobSeeker } from './job-seeker';
import { BehaviorSubject, map, Observable, scheduled } from 'rxjs';
import { LoginJObSeeker } from './login-job-seeker';
import { JobSeekerProfile } from './job-seeker-profile';
import { JobPost } from './job-post';
import { NearByJobSeekerPost } from './near-by-job-seeker-post';
import { JobApplication } from './job-application';
import { Schedule } from './schedule';
import { JobseekerScheduleRow } from './jobseeker-schedule-row';
import { JobApplicationStatus } from './job-application-status';
import { EmployerApplicants } from './employer-applicants/employer-applicants.component';
import { JobSeekerNotification } from './job-seeekr-notification';
interface JobApplicationStatusResponse {
  message: string;
  data: JobApplicationStatus[];
}

interface SuccessMessageRest{
    message:string,
    email:string
}
interface Sucess{
  message:string
}


interface NotficationData{
   notifications :JobSeekerNotification[]
   unreadCount:number
}
@Injectable({
  providedIn: 'root'
})


export class JobSeekerService {

   postJobSeekerUrl='https://quicklookbackendserver.onrender.com'

   loginJObSeekerUrl= 'https://quicklookbackendserver.onrender.com'
   
   getJobSeekerProfileUrl ='https://quicklookbackendserver.onrender.com'

  getNearPostedJObs =  'https://quicklookbackendserver.onrender.com'


  storeJobSeekerProfileUrl= 'https://quicklookbackendserver.onrender.com'


  getNearByJObsUrl = 'https://quicklookbackendserver.onrender.com'

 applicationsApiUrl ='https://quicklookbackendserver.onrender.com'

 getScheduleurls = 'https://quicklookbackendserver.onrender.com'

 changeSchedulesStatusUrl= 'https://quicklookbackendserver.onrender.com'

 getAppliedJobStatus='https://quicklookbackendserver.onrender.com'
 
 updateJobSeekerProfile='https://quicklookbackendserver.onrender.com'

 resetPassword='https://quicklookbackendserver.onrender.com'

 getNotficationForJobSeeker='https://quicklookbackendserver.onrender.com'

 makeJobSeekerNotificationTrue='https://quicklookbackendserver.onrender.com'

  deleteNotificationId='https://quicklookbackendserver.onrender.com'

  constructor(private http: HttpClient) { 

  }
 
   //login to corresponding user 
 
  getNotification(){
    console.log('this is jobsseker get notification')

    return this.http.get<NotficationData>(`${this.getNotficationForJobSeeker}/getNotficationForJobSeeker`)
  }

  makeNotificationtrue(){
    console.log('this is make JobSeeekr Notitfication true')
       return this.http.get<Sucess>(`${this.makeJobSeekerNotificationTrue}/makeJobSeekerNotificationTrue`)
  }

  deletenotification(userId:string,NotId:Date){
 return this.http.put<Sucess>(`${this.deleteNotificationId}/deleteNotificationForJobSeeker`,{userId,NotId})
  }

  storeJobSeekerData(userData:JobSeeker) {
    console.log('JobseekerData',userData)
  return  this.http.post<JobSeeker>(`${this.postJobSeekerUrl}/addJobSeekerData`,userData)
  }

  loginToJobSeeker(email :string,password:string){
    const jobSeekerdata = {
  emailId: email,
    passwordId: password
    }
    return   this.http.post<LoginJObSeeker>(`${this.postJobSeekerUrl}/loginJobSeeker`,jobSeekerdata)
  }

  getJobSeekerProfile(){
    console.log('this JobSeekerProfile')
    return   this.http.get<any>(`${this.getJobSeekerProfileUrl}/JobSeekerProfile`)
  }

  //getting the users and storing it for Jobseeker Layout Profile Details
  StoreJobSeekerProfile(){
     console.log('Storing Job Seekers')
      return   this.http.get<any>(`${this.storeJobSeekerProfileUrl}/storeJobSeekerProfile`).pipe(
            map(response => response.result) // Extract only the actual profile object
          );
  }

  //getting available Jobs NearbY
   getPostedJobsForJobSeeker(locationData: any){
    console.log('this is job service for Job Seekers')
      return   this.http.post<NearByJobSeekerPost[]>(`${this.getNearPostedJObs}/JobSeekerAvailableJobs`,locationData)
  }

  sentApplication(applicationData:JobApplication){
    console.log('senting application....')
        
      return this.http.post(`${this.applicationsApiUrl}/JobSeekerApplication`,applicationData)
  }

  getJobSeekerSchedules(){

   return this.http.get<JobseekerScheduleRow[]>(`${this.getScheduleurls}/getSchedules`)

  } 

  GiveStatustoScheudles(scheduleDate:string,jobId:string,statusSchedules:string,startTime:string,endTime:string){
     const data = {
      scheduledDate :scheduleDate,
      jobPostId:jobId,
      statusofSchedules:statusSchedules,
      startTime:startTime,
      endTime:endTime
     }
    return this.http.put(`${this.changeSchedulesStatusUrl}/statusSchedules`,data)
  }
gettingAppliedJobStatus() {
  console.log('this is gettingAppliedJobStatus');
  return this.http.get<JobApplicationStatusResponse>(`${this.getAppliedJobStatus}/gettingAppliedJobStatus`);
}

getJobSeekerProfileDetails(){
   console.log('this is JobSeekerProfile');
     return   this.http.get<JobSeeker>(`${this.getJobSeekerProfileUrl}/JobSeekerProfileDetails`)
}

updateProfileDetailJobSeeeker(jobSeekerUpdatedData: FormData) {
  console.log('This is updateProfileJobSeeker:');

  // Iterate over FormData entries to print actual keys and values
     jobSeekerUpdatedData.forEach((value, key) => {
  console.log(key, value);
});

  return this.http.put(`${this.getJobSeekerProfileUrl}/updateJobSeekerProfile`, jobSeekerUpdatedData);
}

resetPasswordCall(email:string){  
   console.log('this is reset Password for jobseekerServie',email)
    return this.http.post<SuccessMessageRest>(`${this.resetPassword}/resetPasswordForJobSeeker`,{email});

}
CheckOtpForJobSeeker(otpNumber:number,email:string){
     console.log('this is Otp Check for job Seeker',{otpNumber})
    return this.http.post<Sucess>(`${this.resetPassword}/checkOtpForJobSeeker`,{otpNumber,email});
}
restNewPassword(email:string,password:string){
  console.log('email',email)
  console.log('password',password)
    return this.http.put<Sucess>(`${this.resetPassword}/SetNewPasswordForJobSeeker`,{email,password});
}

}
