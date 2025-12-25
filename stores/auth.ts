import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: false,
        initialized: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        hasSession: (state) => state.initialized && !!state.user
    },

    actions: {
        async initialize() {
            if (this.initialized) return

            const { $supabase } = useNuxtApp()
            try {
                const { data } = await $supabase.auth.getSession()
                this.user = data.session?.user ?? null

                $supabase.auth.onAuthStateChange((_event, session) => {
                    this.user = session?.user ?? null
                })
            } catch (error) {
                this.user = null
            }
            this.initialized = true
        }
    }
})
