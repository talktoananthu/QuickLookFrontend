import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployerService } from '../employer-service.service';
import { EmployerProfile } from '../employer-profile';
import { NotificationForEmployer } from '../notification-for-employer';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-Employerprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent implements OnInit {
  employerId: string | null = '';
  employerDetails: EmployerProfile = {} as EmployerProfile;
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    @Output() profileUpdated = new EventEmitter<void>();
  isEditing = false;
  profileForm!: FormGroup; //  Reactive form instance
selectedImage: File | null = null;
imagePreview: string | ArrayBuffer | null = null;
profileImageUrl: string | ArrayBuffer | null = null;

makeNotification:boolean = false;
employersNotifications:NotificationForEmployer[]=[]

  constructor(private employerService: EmployerService, 
         public loadingService:LoadingService,
    private fb: FormBuilder) {
    if (localStorage.getItem('empId')) {
      this.employerId = localStorage.getItem('empId');
    }
  }

  ngOnInit() {
    this.employerService.getEmployerProfile().subscribe(result => {
      this.employerDetails = {
        personName: result.personName,
        jobPosition: result.jobPosition,
        email: result.email,
        jobPlace: result.jobPlace,
        companyAddress: result.companyAddress,
        contactNumber: result.contactNumber,
        employId: result.employId,
        profileImg:result.profileImg
      };

      // Initialize form with validation rules
      this.profileForm = this.fb.group({
        personName: [this.employerDetails.personName, [Validators.required, Validators.minLength(4)]],
        jobPosition: [this.employerDetails.jobPosition, [Validators.required, Validators.minLength(4)]],
        contactNumber: [this.employerDetails.contactNumber, [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/) //  exactly 10 digits
        ]],
        email: [this.employerDetails.email, [
          Validators.required,
          Validators.email
        ]],
        jobPlace: [this.employerDetails.jobPlace, [Validators.required, Validators.minLength(4)]],
        companyAddress: [this.employerDetails.companyAddress, [Validators.required, Validators.minLength(4)]]
      });

     
    });
    this.fetchEmployerNotfication()
  }

 fetchEmployerNotfication(){
     
this.employerService.getNotification().subscribe(result =>{
  this.employersNotifications = result.notifications
  const number = result.unreadCount
  if(number>0){
    this.makeNotificationTrue()

   
  }
  console.log('this.employersNotifications',  this.employersNotifications)
    console.log('number',  number)
})

 }


makeNotificationTrue(){
  this.employerService.makeNotificationtrue().subscribe(res=>{
     console.log('res',res.message)
  })
}


onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  startEditing() {
    this.isEditing = true;
  }

saveDetails() {
  if (this.profileForm.valid) {
    const formData = new FormData();
    formData.append('personName', this.profileForm.value.personName);
    formData.append('jobPosition', this.profileForm.value.jobPosition);
    formData.append('contactNumber', this.profileForm.value.contactNumber);
    formData.append('email', this.profileForm.value.email);
    formData.append('jobPlace', this.profileForm.value.jobPlace);
    formData.append('companyAddress', this.profileForm.value.companyAddress);

    if (this.selectedImage) {
      formData.append('profileImage', this.selectedImage);
    }
  this.loadingService.show();
    this.employerService.updateEmployerProfile(formData).subscribe({
      next: (result) => {
        console.log('Data updated');
  this.loadingService.hide();
        // Reload updated profile data from server
        this.employerService.getEmployerProfile().subscribe(updatedResult => {
          this.employerDetails = { ...updatedResult };

          // Update form values with the refreshed data
          this.profileForm.patchValue({
            personName: updatedResult.personName,
            jobPosition: updatedResult.jobPosition,
            contactNumber: updatedResult.contactNumber,
            email: updatedResult.email,
            jobPlace: updatedResult.jobPlace,
            companyAddress: updatedResult.companyAddress
          });

          // Update image preview if available
          this.profileImageUrl = updatedResult.profileImg || null;

          // Reset selectedImage because image is updated
          this.selectedImage = null;

          this.isEditing = false;
             this.employerService.notifyProfileUpdated(true);
        });
      },
      error: (err) => {
         this.loadingService.hide();
        console.error('Update failed', err);
      }
    });

  } else {
    this.profileForm.markAllAsTouched();
  }
}

  cancelEditing() {
    this.isEditing = false;
    this.profileForm.patchValue(this.employerDetails); // reset to old values
  }

    DeleteNoti(employerId:string,NotId:Date){

this.loadingService.show();
  console.log(employerId,'employerId',NotId,'notification id')

  this.employerService.deletenotification(employerId,NotId).subscribe(res=>{
    this.loadingService.hide();
    console.log('result',res.message)
    this.fetchEmployerNotfication()
  })
  }
}
