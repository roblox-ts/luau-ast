import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderInterpolatedString(state: RenderState, node: luau.InterpolatedString) {
	const result = new Array<RenderFragment>("`");
	luau.list.forEach(node.parts, part => {
		let expression = renderNode(state, part);
		if (luau.isInterpolatedStringPart(part)) {
			result.push(expression);
		} else {
			result.push("{");
			// `{{}}` is invalid, so we wrap it in parenthesis
			if (luau.isTable(part)) {
				expression = concat("(", expression, ")");
			}
			result.push(expression, "}");
		}
	});
	result.push("`");
	return concat(...result);
}
