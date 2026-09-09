import luau from "LuauAST";
import { concat, markNode } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderMapField(state: RenderState, node: luau.MapField) {
	const { index, value } = node;
	const renderedValue = renderNode(state, value);
	if (luau.isStringLiteral(index) && luau.isValidIdentifier(index.value)) {
		return concat(markNode(index, index.value), " = ", renderedValue);
	} else {
		return concat("[", renderNode(state, index), "] = ", renderedValue);
	}
}
