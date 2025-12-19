import { SmartCityLoader } from "@/components/ui/smartcity-loader";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SmartCityLoader label="Connexion..." />
    </div>
  );
}
