import { API_URL, LIMIT_PER_PAGE, Response } from '../const';

export default async ( tag, page=1 ) => {
    let result = [];
    if ( tag.length ) {
        const apiUrl = API_URL.replace ( '{Q}', tag ).replace ( '{OFFSET}', page*LIMIT_PER_PAGE );
        try {
            const response = await fetch ( apiUrl );
            if ( response.status === Response.OK ) {
                result = await response.json();
            }
        }
        catch ( e ) {
            console.log ( e );
        }
    }
    return result.data || [];
}
