<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">IP Adrese</h1>
      <div class="space-x-2">
        <button @click="addEntry" class="bg-green-600 text-white px-4 py-2 rounded">Dodaj</button>
        <LogoutButton />
      </div>
    </div>

    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        @input="page = 1"
        type="text"
        placeholder="Pretraga..."
        class="border px-3 py-1 rounded w-1/3"
      />

      <div class="space-x-2">
        <button @click="prevPage" :disabled="page === 1" class="px-2 py-1 bg-gray-300 rounded">
          ←
        </button>
        <span>Strana {{ page }}</span>
        <button
          @click="nextPage"
          :disabled="page * limit >= total"
          class="px-2 py-1 bg-gray-300 rounded"
        >
          →
        </button>
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
import { ref, watch, onMounted } from 'vue'
import { fetchWithAuth } from '@/utils/fetchWithAuth.js'
import { useRouter } from 'vue-router'
import LogoutButton from '@/components/LogoutButton.vue'

const entries = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(10)
const search = ref('')
const router = useRouter()

const nextPage = () => {
  if (page.value * limit.value < total.value) {
    page.value++
    fetchData()
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchData()
  }
}

const fetchData = async () => {
  try {
    const params = new URLSearchParams({
      page: page.value,
      limit: limit.value,
      search: search.value,
    })
    const res = await fetchWithAuth(`/api/protected/ip-addresses?${params.toString()}`)
    if (!res.ok) throw new Error('Fetch failed')

    const data = await res.json()
    entries.value = data.entries
    total.value = data.total
  } catch (err) {
    console.error('Neuspešno:', err)
  }
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

watch([page, search], fetchData)
onMounted(fetchData)
</script>
