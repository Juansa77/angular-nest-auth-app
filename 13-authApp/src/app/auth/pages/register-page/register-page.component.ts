import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {
  private authService= inject(AuthService);
  private router = inject(Router)
  private fb = inject(FormBuilder);
  public myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    const { email, password, name} = this.myForm.value
    this.authService.register(email, password, name).subscribe({
      next: () => this.router.navigateByUrl("/dashboard"),
      error: (message) => {
        //Swal.fire('Error', message, 'error');
      },
    });
  }
}
