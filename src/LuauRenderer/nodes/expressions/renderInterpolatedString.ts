import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

const STRING_LITERAL_EDGE = '"'.length;

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	let result = "";
	luau.list.forEach(node.segments, expression => {
		let expressionStr = render(state, expression);
		if (luau.isStringLiteral(expression)) {
			// braces and newlines are escaped to be valid in luau
			result += expressionStr
				.slice(STRING_LITERAL_EDGE, -STRING_LITERAL_EDGE)
				.replace(/([{}])/g, "\\$1")
				.replace(/\n/g, "\\\n");
			return;
		}

		// `{{}}` is invalid, so we wrap it in parenthesis
		if (luau.isTable(expression)) {
			expressionStr = `(${expressionStr})`;
		}

		result += `{${expressionStr}}`;
	});
	return `\`${result}\``;
}
