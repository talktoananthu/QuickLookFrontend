import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSeekerService } from '../job-service.service';
import { JobseekerScheduleRow } from '../jobseeker-schedule-row';
import { Schedule } from '../schedule';

@Component({
  selector: 'app-job-seeker-calendar',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './job-seeker-calendar.component.html',
  styleUrl: './job-seeker-calendar.component.css'
})
export class JObSeekerCalendarComponent  implements OnInit{

 upComingDates:string[]=[] //date should be in this format '2025-10-05'
 fromDate:string=''
 toDate:string=''
 todayDate:string=''

disableRangeButton:boolean = true;

 NoOfSchedulestoday:number=0;
 NoOfJobTypesToday:number=0
  activeButton: string | null = null;
 showMonth:boolean= false;
 showWeek:boolean= false;
 showDay:boolean= false;
SchedulesData:JobseekerScheduleRow[] = []
UpcomingShiftSchedulesData:JobseekerScheduleRow[] = []

  constructor(private jobSeekerService:JobSeekerService){
    
  }
  ngOnInit(){
     this.callSchedules()
  this.showWeek =true;
   const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  this.todayDate = `${yyyy}-${mm}-${dd}`;
    this.DateForStoringWeek();
  // ensure there are at least 7 dates
  if (this.upComingDates.length >= 7) {
    this.fromDate = this.upComingDates[0];
    this.toDate = this.upComingDates[6];
  }
  }
callSchedules(){
     
   //below is funtion for calling th 
  this.jobSeekerService.getJobSeekerSchedules().subscribe((res: any) => {
    console.log('raw result', res);

  

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
          const dateCheck = `${yyyy}-${mm}-${dd}`;
   
    // Map backend data to match JobseekerScheduleRow interface
     //  remove empty ones first other wise error will show if Schedules are mepty or null
   this.SchedulesData = res.data  
.map((item: any) => ({
    jobId: item.jobId,
    jobTitle: item.jobTitle,
    businessName: item.businessName,
    jobImage: item.jobImage,
    employerName: item.employerName,
    employerPhoneNumber: item.employerPhoneNumber,
    employerImgUrl: item.employerImgUrl,
    schedules: item.schedules
  }));
    console.log('SchedulesData',this.SchedulesData)
    this.activeButton ='AllSchedules'
  
this.NoOfSchedulestoday = 0;
const uniqueJobIds = new Set<string>();//it will store string unique way


this.SchedulesData.forEach(data => {
  
  data.schedules.forEach(sche => {
    if (sche.date === dateCheck && sche.Schedulestatus === 'accepted') {
      this.NoOfSchedulestoday += 1;
      uniqueJobIds.add(data.jobId); // keep track of job types
    }
  });
});

this.NoOfJobTypesToday = uniqueJobIds.size;

console.log('NoOfSchedulestoday:', this.NoOfSchedulestoday);
console.log('NoOfJobTypesToday:', this.NoOfJobTypesToday);

console.log('NoOfSchedulestoday', this.NoOfSchedulestoday);
console.log('NoOfJobTypesToday',this.NoOfJobTypesToday)



})

  

}

callUpcomingSchedules() {
  this.upComingDates = [];

  this.jobSeekerService.getJobSeekerSchedules().subscribe((res: any) => {
    console.log('raw result', res);

    //  Step 1: Filter out empty schedule data
    this.SchedulesData = res.data.map((item: any) => ({
        jobId: item.jobId,
        jobTitle: item.jobTitle,
        businessName: item.businessName,
        jobImage: item.jobImage,
        employerName: item.employerName,
        employerPhoneNumber: item.employerPhoneNumber,
        employerImgUrl: item.employerImgUrl,
        schedules: item.schedules,
      }));

    console.log('SchedulesData', this.SchedulesData);

    //  Step 2: Filter only accepted & future (or ongoing today) schedules
    this.UpcomingShiftSchedulesData = this.SchedulesData.map((item: any) => {
      const now = new Date();

      const filteredSchedules = item.schedules.filter((sched: any) => {
        if (sched.Schedulestatus !== 'accepted') return false;

        // Parse date "YYYY-MM-DD"
        const [year, month, day] = sched.date.split('-').map(Number);
        const schedDate = new Date(year, month - 1, day);

        // Parse endTime into Date for proper comparison
        const [endTimeStr, endModifier] = sched.endTime.split(' ');
        let [endHours, endMinutes] = endTimeStr.split(':').map(Number);
        if (endModifier === 'PM' && endHours < 12) endHours += 12;
        if (endModifier === 'AM' && endHours === 12) endHours = 0;

        const schedEndDateTime = new Date(schedDate);
        schedEndDateTime.setHours(endHours, endMinutes, 0, 0);

        // Case 1: Future date
        if (schedDate > new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
          return true;
        }

        // Case 2: Today but not ended yet
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (schedDate.getTime() === today.getTime()) {
          return schedEndDateTime >= now;
        }

        return false;
      });

      return {
        jobId: item.jobId,
        jobTitle: item.jobTitle,
        businessName: item.businessName,
        jobImage: item.jobImage,
        employerName: item.employerName,
        employerPhoneNumber: item.employerPhoneNumber,
        employerImgUrl: item.employerImgUrl,
        schedules: filteredSchedules,
      };
    }).filter((job: any) => job.schedules.length > 0);

    console.log('UpcomingShiftSchedulesData', this.UpcomingShiftSchedulesData);

    // Step 3: Collect unique dates — limit to 7
    this.upComingDates = [];
    for (const data of this.UpcomingShiftSchedulesData) {
      for (const sched of data.schedules) {
        if (!this.upComingDates.includes(sched.date)) {
          this.upComingDates.push(sched.date);
        }
        // Stop adding once we have 7 unique dates
        if (this.upComingDates.length >= 7) break;
      }
      if (this.upComingDates.length >= 7) break;
    }

    //  Step 4: Sort and set date range
    this.upComingDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    this.fromDate = this.upComingDates[0];
    this.toDate = this.upComingDates[this.upComingDates.length - 1];

    console.log('upComingDates (max 7):', this.upComingDates);
  });
}


// Check if a job has a schedule for the given date
hasScheduleAccpeted(job: JobseekerScheduleRow,date: string): boolean{
  return false
}


hasScheduleForDate(job: JobseekerScheduleRow, date: string): boolean {
  return job.schedules?.some(sch => sch.date === date) ?? false;
}

getShiftTime(job: JobseekerScheduleRow, date: string): string {
  const sched = job.schedules?.find(
    sch => sch.date === date 
  );
  if (!sched) return 'No Shift';
  return `${sched.startTime} - ${sched.endTime}`;
}

getShiftStatus(job: JobseekerScheduleRow, date: string): string {
  const sched = job.schedules?.find(sch => sch.date === date);
  if (!sched) return 'No Schedule';

  const today = new Date();
  const scheduleDate = new Date(sched.date);

  if (sched.Schedulestatus === 'rejected') return 'Rejected';
  if (sched.Schedulestatus === 'completed') return 'Completed';
if (sched.Schedulestatus === 'absent') return 'Absent';
  if (sched.Schedulestatus === 'accepted') {
    // ✅ If schedule is today
    if (scheduleDate.toDateString() === today.toDateString()) {
      const now = today.getHours() * 60 + today.getMinutes();
      const [sh, sm] = sched.startTime.split(':').map(Number);
      const [eh, em] = sched.endTime.split(':').map(Number);
      const startMins = sh * 60 + sm;
      const endMins = eh * 60 + em;

      if (now >= startMins && now <= endMins) return 'In Progress';
      if (now > endMins) return 'Pending'; // changed to pending
    }

    //  If date is in the future
    if (scheduleDate > today) return 'Ongoing';

    //  If date already passed and still accepted → Pending
    if (scheduleDate < today) return 'Pending';
  }

  return 'No Status';
}

showMonthTrue(){
  this.showMonth =true;
  this.showDay =false;
  this.showWeek = false;
}
showWeekTrue(){
  this.showMonth =false;
  this.showDay =false;
  this.showWeek = true;
   this.DateForStoringWeek()
 this.callSchedules()
}
showDayTrue(){
    this.showMonth =false;
  this.showDay =true;
  this.showWeek = false;
  this.callSingleDaySchedules()
}
  NextValue(){
   
    if(this.showWeek){
       this.DateForStoringWeek()
      //create Next Week Value
    }
   
  }
  DateForStoringWeek(){
     this.upComingDates = []; // reset first

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i); // add i days to today's date

    // Format as YYYY-MM-DD
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, '0');
    const day = String(nextDate.getDate()).padStart(2, '0');

    const formatted = `${year}-${month}-${day}`;
    this.upComingDates.push(formatted);
    console.log('this.upComingDates',this.upComingDates)
  }

  console.log('Upcoming Dates:', this.upComingDates);
  this.fromDate = this.upComingDates[0]
  this.toDate = this.upComingDates[6]
  console.log('this.fromDate',this.fromDate)
   
  }

formatDateDisplay(isoDate?: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d); // local date at midnight
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }); // e.g. "Mon, Sep 18, 2025"
}
CalculatePrevWeek() {
  

  if(this.activeButton =='upcoming'){
     
  }
else{
const prevSeven = 7;

  if (this.upComingDates.length > 0) {
    // Get the first date in the current list
    const firstDate = new Date(this.upComingDates[0]);

    // Go back 7 days from that date
    firstDate.setDate(firstDate.getDate() - prevSeven);

    // Create an array of 7 previous dates
    const newDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(firstDate);
      d.setDate(firstDate.getDate() + i);
      const formattedDate = d.toISOString().split("T")[0]; // yyyy-mm-dd
      newDates.push(formattedDate);
    }

    // Replace upcoming dates
    this.upComingDates = newDates;

      setTimeout(() => this.activeButton = 'AllSchedules', 150); // resetting opacity
       this.fromDate = this.upComingDates[0];
    this.toDate = this.upComingDates[6];
  }
    this.callSchedules()
}
  

}
CalculateNextWeek() {
  this.activeButton = 'AllSchedules'
  const nextSeven = 7;

  if (this.upComingDates.length > 0) {
    // Get the last date in the list
    const lastDate = new Date(this.upComingDates[this.upComingDates.length - 1]);

    // Move forward by 1 day (the next week start)
    lastDate.setDate(lastDate.getDate() + 1);

    // Generate next 7 days
    const newDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(lastDate);
      d.setDate(lastDate.getDate() + i);
      const formattedDate = d.toISOString().split("T")[0];
      newDates.push(formattedDate);
    }

    this.upComingDates = newDates;
      setTimeout(() => this.activeButton = 'AllSchedules', 150); // resetting  opacity
       this.fromDate = this.upComingDates[0];
    this.toDate = this.upComingDates[6];
  }
      this.callSchedules()
}

CalculateNextWeekUpcomingSchedules(){

}
CalculatePrevWeekUpcomingSchedules(){
  
}



  DatesofUpcomingSchedules(){
    this.activeButton = 'upcoming'
    this.callUpcomingSchedules()
  }
  closeUpcoming(event: MouseEvent){
      event.stopPropagation();
     this.activeButton = 'AllSchedules'
     this.callSchedules()
     this.DateForStoringWeek();
  }
  onDateChange() {
  console.log('Selected date:', this.todayDate);
  this.callSingleDaySchedules()
}
openNativePicker(input: HTMLInputElement) {
  input.showPicker?.(); // modern browsers allow this to open date picker programmatically
}

callSingleDaySchedules(){
  this.upComingDates = []
  this.upComingDates.push(this.todayDate)
     this.jobSeekerService.getJobSeekerSchedules().subscribe((res: any) => {
    console.log('raw result', res);

    // Map backend data to match JobseekerScheduleRow interface
   this.SchedulesData = res.data
  .filter((item: any) => item.schedules && item.schedules.length > 0)
   //  remove empty ones first other wise error will show if Schedules are mepty or null
  .map((item: any) => ({
    jobId: item.jobId,
    jobTitle: item.jobTitle,
    businessName: item.businessName,
    jobImage: item.jobImage,
    employerName: item.employerName,
    employerPhoneNumber: item.employerPhoneNumber,
    employerImgUrl: item.employerImgUrl,
    schedules: item.schedules
  }));
    console.log('SchedulesData',this.SchedulesData)
    this.activeButton ='AllSchedules'

})
}

}
