import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface CartItem {
	productId: string;
	productName: string;
	productSlug: string;
	variantId: string;
	flavor: string | null;
	nicotineMg: number | null;
	price: number;
	quantity: number;
	imageUrl: string | null;
}

const CART_KEY = 'hivape_cart';

function loadFromStorage(): CartItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(CART_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveToStorage(items: CartItem[]) {
	if (!browser) return;
	localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function createCartStore() {
	const { subscribe, set, update } = writable<CartItem[]>(loadFromStorage());

	return {
		subscribe,
		addItem(item: CartItem) {
			update((items) => {
				const existing = items.find(
					(i) => i.productId === item.productId && i.variantId === item.variantId
				);
				let newItems: CartItem[];
				if (existing) {
					newItems = items.map((i) =>
						i.productId === item.productId && i.variantId === item.variantId
							? { ...i, quantity: i.quantity + item.quantity }
							: i
					);
				} else {
					newItems = [...items, item];
				}
				saveToStorage(newItems);
				return newItems;
			});
		},
		removeItem(productId: string, variantId: string) {
			update((items) => {
				const newItems = items.filter(
					(i) => !(i.productId === productId && i.variantId === variantId)
				);
				saveToStorage(newItems);
				return newItems;
			});
		},
		updateQuantity(productId: string, variantId: string, quantity: number) {
			update((items) => {
				const newItems =
					quantity <= 0
						? items.filter((i) => !(i.productId === productId && i.variantId === variantId))
						: items.map((i) =>
								i.productId === productId && i.variantId === variantId
									? { ...i, quantity }
									: i
							);
				saveToStorage(newItems);
				return newItems;
			});
		},
		clear() {
			saveToStorage([]);
			set([]);
		},
		generateWhatsAppMessage(phone: string, siteUrl: string): string {
			let items: CartItem[] = [];
			const unsubscribe = this.subscribe((v) => (items = v));
			unsubscribe();

			if (items.length === 0) return `https://wa.me/${phone}`;

			const lines = items
				.map((item) => {
					const variant = [
						item.flavor,
						item.nicotineMg ? `${item.nicotineMg}mg` : null
					]
						.filter(Boolean)
						.join(', ');
					return `- Produk: ${item.productName}${variant ? `\n  Varian: ${variant}` : ''}\n  Jumlah: ${item.quantity}x\n  Harga: ${formatPrice(item.price * item.quantity)}\n  Link: ${siteUrl}/produk/${item.productSlug}`;
				})
				.join('\n\n');

			const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
			const message = `Halo HiVape Store, saya mau pesan:\n\n${lines}\n\nTotal: ${formatPrice(total)}`;

			return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
		}
	};
}

function formatPrice(n: number) {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export const cart = createCartStore();
