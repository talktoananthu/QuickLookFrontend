import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  authLocalService(userName:string,jobRole:string,token:string,employerId:string){
    
       localStorage.setItem('username', userName);
  localStorage.setItem('role', jobRole);
  localStorage.setItem('token', token);
  if(jobRole=='Employer'){
 localStorage.setItem('empId',employerId)
  }
  else{
   // localStorage.setItem('JobSeekerId',JobSeekerId)
  }
  
 
  console.log('Auth data saved in localStorage!');
  }
    authLocalJobSeekerService(userName:string,jobRole:string,token:string,
      jobSeekerId:string,address:string,
       area:string,
       city:string,
        state:string,
    ){
    
       localStorage.setItem('usernameJobSeeker', userName);
  localStorage.setItem('roleJobSeeker', jobRole);
  localStorage.setItem('tokenJobSeeker', token);
  localStorage.setItem('JObSeekeraddress', address)
    localStorage.setItem('JObSeekerArea', area)
      localStorage.setItem('JObSeekerCity', city)
        localStorage.setItem('JObSeekerState', state)
  if(jobRole=='JobSeeker'){
 localStorage.setItem('JobSeekerId',jobSeekerId)
  }
  else{
   // localStorage.setItem('JobSeekerId',JobSeekerId)
  }
   
 
  console.log('Auth data saved in localStorage!');
  }
}
