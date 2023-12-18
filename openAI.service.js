const { Configuration, OpenAIApi } = require("openai");

const dotenv = require("dotenv");
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const listModels = async () => {
    try {
        const { data } = await openai.listModels();
        return data;
    } catch (err) {
        return err;
    }
};

module.exports = {
    openai,
};
