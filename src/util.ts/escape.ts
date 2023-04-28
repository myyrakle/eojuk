export function escapeDoubleQuote(str: string): string {
    return str.replace(/"/g, '\\"');
}