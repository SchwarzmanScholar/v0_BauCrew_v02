"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import Link from "next/link";
import { ListingCategoryLabels } from "@/lib/validations/job-request";

interface ProviderJobRequestCardProps {
  jobRequest: {
    id: string;
    category: string;
    title: string;
    description: string;
    city: string;
    postalCode: string;
    createdAt: Date;
    _count?: {
      offers: number;
    };
  };
}

/**
 * Get color scheme for category badges
 */
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    ELECTRICIAN: "bg-yellow-100 text-yellow-800 border-yellow-200",
    PLUMBER: "bg-blue-100 text-blue-800 border-blue-200",
    PAINTING: "bg-purple-100 text-purple-800 border-purple-200",
    DRYWALL: "bg-slate-100 text-slate-800 border-slate-200",
    HANDYMAN: "bg-gray-100 text-gray-800 border-gray-200",
    CARPENTRY: "bg-amber-100 text-amber-800 border-amber-200",
    FLOORING: "bg-orange-100 text-orange-800 border-orange-200",
    MASONRY: "bg-stone-100 text-stone-800 border-stone-200",
    HVAC: "bg-cyan-100 text-cyan-800 border-cyan-200",
    OTHER: "bg-pink-100 text-pink-800 border-pink-200",
  };
  return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function ProviderJobRequestCard({ jobRequest }: ProviderJobRequestCardProps) {
  const timeAgo = formatDistanceToNow(new Date(jobRequest.createdAt), {
    addSuffix: true,
    locale: de,
  });

  // Truncate description to 150 characters
  const shortDescription =
    jobRequest.description.length > 150
      ? `${jobRequest.description.substring(0, 150)}...`
      : jobRequest.description;

  const categoryLabel = ListingCategoryLabels[jobRequest.category] || jobRequest.category;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge
            variant="outline"
            className={`${getCategoryColor(jobRequest.category)} font-medium`}
          >
            {categoryLabel}
          </Badge>
          {jobRequest._count && jobRequest._count.offers > 0 && (
            <Badge variant="secondary" className="text-xs">
              {jobRequest._count.offers} {jobRequest._count.offers === 1 ? "Angebot" : "Angebote"}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2">
          {jobRequest.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-sm text-foreground/70 mb-4 line-clamp-3">
          {shortDescription}
        </CardDescription>

        {/* Metadata */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>
              {jobRequest.city} ({jobRequest.postalCode})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Eingestellt {timeAgo}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Button asChild className="mt-4 w-full" variant="secondary">
          <Link href={`/provider/job-board/${jobRequest.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            Details ansehen
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
