import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'guitarbob-character';
const XP_STORAGE_KEY = 'guitarbob-xp';
const UNLOCKED_KEY = 'guitarbob-unlocked';
const DEFAULT_CHARACTER = 'bob';

const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [characterId, setCharacterIdState] = useState(DEFAULT_CHARACTER);
  const [xp, setXpState] = useState(0);
  const [unlockedIds, setUnlockedIds] = useState(() => []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'bob' || saved === 'riff')) setCharacterIdState(saved);
      const savedXp = localStorage.getItem(XP_STORAGE_KEY);
      if (savedXp != null) setXpState(Math.max(0, Number(savedXp) || 0));
      const savedUnlocked = localStorage.getItem(UNLOCKED_KEY);
      if (savedUnlocked) {
        try {
          const arr = JSON.parse(savedUnlocked);
          if (Array.isArray(arr)) setUnlockedIds(arr);
        } catch (_) {}
      }
    } catch (_) {}
  }, []);

  const setCharacterId = (id) => {
    const char = CHARACTERS.find((c) => c.id === id);
    const isUnlocked = !char?.unlockXp || unlockedIds.includes(id);
    if (!isUnlocked) return;
    setCharacterIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (_) {}
  };

  const setXp = (value) => {
    setXpState(value);
    try {
      localStorage.setItem(XP_STORAGE_KEY, String(value));
    } catch (_) {}
  };

  const unlockCharacter = (id) => {
    if (unlockedIds.includes(id)) return;
    const char = CHARACTERS.find((c) => c.id === id);
    if (!char?.unlockXp || xp < char.unlockXp) return;
    const next = [...unlockedIds, id];
    setUnlockedIds(next);
    try {
      localStorage.setItem(UNLOCKED_KEY, JSON.stringify(next));
    } catch (_) {}
  };

  const isUnlocked = (id) => {
    const char = CHARACTERS.find((c) => c.id === id);
    return !char?.unlockXp || unlockedIds.includes(id);
  };

  const canUnlock = (id) => {
    const char = CHARACTERS.find((c) => c.id === id);
    return char?.unlockXp != null && xp >= char.unlockXp && !unlockedIds.includes(id);
  };

  return (
    <CharacterContext.Provider value={{ characterId, setCharacterId, xp, setXp, unlockCharacter, isUnlocked, canUnlock }}>
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
  { id: 'riff', name: 'Riff', emoji: '⭐', color: 'bob-orange', unlockXp: 50 },
];
