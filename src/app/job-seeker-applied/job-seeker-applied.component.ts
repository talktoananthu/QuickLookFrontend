import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSeekerService } from '../job-service.service';
import { JobApplicationStatus } from '../job-application-status';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-job-seeker-applied',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './job-seeker-applied.component.html',
   styleUrls: ['./job-seeker-applied.component.css']
   
})
export class JObSeekerAppliedComponent implements OnInit {

 JobsApplied:JobApplicationStatus[]=[]
FilteredJobsApplied: JobApplicationStatus[] = [];
 SearchByJobTitle:string=''

statusArray :string[]= ['All','Pending','Rejected','Hired'] 

selectedStatus:string=''

  constructor(private jobSeekerService:JobSeekerService,
    public loadingService:LoadingService
   ){
   
  }

    ngOnInit(){
      this.selectedStatus='All'
      this.fetchAppliedJobs()
    }

    fetchAppliedJobs(){
        this.loadingService.show();
 console.log('this is JObSeekerAppliedComponent')
    this.jobSeekerService.gettingAppliedJobStatus().subscribe(result =>{
      console.log('result ')
      this.JobsApplied = result.data
          this.FilteredJobsApplied = [...this.JobsApplied];

            this.ApplyFilter();
      console.log('result ', this.JobsApplied)
     this.loadingService.hide()
    })
    }

ApplyFilter() {
  const searchText = (this.SearchByJobTitle || '').toLowerCase().trim();

  this.FilteredJobsApplied = this.JobsApplied.filter(job => {
    const title = job.jobTitle.toLowerCase();
    const status = job.StatusApplied.toLowerCase();

    // simple status mapping
    let statusMatches = false;
    if (this.selectedStatus === 'All') statusMatches = true;
    else if (this.selectedStatus === 'Hired' && status === 'accepted') statusMatches = true;
    else if (status === this.selectedStatus.toLowerCase()) statusMatches = true;

    // simple title check
    const titleMatches = !searchText || title.includes(searchText);

    return titleMatches && statusMatches;
  });

  console.log(this.FilteredJobsApplied);
}


/*  Optional: trigger filter automatically when status changes */
onStatusClick(status: string) {
  this.selectedStatus = status;
  this.ApplyFilter();
}

}
