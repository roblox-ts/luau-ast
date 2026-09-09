import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderParametersFragment } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderFunctionDeclaration(state: RenderState, node: luau.FunctionDeclaration) {
	if (node.localize) {
		assert(luau.isAnyIdentifier(node.name), "local function cannot be a property");
	}
	return concat(
		state.fragmentLine(
			concat(
				node.localize ? "local function " : "function ",
				renderNode(state, node.name),
				"(",
				renderParametersFragment(state, node),
				")",
			),
		),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.fragmentClosing(node),
		state.fragmentLine("end"),
	);
}
