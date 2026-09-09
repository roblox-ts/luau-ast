import luau from "LuauAST";
import { concat, markClosing } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderParametersFragment } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderMethodDeclaration(state: RenderState, node: luau.MethodDeclaration) {
	return concat(
		state.fragmentLine(
			concat(
				"function ",
				renderNode(state, node.expression),
				`:${node.name}(`,
				renderParametersFragment(state, node),
				")",
			),
		),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
		markClosing(node),
		state.fragmentLine("end"),
	);
}
