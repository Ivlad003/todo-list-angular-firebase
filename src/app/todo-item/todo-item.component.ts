import { Task } from './../services/todo-list-service/Task';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoListServiceService } from '../services/todo-list-service/todo-list-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @ViewChild('input', {static: true})
  input: ElementRef;

  @Input()
  task: Task;


  oldValue;
  myForm;
  isEdite = false;


  constructor(private todoListServiceService: TodoListServiceService, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.oldValue = this.task.text;
    this.myForm = new FormGroup({
      text: new FormControl(this.task.text, Validators.required),
      isDone: new FormControl(this.task.isDone),
    });
  }

  edite() {
    this.input.nativeElement.removeAttribute("disabled");
    this.isEdite = true;
    this.input.nativeElement.focus();
  }

  save() {
    this.task.text = this.myForm.controls['text'].value;

    if (!this.task.text) {
      this._snackBar.open('Not epmty input', 'Undo', {
        duration: 3000
      });
      this.disableInput();
      this.myForm.controls['text'].setValue(this.oldValue);
      return;
    }

    this.todoListServiceService.updateOne(this.task);
    this.disableInput();
  }

  delete() {
    this.todoListServiceService.remove(this.task);
  }

  done() {
    this.disableInput();
  }

  disableInput() {
    this.isEdite = false;
    this.input.nativeElement.setAttribute("disabled", "");
    this.input.nativeElement.blur();
  }

  onCheckChange(event) {
    this.task.isDone = event.target.checked;
    this.todoListServiceService.subjectChecked.next(this.task);
    this.todoListServiceService.updateOne(this.task);
    this.disableInput();
  }
}
