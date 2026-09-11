"use client";

import { Card } from "@/components/ui/Card";
import { NOT_DEPLOYED_MESSAGE, isContractConfigured } from "@/lib/config";
import type { ReactNode } from "react";

export function ContractGate({ children }: { children: ReactNode }) {
  if (!isContractConfigured()) {
    return (
      <Card
        title="Contract not configured"
        state="empty"
        emptyMessage={NOT_DEPLOYED_MESSAGE}
        footer={
          <span>
            Copy <code className="font-mono text-mono">.env.example</code> to{" "}
            <code className="font-mono text-mono">.env.local</code> and set the
            Día 2 contract id after deploy.
          </span>
        }
      />
    );
  }

  return <>{children}</>;
}
