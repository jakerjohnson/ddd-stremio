require('dotenv').config();
require('dotenv').config();
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const axios = require("axios");

// --- CONFIGURATION ---
const { DDD_API_KEY } = process.env;

// Validate that the API key is available
if (!DDD_API_KEY) {
    console.error('ERROR: API key for DDD is missing.');
    console.error('Please create a .env file and add a DDD_API_KEY variable.');
    process.exit(1); // Exit the process with an error code
}

const manifest = {
    "id": "jj.does.the.dog.die.stream",
    "version": "3.1.0", // Only shows "Yes" streams
    "name": "Does the Dog Die?",
    "description": "Adds a stream for each topic from Does the Dog Die? that occurs in a movie or show.",
    "resources": ["stream"],
    "types": ["movie", "series"],
    "idPrefixes": ["tt"],
    "catalogs": []
};

// --- ADDON SETUP ---
const builder = new addonBuilder(manifest);

const dddApi = axios.create({
    baseURL: 'https://www.doesthedogdie.com',
    headers: {
        'Accept': 'application/json',
        'X-API-Key': DDD_API_KEY
    }
});

builder.defineStreamHandler(async (args) => {
    console.log(`[STREAM HANDLER] Received request for ${args.type} ${args.id}`);

    if (!args.id || !args.id.startsWith('tt')) {
        return { streams: [] };
    }

    try {
        // --- Step 1: Get the title from Cinemeta ---
        console.log(`[Cinemeta] Fetching metadata for ${args.type} ${args.id}`);
        const cinemetaUrl = `https://v3-cinemeta.strem.io/meta/${args.type}/${args.id}.json`;
        const cinemetaResponse = await axios.get(cinemetaUrl);
        const meta = cinemetaResponse.data.meta;

        if (!meta || !meta.name) {
            console.log(`[Cinemeta] No metadata or title found for ${args.id}`);
            return { streams: [] };
        }
        const title = meta.name;
        console.log(`[Cinemeta] Found title: "${title}"`);

        // --- Step 2: Search DDD using the title ---
        console.log(`[DDD] Searching for: "${title}"`);
        const dddSearchResponse = await dddApi.get(`/dddsearch?q=${encodeURIComponent(title)}`);

        const dddItem = dddSearchResponse.data.items[0];

        if (!dddItem || dddItem.name.toLowerCase() !== title.toLowerCase()) {
            console.log(`[DDD] No exact match found for "${title}".`);
            return { streams: [] };
        }
        console.log(`[DDD] Found item: "${dddItem.name}" with ID: ${dddItem.id}`);

        // --- Step 3: Get the detailed topic stats from DDD ---
        const dddDetailsResponse = await dddApi.get(`/media/${dddItem.id}`);
        const topicStats = dddDetailsResponse.data && dddDetailsResponse.data.topicItemStats;

        if (!topicStats || !Array.isArray(topicStats)) {
            console.log(`[DDD] No topic stats found for "${dddItem.name}".`);
            return { streams: [] };
        }

        // --- Step 4: Create a stream only for topics that have a "Yes" result ---
        const streams = topicStats
            .filter(stat => stat.yesSum > stat.noSum)
            .map(stat => {
                return {
                    name: stat.topic.name,
                    title: `⚠️ Yes`,
                    externalUrl: `https://www.doesthedogdie.com/media/${dddItem.id}`
                };
            });

        console.log(`[STREAM HANDLER] Created ${streams.length} streams for "${dddItem.name}".`);
        
        return { streams };

    } catch (error) {
        console.error('An error occurred in the stream handler:', error.message);
        return { streams: [] };
    }
});

// --- START THE ADDON SERVER ---
const addonInterface = builder.getInterface();
const PORT = process.env.PORT || 7001;

serveHTTP(addonInterface, { port: PORT }).then(({ url }) => {
    console.log(`Addon listening on ${url}`);
    console.log('Install this addon by copying and pasting the URL into the Stremio search bar.');
});

const axios = require("axios");

// --- CONFIGURATION ---
const { DDD_API_KEY } = process.env;

// Validate that the API key is available
if (!DDD_API_KEY) {
    console.error('ERROR: API key for DDD is missing.');
    console.error('Please create a .env file and add a DDD_API_KEY variable.');
    process.exit(1); // Exit the process with an error code
}

const manifest = {
    "id": "jj.does.the.dog.die.stream",
    "version": "3.1.0", // Only shows "Yes" streams
    "name": "Does the Dog Die?",
    "description": "Adds a stream for each topic from Does the Dog Die? that occurs in a movie or show.",
    "resources": ["stream"],
    "types": ["movie", "series"],
    "idPrefixes": ["tt"],
    "catalogs": []
};

// --- ADDON SETUP ---
const builder = new addonBuilder(manifest);

const dddApi = axios.create({
    baseURL: 'https://www.doesthedogdie.com',
    headers: {
        'Accept': 'application/json',
        'X-API-Key': DDD_API_KEY
    }
});

builder.defineStreamHandler(async (args) => {
    console.log(`[STREAM HANDLER] Received request for ${args.type} ${args.id}`);

    if (!args.id || !args.id.startsWith('tt')) {
        return { streams: [] };
    }

    try {
        // --- Step 1: Get the title from Cinemeta ---
        console.log(`[Cinemeta] Fetching metadata for ${args.type} ${args.id}`);
        const cinemetaUrl = `https://v3-cinemeta.strem.io/meta/${args.type}/${args.id}.json`;
        const cinemetaResponse = await axios.get(cinemetaUrl);
        const meta = cinemetaResponse.data.meta;

        if (!meta || !meta.name) {
            console.log(`[Cinemeta] No metadata or title found for ${args.id}`);
            return { streams: [] };
        }
        const title = meta.name;
        console.log(`[Cinemeta] Found title: "${title}"`);

        // --- Step 2: Search DDD using the title ---
        console.log(`[DDD] Searching for: "${title}"`);
        const dddSearchResponse = await dddApi.get(`/dddsearch?q=${encodeURIComponent(title)}`);

        const dddItem = dddSearchResponse.data.items[0];

        if (!dddItem || dddItem.name.toLowerCase() !== title.toLowerCase()) {
            console.log(`[DDD] No exact match found for "${title}".`);
            return { streams: [] };
        }
        console.log(`[DDD] Found item: "${dddItem.name}" with ID: ${dddItem.id}`);

        // --- Step 3: Get the detailed topic stats from DDD ---
        const dddDetailsResponse = await dddApi.get(`/media/${dddItem.id}`);
        const topicStats = dddDetailsResponse.data && dddDetailsResponse.data.topicItemStats;

        if (!topicStats || !Array.isArray(topicStats)) {
            console.log(`[DDD] No topic stats found for "${dddItem.name}".`);
            return { streams: [] };
        }

        // --- Step 4: Create a stream only for topics that have a "Yes" result ---
        const streams = topicStats
            .filter(stat => stat.yesSum > stat.noSum)
            .map(stat => {
                return {
                    name: stat.topic.name,
                    title: `⚠️ Yes`,
                    externalUrl: `https://www.doesthedogdie.com/media/${dddItem.id}`
                };
            });

        console.log(`[STREAM HANDLER] Created ${streams.length} streams for "${dddItem.name}".`);
        
        return { streams };

    } catch (error) {
        console.error('An error occurred in the stream handler:', error.message);
        return { streams: [] };
    }
});

// --- START THE ADDON SERVER ---
const addonInterface = builder.getInterface();
const PORT = 7001;

serveHTTP(addonInterface, { port: PORT }).then(({ url }) => {
    console.log(`Addon listening on ${url}`);
    console.log('Install this addon by copying and pasting the URL into the Stremio search bar.');
});
