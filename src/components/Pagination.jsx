export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              p === page
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-300 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
