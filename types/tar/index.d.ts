declare module "tar" {
	import { Writable } from "stream";

	export class Parse extends Writable {
		abort(error?: unknown): void;
	}
}
