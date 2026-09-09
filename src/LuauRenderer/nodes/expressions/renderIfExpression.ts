import luau from "LuauAST";
import { concat, markNode, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

export function renderIfExpression(state: RenderState, node: luau.IfExpression) {
	let result: RenderFragment = concat(
		"if ",
		renderNode(state, node.condition),
		" then ",
		renderNode(state, node.expression),
		" ",
	);

	let currentAlternative = node.alternative;
	while (luau.isIfExpression(currentAlternative)) {
		result = concat(
			result,
			markNode(
				currentAlternative,
				concat(
					"elseif ",
					renderNode(state, currentAlternative.condition),
					" then ",
					renderNode(state, currentAlternative.expression),
					" ",
				),
			),
		);
		currentAlternative = currentAlternative.alternative;
	}

	result = concat(result, "else ", renderNode(state, currentAlternative));

	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
