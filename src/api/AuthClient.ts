import { APIRequestContext, expect } from '@playwright/test';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<string> {
    const res = await this.request.post('/api/auth/login', { data: { username, password } });
    expect(res.status(), 'login debe responder 200').toBe(200);
    const body = await res.json();
    expect(body.token, 'login debe devolver token').toBeTruthy();
    return body.token as string;
  }
}
