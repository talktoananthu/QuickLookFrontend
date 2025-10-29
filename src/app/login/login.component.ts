import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../data.service';
import { UserProfile } from '../user-profile';
import { HostListener } from '@angular/core';
import { Route, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router'; 
import { EmployerService } from '../employer-service.service';
import { JobSeekerService } from '../job-service.service';
import { LoginResponse } from '../login-response';
import { AuthService } from '../auth.service';
import { LoadingService } from '../loading.service';

//for storing in localStorage

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
   //nearby JobPlaces 
  // -----------------------------
  //  Variables for jobs
  jobName: string = '';              // bound to input
  nearJobNames: string[] = [];       // filtered list for dropdown
  allJobNames: string[] = [];        //  always keep full jobs here
  nearbyJobs: any[] = [];            // full jobs data
isDropdownOpen = false;
  // -----------------------------
  // Your other variables
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;


  userEmail:string = ''
  userPassword:string=''

 categoryLogin: string[] = ['JobSeeker', 'Employer'];
selectedLoginAs: string = 'JobSeeker'

  categories: string[] = [
    'Any',
    'Food & Beverage',
    'Hospitality ',
     'Housekeeping',
    'Manual Labour',
    'Retail',
    'Delivery / Logistics',
    'Data Entry / BPO',
  ];


  selectedCategory: string = '';
  onButtonClickImageShow: string = '';



  constructor(private dataService: DataService,
              private router:Router,
              private empolyerService :EmployerService,
               private  jobseekerService: JobSeekerService,
               private authService:AuthService,
                 public loadingService:LoadingService
            ) 
  {

  }
    ngAfterViewInit() {
    const video = this.bgVideo.nativeElement;

    // Ensures autoplay works even after reload or change detection
    video.muted = true;
    video.play().catch(err => {
      console.warn('Autoplay prevented, trying again...', err);
      setTimeout(() => video.play(), 500);
    });
  }

  //  Full ngOnInit with geolocation exactly as you wrote:
  ngOnInit() {
    document.body.style.overflow = 'hidden'; // Disable scrolling on body

    // 1) Base fallback coordinates (e.g., MG Road, Bangalore)
    const BASE_LAT = 12.9716;
    const BASE_LNG = 77.5946;

    if (navigator.geolocation) {
      // 2) Try to get real location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // User allowed location
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          console.log('User allowed location:', lat, lng);

          localStorage.setItem('userLat', lat.toString());
          localStorage.setItem('userLng', lng.toString());
        },
        (err) => {
          // User blocked or error → fallback
          console.error('Geolocation failed:', err);

          const lat = BASE_LAT + (Math.random() - 0.5) * 0.02; // ±1 km
          const lng = BASE_LNG + (Math.random() - 0.5) * 0.02;

          console.log('Using fallback location:', lat, lng);

          localStorage.setItem('userLat', lat.toString());
          localStorage.setItem('userLng', lng.toString());
        }
      );
    } else {

      // 3) Browser does NOT support geolocation → fallback
      console.error('Geolocation not supported by this browser.');

      const lat = BASE_LAT + (Math.random() - 0.5) * 0.02;
      const lng = BASE_LNG + (Math.random() - 0.5) * 0.02;

      console.log('Using fallback location:', lat, lng);

      localStorage.setItem('userLat', lat.toString());
      localStorage.setItem('userLng', lng.toString());
    }
  }



  ngOnDestroy() {
    document.body.style.overflow = 'auto'; // Restore scrolling when you leave
  }



  //  Loads all nearby jobs
  loadNearbyJobs() {
    const lat = +localStorage.getItem('userLat')!;
    const lng = +localStorage.getItem('userLng')!;
      
     console.log('hello',this.jobName)
    this.dataService.getNearbyJobs(lat, lng).subscribe(
      (result) => {
        console.log('Nearby jobs:', result);
        this.nearbyJobs = result;

        this.allJobNames = result.map(places => places.title); //  Full list
        this.nearJobNames = this.allJobNames;     
                     // show all first
   
           if (this.selectedCategory != '') {
          this.nearJobNames = this.nearbyJobs
    .filter(obj => obj.category === this.selectedCategory)
    .map(obj => obj.title);
      }
          if(this.selectedCategory == 'Any' ){
            this.allJobNames = result.map(places => places.title); //  Full list
        this.nearJobNames = this.allJobNames; 
            }
        console.log('allJobNames:', this.allJobNames);
         this.isDropdownOpen = true;
      },
      (error) => console.error('Error fetching nearby jobs:', error)
    );
  }

  //------------------ 


  filterJobs() {
    const query = this.jobName.toLowerCase();
console.log('this is filterjobs',this.jobName)
    // Corrected line: filter from all jobs always
    this.nearJobNames = this.allJobNames.filter(job =>
      job.toLowerCase().includes(query)
    );
  }


//---------


  selectJob(job: string) {
    this.jobName = job;
    this.nearJobNames = [];  // hide list after selection
  }


//---------
  ShowData(form:NgForm) {

     if(this.selectedCategory ==''){
alert('Please select a category!');
    return;
     }
 
    this.loadNearbyJobs();
    console.log('data', this.jobName);
  }


//
  @HostListener('document:click', ['$event'])
handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // If input or dropdown was clicked, do nothing
  if (target.closest('.near-me-input') || target.closest('.dropdown')) {
    //this code is to check whether u click on input field or dropdown then return nothing
     this.isDropdownOpen = true;
    return;
  
  }
this.isDropdownOpen = false;
  // Otherwise, hide dropdown
  this.nearJobNames = [];
}

againFilterNearbY(){
    if (this.selectedCategory != '') {
  this.nearJobNames = this.nearbyJobs
    .filter(obj => obj.category === this.selectedCategory)
    .map(obj => obj.title);
}
if(this.selectedCategory == 'Any' ){
             this.nearJobNames  =   this.allJobNames
}
     
}

//Sign in button function

showSignIn(form: NgForm){
  if (!form.valid) {
    console.log('Form invalid');
    return;
  }
  else{
   
  //checking login is Jobseeker or Employer
  if(this.selectedLoginAs =='Employer'){
   console.log('employer Details')
   
    this.GotoEmployer()
  }
  if(this.selectedLoginAs =='JobSeeker'){
  console.log('JobSeeker Details')
  this.GotoJobSeeker()
  }
  else{
      console.log('Email:', this.userEmail);
  console.log('Password:', this.userPassword);
  }
  }

}

//navigating to Register Page
GotoRegister(){
  if(this.selectedLoginAs =='Employer'){
   console.log('go to employer registration')
   this.router.navigate(['/register/employer'])
  }
  if(this.selectedLoginAs =='JobSeeker'){
    this.router.navigate(['/register/jobseeker'])
  }
  
}

GotoJobSeeker() {
  this.loadingService.show();
  console.log('This is jobseeker');

  this.jobseekerService.loginToJobSeeker(this.userEmail, this.userPassword).subscribe({
    next: (result) => {
      console.log('Message:', result.message);
      console.log('JobSeeker', result.jobSeekerName);
      console.log('Token:', result.token);
      console.log('jobRole', result.jobRole);
      console.log('empId', result.jobSeekerId);
      console.log('Address Name', result.jobSeekerAddress);
      console.log('Area Name', result.jobSeekerArea);
      console.log('City Name', result.jobSeekerCity);
      console.log('State Name', result.jobSeekerState);

      this.authService.authLocalJobSeekerService(
        result.jobSeekerName,
        result.jobRole,
        result.token,
        result.jobSeekerId,
        result.jobSeekerAddress,
        result.jobSeekerArea,
        result.jobSeekerCity,
        result.jobSeekerState
      );

      this.goToJObSeekerProfile();
    },
    error: (error) => {
      this.loadingService.hide();
      console.error('Login failed:', error);
      
      if (error.status === 401) {
        alert('Invalid email or password!');
      } else if (error.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('Something went wrong. Please check your internet connection.');
      }
    },
  });
}
  goToJObSeekerProfile(){
    
    console.log('this is job seeker profile')
    this.jobseekerService.getJobSeekerProfile().subscribe({
  next: (result) => {
  //  checking for authmiddleware to show whether user should be naviagated or not 
    console.log('JobSeeker Profile:', result);
    this.loadingService.hide();
      this.router.navigate(['/jobSeekerlayout/dashboard'])
  },
  error: (err) => {
    alert('problem in swithing')
    console.error('Error:', err);
    this.loadingService.hide();
  }} )
  }
GotoEmployer() {
   this.loadingService.show();
  console.log('this is employer Page')
  this.empolyerService.loginToEmployer(this.userEmail, this.userPassword)
    .subscribe(
      (result: LoginResponse) => {
       
        console.log('Message:', result.message);
          console.log('employName',result.employName)
        console.log('Token:', result.token);
         console.log('jobRole',result.jobRole)
         console.log('empId',result.empId)
          this.loadingService.hide();
        //  console.log('employerId',result.empId)
         //for storing i details in localStorage session
         //storing th local Storage using that vale
         this.authService.authLocalService(result.employName,result.jobRole,result.token,result.empId)
           
      this.GotoEmployerProfile()
      },
      (error) => {
         this.loadingService.hide();
        alert('Invalid credentials')
        console.error('Login failed:', error);
      }
    );
}

GotoEmployerProfile(){
   console.log('this is employer function')
   this.empolyerService.goToEmployerProfile().subscribe({
  next: (result) => {
    //checking for authmiddleware to show whether user should be naviagated or not 
    console.log('Employer Profile:', result);
      this.loadingService.hide();
      this.router.navigate(['/employerlayout/dashboard'])
        
  },
  error: (err) => {
      this.loadingService.hide();
    alert('problem in swithing')
    console.error('Error:', err);
      
  }}
);
}



















//////////////////////////////////////////////IMage posting
//////////////////////////////////////////////-------------------------
//////////////////////////////////////////////-------------------------
//////////////////////////////////////////////-------------------------
//////////////////////////////////////////////-------------------------
//////////////////////////////////////////////-------------------------
  fileUrl: string = '';
 userData: UserProfile = {
    name: '',
    age: null,
    city: '',
    active: false
  };

 
  selectedFile: File | null = null;
  userDetails: UserProfile[] = [];
  userName: string = '';
  // -----------------------------
  // Your other methods unchanged:
  onSubmit() {
    console.log('data', this.userData);
    this.dataService.storeData(this.userData);
  }

  getData() {
    this.dataService.getUserData(this.userName).subscribe(result => {
      console.log(result);
      this.userDetails = result;
      console.log(this.userDetails);
    });
  }
// for images
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    } else {
      console.log('image not uploaded');
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      console.log('file is not uploaded');
    } else {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this.dataService.uploadImage(formData).subscribe(result => {
        console.log(result.url);
        this.fileUrl = result.url;
      });
    }
  }

  getImage() {
    if (this.fileUrl == '') {
      console.log('not image');
    } else {
      this.onButtonClickImageShow = this.fileUrl;
    }
  }

  gotoForgotPasswordPage(){
     this.router.navigate(['/forgotPassword'])
  }
}
