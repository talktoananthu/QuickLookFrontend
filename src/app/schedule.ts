export interface Schedule {
  date: string;                  // The actual date of work (e.g. "2025-08-26")
  startTime: string;             // Scheduled start time
  endTime: string;               // Scheduled end time
  Schedulestatus: 'assigned' | 'completed' | 'absent'|'accepted'|'rejected'; // Work status for that day
  hoursWorked?: number;          // Actual hours worked (optional)
  paymentForDay?: number;        // Payment earned for that day
  remarks?: string;   
 paymentStatus?: 'pending' | 'paid' | 'partial' | 'noPay';   
 
 // Optional notes (e.g. "Left early", "Overtime done")
}
