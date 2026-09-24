import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderDoStatement(state: RenderState, node: luau.DoStatement) {
	return concat(
		state.lineFragment(`do`),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
