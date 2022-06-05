import { RenderState } from "LuauAST";

/**
 * Renders function parameters and call arguments.
 *
 * Takes a list of string values and removes the space at the final of each string if the result is formattable.
 */
export function renderFunction(state: RenderState, renderList: () => ReadonlyArray<string>, name?: string) {
	const formatStr = renderList().join(", ");
	if (state.isFormattable(`${name ?? ""}(${formatStr})`)) {
		return `\n${state.list(renderList)}${state.indented("")}`;
	}
	return formatStr;
}
