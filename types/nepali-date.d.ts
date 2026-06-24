declare module "@sbmdkl/nepali-datepicker-reactjs" {
  import * as React from "react";

  export interface NepaliDatePickerProps {
    value?: string;
    onChange?: (args: { bsDate: string; adDate: string }) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    language?: "ne" | "en";
    dateFormat?: string;
    theme?: string;
    defaultDate?: string;
    hideDefaultValue?: boolean;
    key?: string | number;
  }

  const Calendar: React.FC<NepaliDatePickerProps>;
  export default Calendar;
}

declare module "@sbmdkl/nepali-date-converter" {
  export function adToBs(dateStr: string): string;
  export function bsToAd(dateStr: string): string;
}
