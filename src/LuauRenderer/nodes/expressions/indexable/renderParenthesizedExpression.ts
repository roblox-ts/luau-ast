import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";

export function renderParenthesizedExpression(state: RenderState, node: luau.ParenthesizedExpression) {
	// skip nested parentheses
	let expression = node.expression;
	while (luau.isParenthesizedExpression(expression)) {
		expression = expression.expression;
	}
	if (luau.isSimple(expression)) {
		return renderNode(state, node.expression);
	} else {
		return concat("(", renderNode(state, node.expression), ")");
	}
}
