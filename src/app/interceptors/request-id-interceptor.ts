import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services';

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  
  const requestId = Math.floor(Math.random() * 20) + 1;
  
  console.log(`Request ID: ${requestId}, URL: ${req.url}`);
  
  if (requestId > 15) {
    errorService.setError(`Request aborted due to high request ID: ${requestId}`);
    return throwError(() => new HttpErrorResponse({
      error: 'Request aborted',
      status: 0,
      statusText: 'Request ID too high'
    }));
  }
  
  // Only add custom header to internal APIs (JSONPlaceholder, not external APIs like AlphaVantage)
  const isInternalApi = req.url.includes('jsonplaceholder.typicode.com');
  const reqWithHeader = isInternalApi 
    ? req.clone({
        headers: req.headers.set('X-Req-Id', requestId.toString())
      })
    : req;

  return next(reqWithHeader).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        errorService.setError('Rate limit exceeded. Please try again later.');
      } else if (error.status === 0 && error.statusText === 'Request ID too high') {
        // Already handled above
      } else {
        errorService.setError(`HTTP Error: ${error.status} - ${error.message}`);
      }
      return throwError(() => error);
    })
  );
};
