import { useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import GrainOverlay from './GrainOverlay';
import AudioController, { useAudio } from './AudioController';
import NavigationDots, { type Scene } from './NavigationDots';
import PageFlip from './PageFlip';
import EnvelopeScene from './EnvelopeScene';
import EditionScene from './EditionScene';
import ReasonsScene from './ReasonsScene';
import QuestionScene from './QuestionScene';
import Atmosphere from './Atmosphere';
import LiquidTransition from './LiquidTransition';
import GlobalIllumination from './GlobalIllumination';
import ProceduralLace from './ProceduralLace';
import HeroObject from './HeroObject';
import BloomExplosion from './BloomExplosion';
import ConfirmedScene from './ConfirmedScene';
import { getValentineData } from '@/data';

const SCENE_ORDER: Scene[] = ['intro', 'edition', 'reasons', 'question', 'confirmed'];
const data = getValentineData();

const AppShell = () => {
  const [scene, setScene] = useState<Scene>('intro');
  const [targetScene, setTargetScene] = useState<Scene | null>(null);
  const prevSceneRef = useRef<Scene>('intro');
  const { muted, toggleMute, play } = useAudio();

  const getDirection = useCallback((next: Scene) => {
    const prevIdx = SCENE_ORDER.indexOf(prevSceneRef.current);
    const nextIdx = SCENE_ORDER.indexOf(next);
    return nextIdx >= prevIdx ? 'forward' : 'backward';
  }, []);

  const goTo = useCallback((s: Scene) => {
    if (s === scene) return;
    setTargetScene(s);
  }, [scene]);

  const handleTransitionComplete = () => {
    if (targetScene) {
      prevSceneRef.current = scene;
      play('paperRustle');
      setScene(targetScene);
      setTargetScene(null);
    }
  };

  const direction = getDirection(scene);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background holographic-sheen" style={{ perspective: '1500px' }}>
      <GrainOverlay />
      <Atmosphere scene={scene} />
      <ProceduralLace />
      <LiquidTransition isTriggered={!!targetScene} onComplete={handleTransitionComplete} />
      <BloomExplosion isTriggered={targetScene === 'confirmed'} />

      <GlobalIllumination>
        <HeroObject scene={scene} initials={data.initials} />
        <AudioController muted={muted} onToggle={toggleMute} />
        {scene !== 'intro' && (
          <NavigationDots current={scene} onNavigate={goTo} />
        )}

        <AnimatePresence mode="wait">
          {scene === 'intro' && (
            <PageFlip motionKey="intro" direction={direction}>
              <EnvelopeScene
                onComplete={() => goTo('edition')}
                playSound={play}
              />
            </PageFlip>
          )}
          {scene === 'edition' && (
            <PageFlip motionKey="edition" direction={direction}>
              <EditionScene onNext={() => goTo('reasons')} />
            </PageFlip>
          )}
          {scene === 'reasons' && (
            <PageFlip motionKey="reasons" direction={direction}>
              <ReasonsScene onNext={() => goTo('question')} playSound={play} />
            </PageFlip>
          )}
          {scene === 'question' && (
            <PageFlip motionKey="question" direction={direction}>
              <QuestionScene onAnswer={() => goTo('confirmed')} playSound={play} />
            </PageFlip>
          )}
          {scene === 'confirmed' && (
            <PageFlip motionKey="confirmed" direction={direction}>
              <ConfirmedScene playSound={play} />
            </PageFlip>
          )}
        </AnimatePresence>
      </GlobalIllumination>
    </div>
  );
};

export default AppShell;
