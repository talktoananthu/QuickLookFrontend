import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule ,AbstractControl, ValidationErrors} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployerDetails } from '../employer-details';
import { HttpClientModule } from '@angular/common/http';
import { EmployerService } from '../employer-service.service';
import { LoadingService } from '../loading.service';
@Component({
  selector: 'app-employerReg',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './employer-reg.component.html',
  styleUrls: ['./employer-reg.component.css']
})
export class EmployerRegComponent {
  employerForm: FormGroup;

  submitted = false;

  employerDetails: EmployerDetails = {} as EmployerDetails;


  constructor( private employerService:EmployerService,
      public loadingService: LoadingService
  ) {
    this.employerForm = new FormGroup({
      personName: new FormControl('', Validators.required),
      jobPosition: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      jobPlace: new FormControl('', Validators.required),
      companyAddress: new FormControl('', Validators.required),
       contactNumber: new FormControl('', [Validators.required,Validators.pattern(/^[0-9]{10}$/) 
         // Example: 10 digit number validation
  ])
      
    } ,{ validators: this.passwordMatchValidator.bind(this) }); //why?
  }
 //Password matching or not---------------
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmPass = form.get('confirmPass')?.value;

  if (password !== confirmPass) {
    return { passwordMismatch: true };
  }
  return null;
}
 //---------------
  get f() {
    return this.employerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.employerDetails = this.employerForm.value
    
    if (this.employerForm.invalid) {
      console.log('It is invalid')
      return;
    }
    else{
 this.loadingService.show()

//below method is for destructing the confirmPass is variable for separate varibale
// ...data keyword  {...} is used for storing rest of object in a variable which is dataToSend
const { confirmPass, ...dataToSend } = this.employerForm.value;
this.employerDetails = dataToSend
console.log('Employer Registration:',  this.employerDetails);
  this.employerService.storeEmployData(this.employerDetails).subscribe({ 
    next: (result) => {
    console.log('Submitting......',result);
       this.loadingService.hide()
  },
  error: (err) => {
    console.error('Error:', err);
           this.loadingService.hide()
  },
  complete: () => {  
    console.log('Request completed!');
      this.employerForm.reset();
       this.employerForm.markAsPristine();
this.employerForm.markAsUntouched();
this.employerForm.updateValueAndValidity();
  this.submitted = false;
  alert('registration completed')
         this.loadingService.hide()
  }})
   
    }

    
    // Call your backend service here to save employer data
  }
}
