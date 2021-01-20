import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotcountService {

  notCount = new BehaviorSubject(0);

  constructor() { }

  getNotCount()
  {
    return this.notCount.asObservable()
  }

  setNotCount(count)
  {
    this.notCount.next(count)
  }
}
