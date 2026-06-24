import { adToBs } from "@sbmdkl/nepali-date-converter";

// Helper function to convert Latin numerals to Devanagari numerals
export const toDevanagariNumerals = (str: string): string => {
  const latinToDevanagari: { [key: string]: string } = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };
  return str.replace(/[0-9]/g, (digit) => latinToDevanagari[digit] || digit);
};

// Helper function to convert Devanagari numerals to Latin numerals
export const toLatinNumerals = (str: string): string => {
  const devanagariToLatin: { [key: string]: string } = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };
  return str.replace(
    /[०१२३४५६७८९]/g,
    (digit) => devanagariToLatin[digit] || digit,
  );
};

export const convertAdToBs = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const bsDate = adToBs(dateStr);
    return toDevanagariNumerals(bsDate);
  } catch (error) {
    console.error("Error converting date to BS:", error);
    return "";
  }
};

export const formatNepaliDate = (dateStr: string): string => {
  if (!dateStr) return "";

  // Handle potential time components or different formats
  // If it's already in Nepali format (unlikely for raw DB data but possible in UI state), return as is
  if (/[०-९]/.test(dateStr)) return dateStr;

  return convertAdToBs(dateStr.split(" ")[0].split("T")[0]);
};

export const monthsInEnglish = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashoj",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const formatToNepaliMonthDayYear = (dateStr: string): string => {
  if (!dateStr) return "";

  // Helper to force 2 digits
  const pad = (n: number) => (n < 10 ? `0${n}` : n);

  try {
    const bsDate = adToBs(dateStr.split(" ")[0].split("T")[0]);
    // bsDate is "2082-10-03" (Latin digits)

    const [year, month, day] = bsDate.split("-").map(Number);

    if (!year || !month || !day) return dateStr;

    const monthName = monthsInEnglish[month - 1]; // 0-indexed

    return `${monthName} ${pad(day)}, ${year}`;
  } catch (error) {
    console.error("Error formatting Nepali date:", error);
    return dateStr;
  }
};
