export type ResolveType<TPromise extends Promise<unknown>> =
	TPromise extends Promise<infer TResolve> ? TResolve : never;
