import { Deck } from './components/Deck';
import { Flow } from './components/Flow';
import { useDeckEnabled } from './lib/deck';
import { useAnchorAlign } from './hooks/useAnchorAlign';

export default function App() {
  const deck = useDeckEnabled();

  // Якоря в обычном режиме: в покадровом ими занимается useSectionScroll.
  useAnchorAlign(!deck);

  return deck ? <Deck /> : <Flow />;
}
