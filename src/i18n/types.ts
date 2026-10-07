/**
 * Форма словаря перевода. ru.ts и kk.ts обязаны реализовать Dict целиком —
 * если забыть строку при переводе, TypeScript укажет на неё при сборке.
 */

export type SectionId =
  | 'top'
  | 'why'
  | 'methods'
  | 'specialist'
  | 'directions'
  | 'program'
  | 'women'
  | 'price'
  | 'organize'
  | 'leadership'
  | 'safety'
  | 'contacts';

export type TitledText = { title: string; text: string };

export type Dict = {
  /** Подписи секций: точечная навигация, aria-live, aria-label секции. */
  sections: Record<SectionId, string>;

  common: {
    sectionsNav: string;
    /** Объявление текущей секции для скринридера и aria-label точки. */
    sectionAnnounce: (current: number, total: number, label: string) => string;
    scrollNext: string;
    scrollTop: string;
  };

  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaPrimary: string;
    ctaGhost: string;
    pills: [string, string, string];
  };

  heroPoster: {
    alt: string;
  };

  whyCompany: {
    eyebrow: string;
    title: string;
    lead: string;
    realityTitle: string;
    reality: [string, string, string, string, string];
    forEmployeeTitle: string;
    forEmployee: [string, string, string, string];
    forCompanyTitle: string;
    forCompany: [string, string, string, string];
  };

  methods: {
    eyebrow: string;
    title: string;
    lead: string;
    items: [
      TitledText & { alt: string },
      TitledText & { alt: string },
      TitledText & { alt: string },
      TitledText & { alt: string },
    ];
    footerQuote: string;
  };

  specialist: {
    eyebrow: string;
    title: string;
    lead: string;
    videoPlaceholder: string;
    videoAria: string;
    playAria: string;
    videoBadge: string;
    photoLabel: string;
    role: string;
    level: string;
    facts: [
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
    ];
  };

  directions: {
    eyebrow: string;
    title: string;
    items: [TitledText, TitledText, TitledText, TitledText];
  };

  program: {
    eyebrow: string;
    title: string;
    lead: string;
    methodsBoxTitle: string;
    methodsBoxText: string;
    methodsBoxNote: string;
    steps: [TitledText, TitledText, TitledText, TitledText, TitledText];
  };

  women: {
    eyebrow: string;
    title: string;
    lead: string;
    priceCardTitle: string;
    priceDuration: string;
    topics: [string, string, string, string, string];
    note: string;
    imageAlt: string;
    placeholderKind: string;
    placeholderTitle: string;
  };

  pricing: {
    eyebrow: string;
    title: string;
    lead: string;
    card1Badge: string;
    card1Title: string;
    card1Price: string;
    card1Text: string;
    card2Badge: string;
    card2Title: string;
    card2Duration: string;
    card2FooterPrefix: string;
    card3Badge: string;
    card3Title: string;
    card3Text: string;
    footNote: string;
  };

  organize: {
    eyebrow: string;
    title: string;
    lead: string;
    flow: [string, string, string, string, string];
    steps: [string, string, string, string, string, string, string];
    format1Label: string;
    format1Title: string;
    format2Label: string;
    format2Title: string;
  };

  leadership: {
    eyebrow: string;
    title: string;
    lead: string;
    bigNumberCaption: string;
    benefits: [
      TitledText,
      TitledText,
      TitledText,
      TitledText,
      TitledText,
      TitledText,
    ];
  };

  safety: {
    eyebrow: string;
    title: string;
    items: [TitledText, TitledText, TitledText, TitledText];
  };

  contacts: {
    eyebrow: string;
    title: string;
    lead: string;
    tags: [string, string, string, string];
    closingQuote: string;
  };
};
