import { Badge } from "@/components/ui/badge";

type Status = "draft" | "pending" | "published" | "rejected";

const statusConfig: Record<
  Status,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "پیشنویس", variant: "secondary" },
  pending: { label: "در انتظار تأیید", variant: "outline" },
  published: { label: "منتشرشده", variant: "default" },
  rejected: { label: "رد شده", variant: "destructive" },
};

export function ListingStatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || statusConfig.draft;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
