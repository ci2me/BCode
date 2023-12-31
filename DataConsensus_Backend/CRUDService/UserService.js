require("dotenv").config();
const fs = require('fs');
const {
    buildThing,
    createThing,
    setThing,
    setStringNoLocale,
    setUrl,
    getUrl,
    getThing,
    getThingAll,
    removeThing,
    getFile,
    overwriteFile,
    removeUrl,
    isRawData,
    getContentType,
    getSourceUrl
} = require("@inrupt/solid-client");
const { getSessionFromStorage, getSessionIdFromStorageAll } = require("@inrupt/solid-client-authn-node");
const { RDF, FOAF, DCTERMS } = require("@inrupt/vocab-common-rdf");
const Transformer = require("../Logic/Transformer.js");
const { getGivenSolidDataset, saveGivenSolidDataset, getDatasetUrl } = require("../HelperFunctions.js");

const user = process.env.USER;
const dpv = process.env.DPV;
const agreementsList = process.env.AGREEMENTS;
const membersList = process.env.MEMBER_LIST;
const thirdPartiesList = process.env.THIRDPARTY_LIST;
const adminsList = process.env.ADMIN_LIST;
const resourceURL = process.env.RESOURCE_URL;

module.exports = {

    /* USER RELATED FUNCTIONS */

    checkUser: async function (webID, session) {
        const userTypes = ["MEMBER", "THIRDPARTY", "ADMIN"];
        let isUser = false;
        let type;
        for (const userType of userTypes) {
            isUser = await this.checkUserByType({ type: userType, webID }, session);
            if (isUser) {
                type = userType;
                break;
            }
        }
        return { isUser, type };
    },

    checkUserByType: async function (req, session) {
        const datasetURL = getDatasetUrl(req.type);

        const solidDataset = await getGivenSolidDataset(datasetURL, session);
        const user = getThing(solidDataset, req.webID);

        if (user) {
            return true;
        }
        return false;
    },

    addMember: async function (req, session) {

        let solidDataset = await getGivenSolidDataset(membersList, session);

        const newMember = buildThing(createThing({ url: req.body.webID }))
            .addUrl(RDF.type, `${user}#User`)
            .addStringNoLocale(FOAF.name, req.body.name)
            .addStringNoLocale(FOAF.mbox, req.body.email)
            .addDatetime(DCTERMS.issued, new Date())
            .addUrl(`${user}#hasUserType`, `${user}#Member`)
            .addUrl(`${user}#dataSource`, req.body.dataSource)
            .build();

        solidDataset = setThing(solidDataset, newMember);
        await saveGivenSolidDataset(membersList, solidDataset, session);
    },

    addThirdParty: async function (req, session) {

        let solidDataset = await getGivenSolidDataset(thirdPartiesList, session);
        const newThirdParty = buildThing(createThing({ url: req.body.webID }))
            .addUrl(RDF.type, `${user}#User`)
            .addStringNoLocale(FOAF.mbox, req.body.email)
            .addStringNoLocale(FOAF.name, req.body.name)
            .addDatetime(DCTERMS.issued, new Date())
            .addUrl(`${user}#hasUserType`, `${user}#ThirdParty`)
            .addUrl("https://w3id.org/dpv#Organisation", `https://w3id.org/dpv#${req.body.org}`)
            .addStringNoLocale(DCTERMS.description, req.body.description)
            .build();

        solidDataset = setThing(solidDataset, newThirdParty);
        await saveGivenSolidDataset(thirdPartiesList, solidDataset, session);
    },

    addAdmin: async function (req, session) {

        let solidDataset = await getGivenSolidDataset(adminsList, session);
        const newAdmin = buildThing(createThing({ url: req.body.webID }))
            .addUrl(RDF.type, `${user}#User`)
            .addStringNoLocale(FOAF.mbox, req.body.email)
            .addDatetime(DCTERMS.issued, new Date())
            .addStringNoLocale(FOAF.name, req.body.name)
            .addUrl(`${user}#hasUserType`, `${user}#Admin`)
            .build();

        solidDataset = setThing(solidDataset, newAdmin);
        await saveGivenSolidDataset(adminsList, solidDataset, session);
    },

    getUser: async function (req, session) {
        let datasetURL = getDatasetUrl(req.type);
        const solidDataset = await getGivenSolidDataset(datasetURL, session);
        const user = getThing(solidDataset, req.webID);
        return user;
    },

    updateUser: async function (req, session) {
        const datasetURL = getDatasetUrl(req.body.datasetURL);
        let solidDataset = await getGivenSolidDataset(datasetURL, session);
        let projectToUpdate = getThing(solidDataset, req.body.webID);
        if (req.body.name) {
            projectToUpdate = buildThing(projectToUpdate)
                .setStringNoLocale(FOAF.name, req.body.name)
                .build();
        }
        if (req.body.email) {
            projectToUpdate = buildThing(projectToUpdate)
                .setStringNoLocale(FOAF.mbox, req.body.email)
                .build();
        }
        if (req.body.orgType) {
            projectToUpdate = buildThing(projectToUpdate)
                .setUrl(`https://w3id.org/dpv#Organisation`, `https://w3id.org/dpv#${req.body.orgType}`)
                .build();
        }
        if (req.body.dataSource && req.body.sessionID) {
            oldDataSource = getUrl(projectToUpdate, `${user}#dataSource`);
            if (oldDataSource !== undefined) {
                this.removeData(oldDataSource, session);
                projectToUpdate = buildThing(projectToUpdate)
                    .setUrl(`${user}#dataSource`, req.body.dataSource)
                    .build();
            }

        }
        if (req.body.description) {
            projectToUpdate = buildThing(projectToUpdate)
                .setStringNoLocale(DCTERMS.description, req.body.description)
                .build();
        }

        solidDataset = setThing(solidDataset, projectToUpdate);
        await saveGivenSolidDataset(datasetURL, solidDataset, session);
    },

    getMemberCount: async function (date, session) {
        const datasetUrl = membersList;
        const solidDataset = await getGivenSolidDataset(datasetUrl, session);
        const users = getThingAll(solidDataset);
        const filteredUsers = users.filter(user => {
            return new Date(user.predicates[DCTERMS.issued]["literals"]["http://www.w3.org/2001/XMLSchema#dateTime"][0]) <= new Date(date);
        });
        return filteredUsers.length + 1;
    },

    getWebIDs: async function (session) {
        const datasetUrl = membersList;
        const solidDataset = await getGivenSolidDataset(datasetUrl, session);
        const users = getThingAll(solidDataset);
        const webIDs = users.map(user => user.url);
        return webIDs;
    },

    addNewData: async function (fileURL, appSession, userSession) {
        try {
            const fileHash = await Transformer.hashFileURL(fileURL.trim(), process.env.SECRET);
            const file = await getFile(fileURL, { fetch: userSession.fetch });
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const csvText = new TextDecoder().decode(data);
            const updatedCsvText = Transformer.addColumnToCSV(csvText, fileHash);

            const existingFile = await getFile(resourceURL, { fetch: appSession.fetch });
            const existingArrayBuffer = await existingFile.arrayBuffer();
            const existingData = new Uint8Array(existingArrayBuffer);
            const existingCsvText = new TextDecoder().decode(existingData);

            const appendedCsvText = existingCsvText + "\n" + updatedCsvText;
            const appendedData = new TextEncoder().encode(appendedCsvText);
            const savedFile = await overwriteFile(
                resourceURL,
                appendedData,
                { contentType: "text/csv", fetch: appSession.fetch }
            );
            console.log("Data added successfully.");
        } catch (error) {
            console.error(error);
            if (error.message === 'Fetching the File failed: [403] [Forbidden] {"description":"HTTP 403 Forbidden"}.') {
                throw new Error("You do not have permission to access this file.");
            }
            else {
                throw new Error(error.message);
            }
        }
    },

    addAsDataSubect: async function (webID, session) {
        // when new member joins or leaves
        let solidDataset = await getGivenSolidDataset(agreementsList, session);
        let agreements = getThingAll(solidDataset);
        agreements.forEach(async (agreement) => {
            agreement = buildThing(agreement)
                .setUrl(`${dpv}#hasDataSubject`, webID)
                .build();
            solidDataset = setThing(solidDataset, projectToUpdate);
            await saveGivenSolidDataset(datasetURL, solidDataset, session);
        });
        console.log("Added data subject successfully.");
    },

    removeAsDataSubect: async function (webID, session) {
        // when new member joins or leaves
        let solidDataset = await getGivenSolidDataset(agreementsList, session);
        let agreements = getThingAll(solidDataset);
        agreements.forEach(async (agreement) => {
            agreement = removeUrl(agreement, `${dpv}#hasDataSubject`, webID);
            await saveGivenSolidDataset(agreementsList, solidDataset, session);
        });
        console.log("Removed data subject successfully.");
    },

    removeData: async function (fileURL, session) {
        try {
            let fileHash = await Transformer.hashFileURL(fileURL, process.env.SECRET);
            fileHash = fileHash.trim();
            const file = await getFile(
                resourceURL,
                { fetch: session.fetch }
            );
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const csvText = new TextDecoder().decode(data);
            const rows = csvText.split('\n');
            const matchingRowIndices = [];
            for (let i = 0; i < rows.length; i++) {
                const columns = rows[i].split(',');
                if (columns.length < 3) continue;
                const identifier = columns[2];
                if (identifier.trim() === fileHash) {
                    matchingRowIndices.push(i);
                }
            }
            if (matchingRowIndices.length > 0) {
                for (let i = matchingRowIndices.length - 1; i >= 0; i--) {
                    const matchingRowIndex = matchingRowIndices[i];
                    rows.splice(matchingRowIndex, 1);
                }
                const updatedCsvText = rows.join('\n');
                const updatedData = new TextEncoder().encode(updatedCsvText);
                const savedFile = await overwriteFile(
                    resourceURL,
                    updatedData,
                    { contentType: "text/csv", fetch: session.fetch }
                );
                console.log("Data found and removed.");
            } else {
                console.log("No data found.");
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    },

    removeMember: async function (webID, session) {
        if (webID === null) {
            throw new Error("Policy not found.");
        }
        else {
            let solidDataset = await getGivenSolidDataset(membersList, session);
            const member = getThing(solidDataset, webID);
            solidDataset = removeThing(solidDataset, member);
            await saveGivenSolidDataset(membersList, solidDataset, session);
            console.log("Member removed successfully.")
        }
    },
}