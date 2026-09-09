import luau from "LuauAST";
import { assert } from "LuauAST/util/assert";
import { getEnding } from "LuauRenderer/util/getEnding";
import { getOrSetDefault } from "LuauRenderer/util/getOrSetDefault";
import { concat, flattenFragment, markClosing, markNode, RenderFragment } from "LuauRenderer/Fragment";

const INDENT_CHARACTER = "\t";
const INDENT_CHARACTER_LENGTH = INDENT_CHARACTER.length;

/**
 * Represents the state of a rendering process.
 */
export class RenderState {
	private indent = "";
	public seenTempNodes = new Map<number, string>();
	private readonly listNodesStack = new Array<luau.ListNode<luau.Statement>>();

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
		return flattenFragment(this.fragmentNewline(text)).code;
	}

	/**
	 * Prefixes the text with the current indent.
	 * @param text The text.
	 */
	public indented(text: string) {
		return flattenFragment(this.fragmentIndented(text)).code;
	}

	/**
	 * Renders a line, adding the current indent, a semicolon if necessary, and "\n".
	 * @param text The content of the line.
	 * @param endNode Node used to determine if a semicolon should be added. Undefined means no semi will be added.
	 */
	public line(text: string, endNode?: luau.Statement) {
		return flattenFragment(this.fragmentLine(text, endNode)).code;
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

	public fragmentNewline(text: RenderFragment): RenderFragment {
		return concat(text, "\n");
	}

	public fragmentIndented(text: RenderFragment): RenderFragment {
		return concat(this.indent, text);
	}

	public fragmentLine(text: RenderFragment, endNode?: luau.Statement): RenderFragment {
		return concat(this.fragmentIndented(text), endNode ? getEnding(this, endNode) : "", "\n");
	}

	public fragmentClosing(node: luau.Node): RenderFragment {
		return this.includePositions ? markClosing(node) : "";
	}

	public fragmentNode(node: luau.Node, content: RenderFragment): RenderFragment {
		return this.includePositions ? markNode(node, content) : content;
	}
}
