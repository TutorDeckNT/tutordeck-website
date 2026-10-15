import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { chapterLocations } from '../../data/chapterLocations';

export default function ChapterMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap>();
  const markers = useRef<Marker[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;
    let resize: ResizeObserver | undefined;
    let instance: LeafletMap | undefined;
    const initialize = async () => {
      try {
        const L = await import('leaflet');
        if (cancelled) return;
        instance = L.map(element, { scrollWheelZoom: false, minZoom: 3 });
        map.current = instance;
        let tileFailed = false;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).on('loading', () => { tileFailed = false; })
          .on('tileerror', () => { tileFailed = true; if (!cancelled) setStatus('error'); })
          .on('load', () => { if (!cancelled) setStatus(tileFailed ? 'error' : 'ready'); }).addTo(instance);
        const icon = L.divIcon({ className: 'chapter-map-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 12] });
        markers.current = chapterLocations.map(chapter => {
          const content = document.createElement('div');
          const title = document.createElement('strong');
          title.textContent = chapter.name;
          const details = document.createElement('p');
          details.textContent = `${chapter.city} · Peak members: ${chapter.members}`;
          content.append(title, details);
          return L.marker(chapter.coordinates, { icon, title: chapter.name, alt: chapter.name })
            .bindPopup(content).addTo(instance!);
        });
        instance.fitBounds(chapterLocations.map(chapter => chapter.coordinates), { padding: [35, 35], maxZoom: 11 });
        resize = new ResizeObserver(() => instance?.invalidateSize());
        resize.observe(element);
      } catch { if (!cancelled) setStatus('error'); }
    };
    // Load the mapping library and tiles only when the map approaches the viewport.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void initialize(); }
    }, { rootMargin: '200px' });
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
      resize?.disconnect();
      instance?.remove();
      map.current = undefined;
      markers.current = [];
    };
  }, []);

  const focusChapter = (index: number) => {
    if (!map.current) return;
    if (index < 0) {
      map.current.closePopup();
      map.current.fitBounds(chapterLocations.map(chapter => chapter.coordinates), { padding: [35, 35], maxZoom: 11 });
    } else {
      map.current.setView(chapterLocations[index].coordinates, 13);
      markers.current[index].openPopup();
    }
  };

  return (
    <section className="chapter-map-panel" aria-labelledby="chapter-map-heading">
      <div className="chapter-map-intro">
        <p className="chapter-map-eyebrow">Our chapter network</p>
        <h3 id="chapter-map-heading" className="text-3xl font-bold text-white">{chapterLocations.length} schools.<br />A growing community.</h3>
        <p className="text-gray-400 mt-4">Explore our active chapters across Texas and California. Select a school to see its campus and membership.</p>
        <label htmlFor="chapter-map-school" className="block mt-6 mb-2 text-sm text-gray-300">Find a chapter</label>
        <select id="chapter-map-school" className="chapter-map-select" disabled={status === 'loading'} onChange={event => focusChapter(Number(event.target.value))}>
          <option value="-1">All chapters</option>
          {chapterLocations.map((chapter, index) => <option key={chapter.name} value={index}>{chapter.name} — {chapter.city}</option>)}
        </select>
        <Link to="/chapters" className="inline-block mt-6 text-primary underline underline-offset-4">Explore all chapters →</Link>
      </div>
      <div className="chapter-map-frame">
        <div ref={container} className="chapter-map-canvas" role="region" aria-label="Interactive map of TutorDeck active school chapters" />
        <p className="chapter-map-status" role="status" hidden={status === 'ready'}>{status === 'error' ? 'Map tiles could not load. You can still select a chapter or explore the chapter directory.' : 'Loading chapter map…'}</p>
        <noscript>Enable JavaScript to explore the interactive map, or visit the chapter directory.</noscript>
      </div>
    </section>
  );
}
