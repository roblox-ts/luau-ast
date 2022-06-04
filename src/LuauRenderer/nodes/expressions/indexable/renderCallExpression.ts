import luau from "LuauAST";
import { render, RenderState } from "LuauRenderer";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderCallExpression(state: RenderState, node: luau.CallExpression) {
	const nameStr = render(state, node.expression);
	return `${nameStr}(${renderArguments(state, node.args, nameStr)})`;
}
