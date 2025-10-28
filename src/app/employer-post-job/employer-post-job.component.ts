import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormsModule,FormGroup, Validators ,ValidationErrors,
  AbstractControl,ReactiveFormsModule, ValidatorFn, FormArray } from '@angular/forms';
  import { RouterOutlet,Router } from '@angular/router';
import { JobPost } from '../job-post';
import { EmployerService } from '../employer-service.service';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-employer-post-job',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './employer-post-job.component.html',
  styleUrl: './employer-post-job.component.css'
})
export class EmployerPostJobComponent implements OnInit {

 
 
jobForm!: FormGroup; //reactive form group declaration

selectedImageFile: File | null = null;

  jobsAvailable:boolean = false

 employerId:string=''

daysOfWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
menuOpenJobId: string |null  = '' ;

jobPostDetails!: JobPost;
 
AvailablePostedJobs:JobPost [] = []

selectedDays: string[] = [];

  isLoading = false;

 constructor( private fb: FormBuilder,
  private employerService: EmployerService,
 private router:Router,
  private elRef: ElementRef,
   public loadingService: LoadingService
 ){
  this.showDetailsForPostJob = false

 if( localStorage.getItem('empId')){
   this.employerId = localStorage.getItem('empId')!
 }
 

 }


 checkIncomeType :string=''


 

  ngOnInit(){
    //getting posted jobs
     
 this.getPostedJObs()

  this.jobForm = this.fb.group({
  jobTitle: ['', [Validators.required, Validators.minLength(6)]], //job title
  businessName: ['', [Validators.required, Validators.minLength(6)]], //business name
  jobCateType: ['', Validators.required], //job cateogry
  jobType: ['', Validators.required], //job type

  area: ['', Validators.required],
  city: ['', Validators.required],
  state: ['', Validators.required],
  availableType: [''], //availabiltiy
  description: ['', Validators.required], //description
  incomeType: ['', Validators.required], //income type
  amount: ['', [Validators.required, Validators.min(1)]], //amount
  resume: [''],  //resume
 noOfApplicants: ['', [Validators.required, Validators.min(1)]], //no Of applicants
  workingDays: [[], Validators.required],
  startTime: ['', [Validators.required, this.timeFormatValidator()]],
  endTime: ['', [Validators.required, this.timeFormatValidator()]],
  responsibilities: this.fb.array([this.fb.control('', [Validators.required,Validators.minLength(3)])]),
  requirements: this.fb.array([this.fb.control('',  [Validators.required,Validators.minLength(3)])]),
  lastDay: ['', [Validators.required, this.futureOrTodayDateValidator]]
});
 
  }
getPostedJObs() {
 this.loadingService.show();
  this.employerService.getPostedJobDetails().subscribe({
    next: (result) => {
      if (result) {
        this.AvailablePostedJobs = result;
        console.log(' AvailablePostedJobs ', this.AvailablePostedJobs);

      } else {
          this.AvailablePostedJobs = result;
        console.log(' No jobs found in result');
      }
      this.loadingService.hide();
    },
    error: (err) => {
      console.error(' Error fetching posted jobs:', err);
      this.loadingService.hide();
    }
  });
}

  //form validation functions  ------------------
 timeFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null;
      const isValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
      return isValid ? null : { invalidTime: true };
    };
  }

//Last date submit validation

futureOrTodayDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (!control.value) return null;

  const selectedDate = new Date(control.value);
  const today = new Date();

  // Reset time for accurate comparison
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today ? null : { pastDate: true };
}


//image function


onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;
  }
}
  //array operation for requriement and responsibilites


//adding array when representing it has an reactive form--------
  get responsibilities(): FormArray {
  return this.jobForm.get('responsibilities') as FormArray;
}

get requirements(): FormArray {
  return this.jobForm.get('requirements') as FormArray;
}

addResponsibility(): void {
   this.responsibilities.push(
    this.fb.control('', [Validators.required, Validators.minLength(3)])
  );
}

addRequirement(): void {
   this.requirements.push(
    this.fb.control('', [Validators.required, Validators.minLength(3)])
  );
}
//adding array when representing it has an reactive form--------End


  //-Selecting a Day to work
onWorkingDayChange(event: any) {
  const day = event.target.value;
  const currentDays = this.jobForm.get('workingDays')?.value || [];

  if (event.target.checked) {
    if (!currentDays.includes(day)) {
      currentDays.push(day);
    }
  } else {
    const index = currentDays.indexOf(day);
    if (index !== -1) {
      currentDays.splice(index, 1);
    }
  }

  this.jobForm.get('workingDays')?.setValue(currentDays);
  this.jobForm.get('workingDays')?.markAsTouched(); // Ensure validation triggers
}
//taking time like as '3.45' and converting to '3.45pm ' cause input take it as  '3.45'
convertTo12Hour(time24: string): string {
  const [h, m] = time24.split(':');
  let hour = +h; // convert hour to number
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12; // 0 becomes 12, 13 becomes 1, etc.

  return `${hour}:${m} ${ampm}`;
}

  showDetailsForPostJob:boolean= false

removeResponsibility(index: number): void {
  this.responsibilities.removeAt(index);
}

removeRequirement(index: number): void {
  this.requirements.removeAt(index);
}

  addJob(){
      this.showDetailsForPostJob = true
      this.loadingService.hide();
  }

  gotoJobPost(){
    this.showDetailsForPostJob = false
  }


ShowPostedData() {
  if (this.jobForm.invalid) {
    Object.keys(this.jobForm.controls).forEach((key) => {
      const control = this.jobForm.get(key);
      if (control && control.invalid) {
        console.warn(`Invalid field: ${key}`, control.errors);
      }
    });
    console.warn('Form is invalid!');
    return;
  }

  const start24 = this.jobForm.value.startTime;
  const end24 = this.jobForm.value.endTime;
  const startAMPM = this.convertTo12Hour(start24);
  const endAMPM = this.convertTo12Hour(end24);

  const formValue = this.jobForm.value;
 if(!formValue.resume || formValue.resume.trim() === ""){
  formValue.resume ="No"
 }
  //  Create FormData
  const formData = new FormData();

  formData.append('employerId', this.employerId);
  formData.append('jobTitle', formValue.jobTitle.trim());
  formData.append('businessName', formValue.businessName.trim());
  formData.append('jobCategory', formValue.jobCateType);
  formData.append('jobType', formValue.jobType);
  formData.append('description', formValue.description.trim());
  formData.append('availabilty', formValue.availableType);
  formData.append('incomeType', formValue.incomeType);
  formData.append('resumeNeed', formValue.resume);
  formData.append('amount', `${formValue.amount} ${formValue.incomeType === 'daily' ? 'hr' : 'wk'}`);
  formData.append('workingDays', formValue.workingDays.join(', '));
  formData.append('startTime', startAMPM);
  formData.append('endTime', endAMPM);
  formData.append('applicantsRequired', formValue.noOfApplicants);
  formData.append('hired', '0');
  formData.append('postedDay', new Date().toISOString());
  formData.append('lastDay', new Date(formValue.lastDay).toISOString());

  //  Append file
  if (this.selectedImageFile) {
    formData.append('image', this.selectedImageFile); // 👈 matches `upload.single('image')`
  }

  //  Nested location object
  formData.append('location[area]', formValue.area);
  formData.append('location[city]', formValue.city);
  formData.append('location[state]', formValue.state);

  //  Append array of strings (responsibilities & requirements)
  formValue.responsibilities.forEach((item: string, index: number) => {
    formData.append(`responsibilities[${index}]`, item);
  });
  formValue.requirements.forEach((item: string, index: number) => {
    formData.append(`requirements[${index}]`, item);
  });
this.loadingService.show();

this.employerService.PostingJob(formData).subscribe({
  next: (result) => {
    console.log(' Job posted successfully:', result);
    alert('Job posted successfully!');
    this.loadingService.hide();
  },
  error: (err) => {
    console.error('❌ Error posting job:', err);
    alert('Error posting job. Please try again.');
    this.loadingService.hide();
  },
  complete: () => {
    // Just in case, ensure it hides even if no error/next triggered
    this.loadingService.hide();
  }
});

  // Reset logic stays same
  this.selectedImageFile = null;
  this.jobForm.reset();
  this.jobForm.patchValue({
    jobCateType: 'defaultCategory',
    jobType: 'full-time',
    availableType: 'on-site',
    incomeType: 'daily',
    resume: false,
    workingDays: [],
  });
  (this.jobForm.get('responsibilities') as FormArray).clear();
  (this.jobForm.get('requirements') as FormArray).clear();
  (this.jobForm.get('responsibilities') as FormArray).push(this.fb.control('', Validators.required));
  (this.jobForm.get('requirements') as FormArray).push(this.fb.control('', Validators.required));

  console.log('Form has been reset after submission');
}

    getDaysAgo(postedDate: string | Date): string {
    const now = new Date();
    const posted = new Date(postedDate);
    const diff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Today' : `${diff}d ago`;
  }

   handleMenu(jobPostId: string): void {
     // Toggle logic
    if (this.menuOpenJobId === jobPostId) {
      this.menuOpenJobId = null;
    } else {
      this.menuOpenJobId = jobPostId;
    }
  }
  
  onEdit(jobId:string) {
  
   
  sessionStorage.setItem('selectedJobId', jobId);
  
  this.router.navigate(['/employerlayout/postedJobs'])
    

 
  }
    onMoreInfo(jobId:string) {

        
    sessionStorage.setItem('selectedJobId', jobId);
  
  this.router.navigate(['/employerlayout/postedJobs'])
 
  }
    getDaysLeft(expiryDate: string | Date): string {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 0 ? 'Expired' : `${diff}d`;
  }

 @ViewChildren('menuRef') menuRefs!: QueryList<ElementRef>;;

@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // Don't close if clicked inside menu or the menu button (3 dots)
  const clickedInsideMenu = this.elRef.nativeElement.querySelector('.menu-options')?.contains(target);
  const clickedOnDotsBtn = target.classList.contains('dotsBtn');

  if (!clickedInsideMenu && !clickedOnDotsBtn) {
    this.menuOpenJobId = null;
  }
}

goToPostedJObs(jobId:string){
  sessionStorage.setItem('selectedJobId', jobId);
  
  this.router.navigate(['/employerlayout/postedJobs'])
}
}
//next how to send data through service since i am passing it as reactive form way