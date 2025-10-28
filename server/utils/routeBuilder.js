function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Гаверсинус: расстояние между двумя координатами
function haversineDistance(p1, p2) {
    const R = 6371; // радиус Земли в км
    const dLat = toRadians(p2.latitude - p1.latitude);
    const dLon = toRadians(p2.longitude - p1.longitude);
    const lat1 = toRadians(p1.latitude);
    const lat2 = toRadians(p2.latitude);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Азимут: направление от p1 к p2
function calculateBearing(p1, p2) {
    const lat1 = toRadians(p1.latitude);
    const lat2 = toRadians(p2.latitude);
    const dLon = toRadians(p2.longitude - p1.longitude);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);

    return (toDegrees(bearing) + 360) % 360;
}

// Разность углов (минимальная, с учётом круга)
function angleDifference(a1, a2) {
    const diff = Math.abs(a1 - a2) % 360;
    return diff > 180 ? 360 - diff : diff;
}

// Основной алгоритм построения маршрута
function buildRoute(A, B, hubs, maxAngle = 15) {
    const route = [A];
    let current = A;
    let remainingHubs = [...hubs];

    while (true) {
        const bearingToB = calculateBearing(current, B);
        let candidates = remainingHubs.filter(hub => {
            const distToHub = haversineDistance(current, hub);
            const distHubToB = haversineDistance(hub, B);
            const bearingToHub = calculateBearing(current, hub);
            const angle = angleDifference(bearingToB, bearingToHub);

            return distToHub < distHubToB && angle <= maxAngle;
        });

        if (candidates.length === 0) break;

        // Выбрать ближайший подходящий хаб
        candidates.sort((a, b) =>
            haversineDistance(current, a) - haversineDistance(current, b)
        );

        const nextHub = candidates[0];
        route.push(nextHub);
        remainingHubs = remainingHubs.filter(h => h !== nextHub);
        current = nextHub;
    }

    route.push(B);
    return route;
}

module.exports = {
    buildRoute,
}