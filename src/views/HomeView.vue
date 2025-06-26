<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">IP Adrese</h1>
      <div class="space-x-2">
        <button @click="addEntry" class="bg-green-600 text-white px-4 py-2 rounded">Dodaj</button>
        <LogoutButton />
      </div>
    </div>

    <table class="w-full border border-gray-300 text-left">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2">IP adresa</th>
          <th class="p-2">Ime računara</th>
          <th class="p-2">Korisničko ime</th>
          <th class="p-2">Puno ime</th>
          <th class="p-2">Lozinka</th>
          <th class="p-2">RDP</th>
          <th class="p-2">Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry._id" class="border-t">
          <td class="p-2">{{ entry.ip }}</td>
          <td class="p-2">{{ entry.computerName }}</td>
          <td class="p-2">{{ entry.username }}</td>
          <td class="p-2">{{ entry.fullName }}</td>
          <td class="p-2">{{ entry.password }}</td>
          <td class="p-2">{{ entry.rdp }}</td>
          <td class="p-2 space-x-2">
            <button @click="editEntry(entry)" class="text-blue-600 hover:underline">Izmeni</button>
            <button @click="deleteEntry(entry._id)" class="text-red-600 hover:underline">
              Obriši
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWithAuth } from '@/utils/fetchWithAuth.js'
import { useRouter } from 'vue-router'
import LogoutButton from '@/components/LogoutButton.vue'

const router = useRouter()

const entries = ref([])

const fetchData = async () => {
  try {
    const res = await fetchWithAuth('/api/protected/ip-addresses')
    if (!res.ok) throw new Error('Fetch failed')
    entries.value = await res.json()
  } catch (err) {
    console.error('Neuspešno:', err)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const addEntry = () => {
  router.push('/add')
}

const editEntry = (entry) => {
  router.push(`/edit/${entry._id}`)
}

const deleteEntry = async (id) => {
  if (confirm('Da li si siguran da želiš da obrišeš ovaj unos?')) {
    try {
      const res = await fetchWithAuth(`/api/protected/ip-addresses/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Neuspešno brisanje')
      fetchData()
    } catch (err) {
      console.error('Neuspešno brisanje:', err)
    }
  }
}

onMounted(fetchData)
</script>
