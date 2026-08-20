"use client";

import { useActionState, useId } from "react";
import { createComplaintAction } from "@/features/complaints/actions";
import { LocationPicker } from "@/features/complaints/components/location-picker-dynamic";
import { PhotoPicker } from "@/features/complaints/components/photo-picker";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FormErrorBanner } from "@/shared/ui/field-error";
import { COMPLAINT_TYPE_LABELS } from "@/features/complaints/labels";

export function ComplaintForm() {
  const formErrorId = useId();
  const [state, formAction, pending] = useActionState(
    createComplaintAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="space-y-6"
      aria-describedby={state?.error ? formErrorId : undefined}
      noValidate
    >
      <div>
        <Label htmlFor="type">Issue type</Label>
        <select
          id="type"
          name="type"
          required
          className="field"
          defaultValue="pothole"
        >
          {Object.entries(COMPLAINT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="title">Short title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Deep pothole near the bus stop"
          required
          maxLength={100}
          autoComplete="off"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={2000}
          placeholder="What is wrong, how long it has been there, and any nearby landmark."
          className="field h-auto min-h-[8rem] py-3"
        />
      </div>

      <PhotoPicker />
      <LocationPicker />

      <div id={formErrorId}>
        <FormErrorBanner message={state?.error} />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? "Submitting…" : "Submit report"}
      </Button>
    </form>
  );
}
