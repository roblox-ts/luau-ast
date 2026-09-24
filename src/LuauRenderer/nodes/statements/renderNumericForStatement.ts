import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderNumericForStatement(state: RenderState, node: luau.NumericForStatement) {
	const id = renderNode(state, node.id);
	const start = renderNode(state, node.start);
	const end = renderNode(state, node.end);

	let predicate = concat(start, ", ", end);

	// step of 1 can be omitted
	if (node.step && (!luau.isNumberLiteral(node.step) || Number(node.step.value) !== 1)) {
		const step = renderNode(state, node.step);
		predicate = concat(predicate, ", ", step);
	}

	return concat(
		state.lineFragment(concat("for ", id, " = ", predicate, " do")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
