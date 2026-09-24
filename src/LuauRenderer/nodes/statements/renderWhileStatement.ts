import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderWhileStatement(state: RenderState, node: luau.WhileStatement) {
	return concat(
		state.lineFragment(concat("while ", renderNode(state, node.condition), " do")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
