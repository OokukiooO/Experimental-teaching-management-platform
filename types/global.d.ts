// Fallback module declaration for bcryptjs, used by CI/CD or environments
// where type resolution fails. It provides minimal async signatures used
// in this project and a default export compatible with `import bcrypt from 'bcryptjs'`.
declare module 'bcryptjs' {
  export function genSalt(rounds?: number): Promise<string>;
  export function hash(plain: string, salt: string | number): Promise<string>;
  export function compare(plain: string, hash: string): Promise<boolean>;
  const _default: {
    genSalt: typeof genSalt;
    hash: typeof hash;
    compare: typeof compare;
  };
  export default _default;
}
