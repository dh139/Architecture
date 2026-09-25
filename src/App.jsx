import React, { useState } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import CinematicScrollJourney from './components/CinematicScrollJourney';
import DossierDrawer from './components/DossierDrawer';
import HorizontalGallery from './components/HorizontalGallery';
import Philosophy from './components/Philosophy';
import ProjectStats from './components/ProjectStats';
import Features from './components/Features';
import Location from './components/Location';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierTab, setDossierTab] = useState('specs');

  const openDossierWithTab = (tab = 'specs') => {
    setDossierTab(tab);
    setDossierOpen(true);
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#171716] text-[#F3F0EA] overflow-x-hidden selection:bg-[#A38D70] selection:text-[#171716]">
      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Luxury Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Header Navigation */}
      <Navbar onOpenInquiry={scrollToContact} />

      {/* PRIMARY EXPERIENCE: 60FPS Cinematic Scroll-Driven Journey (from Reference.mp4) */}
      <CinematicScrollJourney
        onOpenInquiry={scrollToContact}
        onOpenDossier={() => openDossierWithTab('specs')}
      />

      {/* SLIDE-OUT DOSSIER DRAWER */}
      <DossierDrawer
        isOpen={dossierOpen}
        onClose={() => setDossierOpen(false)}
        initialTab={dossierTab}
        onOpenInquiry={scrollToContact}
      />

      {/* EXPANDED ARCHITECTURAL PUBLICATION (100% Dark Luxury Aesthetic) */}
      <div id="details" className="relative z-30 w-full bg-[#171716] text-[#F3F0EA]">
        {/* Curated Architectural Spaces - Horizontal Scroll Exhibition */}
        <HorizontalGallery />

        {/* Architectural Principles */}
        <Philosophy />

        {/* Project Dimensions & Statistics */}
        <ProjectStats />

        {/* Craft & Specifications Grid */}
        <Features />

        {/* Blueprint Topographical Location */}
        <Location />

        {/* Final CTA & Private Viewing Request */}
        <CTA />

        {/* Minimalist Architectural Footer */}
        <Footer />
      </div>
    </div>
  );
}
