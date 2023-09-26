import { globals } from "LuauAST/impl/globals";

export function isReservedIdentifier(id: string) {
	return globals.hasOwnProperty(id);
}
