import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, join } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderForStatement(state: RenderState, node: luau.ForStatement) {
	const ids = luau.list.isEmpty(node.ids)
		? "_"
		: join(
				luau.list.mapToArray(node.ids, id => renderNode(state, id)),
				", ",
			);
	const exp = renderNode(state, node.expression);

	return concat(
		state.lineFragment(concat("for ", ids, " in ", exp, " do")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
