import { Song, StationStop, JourneyInfo } from '../types';

export const PLAYLIST: Song[] = [
  {
    id: 'song-1',
    title: 'Ab Tere Dil Mein To',
    artist: 'Kumar Sanu & Alka Yagnik',
    album: 'Aarzoo (Nostalgic Sleeper Edit)',
    duration: 342,
    genre: '90s Melodic Romance',
    coverColor: '#b45309',
    mood: 'Nostalgic Romance',
    lyricsSnippet: 'अब तेरे दिल में तो हम आ गए... खिड़की से आती हवा और वो पुरानी यादें।',
    audioKey: 'nostalgic_90s'
  },
  {
    id: 'song-2',
    title: 'Chai Aur Khidki (चाय और खिड़की)',
    artist: 'Train Wala Acoustic & Bansuri',
    album: 'Sleeper Class Diaries Vol. 1',
    duration: 258,
    genre: 'Indian Lo-Fi & Flute',
    coverColor: '#0369a1',
    mood: 'Peaceful Travel',
    lyricsSnippet: 'मिट्टी के कुल्हड़ में चाय की भाप, पटरियों का संगीत और गुज़रते खेत...',
    audioKey: 'bansuri_lofi'
  },
  {
    id: 'song-3',
    title: 'Pal Pal Dil Ke Paas',
    artist: 'Kishore Kumar (Acoustic Strings)',
    album: 'Black & White Golden Rails',
    duration: 310,
    genre: 'Retro Golden Classic',
    coverColor: '#4338ca',
    mood: 'Emotional Longing',
    lyricsSnippet: 'पल पल दिल के पास तुम रहती हो... जीवन मीठी प्यास, ये कहती हो...',
    audioKey: 'retro_classic'
  },
  {
    id: 'song-4',
    title: 'Yun Hi Chala Chal (यूँ ही चला चल)',
    artist: 'Udit Narayan & Hariharan (Train Mix)',
    album: 'Swades Railway Wanderlust',
    duration: 412,
    genre: 'Wanderlust Indie',
    coverColor: '#047857',
    mood: 'Carefree Journey',
    lyricsSnippet: 'यूँ ही चला चल राही, कितनी हसीं है ये दुनिया... फूल चुनते रहो राहों में।',
    audioKey: 'wanderlust_journey'
  },
  {
    id: 'song-5',
    title: 'Pehla Nasha (पहला नशा)',
    artist: 'Udit Narayan & Sadhana Sargam',
    album: 'Jo Jeeta Wohi Sikandar',
    duration: 288,
    genre: '90s Everlasting',
    coverColor: '#c2410c',
    mood: 'First Love Memories',
    lyricsSnippet: 'चाहे तुम कुछ ना कहो, मैंने सुन लिया... हवाओं में तैरता एक सुर।',
    audioKey: 'first_love_90s'
  },
  {
    id: 'song-6',
    title: 'Hothon Se Chhu Lo Tum',
    artist: 'Jagjit Singh (Ghazal Express)',
    album: 'Ghazals in Sleeper Coach',
    duration: 304,
    genre: 'Soulful Ghazal',
    coverColor: '#6b21a8',
    mood: 'Deep Reflection',
    lyricsSnippet: 'होंठों से छू लो तुम, मेरा गीत अमर कर दो... बन जाओ मीत मेरे, मेरी प्रीत अमर कर दो।',
    audioKey: 'ghazal_soul'
  },
  {
    id: 'song-7',
    title: 'Varanasi Mail Midnight Raga',
    artist: 'Pt. Hariprasad Chaurasia & Sitar Ensemble',
    album: 'Ganga Kinare Twilight',
    duration: 395,
    genre: 'Indian Classical Ambient',
    coverColor: '#1e3a8a',
    mood: 'Midnight Trance',
    lyricsSnippet: 'रात के दो बजे, अंधेरे में चमकती लाल सिग्नल बत्ती और बांसुरी की तान...',
    audioKey: 'midnight_raga'
  },
  {
    id: 'song-8',
    title: 'Monsoon Chai in Coach S-5',
    artist: 'Indian Railway Soundscapes & Lo-Fi',
    album: 'Rain on Tin Roofs',
    duration: 275,
    genre: 'Rain & Sarod Lo-Fi',
    coverColor: '#0f766e',
    mood: 'Monsoon Nostalgia',
    lyricsSnippet: 'खिड़की के कांच पर फिसलती बारिश की बूंदें और दूर बजती WAP-7 की सीटी।',
    audioKey: 'monsoon_ambient'
  }
];

export const STATIONS: StationStop[] = [
  {
    code: 'NDLS',
    name: 'New Delhi',
    nameHindi: 'नई दिल्ली',
    distanceKm: 0,
    scheduledArrival: '14:25',
    platform: 'PF-12',
    haltMins: 0,
    state: 'Delhi',
    specialty: 'Capital Junction'
  },
  {
    code: 'CNB',
    name: 'Kanpur Central',
    nameHindi: 'कानपुर सेंट्रल',
    distanceKm: 440,
    scheduledArrival: '19:40',
    platform: 'PF-04',
    haltMins: 10,
    state: 'Uttar Pradesh',
    specialty: 'Thaggu Ke Laddu & Special Chai'
  },
  {
    code: 'FTP',
    name: 'Fatehpur',
    nameHindi: 'फ़तेहपुर',
    distanceKm: 518,
    scheduledArrival: '20:45',
    platform: 'PF-02',
    haltMins: 5,
    state: 'Uttar Pradesh',
    specialty: 'Historic Awadh Crossing'
  },
  {
    code: 'PRYJ',
    name: 'Prayagraj Junction',
    nameHindi: 'प्रयागराज जंक्शन',
    distanceKm: 635,
    scheduledArrival: '22:15',
    platform: 'PF-06',
    haltMins: 15,
    state: 'Uttar Pradesh',
    specialty: 'Sangam Nagari & Hot Samosas'
  },
  {
    code: 'MZP',
    name: 'Mirzapur',
    nameHindi: 'मिर्ज़ापुर',
    distanceKm: 724,
    scheduledArrival: '23:35',
    platform: 'PF-01',
    haltMins: 5,
    state: 'Uttar Pradesh',
    specialty: 'Vindhyachal Foothills'
  },
  {
    code: 'BSB',
    name: 'Varanasi Junction',
    nameHindi: 'वाराणसी जंक्शन (बनारस)',
    distanceKm: 785,
    scheduledArrival: '01:10',
    platform: 'PF-09',
    haltMins: 20,
    state: 'Uttar Pradesh',
    specialty: 'Kashi Banarasi Paan & Ghats'
  }
];

export const INITIAL_JOURNEY: JourneyInfo = {
  trainNumber: '12560',
  trainName: 'Shiv Ganga / Kashi Express',
  trainNameHindi: 'शिव गंगा सुपरफास्ट एक्सप्रेस',
  origin: 'NDLS (New Delhi)',
  destination: 'BSB (Varanasi)',
  totalDistanceKm: 785,
  currentKm: 570,
  speedKmh: 88,
  currentStationIndex: 2, // Near Fatehpur - Prayagraj section
  coachNumber: 'S-5',
  seatNumber: 'SL 41 (Window)'
};

export const NOSTALGIC_POETRY = [
  {
    lines: [
      'ट्रेन की खिड़की, हाथ में मिट्टी के कुल्हड़ की गरम चाय,',
      'कानों में पुराना गीत और आँखों के सामने गुज़रता हुआ हिंदुस्तान...'
    ],
    poet: 'सफ़रनामा डायरी'
  },
  {
    lines: [
      'पटरियों की वो जानी-पहचानी धक-धक,',
      'जैसे बचपन के वो लंबे रास्ते आज भी कहीं ठहरे हुए हों।'
    ],
    poet: 'रेलवे नॉस्टैल्जिया'
  },
  {
    lines: [
      'शाम की वो सुनहरी धूप जब नीली सीट पर फिसलती है,',
      'तो हर भूला हुआ चेहरा मुस्कुरा कर याद आता है।'
    ],
    poet: 'खिड़की वाली सीट'
  },
  {
    lines: [
      'দূর কোনো স্টেশনে নাম না জানা আলো,',
      'चलती रेलगाड़ी और कानों में बजता एक अनमोल नग़मा।'
    ],
    poet: 'मुसाफ़िर की शाम'
  }
];
