import type { SupabaseClient } from '@supabase/supabase-js'

export const offersService = {
    async fetchOffersForBuild(supabase: SupabaseClient, buildId: string) {
        try {
            const { data, error } = await supabase
                .from('offers')
                .select(`
          *,
          discount_ranges (
            min_percent,
            max_percent,
            confidence,
            source
          )
        `)
                .eq('part_item_id', buildId)
                .order('created_at', { ascending: false })

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    },

    async createOffer(
        supabase: SupabaseClient,
        offer: {
            part_item_id: string
            vendor_name: string
            kind: string
            url?: string
            base_price: number
            in_stock: boolean
            is_estimated: boolean
            note?: string
        },
        discountRange?: {
            min_percent: number
            max_percent: number
            confidence: string
            source?: string
        }
    ) {
        try {
            const { data: offerData, error: offerError } = await supabase
                .from('offers')
                .insert(offer)
                .select()
                .single()

            if (offerError) return { data: null, error: offerError }

            if (discountRange && offerData) {
                const { error: discountError } = await supabase
                    .from('discount_ranges')
                    .insert({
                        offer_id: offerData.id,
                        ...discountRange
                    })

                if (discountError) return { data: offerData, error: discountError }
            }

            return { data: offerData, error: null }
        } catch (error) {
            return { data: null, error }
        }
    },

    async setPrimaryOffer(supabase: SupabaseClient, offerId: string, partItemId: string) {
        try {
            await supabase
                .from('offers')
                .update({ is_primary: false })
                .eq('part_item_id', partItemId)

            const { data, error } = await supabase
                .from('offers')
                .update({ is_primary: true })
                .eq('id', offerId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    }
}
