import { useLanguage } from '../i18n/context';

/**
 * Переключатель языка в правом верхнем углу: сегмент из двух кнопок,
 * активная подсвечена зелёным. Поверх бамбука и шапки секций (z-40),
 * фон сплошной, поэтому стебли под ней не мешают читать.
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Сайт тілі / Язык сайта"
      className="fixed right-3 top-3 z-40 flex items-center gap-0.5 rounded-full border border-line bg-white/85 p-1 shadow-[0_8px_24px_rgba(15,61,43,0.12)] backdrop-blur-md md:right-5 md:top-4"
    >
      <button
        type="button"
        onClick={() => setLanguage('ru')}
        aria-pressed={language === 'ru'}
        aria-label="Русский"
        className={`min-h-[32px] rounded-full px-3 text-[13px] font-semibold tracking-[0.02em] transition-colors ${
          language === 'ru'
            ? 'bg-green text-white'
            : 'text-ink-soft hover:text-green'
        }`}
      >
        РУС
      </button>
      <button
        type="button"
        onClick={() => setLanguage('kk')}
        aria-pressed={language === 'kk'}
        aria-label="Қазақша"
        className={`min-h-[32px] rounded-full px-3 text-[13px] font-semibold tracking-[0.02em] transition-colors ${
          language === 'kk'
            ? 'bg-green text-white'
            : 'text-ink-soft hover:text-green'
        }`}
      >
        ҚАЗ
      </button>
    </div>
  );
}
