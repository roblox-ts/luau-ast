import { globals } from "LuauAST/impl/globals";

export function isReservedIdentifier(id: string) {
	return Object.prototype.hasOwnProperty.call(globals, id);
}
