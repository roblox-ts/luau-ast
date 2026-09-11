import luau from "LuauAST";
import { concat } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderArgumentsFragment } from "LuauRenderer/util/renderArguments";

export function renderCallExpression(state: RenderState, node: luau.CallExpression) {
	return concat(renderNode(state, node.expression), "(", renderArgumentsFragment(state, node.args), ")");
}
