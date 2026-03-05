export async function getCoordinatesFromSearch(
  searchWord: string,
): Promise<null | { lng: number; lat: number }> {
  try {
    const response = await fetch(
      `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(searchWord)}`,
    );
    const data = await response.json();
    if (Array.isArray(data?.features)) {
      const bestEntry = data.features.find(
        (entry: { geometry?: { coordinates?: number[] } }) =>
          entry.geometry?.coordinates?.length === 2,
      );
      if (bestEntry) {
        return {
          lng: bestEntry.geometry.coordinates[0],
          lat: bestEntry.geometry.coordinates[1],
        };
      }
    }
  } catch (err) {
    console.error(`🆘 got an error:`, err);
  }
  return null;
}
