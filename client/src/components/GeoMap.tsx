"use client";
import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type WorldLocation = {
    id: string;
    name: string;
    type: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
};

type Person = {
    id: string;
    name: string;
    age: number;
    currentLocation: {
        latitude: number;
        longitude: number;
    };
    status: string;
    profilePicture?: string;
};

type World = {
    time: string;
    speed: number;
    people: Person[];
    locations: WorldLocation[];
};

export default function GeoMap() {
    const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
    const [simulationTime, setSimulationTime] = useState<Date | null>(null);
    const personMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
    const locationMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || map.current) {
            return;
        }

        const style = document.createElement("style");

        style.innerHTML = `
            @keyframes geosim-pulse {
                0% {
                    transform: scale(0.7);
                    opacity: 0.8;
                }

                70% {
                    transform: scale(1.4);
                    opacity: 0;
                }

                100% {
                    transform: scale(1.4);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);

        const loadWorld = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3001/api/world"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch world");
                }

                const world: World = await response.json();

                setSimulationTime(new Date(world.time));
                setSimulationSpeed(world.speed);

                if (!map.current) {
                    return;
                }


                /*
                * LOCATIONS
                */
                for (const location of world.locations) {
                    if (locationMarkers.current.has(location.id)) {
                        continue;
                    }

                    const marker = new maplibregl.Marker()
                        .setLngLat([
                            location.coordinate.longitude,
                            location.coordinate.latitude
                        ])
                        .setPopup(
                            new maplibregl.Popup().setHTML(`
                                <strong>${location.name}</strong>
                                <br />
                                ${location.type}
                            `)
                        )
                        .addTo(map.current);

                    locationMarkers.current.set(
                        location.id,
                        marker
                    );
                }


                /*
                * PEOPLE
                */
                for (const person of world.people) {
                    let marker = personMarkers.current.get(person.id);

                    if (!marker) {
                        const element = document.createElement("div");

                        // First person is currently treated as the user
                        const isUser = person.id === world.people[0].id;

                        if (isUser) {
                            element.innerHTML = `
                                <div style="
                                    position: relative;
                                    width: 60px;
                                    height: 60px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                ">
                                    <!-- Pulsing location ring -->
                                    <div style="
                                        position: absolute;
                                        width: 60px;
                                        height: 60px;
                                        border-radius: 50%;
                                        background: rgba(59, 130, 246, 0.18);
                                        animation: geosim-pulse 2s ease-out infinite;
                                    "></div>

                                    <!-- Profile picture -->
                                    <div style="
                                        position: relative;
                                        width: 42px;
                                        height: 42px;
                                        border-radius: 50%;
                                        border: 3px solid white;
                                        background: #3b82f6;
                                        overflow: hidden;
                                        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                                        z-index: 2;
                                    ">
                                        ${
                                            person.profilePicture
                                                ? `
                                                    <img
                                                        src="${person.profilePicture}"
                                                        alt="${person.name}"
                                                        style="
                                                            width: 100%;
                                                            height: 100%;
                                                            object-fit: cover;
                                                        "
                                                    />
                                                `
                                                : `
                                                    <div style="
                                                        width: 100%;
                                                        height: 100%;
                                                        display: flex;
                                                        align-items: center;
                                                        justify-content: center;
                                                        color: white;
                                                        font-weight: bold;
                                                        font-size: 18px;
                                                    ">
                                                        ${person.name.charAt(0)}
                                                    </div>
                                                `
                                        }
                                    </div>
                                </div>
                            `;
                        } else {
                            element.innerHTML = `
                                <div style="
                                    width: 32px;
                                    height: 32px;
                                    border-radius: 50%;
                                    background: #ef4444;
                                    border: 3px solid white;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                                "></div>
                            `;
                        }

                        marker = new maplibregl.Marker({
                            element
                        })
                            .setLngLat([
                                person.currentLocation.longitude,
                                person.currentLocation.latitude
                            ])
                            .setPopup(
                                new maplibregl.Popup().setHTML(`
                                    <strong>${person.name}</strong>
                                    <br />
                                    Status: ${person.status}
                                `)
                            )
                            .addTo(map.current);

                        personMarkers.current.set(
                            person.id,
                            marker
                        );
                    } else {
                        marker.setLngLat([
                            person.currentLocation.longitude,
                            person.currentLocation.latitude
                        ]);

                        marker.getPopup()?.setHTML(`
                            <strong>${person.name}</strong>
                            <br />
                            Status: ${person.status}
                        `);
                    }
                }

                /*
                * REMOVE PEOPLE THAT NO LONGER EXIST
                */

                const currentPersonIds = new Set(
                    world.people.map(person => person.id)
                );

                for (const [id, marker] of personMarkers.current) {
                    if (!currentPersonIds.has(id)) {
                        marker.remove();
                        personMarkers.current.delete(id);
                    }
                }

                console.log("World:", world);
            } catch (error) {
                console.error(
                    "Failed to load world:",
                    error
                );
            }
        };

        maplibregl.setWorkerUrl(
            "/maplibre-gl-worker.mjs"
        );

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: [-0.7594, 52.0406],
            zoom: 13
        });

        map.current.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );

        map.current.on("load", () => {
            loadWorld();
        });

        loadWorld();

        const interval = setInterval(() => {
            loadWorld();
        }, 1000);

        return () => {
            clearInterval(interval);

            map.current?.remove();
            map.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-150 rounded-2xl overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-black/75 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-gray-400">
                    Simulation Time
                </p>

                <p className="text-2xl font-mono font-bold">
                    {simulationTime
                        ? simulationTime.toLocaleTimeString(
                            "en-GB",
                            {
                                timeZone: "Europe/London",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit"
                            }
                        )
                        : "--:--:--"}
                </p>
            </div>

            <div
                ref={mapContainer}
                className="w-full h-full"
            />
        </div>
    );
}
