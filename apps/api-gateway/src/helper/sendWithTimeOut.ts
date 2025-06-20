import { Observable, timeout, catchError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export function sendWithTimeout<T>(
  client: ClientProxy,
  pattern: string,
  payload: any,
  timeoutMs = 6000,
): Observable<T> {
  return client.send<T>(pattern, payload).pipe(
    timeout(timeoutMs),
    catchError((err) => {
      console.error('Microservice error or timeout:', err.message);
      return throwError(
        () =>
          new Error(
            `${pattern} service is unavailable. Please try again later.`,
          ),
      );
    }),
  );
}
