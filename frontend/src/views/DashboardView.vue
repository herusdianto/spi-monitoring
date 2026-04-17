<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-4">Dashboard</h1>
    
    <v-row class="mb-4">
      <v-col cols="6" md="3">
        <v-card color="primary" class="pa-4 text-center">
          <v-icon size="32" color="white" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.total || 0 }}</div>
          <div class="text-caption">Total</div>
        </v-card>
      </v-col>
      
      <v-col cols="6" md="3">
        <v-card color="success" class="pa-4 text-center">
          <v-icon size="32" color="white" class="mb-2">mdi-check</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.byStatus?.completed || 0 }}</div>
          <div class="text-caption">Completed</div>
        </v-card>
      </v-col>
      
      <v-col cols="6" md="3">
        <v-card color="warning" class="pa-4 text-center">
          <v-icon size="32" color="white" class="mb-2">mdi-clock</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.byStatus?.active || 0 }}</div>
          <div class="text-caption">Active</div>
        </v-card>
      </v-col>
      
      <v-col cols="6" md="3">
        <v-card color="info" class="pa-4 text-center">
          <v-icon size="32" color="white" class="mb-2">mdi-file-outline</v-icon>
          <div class="text-h4 font-weight-bold">{{ stats.byStatus?.draft || 0 }}</div>
          <div class="text-caption">Draft</div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Status</v-card-title>
          <v-card-text>
            <div v-for="(count, status) in stats.byStatus" :key="status" class="d-flex align-center mb-3">
              <v-chip :color="getStatusColor(status)" size="small" class="mr-2">{{ status }}</v-chip>
              <v-progress-linear
                :model-value="(count / (stats.total || 1)) * 100"
                :color="getStatusColor(status)"
                height="8"
                rounded
              ></v-progress-linear>
              <span class="ml-2 text-body-2">{{ count }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Category</v-card-title>
          <v-card-text>
            <div v-for="(count, category) in stats.byCategory" :key="category" class="d-flex align-center mb-3">
              <v-chip :color="getCategoryColor(category)" size="small" class="mr-2">{{ category }}</v-chip>
              <v-progress-linear
                :model-value="(count / (stats.total || 1)) * 100"
                :color="getCategoryColor(category)"
                height="8"
                rounded
              ></v-progress-linear>
              <span class="ml-2 text-body-2">{{ count }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-text class="d-flex ga-2">
            <v-btn color="primary" to="/monitoring/new">
              <v-icon start>mdi-plus</v-icon>
              New
            </v-btn>
            <v-btn color="success" @click="exportExcel" :loading="exporting">
              <v-icon start>mdi-download</v-icon>
              Export
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMonitoringStats, generateExcelDocument, downloadBlob } from '@/services/api';

const stats = ref({});
const exporting = ref(false);

onMounted(async () => {
  try {
    stats.value = await getMonitoringStats();
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
});

function getStatusColor(status) {
  const colors = { draft: 'grey', active: 'warning', completed: 'success', archived: 'info' };
  return colors[status] || 'grey';
}

function getCategoryColor(category) {
  const colors = { operational: 'primary', financial: 'success', compliance: 'warning', strategic: 'info' };
  return colors[category] || 'grey';
}

async function exportExcel() {
  exporting.value = true;
  try {
    const blob = await generateExcelDocument();
    downloadBlob(blob, `spi-data-${Date.now()}.xlsx`);
  } catch (err) {
    console.error('Failed to export Excel:', err);
  } finally {
    exporting.value = false;
  }
}
</script>