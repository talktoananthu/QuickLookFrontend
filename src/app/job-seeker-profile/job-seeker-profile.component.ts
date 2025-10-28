import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobSeekerService } from '../job-service.service';
import { JobSeeker } from '../job-seeker';
import { JobSeekerNotification } from '../job-seeekr-notification';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-job-seeker-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './job-seeker-profile.component.html',
  styleUrl: './job-seeker-profile.component.css'
})
export class JobSeekerProfileComponent {

  showEdit: boolean = false;
  selectedFileName: string = '';
selectedFile: File | null = null;
  updateJobSeekerFrom: FormGroup; //  keep your same variable name

  buttonFontSize: number = 14; //  untouched
  fileNameFontSize: number = 12; //  untouched

JobSeekerNotifcations:JobSeekerNotification[] =[]


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

  @Output() profileUpdated = new EventEmitter<void>();


  constructor(
    private jobSeekerService: JobSeekerService,
    private fb: FormBuilder,
        public loadingService:LoadingService
  ) {
    this.showEdit = false;

    //  Reactive form setup (only addition)
    this.updateJobSeekerFrom = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(2)]],
      emailId: [
        '',
        [
          Validators.required,
         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/)
        ]
      ],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/) // must be 10 digits
        ]
      ],
      dateOfBirth: ['', [Validators.required, this.validateAge]],
      Address: ['', [Validators.required, Validators.minLength(6)]],
      area: ['', [Validators.required, Validators.minLength(6)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required, Validators.minLength(3)]],
      MaxHourPerDay:[0,  [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.fetchJobSeekerProfile();
     this.fetchJobSeekerNotfication();
  }

validateAge(control: any) {
  const dob = new Date(control.value);
  if (!control.value) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 18 ? null : { underAge: true };
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
           this.updateJobSeekerFrom.patchValue(this.JobSeekerDetails);
          console.log('updateJobSeekerFrom',this.updateJobSeekerFrom.value)
          console.log('Job Seeker Deta ils:', this.JobSeekerDetails);
        } else {
          console.warn('No profile found');
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

 fetchJobSeekerNotfication(){
     
this.jobSeekerService.getNotification().subscribe(result =>{
  this.JobSeekerNotifcations = result.notifications
  const number = result.unreadCount

  console.log('this.JobSeekerNotifcations',  this.JobSeekerNotifcations)
    console.log('number',  number)

    if(number>0){
 this.makeNotificationTrue()
    }
})

 }

makeNotificationTrue(){
  this.jobSeekerService.makeNotificationtrue().subscribe(res=>{
     console.log('res',res.message)
  })
}


  MakeEdit() {
    this.showEdit = true;
    this.fetchJobSeekerProfile()
  }
updateData() {

  console.log('this.updateJobSeekerFrom value',this.updateJobSeekerFrom.value)
  if (this.updateJobSeekerFrom.valid) {
    const formData = new FormData();

    // Append all form fields from the reactive form
    Object.keys(this.updateJobSeekerFrom.value).forEach(key => {
      let value = this.updateJobSeekerFrom.value[key];

      // Convert numbers to string because FormData only accepts string or Blob
      if (typeof value === 'number') value = value.toString();

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Append image if a file is selected
    if (this.selectedFile) {
      formData.append('ImageProfile', this.selectedFile); // actual File object
    }

    // Debug: print all FormData entries
   formData.forEach((value, key) => {
  console.log(key, value);
});

   this.loadingService.show();
    // Call backend API to update profile
    this.jobSeekerService.updateProfileDetailJobSeeeker(formData).subscribe({
      next: (result) => {
        console.log('Profile updated successfully');
   this.loadingService.hide();
        // Reload updated profile data
        this.fetchJobSeekerProfile();
this.updateProfile()
        // Reset file selection and hide edit mode
        this.selectedFile = null;
        this.selectedFileName = '';
        this.showEdit = false;
      },
      error: (err) => {
         this.loadingService.hide();
        console.error('Update failed', err);
      }
    });

  } else {
    // Mark all fields as touched to show validation errors
    this.updateJobSeekerFrom.markAllAsTouched();
  }
}
  updateProfile() {
    console.log('Profile updated!');
    this.profileUpdated.emit();
  }
// Update file selection handler to store actual File
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0]; // actual File
    this.selectedFileName = this.selectedFile.name; // for display
  }
}
  closeEdit() {
    this.showEdit = false;
  }
  DeleteNoti(jobSeekerId:string,NotId:Date){
   this.loadingService.show();
  console.log(jobSeekerId,'jobseekerId',NotId,'notification id')

  this.jobSeekerService.deletenotification(jobSeekerId,NotId).subscribe(res=>{
       this.loadingService.hide();
    console.log('result',res.message)
    this.fetchJobSeekerNotfication()
  })
  }
}
