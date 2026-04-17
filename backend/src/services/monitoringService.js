const { getFirestore } = require('../config/firebase');

const COLLECTION_NAME = 'monitoring';

class MonitoringService {
  async create(userId, data) {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc();
    
    const documentData = {
      ...data,
      id: docRef.id,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await docRef.set(documentData);
    return documentData;
  }

  async getById(id, userId) {
    const db = getFirestore();
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data();
    if (data.userId !== userId) {
      return null;
    }
    
    return { id: doc.id, ...data };
  }

  async getAll(userId, options = {}) {
    const db = getFirestore();
    const { limit = 50, offset = 0, status, category } = options;
    
    let query = db.collection(COLLECTION_NAME).where('userId', '==', userId);
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.limit(limit).offset(offset).get();
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  }

  async update(id, userId, data) {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    const existingData = doc.data();
    if (existingData.userId !== userId) {
      return null;
    }
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await docRef.update(updateData);
    
    const updatedDoc = await docRef.get();
    return { id: doc.id, ...updatedDoc.data() };
  }

  async delete(id, userId) {
    const db = getFirestore();
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return false;
    }
    
    const data = doc.data();
    if (data.userId !== userId) {
      return false;
    }
    
    await docRef.delete();
    return true;
  }

  async getStats(userId) {
    const db = getFirestore();
    const snapshot = await db.collection(COLLECTION_NAME).where('userId', '==', userId).get();
    
    const stats = {
      total: 0,
      byStatus: {},
      byCategory: {},
      byPriority: {}
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      stats.total++;
      
      stats.byStatus[data.status] = (stats.byStatus[data.status] || 0) + 1;
      stats.byCategory[data.category] = (stats.byCategory[data.category] || 0) + 1;
      stats.byPriority[data.priority] = (stats.byPriority[data.priority] || 0) + 1;
    });
    
    return stats;
  }
}

module.exports = new MonitoringService();