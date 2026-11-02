import { FourPanelComic } from '../FourPanelComic';

interface StageProblemProps {
  onNext: () => void;
}

export function StageProblem({ onNext }: StageProblemProps) {
  return <FourPanelComic panels={[undefined, undefined, undefined, undefined]} onNext={onNext} />;
}
