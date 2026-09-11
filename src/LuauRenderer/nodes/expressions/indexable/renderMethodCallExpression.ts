import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderArgumentsFragment } from "LuauRenderer/util/renderArguments";

export function renderMethodCallExpression(state: RenderState, node: luau.MethodCallExpression) {
	assert(luau.isValidIdentifier(node.name));
	return concat(renderNode(state, node.expression), `:${node.name}(`, renderArgumentsFragment(state, node.args), ")");
}
