import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { renderNode, RenderState } from "LuauRenderer";
import { fragmentToString, RenderFragment, sequence } from "LuauRenderer/Fragment";

/**
 * Renders the given list of statements.
 *
 * Pushes each listNode onto the state.listNodesStack as it gets
 * rendered to give context to other statements as they render.
 * Useful for getting the next or previous sibling statement.
 */
export function renderStatements(state: RenderState, statements: luau.List<luau.Statement>) {
	return fragmentToString(renderStatementsFragment(state, statements));
}

/**
 * Like `renderStatements()`, but returns a fragment that can contain position markers.
 */
export function renderStatementsFragment(state: RenderState, statements: luau.List<luau.Statement>) {
	const result = new Array<RenderFragment>();
	let listNode = statements.head;
	let hasFinalStatement = false;
	while (listNode !== undefined) {
		assert(
			!hasFinalStatement || luau.isComment(listNode.value),
			"Cannot render statement after break, continue, or return!",
		);
		hasFinalStatement ||= luau.isFinalStatement(listNode.value);

		state.pushListNode(listNode);
		result.push(renderNode(state, listNode.value));
		state.popListNode();

		listNode = listNode.next;
	}
	return sequence(result);
}
