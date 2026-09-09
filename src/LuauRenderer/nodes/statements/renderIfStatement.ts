import luau from "LuauAST";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderIfStatement(state: RenderState, node: luau.IfStatement) {
	const alternatives = new Array<{ node: luau.IfStatement; content: RenderFragment }>();
	let currentElseBody = node.elseBody;
	while (luau.isNode(currentElseBody)) {
		const elseifNode = currentElseBody;
		alternatives.push({
			node: elseifNode,
			content: concat(
				state.fragmentLine(concat("elseif ", renderNode(state, elseifNode.condition), " then")),
				state.block(() => renderStatementsFragment(state, elseifNode.statements)),
			),
		});
		currentElseBody = currentElseBody.elseBody;
	}

	let alternative: RenderFragment = "";
	if (currentElseBody && luau.list.isNonEmpty(currentElseBody)) {
		const elseStatements = currentElseBody;
		alternative = concat(
			state.fragmentLine("else"),
			state.block(() => renderStatementsFragment(state, elseStatements)),
		);
	}
	for (let index = alternatives.length - 1; index >= 0; index--) {
		const elseifNode = alternatives[index];
		alternative = state.fragmentNode(elseifNode.node, concat(elseifNode.content, alternative));
	}

	return concat(
		state.fragmentLine(concat("if ", renderNode(state, node.condition), " then")),
		state.block(() => renderStatementsFragment(state, node.statements)),
		alternative,
		state.fragmentClosingLine(node, "end"),
	);
}
