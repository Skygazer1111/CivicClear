export { createComplaintAction } from "@/features/complaints/actions";
export { createComplaintSchema, complaintTypeSchema } from "@/features/complaints/schemas";
export {
  COMPLAINT_TYPE_LABELS,
  COMPLAINT_STATUS_LABELS,
  statusBadgeClass,
} from "@/features/complaints/labels";
export { CAMPUS_LOCATIONS } from "@/features/complaints/campus-locations";
export { createPublicRef } from "@/features/complaints/service";
export { uploadComplaintPhotos } from "@/features/complaints/uploads";
export { ComplaintForm } from "@/features/complaints/components/complaint-form";
export { StatusBadge } from "@/features/complaints/components/status-badge";
