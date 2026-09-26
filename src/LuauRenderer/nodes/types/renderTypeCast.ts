import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderTypeCast(state: RenderState, node: luau.TypeCast) {
	return `(${render(state, node.expression)} :: ${render(state, node.type)})`;
}
