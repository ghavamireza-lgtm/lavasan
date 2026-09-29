'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Plan = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationDays: number;
  maxListings: number;
  featuredListings: number;
  features: string[];
  order: number;
};

type Subscription = {
  _id: string;
  planSlug: string;
  expiresAt: string;
  plan?: Plan;
};

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const [plansRes, subRes] = await Promise.all([
        fetch("/api/plans"),
        fetch("/api/subscription"),
      ]);

      const plansData = await plansRes.json();
      const subData = await subRes.json();

      setPlans(plansData.plans || []);
      setSubscription(subData.subscription);
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleActivateFree() {
    setError(null);
    setActivating(true);

    const res = await fetch("/api/subscription/activate-free", {
      method: "POST",
    });

    setActivating(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "خطا در فعال‌سازی پکیج");
      return;
    }

    await fetchData();
    router.refresh();
  }

  function handleBuy(planName: string) {
    alert(`خرید پکیج "${planName}" به‌زودی فعال می‌شود`);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentPlanSlug = subscription?.planSlug;
  const expiresDate = subscription
    ? new Date(subscription.expiresAt).toLocaleDateString("fa-IR")
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">پکیج‌ها</h1>
        <p className="text-muted-foreground text-sm">
          پکیج مناسب کسب‌وکار خود را انتخاب کنید
        </p>
        {subscription && (
          <p className="text-sm mt-2">
            پکیج فعلی شما: <strong>{subscription.plan?.name}</strong> (تا{" "}
            {expiresDate})
          </p>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.slug === currentPlanSlug;
          const isFree = plan.price === 0;
          const isBusiness = plan.slug === "business";

          return (
            <Card
              key={plan._id}
              className={cn(
                "relative flex flex-col",
                isCurrent && "border-primary border-2",
                isBusiness && "border-primary/50"
              )}
            >
              {isBusiness && !isCurrent && (
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-700 text-primary-foreground">
                    <Crown className="h-3 w-3 me-1" />
                    پیشنهاد ویژه
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary">پکیج فعلی</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  {isFree ? (
                    <span className="text-3xl font-bold">رایگان</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">
                        {plan.price.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-muted-foreground me-1">
                        {" "}
                        تومان
                      </span>
                    </>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    برای {plan.durationDays} روز
                  </p>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || activating}
                  onClick={
                    isCurrent
                      ? undefined
                      : isFree
                        ? handleActivateFree
                        : () => handleBuy(plan.name)
                  }
                >
                  {isCurrent
                    ? "پکیج فعلی"
                    : isFree
                      ? activating
                        ? "در حال فعال‌سازی..."
                        : "فعال‌سازی رایگان"
                      : "خرید پکیج"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}