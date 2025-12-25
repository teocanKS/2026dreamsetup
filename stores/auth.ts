import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user
    },

    actions: {
        async initialize() {
            const { $supabase } = useNuxtApp()
            const { data } = await $supabase.auth.getSession()
            this.user = data.session?.user ?? null

            $supabase.auth.onAuthStateChange((_event, session) => {
                this.user = session?.user ?? null
            })
        },

        async login(email: string, password: string) {
            this.loading = true
            const { $supabase } = useNuxtApp()
            const { data, error } = await $supabase.auth.signInWithPassword({
                email,
                password
            })
            this.loading = false

            if (error) return { error }
            this.user = data.user
            return { data, error: null }
        },

        async register(email: string, password: string) {
            this.loading = true
            const { $supabase } = useNuxtApp()
            const { data, error } = await $supabase.auth.signUp({
                email,
                password
            })
            this.loading = false

            if (error) return { error }
            this.user = data.user
            return { data, error: null }
        },

        async logout() {
            const { $supabase } = useNuxtApp()
            await $supabase.auth.signOut()
            this.user = null
            navigateTo('/login')
        }
    }
})
