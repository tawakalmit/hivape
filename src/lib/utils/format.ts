export function formatPrice(price: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0
	}).format(price);
}

export function formatPriceRange(min: number, max: number): string {
	if (min === max) return formatPrice(min);
	return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function generateWhatsAppLink(
	phone: string,
	productName: string,
	variant: string,
	quantity: number,
	productUrl: string
): string {
	const message =
		`Halo HiVape Store, saya mau pesan:\n` +
		`- Produk: ${productName}\n` +
		`- Varian: ${variant}\n` +
		`- Jumlah: ${quantity}\n` +
		`Link produk: ${productUrl}`;
	return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.trim();
}
