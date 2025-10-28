import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSeekerService } from '../job-service.service';
import { Schedule } from '../schedule';
import { JobseekerScheduleRow } from '../jobseeker-schedule-row';
import { HourMinutePipe } from '../hour-minute.pipe';
import { LoadingService } from '../loading.service';

 class maxHourEachDay {
  date:string = "";
  hour:number=0;
  remainingHours:number=0;
}

@Component({
  selector: 'app-job-seeker-inbox',
  standalone: true,
  imports: [CommonModule,FormsModule,DatePipe,HourMinutePipe],
   providers: [DatePipe], 
  templateUrl: './job-seeker-inbox.component.html',
  styleUrl: './job-seeker-inbox.component.css'
})
export class JobSeekerInboxComponent implements OnInit {

 
   todayFormatted: string = '';
   showSchedulesDiv:boolean=true;
maxHourPerDay:number=10;

PayStatusArray:string[] = ['All','Paid','Pending','No Pay']

selectedPayStatus:string=''

RemarkStatusArray:string[]=['All','Completed','Absent','Not Marked']

selectRemarkValue:string=''
selectFilterDate:string=''
isDropdownOpen: boolean = false;
isDropDownForRemark:boolean= false
toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}
toggleDropDownRemark(){
  this.isDropDownForRemark = !this.isDropDownForRemark
}
selectPayStatus(status: string) {
  this.selectedPayStatus = status;
  this.isDropdownOpen = false;
  this.onSearchChangeForHistorySchedules()
}
selectRemarkStatus(status: string){
this.selectRemarkValue = status
  this.isDropDownForRemark = false;
  this.onSearchChangeForHistorySchedules()
}
//for filtering the tables below are the varibales
searchByJobtitle:string=''
startTimeFilter: string = '';
endTimeFilter: string = '';
  //below varibale  will show the dates in which schedules are available
  singleObjectmaxHourEachDay: maxHourEachDay = { date: '', hour: 0,remainingHours:0 };

   numberOfUpcomingSchedulesDate:maxHourEachDay[]=[]
 currentDateFromSchedulesDate:string=''

  selectRequests:boolean = false;
    upcomingShifts:boolean = false;
  disabledRequests:boolean = false;
   shiftHistory:boolean = false;

totalNumberofUpcomingSchedules:number = 0

   NoofScheduleRequest:number = 0
  NoofScheduleApproved:number =0


  forFilterSchedulesData:JobseekerScheduleRow[] = []
SchedulesData:JobseekerScheduleRow[] = []

UpcomingRejectSchedule :JobseekerScheduleRow[]=[]

UpcomingShiftSchedulesData:JobseekerScheduleRow[] = []

 sampleFilterForUpcomingShiftSchedulesData:JobseekerScheduleRow[] = []
 BackUpFilterationForUpcomingShiftSchedules:JobseekerScheduleRow[]=[]

ShiftHistorySchedulesData:JobseekerScheduleRow[]=[]
BackupShiftHistoryData:JobseekerScheduleRow[]=[]
constructor(private JobSeeker:JobSeekerService,
  private datePipe: DatePipe,
    public loadingService:LoadingService
){

   this.shiftHistory= true
    this.showSchedulesDiv = true
}
ngOnInit() {
const storedValue = localStorage.getItem('showSchedulesDiv');

if (storedValue === 'true') {
  this.showSchedulesDiv = true;
} else if (storedValue === 'false') {
  this.showSchedulesDiv = false;
} else if (storedValue === '' || storedValue === null) {
  this.showSchedulesDiv = true; // when empty or not set, default to true
}
       
    this.fetchmaxHourFromJobSeeker()
   console.log('this.numberOfUpcomingSchedulesDate',this.numberOfUpcomingSchedulesDate)
 this.callSchedulesDetails()
 

 
 console.log('below is today date format',this.currentDateFromSchedulesDate)
}
 fetchmaxHourFromJobSeeker(){
   this.JobSeeker.getJobSeekerProfileDetails().subscribe({
      next: (data: any) => {
        if (data.success && data.message && data.message.result) {

         const today = new Date();
    this.todayFormatted = this.datePipe.transform(today, 'dd-MMM-yyyy') || '';
    console.log('Today:', this.todayFormatted);
  //   this.singleObjectmaxHourEachDay.date =  this.todayFormatted
  this.currentDateFromSchedulesDate = this.todayFormatted
  //         this.maxHourPerDay =  Number(data.message.result.MaxHourPerDay ?? 0);
  //    this.singleObjectmaxHourEachDay.remainingHours= this.maxHourPerDay
  //  this.numberOfUpcomingSchedulesDate.push(this.singleObjectmaxHourEachDay)

          //  Patch fetched data into the form
         console.log(' this.numberOfUpcomingSchedulesDate', this.numberOfUpcomingSchedulesDate)
        } else {
            const today = new Date();
    this.todayFormatted = this.datePipe.transform(today, 'dd-MMM-yyyy') || '';
    console.log('Today:', this.todayFormatted);
             this.maxHourPerDay = 10;
               this.currentDateFromSchedulesDate = this.todayFormatted
  //           this.singleObjectmaxHourEachDay.remainingHours= this.maxHourPerDay
  //  this.numberOfUpcomingSchedulesDate.push(this.singleObjectmaxHourEachDay)
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
 }

callSchedulesDetails(){
  
  this.JobSeeker.getJobSeekerSchedules().subscribe((res: any) => {
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
    //below study the working of this getting No of Schedule Request
     this.NoofScheduleRequest = this.SchedulesData.reduce((acc, item) => {
  return acc + item.schedules.filter(
    sche => sche.Schedulestatus === 'assigned' 
  ).length;
}, 0);
// below study the working of this getting No of Schedule request Approved
    this.NoofScheduleApproved = this.SchedulesData.reduce((acc, item) => {
  return acc + item.schedules.filter(
    sche => sche.Schedulestatus === 'accepted' 
  ).length;
}, 0);
this.forFilterSchedulesData =   this.SchedulesData
//below shows the Upcoming Shifts based on today and upcoming data 

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

    // Case 1: Schedule date > today
    if (schedDate > new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return true;
    }

    // Case 2: Schedule date == today, and endTime is still in future
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
    schedules: filteredSchedules
  };
}).filter((job: any) => job.schedules.length > 0);
console.log('this.UpcomingShiftSchedulesData')
this.BackUpFilterationForUpcomingShiftSchedules = this.UpcomingShiftSchedulesData
this.sampleFilterForUpcomingShiftSchedulesData = this.UpcomingShiftSchedulesData

    //below shows Upcoming Rejected Shifts------------------
 this.UpcomingRejectSchedule =  this.SchedulesData.map((item: any) => {
  // today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // filter schedules: only accepted + today or future
  const filteredSchedules = item.schedules.filter((sched: any) => {
    if (sched.Schedulestatus !== 'rejected') return false;

    // sched.date is "YYYY-MM-DD"
    const schedDate = new Date(sched.date);
    schedDate.setHours(0, 0, 0, 0);

    return schedDate >= today;
  });

  return {
    jobId: item.jobId,
    jobTitle: item.jobTitle,
    businessName: item.businessName,
    jobImage: item.jobImage,
    employerName: item.employerName,
    employerPhoneNumber: item.employerPhoneNumber,
    employerImgUrl: item.employerImgUrl,
    schedules: filteredSchedules
  };
})
.filter((job: any) => job.schedules.length > 0);

//below shows the data of Shift History Data
this.ShiftHistorySchedulesData = this.SchedulesData.map((job: any) => {
  const now = new Date();

  // Filter schedules that have ended and are not 'assigned'
  const filteredSchedules = job.schedules.filter((sched: any) => {
    if (!sched.date) return false;

    // Skip schedules that are still assigned
    if (sched.Schedulestatus === 'assigned' || sched.Schedulestatus=='rejected') return false;

    // Parse the date
    const [year, month, day] = sched.date.split("-").map(Number);
    let schedDateTime = new Date(year, month - 1, day); // local time

    // Add endTime for proper comparison
    if (sched.endTime) {
      const [timeStr, modifier] = sched.endTime.split(" ");
      let [hours, minutes] = timeStr.split(":").map(Number);

      // Convert 12-hour to 24-hour
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      schedDateTime.setHours(hours, minutes, 0, 0);
    } else {
      // If no endTime, assume end of day
      schedDateTime.setHours(23, 59, 59, 999);
    }

    // Only past schedules
    return schedDateTime.getTime() < now.getTime();
  });

  return {
    jobId: job.jobId,
    jobTitle: job.jobTitle,
    businessName: job.businessName,
    jobImage: job.jobImage,
    employerName: job.employerName,
    employerPhoneNumber: job.employerPhoneNumber,
    employerImgUrl: job.employerImgUrl,
    schedules: filteredSchedules,
  };
}).filter((job: any) => job.schedules.length > 0);

this.BackupShiftHistoryData = this.ShiftHistorySchedulesData
    //below study the working of this------------------
    // console.log('SchedulesData', this.SchedulesData);
    // console.log('no fo schedules Request',this.NoofScheduleRequest)
    //  console.log('no fo schedules Approved',this.NoofScheduleApproved)


//pushing the number of scheduels data into array of dates
const MAX_HOURS_PER_DAY = this.maxHourPerDay; // max allowed hours per day

const dayHoursMap = new Map<string, maxHourEachDay>();

// 1 Pre-populate today (from fetchmaxHourFromJobSeeker)
const today = new Date();
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const todayFormatted = `${String(today.getDate()).padStart(2,"0")}-${months[today.getMonth()]}-${today.getFullYear()}`;

// Add today if not already present in map
dayHoursMap.set(todayFormatted, {
  date: todayFormatted,
  hour: this.singleObjectmaxHourEachDay.hour || 0,
  remainingHours: this.maxHourPerDay
});

// 2 Loop through upcoming schedules
this.UpcomingShiftSchedulesData.forEach(job => {
  job.schedules.forEach(schedule => {
    if (!schedule.date) return;

    const dateObj = new Date(schedule.date);
    const formattedDate = `${String(dateObj.getDate()).padStart(2,"0")}-${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;
    const hoursWorked = this.calculateHours(schedule.startTime, schedule.endTime);

    if (dayHoursMap.has(formattedDate)) {
      // Update today’s schedule if it exists
      const dayData = dayHoursMap.get(formattedDate)!;
      dayData.hour += hoursWorked;
      dayData.remainingHours = MAX_HOURS_PER_DAY - dayData.hour;
    } else {
      // Only add future schedules (non-today)
      dayHoursMap.set(formattedDate, {
        date: formattedDate,
        hour: hoursWorked,
        remainingHours: MAX_HOURS_PER_DAY - hoursWorked
      });
    }
  });
});

// 3 Convert map to array
this.numberOfUpcomingSchedulesDate = Array.from(dayHoursMap.values());

console.log('Final numberOfUpcomingSchedulesDate:', this.numberOfUpcomingSchedulesDate);

console.log('this.numberOfUpcomingSchedulesDate',this.numberOfUpcomingSchedulesDate)
// Sort ascending by date
this.numberOfUpcomingSchedulesDate.sort((a, b) => {
  const parseDate = (str: string) => {
    const [day, monthStr, year] = str.split('-');
    const monthsMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    return new Date(Number(year), monthsMap[monthStr], Number(day));
  };
  return parseDate(a.date).getTime() - parseDate(b.date).getTime();
});

console.log("BackUpFilterationForUpcomingShiftSchedules :", this.BackUpFilterationForUpcomingShiftSchedules );
      console.log('UpcomingShiftSchedulesData', this.UpcomingShiftSchedulesData)
      // console.log('Upcoming Rejected SHifts',this.UpcomingRejectSchedule)
      // console.log('No of History Shifts',this.ShiftHistorySchedulesData)
       
    console.log('this.numberOfUpcomingSchedulesDate',this.numberOfUpcomingSchedulesDate)
     this.storeSelectedDate(this.todayFormatted)
       this.UpcomingRejectSchedule.forEach(item =>{
 console.log('JObId',item.jobId,'No of Rejected Scheduels',item.schedules.length)
       })
   this.UpcomingShiftSchedulesData.forEach(item=>{
 console.log('JobID',item.jobId,'No of Accepted Schedules', item.schedules.length)
});
  });


}






//below is falls under Scheduling page
showRequest(){
  this.clearVariableWhenTabSwitch()
this.selectRequests= true
  this.upcomingShifts = false;
  this.disabledRequests= false
    this.shiftHistory= false
    this.showSchedulesDiv =false
       this.callSchedulesDetails()
       console.log('numberOfUpcomingSchedulesDate',this.numberOfUpcomingSchedulesDate)
}
showupcomingShifts(){
   this.clearVariableWhenTabSwitch()
this.selectRequests= false
  this.upcomingShifts = true;
  this.disabledRequests= false
    this.shiftHistory= false
    this.showSchedulesDiv =false
    this.callSchedulesDetails()
}
showdisabledRequests(){
   this.clearVariableWhenTabSwitch()
this.selectRequests= false
  this.upcomingShifts = false;
  this.disabledRequests= true
    this.shiftHistory= false
    this.showSchedulesDiv =false
    this.callSchedulesDetails()
}
showshiftHistory(){
    this.clearVariableWhenTabSwitch()
this.selectRequests= false
  this.upcomingShifts = false;
  this.disabledRequests= false
  this.showSchedulesDiv =false
    this.shiftHistory= true;
}
clearVariableWhenTabSwitch(){
     this.startTimeFilter =''
  this.endTimeFilter=''
   this.searchByJobtitle = ''
   this.selectFilterDate=''
}

calculateHours(startTime: string, endTime: string): number {
  if (!startTime || !endTime) return 0;

  const start = new Date(`1970-01-01T${this.convertTo24Hour(startTime)}`);
  const end = new Date(`1970-01-01T${this.convertTo24Hour(endTime)}`);

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours > 0 ? parseFloat(diffHours.toFixed(2)) : 0;
}

private convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

isUpcoming(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const scheduleDate = new Date(dateStr);
  return scheduleDate >= today; // only show today + future
}

AcceptSchedule(scheduleDate: string, jobPostId: string,startTime:string,endTime:string, hour?: number) {
  this.loadingService.show()
  this.JobSeeker.GiveStatustoScheudles(scheduleDate, jobPostId, 'accepted',startTime,endTime)
    .subscribe({
      next: (result) => {
         this.loadingService.hide()
        console.log('accepted');

        // Update local data
        this.forFilterSchedulesData.forEach(job => {
          if (job.jobId === jobPostId) {
            const sched = job.schedules.find(s => s.date === scheduleDate);
            if (sched) {
              sched.Schedulestatus = 'accepted';
              sched.hoursWorked = hour || sched.hoursWorked;
            }
          }
        });
      },
      error: (err) => {
           this.loadingService.hide()
        console.error('❌ Failed to accept schedule:', err);
        alert('Failed to accept schedule. Please try again.'); // optional UI feedback
      }
    });
}

canAccept(scheduleDate: string, hoursWorked: number): boolean {

  const dateObj = new Date(scheduleDate);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const formattedDate = `${String(dateObj.getDate()).padStart(2, "0")}-${months[dateObj.getMonth()]}-${dateObj.getFullYear()}`;

  const dayEntry = this.numberOfUpcomingSchedulesDate.find(d => d.date === formattedDate);

  if (!dayEntry) {
    // No schedules yet → can accept if hours <= max
    return hoursWorked <= this.maxHourPerDay;
  }

  // Check if remaining hours for that day is enough
  return dayEntry.remainingHours >= hoursWorked;
}
RejectSchedule(scheduleDate: string, jobPostId: string,startTime:string,endTime:string) {
  this.JobSeeker.GiveStatustoScheudles(scheduleDate, jobPostId, 'rejected',startTime,endTime)
    .subscribe({
      next: (result) => {
        console.log('rejected');

        // Update local data
        this.forFilterSchedulesData.forEach(job => {
          if (job.jobId === jobPostId) {
            const sched = job.schedules.find(s => s.date === scheduleDate);
            if (sched) {
              sched.Schedulestatus = 'rejected';
            }
          }
        });
      },
      error: (err) => {
        console.error('❌ Failed to reject schedule:', err);
        alert('Failed to reject schedule. Please try again.'); // optional UI feedback
      }
    });
}
showSchedules(){
  this.showSchedulesDiv = true
  console.log(' this.currentDateFromSchedulesDate ', this.currentDateFromSchedulesDate )
  console.log('data',this.numberOfUpcomingSchedulesDate)
   this.currentDateFromSchedulesDate =   this.numberOfUpcomingSchedulesDate[0].date
   this.filterSchedulesOfMaxHour( this.currentDateFromSchedulesDate )
   
}
disableshowSchedules(){
  this.showSchedulesDiv = false
  localStorage.setItem('showSchedulesDiv',JSON.stringify(this.showSchedulesDiv ))
}
storeSelectedDate(dateSelect: string) {
  this.currentDateFromSchedulesDate = dateSelect;
  console.log('Selected Date:', this.currentDateFromSchedulesDate);
  this.filterSchedulesOfMaxHour(this.currentDateFromSchedulesDate);
}
filterSchedulesOfMaxHour(dateSelect: string) {
  console.log('this.UpcomingShiftSchedulesData', this.UpcomingShiftSchedulesData);

  if (!dateSelect) {
    // reset to full data

    this.BackUpFilterationForUpcomingShiftSchedules = [...this.UpcomingShiftSchedulesData];
    return;
  }

  // Convert "dd-MMM-yyyy" → "yyyy-MM-dd" manually
  const [dayStr, monthStr, yearStr] = dateSelect.split('-');
  const monthsMap: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const month = monthsMap[monthStr];
  const formattedDate = `${yearStr}-${month}-${dayStr.padStart(2, '0')}`;

  console.log('formattedDate', formattedDate);

  // Filter schedules by exact match
  this.BackUpFilterationForUpcomingShiftSchedules = this.UpcomingShiftSchedulesData
    .map(job => ({
      ...job,
      schedules: job.schedules.filter(s => s.date === formattedDate)
    }))
    .filter(job => job.schedules.length > 0);

  console.log('this.BackUpFilterationForUpcomingShiftSchedules', this.BackUpFilterationForUpcomingShiftSchedules);
}

// filtertaion of table below
onSearchChange() {
  const searchTerm = this.searchByJobtitle.toLowerCase();

  if (!searchTerm) {
    // if search is empty reset to original
    this.forFilterSchedulesData = this.SchedulesData;
    return;
  }

  this.forFilterSchedulesData = this.SchedulesData
    .map(job => ({
      ...job,
      schedules: job.schedules // keep schedules intact
    }))
    .filter(job => job.jobTitle.toLowerCase().includes(searchTerm));
}
// Convert 12h time ("09:17 AM") -> hour in 24h


// Convert input[type=time] value ("09:00", "16:00") -> hour in 24h
getHourFrom12h(time: string): number {
  if (!time) return -1;
  const [hhmm, modifier] = time.split(" ");
  let hour = parseInt(hhmm.split(":")[0], 10);
  if (modifier === "PM" && hour !== 12) hour += 12;
  if (modifier === "AM" && hour === 12) hour = 0;
  return hour;
}

// Convert input "21:41" -> hour only
getHourFromInput(time: string): number {
  if (!time) return -1;
  return parseInt(time.split(":")[0], 10);
}

// Filter function
onFilterChange() {
  const searchTerm = this.searchByJobtitle?.toLowerCase() || '';
  const startHour = this.getHourFromInput(this.startTimeFilter); // -1 if empty
  const endHour = this.getHourFromInput(this.endTimeFilter);     // -1 if empty

  // Convert selected date string -> Date (ignoring time part)
  let selectedDate: Date | null = null;
  if (this.selectFilterDate) {
    selectedDate = new Date(this.selectFilterDate);
    selectedDate.setHours(0, 0, 0, 0); // normalize
  }

  this.forFilterSchedulesData = this.SchedulesData
    .map(job => {
      const filteredSchedules = job.schedules.filter(sched => {
        const matchesTitle = !searchTerm || job.jobTitle.toLowerCase().includes(searchTerm);

        // Time check
        const schedStartHour = this.getHourFrom12h(sched.startTime);
        const schedEndHour = this.getHourFrom12h(sched.endTime);

        let matchesTime = true;
        if (startHour >= 0 && schedStartHour !== startHour) matchesTime = false;
        if (endHour >= 0 && schedEndHour !== endHour) matchesTime = false;

        // Date check
        let matchesDate = true;
        if (selectedDate) {
          const [year, month, day] = sched.date.split('-').map(Number);
          const schedDate = new Date(year, month - 1, day);
          schedDate.setHours(0, 0, 0, 0);

          matchesDate = schedDate.getTime() === selectedDate.getTime();
        }

        return matchesTitle && matchesTime && matchesDate;
      });

      return { ...job, schedules: filteredSchedules };
    })
    .filter(job => job.schedules.length > 0);

  console.log('this.forFilterSchedulesData', this.forFilterSchedulesData);
}
 getHour24(timeStr: string | null): number {
  if (!timeStr) return -1;

  // Input type="time" gives "HH:MM" (24-hour)
  if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
    const [hh] = timeStr.split(":").map(Number);
    return hh;
  }

  // Schedule format: "HH:MM AM/PM"
  const [hm, modifier] = timeStr.split(" ");
  let [hh] = hm.split(":").map(Number);
  if (modifier === "PM" && hh < 12) hh += 12;
  if (modifier === "AM" && hh === 12) hh = 0;
  return hh;
}

onSearchChangeForUpcomingSchedules() {
  const searchTerm = this.searchByJobtitle?.trim().toLowerCase() || '';
  console.log('this.UpcomingShiftSchedulesData',this.UpcomingShiftSchedulesData)
this.sampleFilterForUpcomingShiftSchedulesData = [...this.UpcomingShiftSchedulesData];
  this.sampleFilterForUpcomingShiftSchedulesData = this.UpcomingShiftSchedulesData
    .filter(job =>
      !searchTerm || job.jobTitle.toLowerCase().includes(searchTerm)
    );

  console.log('Filtered', this.sampleFilterForUpcomingShiftSchedulesData);
}

FilterChangeInUpcomingShift() {
  // Helper: convert time (HH:MM or HH:MM AM/PM) to 24-hour hour
  const getHour24 = (timeStr: string | null): number => {
    if (!timeStr) return -1;

    // Input from type="time" is "HH:MM"
    if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
      const [hh] = timeStr.split(":").map(Number);
      return hh;
    }

    // Schedule format: "HH:MM AM/PM"
    const [hm, modifier] = timeStr.split(" ");
    let [hh] = hm.split(":").map(Number);
    if (modifier === "PM" && hh < 12) hh += 12;
    if (modifier === "AM" && hh === 12) hh = 0;
    return hh;
  };

  const startHourFilter = this.startTimeFilter ? getHour24(this.startTimeFilter) : null;
  const endHourFilter = this.endTimeFilter ? getHour24(this.endTimeFilter) : null;

  const selectedDate = this.selectFilterDate ? new Date(this.selectFilterDate) : null;
  if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

  // Filter schedules for each job
  this.sampleFilterForUpcomingShiftSchedulesData = this.UpcomingShiftSchedulesData
    .map(job => {
      const filteredSchedules = job.schedules.filter(sched => {
        let matches = true;

        // Start time filter
        if (startHourFilter !== null && getHour24(sched.startTime) !== startHourFilter) matches = false;

        // End time filter
        if (endHourFilter !== null && getHour24(sched.endTime) !== endHourFilter) matches = false;

        // Date filter
        if (selectedDate) {
          const [year, month, day] = sched.date.split("-").map(Number);
          const schedDate = new Date(year, month - 1, day);
          schedDate.setHours(0, 0, 0, 0);
          if (schedDate.getTime() !== selectedDate.getTime()) matches = false;
        }

        return matches;
      });

      return { ...job, schedules: filteredSchedules };
    })
    .filter(job => job.schedules.length > 0); // remove jobs with no schedules

  this.upcomingShifts = true;
  console.log('Filtered Upcoming Schedules:', this.sampleFilterForUpcomingShiftSchedulesData);
}
onSearchChangeForHistorySchedules() {
  // Keep original backup data
  this.BackupShiftHistoryData = this.ShiftHistorySchedulesData;

  const searchTerm = this.searchByJobtitle?.trim().toLowerCase() || '';

  // Convert input time to hour + AM/PM for comparison
  const parseHourAMPM = (timeStr: string | null): string | null => {
    if (!timeStr) return null;
    const [hh] = timeStr.split(":").map(Number);
    const hour = hh % 12 === 0 ? 12 : hh % 12; // convert 24h to 12h
    const ampm = hh >= 12 ? "PM" : "AM";
    return `${hour} ${ampm}`;
  };

  const startFilter = parseHourAMPM(this.startTimeFilter);
  const endFilter = parseHourAMPM(this.endTimeFilter);

  // Date filter
  const selectedDate = this.selectFilterDate ? new Date(this.selectFilterDate) : null;
  if (selectedDate) selectedDate.setHours(0, 0, 0, 0);

  // Map dropdown labels -> backend values
  const statusMap: { [key: string]: string } = {
    'Paid': 'paid',
    'Pending': 'pending',
    'Partial': 'partial',
    'No Pay': 'nopay'
  };
   const remarkMap: { [key: string]: string } = {
    'Completed': 'completed',
    'Absent': 'absent',
    'Not Marked': 'accepted'
  };

  this.BackupShiftHistoryData = this.ShiftHistorySchedulesData
    .map(job => {
      const filteredSchedules = job.schedules.filter(sched => {
        let matches = true;

        // Job title filter
        if (searchTerm && !job.jobTitle.toLowerCase().includes(searchTerm)) {
          matches = false;
        }

        // Start time filter
        if (startFilter) {
          const schedStartHour = sched.startTime.split(":")[0];
          const schedStartAMPM = sched.startTime.split(" ")[1];
          const schedStartStr = `${+schedStartHour} ${schedStartAMPM}`;
          if (schedStartStr !== startFilter) matches = false;
        }

        // End time filter
        if (endFilter) {
          const schedEndHour = sched.endTime.split(":")[0];
          const schedEndAMPM = sched.endTime.split(" ")[1];
          const schedEndStr = `${+schedEndHour} ${schedEndAMPM}`;
          if (schedEndStr !== endFilter) matches = false;
        }

        // Date filter
        if (selectedDate) {
          const [year, month, day] = sched.date.split("-").map(Number);
          const schedDate = new Date(year, month - 1, day);
          schedDate.setHours(0, 0, 0, 0);
          if (schedDate.getTime() !== selectedDate.getTime()) matches = false;
        }

        //  Pay Status filter (from dropdown)
        if (this.selectedPayStatus && this.selectedPayStatus !== 'All') {
          const expected = statusMap[this.selectedPayStatus]?.toLowerCase() || '';
          const schedPay = sched.paymentStatus ? sched.paymentStatus.toLowerCase() : '';
          if (schedPay !== expected) {
            matches = false;
          }
        }

        //  NEW: Filter based on PayStatusArray (same logic for dropdown remark)
          if (this.selectRemarkValue && this.selectRemarkValue !== 'All') {
          const expectedRemark = remarkMap[this.selectRemarkValue]?.toLowerCase() || '';
          const schedStatus = sched.Schedulestatus ? sched.Schedulestatus.toLowerCase() : '';
          if (schedStatus !== expectedRemark) matches = false;
        }

        return matches;
      });

      return { ...job, schedules: filteredSchedules };
    })
    .filter(job => job.schedules.length > 0);

  console.log('Filtered', this.BackupShiftHistoryData);
}




}
