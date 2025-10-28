import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import { FormBuilder, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import { JobSeeker } from '../job-seeker';
import { JobSeekerService } from '../job-service.service';
import { LoadingService } from '../loading.service';
@Component({
  selector: 'app-job-seeker-register',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './job-seeker-register.component.html',
  styleUrl: './job-seeker-register.component.css'
})
export class JobSeekerRegister {
 jobSeekerForm: FormGroup;
  submitted = false;

 JobSeekerDetails: JobSeeker = {} as JobSeeker;



  constructor(private fb: FormBuilder,
              private jobSeekerService:JobSeekerService,
                 public loadingService: LoadingService
  ) {
    this.jobSeekerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        dateOfBirth: ['', [Validators.required, this.minimumAgeValidator(18)]],
        address: ['', [Validators.required, Validators.minLength(4)]],
        area: ['', [Validators.required,Validators.minLength(3)]],
         city: ['', [Validators.required,Validators.minLength(3)]],
           state: ['', [Validators.required,Validators.minLength(3)]],
        preferredJobTypes: [''],
        skills: ['']
      },
      { validators: this.passwordsMatchValidator } // Custom validator here
    );
      console.log('Job Seeker Data:', this.jobSeekerForm.value);

  }

   minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; //  Added null check
      const dob = new Date(control.value);
      if (isNaN(dob.getTime())) return null; //  Added Invalid Date check

      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  //  validator: Check that password & confirmPassword match
 passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSubmit() {
     this.submitted = true;
    if (this.jobSeekerForm.valid) {
      console.log('Job Seeker Data:', this.jobSeekerForm.value);
   //destructing 1st paramter has to be keyword or field name 
   // rest of objects keys and value can be stored in variable
   //removing confirm password so that it will not store in the backend
      const { confirmPassword, ...dataToSend } = this.jobSeekerForm.value;

      this.JobSeekerDetails = dataToSend
       console.log('JobSeekerDetails:', this.JobSeekerDetails);
           
        this.jobSeekerForm.reset();
       this.jobSeekerForm.markAsPristine();
this.jobSeekerForm.markAsUntouched();
this.jobSeekerForm.updateValueAndValidity();

 //posting the job in the JobseekerDataService 
       this.jobSeekerService.storeJobSeekerData( this.JobSeekerDetails).subscribe({ 
    next: (result) => {
    console.log('Submitting......',result);
    this.loadingService.show()
  },
  error: (err) => {
     if (err.status === 409) {
      alert('User already exists with this email.');
    } else {
      alert('An error occurred. Please try again.');
    }
       this.loadingService.hide()
  },
  complete: () => {  
    console.log('Request completed!');
      this.jobSeekerForm.reset();
       this.jobSeekerForm.markAsPristine();
this.jobSeekerForm.markAsUntouched();
this.jobSeekerForm.updateValueAndValidity();
 this.submitted = false;
  alert('registration completed')
   this.loadingService.hide()
  }})
      // TODO: Send to your backend here
    } else {
      this.jobSeekerForm.markAllAsTouched(); // Show all errors!
    }
  }
}
