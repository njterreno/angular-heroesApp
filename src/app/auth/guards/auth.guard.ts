import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthService,
              private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
      return this.authService.verificaAutenticacion()
              .pipe(
                tap(autenticado=> {
                  if (!autenticado) {
                    this.router.navigate(['./auth/login']);
                  }
                })
              )

    //   if (this.authService.auth.id) {
    //     return true
    //   }

    // return false;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {

    return this.authService.verificaAutenticacion()
          .pipe(
                tap(autenticado=> {
                  if (!autenticado) {
                    this.router.navigate(['./auth/login']);
                  }
                })
            )

    //   if (this.authService.auth.id) {
    //     return true
    //   }

    // return false;
  }
}
