import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

const STRING_LITERAL_EDGE = '"'.length;

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	const result = luau.list
		.mapToArray(node.segments, expression => {
			let expressionStr = render(state, expression);
			if (luau.isStringLiteral(expression)) {
				return expressionStr.slice(STRING_LITERAL_EDGE, -STRING_LITERAL_EDGE);
			}

			// `{{}}` is invalid, so we wrap it in parenthesis
			if (luau.isTable(expression)) {
				expressionStr = `(${expressionStr})`;
			}

			return `{${expressionStr}}`;
		})
		.join("");

	return `\`${result}\``;
}
