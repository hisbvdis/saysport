export const usageReadProcessing = (dbData:DBSection):UISection => {
  return {
    ...dbData,
    specs: dbData.sectionOnSpec?.map(({spec}) => specReadProcessing(spec)) ?? [],
    usages: dbData.sectionOnUsage?.map(({usage}) => sectionReadProcessing(usage)) ?? [],
    uiID: crypto.randomUUID()
  }
}