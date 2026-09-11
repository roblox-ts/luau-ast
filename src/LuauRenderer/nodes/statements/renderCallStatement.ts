import luau from "LuauAST";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderCallStatement(state: RenderState, node: luau.CallStatement) {
	return state.fragmentLine(renderNode(state, node.expression), node);
}
