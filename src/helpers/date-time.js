function msToHHMM(ms) {
    const dateTimeObject = new Date(ms);
    const hours = dateTimeObject.getHours().toString(10).padStart(2, '0');
    const minutes = dateTimeObject.getMinutes().toString(10).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export {
    msToHHMM,
};
