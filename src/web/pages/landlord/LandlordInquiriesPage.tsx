import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircleQuestionMark } from "lucide-react";
import { LandlordLayout } from "../../components/landlord/LandlordLayout";
import { Button } from "../../components/ui/Button";
import { getRecentInquiries, type ApiLandlordInquiry } from "../../../api/landlord";

const statusStyles: Record<string, string> = {
  pending: "bg-accent-50 text-accent-600",
  responded: "bg-secondary-50 text-secondary",
  closed: "bg-neutral-100 text-neutral-500",
};

export function LandlordInquiriesPage() {
  const [inquiries, setInquiries] = useState<ApiLandlordInquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getRecentInquiries(page, 10)
      .then((result) => {
        if (cancelled) return;
        setInquiries(result.data);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Couldn't load inquiries");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <LandlordLayout>
      <h1 className="text-h2 font-bold text-neutral">Inquiries / Bookings</h1>
      <p className="mt-1 text-body text-neutral-500">
        Messages tenants have sent about your properties.
      </p>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-small text-neutral-500">Loading inquiries…</p>
        ) : error ? (
          <p className="text-small text-error">{error}</p>
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
            <MessageCircleQuestionMark size={28} className="mx-auto text-neutral-300" />
            <p className="mt-3 text-body text-neutral-500">
              No inquiries yet — they'll show up here once tenants reach out.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {inquiries.map((inq) => (
              <Link
                key={inq.id}
                to={`/property/${inq.propertyId}`}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 hover:border-primary-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 text-neutral-400">
                    {inq.tenantAvatarUrl ? (
                      <img src={inq.tenantAvatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      inq.tenantFirstName[0]
                    )}
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-neutral">
                      {inq.tenantFirstName} {inq.tenantLastName}
                    </h3>
                    <p className="text-small text-neutral-500">{inq.propertyTitle}</p>
                    <p className="mt-1 text-small text-neutral-600">"{inq.message}"</p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-caption font-medium capitalize ${
                      statusStyles[inq.status] ?? "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {inq.status}
                  </span>
                  <span className="text-small text-neutral-400">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-small text-neutral-500">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </LandlordLayout>
  );
}
