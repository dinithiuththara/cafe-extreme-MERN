// A small, dependency-free bar chart for the admin dashboard. Keeps the
// bundle light instead of pulling in a full charting library for a
// handful of simple visualizations.
const BarChart = ({ data, labelKey, valueKey, formatValue = (v) => v, color = "#C9A15A" }) => {
  if (!data || data.length === 0) {
    return <p className="text-sm text-charcoal/40 py-8 text-center">No data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs text-charcoal/60">{d[labelKey]}</span>
          <div className="flex-1 h-3 rounded-full bg-charcoal/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d[valueKey] / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-xs font-mono text-charcoal">
            {formatValue(d[valueKey])}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
