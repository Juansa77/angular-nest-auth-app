import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'authApp';
  public router = inject(Router);
  private authService = inject(AuthService);
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  public authStatusChangedEffect = effect(()=>{

    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
         return
         case AuthStatus.authenticated:
         this.router.navigateByUrl("/dashboard")
         return;
         case AuthStatus.notAuthenticated:
          this.router.navigateByUrl("/auth/login")
          return;
    }

  })

}
