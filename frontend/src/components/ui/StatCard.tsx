export function StatCard({
  title, value, sub, icon, accent = false,
}: {
  title: string; value: string; sub: string; icon: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? "bg-primary border-primary text-white" : "bg-white border-border"}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${accent ? "text-white/80" : "text-muted-foreground"}`}>{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? "bg-white/15" : "bg-secondary"}`}>
          <span className={accent ? "text-white" : "text-primary"}>{icon}</span>
        </div>
      </div>
      <p className={`text-3xl font-black leading-none ${accent ? "text-white" : "text-foreground"}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
      <p className={`text-xs mt-1.5 ${accent ? "text-white/70" : "text-muted-foreground"}`}>{sub}</p>
    </div>
  );
}