import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-partime',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './par-time.component.html',
  styleUrl: './par-time.component.css'
})
export class ParTimeComponent {


  
  constructor(private dataService: DataService){
    
  }



}
