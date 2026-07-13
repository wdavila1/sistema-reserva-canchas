export const isWeekend = (d: string) => {
  if (!d) return false;
  const day = new Date(d + "T12:00:00").getDay();
  return day === 0 || day === 6;
};

export const addHr = (t: string, h: number) => {
  const [hh] = t.split(":").map(Number);
  return `${String(hh + h).padStart(2, "0")}:00`;
};

export const weekDay = (offset: number) => {
  const days = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  return days[offset % 7];
};
