import { User } from '@/lib/types';

const generateSvenGard = () => {
  const gard = ['Svärd', 'Värd', 'Lärd', "Närd", "Färd", "Härd", "Märd", "Pärd", "Tärd", "Ärd", "Örd", "Ård", "Ürd", "Ærd", "Ø"];
  const randomIndex = Math.floor(Math.random() * gard.length);
  return "Sven " + gard[randomIndex];
}

const customNames: { [key: string]: string | (() => string) } = {
  'albkj604': "Abbe K",
  // MAFFIAN
  'vicst918': "Victor auf Strömmen",
  'emial133': "Lord Kurtinator",
  'ellbe420': "BINGSTRÖM",
  'jossp703': "Jossan Maggan Spångan",
  'sofwa005': "Tayla Schwifty",
  'guskr150': "Ginkus 'KG' Kronholm",
  'oscfy612': "Borren 'Maskinen' Fyrk",
  'moyhj795': "Muuuuu Mjölkfrid",
  // Övrigt
  'svega741': generateSvenGard,
};

export function getCustomName(user: User): string {
  console.log(user);
  const customName = customNames[user.username];
  if (typeof customName === 'function') {
    return customName();
  }
  return customName || user.name;
}
