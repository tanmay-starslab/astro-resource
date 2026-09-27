# Line Atlas

**Line Atlas** is a graduate-level field guide to astrophysical spectroscopy by
Tanmay Singh. It pairs a typeset reference book with an interactive web atlas,
both generated from a shared, source-cited catalogue of important transitions.

## What is included

- A modular LaTeX book covering line formation, radiative transfer, practical
  measurement, the ISM, CGM, IGM, star formation, AGN, and multiwavelength
  diagnostics.
- A searchable, filterable line catalogue spanning radio through X-ray bands.
- Interactive redshift, wavelength-window, gas-phase, and diagnostic tools.
- Original reproducible diagrams built from data and equations rather than
  copied figures.
- A bibliography that favors critically evaluated databases, standard texts,
  review articles, and primary literature.
- Transparent catalogue methodology and an original figure/interaction roadmap
  in the `docs/` directory.

## Local development

```bash
npm install
npm run generate
npm run dev
```

Build the website with `npm run build`. Build the book from the `book/`
directory with `npm run book`; the PDF is written to
`output/pdf/line-atlas.pdf` and copied into the website for download.

## Scientific scope and caveats

Rest wavelengths are labelled as vacuum or air where that distinction matters.
Temperature ranges are guide values rather than unique formation temperatures:
line strength also depends on density, abundance, ionization mechanism,
radiation field, optical depth, and non-equilibrium history. Always consult the
underlying cited database or paper before using a value for precision work.

## Authorship

Tanmay Singh. Contributions, corrections, and data-quality reports are welcome
through the repository issue tracker.

No reuse license has been selected yet. All rights are reserved unless and
until the author adds an explicit license.
