import { AuthService } from './AuthService';

let httpClientSpy: { post: jasmine.Spy };

describe('AuthState', () => {
  let authService: AuthService;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    authService = new AuthService(httpClientSpy as any);
  });

  it('should create', () => {
    expect(authService).toBeTruthy();
  });
});
