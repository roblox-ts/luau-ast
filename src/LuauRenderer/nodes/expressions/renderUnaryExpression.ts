import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
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

	let result = concat(opStr, renderNode(state, node.expression));
	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
