import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { EmployerProfileComponent } from '../employer-profile/employer-profile.component';
import { EmployerDashboardComponent } from '../employer-dashboard/employer-dashboard.component';
import { EmployerJobsComponent } from '../employer-jobs/employer-jobs.component';
import { EmployerPostJobComponent } from '../employer-post-job/employer-post-job.component';
import { EmployerApplicants } from '../employer-applicants/employer-applicants.component';
import { EmployerService } from '../employer-service.service';
import { Subscription } from 'rxjs';
import { JobSeekerNotification } from '../job-seeekr-notification';
import { NotificationForEmployer } from '../notification-for-employer';
@Component({
  selector: 'app-employer-layout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    EmployerProfileComponent,
    EmployerDashboardComponent,
    EmployerJobsComponent,
    EmployerPostJobComponent,
    EmployerApplicants,
    RouterOutlet
  ],
  templateUrl: './employer-layout.component.html',
  styleUrl: './employer-layout.component.css'
})
export class EmployerLayoutComponent implements OnInit {
  activeTab: string = '';
   imageProfile?:string ='../../assets/profile.png'
  employerName:string =''

  
employersNotifications:NotificationForEmployer[]=[]

showNotificiationIcon:boolean = false


   private subscription!: Subscription; // so that u can unsubscribe when no longer looking for subscription 
  constructor(private renderer: Renderer2,
              private employerService: EmployerService,
     private router: Router) {
    // Watch URL and update activeTab accordingly
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('/employerlayout/dashboard')) this.activeTab = 'dashboard';
        else if (url.includes('/employerlayout/postjob')) this.activeTab = 'postJob';
        else if (url.includes('/employerlayout/postedJobs')) this.activeTab = 'postedJobs';
        else if (url.includes('/employerlayout/applicants')) this.activeTab = 'applicants';
        else if (url.includes('/employerlayout/profile')) this.activeTab = 'profile';
        else if (url.includes('/employerlayout/info')) this.activeTab = 'info';
        else this.activeTab = '';
      }
    });
  }

  ngOnInit(): void {
    // Disable scroll
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
      this.refreshEmployerProfile();
   this.subscription = this.employerService.profileUpdated$.subscribe(updated => {
      if (updated) {
        console.log("Parent: Detected profile update");
        this.refreshEmployerProfile();
      }
    });

    this.fetchEmployerNotfication()
  }

 fetchEmployerNotfication(){
     
this.employerService.getNotification().subscribe(result =>{
  this.employersNotifications = result.notifications
  const number = result.unreadCount
  if(number>0){
this.showNotificiationIcon =true

  }
  else{
      const storedValue = localStorage.getItem('EmployerNotfication');
this.showNotificiationIcon = storedValue ? JSON.parse(storedValue) : false;
  }
  console.log('this.employersNotifications',  this.employersNotifications)
    console.log('number',  number)
})

 }
  GoToEmployerProfile(){
   this.showNotificiationIcon=false
    localStorage.setItem('EmployerNotfication',JSON.stringify(this.showNotificiationIcon))
    this.router.navigate(['employerlayout/profile'])
  }

  setActive(tab: string) {
    this.activeTab = tab;
    this.goToPage(this.activeTab);
  }

  goToPage(pageName: string) {
    if (pageName === 'dashboard') this.router.navigate(['/employerlayout/dashboard']);
    else if (pageName === 'postJob') this.router.navigate(['/employerlayout/postjob']);
    else if (pageName === 'postedJobs') this.router.navigate(['/employerlayout/postedJobs']);
    else if (pageName === 'applicants') this.router.navigate(['/employerlayout/applicants']);
    else if (pageName === 'profile') this.router.navigate(['/employerlayout/profile']);
    else if (pageName === 'info') this.router.navigate(['/employerlayout/info']);
  }
  thisgotProfile(){
    this.router.navigate(['/employerlayout/profile'])
  }
  refreshEmployerProfile() {
  this.employerService.getEmployerProfile().subscribe(result => {
    this.employerName = result.personName;
    this.imageProfile = result.profileImg ;
  });
}

goToLoginPage(){
  this.router.navigate(['/login'])
  localStorage.setItem('token','')
  localStorage.setItem('activeTab','');
  localStorage.setItem('SubScheduleTab','');
  localStorage.setItem('subActive','');
}

 ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
