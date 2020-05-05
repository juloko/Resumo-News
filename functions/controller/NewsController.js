const crypto = require('crypto')

const { Datastore } = require('@google-Xcloud/datastore');

const { getFrom, getTranslationToEn, sanitizeNews, getSummarize,
    getHashtags, getReTranslation, getReferenciate, buildCaption } = require('..robots/text')


const datastore = new Datastore();

module.exports = {
    async create(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Credentials', 'true'); // vital
        res.set('Access-Control-Max-Age', '3600');

        let someURL = req.body.someURL || req.query.someURL;
        let lang = req.body.lang || req.query.lang;
        let hosts = Object.keys(listFilter)

        let bundleNews = await getFrom(someURL);
        if (hosts.includes(bundleNews.host)) {
            let { translatedText, detectedSourceLanguage } = await getTranslationToEn(bundleNews.news);
            bundleNews.news = sanitizeNews(translatedText, bundleNews.host)
            let gringoSummary = await getSummarize(bundleNews.news);
            let gringoHashtags = await getHashtags(bundleNews.news);
            let reference = await getReTranslation(getReferenciate(bundleNews.host), lang);
            let summary = await getReTranslation(gringoSummary, lang);
            let hashtags = await getReTranslation(gringoHashtags, lang);

            bundleNews.langNews = detectedSourceLanguage;
            bundleNews.langCaption = lang;
            bundleNews.caption = buildCaption(summary, reference, hashtags);
            res.json(bundleNews)
            res.locals.bundleNews = bundleNews;
            return next();
        }
        else {
            bundleNews.error = 'This host is not available in this application.'
            res.send(bundleNews);
        }
    },

    async save(req, res, next) {
        console.log('save in DB');
        // if (res.statusCode === 200) {
        //     let bundleNews = res.locals.bundleNews;
        //     bundleNews.timestamp = new Date().toJSON();

        //     try {
        //         await datastore.save({
        //             key: datastore.key('news'),
        //             data: bundleNews
        //         });
        //         console.log(`Task ${taskKey.id} created successfully.`);
        //         return res.end()

        //     } catch (err) {
        //         console.error('ERROR:', err);
        //         return res.end()
        //     }
        // }
    },

    async index(req, res, next) {
        // const { page = 1 } = req.query;

        // const count = await connection('incidents').count().first();

        // const incidents = await connection('incidents')
        //     .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        //     .limit(5)
        //     .offset((page - 1) * 5)
        //     .select(
        //         'incidents.*',
        //         'ongs.name',
        //         'ongs.email',
        //         'ongs.whatsapp',
        //         'ongs.city',
        //         'ongs.uf');

        // res.header('X-Total-Count', count['count(*)']);

        // return res.json(incidents);
    },

    async delete(req, res, next) {
        //     const { id } = req.params;
        //     const ong_id = req.headers.authorization;


        //     const incidents = await connection('incidents')
        //         .where('id', id)
        //         .select('ong_id')
        //         .first();

        //     if (!incidents) {
        //         return res.status(404).json({ error: 'Was not found that incident.' });
        //     } else if (incidents.ong_id !== ong_id) {
        //         return res.status(401).json({ error: 'Operation not permitted.' });
        //     } else {
        //         await connection('incidents')
        //             .where('id', id)
        //             .delete();

        //         return res.status(204).send();
        //     }
    }
}