import React from 'react';

export function StatCard({
  title, value, sub, icon, accent = false,
}: {
  title: string; value: string; sub: string; icon: React.ReactNode; accent?: boolean;
}) {

  const baseCardClasses = "p-stack-md border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#0b1f3a]";
  
  const themeClasses = accent 
    ? "bg-primary border-primary text-white" 
    : "bg-card border-primary text-primary";

  return (
    <div className={`${baseCardClasses} ${themeClasses}`}>
      
      <div className="flex items-center justify-between mb-4 border-b-2 border-primary/10 pb-2">
        <span className={`font-label-sm text-label-sm uppercase ${accent ? "text-white/80" : "text-muted-foreground"}`}>
          {title}
        </span>
        
        <div className={`w-10 h-10 flex items-center justify-center border-2 ${accent ? "bg-secondary border-secondary text-white" : "bg-primary border-primary text-white"}`}>
          {icon}
        </div>
      </div>
      
      <p className={`font-headline-xl text-[48px] uppercase leading-none mb-2 ${accent ? "text-secondary" : "text-primary"}`}>
        {value}
      </p>
      
      <p className={`font-label-sm text-[12px] uppercase ${accent ? "text-white/70" : "text-muted-foreground"}`}>
        {sub}
      </p>
      
    </div>
  );
}