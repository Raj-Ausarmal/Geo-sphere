
import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Search } from 'lucide-react';

import { Earth } from '../components/globe/Earth';
import type { GlobeControlsHandle } from '../components/globe/GlobeControls';

import { QuestionPanel } from '../components/game/QuestionPanel';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { Timer } from '../components/game/Timer';
import { AnswerOptions } from '../components/game/AnswerOptions';

import { useGameStore } from '../store/gameStore';
import { pool, question } from '../utils/game';

export function Game({
  onFinish,
}: {
  onFinish: (result: {
    score: number;
    correct: number;
    total: number;
  }) => void;
}) {
  const { mode, difficulty, region } = useGameStore();

  const globeRef = useRef<GlobeControlsHandle>(null);

  const questions = useMemo(
    () => pool(region, difficulty).slice(0, 10),
    [region, difficulty]
  );

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [feedback, setFeedback] = useState<string>();

  const country = questions[idx];

  const progress = questions.length
    ? ((idx + 1) / questions.length) * 100
    : 0;

  const q = useMemo(
    () =>
      country && mode !== 'locator'
        ? question(country, mode)
        : undefined,
    [country, mode]
  );

  useEffect(() => {
    setSeconds(45);
    setFeedback(undefined);
  }, [idx]);

  useEffect(() => {
    if (feedback) return;

    const timer = setInterval(() => {
      setSeconds(s => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [feedback]);

  useEffect(() => {
    if (seconds === 0 && !feedback) answer(false);
  }, [seconds, feedback]);

  if (!country) {
    onFinish({
      score,
      correct,
      total: questions.length,
    });
    return null;
  }

  const advance = () => {
    if (idx + 1 === questions.length) {
      onFinish({
        score,
        correct,
        total: questions.length,
      });
    } else {
      setIdx(i => i + 1);
    }
  };

  const answer = (ok: boolean) => {
    if (feedback) return;

    setAnswered(a => a + 1);

    setFeedback(
      ok
        ? 'Correct — excellent work.'
        : 'Not quite — here is the answer.'
    );

    if (ok) {
      setCorrect(c => c + 1);
      setScore(s => s + 100 + streak * 25);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(advance, 1100);
  };

  const selected = (id: number) => answer(id === country.id);

  const pick = (v: string) =>
    answer(v === (mode === 'capital' ? country.capital : country.code));

  return (
    <main className="game">
      <header>
        <span className="brand">GeoSphere</span>

        <ScoreBoard
          score={score}
          streak={streak}
          answered={answered}
          correct={correct}
        />

        <Timer seconds={seconds} />
      </header>

      <div className="question-progress">
        <div className="progress-info">
          <span>
            Question {idx + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="game-layout">
        <div className="globe-wrap">
          <Earth
            ref={globeRef}
            highlight={
              feedback && mode === 'locator'
                ? country.id
                : undefined
            }
            onCountry={mode === 'locator' ? selected : undefined}
            reset={0}
          />

          <div className="globe-tools">
            <button
              aria-label="Reset globe"
              title="Reset globe"
              onClick={() => globeRef.current?.reset()}
            >
              <RotateCcw />
            </button>

            <button
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => globeRef.current?.zoomIn()}
            >
              <ZoomIn />
            </button>

            <button
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => globeRef.current?.zoomOut()}
            >
              <ZoomOut />
            </button>
          </div>

          <div className="globe-caption">
            DRAG TO ROTATE · SCROLL TO ZOOM
          </div>
        </div>

        <aside>
          <QuestionPanel
            mode={mode}
            country={country}
            index={idx}
            total={questions.length}
          />

          {mode === 'locator' && (
            <div className="search">
              <Search />
              <input
                placeholder="Search is coming soon"
                disabled
              />
            </div>
          )}

          {mode !== 'locator' && q && (
            <AnswerOptions
              options={q.choices}
              mode={mode}
              onPick={pick}
              answer={
                feedback
                  ? mode === 'capital'
                    ? country.capital
                    : country.code
                  : undefined
              }
              disabled={!!feedback}
            />
          )}

          <div
            className={
              feedback?.startsWith('Correct')
                ? 'feedback success'
                : feedback
                  ? 'feedback fail'
                  : 'feedback'
            }
          >
            {feedback}
          </div>
        </aside>
      </div>
    </main>
  );
}
