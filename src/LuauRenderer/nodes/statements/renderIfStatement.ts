import luau from "LuauAST";
import { renderNode, RenderState } from "LuauRenderer";
import { concat, RenderFragment } from "LuauRenderer/Fragment";
import { renderStatementsFragment } from "LuauRenderer/util/renderStatements";

export function renderIfStatement(state: RenderState, node: luau.IfStatement) {
	const head = concat(
		state.lineFragment(concat("if ", renderNode(state, node.condition), " then")),
		state.block(() => renderStatementsFragment(state, node.statements)),
	);

	const elseIfs = new Array<[luau.IfStatement, RenderFragment]>();
	let currentElseBody = node.elseBody;
	while (luau.isNode(currentElseBody)) {
		const statements = currentElseBody.statements;
		const elseIfHead = concat(
			state.lineFragment(concat("elseif ", renderNode(state, currentElseBody.condition), " then")),
			state.block(() => renderStatementsFragment(state, statements)),
		);
		elseIfs.push([currentElseBody, elseIfHead]);
		currentElseBody = currentElseBody.elseBody;
	}

	let tail: RenderFragment = "";
	if (currentElseBody && luau.list.isNonEmpty(currentElseBody)) {
		const statements = currentElseBody;
		tail = concat(
			state.lineFragment(`else`),
			state.block(() => renderStatementsFragment(state, statements)),
		);
	}

	// each `elseif` is a nested luau.IfStatement which includes all of the branches after it
	for (let i = elseIfs.length - 1; i >= 0; i--) {
		const [elseIf, elseIfHead] = elseIfs[i];
		tail = state.markNode(elseIf, concat(elseIfHead, tail));
	}

	return concat(head, tail, state.lineFragment(concat(state.markClosing(node), "end")));
}
