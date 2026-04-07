export const Footer = () => (
  <footer className="mt-24 border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="shell grid gap-10 py-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <h3 className="font-[Outfit] text-2xl font-semibold text-white">Residence Elite</h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
          A modern real estate experience for buyers, renters, investors, and operations teams. Designed for trust, speed, and premium conversion.
        </p>
      </div>
      <div>
        <p className="font-semibold text-white">Reach us</p>
        <p className="mt-4 text-sm leading-7">hello@residenceelite.com</p>
        <p className="text-sm leading-7">+91 90000 12345</p>
      </div>
      <div>
        <p className="font-semibold text-white">Coverage</p>
        <p className="mt-4 text-sm leading-7">Mumbai</p>
        <p className="text-sm leading-7">Bengaluru</p>
        <p className="text-sm leading-7">Goa</p>
      </div>
    </div>
  </footer>
);
