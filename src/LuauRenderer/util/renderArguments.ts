import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { format } from "LuauRenderer/util/format";

/** Renders the given list of expressions into a string separated by commas */
export function renderArguments(state: RenderState, expressions: luau.List<luau.Expression>) {
	return luau.list.mapToArray(expressions, v => render(state, v)).map(format(state));
}
