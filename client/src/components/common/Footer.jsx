export const Footer = () => (
  <footer className="mt-24 border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="shell py-14">
      <div className="grid gap-10 rounded-[36px] border border-white/10 bg-white/4 p-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="font-[Outfit] text-3xl font-semibold text-white">Residence Elite</h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
            A modern public real estate experience for buyers, renters, investors, and agents. Designed for trust, premium presentation, and clean lead conversion.
          </p>
          <p className="mt-5 text-sm text-slate-500">221B Palm Residency, Bandra West, Mumbai 400050</p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <div className="mt-4 space-y-3 text-sm">
            <a href="/" className="block hover:text-white">Home</a>
            <a href="/properties" className="block hover:text-white">Properties</a>
            <a href="/about" className="block hover:text-white">About</a>
            <a href="/contact" className="block hover:text-white">Contact</a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <div className="mt-4 space-y-3 text-sm">
            <p>hello@residenceelite.com</p>
            <p>+91 90000 12345</p>
            <p>Mon-Sat, 9:00 AM to 7:00 PM</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>Serving Mumbai, Bengaluru, Goa, Hyderabad, and Delhi NCR.</p>
        <p>© 2026 Residence Elite. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
