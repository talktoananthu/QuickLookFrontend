import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployerDetails } from './employer-details';
import { LoginResponse } from '../app/login-response';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JobPost } from './job-post';
import { EmployerProfile } from './employer-profile';
import { ApplicantsDetails } from './applicants-details';
import { Schedule } from './schedule';
import { NotificationForEmployer } from './notification-for-employer';

interface SuccessMessageRest{
    message:string,
    email:string
}
interface Sucess{
  message:string
}
interface NotficationData{
   notifications :NotificationForEmployer[]
   unreadCount:number
}
@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  employePutDataUrl = 'https://quicklookbackendserver.onrender.com';
    

  loginEmployerUrl= 'https://quicklookbackendserver.onrender.com'

  gotoEmployerProfileUrl='https://quicklookbackendserver.onrender.com'

  postingJobUrl= 'https://quicklookbackendserver.onrender.com'

 updatePostedJob = 'https://quicklookbackendserver.onrender.com'

  gettingPostedJobs='https://quicklookbackendserver.onrender.com'

   getEMPLOYERProfile= 'https://quicklookbackendserver.onrender.com'

   
   updateEmployerProf = 'https://quicklookbackendserver.onrender.com'

   getDetailsofAppliedApplicants = 'https://quicklookbackendserver.onrender.com'

   hiredOrRejectApplicant = 'https://quicklookbackendserver.onrender.com'

  assignScheduleApplicant = 'https://quicklookbackendserver.onrender.com'

assingAttendanceForApplicant= 'https://quicklookbackendserver.onrender.com'

assignPayment='https://quicklookbackendserver.onrender.com'

 getNotificationForEmployer='https://quicklookbackendserver.onrender.com'

makeEmployerNotificationTrue='https://quicklookbackendserver.onrender.com'
 resetPassword='https://quicklookbackendserver.onrender.com'


deleteNotificationId='https://quicklookbackendserver.onrender.com'


    private profileUpdatedSource = new BehaviorSubject<boolean>(false)
     //so that it is not accessible ny other component to change value with  profileUpdatedSource.next() method   

     profileUpdated$ = this.profileUpdatedSource.asObservable();
 
     
  constructor(private http: HttpClient) {

   }

//notification for employers

  getNotification(){
    console.log('this is jobsseker get notification')

    return this.http.get<NotficationData>(`${this.getNotificationForEmployer}/getNotificationForEmployer`)
  }

 makeNotificationtrue(){
    console.log('this is make Employer Notitfication true')
       return this.http.get<Sucess>(`${this.makeEmployerNotificationTrue}/makeEmployerNotificationTrue`)
  }

   deletenotification(userId:string,NotId:Date){
 return this.http.put<Sucess>(`${this.deleteNotificationId}/deleteNotificationForEmployer`,{userId,NotId})
  }

 //for registration of employer
   storeEmployData(employerData:EmployerDetails){
 return    this.http.post<EmployerDetails>(`${this.employePutDataUrl}/addEmploy`,employerData)
    
   
    }

    //login for employer
      loginToEmployer(email: string, password: string): Observable<LoginResponse> {
       
  const employerData = {
    emailId: email,
    passwordId: password
  };
     console.log('Inside the employer service',employerData)
  return this.http.post<LoginResponse>(`${this.loginEmployerUrl}/login`, employerData);
}

  //navigating to employer Profile
goToEmployerProfile(): Observable<any>{
  console.log('this employerService')
    return  this.http.get<any>(`${this.gotoEmployerProfileUrl}/employerProfile`)
}


//for posting a job of employer
    PostingJob(PostedJobDetails:FormData){
    return   this.http.post<Sucess>(`${this.postingJobUrl}/employerPost`,PostedJobDetails)
    }

    //getting posted jobs

    getPostedJobDetails(){
      return this.http.get<JobPost[]>(`${this.gettingPostedJobs}/postedJobs`)
    }

      updatePostJob(updateJobDetails:JobPost){
         console.log('this update Post job Service')
            return this.http.put<JobPost[]>(`${this.updatePostedJob}/updatePostedJob`,updateJobDetails)
     }
    getEmployerProfile(): Observable<EmployerProfile> {
  console.log('this employer profile service');
  return this.http.get<any>(`${this.getEMPLOYERProfile}/getEmpProfile`)
    .pipe(
      map(response => response.result) // Extract only the actual profile object
    );

}
   updateEmployerProfile(employerUpdatedData:FormData){
   return  this.http.put(`${this.getEMPLOYERProfile}/updateEmpProfile`,employerUpdatedData)
   }

  notifyProfileUpdated(value: boolean) {
    this.profileUpdatedSource.next(value);
  }

   getAppliedApplicants(){
       return this.http.get<ApplicantsDetails[]>(`${this.getDetailsofAppliedApplicants}/getApplicantsDetails`)
   }

   hireApplicants(applicantId:string,JobPostId:string){
    console.log('this is hired')
       const StatusDetails = {
 statusVal :'accepted',
 applicantsDetialsId:applicantId,
 applicantJobPostId:JobPostId
    }
       return this.http.put(`${this.hiredOrRejectApplicant}/hiredOrRejectApplicant`,StatusDetails)
   }
   rejectApplicants(applicantId:string,JobPostId:string){
    const StatusDetails = {
 statusVal :'rejected',
 applicantsDetialsId:applicantId,
 applicantJobPostId:JobPostId
    }
     
return this.http.put(`${this.hiredOrRejectApplicant}/hiredOrRejectApplicant`,StatusDetails)
  }


assignScheduleRaw(data: { applicantDetailId: string; JobPostDetailsId: string; schedules: Schedule[] }) {
  return this.http.put(`${this.assignScheduleApplicant}/assignedScehdulesToApplicant`,  data);
}
 
givePresentAttedance(ApplicantId:string,JobPostId:string,scheduleDate:string,attedanceStatus:string){
    const dataApplicant ={
      applicantId:ApplicantId,
      jobPostId:JobPostId,
      scheduleDate:scheduleDate,
      attendance:attedanceStatus
    }
    console.log('this is givePresentAttedance ',dataApplicant)
   return this.http.put(`${this.assingAttendanceForApplicant}/assignAttendanceToApplicant`,dataApplicant)
}


updatePayment(JobApplicant:string,JobPostId:string,Date:string){
const updatePayment ={
  jobApplicant:JobApplicant,
  jobPostId:JobPostId,
  date:Date,
  payStatus:"paid"
}
  console.log('this is update Payment',updatePayment)
 return this.http.put(`${this.assingAttendanceForApplicant}/updatePaymentToApplicant`,updatePayment)
}


resetPasswordCall(email:string){  
   console.log('this is reset Password for jobseekerServie',email)
    return this.http.post<SuccessMessageRest>(`${this.resetPassword}/resetPasswordForEmployer`,{email});

}
CheckOtpForEmployer(otpNumber:number,email:string){
     console.log('this is Otp Check for job Seeker',{otpNumber})
    return this.http.post<Sucess>(`${this.resetPassword}/checkOtpForEmployer`,{otpNumber,email});
}
restNewPassword(email:string,password:string){
  console.log('email',email)
  console.log('password',password)
    return this.http.put<Sucess>(`${this.resetPassword}/SetNewPasswordForEmployer`,{email,password});
}



}
