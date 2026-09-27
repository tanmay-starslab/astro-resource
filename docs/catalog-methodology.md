# Line Atlas catalogue notes

## Deliverable

- `line-atlas-catalog.json` contains **75 curated transitions** from the 21-cm radio line through molecular millimetre lines, IR fine-structure and H2 lines, optical/UV diagnostics, X-ray ions, and two gamma-ray lines.
- Every entry includes the requested identity, transition, rest value/unit, Angstrom convenience value where useful, band, mechanism, environments, tracers, temperature guidance, density guidance, ionization energy where applicable, diagnostic partners, observing caveats, and 1–3 citation keys.
- The JSON is UTF-8, contains unique IDs, and was parsed successfully with Python's standard JSON parser.

## Research and authority hierarchy

The catalogue uses laboratory/official databases for rest quantities and peer-reviewed reviews or graduate texts for astrophysical interpretation:

1. **NIST ASD v5.12 / SRD 78** for evaluated atomic wavelengths, levels, and ionization thresholds: <https://physics.nist.gov/asd>, DOI <https://doi.org/10.18434/T4W30F>.
2. **NIST X-Ray Transition Energies** for neutral Fe K fluorescence: <https://physics.nist.gov/PhysRefData/XrayTrans/Html/search.html>.
3. **CDMS**, **JPL**, and **Splatalogue** for molecular and radio rest frequencies: <https://cdms.astro.uni-koeln.de/cdms/portal/>, <https://spec.jpl.nasa.gov/>, and <https://splatalogue.online/>. CDMS is described by Endres et al. (2016), DOI <https://doi.org/10.1016/j.jms.2016.03.005>; the JPL catalog by Pickett et al. (1998), DOI <https://doi.org/10.1016/S0022-4073(98)00091-0>.
4. **NRAO** observing documentation for H I/OH radio conventions and operational catalog guidance: <https://science.nrao.edu/facilities/vla/docs/manuals/obsguide/modes/line>.
5. **AtomDB/APED** for the X-ray plasma lines and line-identification context: <https://www.atomdb.org/>.
6. **Morton (2003)** for UV resonance-line data, DOI <https://doi.org/10.1086/377639>.
7. **Carilli & Walter (2013)** for molecular/FIR cool-gas diagnostics, DOI <https://doi.org/10.1146/annurev-astro-082812-140953>.
8. **Shirley (2015)** for the distinction between critical and effective excitation density, DOI <https://doi.org/10.1086/680342>.
9. **Hollenbach & Tielens (1999)** for PDR interpretation, DOI <https://doi.org/10.1103/RevModPhys.71.173>.
10. **Tumlinson, Peeples & Werk (2017)** for CGM ions and multiphase caveats, DOI <https://doi.org/10.1146/annurev-astro-091916-055240>.
11. **Kewley et al. (2006)** for optical AGN/H II classification, DOI <https://doi.org/10.1111/j.1365-2966.2006.10859.x>.
12. **Kennicutt & Evans (2012)** for star-formation tracers, DOI <https://doi.org/10.1146/annurev-astro-081811-125610>.
13. **Osterbrock & Ferland, 2nd ed.** for nebular line physics: <https://mitpress.mit.edu/9781891389344/astrophysics-of-gaseous-nebulae-and-active-galactic-nuclei/>.
14. **Draine (2011)** for ISM/IGM physics: <https://press.princeton.edu/books/hardcover/9780691122144/physics-of-the-interstellar-and-intergalactic-medium>.
15. **ISO/MPE line lists** for IR wavelengths: <https://www.ipac.caltech.edu/iso/sws/idum/sws_hb.pdf>, <https://www.mpe.mpg.de/ir/ISO/linelists/FSlines.html>, and <https://www.mpe.mpg.de/ir/ISO/linelists/H2.html>.
16. **Samworth et al. (1972)** and **Diehl (2021)** for the 1808.65-keV 26Al line, DOIs <https://doi.org/10.1103/PhysRevC.5.138> and <https://doi.org/10.1007/s10509-021-04003-8>.

## Conventions that prevent common errors

- **All Angstrom wavelengths are vacuum values.** Familiar optical air names are recorded in `observational_notes`. For example H-alpha is stored as 6564.61 A (vacuum), not 6562.8 A (air); [O III] is 5008.24 A, not 5006.84 A.
- For radio/mm work, the laboratory **frequency is the authoritative rest quantity**. `canonical_wavelength_angstrom` is deliberately `null` for these entries because frequency is what observing systems and Doppler tracking use.
- A doublet/multiplet component has its own entry when it is diagnostically useful. Hyperfine complexes (N2H+, NH3) explicitly warn users to adopt component-specific catalog frequencies for precision velocities.
- `ionization_energy_eV.lower_stage_to_species` means the threshold to create the listed ion from the immediately lower charge state; `species_to_next_stage` means the threshold to remove one more electron. It is not the excitation energy of the listed line.
- Approximate critical densities identify the collider. They should not be silently compared across electron-, H-, and H2-excited lines.

## Data-quality caveat

This is a **curated graduate reference and UI seed dataset, not a substitute for an observing proposal's live catalog query or a plasma/photochemistry calculation**. Rest frequencies and wavelengths can change at the last quoted digits as laboratory fits are updated; molecular hyperfine component choices and atomic Ritz-versus-observed wavelengths can differ between databases. Before precision radial-velocity, abundance, or radiative-transfer work, query the current NIST/CDMS/JPL/Splatalogue/AtomDB release, preserve its uncertainty and catalog version, and use the exact component adopted by the instrument setup.

Likewise, no ion has a universal “formation temperature.” CIE peaks quoted here are orientation only; photoionization, non-equilibrium cooling, shocks, mixing, charge exchange, optical depth, and unresolved multiphase structure can move the inferred conditions substantially. Critical density is not the same as effective excitation density, and neither alone determines which gas a line “traces.”

## Suggested application behavior

- Show a visible **vacuum/air badge** beside optical values and offer an explicit conversion rather than silently changing values.
- Let users filter by band, environment, mechanism, ion stage, and tracer, but avoid presenting filters as exclusive physical classifications.
- Display doublet/ratio links bidirectionally, and distinguish fixed branching ratios from density, temperature, reddening, ionization, or saturation diagnostics.
- Put the caveat above near any “temperature of origin” visualization.
- Render source keys as links from the top-level `source_registry`; the per-entry arrays are designed for this.

## Automated sanity checks completed

- JSON parse: passed.
- Entry count: 75.
- Unique IDs: passed.
- Required field names: consistent across all entries.
- Citation-key integrity: every cited key exists in `source_registry`.
- Electromagnetic coverage: radio, microwave/mm/sub-mm, IR, optical, UV/EUV, soft/hard X-ray, and gamma ray.
