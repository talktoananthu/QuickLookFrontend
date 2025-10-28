import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSeekerDashBoardComponent } from '../job-seeker-dash-board/job-seeker-dash-board.component';
import { JobSeekerJobsComponent } from '../job-seeker-jobs/job-seeker-jobs.component';
import { RouterOutlet ,Router,NavigationEnd}  from '@angular/router';
import { EmployerService } from '../employer-service.service';
import { JobSeekerService } from '../job-service.service';
import { JobSeekerInboxComponent } from '../job-seeker-inbox/job-seeker-inbox.component';
import { JObSeekerAppliedComponent } from '../job-seeker-applied/job-seeker-applied.component';
import { JObSeekerCalendarComponent } from '../job-seeker-calendar/job-seeker-calendar.component';
import { JobPostMapComponent } from '../job-post-map/job-post-map.component';
import { JobSeekerProfileComponent } from '../job-seeker-profile/job-seeker-profile.component';
import { JobSeeker } from '../job-seeker';
import { JobSeekerNotification } from '../job-seeekr-notification';

@Component({
  selector: 'app-job-seeker-layout',
  standalone: true,
  imports: [FormsModule, CommonModule, JobSeekerDashBoardComponent,
     JobSeekerJobsComponent,JObSeekerCalendarComponent,
     JobSeekerInboxComponent,
     JObSeekerAppliedComponent,
   JobPostMapComponent,
   JobSeekerProfileComponent,
      RouterOutlet],
  templateUrl: './job-seeker-layout.component.html',
  styleUrl: './job-seeker-layout.component.css'
})
export class JobSeekerLayoutComponent  implements OnInit{

   imageProfile?:string ='../../assets/profile.png'
jobSeekerName:string =''
  activeTab:string=''

  JobSeekerNotifcations:JobSeekerNotification[] =[]

showNotificationIcon:boolean = false;


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
    constructor(private renderer: Renderer2,
                 private jobSeekerService: JobSeekerService,
        private router: Router) {
       // Watch URL and update activeTab accordingly
       this.router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
           const url = event.urlAfterRedirects;
           if (url.includes('/jobSeekerlayout/dashboard')) this.activeTab = 'dashboard';
           else if (url.includes('/jobSeekerlayout/available-jobs')) this.activeTab = 'available-jobs';
          else if (url.includes('/jobSeekerlayout/inbox-jobs')) this.activeTab = 'inbox-jobs';
          else if (url.includes('/jobSeekerlayout/applied-jobs')) this.activeTab = 'applied-jobs';
          else if (url.includes('/jobSeekerlayout/calendar')) this.activeTab = 'calendar';
          else if (url.includes('/jobSeekerlayout/jobpostlocation')) this.activeTab = 'jobpostlocation';
          else if (url.includes('/jobSeekerlayout/jobSeekerProfile')) this.activeTab = 'profile';
          else this.activeTab = '';
         }
       });
     }
  ngOnInit() {
     this.refreshJobSeekerProfile()
     this.fetchJobSeekerNotfication()

 

  }

 fetchJobSeekerNotfication(){
     
this.jobSeekerService.getNotification().subscribe(result =>{
  this.JobSeekerNotifcations = result.notifications
  const number = result.unreadCount
   if(number>0){
    this.showNotificationIcon =true;
   }
   else{
    const storedValue = localStorage.getItem('NotifcationForJObSeeker');
this.showNotificationIcon = storedValue ? JSON.parse(storedValue) : false;
   }
  console.log('this.JobSeekerNotifcations',  this.JobSeekerNotifcations)
    console.log('number',  number)
})

 }

 GotoProfile(){

  this.router.navigate(['/jobSeekerlayout/jobSeekerProfile'])
   this.showNotificationIcon =false
   localStorage.setItem('NotifcationForJObSeeker',JSON.stringify(this.showNotificationIcon))
 }

       setActive(tab: string) {
    this.activeTab = tab;
    this.goToPage(this.activeTab);
  }

   goToPage(pageName: string) {
    if (pageName === 'dashboard') this.router.navigate(['/jobSeekerlayout/dashboard']);
    else if (pageName === 'available-jobs') this.router.navigate(['/jobSeekerlayout/available-jobs']);
    else if (pageName === 'inbox-jobs') this.router.navigate(['/jobSeekerlayout/inbox-jobs'])
    else if (pageName === 'applied-jobs') this.router.navigate(['/jobSeekerlayout/applied-jobs'])
  else if (pageName === 'calendar') this.router.navigate(['/jobSeekerlayout/calendar'])
else if (pageName === 'jobpostlocation') this.router.navigate(['/jobSeekerlayout/jobpostlocation'])
  else if (pageName === 'profile') this.router.navigate(['/jobSeekerlayout/jobSeekerProfile'])
  }
   refreshJobSeekerProfile() {
  this.jobSeekerService.getJobSeekerProfileDetails().subscribe({
      next: (data:any) => {
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
    
        } else {
          console.warn('No profile found');
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
}
  onChildActivate(componentRef: any) {
    if (componentRef.profileUpdated) {
      componentRef.profileUpdated.subscribe(() => {
        console.log('Profile updated in child!');
        this.refreshJobSeekerProfile();
      });
    }
  }
logOut(){
  localStorage.setItem('showSchedulesDiv','')
  this.router.navigate(['/login'])
localStorage.setItem('tokenJobSeeker','')
localStorage.setItem('JobSeekerId','')
localStorage.setItem('JObSeekerArea','')
localStorage.setItem('JObSeekerCity','')
localStorage.setItem('JObSeekerState','')
localStorage.setItem('JObSeekeraddress','')
}
}
