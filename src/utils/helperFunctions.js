export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function chooseRandomActors(randomActor, randomIndex, results) {
    let otherPeople = [];
    for (let i = 0; i < 4; i++) {
        let randNumber = 0;
        do {
            randNumber = Math.floor(Math.random() * 19);
        } while (
            randomActor.gender !== results[randNumber].gender ||
            randNumber === randomIndex ||
            otherPeople.includes(results[randNumber].name)
        );
        otherPeople.push(results[randNumber].name);
    }
    otherPeople.push(randomActor.name);
    return otherPeople;
}