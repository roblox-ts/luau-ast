import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";

export function renderPropertyAccessExpression(state: RenderState, node: luau.PropertyAccessExpression) {
	const exp = renderNode(state, node.expression);
	const nameStr = node.name;
	if (luau.isValidIdentifier(nameStr)) {
		return concat(exp, `.${nameStr}`);
	} else {
		return concat(exp, `["${nameStr}"]`);
	}
}
