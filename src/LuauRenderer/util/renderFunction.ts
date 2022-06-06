import { RenderState } from "LuauAST";
import { isFormattable } from "LuauRenderer/util/isFormattable";

/**
 * Renders function parameters and call arguments.
 *
 * Takes a list of string values and removes the space at the final of each string if the result is formattable.
 */
export function renderFunction(state: RenderState, renderList: () => ReadonlyArray<string>, name?: string) {
	const formatStr = renderList().join(", ");
	if (isFormattable(`${name ?? ""}(${formatStr})`)) {
		return `\n${state.list(renderList)}${state.indented("")}`;
	}
	return formatStr;
}
