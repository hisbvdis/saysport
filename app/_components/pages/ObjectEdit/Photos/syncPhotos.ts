import type { UIObject, ProcessedDBObject } from "@/app/_types/db";


export const syncPhotos = async (objectId:ProcessedDBObject["object_id"], state:UIObject, init:UIObject) => {
  const photosToDelete = (init.photos && init.photos?.length > 0) ? init.photos.filter((initPhoto) => !state.photos?.some((statePhoto) => statePhoto.uiID === initPhoto.uiID)) : [];
  const photosToUpload = (state.photos && state.photos?.length > 0) ? state.photos.filter((statePhoto) => !init.photos?.some((initPhoto) => initPhoto.uiID === statePhoto.uiID) && statePhoto.file) : [];

  // 1. First — delete photos
  if (photosToDelete && photosToDelete.length > 0) {
    const formData = new FormData();
    photosToDelete.forEach(({name}) => {
      formData.append("name", name);
    });
    await fetch("/api/photos", { method: "DELETE", body: formData });
  }

  // 2. Upload new photos after deleting old ones
  if (photosToUpload && photosToUpload.length > 0) {
    photosToUpload.forEach(async (photo) => {
      const formData = new FormData();
      if (!photo.file) return;
      formData.append("file", photo.file);
      formData.append("name", photo.name.replace("ID", String(objectId)));
      await fetch("/api/photos", { method: "POST", body: formData });
    });
  }
}
