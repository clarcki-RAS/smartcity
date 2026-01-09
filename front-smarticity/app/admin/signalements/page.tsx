import { SignalementsCards } from "@/components/signalements/SignalementsCards";

import SignalementForm from "@/components/ui/SignalementForm";

export  function NewSignalementPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <SignalementForm />
    </div>
  );
}


export default function SignalementsPage() {
  return (
    <div className="ml-[250px] p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Gestion des signalements
      </h1>

      <SignalementsCards />
    </div>
  );
}
