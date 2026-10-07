import { Deck } from './components/Deck';
import { Flow } from './components/Flow';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useDeckEnabled } from './lib/deck';
import { useAnchorAlign } from './hooks/useAnchorAlign';
import { LanguageProvider } from './i18n/context';

export default function App() {
  const deck = useDeckEnabled();

  // Якоря в обычном режиме: в покадровом ими занимается useSectionScroll.
  useAnchorAlign(!deck);

  return (
    <LanguageProvider>
      <LanguageSwitcher />
      {deck ? <Deck /> : <Flow />}
    </LanguageProvider>
  );
}
