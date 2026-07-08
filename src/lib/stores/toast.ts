import { writable } from 'svelte/store';

export interface Toast {
	id: number;
	message: string;
	type: 'success' | 'error';
}

let nextId = 0;
const { subscribe, update } = writable<Toast[]>([]);

export const toasts = {
	subscribe,
	show(message: string, type: Toast['type'] = 'success', duration = 3000) {
		const id = nextId++;
		update((items) => [...items, { id, message, type }]);
		setTimeout(() => {
			update((items) => items.filter((t) => t.id !== id));
		}, duration);
	}
};
