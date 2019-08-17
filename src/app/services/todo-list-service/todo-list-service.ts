import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from 'src/app/models';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private basePath = 'todo_list';
  subjectRemove = new BehaviorSubject<Task>(new Task(''));
  subjectChecked = new BehaviorSubject<Task>(new Task(''));

  constructor(private db: AngularFireDatabase) {}

  updateList(list) {
    const obj = this.db.database.ref(this.basePath);
    obj.set(list);
  }

  create(value) {
    this.db.database.ref(`${this.basePath}/${value.id}`).set(value);
  }
  updateOne(value) {
    this.db.database.ref(`${this.basePath}/${value.id}`).update(value);
  }

  observerData() {
    const source = Observable.create(observer => {
      const ref = this.db.database.ref(this.basePath);
      const callbackFn = ref.on(
        'value',
        dataSnapshot => observer.next(dataSnapshot.val()),
        error => observer.error(error)
      );
      return () => ref.off('value', callbackFn);
    });

    return source;
  }

  remove(value) {
    this.db.database.ref(`${this.basePath}/${value.id}`).remove();
    this.subjectRemove.next(value);
  }
}
