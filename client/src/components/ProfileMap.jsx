import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { getAllOrdersDeliveryPoints, getOrdersRoutes } from "../http/deliveryPointsAPI.js";

const ProfileMap = ({ orderId }) => {

    const [orderDeliveryPoints, setOrderDeliveryPoints] = useState([]);
    const [routes, setRoutes] = useState(null);

    const [routeCoordsFinished, setRouteCoordsFinished] = useState([]);
    const [routeCoordsFuture, setRouteCoordsFuture] = useState([]);

    useEffect(() => {
        if (!orderId) return;

        const fetchDeliveryPoints = async () => {
            const data = await getAllOrdersDeliveryPoints(orderId);
            setOrderDeliveryPoints(data);
        };

        const fetchRoutes = async () => {
            const data = await getOrdersRoutes(orderId);
            setRoutes(data);
        };

        setRouteCoordsFinished([]);
        setRouteCoordsFuture([]);

        fetchDeliveryPoints();
        fetchRoutes();
    }, [orderId]);

    useEffect(() => {
        if (!routes || !routes.finishedRoutePoints || !routes.futureRoutePoints) return;

        const fetchRouteCoords = async () => {
            try {
                // Finished route
                if (routes.finishedRoutePoints.length > 1) {
                    const coordinatesFinished = routes.finishedRoutePoints.map(c => `${c.longitude},${c.latitude}`).join(';');
                    const url1 = `https://router.project-osrm.org/route/v1/driving/${coordinatesFinished}?overview=full&geometries=geojson`;
                    const res1 = await fetch(url1);
                    const data1 = await res1.json();
                    if (data1.routes?.length) {
                        const coords = data1.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
                        setRouteCoordsFinished(coords);
                    }
                }

                // Future route
                if (routes.futureRoutePoints.length > 1) {
                    const coordinatesFuture = routes.futureRoutePoints.map(c => `${c.longitude},${c.latitude}`).join(';');
                    const url2 = `https://router.project-osrm.org/route/v1/driving/${coordinatesFuture}?overview=full&geometries=geojson`;
                    const res2 = await fetch(url2);
                    const data2 = await res2.json();
                    if (data2.routes?.length) {
                        const coords = data2.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
                        setRouteCoordsFuture(coords);
                    }
                }
            } catch (err) {
                console.error('Ошибка при построении маршрута:', err);
            }
        };

        fetchRouteCoords();
    }, [routes]);

    return (
        <MapContainer center={[60, 60]} zoom={3} style={{ height: '100%', minHeight: '450px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />

            {orderDeliveryPoints.map((point, i) => (
                <Marker key={i} position={[point.latitude, point.longitude]}>
                    <Popup>{point.address}</Popup>
                </Marker>
            ))}

            {routeCoordsFinished.length > 0 && (
                <Polyline positions={routeCoordsFinished} pathOptions={{ color: 'green', weight: 5 }} />
            )}
            {routeCoordsFuture.length > 0 && (
                <Polyline positions={routeCoordsFuture} pathOptions={{ color: 'red', weight: 5 }} />
            )}
        </MapContainer>
    );
};

export default ProfileMap;