import luau from "LuauAST";
import { RenderState, renderTyped } from "LuauRenderer";

/**
 * Renders the given list of identifiers inside of `node` into a string sepearted by commas
 *
 * Adds `...` onto the end if node.hasDotDotDot is true
 */
export function renderParameters(state: RenderState, node: luau.HasParameters) {
	const paramStrs = luau.list.mapToArray(node.parameters, param => renderTyped(state, param));
	if (node.hasDotDotDot) {
		paramStrs.push("...");
	}
	return paramStrs.join(", ");
}
