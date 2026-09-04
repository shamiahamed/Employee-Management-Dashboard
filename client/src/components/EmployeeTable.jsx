import { STATUS_BADGE_CLASSES } from "../constants/employee";

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (employees.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-lg font-medium">No employees found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-2 px-3 font-medium">Name</th>
            <th className="py-2 px-3 font-medium">Email</th>
            <th className="py-2 px-3 font-medium">Department</th>
            <th className="py-2 px-3 font-medium">Designation</th>
            <th className="py-2 px-3 font-medium">Status</th>
            <th className="py-2 px-3 font-medium">Joining Date</th>
            <th className="py-2 px-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2.5 px-3 font-medium text-slate-800">{emp.name}</td>
              <td className="py-2.5 px-3 text-slate-500">{emp.email}</td>
              <td className="py-2.5 px-3 text-slate-500">{emp.department}</td>
              <td className="py-2.5 px-3 text-slate-500">{emp.designation}</td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_CLASSES[emp.status] || "bg-slate-100 text-slate-600"}`}>
                  {emp.status}
                </span>
              </td>
              <td className="py-2.5 px-3 text-slate-500">{emp.joiningDate}</td>
              <td className="py-2.5 px-3 text-right space-x-2">
                <button onClick={() => onEdit(emp)} className="text-indigo-600 hover:underline text-xs font-medium">
                  Edit
                </button>
                <button onClick={() => onDelete(emp)} className="text-red-600 hover:underline text-xs font-medium">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
