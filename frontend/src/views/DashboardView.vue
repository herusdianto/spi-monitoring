<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-4">Dashboard</h1>
    
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card color="primary" class="pa-4">
          <div class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-chart-line</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.total || 0 }}</div>
              <div class="text-subtitle-2">Total Records</div>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="success" class="pa-4">
          <div class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-check-circle</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.byStatus?.completed || 0 }}</div>
              <div class="text-subtitle-2">Completed</div>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="warning" class="pa-4">
          <div class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-clock-outline</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.byStatus?.active || 0 }}</div>
              <div class="text-subtitle-2">Active</div>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="info" class="pa-4">
          <div class="d-flex align-center">
            <v-icon size="48" color="white" class="mr-4">mdi-file-document</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.byStatus?.draft || 0 }}</div>
              <div class="text-subtitle-2">Draft</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Status Distribution</v-card-title>
          <v-card-text>
            <div v-for="(count, status) in stats.byStatus" :key="status" class="d-flex align-center mb-2">
              <v-chip :color="getStatusColor(status)" class="mr-2">{{ status }}</v-chip>
              <v-progress-linear
                :model-value="(count / (stats.total || 1)) * 100"
                :color="getStatusColor(status)"
                height="20"
                rounded
              ></v-progress-linear>
              <span class="ml-2 font-weight-bold">{{ count }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Category Distribution</v-card-title>
          <v-card-text>
            <div v-for="(count, category) in stats.byCategory" :key="category" class="d-flex align-center mb-2">
              <v-chip :color="getCategoryColor(category)" class="mr-2">{{ category }}</v-chip>
              <v-progress-linear
                :model-value="(count / (stats.total || 1)) * 100"
                :color="getCategoryColor(category)"
                height="20"
                rounded
              ></v-progress-linear>
              <span class="ml-2 font-weight-bold">{{ count }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-file-export</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-btn color="primary" to="/monitoring/new" class="mr-2">
              <v-icon start>mdi-plus</v-icon>
              New Entry
            </v-btn>
            <v-btn color="success" @click="exportExcel" :loading="exporting">
              <v-icon start>mdi-microsoft-excel</v-icon>
              Export Excel
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
  const colors = {
    draft: 'grey',
    active: 'info',
    completed: 'success',
    archived: 'warning'
  };
  return colors[status] || 'grey';
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