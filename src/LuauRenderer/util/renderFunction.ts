import { RenderState } from "LuauAST";

/**
 * Renders function parameters and call arguments.
 *
 * Utility function that takes a list of string values
 * and removes the space at the final of each string if the result is formattable.
 */
export function renderFunction(state: RenderState, renderList: () => ReadonlyArray<string>, name?: string) {
	const list = renderList();
	if (state.isFormattable(`${name ?? ""}(${renderList().join(", ")})`)) {
		return `\n${state.list(renderList)}${state.indented("")}`;
	}
	return list.join(", ");
}
