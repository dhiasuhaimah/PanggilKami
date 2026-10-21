import React from 'react';
import { PhoneCall } from 'lucide-react';
import { generateWhatsAppUrl } from '../utils';

interface FloatingWhatsAppProps {
  orderCode?: string;
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ orderCode, customMessage }) => {
  const defaultText = orderCode 
    ? `Halo Customer Service PanggilKami, saya ingin konfirmasi pesanan dengan kode ${orderCode}.`
    : 'Halo Customer Service PanggilKami Solo Baru, saya butuh bantuan untuk layanan jasa.';

  const message = customMessage || defaultText;
  const whatsappUrl = generateWhatsAppUrl('082283883580', message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      title="Hubungi CS PanggilKami via WhatsApp (082283883580)"
    >
      <PhoneCall size={20} />
      <span className="label">Bantuan WhatsApp CS</span>
    </a>
  );
};
