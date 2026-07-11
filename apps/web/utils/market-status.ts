import type { MarketStatus } from "@/types/market";

const IST_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata"
};

export function getMockMarketStatus(now = new Date()): MarketStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((accumulator, part) => {
      if (part.type !== "literal") {
        accumulator[part.type] = part.value;
      }

      return accumulator;
    }, {});

  const weekday = parts.weekday ?? "Mon";
  const hour = Number(parts.hour ?? "0");
  const minute = Number(parts.minute ?? "0");
  const totalMinutes = hour * 60 + minute;
  const isWeekday = !["Sat", "Sun"].includes(weekday);

  if (!isWeekday) {
    return {
      exchange: "NSE",
      label: "Closed",
      state: "closed",
      asOf: new Intl.DateTimeFormat("en-IN", IST_FORMAT_OPTIONS).format(now),
      opensAt: "09:15 IST",
      closesAt: "15:30 IST"
    };
  }

  if (totalMinutes >= 540 && totalMinutes < 555) {
    return {
      exchange: "NSE",
      label: "Pre-Open",
      state: "pre-open",
      asOf: new Intl.DateTimeFormat("en-IN", IST_FORMAT_OPTIONS).format(now),
      opensAt: "09:15 IST",
      closesAt: "15:30 IST"
    };
  }

  if (totalMinutes >= 555 && totalMinutes <= 930) {
    return {
      exchange: "NSE",
      label: "Live Market",
      state: "open",
      asOf: new Intl.DateTimeFormat("en-IN", IST_FORMAT_OPTIONS).format(now),
      opensAt: "09:15 IST",
      closesAt: "15:30 IST"
    };
  }

  return {
    exchange: "NSE",
    label: "Closed",
    state: "closed",
    asOf: new Intl.DateTimeFormat("en-IN", IST_FORMAT_OPTIONS).format(now),
    opensAt: "09:15 IST",
    closesAt: "15:30 IST"
  };
}

