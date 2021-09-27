import amplitude from 'amplitude-js';

const createAmpltiudeInstance = () => {
    const instance = amplitude.getInstance();

    instance.init('55477baea93c5227d8c0f6b813653615', '', {
        apiEndpoint: 'amplitude.nav.no/collect',
        saveEvents: false,
        includeUtm: true,
        batchEvents: false,
        includeReferrer: true
    });

    return instance;
}


export default <amplitude.AmplitudeClient>{
        logEvent: (event: string, data?: any) => {
            console.log(`${event}: ${JSON.stringify(data)}`, {event, data})
        },
        setUserProperties:(userProps:object) => {
            console.log(`set userprops: ${JSON.stringify(userProps)}`)
        }
};