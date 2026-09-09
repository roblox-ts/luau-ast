import luau from "LuauAST";
import { concat, markClosing } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderWhileStatement(state: RenderState, node: luau.WhileStatement) {
	return concat(
		state.fragmentLine(concat("while ", renderNode(state, node.condition), " do")),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
		markClosing(node),
		state.fragmentLine("end"),
	);
}
