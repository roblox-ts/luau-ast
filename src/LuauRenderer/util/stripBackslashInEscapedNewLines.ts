/**
 * Strips off any excess backslash if it is escaped with `\n`
 *
 * **From**:
 * ```ts
 * "Hello\
 * World!"
 * ```
 *
 * **To**:
 * ```lua
 * [[Hello
 * World!]]
 * ```
 */
export function stripBackslashInEscapedNewLines(value: string) {
	return value.replace(/\\(\r\n?|\n)/g, "$1");
}
