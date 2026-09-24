import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderMethodDeclaration(state: RenderState, node: luau.MethodDeclaration) {
	const exp = renderNode(state, node.expression);
	const params = renderParameters(state, node);

	return concat(
		state.lineFragment(concat("function ", exp, `:${node.name}(`, params, ")")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
