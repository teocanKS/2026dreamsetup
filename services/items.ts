import type { SupabaseClient } from '@supabase/supabase-js'

export const itemsService = {
    async fetchItemsForBuild(supabase: SupabaseClient, buildId: string) {
        try {
            const { data, error } = await supabase
                .from('part_items')
                .select(`
          *,
          products (
            category,
            brand,
            model
          )
        `)
                .eq('build_id', buildId)
                .order('created_at', { ascending: false })

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    },

    async updateItemStatus(supabase: SupabaseClient, itemId: string, status: string) {
        try {
            const { data, error } = await supabase
                .from('part_items')
                .update({ status })
                .eq('id', itemId)
                .select()
                .single()

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    }
}
