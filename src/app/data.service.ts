import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from './user-profile';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  postUrl = 'http://localhost:3000'
  getUrl = 'http://localhost:3000'

  getImage = 'http://localhost:3000/uploads/'

  getNearby = 'http://localhost:3000'
 constructor(private http: HttpClient) {

  }

//-----------POSTING DATA--------------
 storeData(userData:UserProfile){
    this.http.post<UserProfile>(`${this.postUrl}/addUser`,userData).subscribe(result =>{
       console.log('Data sended')
    })

 }
 //-------------------------


 //-----------GETTING DATA--------------
 getUserData(name:string){
  return  this.http.get<UserProfile[]>(`${this.getUrl}/getUser?name=`+name)
 }   
//-----------------------

//-------------Image Upload--------------
  uploadImage(formData: FormData): Observable<any> {
    console.log('uploading')
    return this.http.post(`${this.postUrl}/upload`, formData);
  }

  getImages(){
      
  } 
//api for getting data nearby location from data   
getNearbyJobs(lat: number, lng: number) {
  console.log(lat,lng)
  return this.http.post<any[]>(`${this.getNearby}/nearby`, {
    lat: lat,
    lng: lng
  });
}




}
