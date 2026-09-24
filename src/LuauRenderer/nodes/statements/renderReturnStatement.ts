import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, join } from "LuauRenderer/Fragment";

export function renderReturnStatement(state: RenderState, node: luau.ReturnStatement) {
	const exp = luau.list.isList(node.expression)
		? join(
				luau.list.mapToArray(node.expression, exp => renderNode(state, exp)),
				", ",
			)
		: renderNode(state, node.expression);
	return state.lineFragment(concat("return ", exp));
}
