import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";

export function renderParenthesizedExpression(state: RenderState, node: luau.ParenthesizedExpression) {
	return render(state, node.expression);
}
