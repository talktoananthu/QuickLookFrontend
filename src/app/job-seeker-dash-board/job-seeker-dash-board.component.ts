import { Component } from '@angular/core';
import { JobSeeker } from '../job-seeker';
import { JobSeekerService } from '../job-service.service';
import { JobApplicationStatus } from '../job-application-status';
import { JobseekerScheduleRow } from '../jobseeker-schedule-row';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-seeker-dash-board',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './job-seeker-dash-board.component.html',
  styleUrl: './job-seeker-dash-board.component.css'
})
export class JobSeekerDashBoardComponent {

 JobsApplied:JobApplicationStatus[]=[]

todayDate:string=''

SchedulesData:JobseekerScheduleRow[] = []
todaySchedulingData:JobseekerScheduleRow[] = []
//data variables
NoofJobsApplied:number=0
NoofJobsHired:number =0;
NoofSchedulesToday:number=0
MaxWorkingHourPerDay:number=0
    JobSeekerDetails: JobSeeker = {
      Name: '',
      emailId: '',
      password: '',
      confirmPassword: '',
      contactNumber: '',
      dateOfBirth: new Date(),
      Address: '',
      area: '',
      city: '',
      state: '',
      MaxHourPerDay: 0,
      ImageProfile: ''
    };

 constructor(
    private jobSeekerService: JobSeekerService,
   
  ){
this.fetchJobSeekerProfile()
this.getNumberOfJobsDetails()
this.callUpcomingSchedulesData()
 this.todayDate = new Date().toISOString().split('T')[0]; 

console.log('today', this.todayDate )

  }

    fetchJobSeekerProfile() {
    this.jobSeekerService.getJobSeekerProfileDetails().subscribe({
      next: (data: any) => {
        if (data.success && data.message && data.message.result) {
          this.JobSeekerDetails.Name = data.message.result.fullName;
          this.JobSeekerDetails.emailId = data.message.result.email;
          this.JobSeekerDetails.dateOfBirth = data.message.result.dateOfBirth;
          this.JobSeekerDetails.Address = data.message.result.address;
this.JobSeekerDetails.contactNumber = data.message.result.contactNumber;
          this.JobSeekerDetails.area = data.message.result.area;
          this.JobSeekerDetails.city = data.message.result.city;
          this.JobSeekerDetails.state = data.message.result.state;
          this.JobSeekerDetails.PreferJob = data.message.result.preferredJobTypes;
          this.JobSeekerDetails.Skills = data.message.result.skills;
          this.JobSeekerDetails.MaxHourPerDay = data.message.result.MaxHourPerDay;
this.JobSeekerDetails.ImageProfile = data.message.result.ImageProfile
          //  Patch fetched data into the form
         
          console.log('Job Seeker Deta ils:', this.JobSeekerDetails);
          this.MaxWorkingHourPerDay = data.message.result.MaxHourPerDay;
        } else {
          console.warn('No profile found');
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

getNumberOfJobsDetails(){
this.jobSeekerService.gettingAppliedJobStatus().subscribe(result =>{
      console.log('result ')
      this.JobsApplied = result.data
     this.JobsApplied.forEach(data=>{
        if(data.StatusApplied =='accepted'){
          this.NoofJobsHired +=1
        }
     })
     this.NoofJobsApplied = this.JobsApplied.length
     console.log('No of jobs hired', this.NoofJobsHired)
      console.log('result ', this.JobsApplied)
     
    })
}
callUpcomingSchedulesData(){
  this.jobSeekerService.getJobSeekerSchedules().subscribe((resu:any)=>{
       console.log('raw result', resu);
this.SchedulesData = resu.data
  .filter((item: any) => item.schedules && item.schedules.length > 0)
   //  remove empty ones first other wise error will show if Schedules are mepty or null
  .map((item: any) => ({
    jobId: item.jobId,
    jobTitle: item.jobTitle,
    businessName: item.businessName,
    jobImage: item.jobImage,
    employerName: item.employerName,
    employerPhoneNumber: item.employerPhoneNumber,
    employerImgUrl: item.employerImgUrl,
    schedules: item.schedules
  }));

  console.log('this.SchedulesData ',this.SchedulesData )
 this.calculatingTodaySchedules(this.SchedulesData)


  })


}
//calculating if schedules 
calculatingTodaySchedules(schedulesDataDetails:JobseekerScheduleRow[]){
   console.log('this is schedules',schedulesDataDetails)
this.todaySchedulingData = schedulesDataDetails
  .filter(job => job.schedules.some(schedule => schedule.date === this.todayDate && schedule.Schedulestatus === 'accepted'))
  .map(job => ({
    ...job,
    schedules: job.schedules.filter(schedule => schedule.date === this.todayDate && schedule.Schedulestatus === 'accepted')
  }));

  this.todaySchedulingData.forEach(obj=>{
      obj.schedules.forEach(data=>{
        this.NoofSchedulesToday +=1
      })
  })
  console.log('this.NoofSchedulesToday',this.NoofSchedulesToday)
console.log('this.todaySchedulingData  ',this.todaySchedulingData )


}
calculateHours(startTime: string, endTime: string): string {
  // Convert "HH:MM AM/PM" to Date objects
  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  // Calculate difference in minutes
  let diffMinutes = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);
  if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight shifts

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return minutes === 0 ? `${hours}hr` : `${hours}hr ${minutes}m`;
}


  }
    
