import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { concat, markClosing, markLayout, markNode, RenderFragment } from "LuauRenderer/Fragment";
import { getEnding } from "LuauRenderer/util/getEnding";
import { getOrSetDefault } from "LuauRenderer/util/getOrSetDefault";

const INDENT_CHARACTER = "\t";
const INDENT_CHARACTER_LENGTH = INDENT_CHARACTER.length;

/**
 * Represents the state of a rendering process.
 */
export class RenderState {
	private indent = "";
	public seenTempNodes = new Map<number, string>();
	private readonly listNodesStack = new Array<luau.ListNode<luau.Statement>>();

	/**
	 * @param includePositions Whether to mark nodes in rendered fragments so their positions can be measured.
	 */
	public constructor(public readonly includePositions = false) {}

	/**
	 * Pushes an indent to the current indent level.
	 */
	private pushIndent() {
		this.indent += INDENT_CHARACTER;
	}

	/**
	 * Pops an indent from the current indent level.
	 */
	private popIndent() {
		this.indent = this.indent.substr(INDENT_CHARACTER_LENGTH);
	}

	private tempIdFallback = 0;

	/**
	 * Returns an unique identifier that is unused in the current scope.
	 * `this.seenTempNodes` should already be fully populated by this point!
	 * This is a fallback mechanism for when `solveTempIds()` does not catch something properly.
	 * @param node The identifier of the node
	 */
	public getTempName(node: luau.TemporaryIdentifier) {
		const name = getOrSetDefault(this.seenTempNodes, node.id, () => `_${this.tempIdFallback++}`);
		assert(name);
		return name;
	}

	/**
	 * Pushes a LuauAST node to the top of the list node stack
	 * @param listNode The syntax node to add to the stop of the stack.
	 */
	public pushListNode(listNode: luau.ListNode<luau.Statement>) {
		this.listNodesStack.push(listNode);
	}

	/**
	 * Returns the top of the scope stack.
	 */
	public peekListNode(): luau.ListNode<luau.Statement> | undefined {
		return this.listNodesStack[this.listNodesStack.length - 1];
	}

	/**
	 * Pops the top list node off the syntax tree node stack.
	 */
	public popListNode() {
		return this.listNodesStack.pop();
	}

	/**
	 * Adds a newline to the end of the string.
	 * @param text The text.
	 */
	public newline(text: string) {
		return text + "\n";
	}

	/**
	 * Prefixes the text with the current indent.
	 * @param text The text.
	 */
	public indented(text: string) {
		return this.indent + text;
	}

	/**
	 * Renders a line, adding the current indent, a semicolon if necessary, and "\n".
	 * @param text The content of the line.
	 * @param endNode Node used to determine if a semicolon should be added. Undefined means no semi will be added.
	 */
	public line(text: string, endNode?: luau.Statement) {
		let result = this.indented(text);
		if (endNode) {
			result += getEnding(this, endNode);
		}
		result = this.newline(result);
		return result;
	}

	/**
	 * Returns a rendered code block.
	 * @param callback The function used to render the block.
	 */
	public block<T>(callback: () => T) {
		this.pushIndent();
		const result = callback();
		this.popIndent();
		return result;
	}

	/**
	 * Marks `text` as whitespace which separates code and is not part of any node's range.
	 */
	public layout(text: string) {
		return this.includePositions && text !== "" ? markLayout(text) : text;
	}

	/**
	 * Like `newline()`, but for fragments.
	 */
	public newlineFragment(fragment: RenderFragment) {
		return concat(fragment, this.layout("\n"));
	}

	/**
	 * Like `indented()`, but for fragments.
	 */
	public indentedFragment(fragment: RenderFragment) {
		return concat(this.layout(this.indent), fragment);
	}

	/**
	 * Like `line()`, but for fragments.
	 */
	public lineFragment(fragment: RenderFragment, endNode?: luau.Statement) {
		if (endNode) {
			fragment = concat(fragment, getEnding(this, endNode));
		}
		return this.newlineFragment(this.indentedFragment(fragment));
	}

	/**
	 * Marks `content` as the rendered code of `node`.
	 */
	public markNode(node: luau.Node, content: RenderFragment) {
		return this.includePositions ? markNode(node, content) : content;
	}

	/**
	 * Marks where the closing keyword of `node`, like `end` or `until`, begins.
	 */
	public markClosing(node: luau.Node) {
		return this.includePositions ? markClosing(node) : "";
	}
}
