import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderFunction } from "LuauRenderer/util/renderFunction";

/**
 * Renders the given list of identifiers inside of `node` into a string separated by commas
 *
 * Adds `...` onto the end if node.hasDotDotDot is true
 */
export function renderParameters(state: RenderState, node: luau.HasParameters, name?: string) {
	const paramStrs = luau.list.mapToArray(node.parameters, param => render(state, param));
	if (node.hasDotDotDot) {
		paramStrs.push("...");
	}
	return renderFunction(state, () => paramStrs, name);
}
