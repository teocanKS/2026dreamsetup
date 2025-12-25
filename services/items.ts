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
                .order('priority', { ascending: false })
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Supabase fetch error:', error)
                return { data: null, error }
            }

            const enrichedData = data?.map(item => {
                const displayPrice = item.target_price || item.estimated_price || 0
                return {
                    ...item,
                    target_price: displayPrice
                }
            })

            return { data: enrichedData, error: null }
        } catch (error) {
            console.error('Items service exception:', error)
            return { data: null, error }
        }
    },

    async updateItemStatus(supabase: SupabaseClient, itemId: string, status: string, buildId: string) {
        try {
            const { data, error } = await supabase
                .from('part_items')
                .update({ status })
                .eq('id', itemId)
                .select()
                .single()

            if (error) return { data, error }

            if (status !== 'bought') {
                const { error: deleteError } = await supabase
                    .from('purchases')
                    .delete()
                    .eq('part_item_id', itemId)

                if (deleteError) {
                    console.error('Purchase cleanup error:', deleteError)
                }

                const { error: updateError } = await supabase.rpc('recalculate_build_spent', {
                    p_build_id: buildId
                }).single()

                if (updateError) {
                    console.error('Recalculate error (RPC may not exist):', updateError)
                }
            }

            return { data, error: null }
        } catch (error) {
            console.error('Status update error:', error)
            return { data: null, error }
        }
    }
}
