import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ParTimeComponent } from './par-time/par-time.component';
import { RegisterComponent } from './register/register.component';
import { EmployerRegComponent } from './employer-reg/employer-reg.component';
import { JobSeekerRegister } from './job-seeker-register/job-seeker-register.component';
import { EmployerProfileComponent } from './employer-profile/employer-profile.component';
import { EmployerLayoutComponent } from './employer-layout/employer-layout.component';
import { JobSeekerLayoutComponent } from './job-seeker-layout/job-seeker-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,LoginComponent,
    ParTimeComponent,
    RegisterComponent,
    EmployerRegComponent,
  JobSeekerRegister,
EmployerProfileComponent,
EmployerLayoutComponent,
JobSeekerLayoutComponent,
ForgotPasswordComponent

],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
   
})
export class AppComponent {
  title = 'FindQuick';
}
