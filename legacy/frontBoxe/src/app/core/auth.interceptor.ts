import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const TOKEN_KEY = 'token';

// Ajoute le JWT aux requêtes envoyées à l'API Symfony
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
