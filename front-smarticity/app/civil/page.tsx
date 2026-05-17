import SignalementForm from "@/components/ui/SignalementForm";

export default function CivilPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Espace citoyen</h1>
        <p className="text-sm text-slate-500 mt-1">Envoyez un nouveau signalement à l&apos;administration.</p>
      </div>
      <SignalementForm />
    </div>
  );
}
