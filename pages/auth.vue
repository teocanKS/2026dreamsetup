<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Authentication</h1>
          <p class="text-gray-600 mt-2">Session setup for this app</p>
        </div>

        <div class="prose prose-gray max-w-none">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">How to Sign In</h2>
          
          <p class="text-gray-700 mb-4">
            This application has no login UI. To access your build data, create a Supabase session using one of these methods:
          </p>

          <ol class="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>Supabase Dashboard:</strong> Use the Supabase Authentication dashboard to create a magic link or test user.
            </li>
            <li>
              <strong>Magic Link:</strong> Have your Supabase project send a magic link email to your address, then click it to establish a session in this browser.
            </li>
            <li>
              <strong>External Auth:</strong> Set up an external authentication flow that creates a Supabase session.
            </li>
          </ol>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-900">
              Once you have a valid session, navigate to <strong>/app</strong> to access the dashboard.
            </p>
          </div>

          <div class="mt-6">
            <NuxtLink to="/app" class="text-primary-600 hover:text-primary-700 font-medium">
              → Go to Dashboard
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
