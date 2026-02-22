import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import Bob from './Bob';
import Riff from './Riff';

const CHARACTER_MAP = { bob: Bob, riff: Riff };

/**
 * Renders the currently selected tutor character (Bob or Riff).
 */
export default function Mascot({ pose = 'default', size = 200, className = '' }) {
  const { characterId } = useCharacter();
  const Character = CHARACTER_MAP[characterId] ?? Bob;
  return <Character pose={pose} size={size} className={className} />;
}
