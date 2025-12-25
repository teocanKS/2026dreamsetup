import type { SupabaseClient } from '@supabase/supabase-js'

export const purchasesService = {
    async fetchPurchasesForBuild(supabase: SupabaseClient, buildId: string) {
        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        part_items (
          products (
            category,
            brand,
            model
          )
        )
      `)
            .eq('build_id', buildId)
            .order('purchased_at', { ascending: false })

        return { data, error }
    },

    async calculateTotals(purchases: any[]) {
        const total = purchases.reduce((sum, p) => sum + (p.purchase_price || 0), 0)
        return { total, count: purchases.length }
    }
}
