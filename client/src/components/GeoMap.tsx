"use client";
import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type WorldLocation = {
    id: string;
    name: string;
    type: "home" | "work" | "shop" | "restaurant" | "park" | "gym" | "school";
    coordinate: {
        latitude: number;
        longitude: number;
    };
};

type PersonLocation = {
    locationId: string;
    relationship:
        | "home"
        | "work"
        | "favourite"
        | "regular";
};

type Person = {
    id: string;
    name: string;
    age: number;
    profilePicture?: string;

    currentLocation: {
        latitude: number;
        longitude: number;
    };

    status: string;

    locations: PersonLocation[];
};

type World = {
    time: string;
    speed: number;
    people: Person[];
    locations: WorldLocation[];
};

function getLocationIcon(
    relationship: PersonLocation["relationship"],
    type: WorldLocation["type"]
): string {
    switch (relationship) {
        case "home":
            return "🏠";

        case "work":
            return "💼";

        case "favourite":
            if (type === "shop") return "☕";
            if (type === "restaurant") return "🍴";
            if (type === "park") return "🌳";
            if (type === "gym") return "🏋️";

            return "⭐";

        case "regular":
            return "📍";

        default:
            return "📍";
    }
}

export default function GeoMap() {
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
    const [simulationTime, setSimulationTime] = useState<Date | null>(null);
    const [world, setWorld] = useState<World | null>(null);
    const personMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
    const locationMarkers = useRef<Map<string, maplibregl.Marker>>(new Map());
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const selectPerson = (person: Person) => {
        const isSelected =
            selectedPersonId === person.id;

        setSelectedPersonId(
            isSelected ? null : person.id
        );

        if (!isSelected && map.current) {
            map.current.flyTo({
                center: [
                    person.currentLocation.longitude,
                    person.currentLocation.latitude
                ],
                zoom: 15,
                duration: 800
            });
        }
    };

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

                setWorld(world);
                setSimulationTime(new Date(world.time));
                setSimulationSpeed(world.speed);

                if (!map.current) {
                    return;
                }

                /*
                * PEOPLE
                */
                for (const person of world.people) {
                    let marker = personMarkers.current.get(person.id);

                    if (!marker) {
                        const element = document.createElement("div");

                        element.innerHTML = `
                            <div class="person-marker">
                                <div class="person-marker-pulse"></div>

                                <div class="person-marker-image">
                                    ${
                                        person.profilePicture
                                            ? `
                                                <img
                                                    src="${person.profilePicture}"
                                                    alt="${person.name}"
                                                />
                                            `
                                            : `
                                                <div class="person-marker-initial">
                                                    ${person.name.charAt(0)}
                                                </div>
                                            `
                                    }
                                </div>
                            </div>
                        `;

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

                        element.addEventListener("click", () => {
                            selectPerson(person);
                        });

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

    useEffect(() => {
        if (!map.current || !world) {
            return;
        }

        const selectedPerson = world.people.find(
            person => person.id === selectedPersonId
        );

        const selectedLocationIds = new Set(
            selectedPerson?.locations.map(
                location => location.locationId
            ) ?? []
        );

        for (const location of world.locations) {
            const shouldShow =
                selectedLocationIds.has(location.id);

            const existingMarker =
                locationMarkers.current.get(location.id);

            // Find this person's relationship with this location
            const personLocation =
                selectedPerson?.locations.find(
                    personLocation =>
                        personLocation.locationId === location.id
                );

            // Show selected person's location
            if (shouldShow && !existingMarker) {
                const element = document.createElement("div");

                const icon = getLocationIcon(
                    personLocation?.relationship ?? "regular",
                    location.type
                );

                element.innerHTML = `
                    <div class="location-marker">
                        <div class="location-marker-icon">
                            ${icon}
                        </div>

                        <div class="location-marker-label">
                            ${location.name}
                        </div>
                    </div>
                `;

                const marker = new maplibregl.Marker({
                    element,
                    anchor: "bottom"
                })
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

            // Hide locations belonging to previous selection
            if (!shouldShow && existingMarker) {
                existingMarker.remove();

                locationMarkers.current.delete(
                    location.id
                );
            }
        }
    }, [selectedPersonId, world]);

    useEffect(() => {
        for (const person of world?.people ?? []) {
            const marker =
                personMarkers.current.get(person.id);

            if (!marker) {
                continue;
            }

            const markerContent =
                marker
                    .getElement()
                    .querySelector(".person-marker");

            if (!markerContent) {
                continue;
            }

            markerContent.classList.toggle(
                "selected",
                person.id === selectedPersonId
            );
        }
    }, [selectedPersonId, world]);

    return (
        <div className="relative w-full h-150 rounded-2xl overflow-hidden">

            {/* Simulation Time */}
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


            {/* People Sidebar */}
            <div className="
                absolute
                top-4
                right-4
                z-10
                w-72
                max-h-[calc(100%-2rem)]
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-black/20
                backdrop-blur-xl
                shadow-2xl
                text-white
            ">

                {/* Header */}
                <div className="px-4 py-3 border-b border-white/10">
                    <h2 className="text-lg font-semibold">
                        People
                    </h2>

                    <p className="text-xs text-white/50">
                        {world?.people.length ?? 0} people
                    </p>
                </div>


                {/* People */}
                <div className="max-h-150 overflow-y-auto">

                    {world?.people.map((person) => (
                        <button
                            key={person.id}
                            type="button"
                            className={`
                                w-full
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                text-left
                                transition
                                ${selectedPersonId === person.id
                                    ? "bg-white/15"
                                    : "hover:bg-white/10"
                                }
                            `}
                            onClick={() => selectPerson(person)}
                        >

                            {/* Profile Picture */}
                            <div className="
                                w-10
                                h-10
                                shrink-0
                                overflow-hidden
                                rounded-full
                                border-2
                                border-white/80
                                bg-blue-500
                            ">
                                {person.profilePicture ? (
                                    <img
                                        src={person.profilePicture}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="
                                        w-full
                                        h-full
                                        flex
                                        items-center
                                        justify-center
                                        font-semibold
                                    ">
                                        {person.name.charAt(0)}
                                    </div>
                                )}
                            </div>


                            {/* Person Info */}
                            <div className="min-w-0 flex-1">

                                <p className="font-medium truncate">
                                    {person.name}
                                </p>

                                <div className="flex items-center gap-2">

                                    <span className="
                                        w-2
                                        h-2
                                        rounded-full
                                        bg-green-400
                                        shrink-0
                                    " />

                                    <p className="
                                        text-sm
                                        text-white/60
                                        capitalize
                                        truncate
                                    ">
                                        {person.status.replace("_", " ")}
                                    </p>

                                </div>

                            </div>


                            {/* Arrow */}
                            <span className="
                                text-white/40
                                text-xl
                            ">
                                ›
                            </span>

                        </button>
                    ))}

                </div>

            </div>


            {/* Map */}
            <div
                ref={mapContainer}
                className="relative z-0 w-full h-full"
            />

        </div>
    );
}
