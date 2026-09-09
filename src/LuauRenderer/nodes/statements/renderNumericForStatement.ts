import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderNumericForStatement(state: RenderState, node: luau.NumericForStatement) {
	let predicate: RenderFragment = concat(renderNode(state, node.start), ", ", renderNode(state, node.end));

	// step of 1 can be omitted
	if (node.step && (!luau.isNumberLiteral(node.step) || Number(node.step.value) !== 1)) {
		predicate = concat(predicate, ", ", renderNode(state, node.step));
	}

	return concat(
		state.fragmentLine(concat("for ", renderNode(state, node.id), " = ", predicate, " do")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.fragmentClosing(node),
		state.fragmentLine("end"),
	);
}
