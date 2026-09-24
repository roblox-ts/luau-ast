import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";

export function renderCallStatement(state: RenderState, node: luau.CallStatement) {
	return state.lineFragment(renderNode(state, node.expression), node);
}
