import { hashPassword, comparePassword } from '../utils/hash';

describe('hash util', () => {
  it('hashes and compares password correctly', async () => {
    const pwd = 'Secret123!';
    const h = await hashPassword(pwd);
    expect(typeof h).toBe('string');
    const ok = await comparePassword(pwd, h);
    expect(ok).toBe(true);
    const nok = await comparePassword('wrong', h);
    expect(nok).toBe(false);
  }, 10000);
});
