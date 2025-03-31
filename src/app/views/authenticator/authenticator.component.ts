import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticatorService} from '../../services/authenticator.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-authenticator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLogin = true;
  submitted = false;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private router: Router, private authenticatorService: AuthenticatorService) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator: ValidatorFn = (form: AbstractControl) => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {mismatch: true};
  };

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.submitted = false;
    this.errorMessage = '';
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    const form = this.isLogin ? this.loginForm : this.registerForm;

    if (form.invalid) return;

    this.loading = true;

    if (this.isLogin) {
      this.authenticatorService.login(form.value.email, form.value.password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          if (error.status === 400) {
            this.errorMessage = 'Invalid email or password';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
          console.error('Login error:', error);
        }
      });
    } else {
      this.authenticatorService.register(form.value.email, form.value.password).subscribe({
        next: () => {
          this.loading = false;
          this.isLogin = true;
          this.errorMessage = '';
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Registration failed. Email may already be in use.';
          } else {
            this.errorMessage = 'Registration failed. Please try again later.';
          }
          console.error('Registration error:', error);
        }
      });
    }
  }
}
