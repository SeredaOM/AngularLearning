import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { PlayerModel } from '../Models/PlayerModel';
import { AuthGuardService } from './AuthGuard.service';
import { AuthService } from './AuthService';
import { Role } from '../Models/Auth/role';

describe('AuthState', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authClientSpy: { isLoggedIn: jasmine.Spy };

  let guard: AuthGuardService;
  const playerAdmin: PlayerModel = new PlayerModel(1, 'nick', 'email', 'first', 'last', 'admin');
  const playerRegular: PlayerModel = new PlayerModel(1, 'nick', 'email', 'first', 'last', null);

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authClientSpy = jasmine.createSpyObj(AuthService, ['isLoggedIn']);
    guard = new AuthGuardService(routerSpy, authClientSpy as any);

    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: AuthService, useValue: authClientSpy }],
    });

    authClientSpy.isLoggedIn.and.returnValue(true);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it("Regular player should access URLs that don't need any role", () => {
    spyOn(PlayerModel, 'getPlayerFromStore').and.returnValue(playerRegular);
    const routeMock: any = { data: {} };
    const canActivateChild = guard.canActivate(routeMock, fakeRouterState('any'));

    expect(canActivateChild).toBeTrue();
  });

  it('Regular player should not access URLs that need admin role', () => {
    spyOn(PlayerModel, 'getPlayerFromStore').and.returnValue(playerRegular);
    const routeMock: any = { data: { role: Role.admin } };
    const canActivateChild = guard.canActivate(routeMock, fakeRouterState('any'));

    expect(canActivateChild).toBeFalse();
  });

  it("Admin should access URLs that don't need any role", () => {
    spyOn(PlayerModel, 'getPlayerFromStore').and.returnValue(playerAdmin);
    const routeMock: any = { data: {} };
    const canActivateChild = guard.canActivate(routeMock, fakeRouterState('any'));

    expect(canActivateChild).toBeTrue();
  });

  it('Admin should access URLs that need admin Role', () => {
    spyOn(PlayerModel, 'getPlayerFromStore').and.returnValue(playerAdmin);
    const routeMock: any = { data: { role: Role.admin } };
    const canActivateChild = guard.canActivate(routeMock, fakeRouterState('any'));

    expect(canActivateChild).toBeTrue();
  });

  function fakeRouterState(url: string): RouterStateSnapshot {
    return {
      url,
    } as RouterStateSnapshot;
  }
});
