export type InstrumentWindow = {
  name: string;
  short: string;
  minAngstrom: number;
  maxAngstrom: number;
  note: string;
};

export const instrumentWindows: InstrumentWindow[] = [
  {
    name: 'HST Cosmic Origins Spectrograph',
    short: 'HST/COS',
    minAngstrom: 900,
    maxAngstrom: 3200,
    note: 'Approximate combined FUV/NUV reach; exact coverage depends on grating and central wavelength.',
  },
  {
    name: 'Ground-based optical spectrographs',
    short: 'Optical',
    minAngstrom: 3600,
    maxAngstrom: 10000,
    note: 'A representative atmospheric optical window; throughput, tellurics, and detector response vary.',
  },
  {
    name: 'JWST Near-Infrared Spectrograph',
    short: 'JWST/NIRSpec',
    minAngstrom: 6000,
    maxAngstrom: 53000,
    note: 'NIRSpec covers approximately 0.6-5.3 micrometres across its observing modes.',
  },
  {
    name: 'JWST Mid-Infrared Instrument MRS',
    short: 'JWST/MIRI',
    minAngstrom: 50000,
    maxAngstrom: 280000,
    note: 'Approximate 5-28 micrometre spectroscopic range.',
  },
  {
    name: 'ALMA receiver system',
    short: 'ALMA',
    minAngstrom: 3.2e6,
    maxAngstrom: 8.6e7,
    note: 'The full nominal 35-950 GHz receiver span; individual bands contain gaps and cycle-specific availability.',
  },
];

export const phaseGuide = [
  { id: 'molecular', name: 'Molecular clouds', logT: 1.25, logN: 3.2, temperature: '10-50 K', density: '10^2-10^6 cm^-3', lines: 'CO, HCN, HCO+, [C I], H2' },
  { id: 'cnm', name: 'Cold neutral medium', logT: 2.0, logN: 1.5, temperature: '50-200 K', density: '10-100 cm^-3', lines: 'H I 21 cm, [C II], Na I, [O I]' },
  { id: 'wnm', name: 'Warm neutral medium', logT: 3.85, logN: -0.35, temperature: '5,000-10,000 K', density: '0.2-1 cm^-3', lines: 'H I 21 cm, Ly-alpha absorption, low ions' },
  { id: 'wim', name: 'Warm ionized medium', logT: 4.0, logN: -1.0, temperature: '7,000-12,000 K', density: '0.01-0.1 cm^-3', lines: 'H-alpha, [N II], [S II], [O III]' },
  { id: 'warm-cgm', name: 'Warm CGM', logT: 5.25, logN: -3.6, temperature: '10^5-10^5.7 K', density: '10^-5-10^-3 cm^-3', lines: 'C IV, Si IV, O VI, Ne VIII' },
  { id: 'hot', name: 'Hot plasma / halo', logT: 6.45, logN: -3.1, temperature: '10^6-10^7 K', density: '10^-4-10^-2 cm^-3', lines: 'O VII, O VIII, Fe XVII, thermal X-ray' },
];

export const learningPaths = [
  {
    title: 'From levels to line profiles',
    copy: 'Einstein coefficients, selection rules, emissivity, opacity, broadening, curve of growth, and radiative transfer.',
    chapters: 'Chapters 1-3',
  },
  {
    title: 'The baryon cycle',
    copy: 'Ionized nebulae, neutral and molecular gas, feedback, the CGM, and the IGM as one connected ecosystem.',
    chapters: 'Chapters 4-8',
  },
  {
    title: 'Energetic environments',
    copy: 'AGN line regions, coronal and X-ray diagnostics, far-infrared cooling lines, and radio molecular ladders.',
    chapters: 'Chapters 9-10',
  },
  {
    title: 'Plan and interpret',
    copy: 'Redshift windows, spectral resolution, signal-to-noise, line fitting, ionization modelling, and reproducible inference.',
    chapters: 'Chapters 11-12',
  },
];

export const sourceLinks = [
  { label: 'NIST Atomic Spectra Database', href: 'https://physics.nist.gov/asd', detail: 'Critically evaluated atomic wavelengths, levels, and transition data.' },
  { label: 'CHIANTI', href: 'https://www.chiantidatabase.org/', detail: 'Atomic data and tools for spectroscopic diagnostics of astrophysical plasmas.' },
  { label: 'AtomDB', href: 'https://www.atomdb.org/', detail: 'Atomic data and emissivities for collisionally ionized X-ray plasmas.' },
  { label: 'CDMS', href: 'https://cdms.astro.uni-koeln.de/cdms/portal/', detail: 'Laboratory molecular rest frequencies and spectroscopic catalogues.' },
  { label: 'JPL Molecular Spectroscopy', href: 'https://spec.jpl.nasa.gov/', detail: 'Submillimetre, millimetre, and microwave molecular line catalogues.' },
  { label: 'Splatalogue', href: 'https://splatalogue.online/', detail: 'Transition-resolved molecular spectroscopy compiled from major catalogues.' },
  { label: 'Cloudy', href: 'https://www.ferland.org/cloudy/', detail: 'Forward modelling of photoionized, collisionally ionized, and molecular gas.' },
  { label: 'Draine reference text', href: 'https://www.astro.princeton.edu/~draine/book/', detail: 'Graduate treatment of interstellar and intergalactic matter and radiation.' },
  { label: 'NASA ADS', href: 'https://ui.adsabs.harvard.edu/', detail: 'Primary literature and review-article discovery.' },
];
