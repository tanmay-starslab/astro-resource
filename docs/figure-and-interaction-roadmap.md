# Original reproducible figure concepts

These concepts use equations, public tables, or documented synthetic data
rather than copying published figures. Each script should save its plotted
data, package versions, and random seed beside a vector graphic.

## 1. Tracer phase-space atlas

- Plot log temperature against log density. Compute illustrative ion-fraction
  contours with documented Cloudy photoionization and CIE grids, then overlay
  soft response ribbons for H I, Mg II, C IV, O VI, O VII, CO, [C II], and
  H I 21 cm rather than hard phase boxes.
- Save the full model inputs, code version, abundance table, radiation field,
  and grid. Label the product as illustrative, not a phase classifier.

## 2. Anatomy of an unresolved saturated doublet

- Generate a two-component Voigt doublet at several columns, convolve it with
  three LSFs, add identical seeded noise, and compare normalized flux,
  apparent optical depth, and recovered column. Include partial covering.
- Publish the atomic-data release and parameters. Interactive sliders can
  control column, Doppler parameter, covering fraction, resolution, and
  signal-to-noise.

## 3. From one sightline to a CGM mass

- Start with mock ionic columns around a halo. Progress through completeness,
  covering fraction, ionization correction, metallicity, radial interpolation,
  and azimuthal integration. A waterfall chart shows posterior broadening at
  each inference step.
- Publish mock truth and coordinates and fit two geometric models. Keep the
  measured ionic column visibly separate from inferred total mass.

## 4. Cosmic-web tomography cube

- Create a seeded density cube with filaments, transform it into Ly-alpha
  optical depth, sample parallel sightlines, and reconstruct with Wiener
  filtering. Compare truth, skewers, reconstruction, and residual.
- Publish the power spectrum, noise, kernel, and boundary treatment.
  Interactive controls can vary sightline spacing, spectral resolution,
  continuum error, and smoothing scale.

## 5. AGN radius--phase--timescale ladder

- Use a logarithmic radial axis from gravitational radii to the CGM, with
  bands for corona, disk, BLR, dust, NLR, molecular outflow, radio lobes, and
  halo. Align light-crossing and dynamical times, then place representative
  X-ray through radio diagnostics.
- Generate all positions from a CSV containing range, scaling relation, and
  citation. Distinguish measured ranges from schematic ones.

## 6. The geometry tax on outflow energetics

- For one mock line cube, calculate mass flow and kinetic power under
  thin-shell, filled-cone, and clumpy-bicone models. Small multiples show the
  dependence on density, radius, extinction, inclination, and velocity
  definition.
- Provide equations, priors, and the mock cube. Display measured luminosity
  separately from geometry-dependent products.

## 7. Multiwavelength excitation ladder

- Plot upper-level energy against representative critical density for far-IR,
  CO, dense-gas, optical, and X-ray transitions. Marker shape identifies the
  collider and opacity tendency; inset spectra show one mock galaxy in each
  band.
- Use versioned NIST, LAMDA, CHIANTI, or AtomDB tables and retain the queried
  subset. Show ranges because critical density depends on collider and
  temperature.

## 8. Redshift observability subway map

- Put redshift horizontally and observed wavelength or frequency vertically.
  Curves for Ly-alpha, C IV, [O II], H-beta, [O III], H-alpha, [C II],
  CO(1--0), and H I 21 cm cross shaded facility windows. Interrupt windows at
  atmospheric bands and detector gaps.
- Read rest coordinates and dated facility ranges from CSV. Date-stamp the
  capabilities and link each range to an official handbook. An interactive
  selector can show viable modes and line-confusion warnings.

## 9. Interferometric spatial-filtering laboratory

- Combine compact clouds and a diffuse disk, Fourier-sample them with compact
  and extended arrays, reconstruct, and compare recovered flux. Add a
  short-spacing plus total-power result.
- Publish the sky model, baselines, weighting, noise seed, mask, and stopping
  rule. Controls can vary array, taper, channel width, and source scale.
