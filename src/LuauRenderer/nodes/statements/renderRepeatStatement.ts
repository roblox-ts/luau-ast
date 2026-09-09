import luau from "LuauAST";
import { concat } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderRepeatStatement(state: RenderState, node: luau.RepeatStatement) {
	return concat(
		state.fragmentLine("repeat"),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.fragmentClosingLine(node, concat("until ", renderNode(state, node.condition))),
	);
}
