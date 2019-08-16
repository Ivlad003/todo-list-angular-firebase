import { Task } from './../services/todo-list-service/Task';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TodoListServiceService } from '../services/todo-list-service/todo-list-service.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @ViewChild('list', { static: true })
  list: ElementRef;
  taskFC;
  tasks: Task[] = [];

  checkedTasks: Task[] = [];
  unCheckedTasks: Task[] = [];
  constructor(private todoListServiceService: TodoListServiceService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.taskFC = new FormControl('');
    this.todoListServiceService.observerData().then(obj => {
      console.log(obj);
      for (let filedName in obj as any) {
        this.tasks.push(obj[filedName] as Task);
      }
      this.filterLists();
    });
    this.todoListServiceService.subjectRemove.subscribe(obj => {
      this.tasks = this.tasks.filter(el => el.id !== obj.id);
      this.filterLists();
    });

    this.todoListServiceService.subjectChecked.subscribe(obj => {
      this.tasks.find(x => x.id === obj.id).isDone = obj.isDone;

      this.filterLists();
    });
  }

  filterLists() {
    this.checkedTasks = this.chackedList();
    this.checkedTasks.sort((a, b) => (a.index > b.index ? 1 : -1));
    this.unCheckedTasks = this.unChackedList();
    this.unCheckedTasks.sort((a, b) => (a.index > b.index ? 1 : -1));
  }

  createTask() {
    const task = new Task(this.taskFC.value);

    if(!task.text){
      this._snackBar.open('Not epmty input', 'Undo', {
        duration: 3000
      });
      return;
    }


    task.index = this.unCheckedTasks.length;
    this.tasks.push(task);
    this.todoListServiceService.create(task);
    this.filterLists();
    this.taskFC.setValue();
  }

  chackedList() {
    return this.tasks.filter(el => el.isDone);
  }
  unChackedList() {
    return this.tasks.filter(el => !el.isDone);
  }

  drop(event: CdkDragDrop<string[]>) {
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
    this.listUpdateIndex(this.unCheckedTasks, false);
    this.listUpdateIndex(this.checkedTasks, true);
    this.unChackedList();
    this.updateListInStorage(this.unCheckedTasks);
    this.updateListInStorage(this.checkedTasks);
  }

  listUpdateIndex(list, isDone) {
    list.map((elm, index) => {
      elm.index = index;
      elm.isDone = isDone;
      return elm;
    });
  }
  updateListInStorage(list) {
    list.forEach(el => {
      this.todoListServiceService.updateOne(el);
    });
  }
}
