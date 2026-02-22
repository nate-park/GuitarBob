import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BobWithSpeech from '../components/BobWithSpeech';
import ChordDiagramInteractive from '../components/ChordDiagramInteractive';
import { CHORD_DATA } from '../components/ChordDiagram';

export default function ChordDetail() {
  const { chordKey } = useParams();
  const navigate = useNavigate();
  const [hoveredNote, setHoveredNote] = useState(null);
  const chordData = chordKey ? CHORD_DATA[chordKey] : null;

  if (!chordData) {
    return (
      <div className="min-h-screen flex flex-col practice-space-bg">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <p className="font-body text-gray-600 mb-6">Chord not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-bob-green"
          >
            ← Go back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col practice-space-bg">
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center">
          {/* Bob says the note name when hovering */}
          <div className="mb-8 w-full">
            <BobWithSpeech
              pose="teaching"
              bobSize={140}
              message={
                hoveredNote
                  ? `That's ${hoveredNote.noteName} — the ${hoveredNote.interval}!`
                  : 'Hover over each note and I\'ll tell you its name and interval.'
              }
            />
          </div>

          {/* Interactive chord diagram */}
          <ChordDiagramInteractive chord={chordKey} size={220} onHoverChange={setHoveredNote} />

          <p className="font-body text-sm text-gray-600 mt-6 text-center max-w-md">
            Standard tuning (EADGBE). Intervals are labeled for this chord shape — chords with the same shape share the same interval positions.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 btn-bob-outline"
          >
            ← Back to Practice
          </button>
        </div>
      </main>
    </div>
  );
}
