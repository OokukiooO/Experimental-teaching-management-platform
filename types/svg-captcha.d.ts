declare module 'svg-captcha' {
  interface CaptchaOptions { noise?: number; color?: boolean; }
  interface Captcha { data: string; text: string; }
  export function create(options?: CaptchaOptions): Captcha;
  export default { create: (options?: CaptchaOptions) => Captcha } as any;
}
