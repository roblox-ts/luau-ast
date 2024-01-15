import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	let result = "`";
	luau.list.forEach(node.parts, part => {
		let expressionStr = render(state, part);
		if (luau.isInterpolatedStringPart(part)) {
			result += expressionStr;
		} else {
			result += "{";
			// `{{}}` is invalid, so we wrap it in parenthesis
			if (luau.isTable(part)) {
				expressionStr = `(${expressionStr})`;
			}
			result += expressionStr;
			result += "}";
		}
	});
	result += "`";
	return result;
}
