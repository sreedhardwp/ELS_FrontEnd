import { routes } from './app.routes';

describe('App routes', () => {
  it('should define the expected application routes', () => {
    expect(routes).toBeDefined();
    expect(routes.some(route => route.path === 'login')).toBeTrue();
    expect(routes.some(route => route.path === 'register')).toBeTrue();
    expect(routes.some(route => route.path === 'employee')).toBeTrue();
    expect(routes.some(route => route.path === 'manager')).toBeTrue();
    expect(routes.some(route => route.path === 'hr')).toBeTrue();
    expect(routes.some(route => route.path === '')).toBeTrue();
    expect(routes.some(route => route.path === '**')).toBeTrue();

    const employeeRoute = routes.find(route => route.path === 'employee');
    expect(employeeRoute?.canActivate?.length).toBe(1);
    const managerRoute = routes.find(route => route.path === 'manager');
    expect(managerRoute?.canActivate?.length).toBe(1);
  });
});