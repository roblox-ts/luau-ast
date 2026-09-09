import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat, flattenFragment, RenderFragment } from "LuauRenderer/Fragment";
import { renderNode } from "LuauRenderer/render";
import { RenderState } from "LuauRenderer/RenderState";

/**
 * Renders the given list of statements.
 *
 * Pushes each listNode onto the state.listNodesStack as it gets
 * rendered to give context to other statements as they render.
 * Useful for getting the next or previous sibling statement.
 */
export function renderStatements(state: RenderState, statements: luau.List<luau.Statement>) {
	return flattenFragment(renderStatementsFragment(state, statements)).code;
}

/** @internal */
export function renderStatementsFragment(state: RenderState, statements: luau.List<luau.Statement>): RenderFragment {
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
	return concat(...result);
}
