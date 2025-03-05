const getNextSunday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    nextSunday.setHours(12, 0, 0, 0);
    return nextSunday.toISOString().split(".")[0];
};

const getHost = () => {
    const today = new Date();
    const week = today.getMonth();
    if (week % 4 === 0) {
        return "M";
    } else if (week % 4 === 1) {
        return "Z";
    } else if (week % 4 === 2) {
        return "S";
    } else {
        return "K";
    }
};

const getFullHostName = (initial) => {
    switch(initial){
        case "Z":
            return "Zegarów nr 17";
        case "S":
            return "Zegarów nr 17a"; 
        case "M":
            return "Miczków";
        case "K":
            return "Krakowskich";   
    }
}

export {getHost, getNextSunday, getFullHostName};