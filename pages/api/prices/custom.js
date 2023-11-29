import { makeList } from '../../../util/powerUtil';

export default async function handler(req, res) {
    const { zone, hasPassed, until } = req.body;
    console.log(req.body)
    const result = await makeList(zone, hasPassed === 'true', until);
    if(result.status) {
        res.status(result.status).json({ message: result.message });
    }
    res.json(result.prices);
}



