import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EmployerService } from '../employer-service.service';
import { ApplicantsDetails } from '../applicants-details';
import { Schedule } from '../schedule';
import { SampleApplicantDetail } from '../sample-applicant-detail';
import { LoadingService } from '../loading.service';
// .table-cell { 
//   padding: 10px 18px;
//   vertical-align: top; /* changed from middle */
//   line-height: 1.4;
//   text-align: left;
//   border-bottom: 1px solid #eaeaea;
//   transition: background 0.2s;
// }
@Component({
  selector: 'app-employer-applicants',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './employer-applicants.component.html',
  styleUrl: './employer-applicants.component.css'
})
export class EmployerApplicants implements OnInit {

EmployerName:string =''
EmployerPhoneNo:number=0
EmployerImageUrl:string= '' 

showScheduleAssign:boolean=false;


activeTab: string = 'worklog'; // default employees applied schedule

applicantsDetails:ApplicantsDetails[] =[]
appliedTabApplicantsFilter:ApplicantsDetails[] =[]
subActive: string = 'payment'; // default subActive payment employeeStatus

showAttendanceWOrkLog:boolean= false

   
searchJobTitle:string=''

   showDateOptions: boolean = false;
  isDropdownOpen: boolean = false;

 isDropDownForEmpTabWorkStatus:boolean= false

acceptedApplicants:ApplicantsDetails[] =[]

filteredAcceptedApplicants:ApplicantsDetails[] =[]

 allAcceptedApplicants:ApplicantsDetails[] =[]

showPayStatus:boolean= false;
  statuses: string[] = ['All', 'Assigned','Accepted','Rejected'];
  workStatus:string[] = ['All','Worked','Not Marked','Ongoing','Absent']

  hiredStatus:string[] = [ 'All','Assigned','Pending'] //fro Emplyee tab with hired
  EmployerStatus:string[] = [ 'All','Completed','Ongoing','Partially','Absent','Pending'] //fro Emplyee tab in Employer status
  payStatus:string[] = ['All', 'Pay','No Pay']
  empStaus:string [] = ['Completed','Absent','Not marked']
    selectedStatus: string = 'All';
     
 empPayStatusSelected:string='All'
  empTabStatusSelected:string='All'
SelectedWorkStatus:string ='All'
 selectedOption: string = 'Single Day';
dateOptions: string[] = ['Single Day', 'Multiple Days'];

//belongs to Emp Tab
workStatusInPaymentEmpTab=['All','Completed','Absent','Not marked']
selectworkStatusInPaymentEmpTab='All'
//belongs to Emp Tab   End------------
startTimeApplicant:string= ''
endTimeApplicant:string=''
startTime:string=''
endTime:string =''
singleDate:string=''
fromDate: string = '';
toDate: string = '';


//variable for ScheduleTypes
selectSubScheduleStatus: boolean = true;
selectSubSchedulePending: boolean = false;
  sentSchedules: Schedule[] = [];
   sentSingleSchedules: Schedule = {} as Schedule;
   scheduleForm!: FormGroup;
     

  today: string = '';
  showSelectedApplicantDetails:ApplicantsDetails = {} as ApplicantsDetails

singleDayActive:boolean = true
multipleDayActive:boolean = false

//
showWorkLogApplicantName:string= ''
showWorkLogApplicantJobTitle:string =''
showWorkLogApplicantImg:string=''
showWorkLogApplicantDate:string=''
showWorkLogApplicantId:string=''
showWorkLogJobPostId:string=''


selectedOptionTable: 'Single' | 'Multiple' = 'Single';  
singleDateTable: string = '';
fromDateTable: string = '';
toDateTable: string = '';

todayString: string='';
sevenDaysAgoString: string='';
thirtyDaysAheadString: string='';
fiftentDaysAgoString:string=''
setActive(tab: string) {
 this.SelectedWorkStatus = 'All'
  this.selectedStatus = 'All'
  this.startTime = '',
  this.endTime = ''
  this.singleDateTable ='',
  this.fromDateTable='',
  this.toDateTable=''
  this.activeTab = tab;
  localStorage.setItem('activeTab',tab)
    this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
        this.appliedTabApplicantsFilter= result
        console.log(' Applicants Details',this.applicantsDetails)
        //  this.acceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus === 'accepted');
        this.allAcceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus == 'accepted');
        console.log('acceptedApplicants',  this.allAcceptedApplicants)
        // console.log('Accepted APplicants for hired', this.acceptedApplicants)
           this.filterUpcomingAcceptedApplicants();
        
    })
}

setActive2(tab: string) {
  this.empTabStatusSelected = 'All'
  this.subActive = tab;
  this.selectedOptionTable = 'Single'
  this.singleDateTable = ''
  this.toDateTable=''
  localStorage.setItem('subActive',this.subActive)
}
isLoadingTo = this.loadingService.loading$;

 constructor(private employerService: EmployerService,
             private fb: FormBuilder,
             public loadingService: LoadingService
 ){
 const storedTab = localStorage.getItem('activeTab');
this.activeTab = storedTab ? storedTab : 'worklog';
 

   

 }

  ngOnInit(){
    
      const savedTab = localStorage.getItem('SubScheduleTab');
       
   const employeSubTab = localStorage.getItem('subActive');

if (!employeSubTab || employeSubTab === '') {
  this.subActive = 'hired';
} else {
  this.subActive = employeSubTab;
}

  if (savedTab === 'selectSubSchedulePending') {
    this.selectSubSchedulePending = true;
    this.selectSubScheduleStatus = false;
  } else {
    // Default to Status tab
    this.selectSubScheduleStatus = true;
    this.selectSubSchedulePending = false;
  }
        const currentDate = new Date();
             const today = new Date();
  this.todayString = today.toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    const fifteenDaysAgo= new Date();
      fifteenDaysAgo.setDate(today.getDate() - 15);
      this.fiftentDaysAgoString = fifteenDaysAgo.toISOString().split('T')[0];
  sevenDaysAgo.setDate(today.getDate() - 7);
  this.sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];

  // 30 days ahead    
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(today.getDate() + 30);
  this.thirtyDaysAheadString = thirtyDaysAhead.toISOString().split('T')[0];
this.scheduleForm = this.fb.group({
   // optional
  singleDate: [''],
  fromDate: [''],
  toDate: [''],
  startTime: ['', Validators.required],
  endTime: ['', Validators.required]
}, { 
  validators: [
    this.scheduleModeValidator.bind(this), 
    this.dateRangeValidator, 
      this.timeRangeValidator.bind(this)  
  ] 
});


    this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
         this.appliedTabApplicantsFilter= result
        console.log(' Applicants Details',this.applicantsDetails)
             
            
 this.allAcceptedApplicants = this.applicantsDetails.filter(
  a => a.applicationStatus?.trim().toLowerCase() == 'accepted'
);

this.acceptedApplicants = this.allAcceptedApplicants;
     console.log(' this.allAcceptedApplicants', this.allAcceptedApplicants)
          this.acceptedApplicants = this.allAcceptedApplicants
          console.log(' this.acceptedApplicants ', this.acceptedApplicants )
           //fcuntion for filtering the data of accepted table shown in Hired Table 
             this.filterUpcomingAcceptedApplicants();
        
        
    })

     this.employerService.getEmployerProfile().subscribe(result => {
      this.EmployerName = result.personName;
    this.EmployerImageUrl = result.profileImg || '../../assets/profile.png';
    this.EmployerPhoneNo = result.contactNumber
  });



  }

 ShowScheduleStatus(){
  this.selectSubScheduleStatus = true;
  this.selectSubSchedulePending = false;
  localStorage.setItem('SubScheduleTab', 'selectSubScheduleStatus');
 }
  ShowSchedulePending(){
     console.log('this is pending');
  this.selectSubScheduleStatus = false;
  this.selectSubSchedulePending = true;
  localStorage.setItem('SubScheduleTab', 'selectSubSchedulePending');
 }

filterUpcomingAcceptedApplicants() {
  // Filter only accepted applicants
  this.acceptedApplicants = this.applicantsDetails
    .filter(a => a.applicationStatus?.trim().toLowerCase() === 'accepted');

  // Use the same array for the table display
  this.filteredAcceptedApplicants = [...this.acceptedApplicants];

  console.log('Accepted Applicants:', this.acceptedApplicants);
}
// Group consecutive schedule dates
groupConsecutiveDates(schedules: any[]) {
  if (!schedules || schedules.length === 0) return [];

  schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const grouped: { start: string, end: string }[] = [];
  let start = schedules[0].date;
  let end = schedules[0].date;

  for (let i = 1; i < schedules.length; i++) {
    const prevDate = new Date(end);
    const currDate = new Date(schedules[i].date);
    const nextDay = new Date(prevDate);
    nextDay.setDate(prevDate.getDate() + 1);

    if (currDate.getTime() === nextDay.getTime()) {
      end = schedules[i].date;
    } else {
      grouped.push({ start, end });
      start = schedules[i].date;
      end = schedules[i].date;
    }
  }

  grouped.push({ start, end });
  return grouped;
}

// Helper: get days between two dates
getDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.floor((e.getTime() - s.getTime()) / (1000*60*60*24)) + 1;
}


activeSingleDay() {
  this.singleDayActive = true;
  this.multipleDayActive = false;

  // Clear multiple date validators
  this.scheduleForm.get('fromDate')?.clearValidators();
  this.scheduleForm.get('toDate')?.clearValidators();

  // Add validator to single date
  this.scheduleForm.get('singleDate')?.setValidators([Validators.required]);

  // Update value & validity
  this.scheduleForm.get('singleDate')?.updateValueAndValidity();
  this.scheduleForm.get('fromDate')?.updateValueAndValidity();
  this.scheduleForm.get('toDate')?.updateValueAndValidity();

  // Clear values
  this.scheduleForm.patchValue({ fromDate: '', toDate: '' });
}

activeMultipleDay() {
  this.singleDayActive = false;
  this.multipleDayActive = true;

  // Clear single date validator
  this.scheduleForm.get('singleDate')?.clearValidators();

  // Add validators to multiple date fields
  this.scheduleForm.get('fromDate')?.setValidators([Validators.required]);
  this.scheduleForm.get('toDate')?.setValidators([Validators.required]);

  // Update value & validity
  this.scheduleForm.get('singleDate')?.updateValueAndValidity();
  this.scheduleForm.get('fromDate')?.updateValueAndValidity();
  this.scheduleForm.get('toDate')?.updateValueAndValidity();

  // Clear single date value
  this.scheduleForm.patchValue({ singleDate: '' });
}


  // ✅ Either singleDate OR (fromDate + toDate) is required

// Either singleDate OR (fromDate + toDate) is required
scheduleModeValidator(group: AbstractControl) {
  const singleDate = group.get('singleDate')?.value;
  const fromDate = group.get('fromDate')?.value;
  const toDate = group.get('toDate')?.value;

  if (this.singleDayActive && !singleDate) {
    return { requiredSingleDate: true };
  }

  if (this.multipleDayActive && (!fromDate || !toDate)) {
    return { requiredRange: true };
  }

  return null;
}

  // ✅ Ensure toDate >= fromDate
 dateRangeValidator(group: AbstractControl) {
  const from = group.get('fromDate')?.value;
  const to = group.get('toDate')?.value;

  if (from && to && new Date(to) < new Date(from)) {
    return { invalidRange: true };
  }

  return null;
}

timeRangeValidator(group: FormGroup): ValidationErrors | null {
  const startControl = group.get('startTime');
  const endControl = group.get('endTime');

  const startTime = startControl?.value;
  const endTime = endControl?.value;
  const singleDate = group.get('singleDate')?.value || group.get('fromDate')?.value;

  const today = new Date();
  const selDate = singleDate ? new Date(singleDate) : null;

  // Prepare errors objects and preserve existing required errors
  const errorsStart: ValidationErrors = startControl?.hasError('required') ? { required: true } : {};
  const errorsEnd: ValidationErrors = endControl?.hasError('required') ? { required: true } : {};

  if (startTime && selDate) {
    const [startH, startM] = startTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const nowTotal = today.getHours() * 60 + today.getMinutes();

    if (selDate.toDateString() === today.toDateString() && startTotal < nowTotal) {
      errorsStart['startInPast'] = true;
    }
  }

  if (endTime && selDate) {
    const [endH, endM] = endTime.split(':').map(Number);
    const endTotal = endH * 60 + endM;
    const nowTotal = today.getHours() * 60 + today.getMinutes();

    if (selDate.toDateString() === today.toDateString() && endTotal < nowTotal) {
      errorsEnd['endInPast'] = true;
    }
  }

  // Check invalid range only if both start and end exist
  if (startTime && endTime) {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal >= endTotal) {
      errorsStart['invalidTimeRange'] = true;
      errorsEnd['invalidTimeRange'] = true;
    }
  }

  // Assign errors independently
  startControl?.setErrors(Object.keys(errorsStart).length ? errorsStart : null);
  endControl?.setErrors(Object.keys(errorsEnd).length ? errorsEnd : null);

  return null; // form-level validator return is optional here
}


  



hiredApplicant(applicantId: string, JobPostId: string) {
  this.employerService.hireApplicants(applicantId, JobPostId).subscribe(() => {
    const applicant = this.applicantsDetails.find(a => a.applicantId === applicantId && a.jobId==JobPostId);
    if (applicant) applicant.applicationStatus = 'accepted';
   

  });
}

rejectApplicant(applicantId: string, JobPostId: string) {
  this.employerService.rejectApplicants(applicantId, JobPostId).subscribe(() => {
    const applicant = this.applicantsDetails.find(a => a.applicantId === applicantId && a.jobId==JobPostId);
    if (applicant) applicant.applicationStatus = 'rejected';
  });
}
  // Job Days: short weekdays
getScheduleDays(schedules?: { date: string }[]): { start: string; end?: string } | null {
  if (!schedules || schedules.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time

  // filter only today or future dates
  const upcomingDates = schedules
    .map(s => new Date(s.date))
    .filter(d => d.getTime() >= today.getTime())
    .sort((a, b) => a.getTime() - b.getTime());

  if (upcomingDates.length === 0) return null; // nothing to show

  const first = upcomingDates[0];
  const last = upcomingDates[upcomingDates.length - 1];

  const start = this.getWeekdayName(first);
  const end = upcomingDates.length > 1 ? this.getWeekdayName(last) : undefined;

  return { start, end };
}

private getWeekdayName(date: Date): string {
  return date.toLocaleString('en-US', { weekday: 'short' }); // e.g. Mon, Tue, Wed
}

  // Assigned Dates: full dates
getAssignedDates(schedules?: { date: string }[]): { start: string; end?: string; days: number }[] {
  if (!schedules || schedules.length === 0) return [];

  // convert to Date objects & sort
  const sorted = schedules
    .map(s => new Date(s.date))
    .sort((a, b) => a.getTime() - b.getTime());

  const results: { start: string; end?: string; days: number }[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = sorted[i - 1];

    const diff = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      end = current; // still consecutive
    } else {
      results.push(this.buildRangeObject(start, end));
      start = end = current;
    }
  }

  results.push(this.buildRangeObject(start, end));

  // ✅ filter ranges: only include those where end >= today
  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time
  return results.filter(r => {
    const endDate = r.end ? new Date(r.end) : new Date(r.start);
    return endDate.getTime() >= today.getTime();
  });
}

private buildRangeObject(start: Date, end: Date) {
  const sameDay = start.getTime() === end.getTime();
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  let startStr: string;
  let endStr: string | undefined;

  if (sameDay) {
    startStr = `${start.getDate()} ${this.getMonthName(start)} ${start.getFullYear()}`;
    endStr = undefined;
  } else if (sameMonth) {
    startStr = `${start.getDate()}`;
    endStr = `${end.getDate()} ${this.getMonthName(end)} ${end.getFullYear()}`;
  } else {
    startStr = `${start.getDate()} ${this.getMonthName(start)}`;
    endStr = `${end.getDate()} ${this.getMonthName(end)} ${end.getFullYear()}`;
  }

  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return { start: startStr, end: endStr, days };
}

private getMonthName(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' });
}

  // Format weekday (Mon, Tue, etc.)
  formatWeekday(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Format full date (Aug 26, 2025)
  formatFullDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Determine status dynamically
 getApplicantStatus(schedules?: { date: string }[]): 'Assigned' | 'Pending' {
  if (!schedules || schedules.length === 0) return 'Pending';

  const today = new Date();
  today.setHours(0, 0, 0, 0); // ignore time

  // Check if there is any schedule today or in the future
  const hasUpcoming = schedules.some(s => new Date(s.date).getTime() >= today.getTime());

  return hasUpcoming ? 'Assigned' : 'Pending';
}
getStatusClassHired(schedules?: { date: string }[]): string {
  const status = this.getApplicantStatus(schedules)?.trim().toLowerCase();

  switch (status) {
    case 'pending':
      return 'empStatusHired-pending';
    case 'assigned':
      return 'empStatusHired-assigned';
    default:
      return 'empStatusHired-pending';
  }
}
  // Return CSS class for status badge

 getApplicantStatusEmpStatus(schedules?: Schedule[]): string {
  if (!schedules || schedules.length === 0) return 'Pending';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workedDays = schedules.filter(s => s.Schedulestatus === 'completed').length;
  const absentDays = schedules.filter(s => s.Schedulestatus === 'absent').length;

  const lastDate = new Date(schedules[schedules.length - 1].date);
  lastDate.setHours(0, 0, 0, 0);

  if (lastDate > today) return 'Ongoing';
  if (workedDays === 0 && absentDays > 0) return 'Absent';
  if (workedDays >= 1 && absentDays >= 1) return 'Partially Completed';
  if (workedDays > 0 && absentDays === 0) return 'Completed';

  return 'Pending';
}

getStatusClass(schedules?: Schedule[]): string {
  const status = this.getApplicantStatusEmpStatus(schedules)?.trim().toLowerCase();

  switch (status) {
    case 'pending':
      return 'empStatus-pending';
    case 'ongoing':
      return 'empStatus-ongoing';
    case 'partially completed':
      return 'empStatus-partialDays';
    case 'completed':
      return 'empStatus-completedDays';
    case 'absent':
      return 'empStatus-absentDays';
    default:
      return 'empStatus-pending';
  }
}

  getShiftTime(schedules?: Schedule[]): string {
    if (!schedules || schedules.length === 0) {
      return '-';
    }
    return schedules
      .map(s => `${s.startTime} - ${s.endTime} (${s.Schedulestatus})`)
      .join(', ');
  }

isPendingSchedule(applicant: ApplicantsDetails): boolean {
  if (!applicant.schedules || applicant.schedules.length === 0) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  // Find the latest schedule date //studey this logic
  // and how is it working (latest, current) in this parameter the return value goes 
  // to latest and current actually checks the next value
  //  right latest updates from the resutl current value is
  //  updated on iteration from map array
  const latestScheduleDate = applicant.schedules
    .map(s => {
      const d = new Date(s.date);
      d.setHours(0, 0, 0, 0);
      return d;
    })
    .reduce((latest, current) => (current > latest ? current : latest));

  // If the latest schedule date is before today → pending
  return latestScheduleDate < today;
}
hasNoPendingApplicants(): boolean {
  if (!this.filteredAcceptedApplicants || this.filteredAcceptedApplicants.length === 0) {
    return true; // no applicants at all
  }

  return !this.filteredAcceptedApplicants.some(applicant =>
    !applicant.schedules || applicant.schedules.length === 0 || this.isPendingSchedule(applicant)
  );
}


  //  Handle schedule edit
editSchedule(applicant: ApplicantsDetails, applicantId: string, JobPostId: string, schedule?: Schedule) {
  //  Filter the correct applicant
console.log('this.allAcceptedApplicants',this.allAcceptedApplicants)
  const selectedApplicant = this.allAcceptedApplicants.find(
    a => a.applicantId === applicantId && a.jobId === JobPostId,
 
  );

  if (!selectedApplicant) {
    console.warn('Applicant not found!');
    return;
  }
   this.showScheduleAssign = true
  //  Store in showSelectedApplicantDetails
  this.showSelectedApplicantDetails = selectedApplicant;

  //  Use a local variable for your existing logic
  const targetApplicant = this.showSelectedApplicantDetails;

  // ----------- Updated: No alerts, just assignments -----------

  if (schedule) {
    // Editing existing schedule
    const newStatus = schedule.Schedulestatus; // 👈 replace with value from your form
    if (newStatus === 'assigned' || newStatus === 'completed' || newStatus === 'absent') {
      schedule.Schedulestatus = newStatus;
    }

    const newStartTime = schedule.startTime; // 👈 replace with value from your form
    if (newStartTime) schedule.startTime = newStartTime;

    const newEndTime = schedule.endTime; // 👈 replace with value from your form
    if (newEndTime) schedule.endTime = newEndTime;

    const newRemarks = schedule.remarks || ''; // 👈 replace with value from your form
    if (newRemarks !== null) schedule.remarks = newRemarks;

  } else {
    // Adding new schedule
    const dateInput = ''; // 👈 replace with form value
    const startTime = ''; // 👈 replace with form value
    const endTime = '';   // 👈 replace with form value

    if (dateInput && startTime && endTime) {
      const newSchedule: Schedule = {
        date: dateInput,
        startTime,
        endTime,
        Schedulestatus: 'assigned'
     

      };
      if (!targetApplicant.schedules) {
        targetApplicant.schedules = [];
      }
      targetApplicant.schedules.push(newSchedule);
    }
  }
}
formatTimeTo12Hour(time: string): string {
  if (!time) return '';
  const date = new Date(`1970-01-01T${time}:00`);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}


AssignSchedule(
  applicantId: string,
  JobPostId: string,
  payment: string,
  singleDay?: string,
  fromDate?: string,
  toDate?: string
) {
  if (!payment) return;

  const numericPayment = parseInt(payment, 10);

  const createSchedule = (date: string): Schedule => ({
    date,
    startTime: this.formatTimeTo12Hour(this.scheduleForm.get('startTime')?.value),
    endTime: this.formatTimeTo12Hour(this.scheduleForm.get('endTime')?.value),
    Schedulestatus: 'assigned',
    paymentForDay: numericPayment,
    paymentStatus: 'pending',
   
  });

  const schedulesToSend: Schedule[] = [];

  if (singleDay) schedulesToSend.push(createSchedule(singleDay));
  if (fromDate && toDate) {
    for (let d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) {
      schedulesToSend.push(createSchedule(d.toISOString().split('T')[0]));
    }
  }

  //  Always create a fresh plain object before sending
  const plainSchedules = schedulesToSend.map(s => ({
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    Schedulestatus: s.Schedulestatus,
    paymentForDay: s.paymentForDay,
    paymentStatus: s.paymentStatus
      

  }));

  const assignedScheduleData = {
    applicantDetailId: applicantId,
    JobPostDetailsId: JobPostId,
    schedules: plainSchedules,
    
  };

  console.log('Sending to backend:', JSON.stringify(assignedScheduleData, null, 2));
 this.loadingService.show();
  this.employerService.assignScheduleRaw(assignedScheduleData).subscribe(() => {
    console.log('Schedules saved successfully');
    this.scheduleForm.reset();
    this.showScheduleAssign = false
    this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
        this.appliedTabApplicantsFilter= result
         this.loadingService.hide();
        console.log(' Applicants Details',this.applicantsDetails)
        //  this.acceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus === 'accepted');
        this.allAcceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus == 'accepted');
        console.log('acceptedApplicants',  this.allAcceptedApplicants)
        // console.log('Accepted APplicants for hired', this.acceptedApplicants)
           this.filterUpcomingAcceptedApplicants();
           
        
    })
  });
}


//time Restriction
getMinTime(controlName: 'startTime' | 'endTime'): string {
  const today = new Date();
  const selectedDate = this.scheduleForm.get('singleDate')?.value || this.scheduleForm.get('fromDate')?.value;
  if (!selectedDate) return '00:00';

  const selDate = new Date(selectedDate);

  const hh = today.getHours().toString().padStart(2, '0');
  const mm = today.getMinutes().toString().padStart(2, '0');
  const nowTime = hh + ':' + mm;

  if (
    selDate.getFullYear() === today.getFullYear() &&
    selDate.getMonth() === today.getMonth() &&
    selDate.getDate() === today.getDate()
  ) {
    if (controlName === 'endTime') {
      const startTime = this.scheduleForm.get('startTime')?.value || '00:00';
      // Compare numeric minutes
      const [startH, startM] = startTime.split(':').map(Number);
      const [nowH, nowM] = [today.getHours(), today.getMinutes()];

      const minH = Math.max(startH, nowH);
      const minM = minH === nowH ? Math.max(startM, nowM) : startM;

      return `${minH.toString().padStart(2, '0')}:${minM.toString().padStart(2, '0')}`;
    }

    // For startTime
    return nowTime;
  }

  return '00:00';
}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    
  }
 toggleDropdownForWorkStautsInEmpTab(){
      this.isDropDownForEmpTabWorkStatus = !this.isDropDownForEmpTabWorkStatus;
 }
 

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.isDropdownOpen = false; // close dropdown after selection
    this.filterApplicants()
  }
   selectHiredStatus(status: string): void {
    this.empTabStatusSelected = status;
    this.isDropdownOpen = false; // close dropdown after selection
    this.filterEmpApplicants()
  }
   selectEmpStatus(status: string): void {
    this.empTabStatusSelected = status;
    this.isDropdownOpen = false; // close dropdown after selection
    this.filterApplicantsEmpStatus()
  }
 
    selectPayStatus(status: string): void {
    this.empTabStatusSelected = status;
  
    this.isDropdownOpen = false; // close dropdown after selection
    this.filterApplicantsPayStatus()
  }
  selectEmpStatusOfpayWork(status: string):void{
    this.isDropDownForEmpTabWorkStatus= false
      this.selectworkStatusInPaymentEmpTab = status
          this.filterApplicantsPayStatus()
  }
toggleDateOptions(): void {
  this.showDateOptions = !this.showDateOptions;
   this.filterApplicants()
}

setDateOption(option: string): void {
  this.selectedOption = option;
  this.showDateOptions = false;
    this.filterApplicants();
}
  selectForWorkStatus(status: string){
   this.SelectedWorkStatus = status
   this.isDropdownOpen = false;
      this.filterApplicants();
  }
closeAssignSchedule(){
    this.showSelectedApplicantDetails = {} as ApplicantsDetails;
}
//fileration in Schdule tab
inputTimeToHourAMPM(time: string): string {
  let [hours, _] = time.split(':').map(Number); // ignore minutes
  const modifier = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const hourStr = hours < 10 ? '0' + hours : '' + hours;
  return hourStr + ' ' + modifier; // e.g., "07 AM"
}

time12HourOnly(time12: string): string {
  const [time, modifier] = time12.split(' '); // "07:36" and "AM"/"PM"
  const hour = time.split(':')[0];
  return hour + ' ' + modifier; // e.g., "07 AM"
}

///////////---
filterAppliedApplicants() {
  const term = this.searchJobTitle?.trim().toLowerCase();

  let filtered = [...this.applicantsDetails];

  // 1️⃣ Filter by Job Title
  if (term) {
    filtered = filtered.filter(applicant =>
      applicant.jobTitle.toLowerCase().includes(term)
    );
  }

  // Helper to convert 12-hour time to hours (ignore minutes)
  const getHourFrom12h = (time12h: string) => {
    if (!time12h) return -1;
    const [time, modifier] = time12h.split(' ');
    let [hours, _minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours;
  };

  // Helper to convert 24-hour input to hours
  const getHourFromInput = (time24h: string) => {
    if (!time24h) return -1;
    const [hours, _minutes] = time24h.split(':').map(Number);
    return hours;
  };

  // 2️⃣ Filter by Start Time (compare hours only)
  if (this.startTime) {
    const inputHour = getHourFromInput(this.startTime);
    filtered = filtered.filter(applicant =>
      getHourFrom12h(applicant.applicantsShiftStartTime) === inputHour
    );
  }

  // 3️⃣ Filter by End Time (compare hours only)
  if (this.endTime) {
    const inputHour = getHourFromInput(this.endTime);
    filtered = filtered.filter(applicant =>
      getHourFrom12h(applicant.applicantsShiftEndTime) === inputHour
    );
  }

  // 4️⃣ Update filtered array
  this.appliedTabApplicantsFilter = filtered;
}
convertToMinutes(time12h: string) {
  if (!time12h) return 0;
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

// Convert input type="time" (24-hour) to total minutes
convertInputTimeToMinutes(time24h: string) {
  if (!time24h) return 0;
  const [hours, minutes] = time24h.split(':').map(Number);
  return hours * 60 + minutes;
}




filterApplicants() {
  let data = [...this.allAcceptedApplicants]; 
  const today = new Date();

  const minAllowed = new Date();
  minAllowed.setDate(today.getDate() - 7);

  const maxAllowed = new Date();
  maxAllowed.setDate(today.getDate() + 30);

  console.log('this is filterApplicants', data);

  // 1️⃣ Job Title Filter
  if (this.searchJobTitle.trim()) {
    const term = this.searchJobTitle.trim().toLowerCase();
    data = data.filter(a => a.jobTitle.toLowerCase().includes(term));
  }

  // 2️⃣ Shift Time Filter
  if (this.startTime) {
    const inputHour = this.inputTimeToHourAMPM(this.startTime);
    data = data.filter(applicant =>
      applicant.schedules?.some(schedule =>
        this.time12HourOnly(schedule.startTime) === inputHour
      )
    );
  }

  if (this.endTime) {
    const inputEndHour = this.inputTimeToHourAMPM(this.endTime);
    data = data.filter(applicant =>
      applicant.schedules?.some(schedule =>
        this.time12HourOnly(schedule.endTime) === inputEndHour
      )
    );
  }

  // 3️⃣ Status Filter
if (this.selectedStatus !== 'All') {
  const status = this.selectedStatus.toLowerCase();
  const today = new Date();
  today.setHours(0,0,0,0);

  data = data
    .map(applicant => {
      const schedules = applicant.schedules || [];

      // Pending check: only if all schedules are past and none are accepted/assigned/rejected
      const isPending = !schedules.length || 
        (schedules.every(s => new Date(s.date) <= today) &&
         schedules.every(s => !['accepted','assigned','rejected'].includes(s.Schedulestatus)));

      if (status === 'pending') {
        return isPending ? { ...applicant } : null;
      } else {
        // For other statuses, filter schedules by that status
        const filteredSchedules = schedules.filter(s => s.Schedulestatus.toLowerCase() === status);
        return filteredSchedules.length > 0 ? { ...applicant, schedules: filteredSchedules } : null;
      }
    })
    .filter(a => a !== null) as ApplicantsDetails[];
}

  // 4️⃣ Date Filter
  if (this.selectedOption === 'Single Day' && this.singleDate) {
    const selectedDateStr = new Date(this.singleDate).toISOString().split('T')[0];

    data = data
      .map(applicant => {
        const filteredSchedules = applicant.schedules?.filter(schedule => {
          const schedDate = new Date(schedule.date).toISOString().split('T')[0];
          return schedDate === selectedDateStr;
        }) || [];
        return { ...applicant, schedules: filteredSchedules };
      })
      .filter(applicant => applicant.schedules.length > 0);
  } else if (this.selectedOption === 'Multiple Days' && this.fromDate && this.toDate) {
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    data = data
      .map(applicant => {
        const filteredSchedules = applicant.schedules?.filter(schedule => {
          const schedDate = new Date(schedule.date);
          return schedDate >= from && schedDate <= to;
        }) || [];
        return { ...applicant, schedules: filteredSchedules };
      })
      .filter(applicant => applicant.schedules.length > 0);
  }

  // 5️⃣ Work Status Filter
  if (this.SelectedWorkStatus !== 'All') {
    const selected = this.SelectedWorkStatus.toLowerCase();

    data = data
      .map(applicant => {
        if (!applicant.schedules || applicant.schedules.length === 0) return applicant;

        const filteredSchedules = applicant.schedules.filter(schedule => {
          const currentStatus = this.getScheduleStatus(schedule).status.toLowerCase();
          return currentStatus === selected;
        });

        return { 
          ...applicant, 
          schedules: filteredSchedules.length ? filteredSchedules : [] 
        };
      })
      .filter(applicant => applicant.schedules && applicant.schedules.length > 0);
  }

  // 6️⃣ Single Date Table
  if (this.selectedOptionTable === 'Single' && this.singleDateTable) {
    const selectedDate = new Date(this.singleDateTable);
    if (selectedDate >= minAllowed && selectedDate <= maxAllowed) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];

      data = data
        .map(applicant => {
          const filteredSchedules = applicant.schedules?.filter(schedule => {
            const schedDate = new Date(schedule.date).toISOString().split('T')[0];
            return schedDate === selectedDateStr;
          }) || [];
          return { ...applicant, schedules: filteredSchedules };
        })
        .filter(applicant => applicant.schedules.length > 0);
    } else {
      data = []; // invalid date outside range
    }
  }

  // 7️⃣ Multiple Dates Table
  else if (
    this.selectedOptionTable === 'Multiple' &&
    this.fromDateTable &&
    this.toDateTable
  ) {
    const from = new Date(this.fromDateTable);
    const to = new Date(this.toDateTable);

    if (from < minAllowed) from.setTime(minAllowed.getTime());
    if (to > maxAllowed) to.setTime(maxAllowed.getTime());

    if (from <= to) {
      data = data
        .map(applicant => {
          const filteredSchedules = applicant.schedules?.filter(schedule => {
            const schedDate = new Date(schedule.date);
            return schedDate >= from && schedDate <= to;
          }) || [];
          return { ...applicant, schedules: filteredSchedules };
        })
        .filter(applicant => applicant.schedules.length > 0);
    } else {
      data = [];
    }
  }
  
  this.filteredAcceptedApplicants = [...data];
  console.log('this filterdata', this.filteredAcceptedApplicants);
}
//for filteration in hired
filterEmpApplicants(): void {
  // only run this logic if you are in employees → hired tab
  if (this.activeTab === 'employees' && this.subActive === 'hired') {
    let data = [...this.allAcceptedApplicants]; 

    // 🔎 Job title search filter
    if (this.searchJobTitle && this.searchJobTitle.trim() !== '') {
      const search = this.searchJobTitle.trim().toLowerCase();
      data = data.filter(applicant =>
        applicant.jobTitle?.toLowerCase().includes(search)
      );
    }

    // 🔎 Status filter
    if (this.empTabStatusSelected !== 'All') {
      const selected = this.empTabStatusSelected;

      data = data.filter(applicant => {
        // Assigned / Pending
        if (selected === 'Assigned' || selected === 'Pending') {
          const status = this.getApplicantStatus(applicant.schedules);
          return status === selected;
        }

        // Work-based statuses
        const empStatus = this.getApplicantStatusEmpStatus(applicant.schedules);
        return empStatus === selected;
      });
    }

    this.filteredAcceptedApplicants = [...data];
    console.log('this hired filterdata', this.filteredAcceptedApplicants);
  }
}
//for filteration in Emp Status
filterApplicantsEmpStatus(): typeof this.applicantsDetails {
  // 1️⃣ Work on a copy of the original array
  let data = [...this.applicantsDetails];

  // 🔎 Job title search filter
  if (this.searchJobTitle && this.searchJobTitle.trim() !== '') {
    const search = this.searchJobTitle.trim().toLowerCase();
    data = data.filter(item =>
      item.jobTitle?.toLowerCase().includes(search)
    );
  }

  // 2️⃣ Status filter
  if (this.empTabStatusSelected && this.empTabStatusSelected !== 'All') {
    data = data.filter(item => {
      const status = this.getApplicantStatusEmpStatus(item.schedules || []);
      return status === this.empTabStatusSelected;
    });
  }

  return data;
}

filterApplicantsPayStatus() {
  if (!this.allAcceptedApplicants || this.allAcceptedApplicants.length === 0) return [];

  const now = new Date();

  let result: {
    applicant: ApplicantsDetails;
    date: string;
    startTime: string;
    endTime: string;
    hoursWorked: number;
    Schedulestatus: string;
    paymentForDay: number;
    paymentStatusLabel: string;
  }[] = [];

  this.allAcceptedApplicants.forEach(applicant => {
    if (!applicant.schedules || applicant.schedules.length === 0) return;

    applicant.schedules.forEach(schedule => {
      if (schedule.Schedulestatus === 'rejected' || schedule.Schedulestatus === 'assigned') return;

      const scheduleDate = new Date(schedule.date);

      const [endHourStr, endMinStr] = schedule.endTime.split(/:| /);
      let endHour = parseInt(endHourStr, 10);
      const endMin = parseInt(endMinStr, 10);
      if (schedule.endTime.toLowerCase().includes('pm') && endHour !== 12) endHour += 12;
      if (schedule.endTime.toLowerCase().includes('am') && endHour === 12) endHour = 0;

      scheduleDate.setHours(endHour, endMin, 0, 0);

   if (scheduleDate <= now) {
  let paymentStatusLabel = 'No Pay';

  if (schedule.Schedulestatus === 'completed') {
    if (schedule.paymentStatus === 'pending') {
      paymentStatusLabel = 'Pay';
    } else if (schedule.paymentStatus === 'paid') {
      paymentStatusLabel = 'Paid';
    }
  } else if (schedule.Schedulestatus === 'absent') {
    paymentStatusLabel = 'No Pay';
  }

  result.push({
    applicant,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    hoursWorked: schedule.hoursWorked || 0,
    Schedulestatus: schedule.Schedulestatus === 'accepted' ? 'Not Marked' : schedule.Schedulestatus,
    paymentForDay: schedule.paymentForDay || 0,
    paymentStatusLabel
  });
}
    });
  });

  // 🔎 Filter by job title input
  if (this.searchJobTitle && this.searchJobTitle.trim() !== '') {
    const search = this.searchJobTitle.trim().toLowerCase();
    result = result.filter(r => r.applicant.jobTitle?.toLowerCase().includes(search));
  }

  // 🔎 Filter by pay status dropdown
  if (this.empTabStatusSelected && this.empTabStatusSelected !== 'All') {
    result = result.filter(r => r.paymentStatusLabel === this.empTabStatusSelected);
  }

  // 🔎 Filter by work status dropdown
  if (this.selectworkStatusInPaymentEmpTab && this.selectworkStatusInPaymentEmpTab !== 'All') {
    result = result.filter(r => {
      switch (this.selectworkStatusInPaymentEmpTab) {
        case 'Completed':
          return r.Schedulestatus === 'completed';
        case 'Absent':
          return r.Schedulestatus === 'absent';
        case 'Not marked':
          return r.Schedulestatus === 'accepted';
        default:
          return true;
      }
    });
  }

  // 🔎 Filter by date selection
  if (this.selectedOptionTable === 'Single' && this.singleDateTable) {
    const selected = new Date(this.singleDateTable);
    selected.setHours(0,0,0,0);
    result = result.filter(r => {
      const scheduleDate = new Date(r.date);
      scheduleDate.setHours(0,0,0,0);
      return scheduleDate.getTime() === selected.getTime();
    });
  } else if (this.selectedOptionTable === 'Multiple' && this.fromDateTable && this.toDateTable) {
    const from = new Date(this.fromDateTable);
    from.setHours(0,0,0,0);
    const to = new Date(this.toDateTable);
    to.setHours(23,59,59,999);
    result = result.filter(r => {
      const scheduleDate = new Date(r.date);
      return scheduleDate >= from && scheduleDate <= to;
    });
  }

  // Sort by applicant name and date
  result.sort((a, b) => {
    if (a.applicant.applicantName < b.applicant.applicantName) return -1;
    if (a.applicant.applicantName > b.applicant.applicantName) return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return result;
}
onPayClick(jobApplciantId:string, JobPostId:string, date:string){
  this.loadingService.show()
  console.log('Clicked Pay button', jobApplciantId, JobPostId, date); // check this
  this.employerService.updatePayment(jobApplciantId, JobPostId, date).subscribe({
    next: result => {
      console.log('Completed Payment', result);
   
    this.loadingService.hide()
    this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
         this.appliedTabApplicantsFilter= result
        console.log(' Applicants Details',this.applicantsDetails)
             
            
 this.allAcceptedApplicants = this.applicantsDetails.filter(
  a => a.applicationStatus?.trim().toLowerCase() == 'accepted'
);

this.acceptedApplicants = this.allAcceptedApplicants;
     console.log(' this.allAcceptedApplicants', this.allAcceptedApplicants)
          this.acceptedApplicants = this.allAcceptedApplicants
          console.log(' this.acceptedApplicants ', this.acceptedApplicants )
           //fcuntion for filtering the data of accepted table shown in Hired Table 
             this.filterUpcomingAcceptedApplicants();
        
        
    })
    },
    error: err => {
      console.error('Error in updatePayment:', err);
    }
  });
}


// component.ts
getScheduleStatus(schedule: any): { status: string, showEdit: boolean, statusClass: string } {
  const now = new Date();
  const scheduleDate = new Date(schedule.date);

  const parseTime = (timeStr: string, dateObj: Date) => {
    if (!timeStr) return null;
    const m = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const period = m[3].toUpperCase();
    if (period === 'PM' && hh !== 12) hh += 12;
    if (period === 'AM' && hh === 12) hh = 0;
    const d = new Date(dateObj);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const normalizeClass = (s: string) =>
    (s || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')   // convert spaces to dashes
      .replace(/[^a-z0-9\-]/g, ''); // remove unexpected chars

  // If schedule was completed -> show Worked
  if (schedule.Schedulestatus === 'completed') {
    const status = 'Worked';
    return { status, showEdit: false, statusClass: normalizeClass(status) };
  }

  if (schedule.Schedulestatus === 'accepted') {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const start = parseTime(schedule.startTime, scheduleDate);
    const end = parseTime(schedule.endTime, scheduleDate);

    // 🔹 Case 1: if today
    if (scheduleDate.toDateString() === now.toDateString()) {
      if (end && now > end) {
        const status = 'Not Marked';
        return { status, showEdit: true, statusClass: normalizeClass(status) };
      }
      if (start && now < start) {
        const status = 'Ongoing';
        return { status, showEdit: false, statusClass: normalizeClass(status) };
      }
      if (start && end && now >= start && now <= end) {
        const status = 'Ongoing';
        return { status, showEdit: false, statusClass: normalizeClass(status) };
      }
      // fallback
      return { status: 'Ongoing', showEdit: false, statusClass: normalizeClass('Ongoing') };
    }

    // 🔹 Case 2: future
    if (scheduleDate.getTime() > todayStart.getTime()) {
      const status = 'Ongoing';
      return { status, showEdit: false, statusClass: normalizeClass(status) };
    }

    // 🔹 Case 3: past → FIXED to Not Marked
    return { status: 'Not Marked', showEdit: true, statusClass: normalizeClass('Not Marked') };
  }

  // fallback: show raw status
  const fallback = schedule.Schedulestatus || 'Unknown';
  return { status: fallback, showEdit: false, statusClass: normalizeClass(fallback) };
}
AttendanceWorkLog(applicantId:string,jobPostId:string,scheduleDate:string){
     
     console.log('applicantId', applicantId);
  console.log('jobPostId', jobPostId);
  console.log('scheduleDate', scheduleDate);
  this.showWorkLogApplicantId=applicantId
this.showWorkLogJobPostId =jobPostId
  // Find the matching applicant by applicantId + jobPostId
  const applicant = this.acceptedApplicants.find(a =>
    a.applicantId === applicantId && a.jobId === jobPostId
  );

  if (applicant) {
    this.showWorkLogApplicantName = applicant.applicantName;
    this.showWorkLogApplicantJobTitle = applicant.jobTitle;
    this.showWorkLogApplicantImg = applicant.imgProfile;
    this.showWorkLogApplicantDate=scheduleDate
  }
     this.showAttendanceWOrkLog =!this.showAttendanceWOrkLog
}
GiveWorkLogAttendance(){
  if(this.showWorkLogApplicantId &&this.showWorkLogJobPostId &&this.showWorkLogApplicantDate){
   console.log('WorkLogApplicantId',this.showWorkLogApplicantId)
    console.log('WorkLogJobPostId',this.showWorkLogJobPostId)
     let AttendannecStatus = 'completed'
    this.employerService.givePresentAttedance(this.showWorkLogApplicantId,this.showWorkLogJobPostId,this.showWorkLogApplicantDate,AttendannecStatus).subscribe(result=>{
       console.log('attendance approved')
       
       this.CloseAttendance()
         this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
        console.log(' Applicants Details',this.applicantsDetails)
         this.acceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus === 'accepted');
         this.filteredAcceptedApplicants =this.acceptedApplicants
         console.log('accepted applicants',this.acceptedApplicants)
    })
    })
  }
}
GiveAbsentAttendance(){
   if(this.showWorkLogApplicantId &&this.showWorkLogJobPostId &&this.showWorkLogApplicantDate){
   console.log('WorkLogApplicantId',this.showWorkLogApplicantId)
    console.log('WorkLogJobPostId',this.showWorkLogJobPostId)
     let AttendannecStatus = 'absent'
    this.employerService.givePresentAttedance(this.showWorkLogApplicantId,this.showWorkLogJobPostId,this.showWorkLogApplicantDate,AttendannecStatus).subscribe(result=>{
       console.log('attendance approved')
       
       this.CloseAttendance()
         this.employerService.getAppliedApplicants().subscribe(result=>{
        this.applicantsDetails =result
        console.log(' Applicants Details',this.applicantsDetails)
         this.acceptedApplicants = this.applicantsDetails.filter(a => a.applicationStatus === 'accepted');
         this.filteredAcceptedApplicants =this.acceptedApplicants
         console.log('accepted applicants',this.acceptedApplicants)
    })
    })
  }
}
CloseAttendance(){
  this.showAttendanceWOrkLog =!this.showAttendanceWOrkLog
}
//study the working of this function 
filterAcceptedApplicantsEmpStatus(): {
  applicant: ApplicantsDetails,
  rangeSchedules: Schedule[],
  start: string,
  end?: string,
  days: number,
  isPast: boolean
}[] {
  if (!this.applicantsDetails) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let result: {
    applicant: ApplicantsDetails,
    rangeSchedules: Schedule[],
    start: string,
    end?: string,
    days: number,
    isPast: boolean
  }[] = [];

  this.applicantsDetails.forEach(applicant => {
    if (!applicant.schedules || applicant.schedules.length === 0) return;

    const validSchedules = applicant.schedules.filter(
      s => s.Schedulestatus !== 'rejected' && s.Schedulestatus !== 'assigned'
    );

    if (validSchedules.length === 0) return;

    const ranges = this.getAssignedDatesEmpStatus(validSchedules);

    ranges.forEach(r => {
      const lastDate = new Date(r.rangeSchedules[r.rangeSchedules.length - 1].date);
      lastDate.setHours(0, 0, 0, 0);

      result.push({
        applicant,
        rangeSchedules: r.rangeSchedules,
        start: r.start,
        end: r.end,
        days: r.days,
        isPast: lastDate < today
      });
    });
  });

  // 🔎 Job title search filter
  if (this.searchJobTitle && this.searchJobTitle.trim() !== '') {
    const search = this.searchJobTitle.trim().toLowerCase();
    result = result.filter(r =>
      r.applicant.jobTitle?.toLowerCase().includes(search)
    );
  }

  // 🔎 Status filter
  if (this.empTabStatusSelected && this.empTabStatusSelected !== 'All') {
    result = result.filter(r => {
      const status = this.getApplicantStatusEmpStatus(r.rangeSchedules);
      return status === this.empTabStatusSelected;
    });
  }

  // 🔎 Date filter (added)
  if (this.selectedOptionTable === 'Single' && this.singleDateTable) {
    const selected = new Date(this.singleDateTable);
    selected.setHours(0,0,0,0);
    result = result.filter(r =>
      r.rangeSchedules.some(s => {
        const scheduleDate = new Date(s.date);
        scheduleDate.setHours(0,0,0,0);
        return scheduleDate.getTime() === selected.getTime();
      })
    );
  } else if (
    this.selectedOptionTable === 'Multiple' &&
    this.fromDateTable &&
    this.toDateTable
  ) {
    const from = new Date(this.fromDateTable);
    from.setHours(0,0,0,0);
    const to = new Date(this.toDateTable);
    to.setHours(23,59,59,999);
    result = result.filter(r =>
      r.rangeSchedules.some(s => {
        const scheduleDate = new Date(s.date);
        return scheduleDate >= from && scheduleDate <= to;
      })
    );
  }

  // Optional: sort so past dates come first
  result.sort((a, b) => {
    const aDate = new Date(a.rangeSchedules[0].date);
    const bDate = new Date(b.rangeSchedules[0].date);
    return aDate.getTime() - bDate.getTime();
  });

  return result;
}





getAssignedDatesEmpStatus(schedules?: Schedule[]): { start: string; end?: string; days: number; rangeSchedules: Schedule[] }[] {
  if (!schedules || schedules.length === 0) return [];

  // Sort schedules by date
  const sorted = schedules
    .map(s => ({ ...s, dateObj: new Date(s.date) }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const results: { start: string; end?: string; days: number; rangeSchedules: Schedule[] }[] = [];
  let start = sorted[0];
  let end = sorted[0];
  let tempRange = [start];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const diff = (current.dateObj.getTime() - end.dateObj.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      // consecutive date
      end = current;
      tempRange.push(current);
    } else {
      // push previous range
      results.push({
        start: this.formatRange(start.dateObj, end.dateObj),
        end: undefined, // end is included in start formatting
        days: tempRange.length,
        rangeSchedules: tempRange
      });
      // start new range
      start = end = current;
      tempRange = [current];
    }
  }

  // push last range
  results.push({
    start: this.formatRange(start.dateObj, end.dateObj),
    end: undefined,
    days: tempRange.length,
    rangeSchedules: tempRange
  });

  return results;
}

// Helper to format date ranges
private formatRange(start: Date, end: Date): string {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = end.toLocaleString('default', { month: 'short' });
  const year = end.getFullYear();

  if (start.getTime() === end.getTime()) {
    // single day
    return `${endDay} ${month}, ${year}`;
  } else {
    // multiple days
    return `${startDay} → ${endDay} ${month}, ${year}`;
  }
}


// Count of completed schedules
getWorkedDaysCountEmpStatus(schedules?: Schedule[]): number {
  if (!schedules || schedules.length === 0) return 0;
  return schedules.filter(s => s.Schedulestatus === 'completed').length;
}


// Count of absent schedules
getAbsentDaysCountEmpStatus(rangeSchedules: Schedule[]): number {
  if (!rangeSchedules || rangeSchedules.length === 0) return 0;
  return rangeSchedules.filter(s => s.Schedulestatus === 'absent').length;
}


getPaymentStatusApplicants() {
  if (!this.allAcceptedApplicants || this.allAcceptedApplicants.length === 0) return [];

  const now = new Date();

  let result: {
    applicant: ApplicantsDetails;
    date: string;
    startTime: string;
    endTime: string;
    hoursWorked: number;
    Schedulestatus: string;
    paymentForDay: number;
    paymentStatusLabel: string;
  }[] = [];

  this.allAcceptedApplicants.forEach(applicant => {
    if (!applicant.schedules || applicant.schedules.length === 0) return;

    applicant.schedules.forEach(schedule => {
      if (schedule.Schedulestatus === 'rejected' || schedule.Schedulestatus === 'assigned') return; // skip rejected

      const scheduleDate = new Date(schedule.date);

      // Convert endTime to 24-hour format to compare with current time
      const [endHourStr, endMinStr] = schedule.endTime.split(/:| /);
      let endHour = parseInt(endHourStr, 10);
      const endMin = parseInt(endMinStr, 10);
      if (schedule.endTime.toLowerCase().includes('pm') && endHour !== 12) endHour += 12;
      if (schedule.endTime.toLowerCase().includes('am') && endHour === 12) endHour = 0;

      scheduleDate.setHours(endHour, endMin, 0, 0);

      // Include schedule if in the past or today and shift ended
      if (scheduleDate <= now) {
        result.push({
          applicant,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          hoursWorked: schedule.hoursWorked || 0,
          Schedulestatus: schedule.Schedulestatus,
          paymentForDay: schedule.paymentForDay || 0,
          paymentStatusLabel: schedule.Schedulestatus === 'completed' ? 'Pay' : 'No Pay'
        });
      }
    });
  });

  // 🔎 Job title search filter (added)
  if (this.searchJobTitle && this.searchJobTitle.trim() !== '') {
    const search = this.searchJobTitle.trim().toLowerCase();
    result = result.filter(r =>
      r.applicant.jobTitle?.toLowerCase().includes(search)
    );
  }

  // Sort by applicant name and date
  return result.sort((a, b) => {
    if (a.applicant.applicantName < b.applicant.applicantName) return -1;
    if (a.applicant.applicantName > b.applicant.applicantName) return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

getRatePerHour(applicant: ApplicantsDetails): number {
  // You can define a fixed rate or calculate based on applicant.payment or job type
  // Example 1: fixed rate
  return 100; // 100 per hour

  // Example 2: based on applicant.payment (if it stores rate per hour)
  // return parseFloat(applicant.payment) || 100;
}
// Helpers remain same as before
hasShiftEnded(schedule: Schedule): boolean {
  const [hourStr, minPart] = schedule.endTime.split(/:| /);
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minPart, 10);
  if (schedule.endTime.toLowerCase().includes('pm') && hour !== 12) hour += 12;
  if (schedule.endTime.toLowerCase().includes('am') && hour === 12) hour = 0;

  const now = new Date();
  const endTime = new Date();
  endTime.setHours(hour, min, 0, 0);
  return now >= endTime;
}

calculateShiftHours(startTime: string, endTime: string): number {
  const parseTime = (t: string) => {
    const [h, mPart] = t.split(/:| /);
    let hour = parseInt(h, 10);
    const min = parseInt(mPart, 10);
    if (t.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (t.toLowerCase().includes('am') && hour === 12) hour = 0;
    return hour + min / 60;
  };
  return parseTime(endTime) - parseTime(startTime);
}
}
