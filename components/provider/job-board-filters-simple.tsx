"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ListingCategoryLabels } from "@/lib/validations/job-request";

const ALL_CATEGORIES = "all";
const ALL_CITIES = "";

export function JobBoardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || ALL_CATEGORIES);
  const [city, setCity] = useState(searchParams.get("city") || ALL_CITIES);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (category && category !== ALL_CATEGORIES) {
      params.set("category", category);
    }
    if (city.trim()) {
      params.set("city", city.trim());
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/provider/job-board", {
      scroll: false,
    });
  }, [category, city, router]);

  const handleClearFilters = () => {
    setCategory(ALL_CATEGORIES);
    setCity(ALL_CITIES);
  };

  const hasActiveFilters = category !== ALL_CATEGORIES || city.trim() !== "";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-secondary" />
          <h3 className="font-semibold text-lg">Filter</h3>
        </div>

        <div className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter">Kategorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>Alle Kategorien</SelectItem>
                {Object.entries(ListingCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <Label htmlFor="city-filter">Stadt</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="city-filter"
                type="text"
                placeholder="z.B. Berlin"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
