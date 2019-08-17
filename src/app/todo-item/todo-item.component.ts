import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../models';
import { TodoListService } from '../services/todo-list-service/todo-list-service';

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


  constructor(private todoListServiceService: TodoListService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.oldValue = this.task.text;
    this.myForm = new FormGroup({
      text: new FormControl(this.task.text, Validators.required),
      isDone: new FormControl(this.task.isDone),
    });
  }

  edite() {
    this.isEdite = true;
    this.input.nativeElement.focus();
  }

  save() {
    this.task.text = this.myForm.controls['text'].value;

    this.disableInput();

    if (!this.task.text) {
      this.snackBar.open('Not epmty input', 'Undo', {
        duration: 3000
      });
      this.myForm.controls['text'].setValue(this.oldValue);
      return;
    }

    this.todoListServiceService.updateOne(this.task);
  }

  delete() {
    this.todoListServiceService.remove(this.task);
  }

  done() {
    this.disableInput();
  }

  disableInput() {
    this.isEdite = false;
    this.input.nativeElement.blur();
  }

  onCheckChange(event) {
    this.task.isDone = event.target.checked;
    this.todoListServiceService.subjectChecked.next(this.task);
    this.todoListServiceService.updateOne(this.task);
    this.disableInput();
  }
}
