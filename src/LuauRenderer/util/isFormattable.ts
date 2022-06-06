const PRINT_WIDTH = 100;

/**
 * Checks to see if `text` can be formatted.
 * @param text The text.
 */
export function isFormattable(text: string) {
	return text.length > PRINT_WIDTH;
}
