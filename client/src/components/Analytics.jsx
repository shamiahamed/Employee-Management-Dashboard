import { useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

const STATUS_COLORS = { Active: "#22c55e", Inactive: "#ef4444", "On Leave": "#f59e0b" };
const DEPT_COLORS = ["#6366f1", "#06b6d4", "#f97316", "#a855f7", "#10b981", "#ec4899"];

export default function Analytics({ employees }) {
  const total = employees.length;
  const active = employees.filter((e) => e.status === "Active").length;

  const deptCounts = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const statusCounts = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      map[e.status] = (map[e.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const monthlyJoined = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      if (!e.joiningDate) return;
      const d = new Date(e.joiningDate);
      const key = `${d.toLocaleString("default", { month: "short" })} '${String(d.getFullYear()).slice(2)}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([month, count]) => ({ month, count, sortKey: new Date(month) }))
      .sort((a, b) => new Date("1 " + a.month.replace("'", "20")) - new Date("1 " + b.month.replace("'", "20")));
  }, [employees]);

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={total} color="bg-indigo-50 text-indigo-700" />
        <StatCard label="Active Employees" value={active} color="bg-green-50 text-green-700" />
        <StatCard label="Departments" value={deptCounts.length} color="bg-cyan-50 text-cyan-700" />
        <StatCard label="On Leave" value={employees.filter((e) => e.status === "On Leave").length} color="bg-amber-50 text-amber-700" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <ChartCard title="Department-wise Count">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptCounts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {deptCounts.map((_, i) => (
                  <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employee Status Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {statusCounts.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Joined Employees">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyJoined}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-2">{title}</h4>
      {children}
    </div>
  );
}
