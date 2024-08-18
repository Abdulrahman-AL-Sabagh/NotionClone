import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl<string>('', {
      validators: [],
    }),
    password: new FormControl<string>(''),
  });

  handleSubmit(e: Event) {
    e.preventDefault();
    console.log(this.form.value);
  }
}
