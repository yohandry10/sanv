export interface ValentineData {
  to: string;
  from: string;
  initials: string;
  date: string;
  reasons: string[];
  headline: string;
  subtitle: string;
  coupon1: string;
  coupon2: string;
  mode: 'romantic' | 'funny';
}

function getQueryParams(): Partial<ValentineData> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    to: params.get('to') || undefined,
    from: params.get('from') || undefined,
    initials: params.get('initials') || undefined,
  };
}

const defaults: ValentineData = {
  to: 'Mi Amor',
  from: 'Tu novio que te adora',
  initials: '♡',
  date: '14 de Febrero, 2026',
  reasons: [
    'Porque tu sonrisa ilumina hasta el día más gris.',
    'Porque cada momento contigo se siente como magia.',
    'Porque me haces querer ser mejor persona cada día.',
    'Porque tu risa es mi canción favorita en el mundo.',
    'Porque contigo descubrí lo que significa amar de verdad.',
  ],
  headline: 'Will you be my',
  subtitle: 'San Valentín?',
  coupon1: 'Cena romántica bajo las estrellas ✦',
  coupon2: 'Un día completo de mimos y cariño ✦',
  mode: 'romantic',
};

export function getValentineData(): ValentineData {
  const queryParams = getQueryParams();
  return {
    ...defaults,
    ...(queryParams.to && { to: queryParams.to }),
    ...(queryParams.from && { from: queryParams.from }),
    ...(queryParams.initials && { initials: queryParams.initials }),
  };
}
