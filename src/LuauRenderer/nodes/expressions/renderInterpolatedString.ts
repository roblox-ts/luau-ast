import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	let result = "`";
	luau.list.forEach(node.parts, part => {
		// braces and newlines are escaped to be valid in luau
		// () captures result, [] to search for any of: {}
		// $1 fills in capture from original search
		result += part.literal.replace(/([{}])/g, "\\$1").replace(/\n/g, "\\\n");
		const expression = part.expression;
		if (expression) {
			result += "{";
			let expressionStr = render(state, expression);
			// `{{}}` is invalid, so we wrap it in parenthesis
			if (luau.isTable(expression)) {
				expressionStr = `(${expressionStr})`;
			}
			result += expressionStr;
			result += "}";
		}
	});
	result += "`";
	return result;
}
