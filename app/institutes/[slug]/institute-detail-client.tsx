"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Globe, MapPin, Star } from "lucide-react";

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
  images?: string[];
  description: string;
  address: string;
  email: string;
  phoneNumbers: string[];
  websiteUrl: string;
  socialLinks: Record<string, string>;
  instituteFeatures: InstituteFeatureSet;
};

type AvailableCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  delivery: string;
  price: number;
  rating: number;
};

type Review = {
  id: string;
  title: string;
  description: string;
  rating: number;
  date: string;
};

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 border-b border-outline-variant/10">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant mb-1">{label}</p>
      <p className="text-sm text-on-surface leading-relaxed">{value}</p>
    </div>
  );
}

export default function InstituteDetailClient({
  institute,
  availableCourses,
}: {
  institute: Institute;
  availableCourses: AvailableCourse[];
}) {
  const socialEntries = Object.entries(institute.socialLinks);
  const galleryImages = (institute.images ?? []).slice(0, 5);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: `${institute.slug}-review-1`,
      title: "Great learning environment",
      description: "Faculty support is strong and classes are very practical.",
      rating: 5,
      date: "2026-03-12",
    },
    {
      id: `${institute.slug}-review-2`,
      title: "Good curriculum",
      description: "Course structure is clear and the institute guidance is helpful.",
      rating: 4,
      date: "2026-02-27",
    },
  ]);
  const [newReview, setNewReview] = useState({
    title: "",
    description: "",
    rating: 0,
  });
  const [reviewError, setReviewError] = useState("");

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const handleAddReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newReview.title.trim()) {
      setReviewError("Please enter review title.");
      return;
    }

    if (!newReview.description.trim()) {
      setReviewError("Please enter review description.");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      setReviewError("Please select rating from 1 to 5.");
      return;
    }

    const review: Review = {
      id: `${institute.slug}-review-${Date.now()}`,
      title: newReview.title.trim(),
      description: newReview.description.trim(),
      rating: newReview.rating,
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews((prev) => [review, ...prev]);
    setNewReview({ title: "", description: "", rating: 0 });
    setReviewError("");
  };

  return (
    <main className="flex-1 page-enter overflow-x-hidden">
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-8 border-b border-outline-variant/10">
        <div className="max-w-[1100px] mx-auto">
          <Link
            href="/institutes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-surface-tint transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Institutes
          </Link>

          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-14 h-14 rounded-2xl bg-surface-tint/10 flex items-center justify-center shrink-0">
              {institute.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={institute.logoUrl}
                  alt={institute.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <Building2 className="w-7 h-7 text-surface-tint" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-on-surface break-words">
                {institute.name}
              </h1>
              <p className="text-on-surface-variant flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" /> {institute.address}
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed mt-4 max-w-3xl">
                {institute.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8">
         

            <div className="bg-white rounded-2xl ghost-border p-6 md:p-8">
              <h2 className="font-heading text-2xl font-bold text-on-surface mb-5">Available Courses</h2>

              {availableCourses.length > 0 ? (
                <div className="space-y-4">
                  {availableCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block rounded-xl border border-outline-variant/20 p-4 hover:border-surface-tint/40 hover:bg-surface-container-low transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-on-surface mb-1">{course.title}</h3>
                          <p className="text-sm text-on-surface-variant line-clamp-2">{course.description}</p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-surface-tint shrink-0">
                          View <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-3">
                        <span>{course.duration}</span>
                        <span>{course.level}</span>
                        <span>{course.delivery}</span>
                        <span className="font-semibold text-on-surface">${course.price.toLocaleString()}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-warning fill-warning" /> {course.rating}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No mapped courses available yet for this institute.</p>
              )}
            </div>

          

            <div className="bg-white rounded-2xl ghost-border p-6 md:p-8">
            <h2 className="font-heading text-2xl font-bold text-on-surface mb-5">Institute Features</h2>

            <FeatureRow label="Cafeteria" value={institute.instituteFeatures.cafeteria} />
            <FeatureRow label="Free Wifi" value={institute.instituteFeatures.freeWifi} />
            <FeatureRow label="Placement Facilities" value={institute.instituteFeatures.placementFacilities} />
            <FeatureRow
              label="List Hiring Companies"
              value={institute.instituteFeatures.hiringCompanies.join(", ")}
            />
            <FeatureRow
              label="Education Type"
              value={institute.instituteFeatures.educationType.join(", ")}
            />
            <FeatureRow
              label="Education level"
              value={institute.instituteFeatures.educationLevel.join(", ")}
            />
            <FeatureRow
              label="Education Subject"
              value={institute.instituteFeatures.educationSubject.join(", ")}
            />
            <FeatureRow label="Accreditation" value={institute.instituteFeatures.accreditation} />
            <FeatureRow
              label="Payment Option"
              value={institute.instituteFeatures.paymentOption.join(", ")}
            />
            <FeatureRow label="Study Material" value={institute.instituteFeatures.studyMaterial} />
            <FeatureRow label="Hostel Facilities" value={institute.instituteFeatures.hostelFacilities} />
            <FeatureRow label="Entrance tests" value={institute.instituteFeatures.entranceTests} />
            <FeatureRow
              label="Do You Accept International Students?"
              value={institute.instituteFeatures.acceptInternationalStudents}
            />
            <FeatureRow label="Library" value={institute.instituteFeatures.library} />
            <FeatureRow label="Transport Facilities" value={institute.instituteFeatures.transportFacilities} />
            <FeatureRow label="Sports and Gymnasium" value={institute.instituteFeatures.sportsAndGymnasium} />
            <div className="pt-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant mb-1">
                List of Courses
              </p>
              <p className="text-sm text-on-surface leading-relaxed">
                {institute.instituteFeatures.listOfCourses.join(" ")}
              </p>
            </div>
            </div>


               {galleryImages.length > 0 && (
              <div className="bg-white rounded-2xl ghost-border p-6 md:p-8">
                <h2 className="font-heading text-2xl font-bold text-on-surface mb-5">Institute Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {galleryImages.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className={`overflow-hidden rounded-xl border border-outline-variant/20 ${
                        index === 0 ? "sm:col-span-2" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={`${institute.name} image ${index + 1}`}
                        className={`w-full object-cover ${index === 0 ? "h-64 md:h-72" : "h-48"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

              <div className="bg-white rounded-2xl ghost-border p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="font-heading text-2xl font-bold text-on-surface">Student Reviews</h2>
                <p className="text-sm text-on-surface-variant">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""} • {averageRating}/5
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-outline-variant/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-lg font-bold text-on-surface">{review.title}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">{review.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-warning fill-warning"
                                  : "text-outline-variant"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{review.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-outline-variant/10">
                <h3 className="font-heading text-xl font-bold text-on-surface mb-4">Add New Review</h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">Review Title</label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter review title"
                      className="w-full h-11 rounded-lg border border-outline-variant/30 px-3 text-sm bg-white text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-surface-tint/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-2">Description</label>
                    <textarea
                      value={newReview.description}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Write your review"
                      rows={4}
                      className="w-full rounded-lg border border-outline-variant/30 px-3 py-2.5 text-sm bg-white text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-surface-tint/30"
                    />
                  </div>

                  <div>
                    <p className="block text-sm font-semibold text-on-surface mb-2">Rating (1 to 5)</p>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const value = i + 1;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setNewReview((prev) => ({ ...prev, rating: value }))}
                            className="p-1"
                            aria-label={`Rate ${value}`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                value <= newReview.rating
                                  ? "text-warning fill-warning"
                                  : "text-outline-variant"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {reviewError && <p className="text-sm text-error">{reviewError}</p>}

                  <button
                    type="submit"
                    className="h-11 px-5 rounded-lg bg-surface-tint text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          <aside className="bg-white rounded-2xl ghost-border p-6 md:p-7 h-fit lg:sticky lg:top-24">
            <h3 className="font-heading text-lg font-bold text-on-surface mb-4">Institute Contact</h3>
            <div className="space-y-4 text-sm text-on-surface-variant">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{institute.address}</span>
              </p>
              <p>
                <span className="text-on-surface font-semibold">Email: </span>
                <a
                  href={`mailto:${institute.email}`}
                  className="text-surface-tint font-semibold hover:opacity-80 transition-opacity"
                >
                  {institute.email}
                </a>
              </p>
              <div>
                <p className="text-on-surface font-semibold mb-1">Phone Numbers:</p>
                <div className="space-y-1">
                  {institute.phoneNumbers.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="block text-surface-tint font-semibold hover:opacity-80 transition-opacity"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href={institute.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-surface-tint font-semibold hover:opacity-80 transition-opacity"
              >
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            </div>

            {socialEntries.length > 0 && (
              <div className="mt-6 pt-5 border-t border-outline-variant/10">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant mb-3">
                  Social Links
                </p>
                <div className="space-y-2">
                  {socialEntries.map(([key, value]) => (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-surface-tint hover:opacity-80 transition-opacity"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
