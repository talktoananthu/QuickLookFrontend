import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobPost } from '../job-post';
import { EmployerService } from '../employer-service.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './employer-jobs.component.html',
  styleUrl: './employer-jobs.component.css'
})
export class EmployerJobsComponent implements OnInit {
  selectedJobId: string | null = null;
  employeeId: string = '';
  postedJobAvailable: JobPost[] = [];
   
  menuOpenJobId: string  = '' ;
  fitlerJobs: JobPost[] = [];
   titleFilter: string = '';

  showEachJobDetails:boolean = false 
 
 eachJobPostDetail: JobPost | null = null;

 showEditPortion:boolean = false
 showEditSign:boolean = false
selectedDays: string[] = [];
 areaEdit:string = ''
 cityEdit:string = ''
 stateEdit:string=''
 incomeType:string[]= ['daily','weekly']
 amountEdit:number = 0
 amountUnit:string ='hr' //whether amount is in '90hr' or '100wk' like 'wk' or 'hr' //default
 hiredEdit:number=0
editExpiryDate: Date  | null = null;
 
 responsibilitiesEdit: string[] = [];
requirementsEdit: string[] = [];

jobCategoryEdit:string[] =['Food & Beverage','Hospitality','House Keeping','Manual Labour','Retail']

allDaysEdit: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];





trackByIndex(index: number): number {
  return index;
} //2 arguments one is to identidy array uniqyley and other is to st
  //put this in local Storage session when  "X0M0ZU"
  // page reeload to check if current page is local stroage or session storage

  @ViewChild('menuContainer') menuRef!: ElementRef;

  constructor(private employerService: EmployerService, private elRef: ElementRef,
               public loadingService:LoadingService
  ) {
    this.employeeId = localStorage.getItem('empId') || '';
    
  } 

ngOnInit() {
  console.log('this is jobPosted');
  const selectedJobPostId = sessionStorage.getItem('selectedJobId');
 this.loadingService.show();
  // Always fetch jobs first
  this.employerService.getPostedJobDetails().subscribe(result => {
    
    console.log('Posted Jobs: ', result);
    this.postedJobAvailable = result;
    this.loadingService.hide();
   this.fitlerJobs =  result; //back up for filtering
    // THEN, if job ID exists, scan it
    if (selectedJobPostId !== null) {
      console.log('job id is not null', selectedJobPostId);
      this.showEachJobDetails = true;
      this.scanTheJobPost(selectedJobPostId);
      sessionStorage.removeItem('selectedJobId'); // optional: clean it up after use
    }
  });
}
filterJobsByTitleCategory() {
  const searchTerm = this.titleFilter.toLowerCase().trim();//used to remove unecceassay spaces

  if (!searchTerm) {
    // If no search, reset to show all jobs
    this.fitlerJobs = this.postedJobAvailable;
  } else {
    this.fitlerJobs = this.postedJobAvailable.filter(job =>
      job.jobTitle.toLowerCase().includes(searchTerm) ||
      job.jobCategory.toLowerCase().includes(searchTerm)
    );
  }
}

  handleMenu(jobPostId: string): void {
    if (this.menuOpenJobId === jobPostId) {
      this.onEdit(jobPostId)
    } else {
      this.menuOpenJobId = jobPostId;
    }
  }

  onEdit(jobId:string) {
 
  
 
    this.scanTheJobPost(jobId);

    this.showEachJobDetails = true
     this.showsEditPortions();
  }

   
  onMoreInfo(jobId:string) {

        
    
    this.showEachJobDetails = true
   this.scanTheJobPost(jobId);
 
  }
scanTheJobPost(jobId:string){
   this.menuOpenJobId = jobId 
  console.log('id is ',jobId)
  console.log(this.postedJobAvailable)
   const foundJob = this.postedJobAvailable.find(eachJob=>eachJob.jobPostId==jobId)
  
   this.eachJobPostDetail = foundJob ?? null; //this is selected job details\
   if(this.eachJobPostDetail){
 this.editExpiryDate = new Date(this.eachJobPostDetail.lastDay);
   }
  
   console.log('eachJobPost',this.eachJobPostDetail)
    
}

SelectedSearchJob(jobId:string){
  this.menuOpenJobId = jobId  //to avoid search suggestion which already been selected
  this.showEditPortion = false
 const foundJob = this.postedJobAvailable.find(eachJob=>eachJob.jobPostId==jobId)
   if(this.eachJobPostDetail){
 this.editExpiryDate = new Date(this.eachJobPostDetail.lastDay);
   }
  this.eachJobPostDetail = foundJob ?? null;
 
}


  getDaysAgo(postedDate: string | Date): string {
    const now = new Date();
    const posted = new Date(postedDate);
    const diff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Today' : `${diff}d ago`;
  }

getDaysLeft(expiryDate: string | Date | null | undefined): string {
  if (!expiryDate) return '';  // Don't show anything if undefined/null

  const now = new Date();
  const expiry = new Date(expiryDate);
 
  if (isNaN(expiry.getTime())) return ''; // Invalid date check

  const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? 'Expired' : `${diff}d`;
}

  getSalary(salary: number, incomeType: string): string {
    if (!salary) return 'N/A';
    return incomeType === 'weekly' ? `${salary}/wk` : `${salary}/hr`;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.menu-container');
    if (!clickedInside) {
      // this.menuOpenJobId = null;
    }
  }

gotoJobList(){
  this.showEachJobDetails = false 
}

// values extracted to edit it
showsEditPortions() {
  this.showEditSign = true;
  this.showEditPortion = true;


  if (this.eachJobPostDetail) {
    // Create copies to avoid two-way binding directly on object from list
    this.responsibilitiesEdit = [...(this.eachJobPostDetail.responsibilities || [])];
    this.requirementsEdit = [...(this.eachJobPostDetail.requirements || [])];
  
         const match = this.eachJobPostDetail.amount?.match(/^(\d+)\s*(hr|wk)$/i);

 // example if  this.eachJobPostDetail.amount = "90 hr" or "90 wk"
//      match = [
//   "90 hr",   // full matched string
//   "90",      // Group 1: the number
//   "hr"       // Group 2: the unit
// ];
   if(match){
     this.amountEdit =  +match[1];
     this.amountUnit = match[2]; 
   }
   else {
  this.amountEdit = 0;
  this.amountUnit = 'hr';
}
          
  } else {
    this.responsibilitiesEdit = [];
    this.requirementsEdit = [];
  }
}




showDescriptionOfPostedJob(){

  this.showEditPortion = false;

}
saveJob() {
   if (this.eachJobPostDetail) {
    this.eachJobPostDetail.responsibilities = [...this.responsibilitiesEdit];
    this.eachJobPostDetail.requirements = [...this.requirementsEdit];
    if(this.editExpiryDate ){
   this.eachJobPostDetail.lastDay = new Date(this.editExpiryDate).toISOString();
   }
  }
   
  this.showEditPortion = false;
}
addResponsibility() {
  this.responsibilitiesEdit.push('');
}
removeResponsibility(index: number) {
  this.responsibilitiesEdit.splice(index, 1);
}
addRequirement() {
  this.requirementsEdit.push('');
}
removeRequirement(index: number) {
  this.requirementsEdit.splice(index, 1);
}


 toggleDay(day: string, event: Event): void {
  if (!this.eachJobPostDetail) return;

  const input = event.target as HTMLInputElement;
  const checked = input.checked;

  const currentDays = (this.eachJobPostDetail.workingDays || '')
    .split(',')
    .map(d => d.trim())
    .filter(Boolean); // Removes empty strings

  const updatedDays = checked
    ? [...new Set([...currentDays, day])] // Add if not present
    : currentDays.filter(d => d !== day); // Remove if unchecked

  this.eachJobPostDetail.workingDays = updatedDays.join(', ');
}

// This checks if a day is selected already (for auto-checking checkbox)
isDaySelected(day: string): boolean {
  if (!this.eachJobPostDetail?.workingDays) return false;
 
  const selectedDays = this.eachJobPostDetail.workingDays
    .split(',')
    .map(d => d.trim());

  return selectedDays.includes(day);
}

updateAmount() {
  if(this.eachJobPostDetail){
     this.eachJobPostDetail.amount = `${this.amountEdit} ${this.amountUnit}`;
  }

}

saveChanges() {
  this.showEditPortion = false;
  this.showEditSign = false;
   this.saveJob()
   
  //here use data service to update in the backend
  console.log('updated changes',this.eachJobPostDetail)
   if(this.eachJobPostDetail){
    //calling service to update Posted Job
     this.employerService.updatePostJob(this.eachJobPostDetail).subscribe(result=>{
        console.log('data updated',result)
     })

   }
   else{
    alert('no data present in this.eachJobPostDetail')
   }

}
toggleEditSave() {
  this.showsEditPortions(); // Your existing logic
}
cancelEdit(jobId: string): void {
  this.showEditPortion = false;
  this.showEditSign = false;

  const foundJob = this.postedJobAvailable.find(
    job => job.jobPostId === jobId
  );

  if (foundJob) {
    this.eachJobPostDetail = { ...foundJob }; // shallow clone (optional)
  } else {
    console.warn(`No job found with jobPostId: ${jobId}`);
    this.eachJobPostDetail = null;
  }
}

}


/* why here *ngFor="let req of requirementsEdit; let i = index ;trackBy: trackByIndex" trackBy: trackByIndex is used
🔁 Why Angular Re-renders the Inputs When You Type
When you use:

html
Copy
Edit
<div *ngFor="let task of responsibilitiesEdit; let i = index">
  <input [(ngModel)]="responsibilitiesEdit[i]" />
</div>
and you start typing in one of those inputs:

ts
Copy
Edit
responsibilitiesEdit[i] = 'Serve f';  // e.g., you just typed "f"
Angular sees that responsibilitiesEdit has changed (its contents updated). So Angular:

Triggers change detection

Re-evaluates the *ngFor

Without a trackBy, it assumes all items are new

Destroys all <input> elements

Rebuilds them from scratch (causing cursor jump or value loss)

✅ Solution: Prevent Unnecessary Rebuilding
To fix this, tell Angular how to track each item uniquely, so it doesn’t destroy and recreate the entire DO
*/