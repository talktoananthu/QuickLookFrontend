import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewEncapsulation, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSeekerService } from '../job-service.service';
import { NearByJobSeekerPost } from '../near-by-job-seeker-post';
import * as L from 'leaflet'
import { JobSeeker } from '../job-seeker';
import { LoadingService } from '../loading.service';
@Component({
  selector: 'app-job-post-map',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './job-post-map.component.html',
  styleUrls: ['./job-post-map.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class JobPostMapComponent implements OnInit, AfterViewInit{

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
 JobSeekerLong:number = 0;
 JObSeekerLatitude:number=0;

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


 showSelectedJobPostDesc:NearByJobSeekerPost | null= null

 SelectedJobPostId:string =''


  
jobTitle: string = '';
  amountVal: number = 0;
  startTime: string = '';
  endTime: string = '';
  weekBeforeVal: number = 0;
  monthbeforeVal: number = 0;
  showDistVal: number = 0;
  showAreaVal: string = '';
  showCityVal: string = ''; 
  editedLocation: string = '';

 // Job seeker details and location
  jobSeekerAddress: string | null = '';
  jobSeekerArea: string | null = '';
  jobSeekerCity: string | null = '';
  jobSeekerState: string | null = '';
    jobSeekerId:string = '';
  selectedCategory: string = '';
selectedCategories: string[] = [];
postedJobsAvailable: NearByJobSeekerPost[] = [];
 backupDataAvailable: NearByJobSeekerPost[] = [];
  constructor(private jobSeekerService: JobSeekerService,
            public loadingService:LoadingService
  ){
     console.log('this is the job seeker map')
  this.fetchJobSeekerProfile();
  }

 fetchJobSeekerProfile() {
  this.loadingService.show()
    this.jobSeekerService.getJobSeekerProfileDetails().subscribe({
      next: (data: any) => {
        this.loadingService.hide()
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
          this.loadingService.hide()
  
       
        } else {
         
          console.warn('No profile found');
        }
      },
      error: (err) => {
        this.loadingService.hide()
        console.error('Error fetching profile:', err);
      }
    });
  }



  map!: L.Map;
  //  const lat = localStorage.getItem('userLat');
//     const lng = localStorage.getItem('userLng');
async ngOnInit() {
  // Load job seeker data from localStorage
  this.jobSeekerAddress = localStorage.getItem('JObSeekeraddress');
  this.jobSeekerArea = localStorage.getItem('JObSeekerArea');
  this.jobSeekerCity = localStorage.getItem('JObSeekerCity');
  this.jobSeekerState = localStorage.getItem('JObSeekerState');
  this.jobSeekerId = localStorage.getItem('JobSeekerId') || '';

  const address = `${this.jobSeekerAddress}, ${this.jobSeekerArea},
   ${this.jobSeekerCity}, ${this.jobSeekerState}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
      this.JObSeekerLatitude = parseFloat(data[0].lat);
      this.JobSeekerLong = parseFloat(data[0].lon);
    } else {
      // fallback coordinates if geocode fails
      this.JObSeekerLatitude = 10.025487;
      this.JobSeekerLong = 76.3079848;
    }

    // Initialize map after coordinates ready
    this.initMap();

    // Fetch nearby jobs and add markers
    if (this.jobSeekerAddress && this.jobSeekerCity && this.jobSeekerState && this.jobSeekerId) {
      const locationData = {
        address: this.jobSeekerAddress,
        area: this.jobSeekerArea,
        city: this.jobSeekerCity,
        state: this.jobSeekerState,
        jobSeekerId: this.jobSeekerId
      };

      this.jobSeekerService.getPostedJobsForJobSeeker(locationData)
        .subscribe(result => {
          this.postedJobsAvailable = result;
          this.backupDataAvailable = [...result];

          this.addJobMarkers();   // Add job markers first
          this.addUserMarker();   // Ensure user marker is on top
        });
    }
  } catch (err) {
    console.error('Geocoding error:', err);
    this.JObSeekerLatitude = 10.025487;
    this.JobSeekerLong = 76.3079848;
    this.initMap();
  }
}


checkLocationFromAddress() {
 
}




  ngAfterViewInit() {
   //Initialize map first
 
}
private addUserMarker() {
  const profileImage = this.JobSeekerDetails.ImageProfile?.trim() 
    ? this.JobSeekerDetails.ImageProfile 
    : 'assets/profile.png';

  const userIcon = L.divIcon({
    html: `<div style="
              width: 40px; 
              height: 40px; 
              border-radius: 50%; 
              overflow: hidden; 
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.5);
            ">
              <img src="${profileImage}" style="width: 100%; height: 100%; object-fit: cover;" />
           </div>`,
    className: '', // remove default divIcon styles
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  L.marker([this.JObSeekerLatitude, this.JobSeekerLong], { icon: userIcon })
    .addTo(this.map)
    .bindPopup('You are here')
    .openPopup();
}

 private initMap() {
  this.map = L.map('map').setView([this.JObSeekerLatitude, this.JobSeekerLong], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  this.addUserMarker();

  // Add job markers if jobs are already fetched
  if (this.postedJobsAvailable.length) {
    this.addJobMarkers();
  }
}
private jobMarkers: L.Marker[] = [];

private addJobMarkers() {
  // Remove previous markers
  this.jobMarkers.forEach(marker => this.map.removeLayer(marker));
  this.jobMarkers = [];

  this.postedJobsAvailable.forEach(job => {
      const coords = job.locationCoordinates?.coordinates;
      if (!coords || coords.length < 2) return;

      const [lng, lat] = coords;

      let jobIcon: L.DivIcon = job.applied
        ? L.divIcon({ html: `<div class="custom-job-markerApplied"><img src="${job.image}" /></div>`, className: '', iconSize: [50, 50], iconAnchor: [25, 50], popupAnchor: [0, -50] })
        : L.divIcon({ html: `<div class="custom-job-marker"><img src="${job.image}" /></div>`, className: '', iconSize: [50, 50], iconAnchor: [25, 50], popupAnchor: [0, -50] });

     const marker = L.marker([lat, lng], { icon: jobIcon })
  .addTo(this.map)
  .bindPopup(`
    <div class="job-popupSize">
      <img src="${job.image}" class="job-popup" alt="Job Image">
      <h4 class="job-popupTitle">${job.jobTitle}</h4>
      <p class="job-popupSubtitle">${job.businessName}</p>
      <img src="assets/location.png" class="job-popupImage" alt="Job Image">
      <p  class="job-popupLocation">${job.location.area},${job.location.city}, ${job.location.state}</p>
            ${job.applied ? '<p class="job-popupaApplied ">Applied</p>' :'<p class="job-popupNotApplied">Not Applied</p>' }
    </div>
  `, { closeButton: true });

      this.jobMarkers.push(marker);
  });
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
        this.addJobMarkers(); 
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

  this.addJobMarkers();
}

getHourFromTime(time: string): number {
  return Number(time.split(':')[0]);
}
getHourFromAmPm(timeStr: string): number {
  let [time, period] = timeStr.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
  return hour;
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
        $event.stopPropagation();
     this.showMonth = !this.showMonth;
    this.monthbeforeVal = this.showMonth ? 28 : 0;
    this.applyFilters();
  }
showWeekAgo2($event: MouseEvent){
     $event.stopPropagation();
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
  clearStartTime(){
  this.startTime=''
  this.applyFilters();
}
clearEndTime(){
  this.endTime = ''
   this.applyFilters();
}
SelectedJobDesc(jobPostIdDesc: string) {
  this.showSelectedJobPostDesc =
    this.backupDataAvailable.find(job => job.jobPostId === jobPostIdDesc) || null;

    this.SelectedJobPostId = jobPostIdDesc
    console.log('selected',this.SelectedJobPostId)
}
  getDaysAgo(postedDay: string | Date): string {
    const postedDate = new Date(postedDay);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 'today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
}
