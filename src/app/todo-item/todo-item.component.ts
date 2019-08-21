import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('input', { static: true })
  input: ElementRef;
  @Input()
  task: Task;

  oldValue: string;
  myForm: FormGroup;
  isEdite = false;

  constructor(
    private todoListServiceService: TodoListService,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.oldValue = this.task.text;
    this.myForm = new FormGroup({
      text: new FormControl(this.task.text, Validators.required),
      isDone: new FormControl(this.task.isDone)
    });
  }

  public edite(): void {
    this.isEdite = true;
    this.input.nativeElement.focus();
  }

  public save(): void {
    this.task.text = this.myForm.controls.text.value;

    this.disableInput();

    if (!this.task.text) {
      this.snackBar.open('Not epmty input', 'Undo', {
        duration: 3000
      });
      this.myForm.controls.text.setValue(this.oldValue);
      return;
    }

    this.todoListServiceService.updateOne(this.task);
  }

  public delete(): void {
    this.todoListServiceService.remove(this.task);
  }

  public done(): void {
    this.disableInput();
  }

  public onCheckChange(event: any): void {
    this.task.isDone = event.target.checked;
    this.todoListServiceService.subjectChecked.next(this.task);
    this.todoListServiceService.updateOne(this.task);
    this.disableInput();
  }

  private disableInput(): void {
    this.isEdite = false;
    this.input.nativeElement.blur();
  }
}
