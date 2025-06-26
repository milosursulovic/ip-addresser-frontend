<template>
  <div class="p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <h1 class="text-2xl font-bold">IP Adrese</h1>
      <div class="flex flex-wrap gap-2">
        <button @click="addEntry" class="bg-green-600 text-white px-4 py-2 rounded">Dodaj</button>
        <button @click="exportToCsv" class="bg-blue-600 text-white px-4 py-2 rounded">
          Izvezi CSV
        </button>
        <LogoutButton />
      </div>
    </div>

    <!-- Search and Pagination Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <input
        v-model="search"
        @input="page = 1"
        type="text"
        placeholder="Pretraga..."
        class="border px-3 py-1 rounded w-full sm:w-1/2"
      />

      <div class="flex items-center gap-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          ←
        </button>
        <span>Strana {{ isThereAnyPages() }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page * limit >= total"
          class="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>

    <!-- Table Wrapper -->
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 text-left">
        <thead class="bg-gray-200 text-sm sm:text-base">
          <tr>
            <th class="p-2 cursor-pointer whitespace-nowrap" @click="toggleSort('ip')">
              IP adresa
              <span v-if="sortBy === 'ip'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="p-2 cursor-pointer whitespace-nowrap" @click="toggleSort('computerName')">
              Ime računara
              <span v-if="sortBy === 'computerName'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="p-2 cursor-pointer whitespace-nowrap" @click="toggleSort('username')">
              Korisničko ime
              <span v-if="sortBy === 'username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="p-2 cursor-pointer whitespace-nowrap" @click="toggleSort('fullName')">
              Puno ime
              <span v-if="sortBy === 'fullName'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="p-2 whitespace-nowrap">Lozinka</th>
            <th class="p-2 cursor-pointer whitespace-nowrap" @click="toggleSort('rdp')">
              RDP
              <span v-if="sortBy === 'rdp'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th class="p-2 whitespace-nowrap">Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in entries" :key="entry._id" class="border-t text-sm sm:text-base">
            <td class="p-2">{{ entry.ip }}</td>
            <td class="p-2">{{ entry.computerName }}</td>
            <td class="p-2">{{ entry.username }}</td>
            <td class="p-2">{{ entry.fullName }}</td>
            <td class="p-2">{{ entry.password }}</td>
            <td class="p-2">{{ entry.rdp }}</td>
            <td class="p-2 space-x-2 whitespace-nowrap">
              <button @click="editEntry(entry)" class="text-blue-600 hover:underline">
                Izmeni
              </button>
              <button @click="deleteEntry(entry._id)" class="text-red-600 hover:underline">
                Obriši
              </button>
              <button @click="generateRdpFile(entry)" class="text-green-600 hover:underline">
                RDP
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue'
import { fetchWithAuth } from '@/utils/fetchWithAuth.js'
import { useRoute, useRouter } from 'vue-router'
import LogoutButton from '@/components/LogoutButton.vue'

const route = useRoute()
const router = useRouter()

const entries = ref([])
const total = ref(0)
const totalPages = ref(0)
const page = ref(parseInt(route.query.page) || 1)
const limit = ref(parseInt(route.query.limit) || 10)
const search = ref(route.query.search || '')
const sortBy = ref(route.query.sortBy || 'ip')
const sortOrder = ref(route.query.sortOrder || 'asc')

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
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    })

    const res = await fetchWithAuth(`/api/protected/ip-addresses?${params.toString()}`)
    if (!res.ok) throw new Error('Fetch failed')

    const data = await res.json()
    entries.value = data.entries
    total.value = data.total
    totalPages.value = data.totalPages
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

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
}

const isThereAnyPages = () => {
  return totalPages.value === 0 ? '0' : page.value
}

const generateRdpFile = (entry) => {
  const rdpContent = `
    full address:s:${entry.ip}
    username:s:${entry.username}
    prompt for credentials:i:1
    authentication level:i:2
    redirectclipboard:i:1
    redirectprinters:i:0
    redirectcomports:i:0
    redirectsmartcards:i:0
  `.trim()

  const blob = new Blob([rdpContent], { type: 'application/x-rdp' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${entry.computerName || entry.ip}.rdp`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

const exportToCsv = async () => {
  try {
    const params = new URLSearchParams({ search: search.value })
    const res = await fetchWithAuth(`/api/protected/ip-addresses/export?${params.toString()}`)
    if (!res.ok) throw new Error('Export failed')

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ip-entries.csv'
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Neuspešan izvoz:', err)
  }
}

watch([page, limit, search, sortBy, sortOrder], () => {
  router.push({
    query: {
      page: page.value,
      limit: limit.value,
      search: search.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    },
  })
})

watch(
  () => route.query,
  (query) => {
    page.value = parseInt(query.page) || 1
    limit.value = parseInt(query.limit) || 10
    search.value = query.search || ''
    sortBy.value = query.sortBy || 'ip'
    sortOrder.value = query.sortOrder || 'asc'
    fetchData()
  },
  { immediate: true }
)
</script>
