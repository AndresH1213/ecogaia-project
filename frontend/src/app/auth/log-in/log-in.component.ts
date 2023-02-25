import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  public formSubmitted = false;
  public oauth2: any;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {}

  login() {
    this.formSubmitted = true;
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    const dataAuth = { email, password };
    this.adminService.loginUser(dataAuth).subscribe(
      (resp) => {
        if (this.loginForm.get('remeber')) {
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('email');
        }
        // Navigate to the route
        this.router.navigateByUrl('/admin/products');
      },
      (err) => {
        let message = 'Error while authenticating';
        if (err.status === 404) {
          message = 'Invalid Credentials';
        }
        Swal.fire('Unauthorized', message, 'error');
      }
    );
  }
  // googleLogin() {
  //   //TODO: implement this authentication in the future if customer user auth
  // }
}
