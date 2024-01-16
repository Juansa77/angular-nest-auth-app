import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dasboard-layout',
  templateUrl: './dasboard-layout.component.html',
  styleUrls: ['./dasboard-layout.component.css']
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService);
  public user = computed(()=> this.authService.currentUser() )

  onLogOut(){
   this.authService.logOut()
  }

}
