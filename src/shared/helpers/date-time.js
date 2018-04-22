function msToHHMM(ms) {
    const dateTimeObject = new Date(ms);
    const hours = `0${dateTimeObject.getHours().toString(10)}`.slice(-2);
    const minutes = `0${dateTimeObject.getMinutes().toString(10)}`.slice(-2);

    return `${hours}:${minutes}`;
}

export {
    msToHHMM,
};
