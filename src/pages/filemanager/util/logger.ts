export class Logger {
  public static error(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.error('[SFM runtime error]', ...args);
  }

  public static warn(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.warn('[SFM runtime warning]', ...args);
  }

  public static debug(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.debug('[SFM runtime debug]', ...args);
  }

  public static formatBullets(bullets: string[]): string {
    return `\n- ${bullets.join('\n- ')}`;
  }
}
