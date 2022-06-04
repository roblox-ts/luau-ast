import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { formatFunction } from "LuauRenderer/util/formatFunction";

/** Renders the given list of expressions into a string separated by commas */
export function renderArguments(state: RenderState, expressions: luau.List<luau.Expression>, name: string) {
	return formatFunction(state, () => luau.list.mapToArray(expressions, v => render(state, v)), name);
}
