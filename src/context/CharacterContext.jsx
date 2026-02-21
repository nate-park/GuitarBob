import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'guitarbob-character';
const DEFAULT_CHARACTER = 'bob';

const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [characterId, setCharacterIdState] = useState(DEFAULT_CHARACTER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCharacterIdState(saved);
    } catch (_) {}
  }, []);

  const setCharacterId = (id) => {
    setCharacterIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (_) {}
  };

  return (
    <CharacterContext.Provider value={{ characterId, setCharacterId }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used inside CharacterProvider');
  return ctx;
}

export const CHARACTERS = [
  { id: 'bob', name: 'Bob', emoji: '🎸', color: 'bob-green' },
  { id: 'luna', name: 'Luna', emoji: '🐱', color: 'bob-purple' },
  { id: 'riff', name: 'Riff', emoji: '⭐', color: 'bob-orange' },
];
