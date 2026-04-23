import { AlertTriangle } from "lucide-react";

const HealthWarning = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-foreground text-background border-t border-background/10">
      <div className="container py-3 flex items-center justify-center gap-3 text-center">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <p className="text-[10px] sm:text-xs uppercase tracking-wider-2 font-medium">
          Warning: This product contains nicotine. Nicotine is an addictive chemical. Sale prohibited under 21.
        </p>
      </div>
    </div>
  );
};

export default HealthWarning;
