import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

export function renderBinaryExpression(state: RenderState, node: luau.BinaryExpression) {
	let result: RenderFragment = concat(renderNode(state, node.left), ` ${node.operator} `, renderNode(state, node.right));

	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
