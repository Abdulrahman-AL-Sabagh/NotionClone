import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    passsword: new FormControl(),
    repeatPassword: new FormControl(),
  });
}
