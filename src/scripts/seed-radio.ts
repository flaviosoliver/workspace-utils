import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import Radio from '../lib/models/Radio';

const radioItems = [
  {
    uri: 'http://www.youtube.com/watch?v=jfKfPfyJRdk',
    live: true,
    time: null,
    name: 'lofi hip hop radio 📚 beats to relax/study to',
    tags: [
      'lofi',
      'hip hop',
      'relaxante',
      'estudo',
      'concentração',
      'som ambiente',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=4xDzrJKXOOY',
    live: true,
    time: null,
    name: 'synthwave radio 🌌 beats to chill/game to',
    tags: ['synthwave', 'chill', 'game', 'relaxante', 'som ambiente'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=dsLGQzMq9BM',
    live: false,
    time: '02:02:54',
    name: 'Your DNA is Programmed to Love This | 2 Hours Ancient Reggae Jazz Blues Encoded in Your Cells',
    tags: ['reggae', 'jazz', 'blues', 'musical', 'relaxante'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=Lcdi9O2XB4E',
    live: true,
    time: null,
    name: 'tokyo night drive - lofi hiphop + chill + beats to sleep/relax/study to ✨',
    tags: [
      'lofi hiphop',
      'chill',
      'relaxante',
      'estudo',
      'dormir',
      'som ambiente',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=WsDyRAPFBC8',
    live: true,
    time: null,
    name: 'Deep & Melodic House 24/7: Relaxing Music • Chill Study Music',
    tags: ['house', 'melodic', 'relaxing', 'chill', 'study', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=3hzeWfSXJzk',
    live: false,
    time: '03:01:41',
    name: '🌴 Tropical Dub Reggae from the Roots | Dubwise Vibes with Rasta Queen',
    tags: ['reggae', 'dub', 'tropical', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=7PeHQXltb4E',
    live: false,
    time: '02:03:07',
    name: 'African Ancestral Awakening | 432Hz Connect to the Ancestors & Inner Power - Female Zulu Vocals',
    tags: ['meditação', 'cura', 'ancestral', 'zulu', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=lh4JdZTJe7k',
    live: false,
    time: '11:58:09',
    name: '12 Hours of Relaxing Sleep Music for Stress Relief, Sleeping & Meditation (Flying)',
    tags: ['relaxante', 'dormir', 'meditação', 'estresse', 'som ambiente'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=iEh6PyUTf1I',
    live: false,
    time: '11:55:01',
    name: 'Tranquil Spirit Sounds – Music for Deep Meditation, Mindfulness & Soul Balance',
    tags: ['meditação', 'mindfulness', 'relaxante', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=d8mZggkNYEk',
    live: false,
    time: '03:00:01',
    name: 'Upbeat Lofi - Energize Your Workflow & Power Up Your Day With R&B/Neo Soul',
    tags: ['lofi', 'r&b', 'neo soul', 'estudo', 'trabalho', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=H9hgzEZbLHs',
    live: false,
    time: '02:07:13',
    name: '2 Hours of Healing Reggae Blues Instrumental Music',
    tags: ['reggae', 'blues', 'instrumental', 'musical', 'cura'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=5-EbIpbngRI',
    live: false,
    time: '02:10:38',
    name: 'Jazz & Soul R&B – Smooth Instrumental Grooves for Relaxing & Chilling 🎷',
    tags: ['jazz', 'soul', 'r&b', 'instrumental', 'relaxante', 'chill'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=HKyw3YcGA20',
    live: false,
    time: '03:15:53',
    name: 'Jazz & Soul R&B – Relaxing Instrumental with Deep Soul Vibes🎷✨',
    tags: ['jazz', 'soul', 'r&b', 'instrumental', 'relaxante'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=-PU9GA9VLTw',
    live: false,
    time: '01:00:01',
    name: 'Coffee Shop Music - Relax Jazz Cafe Guitar (Instrumental Background)',
    tags: ['jazz', 'relax', 'instrumental', 'som ambiente', 'cafeteria'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=GmqOc3CJEZo',
    live: false,
    time: '09:31:28',
    name: 'SMOOTH JAZZ & SOUL | Pure Jazz Sanctuary 🛜 Live Stream',
    tags: ['jazz', 'soul', 'smooth jazz', 'live', 'relaxante'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=_jyU7CGnqC4',
    live: true,
    time: null,
    name: '🔥 R&B, Soul & Jazz Soul 2025 🎶 ✨ Song Playlist | Soulful Melodies | Laid-back Rhythmic Vibes ✨',
    tags: ['r&b', 'soul', 'jazz', 'playlist', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=6h-sEV6uNxo',
    live: false,
    time: '03:50:51',
    name: 'Tropical Chillout Grooves 🌊 Let the Waves & Lounge Music Soothe Your Soul',
    tags: ['chillout', 'tropical', 'lounge', 'relaxante', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=9UMxZofMNbA',
    live: true,
    time: null,
    name: 'Chillout Lounge - Calm & Relaxing Background Music | Study, Work, Sleep, Meditation, Chill',
    tags: [
      'chillout',
      'lounge',
      'relaxante',
      'estudo',
      'trabalho',
      'dormir',
      'meditação',
      'som ambiente',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=cRHWl5tVQ44',
    live: false,
    time: '00:08:08',
    name: 'Combinação Perfeita: SOM de CHUVA e ONDAS do MAR com TROVOADAS Distantes, DORMIR, RELAXAR e MEDITAR',
    tags: [
      'som ambiente',
      'chuva',
      'ondas do mar',
      'trovoada',
      'dormir',
      'relaxar',
      'meditar',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=jZ6gICf_iMg',
    live: false,
    time: '02:03:01',
    name: 'DAO | Japanese Zen Meditation Music for Flow, Clarity & Spiritual Balance (道)',
    tags: ['zen', 'meditação', 'japonês', 'espiritual', 'relaxante', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=o-WhM-0dWeE',
    live: false,
    time: '02:01:37',
    name: 'BUDŌ – Japanese Zen Music for Discipline, Meditation & Inner Strength (武道)',
    tags: ['zen', 'meditação', 'japonês', 'musical', 'concentração'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=EMVHEjyjUTo',
    live: false,
    time: '01:01:05',
    name: 'Andean Healing Spirits: Divine Pan Flute Music for Body, Spirit & Soul - 4K',
    tags: ['flauta pan', 'andina', 'cura', 'meditação', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=tDNdF7_xB6Y',
    live: false,
    time: '03:09:31',
    name: 'African Lofi - Groovy Vibe Boost for Study And Work [Afrobeats Lofi]',
    tags: ['lofi', 'afrobeat', 'estudo', 'trabalho', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=NQI4GdtHdGM',
    live: false,
    time: '03:14:31',
    name: 'African Lofi - Groovy Vibe Boost For Study and Work [Afrobeats Energy Grooves]',
    tags: ['lofi', 'afrobeat', 'estudo', 'trabalho', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=qVhhWUrXeAI',
    live: false,
    time: '06:08:40',
    name: 'Neo Tropical Sax Bliss Afrobeat & R&B Fusion with Hypnotic Summer Vibes',
    tags: ['afrobeat', 'r&b', 'saxofone', 'tropical', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=zhLzB-RTSXo',
    live: false,
    time: '03:52:52',
    name: 'ZULU: Calming African Melodies | African Vocal Music for Serenity, Peace & Relaxation',
    tags: ['africana', 'zulu', 'relaxante', 'musical', 'paz'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=guDxATC5rpI',
    live: false,
    time: '01:00:01',
    name: 'Ruído Azul',
    tags: ['ruído', 'azul', 'som ambiente', 'relaxante'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=2y6zdAbN9o8',
    live: false,
    time: '03:00:29',
    name: 'White Noise 3 Hour Long',
    tags: ['ruído branco', 'som ambiente', 'dormir', 'relaxar'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=lm1yz4oGpI8',
    live: false,
    time: '01:00:01',
    name: 'Green Noise For A Quiet Mind (1 Hour)',
    tags: ['ruído verde', 'som ambiente', 'relaxar', 'mente tranquila'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=5ETAtgAXsu8',
    live: false,
    time: '11:53:09',
    name: '10 Horas Ruido Marrón Pantalla Negra Relajarte, Concentración, Meditar, Dormir, Tinnitus, Insomnio',
    tags: [
      'ruído marrom',
      'relaxante',
      'concentração',
      'meditar',
      'dormir',
      'tinnitus',
      'insonia',
      'som ambiente',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=uqv-w2Jbldc',
    live: false,
    time: '01:15:42',
    name: 'PINOY REGGAE RISING: TROPICAL BEATS & ISLAND LOVE 🍒 SUNSET REGGAE MIX 🌽 PINOY ISLAND CHILL PLAYLIST🌳',
    tags: ['reggae', 'tropical', 'chill', 'playlist', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=jga06nkBu5U',
    live: false,
    time: '02:24:17',
    name: 'Deep Reggae Pop Mix 🌴 Chillout Vibes All Day | Grooves of Hawaii',
    tags: ['reggae', 'pop', 'chillout', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=j-2r6eZNCUU',
    live: false,
    time: '03:02:04',
    name: 'Música relaxante com o som da natureza fonte de água de bambú',
    tags: [
      'relaxante',
      'natureza',
      'água',
      'bambu',
      'som ambiente',
      'meditação',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=jyRyAxFTJGo',
    live: false,
    time: '00:34:05',
    name: 'Barulho De Chuva No Rio Para Dormir E Relaxar',
    tags: ['chuva', 'rio', 'dormir', 'relaxar', 'som ambiente'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=710Dg1jiTuY',
    live: false,
    time: '04:22:22',
    name: 'Música Relaxante Zen - Flauta, Sinos Tibetanos e Sons da Natureza - Meditar e Dormir',
    tags: [
      'relaxante',
      'zen',
      'flauta',
      'sinos tibetanos',
      'natureza',
      'meditar',
      'dormir',
      'som ambiente',
    ],
  },
  {
    uri: 'http://www.youtube.com/watch?v=HOaT_uDLYg4',
    live: false,
    time: '01:14:11',
    name: 'Tibetan Singing Bowls Breathe',
    tags: ['taças tibetanas', 'relaxante', 'meditação', 'som ambiente'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=shg3ddGz9ow',
    live: false,
    time: '00:08:25',
    name: 'Singing Bowls Just for Sleep',
    tags: ['taças tibetanas', 'dormir', 'relaxante', 'som ambiente'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=Y4SW4u_KSo0',
    live: false,
    time: '02:01:36',
    name: 'Deep Progressive House Set (Dj Continuous Mix)',
    tags: ['deep house', 'progressivo', 'mix', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=ZCbMzDclnEM',
    live: false,
    time: '04:12:19',
    name: 'DEEP HOUSE MIX 2025',
    tags: ['deep house', 'mix', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=x3ZTzmD_KTo',
    live: false,
    time: '04:11:12',
    name: 'Groove Black Cats Jazz Night - On the Road Again -',
    tags: ['jazz', 'groove', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=kdxbUq7LDcE',
    live: false,
    time: '01:00:01',
    name: '432hz: The Deepest Healing - Let Go of All Negative Energy',
    tags: ['cura', '432hz', 'relaxante', 'meditação', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=dhFpPmXf0Dw',
    live: false,
    time: '01:12:03',
    name: '528 Hz Dna Repair Frequency ❯ Cell Regeneration Sound Therapy ❯ Activate Your Healing Power',
    tags: ['cura', '528hz', 'terapia de som', 'relaxante', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=3DwyPk73f4Y',
    live: false,
    time: '01:33:27',
    name: 'SURF MUSIC - INDIE 1 - BRAZIL 4K',
    tags: ['surf music', 'indie', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=JU55lu0t6rU',
    live: false,
    time: '08:19:36',
    name: 'Alternative Rock Of The 90s 2000s - Linkin park, Creed, AudioSlave, Hinder, Evanescence, Nickelback',
    tags: ['rock alternativo', 'anos 90', 'anos 2000', 'musical'],
  },
  {
    uri: 'http://www.youtube.com/watch?v=WbM0EeNehxQ',
    live: false,
    time: '00:57:00',
    name: 'Aggressive Hip Hop Motivation Music #1 (Instrumental Mix)',
    tags: ['hip hop', 'motivação', 'instrumental', 'mix', 'musical'],
  },
];

const MONGODB_URI = process.env.MONGODB_URI;

async function seedRadioCollection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Radio.deleteMany({});
    console.log('Collection radio limpa');

    const result = await Radio.insertMany(radioItems);
    console.log(`${result.length} itens de rádio adicionados com sucesso!`);
  } catch (error) {
    console.error('Erro ao popular a collection radio:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedRadioCollection();
