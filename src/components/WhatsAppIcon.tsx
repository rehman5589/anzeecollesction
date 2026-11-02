/** Official WhatsApp glyph — renders the house-approved real image asset. */
export default function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
 return <img loading="lazy" src="/images/whatsapp-icon.webp" alt="" aria-hidden="true" draggable={false} className={`${className} object-contain select-none`} />;
}
