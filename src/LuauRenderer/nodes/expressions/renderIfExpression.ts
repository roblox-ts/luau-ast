import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { needsParentheses } from "LuauRenderer/util/needsParentheses";

export function renderIfExpression(state: RenderState, node: luau.IfExpression) {
	const head = concat("if ", renderNode(state, node.condition), " then ", renderNode(state, node.expression), " ");

	const alternatives = new Array<[luau.IfExpression, RenderFragment]>();
	let currentAlternative = node.alternative;
	while (luau.isIfExpression(currentAlternative)) {
		const condition = renderNode(state, currentAlternative.condition);
		const expression = renderNode(state, currentAlternative.expression);
		alternatives.push([currentAlternative, concat("elseif ", condition, " then ", expression, " ")]);
		currentAlternative = currentAlternative.alternative;
	}

	// each `elseif` is a nested luau.IfExpression which includes all of the alternatives after it
	let tail = concat("else ", renderNode(state, currentAlternative));
	for (let i = alternatives.length - 1; i >= 0; i--) {
		const [alternative, alternativeHead] = alternatives[i];
		tail = state.markNode(alternative, concat(alternativeHead, tail));
	}

	let result = concat(head, tail);
	if (needsParentheses(node)) {
		result = concat("(", result, ")");
	}

	return result;
}
