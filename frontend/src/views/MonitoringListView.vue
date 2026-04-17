<template>
  <div>
    <div class="d-flex align-center mb-4">
      <h1 class="text-h4 font-weight-bold">Monitoring Data</h1>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/monitoring/new">
        <v-icon start>mdi-plus</v-icon>
        New Entry
      </v-btn>
    </div>
    
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mb-2"
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :search="search"
        item-value="id"
      >
        <template v-slot:item.spiName="{ item }">
          <router-link :to="`/monitoring/${item.id}/edit`" class="text-primary font-weight-medium">
            {{ item.spiName }}
          </router-link>
        </template>
        
        <template v-slot:item.category="{ item }">
          <v-chip :color="getCategoryColor(item.category)" size="small">
            {{ item.category }}
          </v-chip>
        </template>
        
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small">
            {{ item.status }}
          </v-chip>
        </template>
        
        <template v-slot:item.priority="{ item }">
          <v-chip :color="getPriorityColor(item.priority)" size="small">
            {{ item.priority }}
          </v-chip>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-btn icon size="small" :to="`/monitoring/${item.id}/edit`">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="success" @click="downloadWord(item.id)">
            <v-icon>mdi-file-word</v-icon>
          </v-btn>
          <v-btn icon size="small" color="info" @click="downloadExcel(item.id)">
            <v-icon>mdi-microsoft-excel</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click="confirmDelete(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ itemToDelete?.spiName }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteItem" :loading="deleting">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllMonitoring, deleteMonitoring, generateWordDocument, generateExcelById, downloadBlob } from '@/services/api';

const items = ref([]);
const loading = ref(true);
const search = ref('');
const deleteDialog = ref(false);
const itemToDelete = ref(null);
const deleting = ref(false);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const headers = [
  { title: 'SPI Name', key: 'spiName', sortable: true },
  { title: 'Category', key: 'category', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Responsible', key: 'responsible', sortable: true },
  { title: 'Department', key: 'department', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
];

onMounted(async () => {
  await loadItems();
});

async function loadItems() {
  loading.value = true;
  try {
    items.value = await getAllMonitoring();
  } catch (err) {
    showSnackbar('Failed to load data', 'error');
  } finally {
    loading.value = false;
  }
}

function getCategoryColor(category) {
  const colors = {
    operational: 'primary',
    financial: 'success',
    compliance: 'warning',
    strategic: 'info'
  };
  return colors[category] || 'grey';
}

function getStatusColor(status) {
  const colors = {
    draft: 'grey',
    active: 'info',
    completed: 'success',
    archived: 'warning'
  };
  return colors[status] || 'grey';
}

function getPriorityColor(priority) {
  const colors = {
    low: 'grey',
    medium: 'info',
    high: 'warning',
    critical: 'error'
  };
  return colors[priority] || 'grey';
}

function confirmDelete(item) {
  itemToDelete.value = item;
  deleteDialog.value = true;
}

async function deleteItem() {
  if (!itemToDelete.value) return;
  
  deleting.value = true;
  try {
    await deleteMonitoring(itemToDelete.value.id);
    showSnackbar('Record deleted successfully', 'success');
    deleteDialog.value = false;
    await loadItems();
  } catch (err) {
    showSnackbar('Failed to delete record', 'error');
  } finally {
    deleting.value = false;
  }
}

async function downloadWord(id) {
  try {
    const blob = await generateWordDocument(id);
    downloadBlob(blob, `spi-report-${id}.docx`);
    showSnackbar('Word document generated', 'success');
  } catch (err) {
    showSnackbar('Failed to generate Word document', 'error');
  }
}

async function downloadExcel(id) {
  try {
    const blob = await generateExcelById(id);
    downloadBlob(blob, `spi-report-${id}.xlsx`);
    showSnackbar('Excel document generated', 'success');
  } catch (err) {
    showSnackbar('Failed to generate Excel document', 'error');
  }
}

function showSnackbar(message, color) {
  snackbar.value = { show: true, message, color };
}
</script>