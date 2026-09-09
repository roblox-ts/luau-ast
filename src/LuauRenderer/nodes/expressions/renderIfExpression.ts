import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

export function renderIfExpression(state: RenderState, node: luau.IfExpression) {
	let result: RenderFragment;
	const alternatives = new Array<{ node: luau.IfExpression; content: RenderFragment }>();
	let currentAlternative = node.alternative;
	while (luau.isIfExpression(currentAlternative)) {
		alternatives.push({
			node: currentAlternative,
			content: concat(
				"elseif ",
				renderNode(state, currentAlternative.condition),
				" then ",
				renderNode(state, currentAlternative.expression),
				" ",
			),
		});
		currentAlternative = currentAlternative.alternative;
	}
	result = concat("else ", renderNode(state, currentAlternative));
	for (let index = alternatives.length - 1; index >= 0; index--) {
		const alternative = alternatives[index];
		result = state.fragmentNode(alternative.node, concat(alternative.content, result));
	}
	result = concat(
		"if ",
		renderNode(state, node.condition),
		" then ",
		renderNode(state, node.expression),
		" ",
		result,
	);

	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
