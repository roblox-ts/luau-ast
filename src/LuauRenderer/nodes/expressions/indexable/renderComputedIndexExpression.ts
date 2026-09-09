import luau from "LuauAST";
import { concat } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderComputedIndexExpression(state: RenderState, node: luau.ComputedIndexExpression) {
	const expression = renderNode(state, node.expression);
	if (luau.isStringLiteral(node.index) && luau.isValidIdentifier(node.index.value)) {
		return concat(expression, ".", state.fragmentNode(node.index, node.index.value));
	} else {
		return concat(expression, "[", renderNode(state, node.index), "]");
	}
}
