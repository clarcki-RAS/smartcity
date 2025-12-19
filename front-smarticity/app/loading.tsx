import { SmartCityLoader } from "@/components/ui/smartcity-loader";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50
                 bg-background/80 backdrop-blur-sm
                 flex items-center justify-center
                 animate-in fade-in duration-200"
    >
      <SmartCityLoader />
    </div>
  );
}
