import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

export function renderBinaryExpression(state: RenderState, node: luau.BinaryExpression) {
	let result = concat(renderNode(state, node.left), ` ${node.operator} `, renderNode(state, node.right));

	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
