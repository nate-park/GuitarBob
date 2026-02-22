// Character-specific dialogues for the Home page
export const CHARACTER_DIALOGUES = {
  bob: [
    {
      main: "Upload any song and I'll figure out the chords and tabs for you. Then we'll practice together, step by step. Ready?",
      greeting: "Hey there, rockstar!",
      subtext: "I'm Bob – your guitar buddy. Let's learn something cool!",
      cta: "Use your electric guitar + audio interface to play along!",
    },
    {
      main: "Got a song you love? Let's break it down together! I'll handle the chords and tabs, and you'll be playing like a pro in no time.",
      greeting: "Welcome back, friend!",
      subtext: "I'm Bob – here to make guitar fun and easy for you.",
      cta: "Ready to jam? Grab your guitar and let's go!",
    },
    {
      main: "Music is the best teacher, and I'm here to help! Upload a track and let's discover what makes it so awesome.",
      greeting: "Let's make some music!",
      subtext: "I'm Bob – your enthusiastic guitar teacher. You've got this!",
      cta: "Plug in your guitar and let's learn together!",
    },
    {
      main: "Every song is a chance to grow. Drop a track here and we'll unlock all the secrets together. I believe in you!",
      greeting: "Time to shine!",
      subtext: "I'm Bob – your biggest cheerleader on this guitar journey.",
      cta: "Let's turn that dream song into reality!",
    },
    {
      main: "The best part about guitar? Every day you get better. Let's pick a song and start your next chapter.",
      greeting: "Welcome back, superstar!",
      subtext: "I'm Bob – excited to help you grow. You're awesome!",
      cta: "Bring your guitar and your enthusiasm!",
    },
  ],
  riff: [
    {
      main: "Drop a track and I'll break down the chords and tabs. We'll level up your playing together – no excuses, no shortcuts. Let's shred.",
      greeting: "Yo, you ready to rock?",
      subtext: "I'm Riff – your no-nonsense guitar mentor. Let's make you unstoppable.",
      cta: "Bring your axe and audio interface. Time to get serious.",
    },
    {
      main: "Upload your song and let's dissect it. I'll show you exactly what's happening under the hood. No fluff, just pure technique.",
      greeting: "Back for more?",
      subtext: "I'm Riff – straight talk, solid skills. You're in good hands.",
      cta: "Let's get down to business and master this track.",
    },
    {
      main: "Music doesn't care about excuses. Pick a song, any song, and let's prove you can nail it. I got your back.",
      greeting: "Alright, let's do this.",
      subtext: "I'm Riff – blunt, honest, and here to push you forward.",
      cta: "Plug in and show me what you've got!",
    },
    {
      main: "Every guitarist started where you are. The difference? They kept going. Let's make sure you're one of them.",
      greeting: "Hey, welcome back!",
      subtext: "I'm Riff – tough on you because I believe in your potential.",
      cta: "Upload a track and let's get to work.",
    },
    {
      main: "Technique, timing, tone – these are what separate the amateurs from the legends. Let's make sure you're the latter.",
      greeting: "Time to get better.",
      subtext: "I'm Riff – your straight-shooting guitar coach who won't let you settle.",
      cta: "Ready to level up? Let's go.",
    },
  ],
};

export function getCharacterDialogue(characterId) {
  const dialogues = CHARACTER_DIALOGUES[characterId] || CHARACTER_DIALOGUES.bob;
  const randomIndex = Math.floor(Math.random() * dialogues.length);
  return dialogues[randomIndex];
}
