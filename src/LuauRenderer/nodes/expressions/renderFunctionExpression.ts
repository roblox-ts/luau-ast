import luau from "LuauAST";
import { concat, markClosing } from "LuauRenderer/Fragment";
import { RenderState } from "LuauRenderer/RenderState";
import { renderParametersFragment } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderFunctionExpression(state: RenderState, node: luau.FunctionExpression) {
	if (luau.list.isEmpty(node.statements)) {
		return concat("function(", renderParametersFragment(state, node), ") ", markClosing(node), "end");
	}

	return concat(
		state.fragmentNewline(concat("function(", renderParametersFragment(state, node), ")")),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
		markClosing(node),
		state.fragmentIndented("end"),
	);
}
