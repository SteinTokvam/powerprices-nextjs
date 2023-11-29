import axios from 'axios';

function lagPrisUrl(dato, zone) {
    const year = dato.getFullYear();
    const month = (dato.getMonth() + 1).toString().padStart(2, '0'); // Legger til nuller foran hvis det er nødvendig
    const day = dato.getDate().toString().padStart(2, '0'); // Legger til nuller foran hvis det er nødvendig

    return `https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_${zone}.json`;
}

function hentStrompriser(date, zone) {
    const url = lagPrisUrl(date, zone);
    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            console.error('Feil ved henting av strømpriser:', error);
            return [];
        });
}

export async function makeList(zone, hasPassed, until) {
    try {
        const prices = await hentStrompriser(new Date(), zone);
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
        const pricesTomorrow = await hentStrompriser(tomorrow, zone);
        const allPrices = [...prices, ...pricesTomorrow];

        if (allPrices.length > 0) {
            const pricesNOK = allPrices
            .filter(price => price.NOK_per_kWh)
            .filter(price => {
                if(hasPassed === 'true') {
                    return new Date(price.time_start) > new Date()
                }
                if(until != null){
                    return new Date(price.time_start) <= until
                }
                return true
            })
            .map(price => ({
                from: price.time_start,
                to: price.time_end,
                price_nok: price.NOK_per_kWh,
                zone: price.time_start ? zone : null
            }));

            return { prices: pricesNOK };
        } else {
            return { status: 404, message: 'Ingen priser tilgjengelig for i dag.' };
        }
    } catch (error) {
        console.error('Feil ved henting av strømpriser:', error);
        return { status: 500, message: 'Klarte ikke hente priser. Prøv igjen senere.' };
    }
}