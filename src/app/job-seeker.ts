export interface JobSeeker {
    Name:string,
  emailId:string,
  password:string,
  confirmPassword:string,
  contactNumber:string,
    dateOfBirth: Date; 
 Address:string,
 area:string,
 city:string,
 state:string,
  PreferJob?: string;  
  Skills?: string; 
  MaxHourPerDay?:number;
  ImageProfile?:string
}
