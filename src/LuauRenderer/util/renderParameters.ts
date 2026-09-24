import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { join } from "LuauRenderer/Fragment";

/**
 * Renders the given list of identifiers inside of `node` into a fragment sepearted by commas
 *
 * Adds `...` onto the end if node.hasDotDotDot is true
 */
export function renderParameters(state: RenderState, node: luau.HasParameters) {
	const params = luau.list.mapToArray(node.parameters, param => renderNode(state, param));
	if (node.hasDotDotDot) {
		params.push("...");
	}
	return join(params, ", ");
}
