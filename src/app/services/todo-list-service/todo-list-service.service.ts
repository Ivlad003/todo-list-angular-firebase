import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from 'rxjs';
import { Task } from './Task';

@Injectable({
  providedIn: 'root'
})
export class TodoListServiceService {
  private basePath = 'todo_list';
  subjectRemove = new Subject<Task>();
  subjectChecked = new Subject<Task>();

  constructor(private db: AngularFireDatabase) {}

  updateList(list) {
    const obj = this.db.database.ref(this.basePath);
    obj.set(list);
  }

  create(value) {
    this.db.database.ref(`${this.basePath}/${value.id}`).set(value);
  }
  updateOne(value){
    this.db.database.ref(`${this.basePath}/${value.id}`).update(value);
  }

  observerData() {
    return new Promise((res, rej) => {
      const obj = this.db.database.ref(this.basePath);
      obj.on('value', (dataSnapshot) => {
        res(dataSnapshot.val());
        obj.off();
      });
    });
  }

  remove(value) {
    this.db.database.ref(`${this.basePath}/${value.id}`).remove();
    this.subjectRemove.next(value);
  }
}
