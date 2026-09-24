import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";

export function renderComputedIndexExpression(state: RenderState, node: luau.ComputedIndexExpression) {
	const exp = renderNode(state, node.expression);
	if (luau.isStringLiteral(node.index) && luau.isValidIdentifier(node.index.value)) {
		return concat(exp, ".", state.markNode(node.index, node.index.value));
	} else {
		const index = renderNode(state, node.index);
		return concat(exp, "[", index, "]");
	}
}
