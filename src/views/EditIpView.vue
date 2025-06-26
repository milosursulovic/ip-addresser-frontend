<template>
  <div class="max-w-xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Izmeni IP Unos</h1>
      <LogoutButton />
    </div>

    <form @submit.prevent="handleUpdate" class="space-y-4">
      <div v-for="field in fields" :key="field.name">
        <label :for="field.name" class="block text-sm font-medium text-gray-700 mb-1">{{
          field.label
        }}</label>
        <input
          :id="field.name"
          v-model="form[field.name]"
          type="text"
          class="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex justify-between">
        <button type="button" @click="goBack" class="bg-gray-400 text-white px-4 py-2 rounded">
          Poništi
        </button>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Izmeni unos</button>
      </div>
    </form>

    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/fetchWithAuth'
import LogoutButton from '@/components/LogoutButton.vue'

const route = useRoute()
const router = useRouter()
const error = ref('')
const form = ref({
  ip: '',
  computerName: '',
  username: '',
  fullName: '',
  password: '',
  rdp: '',
})

const fields = [
  { name: 'ip', label: 'IP Adresa' },
  { name: 'computerName', label: 'Ime računara' },
  { name: 'username', label: 'Korisničko ime' },
  { name: 'fullName', label: 'Puno ime' },
  { name: 'password', label: 'Lozinka' },
  { name: 'rdp', label: 'RDP' },
]

const fetchEntry = async () => {
  try {
    const res = await fetchWithAuth(`/api/protected/ip-addresses`)
    const data = await res.json()
    const found = data.find((e) => e._id === route.params.id)
    if (!found) {
      error.value = 'Unos nije pronađen'
      return
    }
    form.value = found
  } catch (err) {
    console.error(err)
    error.value = 'Neuspešno učitan unos'
  }
}

const handleUpdate = async () => {
  try {
    const res = await fetchWithAuth(`/api/protected/ip-addresses/${route.params.id}`, {
      method: 'PUT',
      body: JSON.stringify(form.value),
    })

    if (!res.ok) {
      const err = await res.json()
      error.value = err.message || 'Izmena neuspešna'
      return
    }

    router.push('/')
  } catch (err) {
    console.error(err)
    error.value = 'Greška na serveru'
  }
}

const goBack = () => router.push('/')

onMounted(fetchEntry)
</script>
