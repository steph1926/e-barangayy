import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const pad = (n) => String(n).padStart(2, "0");
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseBirthday(value) {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function formatBirthday(value) {
  const date = parseBirthday(value);
  if (!date) return "";
  return date.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}

export default function BirthdayPicker({ value, onChange, invalid = false }) {
  const [open, setOpen] = useState(false);
  const selected = parseBirthday(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex w-full items-center gap-2.5 rounded-xl border bg-card px-3.5 py-2.5 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-secondary/20 ${
            invalid ? "border-destructive" : "border-border focus:border-secondary"
          } ${selected ? "text-foreground" : "text-muted-foreground"}`}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-secondary" />
          {selected ? formatBirthday(value) : "Select your date of birth"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(toIso(date));
            setOpen(false);
          }}
          disabled={{ after: today }}
          defaultMonth={selected ?? new Date(today.getFullYear() - 25, 0, 1)}
          captionLayout="dropdown"
          startMonth={new Date(1920, 0)}
          endMonth={today}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
