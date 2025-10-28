import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router'; 
import { EmployerRegComponent } from '../employer-reg/employer-reg.component';
import { JobSeekerRegister } from '../job-seeker-register/job-seeker-register.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet,EmployerRegComponent,JobSeekerRegister],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

 pageJobSeeker: boolean | null  = null;

constructor(private router:Router) {
 

}
ngOnInit() {  //if page reeload 
    const currentUrl = this.router.url;
    if (currentUrl.includes('/register/employer')) {
      this.pageJobSeeker = false;
    } else {
      this.pageJobSeeker = true;
    }
     document.body.style.overflow = 'hidden'; 
  }

onJobSeeker() {
  this.pageJobSeeker = true;
  this.router.navigate(['/register/jobseeker']);
}

onEmployer() {
  this.pageJobSeeker = false;
  this.router.navigate(['/register/employer']); // ✅ fixed name
}
  GotoLogin(){
     this.router.navigate(['/login'])
  }
}
