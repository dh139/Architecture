# AURELIA RESIDENCE — Architectural Masterpiece

> A luxury 3D architectural digital experience and private estate publication crafted with React, Vite, Tailwind CSS v4, and GSAP.

---

## Overview

**Aurelia Residence** is a private commission coastal architectural residence harmonized with the Mediterranean cliffside horizon. This web experience features a 60fps scroll-driven cinematic journey, an architectural exhibition, an interactive dossier drawer, and an inquiry system.

---

## Key Highlights

- **60fps Cinematic Scroll Journey**: Ultra-smooth scroll-driven video sequencing through four architectural perspectives (Approach, Glazing & Living, Travertine Master Suite, and Panoramic Cliffside Elevation).
- **Curated Spaces Exhibition**: A horizontal scroll sequence showcasing architectural stills with high-resolution lightbox inspection.
- **Architectural Dossier Drawer**: Comprehensive engineering, zoning, thermal insulation, and material specifications.
- **Blueprint HUD & Topographical Location**: Live solar orientation, geographical coordinates (LAT 43°42'N, LON 7°18'E), and regional transit radiuses.
- **Acquisition Inquiry System**: Confidential dossier request modal with ESC key accessibility and backdrop dismissal.
- **Full Mobile Responsiveness**: Precision typography scaling, touch target optimization, and safe viewport sizing (`100dvh`) across devices.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/) with `ScrollTrigger`
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dh139/Architecture.git
cd Architecture

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Directory Structure

```text
├── public/
│   ├── images/          # High-resolution architectural photography
│   └── videos/          # Cinematic estate MP4 sequence (Scenes 1-4)
├── src/
│   ├── components/      # Modular UI & architectural sections
│   │   ├── CinematicScrollJourney.jsx
│   │   ├── HorizontalGallery.jsx
│   │   ├── Philosophy.jsx
│   │   ├── ProjectStats.jsx
│   │   ├── Features.jsx
│   │   ├── Location.jsx
│   │   ├── DossierDrawer.jsx
│   │   ├── CTA.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── CustomCursor.jsx
│   ├── App.jsx          # Root composition
│   ├── main.jsx         # Application entry
│   └── index.css        # Tailwind v4 styles & luxury custom typography
├── package.json
└── vite.config.js
```

---

## License

Private Commission. All rights reserved &copy; 2026 Aurelia Residence.
