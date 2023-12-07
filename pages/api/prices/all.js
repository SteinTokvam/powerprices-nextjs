import { makeList } from '../../../util/powerUtil';

export default async function handler(req, res) {
    const { zone } = req.query;
        const result = await (makeList(zone, false, new Date(new Date().setDate(new Date().getDate() + 2))));
        if(result.status) {
            res.status(result.status).json({ message: result.message });
        }
        res.json(result.prices);
}