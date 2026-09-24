import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";

export function renderMapField(state: RenderState, node: luau.MapField) {
	const { index, value } = node;
	const valueFragment = renderNode(state, value);
	if (luau.isStringLiteral(index) && luau.isValidIdentifier(index.value)) {
		return concat(state.markNode(index, index.value), " = ", valueFragment);
	} else {
		const indexFragment = renderNode(state, index);
		return concat("[", indexFragment, "] = ", valueFragment);
	}
}
