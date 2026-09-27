'use client';

import { useMemo, useState } from 'react';
import rawLines from '@/data/spectral-lines.json';
import { instrumentWindows, learningPaths, phaseGuide, sourceLinks } from './content';

type AtlasLine = {
  id: string;
  displayName: string;
  species: string;
  transition: string;
  restDisplay: string;
  wavelengthAngstrom: number | null;
  band: string;
  mechanism: string;
  environments: string[];
  tracers: string[];
  temperatureRegime: string;
  densityGuidance?: string;
  ionizationEnergy?: string;
  summary: string;
  use: string;
  cautions: string;
  companions: string[];
  citations: string[];
};

const fallbackLines: AtlasLine[] = [
  {
    id: 'hi-lya', displayName: 'H I Ly-alpha', species: 'H I', transition: '2p-1s',
    restDisplay: '1215.67 A (vacuum)', wavelengthAngstrom: 1215.67, band: 'Ultraviolet',
    mechanism: 'Resonance transition', environments: ['IGM', 'CGM', 'star-forming galaxies'],
    tracers: ['neutral hydrogen', 'radiative transfer', 'cosmic web'], temperatureRegime: 'typically photoionized gas near 10^4 K',
    summary: 'The strongest neutral-hydrogen resonance line and the backbone of absorption studies of the intergalactic medium.',
    use: 'Map H I over cosmic time, identify high-redshift galaxies, and constrain gas kinematics and column density with higher Lyman lines.',
    cautions: 'Resonant scattering, damping wings, saturation, geocoronal emission, and continuum placement can dominate interpretation.',
    companions: ['Ly-beta', 'Lyman limit', 'metal ions'], citations: ['nist-asd', 'meiksin2009'],
  },
  {
    id: 'ovi-1032', displayName: 'O VI 1032', species: 'O VI', transition: 'resonance doublet',
    restDisplay: '1031.93 A (vacuum)', wavelengthAngstrom: 1031.93, band: 'Ultraviolet',
    mechanism: 'Resonance absorption / emission', environments: ['warm CGM', 'interfaces', 'IGM'],
    tracers: ['highly ionized oxygen', 'multiphase interfaces'], temperatureRegime: 'CIE fraction peaks near 3 x 10^5 K',
    summary: 'A major tracer of highly ionized gas, while not by itself proving a unique gas temperature or ionization mechanism.',
    use: 'Use the 1032/1038 doublet with H I and lower ions to test saturation, kinematics, and ionization models.',
    cautions: 'Photoionized, non-equilibrium, mixing-layer, and cooling-flow solutions may overlap; H2 and unrelated absorption can blend.',
    companions: ['O VI 1038', 'H I Ly-alpha', 'C IV', 'Ne VIII'], citations: ['nist-asd', 'tumlinson2017'],
  },
  {
    id: 'civ-1548', displayName: 'C IV 1548', species: 'C IV', transition: 'resonance doublet',
    restDisplay: '1548.20 A (vacuum)', wavelengthAngstrom: 1548.20, band: 'Ultraviolet',
    mechanism: 'Resonance absorption / emission', environments: ['CGM', 'IGM', 'stellar winds', 'AGN'],
    tracers: ['triply ionized carbon', 'ionized outflows'], temperatureRegime: 'warm ionized gas; model dependent',
    summary: 'A bright and widely observed ultraviolet doublet connecting stellar, nebular, halo, and quasar spectroscopy.',
    use: 'Combine doublet members and adjacent ion stages to constrain saturation, covering fraction, ionization, and velocity structure.',
    cautions: 'C IV is not a one-to-one temperature tracer and broad stellar-wind features can overlap narrow interstellar absorption.',
    companions: ['C IV 1551', 'Si IV', 'N V', 'C III'], citations: ['nist-asd', 'tumlinson2017'],
  },
  {
    id: 'mgii-2796', displayName: 'Mg II 2796', species: 'Mg II', transition: 'resonance doublet',
    restDisplay: '2796.35 A (vacuum)', wavelengthAngstrom: 2796.35, band: 'Ultraviolet',
    mechanism: 'Resonance absorption / emission', environments: ['cool CGM', 'ISM', 'galactic outflows'],
    tracers: ['low-ionization gas', 'cool halo material'], temperatureRegime: 'often photoionized gas near 10^4 K',
    summary: 'A strong low-ionization transition used to discover and map cool gas around galaxies over a broad redshift range.',
    use: 'Measure equivalent widths, covering fractions, and kinematics with the 2803 A component and Fe II transitions.',
    cautions: 'Strong components saturate easily; equivalent width can become a kinematic rather than a column-density measure.',
    companions: ['Mg II 2803', 'Mg I 2853', 'Fe II 2600'], citations: ['nist-asd', 'tumlinson2017'],
  },
  {
    id: 'oii-3727', displayName: '[O II] 3727', species: 'O II', transition: '3726+3729 forbidden doublet',
    restDisplay: '3726.03, 3728.82 A (air)', wavelengthAngstrom: 3727.42, band: 'Optical',
    mechanism: 'Collisionally excited forbidden doublet', environments: ['H II regions', 'star-forming galaxies'],
    tracers: ['low-ionization zone', 'electron density', 'star formation'], temperatureRegime: 'ionized gas near 10^4 K',
    summary: 'A density-sensitive optical doublet often blended at modest resolution and visible when H-alpha has shifted out of the optical.',
    use: 'Resolve the component ratio for density work or combine the summed flux with Balmer and [O III] lines for excitation diagnostics.',
    cautions: 'Star-formation calibrations depend on dust, metallicity, ionization parameter, and aperture; the conventional 3727 label is a blend.',
    companions: ['[O III] 5007', 'H-beta', '[Ne III] 3869'], citations: ['nist-asd', 'osterbrock2006'],
  },
  {
    id: 'hbeta', displayName: 'H-beta', species: 'H I', transition: 'n=4 to n=2',
    restDisplay: '4861.33 A (air)', wavelengthAngstrom: 4861.33, band: 'Optical',
    mechanism: 'Hydrogen recombination', environments: ['H II regions', 'AGN narrow-line regions'],
    tracers: ['ionizing photon rate', 'attenuation with H-alpha'], temperatureRegime: 'photoionized gas near 10^4 K',
    summary: 'The Balmer reference line for optical excitation, temperature, abundance, and attenuation work.',
    use: 'Normalize nearby collisionally excited lines and compare the Balmer decrement with a stated intrinsic ratio and attenuation curve.',
    cautions: 'Correct stellar absorption, flux calibration, differential refraction, and dust before interpreting a decrement.',
    companions: ['H-alpha', 'H-gamma', '[O III] 5007'], citations: ['nist-asd', 'osterbrock2006'],
  },
  {
    id: 'oiii-5007', displayName: '[O III] 5007', species: 'O III', transition: '1D2-3P2 forbidden',
    restDisplay: '5006.84 A (air)', wavelengthAngstrom: 5006.84, band: 'Optical',
    mechanism: 'Collisionally excited forbidden line', environments: ['H II regions', 'planetary nebulae', 'AGN'],
    tracers: ['high-excitation ionized gas', 'oxygen abundance diagnostics'], temperatureRegime: 'ionized gas near 10^4 K',
    summary: 'One of the brightest optical nebular lines and a central axis in excitation and abundance diagnostics.',
    use: 'Use with [O III] 4959, H-beta, [O II], and auroral [O III] 4363 when possible.',
    cautions: 'Its strength is non-monotonic with metallicity and responds strongly to temperature, ionization parameter, and spectral hardness.',
    companions: ['[O III] 4959', '[O III] 4363', 'H-beta', '[O II]'], citations: ['nist-asd', 'osterbrock2006'],
  },
  {
    id: 'halpha', displayName: 'H-alpha', species: 'H I', transition: 'n=3 to n=2',
    restDisplay: '6562.80 A (air)', wavelengthAngstrom: 6562.80, band: 'Optical',
    mechanism: 'Hydrogen recombination', environments: ['H II regions', 'diffuse ionized gas', 'AGN'],
    tracers: ['recent massive-star formation', 'warm ionized gas'], temperatureRegime: 'photoionized gas near 10^4 K',
    summary: 'The workhorse optical recombination line for mapping ionized gas and estimating recent star formation.',
    use: 'Correct for attenuation and stellar absorption, then combine with [N II], [S II], or [O I] for excitation classification.',
    cautions: 'AGN, shocks, diffuse ionized gas, dust, IMF choice, and star-formation history all affect an H-alpha star-formation rate.',
    companions: ['H-beta', '[N II] 6583', '[S II] 6716/6731'], citations: ['nist-asd', 'osterbrock2006'],
  },
  {
    id: 'cii-158', displayName: '[C II] 158 um', species: 'C II', transition: '2P3/2-2P1/2 fine structure',
    restDisplay: '157.74 um', wavelengthAngstrom: 1.5774e6, band: 'Far-infrared',
    mechanism: 'Fine-structure cooling line', environments: ['PDRs', 'neutral ISM', 'ionized gas'],
    tracers: ['gas cooling', 'star-forming ISM'], temperatureRegime: 'cool neutral and ionized phases',
    summary: 'A dominant coolant of many interstellar environments and a bright high-redshift galaxy line.',
    use: 'Interpret with [N II], [O I], FIR continuum, and CO to separate ionized, neutral, and molecular contributions.',
    cautions: 'Multiple phases contribute and the [C II]/FIR ratio can fall in compact, warm, or highly ionized systems.',
    companions: ['[O I] 63 um', '[N II] 122/205 um', 'CO'], citations: ['draine2011'],
  },
  {
    id: 'co10', displayName: 'CO(1-0)', species: 'CO', transition: 'J=1 to 0',
    restDisplay: '115.271 GHz', wavelengthAngstrom: 2.6008e7, band: 'Millimetre',
    mechanism: 'Rotational transition', environments: ['molecular clouds', 'galaxy disks'],
    tracers: ['cold molecular gas proxy', 'gas kinematics'], temperatureRegime: 'cold molecular gas',
    summary: 'The ground rotational transition of carbon monoxide and the traditional proxy for bulk molecular hydrogen.',
    use: 'Convert luminosity with an explicitly justified CO-to-H2 factor and compare multiple J transitions for excitation.',
    cautions: 'The conversion factor varies with metallicity, radiation field, dynamics, optical depth, and spatial scale.',
    companions: ['CO(2-1)', '13CO', '[C I]', 'dust continuum'], citations: ['splatalogue'],
  },
  {
    id: 'hi21', displayName: 'H I 21 cm', species: 'H I', transition: 'ground-state hyperfine',
    restDisplay: '1420.4058 MHz / 21.106 cm', wavelengthAngstrom: 2.1106e9, band: 'Radio',
    mechanism: 'Magnetic-dipole hyperfine transition', environments: ['neutral ISM', 'galaxy disks', 'cosmic large-scale structure'],
    tracers: ['neutral atomic hydrogen', 'rotation and dynamics'], temperatureRegime: 'cold and warm neutral gas',
    summary: 'The fundamental radio tracer of neutral atomic hydrogen in emission and absorption.',
    use: 'Combine emission brightness with absorption optical depth to constrain column, spin temperature, and phase structure.',
    cautions: 'Optically thin conversion can fail in cold opaque gas; emission alone does not uniquely determine spin temperature.',
    companions: ['Ly-alpha', '[C II]', 'OH'], citations: ['draine2011'],
  },
  {
    id: 'feka', displayName: 'Fe K-alpha', species: 'Fe I-XVII', transition: 'K-shell fluorescence complex',
    restDisplay: 'approximately 6.4 keV', wavelengthAngstrom: 1.937, band: 'X-ray',
    mechanism: 'Fluorescence / inner-shell transition', environments: ['AGN', 'X-ray binaries', 'reflection nebulae'],
    tracers: ['cold reflecting material', 'accretion geometry'], temperatureRegime: 'irradiated material near energetic sources',
    summary: 'An X-ray fluorescence feature whose profile and equivalent width probe reprocessing near compact objects.',
    use: 'Model the continuum, Compton reflection, ionized iron lines, instrumental response, and relativistic broadening together.',
    cautions: 'The observed complex may mix narrow, broad, ionized, absorbed, and Compton-scattered components.',
    companions: ['Fe XXV 6.7 keV', 'Fe XXVI 6.97 keV', 'Compton hump'], citations: ['osterbrock2006'],
  },
];

const arrayValue = (value: unknown): string[] => Array.isArray(value)
  ? value.map(String)
  : typeof value === 'string' && value.length > 0
    ? [value]
    : [];

const numberValue = (...values: unknown[]): number | null => {
  for (const value of values) {
    const parsed = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
};

function nativeToAngstrom(record: Record<string, unknown>): number | null {
  const rest = record.rest_value as Record<string, unknown> | undefined;
  const direct = numberValue(record.wavelengthAngstrom, record.canonical_wavelength_angstrom, record.canonicalAngstrom, record.wavelength_A, record.wavelength);
  const unit = String(rest?.unit ?? record.restUnit ?? record.unit ?? '').toLowerCase();
  const value = numberValue(rest?.value, record.restValue, record.value);
  if (direct && (!unit || unit.includes('ang') || unit === 'a')) return direct;
  if (!value) return direct;
  if (unit === 'nm') return value * 10;
  if (unit.includes('um') || unit.includes('micron') || unit.includes('µm')) return value * 1e4;
  if (unit === 'mm') return value * 1e7;
  if (unit === 'cm') return value * 1e8;
  if (unit === 'm') return value * 1e10;
  if (unit === 'ghz') return 2.99792458e9 / value;
  if (unit === 'mhz') return 2.99792458e12 / value;
  if (unit === 'kev') return 12.39842 / value;
  return direct;
}

function normalizeLine(record: Record<string, unknown>, index: number): AtlasLine {
  const displayName = String(record.display_name ?? record.displayName ?? record.name ?? record.label ?? `Line ${index + 1}`);
  const rest = record.rest_value as Record<string, unknown> | undefined;
  const restDisplay = record.restDisplay ?? record.wavelengthDisplay ?? record.restCoordinate
    ?? (rest?.value != null ? `${rest.value} ${String(rest.unit ?? '')}`.trim() : '');
  const environments = arrayValue(record.environments ?? record.environment);
  const tracers = arrayValue(record.tracers ?? record.tracer);
  const mechanism = String(record.mechanism ?? record.process ?? 'Spectral transition');
  const ionization = record.ionization_energy_eV as Record<string, unknown> | undefined;
  const lowerThreshold = numberValue(ionization?.lower_stage_to_species);
  const nextThreshold = numberValue(ionization?.species_to_next_stage);
  const ionizationEnergy = [
    lowerThreshold ? `${lowerThreshold} eV to create this stage` : '',
    nextThreshold ? `${nextThreshold} eV to ionize further` : '',
  ].filter(Boolean).join('; ');
  return {
    id: String(record.id ?? displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
    displayName,
    species: String(record.species ?? displayName.split(' ')[0]),
    transition: String(record.transition ?? record.quantumTransition ?? 'See source data'),
    restDisplay: String(restDisplay),
    wavelengthAngstrom: nativeToAngstrom(record),
    band: String(record.band ?? record.regime ?? 'Other'),
    mechanism,
    environments,
    tracers,
    temperatureRegime: String(record.temperature_regime ?? record.temperatureRegime ?? record.temperature ?? 'Environment dependent'),
    densityGuidance: String(record.density_sensitivity ?? record.densitySensitivity ?? ''),
    ionizationEnergy,
    summary: String(record.summary ?? record.notes ?? record.description ?? `${displayName} is produced by ${mechanism.toLowerCase()} and is encountered in ${environments.slice(0, 3).join(', ') || 'astrophysical gas'}.`),
    use: String(record.use ?? record.observationalUse ?? record.primaryUse ?? (tracers.length ? `Trace ${tracers.join(', ')}.` : 'Constrain gas conditions with a physically matched line set.')),
    cautions: String(record.cautions ?? record.observational_notes ?? record.observationalNotes ?? record.caveats ?? ''),
    companions: arrayValue(record.companions ?? record.paired_or_diagnostic_lines ?? record.pairedLines ?? record.diagnosticLines),
    citations: arrayValue(record.citations ?? record.sources),
  };
}

type ImportedDataset = {
  entries?: Array<Record<string, unknown>>;
  source_registry?: Record<string, { title?: string; url?: string; doi?: string }>;
};

const importedDataset = rawLines as unknown as ImportedDataset | Array<Record<string, unknown>>;
const importedRecords = Array.isArray(importedDataset) ? importedDataset : (importedDataset.entries ?? []);
const importedLines = importedRecords.map(normalizeLine);
const sourceRegistry = Array.isArray(importedDataset) ? {} : (importedDataset.source_registry ?? {});

function formatWavelength(angstrom: number) {
  if (angstrom < 100) return `${angstrom.toFixed(2)} A`;
  if (angstrom < 1e4) return `${angstrom.toLocaleString(undefined, { maximumFractionDigits: 2 })} A`;
  if (angstrom < 1e7) return `${(angstrom / 1e4).toLocaleString(undefined, { maximumFractionDigits: 3 })} um`;
  if (angstrom < 1e10) return `${(angstrom / 1e7).toLocaleString(undefined, { maximumFractionDigits: 3 })} mm`;
  return `${(angstrom / 1e10).toLocaleString(undefined, { maximumFractionDigits: 3 })} m`;
}

function bandClass(band: string) {
  const value = band.toLowerCase();
  if (value.includes('x-ray') || value.includes('gamma')) return 'band-xray';
  if (value.includes('ultraviolet') || value === 'uv') return 'band-uv';
  if (value.includes('optical')) return 'band-optical';
  if (value.includes('infrared')) return 'band-ir';
  if (value.includes('mill') || value.includes('radio')) return 'band-radio';
  return 'band-other';
}

function bptClass(x: number, y: number) {
  const kauffmann = 0.61 / (x - 0.05) + 1.3;
  const kewley = 0.61 / (x - 0.47) + 1.19;
  if (x < 0.05 && y < kauffmann) return 'Star-forming sequence';
  if (x < 0.47 && y < kewley) return 'Composite / transition region';
  return 'AGN-like excitation';
}

function bptPath(kind: 'kauffmann' | 'kewley') {
  const points: string[] = [];
  const start = -1.75;
  const end = kind === 'kauffmann' ? -0.08 : 0.3;
  for (let index = 0; index <= 80; index += 1) {
    const x = start + ((end - start) * index) / 80;
    const y = kind === 'kauffmann' ? 0.61 / (x - 0.05) + 1.3 : 0.61 / (x - 0.47) + 1.19;
    const px = 66 + ((x + 1.8) / 2.4) * 500;
    const py = 350 - ((Math.max(-1.5, Math.min(1.5, y)) + 1.5) / 3) * 280;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return `M${points.join(' L')}`;
}

export default function Home() {
  const lines = importedLines.length > 0 ? importedLines : fallbackLines;
  const [selectedId, setSelectedId] = useState(lines[0].id);
  const [query, setQuery] = useState('');
  const [band, setBand] = useState('All bands');
  const [redshift, setRedshift] = useState(2.0);
  const [phaseId, setPhaseId] = useState('warm-cgm');
  const [bptX, setBptX] = useState(-0.65);
  const [bptY, setBptY] = useState(0.2);

  const selectedLine = lines.find((line) => line.id === selectedId) ?? lines[0];
  const bands = useMemo(() => ['All bands', ...Array.from(new Set(lines.map((line) => line.band))).sort()], [lines]);
  const filteredLines = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lines.filter((line) => {
      const matchesBand = band === 'All bands' || line.band === band;
      const haystack = [line.displayName, line.species, line.transition, line.band, ...line.environments, ...line.tracers].join(' ').toLowerCase();
      return matchesBand && (!needle || haystack.includes(needle));
    });
  }, [band, lines, query]);

  const plottable = lines.filter((line) => line.wavelengthAngstrom);
  const plotMin = Math.min(...plottable.map((line) => line.wavelengthAngstrom as number));
  const plotMax = Math.max(...plottable.map((line) => line.wavelengthAngstrom as number));
  const logMin = Math.log10(plotMin);
  const logSpan = Math.max(1, Math.log10(plotMax) - logMin);
  const observed = selectedLine.wavelengthAngstrom ? selectedLine.wavelengthAngstrom * (1 + redshift) : null;
  const coverage = observed
    ? instrumentWindows.filter((instrument) => observed >= instrument.minAngstrom && observed <= instrument.maxAngstrom)
    : [];
  const selectedPhase = phaseGuide.find((phase) => phase.id === phaseId) ?? phaseGuide[0];
  const bptState = bptClass(bptX, bptY);
  const bptPointX = 66 + ((bptX + 1.8) / 2.4) * 500;
  const bptPointY = 350 - ((bptY + 1.5) / 3) * 280;

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Line Atlas home">
          <span className="wordmark-line" aria-hidden="true" />
          Line Atlas
        </a>
        <nav aria-label="Primary navigation">
          <a href="#atlas">Atlas</a>
          <a href="#planner">Redshift</a>
          <a href="#phases">Phases</a>
          <a href="#diagnostics">Diagnostics</a>
          <a href="#book">Book</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">A field guide to astrophysical spectroscopy</p>
          <h1>Read the universe,<br />one transition at a time.</h1>
          <p className="dek">
            A source-cited atlas connecting atomic physics, observable spectra,
            and the multiphase gas between stars, galaxies, and the cosmic web.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#atlas">Explore the line atlas</a>
            <a className="secondary-link" href="/line-atlas.pdf">Download the reference book</a>
          </div>
          <dl className="hero-facts">
            <div><dt>Catalogue</dt><dd>{lines.length} diagnostic transitions</dd></div>
            <div><dt>Reach</dt><dd>X-ray to metre-wave radio</dd></div>
            <div><dt>Method</dt><dd>One shared, cited dataset</dd></div>
          </dl>
        </div>

        <div className="spectral-plate" aria-label="A logarithmic spectrum of catalogue lines">
          <div className="plate-label"><span>rest frame</span><span>log wavelength</span></div>
          <div className="spectrum" aria-hidden="true">
            {plottable.slice(0, 48).map((line, index) => (
              <span
                className={`emission-line ${bandClass(line.band)}`}
                key={line.id}
                style={{
                  left: `${((Math.log10(line.wavelengthAngstrom as number) - logMin) / logSpan) * 100}%`,
                  height: `${24 + ((index * 29) % 72)}%`,
                }}
              />
            ))}
          </div>
          <div className="plate-axis" aria-hidden="true"><span>X-ray</span><span>UV</span><span>optical</span><span>IR</span><span>radio</span></div>
          <div className="plate-caption">
            <strong>One atlas, many phases</strong>
            <span>Every marker opens into physics, use, and caveats.</span>
          </div>
        </div>
      </section>

      <section className="atlas-section paper-section" id="atlas">
        <div className="section-intro">
          <p className="kicker">The catalogue</p>
          <h2>Find a line. Follow the physics.</h2>
          <p>Search by species, transition, environment, or tracer. Values are discovery aids; each entry carries interpretive limits and source keys.</p>
        </div>

        <div className="atlas-controls">
          <label>
            <span>Search the atlas</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try oxygen, CGM, density..." />
          </label>
          <label>
            <span>Spectral band</span>
            <select value={band} onChange={(event) => setBand(event.target.value)}>
              {bands.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <p className="result-count" aria-live="polite">{filteredLines.length} of {lines.length} entries</p>
        </div>

        <div className="spectral-ruler" aria-label="Selectable logarithmic wavelength ruler">
          <div className="ruler-track" />
          {plottable.slice(0, 80).map((line) => (
            <button
              type="button"
              className={`ruler-mark ${bandClass(line.band)} ${selectedLine.id === line.id ? 'is-selected' : ''}`}
              key={line.id}
              style={{ left: `${((Math.log10(line.wavelengthAngstrom as number) - logMin) / logSpan) * 100}%` }}
              onClick={() => setSelectedId(line.id)}
              aria-label={`Select ${line.displayName}, ${line.restDisplay}`}
            />
          ))}
          <div className="ruler-labels" aria-hidden="true"><span>1 A</span><span>1,000 A</span><span>1 um</span><span>1 mm</span><span>1 m</span></div>
        </div>

        <div className="atlas-workbench">
          <div className="line-index" role="list" aria-label="Filtered spectral lines">
            {filteredLines.map((line) => (
              <button
                type="button"
                className={selectedLine.id === line.id ? 'line-row is-selected' : 'line-row'}
                key={line.id}
                onClick={() => setSelectedId(line.id)}
                role="listitem"
              >
                <span className={`line-band-dot ${bandClass(line.band)}`} aria-hidden="true" />
                <span className="line-name">{line.displayName}</span>
                <span className="line-coordinate">{line.restDisplay || (line.wavelengthAngstrom ? formatWavelength(line.wavelengthAngstrom) : '')}</span>
              </button>
            ))}
            {filteredLines.length === 0 && <p className="empty-state">No line matches both filters. Try a broader term or all bands.</p>}
          </div>

          <article className="line-detail" aria-live="polite">
            <div className="detail-heading">
              <div>
                <p className="detail-species">{selectedLine.species} · {selectedLine.band}</p>
                <h3>{selectedLine.displayName}</h3>
              </div>
              <p className="detail-coordinate">{selectedLine.restDisplay || (selectedLine.wavelengthAngstrom ? formatWavelength(selectedLine.wavelengthAngstrom) : 'See cited source')}</p>
            </div>
            <p className="detail-summary">{selectedLine.summary}</p>
            <dl className="detail-grid">
              <div><dt>Transition</dt><dd>{selectedLine.transition}</dd></div>
              <div><dt>Mechanism</dt><dd>{selectedLine.mechanism}</dd></div>
              <div><dt>Physical regime</dt><dd>{selectedLine.temperatureRegime}</dd></div>
              <div><dt>Environments</dt><dd>{selectedLine.environments.join(', ') || 'Environment dependent'}</dd></div>
              <div><dt>Density guidance</dt><dd>{selectedLine.densityGuidance || 'Interpret through an excitation or ionization model.'}</dd></div>
              <div><dt>Ionization thresholds</dt><dd>{selectedLine.ionizationEnergy || 'Not applicable or not tabulated for this transition.'}</dd></div>
            </dl>
            <div className="detail-notes">
              <div><h4>Use it for</h4><p>{selectedLine.use || selectedLine.tracers.join(', ')}</p></div>
              <div><h4>Interpret carefully</h4><p>{selectedLine.cautions || 'Check convention, blending, optical depth, ionization model, and source data before precision use.'}</p></div>
            </div>
            <p className="companions"><strong>Read with:</strong> {selectedLine.companions.join(', ') || 'adjacent ionization stages and matched continuum diagnostics'}</p>
            <div className="citation-strip">
              <h4>Source trail</h4>
              <div>
                {selectedLine.citations.map((key) => {
                  const source = sourceRegistry[key];
                  return source?.url
                    ? <a href={source.url} target="_blank" rel="noreferrer" key={key}>{source.title || key}</a>
                    : <span key={key}>{key}</span>;
                })}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="planner-section" id="planner">
        <div className="section-intro light-on-dark">
          <p className="kicker">Redshift planner</p>
          <h2>Where does the line land?</h2>
          <p>Move the source through cosmic time and compare its observed wavelength with broad instrument windows.</p>
        </div>
        <div className="planner-grid">
          <div className="planner-controls">
            <label>
              <span>Transition</span>
              <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {lines.filter((line) => line.wavelengthAngstrom).map((line) => <option value={line.id} key={line.id}>{line.displayName}</option>)}
              </select>
            </label>
            <label>
              <span>Redshift <output>{redshift.toFixed(2)}</output></span>
              <input type="range" min="0" max="12" step="0.01" value={redshift} onChange={(event) => setRedshift(Number(event.target.value))} />
            </label>
            <div className="redshift-equation" aria-live="polite">
              <span>{selectedLine.restDisplay || 'rest coordinate'}</span>
              <strong>{observed ? formatWavelength(observed) : 'No wavelength coordinate'}</strong>
              <span>lambda observed = (1 + z) lambda rest</span>
            </div>
          </div>
          <div className="coverage-list">
            <h3>Approximate observing windows</h3>
            {instrumentWindows.map((instrument) => {
              const inRange = observed ? observed >= instrument.minAngstrom && observed <= instrument.maxAngstrom : false;
              return (
                <div className={inRange ? 'coverage-row is-active' : 'coverage-row'} key={instrument.short}>
                  <span className="coverage-state" aria-hidden="true" />
                  <div><strong>{instrument.short}</strong><span>{instrument.name}</span></div>
                  <p>{instrument.note}</p>
                </div>
              );
            })}
            <p className="coverage-summary" aria-live="polite">
              {coverage.length > 0
                ? `The coordinate falls inside ${coverage.map((item) => item.short).join(' and ')} broad coverage.`
                : 'This coordinate falls outside the broad windows shown. Check a dedicated radio, submillimetre, EUV, or X-ray facility.'}
            </p>
          </div>
        </div>
      </section>

      <section className="phase-section paper-section" id="phases">
        <div className="section-intro">
          <p className="kicker">Multiphase gas</p>
          <h2>A line is a probability map, not a thermometer.</h2>
          <p>Select a phase to see representative conditions and useful diagnostics. Boundaries overlap and move with pressure, radiation, metallicity, and history.</p>
        </div>
        <div className="phase-layout">
          <div className="phase-plot" role="group" aria-label="Temperature versus density phase map">
            <span className="axis-title axis-y">temperature increases</span>
            <span className="axis-title axis-x">density increases</span>
            <div className="phase-grid" aria-hidden="true" />
            {phaseGuide.map((phase) => (
              <button
                type="button"
                aria-label={phase.name}
                className={phase.id === selectedPhase.id ? 'phase-point is-selected' : 'phase-point'}
                style={{
                  left: `${((phase.logN + 6) / 12) * 100}%`,
                  bottom: `${((phase.logT - 1) / 6) * 100}%`,
                }}
                onClick={() => setPhaseId(phase.id)}
                key={phase.id}
              >
                <span aria-hidden="true" />
                {phase.name}
              </button>
            ))}
          </div>
          <article className="phase-detail" aria-live="polite">
            <p className="detail-species">Selected phase</p>
            <h3>{selectedPhase.name}</h3>
            <dl>
              <div><dt>Temperature</dt><dd>{selectedPhase.temperature}</dd></div>
              <div><dt>Hydrogen density</dt><dd>{selectedPhase.density}</dd></div>
              <div><dt>Common diagnostics</dt><dd>{selectedPhase.lines}</dd></div>
            </dl>
            <p>These guide ranges organize intuition. Real sightlines mix phases, while ion fractions depend on photoionization, collisions, non-equilibrium cooling, and unresolved structure.</p>
          </article>
        </div>
      </section>

      <section className="diagnostic-section" id="diagnostics">
        <div className="section-intro light-on-dark">
          <p className="kicker">Diagnostic lab</p>
          <h2>Build a point on the BPT plane.</h2>
          <p>Adjust two dust-resistant optical ratios and compare with commonly used theoretical and empirical demarcations.</p>
        </div>
        <div className="diagnostic-layout">
          <div className="bpt-plot">
            <svg viewBox="0 0 620 420" role="img" aria-labelledby="bpt-title bpt-desc">
              <title id="bpt-title">BPT diagnostic diagram</title>
              <desc id="bpt-desc">Logarithmic oxygen to H-beta ratio versus nitrogen to H-alpha ratio, with Kauffmann and Kewley dividing curves and the current adjustable point.</desc>
              <rect className="plot-frame" x="66" y="70" width="500" height="280" />
              {[-1.5, -1, -0.5, 0, 0.5].map((tick) => {
                const x = 66 + ((tick + 1.8) / 2.4) * 500;
                return <g key={`x-${tick}`}><line className="plot-gridline" x1={x} x2={x} y1="70" y2="350" /><text x={x} y="376" textAnchor="middle">{tick}</text></g>;
              })}
              {[-1, 0, 1].map((tick) => {
                const y = 350 - ((tick + 1.5) / 3) * 280;
                return <g key={`y-${tick}`}><line className="plot-gridline" x1="66" x2="566" y1={y} y2={y} /><text x="49" y={y + 4} textAnchor="end">{tick}</text></g>;
              })}
              <path className="curve curve-empirical" d={bptPath('kauffmann')} />
              <path className="curve curve-theory" d={bptPath('kewley')} />
              <text className="region-label" x="155" y="300">star forming</text>
              <text className="region-label" x="390" y="105">AGN-like</text>
              <circle className="bpt-point-halo" cx={bptPointX} cy={bptPointY} r="14" />
              <circle className="bpt-point" cx={bptPointX} cy={bptPointY} r="6" />
              <text className="axis-label" x="316" y="410" textAnchor="middle">log ([N II] 6583 / H-alpha)</text>
              <text className="axis-label" transform="translate(16 210) rotate(-90)" textAnchor="middle">log ([O III] 5007 / H-beta)</text>
            </svg>
            <div className="curve-legend"><span><i className="empirical-swatch" />Kauffmann et al. empirical curve</span><span><i className="theory-swatch" />Kewley et al. maximum-starburst curve</span></div>
          </div>
          <div className="diagnostic-controls">
            <label>
              <span>log ([N II] / H-alpha) <output>{bptX.toFixed(2)}</output></span>
              <input type="range" min="-1.75" max="0.55" step="0.01" value={bptX} onChange={(event) => setBptX(Number(event.target.value))} />
            </label>
            <label>
              <span>log ([O III] / H-beta) <output>{bptY.toFixed(2)}</output></span>
              <input type="range" min="-1.45" max="1.45" step="0.01" value={bptY} onChange={(event) => setBptY(Number(event.target.value))} />
            </label>
            <div className="classification" aria-live="polite"><span>Indicative classification</span><strong>{bptState}</strong></div>
            <p>The plane classifies dominant excitation, not the identity of every emitting parcel. Mixing, diffuse ionized gas, shocks, aperture, abundance, and measurement uncertainty can move a source.</p>
          </div>
        </div>
      </section>

      <section className="book-section paper-section" id="book">
        <div className="book-heading">
          <div>
            <p className="kicker">The companion reference</p>
            <h2>From quick lookup to graduate-level context.</h2>
          </div>
          <a className="book-download" href="/line-atlas.pdf"><span>PDF edition</span><strong>Download Line Atlas</strong></a>
        </div>
        <div className="learning-paths">
          {learningPaths.map((path) => (
            <article key={path.title}>
              <p>{path.chapters}</p>
              <h3>{path.title}</h3>
              <span>{path.copy}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="sources-section" id="sources">
        <div className="section-intro light-on-dark">
          <p className="kicker">Source trail</p>
          <h2>Trace every number upstream.</h2>
          <p>The atlas starts with critically evaluated databases, standard graduate texts, peer-reviewed literature, and current observatory documentation.</p>
        </div>
        <div className="source-list">
          {sourceLinks.map((source) => (
            <a href={source.href} target="_blank" rel="noreferrer" key={source.label}>
              <strong>{source.label}</strong><span>{source.detail}</span><em>Open source</em>
            </a>
          ))}
        </div>
        <p className="source-caveat">Line Atlas is an educational synthesis. For precision analysis, query the primary database, record its version and wavelength convention, and cite the original atomic, molecular, or calibration work.</p>
      </section>

      <footer>
        <div><strong>Line Atlas</strong><span>A field guide by Tanmay Singh</span></div>
        <div><a href="#top">Back to top</a><a href="https://github.com/tanmay-starslab/astro-resource">Repository</a></div>
      </footer>
    </main>
  );
}
