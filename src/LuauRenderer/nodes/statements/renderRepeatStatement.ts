import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderRepeatStatement(state: RenderState, node: luau.RepeatStatement) {
	return concat(
		state.lineFragment(`repeat`),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "until ", renderNode(state, node.condition))),
	);
}
