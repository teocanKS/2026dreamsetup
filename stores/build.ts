import { defineStore } from 'pinia'

export const useBuildStore = defineStore('build', {
    state: () => ({
        selectedBuildId: null as string | null
    }),

    actions: {
        selectBuild(buildId: string) {
            this.selectedBuildId = buildId
        }
    }
})
