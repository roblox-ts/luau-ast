import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderCallExpression(state: RenderState, node: luau.CallExpression) {
	return concat(renderNode(state, node.expression), "(", renderArguments(state, node.args), ")");
}
