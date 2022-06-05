import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderRightHandSide } from "LuauRenderer/util/renderRightHandSide";

export function renderComputedIndexExpression(state: RenderState, node: luau.ComputedIndexExpression) {
	const expStr = render(state, node.expression);
	if (luau.isStringLiteral(node.index) && luau.isValidIdentifier(node.index.value)) {
		return renderRightHandSide(state, `${expStr}.`, node.index);
	} else {
		const indexStr = render(state, node.index);
		return `${expStr}[${indexStr}]`;
	}
}
