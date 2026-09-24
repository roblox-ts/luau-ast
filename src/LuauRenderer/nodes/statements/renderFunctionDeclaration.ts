import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderParameters } from "LuauRenderer/util/renderParameters";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderFunctionDeclaration(state: RenderState, node: luau.FunctionDeclaration) {
	if (node.localize) {
		assert(luau.isAnyIdentifier(node.name), "local function cannot be a property");
	}
	const name = renderNode(state, node.name);
	const params = renderParameters(state, node);

	return concat(
		state.lineFragment(concat(`${node.localize ? "local " : ""}function `, name, "(", params, ")")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		state.lineFragment(concat(state.markClosing(node), "end")),
	);
}
