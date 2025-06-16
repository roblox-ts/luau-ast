import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderTypeOf(state: RenderState, node: luau.TypeTypeOf) {
	return `typeof(${render(state, node.expression)})`;
}
