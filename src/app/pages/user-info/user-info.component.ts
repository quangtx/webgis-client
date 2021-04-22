import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/AuthGuard/auth-guard.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(
    private authGuard: AuthGuardService
  ) { }

  ngOnInit() {
    this.authGuard.canActivate();
  }

}
