// Spanish for the interface text. Keys are the exact English strings used in the components.
export const ES_UI = {
  // Deck / nav
  'Woodstone After Dark': 'Woodstone al anochecer',
  Woodstone: 'Woodstone',
  'Before you go in': 'Antes de entrar',
  'The grounds': 'Los jardines',
  Season: 'Temporada',
  'timeline': 'cronología',
  Slides: 'Diapositivas',
  'Back to the first slide': 'Volver a la primera diapositiva',
  'Back to the roof': 'Volver al tejado',
  'Previous slide': 'Diapositiva anterior',
  'Next slide': 'Diapositiva siguiente',
  'Up (Shift+Space)': 'Arriba (Mayús+Espacio)',
  'Down (Space)': 'Abajo (Espacio)',
  'Previous episode': 'Episodio anterior',
  'Next episode': 'Episodio siguiente',
  'Jump to episode': 'Saltar a un episodio',
  'A ~ means the death year is an estimate.': 'Una ~ indica que el año de muerte es una estimación.',
  'Switch language to Spanish': 'Cambiar el idioma a español',
  'Switch language to English': 'Cambiar el idioma a inglés',

  // Floors
  'The roof': 'El tejado',
  'The attic': 'El desván',
  'The upstairs bedrooms': 'Los dormitorios de arriba',
  'The library': 'La biblioteca',
  'The living room': 'El salón',
  'The kitchen': 'La cocina',
  'The basement': 'El sótano',

  // Intro slide
  'What changed in the house': 'Qué cambió en la casa',
  'Years a ghost, as of tonight': 'Años como fantasma, hasta esta noche',
  'Same ghosts as last week. Nobody new, nobody gone.': 'Los mismos fantasmas que la semana pasada. Nadie nuevo, nadie menos.',
  'Each line is a century. Where they bunch up, the years are squeezed.':
    'Cada línea es un siglo. Donde se juntan, los años están comprimidos.',
  Arrives: 'Llega',
  Back: 'Vuelve',
  Leaves: 'Se va',
  'Sucked off': 'Cruza al más allá',
  'We learn': 'Descubrimos',
  Asleep: 'Dormida',
  Close: 'Cerrar',
  'Intro screen': 'Pantalla de la intro',
  'The house and its ghosts, as of this episode': 'La casa y sus fantasmas, hasta este episodio',
  'Drawing of Woodstone Mansion with its ghosts': 'Dibujo de la mansión Woodstone con sus fantasmas',

  // Ghost card
  'The show hasn’t said when they died.': 'La serie no ha dicho cuándo murieron.',
  year: 'año',
  years: 'años',
  'a ghost': 'como fantasma',

  // Timeline
  'Crossed over': 'Cruzó al más allá',
  'Away from the house': 'Lejos de la casa',
  'years, squeezed': 'años, comprimidos',
} as const;

export type UiKey = keyof typeof ES_UI;
