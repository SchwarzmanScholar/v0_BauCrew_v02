"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, FileText, MapPin, Clock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createJobRequest } from "@/app/_actions/job-requests";
import {
  jobRequestSchema,
  type JobRequestFormData,
  ListingCategoryLabels,
  JobTimeframeLabels,
} from "@/lib/validations/job-request";

export function JobRequestForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobRequestFormData>({
    resolver: zodResolver(jobRequestSchema),
    mode: "onChange",
    defaultValues: {
      category: undefined,
      title: "",
      description: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      timeframe: undefined,
      desiredDate: undefined,
      photoUrls: [],
    },
  });

  const watchedTimeframe = form.watch("timeframe");
  const watchedDescription = form.watch("description");

  async function onSubmit(data: JobRequestFormData) {
    setIsSubmitting(true);

    try {
      const result = await createJobRequest({
        category: data.category as any,
        title: data.title,
        description: data.description,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        postalCode: data.postalCode,
        country: "DE",
        timeframe: data.timeframe as any,
        desiredDate: data.desiredDate,
        photoUrls: data.photoUrls,
      });

      if (result.ok) {
        toast({
          title: "Auftrag erstellt",
          description:
            "Dein Auftrag wurde erfolgreich eingestellt. Handwerker können dir jetzt Angebote senden.",
        });
        router.push("/app/requests");
      }
    } catch (error) {
      console.error("Error creating job request:", error);
      toast({
        title: "Fehler",
        description:
          "Der Auftrag konnte nicht erstellt werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              <CardTitle>Projektdetails</CardTitle>
            </div>
            <CardDescription>
              Beschreibe dein Projekt so detailliert wie möglich
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle eine Kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ListingCategoryLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wähle die Kategorie, die am besten zu deinem Projekt passt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titel *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Badezimmer renovieren"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ein kurzer, prägnanter Titel für dein Projekt
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreibe dein Projekt im Detail: Was soll gemacht werden? Welche Materialien werden benötigt? Gibt es besondere Anforderungen?"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Je detaillierter, desto besser die Angebote (min. 20
                      Zeichen)
                    </FormDescription>
                    <span
                      className={cn(
                        "text-xs",
                        watchedDescription.length < 20
                          ? "text-muted-foreground"
                          : watchedDescription.length > 2000
                            ? "text-destructive"
                            : "text-green-600"
                      )}
                    >
                      {watchedDescription.length} / 2000
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              <CardTitle>Standort</CardTitle>
            </div>
            <CardDescription>
              Die vollständige Adresse wird erst nach Auftragsvergabe
              sichtbar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address Line 1 */}
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Straße und Hausnummer *</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Musterstraße 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Line 2 */}
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresszusatz (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. 2. OG, Hinterhaus"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Stockwerk, Gebäudeteil, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City and Postal Code Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stadt *</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Berlin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postal Code */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postleitzahl *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="z.B. 10115"
                        maxLength={5}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Timing Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-secondary" />
              <CardTitle>Zeitplanung</CardTitle>
            </div>
            <CardDescription>
              Wann soll das Projekt durchgeführt werden?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Timeframe */}
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zeitrahmen *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle einen Zeitrahmen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(JobTimeframeLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Desired Date - Only show if SPECIFIC_DATE selected */}
            {watchedTimeframe === "SPECIFIC_DATE" && (
              <FormField
                control={form.control}
                name="desiredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Gewünschtes Datum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: de })
                            ) : (
                              <span>Datum auswählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() ||
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      An welchem Tag soll die Arbeit beginnen?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Photos Card (Placeholder) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-secondary" />
              <CardTitle>Fotos (optional)</CardTitle>
            </div>
            <CardDescription>
              Fotos helfen Handwerkern, dein Projekt besser zu verstehen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Foto-Upload wird in Kürze verfügbar sein
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Wird erstellt...
              </>
            ) : (
              "Auftrag einstellen"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Abbrechen
          </Button>
        </div>

        {/* Info text */}
        <p className="text-sm text-muted-foreground text-center">
          * Pflichtfelder
        </p>
      </form>
    </Form>
  );
}
