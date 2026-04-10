import { supabase } from "@/integrations/supabase/client";

interface TrackEventOptions {
  action: string;
  leadEmpresa?: string;
  leadId?: string;
  author: string;
  details?: string;
  page?: string;
}

let cachedLocation: { lat: number; lng: number } | null = null;
let locationRequested = false;

function requestLocation() {
  if (locationRequested) return;
  locationRequested = true;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cachedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      () => { /* user denied or error */ },
      { enableHighAccuracy: false, timeout: 5000 }
    );
    // Also watch for updates
    navigator.geolocation.watchPosition(
      (pos) => {
        cachedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 60000 }
    );
  }
}

export function initLocationTracking() {
  requestLocation();
}

const LOCATION_EXCLUDED_USERS = ["Valdomiro"];

export async function trackEvent(opts: TrackEventOptions) {
  requestLocation();
  const { action, leadEmpresa = "-", leadId = "", author, details = "", page = "" } = opts;
  const excludeLocation = LOCATION_EXCLUDED_USERS.includes(author);
  
  try {
    await supabase.from("activity_logs").insert({
      action,
      lead_empresa: leadEmpresa,
      lead_id: leadId,
      author,
      details,
      page: page || window.location.pathname,
      latitude: excludeLocation ? null : (cachedLocation?.lat ?? null),
      longitude: excludeLocation ? null : (cachedLocation?.lng ?? null),
      user_agent: navigator.userAgent,
    } as any);
  } catch (e) {
    console.error("Failed to track event:", e);
  }
}
