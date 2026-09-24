import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { join } from "LuauRenderer/Fragment";

/** Renders the given list of expressions into a fragment separated by commas */
export function renderArguments(state: RenderState, expressions: luau.List<luau.Expression>) {
	return join(
		luau.list.mapToArray(expressions, v => renderNode(state, v)),
		", ",
	);
}
