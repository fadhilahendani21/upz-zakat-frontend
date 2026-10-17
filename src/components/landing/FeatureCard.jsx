
import { Link } from "react-router-dom";
import {
  Calculator,
  CreditCard,
  Users,
  FileText,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { dummyFitur } from "../../data/dummyProgram";

const icons = {
  Calculator,
  CreditCard,
  Users,
  FileText,
  Headphones,
};

const rute = {
  "Hitung Zakat": "/hitung-zakat",
  "Tunaikan Zakat": "/zakat",
  "Program Penyaluran": "/program",
  "Laporan Transparansi": "/laporan",
  "Hubungi Kami": "/kontak",
};

export default function FeatureCard() {
  return (
    <section className="relative z-10 mx-auto grid w-full max-w-none grid-cols-2 gap-3 px-3 pt-0 pb-1 sm:grid-cols-3 sm:gap-4 sm:px-5 md:grid-cols-5 lg:gap-4 lg:px-6 xl:px-8">
      {dummyFitur.map((fitur) => {
        const Icon = icons[fitur.icon];

        return (
          <Link
            to={rute[fitur.title] || "#"}
            key={fitur.title}
            className="group flex h-full min-w-0 flex-col rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md sm:rounded-2xl sm:p-3"
          >
            <div className="mb-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 sm:mb-2 sm:h-9 sm:w-9">
              {Icon && <Icon size={18} />}
            </div>

            <h3 className="mb-1 text-xs font-semibold leading-snug text-gray-900 sm:text-sm">
              {fitur.title}
            </h3>

            <p className="flex-1 text-[11px] leading-snug text-gray-500 sm:text-xs">
              {fitur.desc}
            </p>

            <ArrowRight
              size={15}
              className="mt-1.5 shrink-0 text-brand-600 transition-transform group-hover:translate-x-1 sm:mt-2"
            />
          </Link>
        );
      })}
    </section>
  );
}
