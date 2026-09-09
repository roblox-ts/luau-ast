import luau from "LuauAST";
import { flattenFragment, join, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

/** Renders the given list of expressions into a string separated by commas */
export function renderArguments(state: RenderState, expressions: luau.List<luau.Expression>) {
	return flattenFragment(renderArgumentsFragment(state, expressions)).code;
}

/** @internal */
export function renderArgumentsFragment(state: RenderState, expressions: luau.List<luau.Expression>): RenderFragment {
	return join(
		luau.list.mapToArray(expressions, expression => renderNode(state, expression)),
		", ",
	);
}
