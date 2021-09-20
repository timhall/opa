import { Readable } from "stream";
import { bufferToStream, streamToBuffer } from "./fs";
import zlib from "zlib";
import tar from "tar";

export interface Bundle {
	policy: Buffer;
	data?: Record<string, unknown>;
}

interface ParseResult {
	policy?: Buffer;
	data?: Buffer;
}

export async function parseBundle(bundle: Buffer | Readable): Promise<Bundle> {
	const data = Buffer.isBuffer(bundle) ? bufferToStream(bundle) : bundle;

	const result = await new Promise<ParseResult>((resolve, reject) => {
		const parsing = data.pipe(zlib.createGunzip()).pipe(tar.Parse());
		const result: ParseResult = {};

		parsing.on("entry", async (entry) => {
			try {
				if (entry.path === "/policy.wasm") {
					result.policy = await streamToBuffer(entry);
				}
				if (entry.path === "/data.json") {
					result.data = await streamToBuffer(entry);
				} else {
					entry.resume();
				}
			} catch (error) {
				parsing.abort(error);
			}
		});

		parsing.on("error", reject);
		parsing.on("close", () => resolve(result));
	});

	if (!result.policy) {
		throw new Error(`Failed to read bundle, /policy.wasm not found.`);
	}

	return {
		policy: result.policy,
		data: result.data ? parseJson(result.data) : {},
	};
}

function parseJson(raw: Buffer): Record<string, unknown> {
	try {
		const json = raw.toString();
		const data = JSON.parse(json);

		if (!isObject(data)) {
			throw new Error(`Unexpected type, only objects are supported.`);
		}

		return data;
	} catch (error) {
		throw new Error(`Failed to parse /data.json, ${error.message}`);
	}
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
