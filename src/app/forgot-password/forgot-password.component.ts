import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { EmployerService } from '../employer-service.service';
import { JobSeekerService } from '../job-service.service';
import { LoadingService } from '../loading.service';
import { Route, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router'; 
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

   admin:string[] = ['JobSeeker','Employer']


  selectedAdmin:string='JobSeeker'
//it si show otp working 
showOtpTyping:boolean=false

otpNumber: number | null = null; 

showResetPassword:boolean=false

password:string=''

confirmPassword:string=''

  resetForm!: FormGroup;

emailVal:string=''
  emailForm!: FormGroup;
   otpForm!: FormGroup
  dropdownOpen: boolean = false;
 constructor(private employerService:EmployerService,
   private jobseekerService:JobSeekerService,
    private fb: FormBuilder,
     public loadingService: LoadingService,
     private router:Router
     
 ){
    this.emailForm = this.fb.group({
      emailVal: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')
        ]
      ]
    });
          this.otpForm = this.fb.group({
    otpNumber: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{6}$') // 6-digit only
      ]
    ]
  });
this.resetForm = this.fb.group({
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', Validators.required]
}, { validators: this.passwordMatchValidator });

    this.showOtpTyping=false
 }
 
passwordMatchValidator: ValidatorFn = (group: AbstractControl): {[key: string]: any} | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
};

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

selectAdmin(type: string) {
  this.selectedAdmin = type;
  this.dropdownOpen = false;
}

//for passing the mail

CallResetPassword(){
  if(this.selectedAdmin=='JobSeeker'){
  console.log('this is job seeker')
  console.log('this is job seeker email',this.emailVal)
  this.loadingService.show();
this.jobseekerService.resetPasswordCall(this.emailVal).subscribe({
    
  next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
            this.showOtpTyping =true
  },
  error: (err) => {
    console.error('❌ Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
        this.emailVal = '';
  }
});
  
  }

  //for employer reset password
  if(this.selectedAdmin=='Employer'){
    console.log('this is employer')
     console.log('this is employer email',this.emailVal)
       console.log('this is job seeker email',this.emailVal)
  this.loadingService.show();
  this.employerService.resetPasswordCall(this.emailVal).subscribe({
      next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
            this.showOtpTyping =true
  },
  error: (err) => {
    console.error('❌ Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
        this.emailVal = '';
  }
  })
  }
}
isEmailValid(): boolean {
  if (this.selectedAdmin === 'JobSeeker') {
    // Must end with @gmail.com
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.emailVal);
  } else if (this.selectedAdmin === 'Employer') {
    // Must be valid work email (not gmail)
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(this.emailVal);
  }
  return false;
}

// Check if OTP is valid
isOtpValid() {
 return /^[0-9]{6}$/.test((this.otpNumber ?? '').toString());
}
   
//for entering otp
enterOtpNumber(){
  console.log('otpNumber',this.otpNumber)
  if(this.selectedAdmin=='JobSeeker'){
 this.loadingService.show();
   console.log('this is email of Jobseeker', this.emailVal)
this.jobseekerService.CheckOtpForJobSeeker(Number(this.otpNumber),this.emailVal).subscribe({
  next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
            this.showResetPassword =true
  },
  error: (err) => {
    console.error('❌ Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
     this.showResetPassword =false
        this.emailVal = '';
  }
  }
)
  }
  //below is for the employers
  else if(this.selectedAdmin=='Employer'){

     this.loadingService.show();
   console.log('this is email of Employer', this.emailVal)
this.employerService.CheckOtpForEmployer(Number(this.otpNumber),this.emailVal).subscribe({
  next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
            this.showResetPassword =true
  },
  error: (err) => {
    console.error('❌ Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
     this.showResetPassword =false
        this.emailVal = '';
  }
  }
)

  }
}


 onSubmit() {
  if (this.resetForm.valid) {
   
    const newPassword =this.resetForm.value.password
    console.log('New password:', this.resetForm.value.password);
   if(this.emailVal  && this.selectedAdmin){
    //if selectAdmin is JobSeeker
    if(this.selectedAdmin=='JobSeeker'){
      console.log('current email is',this.emailVal)
      console.log('this is job seeker')
   
         this.loadingService.show();
   this.jobseekerService.restNewPassword(this.emailVal,newPassword).subscribe({
   
     next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
       this.router.navigate(['/login'])     

  },
  error: (err) => {
    console.error(' Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
     this.showResetPassword =true
       
  }
   })

     } 
        //if selectAdmin is Employer
    else if(this.selectedAdmin=='Employer'){
        console.log('this is employer')

   this.loadingService.show();
   this.employerService.restNewPassword(this.emailVal,newPassword).subscribe({
   
     next: (res) => {
    console.log(' Completed', res);
    alert(res.message); 
         this.loadingService.hide();
           
       this.router.navigate(['/login'])     

  },
  error: (err) => {
    console.error(' Error', err);
    alert(err.error?.message || 'Something went wrong');
     this.loadingService.hide();
     this.showResetPassword =true
       
  }
   })
    }
 
   
    
  }
    
    this.resetForm.reset();
  } 
  
  else {
    this.resetForm.markAllAsTouched();
  }
}
get passwordControl(): FormControl {
  return this.resetForm.get('password') as FormControl;
}

get confirmPasswordControl(): FormControl {
  return this.resetForm.get('confirmPassword') as FormControl;
}
}
