import { HttpInterceptorFn } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable,timer  } from 'rxjs';
import { LoadingService } from './loading.service';
import { inject } from '@angular/core';
import { finalize, switchMap } from 'rxjs/operators';
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //getting toke from 

 
 //req  is actually backend url

   const token = localStorage.getItem('token');
   const role = localStorage.getItem('roleJobSeeker');
    const tokenJobSeeker = localStorage.getItem('tokenJobSeeker')
   console.log('token',tokenJobSeeker)




 //  Only attach token for specific backend URL(s)
  if (
    token &&
    req.url.includes('https://quicklookbackendserver.onrender.com/employerProfile')
  ) {
    console.log('this is interceptor')
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  } 
   if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/JobSeekerProfile')) {
    console.log('this is interceptor')
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenJobSeeker}`
      }
    });
    return next(authReq);
  } 
  console.log(' Intercepted request URL:', req.url);
  if(token && req.url.includes('https://quicklookbackendserver.onrender.com/employerPost')) 
    {
        console.log('this is interceptor for postjob');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
    if(token && req.url.includes('https://quicklookbackendserver.onrender.com/postedJobs')) 
    {
        console.log('this is interceptor is posted job');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
    if(token && req.url.includes('https://quicklookbackendserver.onrender.com/updatePostedJob')) 
    {
        console.log('this is interceptor is posted job');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
     if(token && req.url.includes('https://quicklookbackendserver.onrender.com/getEmpProfile')) 
    {
        console.log('this is interceptor to get Employer Profile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
    if(token && req.url.includes('https://quicklookbackendserver.onrender.com/updateEmpProfile')) 
    {
        console.log('this is interceptor to update Employer Profile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
    
       if(tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/storeJobSeekerProfile')) 
    {
        console.log('this is interceptor to get JobSeeker Profile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
        
       if(tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/JobSeekerAvailableJobs')) 
    {
        console.log('this is interceptor to get AvailableJobs');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
        
       if(tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/JobSeekerApplication')) 
    {
        console.log('this is interceptor to put applicants fetails the jobPost they applied');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
          
       if(token && req.url.includes('https://quicklookbackendserver.onrender.com/getApplicantsDetails')) 
    {
        console.log('this is interceptor to get applicants Details');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
            
       if(token && req.url.includes('https://quicklookbackendserver.onrender.com/hiredOrRejectApplicant')) 
    {
        console.log('this is interceptor to accept or reject applicant');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
        if(token && req.url.includes('https://quicklookbackendserver.onrender.com/assignedScehdulesToApplicant')) 
    {
        console.log('this is interceptor to assign accepted Scehdules applicant');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }
if (token && req.url.includes('https://quicklookbackendserver.onrender.com/assignAttendanceToApplicant')) {
  console.log('this is interceptor to assign Attendance applicant');

  const loader = inject(LoadingService);
  loader.show(); // show loader immediately

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });

  return next(authReq).pipe(
    switchMap(res =>
      // ensure loader stays for at least 3s
      timer(1000).pipe(switchMap(() => [res]))
    ),
    finalize(() => loader.hide())
  );
}
       if(tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/getSchedules')) 
    {
        console.log('this is interceptor to JobSeeker Schedules');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    } 
       if(tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/statusSchedules')) 
    {
        console.log('this is interceptor to give Status to Schedules');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    } 

 if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/gettingAppliedJobStatus')) {
  console.log('this is interceptor to  getApplicationStatus');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}
 if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/JobSeekerProfileDetails')) {
  console.log('this is interceptor to get JobSeekerProfileDetails');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}
 if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/updateJobSeekerProfile')) {
  console.log('this is interceptor to update JobSeekerProfile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/getNotficationForJobSeeker')) {
  console.log('this is interceptor to get notification for JobSeekerProfile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/makeJobSeekerNotificationTrue')) {
  console.log('this is interceptor to make notification true');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (tokenJobSeeker && req.url.includes('https://quicklookbackendserver.onrender.com/deleteNotificationForJobSeeker')) {
  console.log('this is interceptor to make notification true');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenJobSeeker}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (token && req.url.includes('https://quicklookbackendserver.onrender.com/getNotificationForEmployer')) {
  console.log('this is interceptor to get notification for Employerprofile');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (token && req.url.includes('https://quicklookbackendserver.onrender.com/makeEmployerNotificationTrue')) {
  console.log('this is interceptor to make employer notification true');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

if (token && req.url.includes('https://quicklookbackendserver.onrender.com/deleteNotificationForEmployer')) {
  console.log('this is interceptor to make notification true');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
}

     if(token && req.url.includes('https://quicklookbackendserver.onrender.com/updatePaymentToApplicant')) 
    {
        console.log('this is interceptor to update Payment to Applicant');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      Jobrole: role || ''
    }
  });
  return next(authReq);
    }



    
     

    
  else{
    console.log('No token present')
     return next(req);
  }

  

 
};
