import luau from "LuauAST";
import { concat, markClosing } from "LuauRenderer/Fragment";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderDoStatement(state: RenderState, node: luau.DoStatement) {
	return concat(
		state.fragmentLine("do"),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
		markClosing(node),
		state.fragmentLine("end"),
	);
}
