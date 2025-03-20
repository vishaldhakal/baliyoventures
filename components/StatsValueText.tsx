import { Separator } from "@/components/ui/separator";

interface StatsValueTextProps {
  value: string;
  suffix?: string;
  subtitle: string;
  description: string;
}

export function StatsValueText({
  value,
  suffix = "+",
  subtitle,
  description,
}: StatsValueTextProps) {
  return (
    <div className="flex items-center gap-5 w-full">
      <div className="flex flex-col gap-6 items-start ">
        <div className="flex items-center font-headings">
          <h6 className="text-white  font-bold text-4xl md:text-5xl">
            {value}
          </h6>
          <span className="text-[#F0D100] font-semibold text-xl">{suffix}</span>
        </div>
        <span className="text-white uppercase text-xs md:text-sm font-medium">
          {subtitle}
        </span>
      </div>
      <Separator orientation="vertical" className="h-full bg-white" />
      <div className="flex-1">
        <p className="text-[#B0B0B0] text-sm md:text-base">{description}</p>
      </div>
    </div>
  );
}
