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
    const johnMarker = useRef<maplibregl.Marker | null>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);


    useEffect(() => {
        if (!mapContainer.current || map.current) {
            return;
        }

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

                if (world.people.length > 0 && johnMarker.current) {
                    const john = world.people[0];

                    johnMarker.current.setLngLat([
                        john.currentLocation.longitude,
                        john.currentLocation.latitude
                    ]);

                    johnMarker.current.setPopup(
                        new maplibregl.Popup().setHTML(`
                            <strong>${john.name}</strong>
                            <br />
                            Status: ${john.status}
                        `)
                    );
                }

                console.log("World:", world);

                map.current?.on("load", () => {
                    for (const location of world.locations) {
                        new maplibregl.Marker()
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
                            .addTo(map.current!);
                    }

                    for (const person of world.people) {
                        johnMarker.current = new maplibregl.Marker()
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
                            .addTo(map.current!);
                    }
                });
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
