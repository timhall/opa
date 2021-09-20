import { Readable } from "stream";
import { parseBundle } from "./bundle";
import { loadPolicy } from "@open-policy-agent/opa-wasm";
import { ResolveType } from "./promises";
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";

export interface OpaClientConfig {
	config?: string;
	agent?: HttpAgent | HttpsAgent;
}

export interface LoadOptions {
	signal?: AbortSignal;
}

type LoadedPolicy = ResolveType<ReturnType<typeof loadPolicy>>;

export class OpaClient {
	protected _config: OpaClientConfig;
	protected _policy: LoadedPolicy | undefined;

	constructor(config: OpaClientConfig = {}) {
		this._config = config;
	}

	async load(options: LoadOptions): Promise<void> {
		// TODO
	}

	async loadBundle(bundle: Buffer | Readable): Promise<void> {
		const { policy, data } = await parseBundle(bundle);

		await this.loadPolicy(policy);
		if (data) this.setData(data);
	}

	async loadPolicy(policy: Buffer): Promise<void> {
		this._policy = await loadPolicy(policy);
	}

	setData(data: Record<string, unknown>): void {
		if (this._policy) this._policy.setData(data);
	}

	evaluate(
		input?: Record<string, unknown>,
		entrypoint?: string
	): Record<string, unknown> {
		return this._policy ? this._policy.evaluate(input, entrypoint) : {};
	}
}
