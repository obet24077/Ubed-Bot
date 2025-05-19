// ../scraper/lepton.js

import axios from 'axios';

// Fungsi untuk generate random rid
function generateRandomRid() {
    return Math.random().toString(36).substring(2, 15);
}

// Fungsi untuk mengirim query ke Lepton AI
export async function leptonLlm(query) {
    const url = 'https://search.lepton.run/api/query';
    const rid = generateRandomRid();

    const requestData = {
        query: query,
        rid: rid
    };

    try {
        const response = await axios.post(url, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Mengembalikan respons dari Lepton AI
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}