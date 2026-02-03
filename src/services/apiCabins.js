import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabinOrPayload, id = null) {
  // Support two call shapes:
  // 1) createEditCabin(newCabin) — used by `useCreateCabin`
  // 2) createEditCabin(newCabinData, id) — used by `useEditCabin`
  // 3) createEditCabin({ newCabinData, id }) — possible mutate payload
  let newCabin = newCabinOrPayload;

  if (
    newCabinOrPayload &&
    typeof newCabinOrPayload === "object" &&
    "newCabinData" in newCabinOrPayload
  ) {
    newCabin = newCabinOrPayload.newCabinData;
    id = newCabinOrPayload.id;
  }

  // If `id` was accidentally passed an options/context object (from mutate),
  // treat it as no id (create case).
  if (typeof id === "object" && id !== null) id = null;

  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    "",
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");

  // If `id` is a number -> EDIT, otherwise -> CREATE
  if (typeof id === "number") {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  } else {
    query = query.insert([{ ...newCabin, image: imagePath }]);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created",
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
