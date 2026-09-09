import luau from "LuauAST";
import { concat, markClosing, markNode, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderIfStatement(state: RenderState, node: luau.IfStatement) {
	const result = new Array<RenderFragment>(
		state.fragmentLine(concat("if ", renderNode(state, node.condition), " then")),
		state.fragmentBlock(() => renderStatementsFragment(state, node.statements)),
	);

	let currentElseBody = node.elseBody;
	while (luau.isNode(currentElseBody)) {
		const statements = currentElseBody.statements;
		result.push(
			markNode(
				currentElseBody,
				concat(
					state.fragmentLine(concat("elseif ", renderNode(state, currentElseBody.condition), " then")),
					state.fragmentBlock(() => renderStatementsFragment(state, statements)),
				),
			),
		);
		currentElseBody = currentElseBody.elseBody;
	}

	if (currentElseBody && luau.list.isNonEmpty(currentElseBody)) {
		result.push(state.fragmentLine("else"));
		const statements = currentElseBody;
		result.push(state.fragmentBlock(() => renderStatementsFragment(state, statements)));
	}

	result.push(markClosing(node), state.fragmentLine("end"));
	return concat(...result);
}
