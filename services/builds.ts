import type { SupabaseClient } from '@supabase/supabase-js'

export const buildsService = {
    async fetchBuilds(supabase: SupabaseClient) {
        try {
            const { data, error } = await supabase
                .from('v_build_dashboard')
                .select('*')

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    },

    async createBuild(supabase: SupabaseClient, name: string, budget: number, userId: string) {
        try {
            const { data, error } = await supabase
                .from('builds')
                .insert({ name, budget, user_id: userId })
                .select()
                .single()

            return { data, error }
        } catch (error) {
            return { data: null, error }
        }
    }
}
