import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployerService } from '../employer-service.service';
import { ApplicantsDetails } from '../applicants-details';
import { JobPost } from '../job-post';
import { Schedule } from '../schedule';
import { EmployerProfile } from '../employer-profile';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './employer-dashboard.component.html',
  styleUrl: './employer-dashboard.component.css'
})
export class EmployerDashboardComponent {


  //Variables--------------------------- 

calculateTodaysDate:string=''

applicantsDetails:ApplicantsDetails[] =[]
NofApplicantsSchedulesToday:ApplicantsDetails[] = []
acceptedApplicants:ApplicantsDetails[] =[]

employerProfileDetails: EmployerProfile = {} as EmployerProfile;


AvailablePostedJobs:JobPost [] = []

numberOfHiredApplicants:number=0;
numberOfPostedJobs:number=0;
numberOfApplicantsApplied:number=0;
numberOfStaffWorkingToday:number=0;
  //Variables  End--------------------------- 


 constructor(private employerService: EmployerService){


this.fetchEmployerProfileDetails()
    this.fetchApplicantDetails()//fetching the details of All applicants and their schedules
    this.fetchAllPostedJobs()//fetching all the job posted by the employer
       const today = new Date();
  
  // Format it as YYYY-MM-DD
  this.calculateTodaysDate = today.toISOString().split('T')[0];
 }


fetchEmployerProfileDetails(){
    this.employerService.getEmployerProfile().subscribe((result:any)=>{
      console.log('result employerProfileDetails',result)
      this.employerProfileDetails.personName = result.personName
        this.employerProfileDetails.profileImg = result.profileImg || '../../assets/profile.png';
      
    })
console.log('this.employerProfileDetails',this.employerProfileDetails)
}



fetchApplicantDetails(){
  this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
        console.log(' Applicants Details',this.applicantsDetails)
        this.numberOfApplicantsApplied = this.applicantsDetails.length
        console.log("No of Applicants Applied",this.numberOfApplicantsApplied)
//fetching the details of All applicants and their schedules
           this.filterUpcomingAcceptedApplicants();
        
    })
}



fetchAllPostedJobs(){
     this.employerService.getPostedJobDetails().subscribe(result=>{
           if (result){
             this.AvailablePostedJobs = result
             this.numberOfPostedJobs = this.AvailablePostedJobs.length
             console.log('No of AvailablePostedJobs',  this.AvailablePostedJobs)
              console.log('No of Posted Jobs',  this.numberOfPostedJobs)
            }
          else{
            this.AvailablePostedJobs = []
          }  
 })
}



 filterUpcomingAcceptedApplicants() {
  // Filter only accepted applicants
  this.acceptedApplicants = this.applicantsDetails
    .filter(a => a.applicationStatus?.trim().toLowerCase() === 'accepted');
    //number for storing number of accepted applicants
this.numberOfHiredApplicants =this.acceptedApplicants.length
  
  console.log('No of Accepted Applicants', this.acceptedApplicants.length);


 if(this.acceptedApplicants.length>0){
  this.noSchedulesWorkingToday(this.acceptedApplicants)
 }
 else{
  //There is no Accepted Applicants
 }

}
noSchedulesWorkingToday(applicantHired:ApplicantsDetails[]){

this.NofApplicantsSchedulesToday = applicantHired.map((result:ApplicantsDetails)=>{

   return{
    ...result,
    schedules :result.schedules?.filter(sche=> sche.date == this.calculateTodaysDate &&sche.Schedulestatus=='accepted')||[]
   }

}).filter(applicant=>applicant.schedules?.length>0);
console.log('this is NofApplicantsSchedulesToday',this.NofApplicantsSchedulesToday )

this.numberOfStaffWorkingToday = this.NofApplicantsSchedulesToday.length
}


}
