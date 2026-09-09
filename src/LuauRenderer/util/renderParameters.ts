import luau from "LuauAST";
import { flattenFragment, join, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

/**
 * Renders the given list of identifiers inside of `node` into a string sepearted by commas
 *
 * Adds `...` onto the end if node.hasDotDotDot is true
 */
export function renderParameters(state: RenderState, node: luau.HasParameters) {
	return flattenFragment(renderParametersFragment(state, node)).code;
}

/** @internal */
export function renderParametersFragment(state: RenderState, node: luau.HasParameters): RenderFragment {
	const parameters = luau.list.mapToArray(node.parameters, parameter => renderNode(state, parameter));
	if (node.hasDotDotDot) {
		parameters.push("...");
	}
	return join(parameters, ", ");
}
