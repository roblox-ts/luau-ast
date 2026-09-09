import luau from "LuauAST";
import { concat, join } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderForStatement(state: RenderState, node: luau.ForStatement) {
	const identifiers = luau.list.isEmpty(node.ids)
		? "_"
		: join(
				luau.list.mapToArray(node.ids, identifier => renderNode(state, identifier)),
				", ",
			);
	return concat(
		state.fragmentLine(concat("for ", identifiers, " in ", renderNode(state, node.expression), " do")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.fragmentClosing(node),
		state.fragmentLine("end"),
	);
}
