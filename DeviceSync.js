/* DeviceSync.js - Ponte Radio Privacy Drive v1.2 (Canale Globale) */
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/mlpkbaerv5kjtmj9gol8u6fkas17aejk';

window.DeviceSync = {
    initPC: function() {
        if(!window.twStructId) return;
        // Il PC ascolta il canale universale 'tablet'
        const syncRef = firebase.database().ref(`MASTER_ADMIN_DB/structures_data/${window.twStructId}/device_sync/tablet`);
        syncRef.on('value', snap => {
            const data = snap.val();
            if(data && data.status === 'completed') {
                if(typeof window.savePrivacyLink === 'function') window.savePrivacyLink(data.appId, data.date, data.driveLink);
                syncRef.remove();
                if(typeof showToast === 'function') showToast('✅ Privacy Firmata e Salvata su Drive!');
            }
        });
    },
    sendToMobile: function(appId, date) {
        if(!window.twStructId) return;
        // Il PC invia sempre al canale universale 'tablet'
        firebase.database().ref(`MASTER_ADMIN_DB/structures_data/${window.twStructId}/device_sync/tablet`).set({ 
            status: 'pending', 
            appId: appId, 
            date: date, 
            timestamp: Date.now() 
        });
        if(typeof showToast === 'function') showToast('Inviato al Tablet... In attesa di firma');
    }
};

document.addEventListener('DOMContentLoaded', () => { 
    // Avvia l'ascolto sul PC con un leggero ritardo per dare tempo al login di caricare l'ID
    if(!window.location.href.toLowerCase().includes('mobile.html') && !window.location.href.toLowerCase().includes('firma.html')) {
        setTimeout(() => { window.DeviceSync.initPC(); }, 1500);
    }
});