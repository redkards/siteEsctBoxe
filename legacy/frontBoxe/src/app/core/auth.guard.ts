import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Réservé aux utilisateurs connectés
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() || inject(Router).createUrlTree(['/login']);
};

// Réservé aux administrateurs du club
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.hasRole('ROLE_ADMIN') || inject(Router).createUrlTree(['/login']);
};
