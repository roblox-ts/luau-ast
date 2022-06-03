import { RenderState } from "LuauAST";

/**
 * Utility function that takes a list of string values
 * and removes the space at the final of each string if the result is formattable.
 * @param state The render state.
 */
export function format(state: RenderState) {
	return (value: string, index: number, list: ReadonlyArray<string>) =>
		list.length > 1 && index < list.length - 1
			? `${value},${state.isFormattable(list.join(", ")) ? "" : " "}`
			: value;
}
