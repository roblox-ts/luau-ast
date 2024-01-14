import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	let result = "`";
	luau.list.forEach(node.segments, expression => {
		if (luau.isStringLiteral(expression)) {
			// braces and newlines are escaped to be valid in luau
			result += expression.value.replace(/([{}])/g, "\\$1").replace(/\n/g, "\\\n");
		} else {
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
