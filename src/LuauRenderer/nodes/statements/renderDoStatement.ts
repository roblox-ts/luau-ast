import luau from "LuauAST";
import { concat } from "LuauRenderer/Fragment";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderDoStatement(state: RenderState, node: luau.DoStatement) {
	return concat(
		state.fragmentLine("do"),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.fragmentClosingLine(node, "end"),
	);
}
