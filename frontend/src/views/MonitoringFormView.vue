<template>
  <div>
    <h1 class="text-h4 font-weight-bold mb-4">
      {{ isEditMode ? 'Edit' : 'New' }} Monitoring Entry
    </h1>
    
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Basic Information</v-card-title>
            
            <v-text-field
              v-model="form.spiName"
              label="SPI Name"
              :rules="[rules.required, rules.minLength(3)]"
              counter="100"
            ></v-text-field>
            
            <v-textarea
              v-model="form.description"
              label="Description"
              rows="3"
              counter="500"
            ></v-textarea>
            
            <v-select
              v-model="form.category"
              label="Category"
              :items="categories"
              :rules="[rules.required]"
            ></v-select>
            
            <v-select
              v-model="form.status"
              label="Status"
              :items="statuses"
            ></v-select>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Details</v-card-title>
            
            <v-select
              v-model="form.priority"
              label="Priority"
              :items="priorities"
            ></v-select>
            
            <v-text-field
              v-model="form.responsible"
              label="Responsible Person"
              :rules="[rules.required, rules.minLength(3)]"
            ></v-text-field>
            
            <v-text-field
              v-model="form.department"
              label="Department"
              :rules="[rules.required]"
            ></v-text-field>
            
            <v-text-field
              v-model="form.startDate"
              label="Start Date"
              type="date"
              :rules="[rules.required]"
            ></v-text-field>
            
            <v-text-field
              v-model="form.endDate"
              label="End Date"
              type="date"
            ></v-text-field>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Metrics (Optional)</v-card-title>
            
            <v-text-field
              v-model.number="form.metrics.target"
              label="Target Value"
              type="number"
            ></v-text-field>
            
            <v-text-field
              v-model.number="form.metrics.current"
              label="Current Value"
              type="number"
            ></v-text-field>
            
            <v-text-field
              v-model="form.metrics.unit"
              label="Unit"
            ></v-text-field>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <v-card-title>Notes</v-card-title>
            
            <v-textarea
              v-model="form.notes"
              label="Additional Notes"
              rows="8"
              counter="1000"
            ></v-textarea>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="saving"
            class="mr-2"
          >
            <v-icon start>mdi-content-save</v-icon>
            Save
          </v-btn>
          
          <v-btn
            variant="outlined"
            size="large"
            @click="cancel"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { createMonitoring, updateMonitoring, getMonitoring } from '@/services/api';

const router = useRouter();
const route = useRoute();

const form = ref({
  spiName: '',
  description: '',
  category: 'operational',
  status: 'draft',
  priority: 'medium',
  responsible: '',
  department: '',
  startDate: '',
  endDate: '',
  metrics: {
    target: null,
    current: null,
    unit: ''
  },
  notes: ''
});

const valid = ref(false);
const saving = ref(false);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const isEditMode = computed(() => !!route.params.id);

const categories = ['operational', 'financial', 'compliance', 'strategic'];
const statuses = ['draft', 'active', 'completed', 'archived'];
const priorities = ['low', 'medium', 'high', 'critical'];

const rules = {
  required: v => !!v || 'This field is required',
  minLength: len => v => (v && v.length >= len) || `Minimum ${len} characters required`
};

onMounted(async () => {
  if (isEditMode.value) {
    await loadData();
  }
});

async function loadData() {
  try {
    const data = await getMonitoring(route.params.id);
    form.value = {
      ...data,
      metrics: data.metrics || { target: null, current: null, unit: '' }
    };
  } catch (err) {
    showSnackbar('Failed to load data', 'error');
  }
}

async function submit() {
  const { valid: isValid } = await form.value.validate();
  
  if (!isValid) return;
  
  saving.value = true;
  
  try {
    const payload = {
      ...form.value,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null
    };
    
    if (isEditMode.value) {
      await updateMonitoring(route.params.id, payload);
      showSnackbar('Record updated successfully', 'success');
    } else {
      await createMonitoring(payload);
      showSnackbar('Record created successfully', 'success');
    }
    
    setTimeout(() => router.push('/monitoring'), 1000);
  } catch (err) {
    showSnackbar('Failed to save record', 'error');
  } finally {
    saving.value = false;
  }
}

function cancel() {
  router.back();
}

function showSnackbar(message, color) {
  snackbar.value = { show: true, message, color };
}
</script>