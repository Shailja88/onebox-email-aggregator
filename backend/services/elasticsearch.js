const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });

const indexEmail = async (email) => {
    await esClient.index({
        index: 'emails',
        body: email
    });
};

const searchEmails = async (query) => {
    const { body } = await esClient.search({
        index: 'emails',
        body: {
            query: {
                match: { body: query }
            }
        }
    });
    return body.hits.hits;
};

module.exports = { indexEmail, searchEmails };
