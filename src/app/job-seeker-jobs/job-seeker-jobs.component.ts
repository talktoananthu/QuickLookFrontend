import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobSeekerService } from '../job-service.service';
import { NearByJobSeekerPost } from '../near-by-job-seeker-post';
import { JobApplication } from '../job-application';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-job-seeker-jobs',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './job-seeker-jobs.component.html',
  styleUrls: ['./job-seeker-jobs.component.css']
})
export class JobSeekerJobsComponent implements OnInit {

  // Filter toggles
  showfilter: boolean = false;
  showCateorgry: boolean = false;
  showStartTime: boolean = false;
  showEndTime: boolean = false;
  showWeek: boolean = false;
  showMonth: boolean = false;
  showDist: boolean = false;
  showArea: boolean = false;
  showAmountFilter: boolean = false;
  showCity: boolean = false;

  // Job data
  postedJobsAvailable: NearByJobSeekerPost[] = [];
  backupDataAvailable: NearByJobSeekerPost[] = [];

  // Job seeker location
  jobSeekerAddress: string | null = '';
  jobSeekerArea: string | null = '';
  jobSeekerCity: string | null = '';
  jobSeekerState: string | null = '';

  // Dropdown
  isOpen = false;
  selectedCategory: string = '';
  selectedCategories: string[] = [];
  jobCategories: string[] = [
    'Food & Beverage',
    'Hospitality',
    'Housekeeping',
    'Manual Labour',
    'Retail',
  ];
 //selected JobPost Id

 SelectedJobPostId:string =''

 showSelectedJobPostDesc:NearByJobSeekerPost | null= null

  // Filter values
  jobTitle: string = '';
  amountVal: number = 0;
  startTime: string = '';
  endTime: string = '';
  weekBeforeVal: number = 0;
  monthbeforeVal: number = 0;
  showDistVal: number = 0;
  showAreaVal: string = '';
  showCityVal: string = '';
  jobSeekerId:string = '';
  editedLocation: string = '';
  isEditing: boolean = false;

  enableEdit() {
    
    this.isEditing = true;
  }

  saveEdit() {
    
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
//selecting a Job post

 showDescriptionJobPost:boolean = false

//storing JobApplication Details

 JobSeekerApplicationData: JobApplication = {} as JobApplication;

  constructor(private jobSeekerService: JobSeekerService,
              public loadingService:LoadingService
  ) {
  console.log('this is map componen')

  }

ngOnInit() {
  this.jobSeekerAddress = localStorage.getItem('JObSeekeraddress');
  this.jobSeekerArea = localStorage.getItem('JObSeekerArea');
  this.jobSeekerCity = localStorage.getItem('JObSeekerCity');
  this.jobSeekerState = localStorage.getItem('JObSeekerState');
  this.jobSeekerId = localStorage.getItem('JobSeekerId') || ''; // fallback to empty string

  // Only proceed if jobSeekerId and location info exist
  if (this.jobSeekerAddress && this.jobSeekerCity && this.jobSeekerState && this.jobSeekerId) {
    const locationData = {
      address: this.jobSeekerAddress,
      area: this.jobSeekerArea,
      city: this.jobSeekerCity,
      state: this.jobSeekerState,
      jobSeekerId: this.jobSeekerId // pass jobSeekerId to backend
    };
   this.getPostedJobs(locationData)
  
  }
}

getPostedJobs(locationData:any){
   this.loadingService.show();
   this.jobSeekerService.getPostedJobsForJobSeeker(locationData)
    .pipe(
      finalize(() => this.loadingService.hide()) // 
    )
    .subscribe({
      next: (result) => {
        this.postedJobsAvailable = result;
        this.backupDataAvailable = [...result];
        console.log(this.postedJobsAvailable);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
}


  // Utility
  getDaysAgo(postedDay: string | Date): string {
    const postedDate = new Date(postedDay);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  getDaysLeft(lastDay: string | Date): string {
    const endDate = new Date(lastDay);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day today';
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
  }

  // Toggle filter panels & reset values when closing individual filters
  showFilters() { this.showfilter = !this.showfilter; }

  closeFilter() {
    this.showfilter = false; // just hide the panel, DO NOT reset filters
  }

  showCate() {
    this.showCateorgry = !this.showCateorgry;
    if (!this.showCateorgry) {
      this.selectedCategory = '';
      this.applyFilters();
    }
  }

  showAmount() {
    this.showAmountFilter = !this.showAmountFilter;
    if (!this.showAmountFilter) {
      this.amountVal = 0;
      this.applyFilters();
    }
  }

  showstartTime() {
    this.showStartTime = !this.showStartTime;
    if (!this.showStartTime) {
      this.startTime = '';
      this.applyFilters();
    }
  }

  showendTime() {
    this.showEndTime = !this.showEndTime;
    if (!this.showEndTime) {
      this.endTime = '';
      this.applyFilters();
    }
  }

  showWeekAgo() {
    this.showWeek = !this.showWeek;
    this.weekBeforeVal = this.showWeek ? 7 : 0;
    this.applyFilters();
  }

  showMonthAgo() {
    this.showMonth = !this.showMonth;
    this.monthbeforeVal = this.showMonth ? 28 : 0;
    this.applyFilters();
  }
  showMonthAgo2($event: MouseEvent){
     this.showMonth = !this.showMonth;
    this.monthbeforeVal = this.showMonth ? 28 : 0;
    this.applyFilters();
  }
showWeekAgo2($event: MouseEvent){
   if (event) event.stopPropagation(); 
  this.showWeek = !this.showWeek;
    this.applyFilters();
}
  showDistanceFilter() {
    this.showDist = !this.showDist;
    if (!this.showDist) {
      this.showDistVal = 0;
      this.applyFilters();
    }
  }

  showAreaFilter() {
    this.showArea = !this.showArea;
    if (!this.showArea) {
      this.showAreaVal = '';
      this.applyFilters();
    }
  }
  

  showCityFilter() {
    this.showCity = !this.showCity;
    if (!this.showCity) {
      this.showCityVal = '';
      this.applyFilters();
    }
  }

  toggleDropdown() { this.isOpen = !this.isOpen; }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isOpen = false;
    this.applyFilters();
  }

  onCategoryChange(event: any) {
  const value = event.target.value;
  console.log(value)
  if (event.target.checked) {
    this.selectedCategories.push(value);
  } else {
    this.selectedCategories = this.selectedCategories.filter(c => c !== value);
  }
  this.applyFilters();
}
clearStartTime(){
  this.startTime=''
  this.applyFilters();
}
clearEndTime(){
  this.endTime = ''
   this.applyFilters();
}

  // Filter logic
applyFilters() {
  const hasActiveFilter =
     (this.selectedCategory && this.selectedCategory.trim() !== '') || 
  (this.selectedCategories.length > 0) || 
  (this.jobTitle && this.jobTitle.trim() !== '') ||
  this.amountVal > 0 ||
  (this.startTime && this.startTime.trim() !== '') ||
  (this.endTime && this.endTime.trim() !== '') ||
  (this.showAreaVal && this.showAreaVal.trim() !== '') ||
  (this.showCityVal && this.showCityVal.trim() !== '') ||
  this.weekBeforeVal > 0 ||
  this.monthbeforeVal > 0 ||
  this.showDistVal > 0;

  if (!hasActiveFilter) {
    this.postedJobsAvailable = [...this.backupDataAvailable];
    return;
  }

  this.postedJobsAvailable = this.backupDataAvailable.filter(job => {
    let match = true;

    // Category filter
   if (this.selectedCategory) {
  // Single category dropdown active → strict match
  if (job.jobCategory?.toLowerCase() !== this.selectedCategory.toLowerCase()) {
    match = false;
  }
} else if (this.selectedCategories.length > 0) {
  // Multiple checkboxes active → match any of them
  const jobCat = (job.jobCategory || '').toLowerCase();
  if (!this.selectedCategories.some(cat => jobCat === cat.toLowerCase())) {
    match = false;
  }
}

    // Job title filter
    if (this.jobTitle &&
        !job.jobTitle?.toLowerCase().includes(this.jobTitle.toLowerCase())) {
      match = false;
    }

    // Amount filter (partial number match inside string)
    if (this.amountVal > 0 && job.amount) {
      const jobAmountStr = job.amount.toString();
      const inputStr = this.amountVal.toString();
      if (!jobAmountStr.includes(inputStr)) {
        match = false;
      }
    }

    // Start time filter
    if (this.startTime && job.startTime) {
      const inputHour = this.getHourFromTime(this.startTime); // input HH:MM
      const jobHour = this.getHourFromAmPm(job.startTime);    // "3:30 PM"
      if (inputHour !== jobHour) match = false;
    }

    // End time filter
    if (this.endTime && job.endTime) {
      const inputHour = this.getHourFromTime(this.endTime);
      const jobHour = this.getHourFromAmPm(job.endTime);
      if (inputHour !== jobHour) match = false;
    }

    // Area filter
    if (this.showAreaVal &&
        !(job.location?.area || '').toLowerCase().includes(this.showAreaVal.toLowerCase().trim())) {
      match = false;
    }

    // ✅ Distance filter (with number conversion)
// if (this.showDistVal > 0) {
//   const filterDist = Number(this.showDistVal);
//  if (Math.floor(job.distance) > filterDist) {
//   match = false;
// }
// }
if (this.showDistVal > 0) {
  const filterDist = Number(this.showDistVal);        // user input
  const jobDist = Number(job.distance);               // ensure numeric
  const tolerance = 1;                                // allow slightly above input
  if (jobDist > filterDist + tolerance) {             // filter out jobs beyond input + tolerance
    match = false;
  }
}

    // City filter
 if (this.showCityVal) {
  const jobCity = (job.location?.city || '').toLowerCase().trim();
  const filterCity = this.showCityVal.toLowerCase().trim();

  if (!jobCity.includes(filterCity)) {
    match = false;
  }
}

    // Week filter
    if (this.weekBeforeVal > 0 && job.postedDay) {
      // this.weekBeforeVal value is 7
      const postedDate = new Date(job.postedDay);
      const today = new Date();
      const diff = (today.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff > this.weekBeforeVal) match = false;
    }

    // Month filter
    if (this.monthbeforeVal > 0 && job.postedDay) {
      // this.monthbeforeVal valus is 28 if diff 
      const postedDate = new Date(job.postedDay);
      const today = new Date();
      const diff = (today.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff > this.monthbeforeVal) match = false;
    }



    return match;
  });
}

getHourFromTime(time: string): number {
  return Number(time.split(':')[0]);
}

// Convert "3:30 PM" → 15
getHourFromAmPm(timeStr: string): number {
  let [time, period] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return hour;
}

ShowJobDetails(jobId:string){
  this.showDescriptionJobPost = true
  this.SelectedJobPostId = jobId
 console.log('job Id',jobId)
 this.SelectedJobDesc(jobId)
}
SelectedJobDesc(jobPostIdDesc: string) {
  this.showSelectedJobPostDesc =
    this.backupDataAvailable.find(job => job.jobPostId === jobPostIdDesc) || null;

    this.SelectedJobPostId = jobPostIdDesc
    console.log('selected',this.SelectedJobPostId)
}


clickedOnApplication(jobId: string) {
  if (jobId) {
    this.JobSeekerApplicationData.jobPostId = jobId;
    this.JobSeekerApplicationData.appliedDate = new Date().toISOString();
    if (this.showSelectedJobPostDesc) {
  this.JobSeekerApplicationData.amount = this.showSelectedJobPostDesc.amount;
} else {
  this.JobSeekerApplicationData.amount = '';
}
    const seekerId = localStorage.getItem('JobSeekerId');
    if (seekerId) {
      this.JobSeekerApplicationData.jobSeekerId = seekerId;
    }
    this.JobSeekerApplicationData.status = 'pending';

    this.jobSeekerService.sentApplication(this.JobSeekerApplicationData)
      .subscribe({
        next: (res) => {
          console.log('Application saved', res);

          // ✅ Mark job as applied
          if (this.showSelectedJobPostDesc) {
            this.showSelectedJobPostDesc.applied = true;
          }
        },
        error: (err) => console.error('Error applying job', err)
      });
  }
}


}
