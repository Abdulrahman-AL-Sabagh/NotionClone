import { Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';

export const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
];
