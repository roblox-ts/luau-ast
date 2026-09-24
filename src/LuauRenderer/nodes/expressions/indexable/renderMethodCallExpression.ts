import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { renderNode, RenderState } from "LuauRenderer";
import { concat } from "LuauRenderer/Fragment";
import { renderArguments } from "LuauRenderer/util/renderArguments";

export function renderMethodCallExpression(state: RenderState, node: luau.MethodCallExpression) {
	assert(luau.isValidIdentifier(node.name));
	return concat(renderNode(state, node.expression), `:${node.name}(`, renderArguments(state, node.args), ")");
}
