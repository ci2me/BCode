const {
    saveSolidDatasetAt,
    getSolidDataset
} = require("@inrupt/solid-client");
const membersList = process.env.MEMBER_LIST
const thirdPartiesList = process.env.THIRDPARTY_LIST
const adminsList = process.env.ADMIN_LIST
const requestsList = process.env.REQUESTS
const offersList = process.env.OFFERS
const agreementsList = process.env.AGREEMENTS

async function getGivenSolidDataset(datasetURL, session) {
    return await getSolidDataset(datasetURL, { fetch: session.fetch, headers: { Accept: 'text/turtle' } }); //
}

async function saveGivenSolidDataset(datasetURL, courseSolidDataset, session) {
    await saveSolidDatasetAt(
        datasetURL,
        courseSolidDataset,
        { fetch: session.fetch, headers: { Accept: 'text/turtle' } }
    );
}

function getDatasetUrl(userType) {
    let datasetURL;
    switch (userType) {
        case 'MEMBER':
            datasetURL = membersList;
            break;
        case 'THIRDPARTY':
            datasetURL = thirdPartiesList;
            break;
        case 'ADMIN':
            datasetURL = adminsList;
            break;
        case 'Request':
            datasetURL = requestsList;
            break;
        case 'Offer':
            datasetURL = offersList;
            break;
        case 'Agreement':
            datasetURL = agreementsList;
            break;
    }
    return datasetURL;
}

function extractTerm(URL) {
    const hashIndex = URL.lastIndexOf("#");
    const extractedValue = URL.substring(hashIndex + 1);
    return extractedValue;
}

function getPolicyDataset(policyURL) {
    const segments = policyURL.split("/");
    const filename = segments[segments.length - 1];
    const policyType = filename.split(".")[0];
    let type
    switch (policyType) {
        case 'offers':
            type = offersList;
            break;
        case 'requests':
            type = requestsList;
            break;
    }
    return type;
}


module.exports = { getGivenSolidDataset, saveGivenSolidDataset, getDatasetUrl, extractTerm, getPolicyDataset };