import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ParTimeComponent } from './par-time/par-time.component';
import { EmployerRegComponent } from './employer-reg/employer-reg.component';
import { JobSeekerRegister } from './job-seeker-register/job-seeker-register.component';
import { RegisterComponent } from './register/register.component';
import { EmployerLayoutComponent } from './employer-layout/employer-layout.component';
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component';
import { EmployerJobsComponent } from './employer-jobs/employer-jobs.component';
import { EmployerPostJobComponent } from './employer-post-job/employer-post-job.component';
import { EmployerProfileComponent } from './employer-profile/employer-profile.component';
import { EmployerApplicants } from './employer-applicants/employer-applicants.component';
import { JobSeekerLayoutComponent } from './job-seeker-layout/job-seeker-layout.component';
import { JobSeekerDashBoardComponent } from './job-seeker-dash-board/job-seeker-dash-board.component';
import { JobSeekerJobsComponent } from './job-seeker-jobs/job-seeker-jobs.component';
import { JobSeekerInboxComponent } from './job-seeker-inbox/job-seeker-inbox.component';
import { JObSeekerAppliedComponent } from './job-seeker-applied/job-seeker-applied.component';
import { JObSeekerCalendarComponent } from './job-seeker-calendar/job-seeker-calendar.component';
import { JobPostMapComponent } from './job-post-map/job-post-map.component';
import { JobSeekerProfileComponent } from './job-seeker-profile/job-seeker-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmployerAuthGuard } from './guards/employer-auth.guard';
import { JobseekerAuthGuard } from './guards/jobseeker-auth.guard';
export const routes: Routes = [
  { path: '',
     redirectTo: '/login',
      pathMatch: 'full'
     },
  { path: 'login',
     component: LoginComponent 
  },{
path:'forgotPassword',
component:ForgotPasswordComponent
  },

   { path: 'jobSearch',
     component: ParTimeComponent 
    },
    {
    path: 'register',
    component: RegisterComponent,  // parent route's component
    children: [
        {
      path: '',
      redirectTo: 'jobseeker',
      pathMatch: 'full'  //default goes to jobseeker
    },
      {
        path: 'employer',
        component: EmployerRegComponent
      },
      {
        path: 'jobseeker',
        component: JobSeekerRegister
      }
    ]
  },
  {
  path: 'employerlayout', ///employerlayout is given to it after login registration
  component: EmployerLayoutComponent,
  canActivate: [EmployerAuthGuard],
     canActivateChild: [EmployerAuthGuard], // parent layout
  children: [
    {
       path: '',
       redirectTo: 'postjob', 
       pathMatch: 'full' },
    {
       path: 'dashboard',
       component: EmployerDashboardComponent
       },
    { 
      path: 'postedJobs',
       component: EmployerJobsComponent 
      },
    { 
      path: 'postjob', 
      component: EmployerPostJobComponent
     },
    {
       path: 'profile',
        component: EmployerProfileComponent 
    },
    {
      path:'applicants',
      component:EmployerApplicants
    }
  ]
},
{
    path: 'jobSeekerlayout',
    component:JobSeekerLayoutComponent,
      canActivate: [JobseekerAuthGuard],
     canActivateChild: [JobseekerAuthGuard],
      children: [
    {
       path: '',
       redirectTo: 'dashboard', 
       pathMatch: 'full' },
    {
       path: 'dashboard',
       component: JobSeekerDashBoardComponent
       },
    { 
      path: 'available-jobs',
       component: JobSeekerJobsComponent
      },
       { 
      path: 'inbox-jobs',
       component: JobSeekerInboxComponent
      },
       { 
      path: 'applied-jobs',
       component: JObSeekerAppliedComponent
      },
       { 
      path: 'calendar',
       component: JObSeekerCalendarComponent
      },
       { 
      path: 'jobpostlocation',
       component: JobPostMapComponent
      },
      {
         path: 'jobSeekerProfile',
       component: JobSeekerProfileComponent
      }
   
   
  ]
}




 
];
