import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from 'src/app/models';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private basePath: string = 'todo_list';
  subjectRemove = new BehaviorSubject<Task>(new Task(''));
  subjectChecked = new BehaviorSubject<Task>(new Task(''));

  constructor(private db: AngularFireDatabase) {}

  public updateList(list: Task[]): void {
    const obj = this.db.database.ref(this.basePath);
    obj.set(list);
  }

  public create(value: Task): void {
    this.db.database.ref(`${this.basePath}/${value.id}`).set(value);
  }
  public updateOne(value: Task): void {
    this.db.database.ref(`${this.basePath}/${value.id}`).update(value);
  }

  public observerData(): Observable<any> {
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

  public remove(value: Task): void {
    this.db.database.ref(`${this.basePath}/${value.id}`).remove();
    this.subjectRemove.next(value);
  }
}
