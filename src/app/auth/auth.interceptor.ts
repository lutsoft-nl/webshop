import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const API_ORIGIN = 'https://dummyjson.com/';
const AUTH_PATH = '/auth/';

const withToken = (req: HttpRequest<unknown>, token: string) =>
  req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken;

  if (!req.url.startsWith(API_ORIGIN) || req.url.includes(AUTH_PATH) || !token) {
    return next(req);
  }

  return next(withToken(req, token)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 && err.status !== 403) return throwError(() => err);
      return auth.refresh().pipe(
        switchMap((res) => next(withToken(req, res.accessToken))),
        catchError((refreshErr) => {
          auth.logout();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
