import luau from "LuauAST";
import { concat, join } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

export function renderReturnStatement(state: RenderState, node: luau.ReturnStatement) {
	const expression = luau.list.isList(node.expression)
		? join(
				luau.list.mapToArray(node.expression, item => renderNode(state, item)),
				", ",
			)
		: renderNode(state, node.expression);
	return state.fragmentLine(concat("return ", expression));
}
