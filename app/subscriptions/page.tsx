"use client";

import Link from "next/link";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { sortForDisplay } from "@/lib/subscription";
import { CommittedSpend } from "@/components/subscription/CommittedSpend";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { RequireWallet } from "@/components/wallet/RequireWallet";

export default function MySubscriptionsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-fg">My subscriptions</h1>
        <p className="max-w-2xl text-sm text-muted">
          Everything you&apos;ve authorized. Pause or cancel any of it here — a cancelled subscription can never be
          charged again.
        </p>
      </header>

      <RequireWallet purpose="see your subscriptions">{(address) => <Subscriptions address={address} />}</RequireWallet>
    </div>
  );
}

function Subscriptions({ address }: { address: string }) {
  const subs = useSubscriptions(address);

  if (subs.error) {
    return <ErrorState error={subs.error} title="Couldn't load your subscriptions" onRetry={subs.reload} />;
  }
  if (!subs.data) return <SubscriptionsSkeleton />;

  if (subs.data.length === 0) {
    return (
      <EmptyState
        title="No subscriptions yet"
        description="When you subscribe to a plan, it shows up here with your cap, what's been charged, and controls to pause or cancel."
        action={
          <Link href="/plans" className="btn-primary">
            Browse plans
          </Link>
        }
      />
    );
  }

  const ordered = sortForDisplay(subs.data);
  return (
    <div className="space-y-6">
      <CommittedSpend subs={subs.data} />
      <ul className="grid gap-4 lg:grid-cols-2">
        {ordered.map((sub) => (
          <li key={sub.id}>
            <SubscriptionCard sub={sub} onChanged={subs.reload} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubscriptionsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading subscriptions</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="card animate-pulse space-y-3">
          <div className="h-4 w-40 rounded bg-border" />
          <div className="h-8 w-32 rounded bg-border" />
        </div>
        <ul className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <div className="card animate-pulse space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-border" />
                    <div className="h-3 w-24 rounded bg-border" />
                  </div>
                  <div className="h-6 w-16 rounded-full bg-border" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-border" />
                  <div className="h-2 w-full rounded-full bg-border" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 rounded bg-border" />
                  <div className="h-9 w-24 rounded bg-border" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
