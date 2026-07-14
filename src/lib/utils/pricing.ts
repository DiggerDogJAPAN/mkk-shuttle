import { SupabaseClient } from '@supabase/supabase-js'

interface ResolveJourneyPriceOptions {
  supabase: SupabaseClient<any, "public", any>;
  scheduleId?: string | null;
  fromStopId?: string | null;
  toStopId?: string | null;
}

interface JourneyPriceResult {
  pricePerPassenger: number;
  pricingType: "standard" | "schedule_override";
}

/**
 * Resolves the price per passenger for a specific journey.
 * It first checks for a schedule-specific override. If none exists,
 * it falls back to the standard route price.
 */
export async function resolveJourneyPrice({
  supabase,
  scheduleId,
  fromStopId,
  toStopId,
}: ResolveJourneyPriceOptions): Promise<JourneyPriceResult | null> {
  if (!fromStopId || !toStopId) {
    return null
  }

  // 1. Try to find a schedule-specific override first
  if (scheduleId) {
    const { data: override } = await supabase
      .from('schedule_price_overrides')
      .select('price')
      .eq('schedule_id', scheduleId)
      .eq('from_stop_id', fromStopId)
      .eq('to_stop_id', toStopId)
      .maybeSingle()

    if (override?.price != null) {
      return {
        pricePerPassenger: override.price,
        pricingType: "schedule_override",
      }
    }
  }

  // 2. Fall back to the standard prices table
  const { data: standard } = await supabase
    .from('prices')
    .select('price')
    .eq('from_stop_id', fromStopId)
    .eq('to_stop_id', toStopId)
    .maybeSingle()

  if (standard?.price != null) {
    return {
      pricePerPassenger: standard.price,
      pricingType: "standard",
    }
  }

  // 3. Neither an override nor a standard price was found
  return null
}
