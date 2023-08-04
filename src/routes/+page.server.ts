import { error, type Load } from '@sveltejs/kit';

import { MODEL_URL } from '$env/static/private';

export const load: Load = async () => {
    return {
        modelURL: MODEL_URL
    };
};
