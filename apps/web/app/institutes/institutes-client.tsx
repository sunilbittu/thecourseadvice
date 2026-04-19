"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Globe, MapPin, X } from "lucide-react";

type InstituteFeatureSet = {
  cafeteria: string;
  freeWifi: string;
  placementFacilities: string;
  hiringCompanies: string[];
  educationType: string[];
  educationLevel: string[];
  educationSubject: string[];
  accreditation: string;
  paymentOption: string[];
  studyMaterial: string;
  hostelFacilities: string;
  entranceTests: string;
  acceptInternationalStudents: string;
  library: string;
  transportFacilities: string;
  sportsAndGymnasium: string;
  listOfCourses: string[];
};

type Institute = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  description: string;
  address: string;
  websiteUrl: string;
  socialLinks: Record<string, string>;
  instituteFeatures: InstituteFeatureSet;
};

type Filters = {
  educationType: string[];
  educationLevel: string[];
  educationSubject: string[];
  paymentOption: string[];
};

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label onClick={onChange} className="flex items-center gap-3 cursor-pointer group">
      <span
        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors duration-200 shrink-0 ${
          checked
            ? "bg-surface-tint border-surface-tint"
            : "border-outline-variant/50 group-hover:border-surface-tint"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 4l3 3 5-6"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`text-sm transition-colors duration-200 ${
          checked
            ? "text-on-surface font-medium"
            : "text-on-surface-variant group-hover:text-on-surface"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function FiltersPanel({
  educationTypeOptions,
  educationLevelOptions,
  educationSubjectOptions,
  paymentOptions,
  filters,
  activeCount,
  clearFilters,
  toggleArr,
}: {
  educationTypeOptions: string[];
  educationLevelOptions: string[];
  educationSubjectOptions: string[];
  paymentOptions: string[];
  filters: Filters;
  activeCount: number;
  clearFilters: () => void;
  toggleArr: (key: keyof Filters, value: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl ghost-border p-5 md:p-6 space-y-6 md:space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-on-surface">Institute Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-surface-tint hover:opacity-70 transition-opacity"
          >
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Education Type
        </p>
        <div className="space-y-2.5">
          {educationTypeOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={filters.educationType.includes(opt)}
              onChange={() => toggleArr("educationType", opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Education Level
        </p>
        <div className="space-y-2.5">
          {educationLevelOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={filters.educationLevel.includes(opt)}
              onChange={() => toggleArr("educationLevel", opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Education Subject
        </p>
        <div className="space-y-2.5">
          {educationSubjectOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={filters.educationSubject.includes(opt)}
              onChange={() => toggleArr("educationSubject", opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-3">
          Payment Option
        </p>
        <div className="space-y-2.5">
          {paymentOptions.map((opt) => (
            <FilterCheckbox
              key={opt}
              label={opt}
              checked={filters.paymentOption.includes(opt)}
              onChange={() => toggleArr("paymentOption", opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function InstitutesClient({ institutes }: { institutes: Institute[] }) {
  const [filters, setFilters] = useState<Filters>({
    educationType: [],
    educationLevel: [],
    educationSubject: [],
    paymentOption: [],
  });

  const options = useMemo(() => {
    const educationType = new Set<string>();
    const educationLevel = new Set<string>();
    const educationSubject = new Set<string>();
    const paymentOption = new Set<string>();

    for (const institute of institutes) {
      institute.instituteFeatures.educationType.forEach((x) => educationType.add(x));
      institute.instituteFeatures.educationLevel.forEach((x) => educationLevel.add(x));
      institute.instituteFeatures.educationSubject.forEach((x) => educationSubject.add(x));
      institute.instituteFeatures.paymentOption.forEach((x) => paymentOption.add(x));
    }

    return {
      educationType: [...educationType].sort(),
      educationLevel: [...educationLevel].sort(),
      educationSubject: [...educationSubject].sort(),
      paymentOption: [...paymentOption].sort(),
    };
  }, [institutes]);

  const toggleArr = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      educationType: [],
      educationLevel: [],
      educationSubject: [],
      paymentOption: [],
    });
  };

  const activeCount =
    filters.educationType.length +
    filters.educationLevel.length +
    filters.educationSubject.length +
    filters.paymentOption.length;

  const filteredInstitutes = useMemo(() => {
    return institutes.filter((institute) => {
      const f = institute.instituteFeatures;

      if (
        filters.educationType.length > 0 &&
        !filters.educationType.some((value) => f.educationType.includes(value))
      ) {
        return false;
      }

      if (
        filters.educationLevel.length > 0 &&
        !filters.educationLevel.some((value) => f.educationLevel.includes(value))
      ) {
        return false;
      }

      if (
        filters.educationSubject.length > 0 &&
        !filters.educationSubject.some((value) => f.educationSubject.includes(value))
      ) {
        return false;
      }

      if (
        filters.paymentOption.length > 0 &&
        !filters.paymentOption.some((value) => f.paymentOption.includes(value))
      ) {
        return false;
      }

      return true;
    });
  }, [institutes, filters]);

  return (
    <main className="flex-1 page-enter overflow-x-hidden">
      <section className="py-10 md:py-12 px-4 sm:px-6 md:px-8 border-b border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-surface-tint/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-surface-tint" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-on-surface">
                Institutes
              </h1>
              <p className="text-on-surface-variant mt-1">
                {filteredInstitutes.length} institute{filteredInstitutes.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24">
            <FiltersPanel
              educationTypeOptions={options.educationType}
              educationLevelOptions={options.educationLevel}
              educationSubjectOptions={options.educationSubject}
              paymentOptions={options.paymentOption}
              filters={filters}
              activeCount={activeCount}
              clearFilters={clearFilters}
              toggleArr={toggleArr}
            />
          </aside>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {filteredInstitutes.map((institute) => {
              const initials = institute.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Link
                  key={institute.id}
                  href={`/institutes/${institute.slug}`}
                  className="group bg-white rounded-2xl p-6 ghost-border card-hover"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                      {institute.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={institute.logoUrl}
                          alt={institute.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <span className="font-heading text-lg font-extrabold text-on-surface-variant/70">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-on-surface group-hover:text-surface-tint transition-colors duration-300">
                        {institute.name}
                      </h2>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {institute.address}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
                    {institute.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {institute.instituteFeatures.educationType.slice(0, 2).map((type) => (
                      <span
                        key={type}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant"
                      >
                        {type}
                      </span>
                    ))}
                    {institute.instituteFeatures.educationLevel.slice(0, 1).map((level) => (
                      <span
                        key={level}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-tint/10 text-surface-tint"
                      >
                        {level}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Website
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-surface-tint">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}

            {filteredInstitutes.length === 0 && (
              <div className="bg-white rounded-2xl p-8 ghost-border text-center md:col-span-2">
                <p className="font-heading text-xl font-bold text-on-surface mb-2">No institutes found</p>
                <p className="text-sm text-on-surface-variant mb-4">Try changing your sidebar filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg bg-surface-tint text-white text-sm font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
