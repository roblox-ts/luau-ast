import luau from "LuauAST";
import { RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderFunctionExpression(state: RenderState, node: luau.FunctionExpression) {
	if (luau.list.isEmpty(node.statements)) {
		return concat("function(", renderParameters(state, node), ") ", state.markClosing(node), "end");
	}

	return concat(
		state.newlineFragment(concat("function(", renderParameters(state, node), ")")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.indentedFragment(concat(state.markClosing(node), "end")),
	);
}
