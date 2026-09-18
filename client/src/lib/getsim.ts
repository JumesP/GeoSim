

export async function getWorld() {
    const response = await fetch(
        "http://localhost:3001/api/world",
        {
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch GeoSim world"
        );
    }

    return response.json();
}
