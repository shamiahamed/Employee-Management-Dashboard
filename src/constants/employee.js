/** Number of rows displayed per page in the employee table. */
export const PAGE_SIZE = 6;

/** Selectable employee departments. */
export const DEPARTMENTS = ["Engineering", "HR", "Sales", "Finance", "Marketing"];

/** Selectable employee statuses. */
export const STATUSES = ["Active", "Inactive", "On Leave"];

/** Filter dropdown options — includes the catch-all "All" option. */
export const STATUS_FILTER_OPTIONS = ["All", ...STATUSES];

/**
 * Tailwind CSS class map for status badge colouring.
 * Used in EmployeeTable to style the status pill.
 */
export const STATUS_BADGE_CLASSES = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  "On Leave": "bg-amber-100 text-amber-700",
};
