import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

function needsSpace(node: luau.UnaryExpression) {
	// not always needs a space
	if (node.operator === "not") {
		return true;
	}

	// "--" will create a comment!
	if (luau.isUnaryExpression(node.expression) && node.expression.operator === "-") {
		// previous expression was also "-"
		return true;
	}

	return false;
}

export function renderUnaryExpression(state: RenderState, node: luau.UnaryExpression) {
	let opStr = node.operator;
	if (needsSpace(node)) {
		opStr += " ";
	}

	let result: RenderFragment = concat(opStr, renderNode(state, node.expression));
	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
