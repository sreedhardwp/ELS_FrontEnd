import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  let router: Router;
  let nextSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule.withRoutes([])] });
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    localStorage.clear();

    nextSpy = jasmine.createSpy('next').and.callFake((req: HttpRequest<any>) => of(new HttpResponse({ status: 200, body: req.headers.get('Authorization') })));
  });

  afterEach(() => {
    localStorage.clear();
  });

  function createToken(expirationOffsetSeconds: number): string {
    const payload = { exp: Math.floor(Date.now() / 1000) + expirationOffsetSeconds };
    return `header.${btoa(JSON.stringify(payload))}.signature`;
  }

  it('should add Authorization header when token exists and is valid', (done) => {
    const token = createToken(3600);
    localStorage.setItem('token', token);
    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy).subscribe(response => {
        expect(nextSpy).toHaveBeenCalled();
        expect((response as HttpResponse<any>).body).toBe(`Bearer ${token}`);
        done();
      });
    });
  });

  it('should redirect to login and throw when token is expired', (done) => {
    const token = createToken(-3600);
    localStorage.setItem('token', token);
    const req = new HttpRequest('GET', '/test');

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextSpy).subscribe({
        next: () => fail('should not succeed'),
        error: (err) => {
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          expect(localStorage.getItem('token')).toBeNull();
          expect(nextSpy).not.toHaveBeenCalled();
          expect(err.message).toContain('Session expired');
          done();
        }
      });
    });
  });
});