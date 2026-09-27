import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'data', 'spectral-lines.json');
const output = path.join(root, 'book', 'generated', 'line-atlas.tex');

const texChars = {
  '\\': '\\textbackslash{}',
  '&': '\\&',
  '%': '\\%',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
};
const escapeTex = (value = '') => String(value).replace(/[\\&%#_{}~^]/g, (character) => texChars[character]);

const join = (value) => Array.isArray(value) ? value.join('; ') : (value ?? '');
const dataset = JSON.parse(await readFile(input, 'utf8'));
const records = Array.isArray(dataset) ? dataset : (dataset.entries ?? []);

const restCoordinate = (line) => {
  if (line.restDisplay ?? line.wavelengthDisplay) return line.restDisplay ?? line.wavelengthDisplay;
  if (line.rest_value?.value != null) return `${line.rest_value.value} ${line.rest_value.unit ?? ''}`.trim();
  if (line.canonical_wavelength_angstrom != null) return `${line.canonical_wavelength_angstrom} A (vacuum)`;
  return '';
};

const generatedSummary = (line) => {
  const name = line.display_name ?? line.displayName ?? line.name;
  const environment = join(line.environments) || 'astrophysical gas';
  const tracer = join(line.tracers) || 'the physical state and kinematics of the emitting or absorbing material';
  return `${name} is produced by ${line.mechanism ?? 'a spectral transition'} and is encountered in ${environment}. It is commonly used to trace ${tracer}.`;
};

const pages = records.map((line) => `
\\section{${escapeTex(line.display_name ?? line.displayName ?? line.name)}}
\\index{${escapeTex(line.species ?? line.display_name ?? line.displayName ?? line.name)}}

\\begin{conceptbox}[At a glance]
\\begin{tabularx}{\\textwidth}{@{}lX@{}}
\\textbf{Rest coordinate} & ${escapeTex(restCoordinate(line))} \\\\
\\textbf{Band} & ${escapeTex(line.band)} \\\\
\\textbf{Transition} & ${escapeTex(line.transition)} \\\\
\\textbf{Mechanism} & ${escapeTex(line.mechanism)} \\\\
\\textbf{Primary tracers} & ${escapeTex(join(line.tracers))} \\\\
\\textbf{Typical environments} & ${escapeTex(join(line.environments))} \\\\
\\textbf{Indicative regime} & ${escapeTex(line.temperature_regime ?? line.temperatureRegime ?? line.temperature)} \\\\
\\textbf{Density guidance} & ${escapeTex(line.density_sensitivity ?? line.densitySensitivity ?? 'Model dependent')} \\\\
\\end{tabularx}
\\end{conceptbox}

${escapeTex(line.summary ?? line.notes ?? generatedSummary(line))}

\\subsection*{How to use it}
${escapeTex(line.use ?? line.observationalUse ?? `Use this transition with its diagnostic companions to constrain ${join(line.tracers) || 'gas conditions'}, while fitting the continuum, line-spread function, and relevant blends.`)}

\\subsection*{Interpretive cautions}
${escapeTex(line.cautions ?? line.observational_notes ?? line.observationalNotes ?? 'Consult the cited atomic or molecular database and state the adopted wavelength convention.')}

\\subsection*{Useful companions}
${escapeTex(join(line.companions ?? line.paired_or_diagnostic_lines ?? line.pairedLines ?? line.diagnosticLines) || 'Interpret with adjacent ionization stages and a physically matched continuum or recombination diagnostic.')}

\\subsection*{Sources}
\\texttt{${escapeTex(join(line.citations ?? line.sources))}}

\\clearpage
`).join('\n');

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `% Generated from data/spectral-lines.json. Do not edit.\n${pages.trim() || '\\emph{The catalogue is being assembled for this edition.}'}\n`);
console.log(`Generated ${records.length} line-atlas entries.`);
