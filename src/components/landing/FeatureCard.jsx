import {
  Calculator,
  CreditCard,
  Users,
  FileText,
  Newspaper,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { dummyFitur } from "../../data/dummyProgram";

const icons = {
  Calculator,
  CreditCard,
  Users,
  FileText,
  Newspaper,
  Headphones,
};

export default function FeatureCard() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {dummyFitur.map((fitur) => {
        const Icon = icons[fitur.icon];
        return (
          <div
            key={fitur.title}
            className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
              <Icon size={19} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
              {fitur.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {fitur.desc}
            </p>
            <ArrowRight size={16} className="mt-3 text-brand-600" />
          </div>
        );
      })}
    </section>
  );
}
