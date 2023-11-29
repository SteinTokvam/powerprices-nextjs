import { makeList } from '../../../util/powerUtil';

export default async function handler(req, res) {
    const { zone, hasPassed, until } = req.query;
    const result = await makeList(zone, hasPassed, until);
    if(result.status) {
        res.status(result.status).json({ message: result.message });
    }
    res.json(result.prices);
}



