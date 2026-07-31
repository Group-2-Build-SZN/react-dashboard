import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleQuestionMark } from "lucide-react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { listInquiries } from "../../../api/properties";
import { apiPropertyToProperty, formatNaira } from "../../../api/adapters";
import type { Property } from "../../../types";
import type { ApiInquiry } from "../../../api/types";

interface InquiryRow {
  inquiry: ApiInquiry;
  property: Property;
}

const statusStyles: Record<string, string> = {
  pending: "bg-accent-50 text-accent-600",
  responded: "bg-secondary-50 text-secondary",
  closed: "bg-neutral-100 text-neutral-500",
};

export function InquiriesPage() {
  const [rows, setRows] = useState<InquiryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listInquiries()
      .then((data) => {
        if (cancelled) return;
        setRows(
          data.map((row) => ({
            inquiry: row.inquiry,
            property: apiPropertyToProperty(row.property),
          }))
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load inquiries", err);
        setError("We couldn't load your inquiries. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-h2 font-bold text-neutral">My Inquiries</h1>
      <p className="mt-1 text-body text-neutral-500">
        Messages you've sent to property owners and agents.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-small text-neutral-500">Loading inquiries…</p>
        ) : error ? (
          <p className="text-small text-red-500">{error}</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
            <MessageCircleQuestionMark size={28} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-body text-neutral-500">
              You haven't made any inquiries yet.
            </p>
            <Link to="/search" className="mt-3 inline-block text-body font-medium text-primary">
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rows.map(({ inquiry, property }) => (
              <Link
                key={inquiry.id}
                to={`/property/${property.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 hover:border-primary-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={property.coverImageUrl}
                    alt={property.listingTitle}
                    className="h-16 w-16 rounded-xl object-cover bg-neutral-100"
                  />
                  <div>
                    <h3 className="text-body font-semibold text-neutral">
                      {property.listingTitle}
                    </h3>
                    <p className="text-small text-neutral-500">{property.address}</p>
                    <p className="mt-1 text-small text-neutral-600">"{inquiry.message}"</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-caption font-medium capitalize ${
                      statusStyles[inquiry.status] ?? "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {inquiry.status}
                  </span>
                  <span className="text-small text-neutral-400">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-small font-medium text-primary">
                    {formatNaira(property.price)}/{property.pricePeriod}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
