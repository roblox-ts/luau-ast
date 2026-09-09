import luau from "LuauAST";
import { concat, markClosing } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderRepeatStatement(state: RenderState, node: luau.RepeatStatement) {
	return concat(
		state.fragmentLine("repeat"),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
		markClosing(node),
		state.fragmentLine(concat("until ", renderNode(state, node.condition))),
	);
}
