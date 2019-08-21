import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TodoListService } from '../services/todo-list-service/todo-list-service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../models';
import { AfterContentInit } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, AfterContentInit {
  taskFC: FormControl;
  tasks: Task[] = [];
  checkedTasks: Task[] = [];
  unCheckedTasks: Task[] = [];

  constructor(
    private zone: NgZone,
    private todoListServiceService: TodoListService,
    private snackBar: MatSnackBar
  ) {}

  public ngAfterContentInit(): void {
    const observable = this.todoListServiceService.observerData();
    const subscribe = observable.subscribe(obj => {
      this.zone.run(() => {
        this.parseObject(obj);
      });
      subscribe.unsubscribe();
    });
  }

  public ngOnInit(): void {
    this.taskFC = new FormControl('');

    this.todoListServiceService.subjectRemove.subscribe(obj => {
      try {
        this.tasks = this.tasks.filter(el => el.id !== obj.id);
        this.filterLists();
      } catch (error) {}
    });

    this.todoListServiceService.subjectChecked.subscribe(obj => {
      try {
        this.tasks.find(x => x.id === obj.id).isDone = obj.isDone;
        this.filterLists();
      } catch (error) {}
    });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.listUnCheckedTasksUpdateIndex();
    this.listCheckedTasksUpdateIndex();

    this.unChackedList();
    this.updateListInStorage(this.unCheckedTasks);
    this.updateListInStorage(this.checkedTasks);
  }

  public createTask(): void {
    const task = new Task(this.taskFC.value);

    if (!task.text) {
      this.snackBar.open('Not epmty input', 'Undo', {
        duration: 3000
      });
      return;
    }

    task.index = this.unCheckedTasks.length;
    this.tasks.push(task);
    this.todoListServiceService.create(task);
    this.filterLists();
    this.taskFC.setValue('');
  }

  private parseObject(obj): void {
    Object.keys(obj).forEach(filedName => {
      this.tasks.push(obj[filedName] as Task);
    });
    this.filterLists();
  }

  private filterLists(): void {
    this.tasks.sort((a, b) => (a.index > b.index ? 1 : -1));
    this.checkedTasks = this.chackedList();
    this.unCheckedTasks = this.unChackedList();
  }

  private chackedList(): Task[] {
    return this.tasks.filter(el => el.isDone);
  }
  private unChackedList(): Task[] {
    return this.tasks.filter(el => !el.isDone);
  }

  private listUnCheckedTasksUpdateIndex(): void {
    this.unCheckedTasks.forEach((elm, index) => {
      elm.index = index;
      elm.isDone = false;
    });
  }

  private listCheckedTasksUpdateIndex(): void {
    this.checkedTasks.forEach((elm, index) => {
      elm.index = index;
      elm.isDone = true;
    });
  }

  private updateListInStorage(list: Task[]): void {
    list.forEach(el => {
      this.todoListServiceService.updateOne(el);
    });
  }
}
