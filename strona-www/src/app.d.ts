// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { user } from "$lib/server/types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: user | undefined
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
